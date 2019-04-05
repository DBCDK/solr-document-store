package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.ee.stats.Timed;
import dk.dbc.log.LogWith;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.log.LogWith.track;
import static dk.dbc.search.solrdocstore.RecordType.SingleRecord;

@Stateless
@Path("bibliographic")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);
    private static final ObjectMapper O = new ObjectMapper();

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    OpenAgencyBean openAgency;

    @Inject
    EnqueueSupplierBean queue;

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @Inject
    BibliographicRetrieveBean brBean;

    @Inject
    EnqueueAdapter enqueueAdapter;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response addBibliographicKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        try {
            BibliographicEntityRequest request = jsonbContext.unmarshall(jsonContent, BibliographicEntityRequest.class);
            try (LogWith logWith = track(request.getTrackingId())) {
                addBibliographicKeys(request.asBibliographicEntity(), request.getSuperceds(), Optional.ofNullable(request.getCommitWithin()));
                return Response.ok().entity("{ \"ok\": true }").build();
            }
        } catch (RuntimeException ex) {
            log.error("addBibliographicKeys error: {}", ex.getMessage());
            log.debug("addBibliographicKeys error: ", ex);
            String message = null;
            Throwable tw = ex;
            while (tw != null && message == null) {
                message = tw.getMessage();
                tw = tw.getCause();
            }
            ObjectNode err = O.createObjectNode();
            err.put("ok", false);
            err.put("message", message);
            return Response.serverError().entity(O.writeValueAsString(err)).build();
        }
    }

    void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> superceds) {
        addBibliographicKeys(bibliographicEntity, superceds, Optional.empty());
    }

    void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> superceds, Optional<Integer> commitWithin) {
        Set<AgencyClassifierItemKey> affectedKeys = new HashSet<>();

        if (bibliographicEntity.getClassifier() == null) {
            throw new IllegalStateException("classifier is not set");
        }

        log.info("AddBibliographicKeys called {}-{}:{}", bibliographicEntity.getAgencyId(), bibliographicEntity.getClassifier(), bibliographicEntity.getBibliographicRecordId());

        BibliographicEntity dbbe = entityManager.find(BibliographicEntity.class, bibliographicEntity.asAgencyClassifierItemKey(), LockModeType.PESSIMISTIC_WRITE);
        if (dbbe == null) {
            affectedKeys.add(bibliographicEntity.asAgencyClassifierItemKey());
            entityManager.merge(bibliographicEntity.asBibliographicEntity());
            Set<AgencyClassifierItemKey> updatedHoldings = updateHoldingsToBibliographic(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId());
            affectedKeys.addAll(updatedHoldings);
        } else {
            log.info("AddBibliographicKeys - Updating existing entity");
            // If we delete or re-create, related holdings must be moved appropriately
            if (bibliographicEntity.isDeleted() != dbbe.isDeleted()) {
                // TODO mark as delete
                AgencyClassifierItemKey key = bibliographicEntity.asAgencyClassifierItemKey();
                key.setDeleteMarked(true);
                affectedKeys.add(key);
                log.info("AddBibliographicKeys - Delete or recreate, going from {} -> {}", dbbe.isDeleted(), bibliographicEntity.isDeleted());
                // We must flush since the tryAttach looks at the deleted field
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
                entityManager.flush();
                List<HoldingsToBibliographicEntity> relatedHoldings = ( bibliographicEntity.isDeleted() ) ?
                                                                      h2bBean.getRelatedHoldingsToBibliographic(dbbe.getAgencyId(), dbbe.getBibliographicRecordId()) :
                                                                      h2bBean.findRecalcCandidates(dbbe.getBibliographicRecordId());
                for (HoldingsToBibliographicEntity relatedHolding : relatedHoldings) {
                    Set<AgencyClassifierItemKey> reattachedKeys =
                            h2bBean.tryToAttachToBibliographicRecord(relatedHolding.getHoldingsAgencyId(), relatedHolding.getHoldingsBibliographicRecordId());
                    affectedKeys.addAll(reattachedKeys);
                }
            } else {
                affectedKeys.add(bibliographicEntity.asAgencyClassifierItemKey());
                // Simple update
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
            }
        }

        if (bibliographicEntity.getAgencyId() == LibraryType.COMMON_AGENCY) {
            Set<String> supersededRecordIds = updateSuperceded(bibliographicEntity.getBibliographicRecordId(), superceds);
            if (supersededRecordIds.size() > 0) {
                Set<AgencyClassifierItemKey> recalculatedKeys =
                        h2bBean.recalcAttachments(bibliographicEntity.getBibliographicRecordId(), supersededRecordIds);
                affectedKeys.addAll(recalculatedKeys);
            }
        }

        enqueueAdapter.enqueueAll(queue, affectedKeys, commitWithin);
    }

    /*
     *
     */
    private Set<AgencyClassifierItemKey> updateHoldingsToBibliographic(int agency, String recordId) {
        if (openAgency.getRecordType(agency) == SingleRecord) {
            return updateHoldingsSingleRecord(agency, recordId);
        } else {
            return updateHoldingsForCommonRecords(agency, recordId);
        }
    }

    private Set<AgencyClassifierItemKey> updateHoldingsForCommonRecords(int agency, String recordId) {
        TypedQuery<Integer> query = entityManager.createQuery("SELECT h.agencyId FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId", Integer.class);
        Set<AgencyClassifierItemKey> affectedKeys = new HashSet<>();
        query.setParameter("bibId", recordId);

        TypedQuery<Integer> q = entityManager.createQuery("SELECT b.agencyId FROM BibliographicEntity b " +
                                                          "WHERE b.deleted=FALSE AND b.bibliographicRecordId = :recId", Integer.class);

        q.setParameter("recId", recordId);

        Set<Integer> bibRecords = new HashSet<>(q.getResultList());

        for (Integer holdingsAgency : query.getResultList()) {
            switch (openAgency.lookup(holdingsAgency).getLibraryType()) {
                case NonFBS: // Ignore holdings for Non FBS libraries
                    continue;
                case FBS:
                    if (agency == LibraryType.SCHOOL_COMMON_AGENCY) {
                        continue;
                    }
                    if (bibRecords.contains(holdingsAgency)) {
                        continue;
                    }
                    break;
                case FBSSchool:
                    if (agency == LibraryType.COMMON_AGENCY && bibRecords.contains(LibraryType.SCHOOL_COMMON_AGENCY)) {
                        continue;
                    }
                    if (bibRecords.contains(holdingsAgency)) {
                        continue;
                    }
                    break;
                case Missing:
                    throw new IllegalStateException("This state should not have leaked");
            }
            affectedKeys.addAll(
                    addHoldingsToBibliographic(agency, recordId, holdingsAgency)
            );

        }
        return affectedKeys;
    }

    private Set<AgencyClassifierItemKey> updateHoldingsSingleRecord(int agency, String recordId) {
        if (openAgency.lookup(agency).getLibraryType() == LibraryType.NonFBS) {
            TypedQuery<Long> query = entityManager.createQuery("SELECT count(h.agencyId) FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", Long.class);
            query.setParameter("agency", agency);
            query.setParameter("bibId", recordId);

            if (query.getSingleResult() > 0) {
                return addHoldingsToBibliographic(agency, recordId, agency);
            }
        } else {
            HashSet<AgencyClassifierItemKey> ret = new HashSet<>();

            TypedQuery<String> superceeded = entityManager.createQuery(
                    "SELECT b.deadBibliographicRecordId FROM BibliographicToBibliographicEntity b" +
                    " WHERE b.liveBibliographicRecordId = :bibId", String.class);
            superceeded.setParameter("bibId", recordId);
            List<String> allIds = new ArrayList<String>(superceeded.getResultList());
            allIds.add(recordId);

            TypedQuery<String> query = entityManager.createQuery(
                    "SELECT h.bibliographicRecordId FROM HoldingsItemEntity h" +
                    " WHERE h.agencyId = :agency" +
                    " AND h.bibliographicRecordId IN :allIds",
                    String.class);
            query.setParameter("agency", agency);
            query.setParameter("allIds", allIds);
            List<String> holdingsItems = query.getResultList();

            if (holdingsItems.size() >= 2) {
                log.info("Strange: {}:{} has multiple holdings ({}) pointing to it (002/b2b issue?)", agency, recordId, holdingsItems);
            }
            for (String holdingsItem : holdingsItems) {
                ret.addAll(addHoldingsToBibliographic(agency, holdingsItem, agency, recordId));
            }
            return ret;
        }
        return Collections.emptySet();
    }

    private Set<AgencyClassifierItemKey> addHoldingsToBibliographic(int agency, String recordId, int holdingsAgency) {
        return addHoldingsToBibliographic(agency, recordId, holdingsAgency, recordId);
    }

    private Set<AgencyClassifierItemKey> addHoldingsToBibliographic(int agency, String recordId, int holdingsAgency, String bibliographicRecordId) {
        LibraryType libraryType = openAgency.lookup(holdingsAgency).getLibraryType();
        boolean isCommonDerived = libraryType == LibraryType.FBS && h2bBean.bibliographicEntityExists(agency, bibliographicRecordId);
        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                holdingsAgency, recordId, agency, bibliographicRecordId, isCommonDerived
        );
        return h2bBean.attachToAgency(h2b);
    }

    private Set<String> updateSuperceded(String bibliographicRecordId, List<String> supercededs) {
        if (supercededs == null) {
            return Collections.emptySet();
        }
        HashSet<String> changedBibliographicRecordIds = new HashSet<>();
        for (String superceded : supercededs) {
            BibliographicToBibliographicEntity b2b = entityManager.find(BibliographicToBibliographicEntity.class, superceded, LockModeType.PESSIMISTIC_WRITE);
            if (b2b == null) {
                b2b = new BibliographicToBibliographicEntity(superceded, bibliographicRecordId);
            } else {
                if (b2b.getLiveBibliographicRecordId().equals(bibliographicRecordId)) {
                    continue;
                }
                b2b.setLiveBibliographicRecordId(bibliographicRecordId);
            }
            entityManager.merge(b2b);
            changedBibliographicRecordIds.add(superceded);
        }
        return changedBibliographicRecordIds;
    }

}
