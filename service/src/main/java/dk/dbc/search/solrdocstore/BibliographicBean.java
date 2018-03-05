package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.search.solrdocstore.monitor.Timed;
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
import javax.persistence.Query;
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

import static dk.dbc.search.solrdocstore.LibraryConfig.RecordType.SingleRecord;
@Stateless
@Path("bibliographic")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    LibraryConfig libraryConfig;

    @Inject
    EnqueueSupplierBean queue;

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response addBibliographicKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        BibliographicEntityRequest request = jsonbContext.unmarshall(jsonContent, BibliographicEntityRequest.class);
        addBibliographicKeys(request.asBibliographicEntity(), request.getSuperceds(), Optional.ofNullable(request.getCommitWithin()));
        return Response.ok().entity("{ \"ok\": true }").build();
    }

    public List<BibliographicEntity> getBibliographicEntities(String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("bibId",bibliographicRecordId).getResultList();
    }

    /**
     * Query bibliographic posts with the indexKey field set. This is necessary for the API, as the Jackson parser does
     * not use the getter, thereby not using the lazy load.
     * @param bibliographicRecordId
     * @return All bibliographic posts matching the record id
     */
    public TypedQuery<BibliographicEntity> getBibliographicEntitiesWithIndexKeys(String bibliographicRecordId,String orderBy,boolean desc) {
        String direction = (desc) ? "DESC" : "ASC";
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId ORDER BY b."+orderBy+" "+direction,BibliographicEntity.class)
                .setHint("javax.persistence.loadgraph",entityManager.getEntityGraph("bibPostWithIndexKeys"));
        return query.setParameter("bibId",bibliographicRecordId);

    }

    public long getBibliographicEntityCountById(String bibliographicRecordId){
        Query queryTotal = entityManager.createQuery
                ("SELECT COUNT(b.bibliographicRecordId) FROM BibliographicEntity b WHERE b.bibliographicRecordId = :bibId")
                .setParameter("bibId",bibliographicRecordId);
        return (long)queryTotal.getSingleResult();

    }

     void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> superceds){
        addBibliographicKeys(bibliographicEntity,superceds,Optional.empty());
    }

     void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> superceds, Optional<Integer> commitWithin){
        Set<AgencyItemKey> affectedKeys = new HashSet<>();

        log.info("AddBibliographicKeys called {}:{}", bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId());

        BibliographicEntity dbbe = entityManager.find(BibliographicEntity.class, new AgencyItemKey(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId()), LockModeType.PESSIMISTIC_WRITE);
        affectedKeys.add( new AgencyItemKey(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId()));
        if (dbbe == null) {
            entityManager.merge(bibliographicEntity.asBibliographicEntity());
            Set<AgencyItemKey> updatedHoldings = updateHoldingsToBibliographic(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId());
            affectedKeys.addAll(updatedHoldings);
        } else {
            log.info("AddBibliographicKeys - Updating existing entity");
            // If we delete or re-create, related holdings must be moved appropriately
            if(bibliographicEntity.isDeleted() != dbbe.isDeleted()){
                log.info("AddBibliographicKeys - Delete or recreate, going from {} -> {}", dbbe.isDeleted(), bibliographicEntity.isDeleted());
                // We must flush since the tryAttach looks at the deleted field
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
                entityManager.flush();
                List<HoldingsToBibliographicEntity> relatedHoldings = (bibliographicEntity.isDeleted()) ?
                        h2bBean.getRelatedHoldingsToBibliographic(dbbe.getAgencyId(), dbbe.getBibliographicRecordId()) :
                        h2bBean.findRecalcCandidates(dbbe.getBibliographicRecordId());
                for (HoldingsToBibliographicEntity relatedHolding : relatedHoldings){
                    Set<AgencyItemKey> reattachedKeys =
                            h2bBean.tryToAttachToBibliographicRecord(relatedHolding.getHoldingsAgencyId(), relatedHolding.getHoldingsBibliographicRecordId());
                    affectedKeys.addAll(reattachedKeys);
                }
            } else {
                // Simple update
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
            }
        }

        Set<String> supersededRecordIds = updateSuperceded(bibliographicEntity.getBibliographicRecordId(), superceds);
        if (supersededRecordIds.size()>0){
            Set<AgencyItemKey> recalculatedKeys =
                h2bBean.recalcAttachments(bibliographicEntity.getBibliographicRecordId(),supersededRecordIds);
            affectedKeys.addAll(recalculatedKeys);
        }

        EnqueueAdapter.enqueueAll(queue,affectedKeys, commitWithin);
    }

    /*
     *
     */
    private Set<AgencyItemKey> updateHoldingsToBibliographic(int agency, String recordId) {
        if (libraryConfig.getRecordType(agency) == SingleRecord) {
            return updateHoldingsSingleRecord(agency, recordId);
        } else {
            return updateHoldingsForCommonRecords(agency, recordId);
        }
    }

    private Set<AgencyItemKey> updateHoldingsForCommonRecords(int agency, String recordId) {
        TypedQuery<Integer> query = entityManager.createQuery("SELECT h.agencyId FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId", Integer.class);
        Set<AgencyItemKey> affectedKeys = new HashSet<>();
        query.setParameter("bibId", recordId);

        TypedQuery<Integer> q = entityManager.createQuery("SELECT b.agencyId FROM BibliographicEntity b " +
                "WHERE b.deleted=FALSE AND b.bibliographicRecordId = :recId", Integer.class);

        q.setParameter("recId", recordId);

        Set<Integer> bibRecords = new HashSet<>(q.getResultList());

        for (Integer holdingsAgency : query.getResultList()) {
            switch (libraryConfig.getLibraryType(holdingsAgency)) {
                case NonFBS: // Ignore holdings for Non FBS libraries
                    continue;
                case FBS:
                    if (agency == 300000) continue; // 300000 is only for FBSSchool records
                    if (bibRecords.contains(holdingsAgency)) continue;
                    break;
                case FBSSchool:
                    if (agency == 870970 && bibRecords.contains(300000)) continue;
                    if (bibRecords.contains(holdingsAgency)) continue;
                    break;
            }
            affectedKeys.addAll(
                    addHoldingsToBibliographic(agency, recordId, holdingsAgency)
            );

        }
        return affectedKeys;
    }

        private Set<AgencyItemKey> updateHoldingsSingleRecord(int agency, String recordId) {
        if (libraryConfig.getLibraryType(agency) == LibraryConfig.LibraryType.NonFBS) {
            TypedQuery<Long> query = entityManager.createQuery("SELECT count(h.agencyId) FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", Long.class);
            query.setParameter("agency", agency);
            query.setParameter("bibId", recordId);

            if (query.getSingleResult() > 0) {
                addHoldingsToBibliographic(agency, recordId, agency);
                return EnqueueAdapter.setOfOne(agency, recordId);
            }
        } else {
            HashSet<AgencyItemKey> ret = new HashSet<>();

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

            if(holdingsItems.size() >= 2) {
                log.info("Strange: {}:{} has multiple holdings ({}) pointing to it (002/b2b issue?)", agency, recordId, holdingsItems);
            }
            for (String holdingsItem : holdingsItems) {
                ret.addAll(addHoldingsToBibliographic(agency, holdingsItem, agency, recordId));
            }
            return ret;
        }
        return Collections.emptySet();
    }

    private Set<AgencyItemKey> addHoldingsToBibliographic(int agency, String recordId, Integer holdingsAgency) {
        return addHoldingsToBibliographic(agency, recordId, holdingsAgency, recordId);
    }

    private Set<AgencyItemKey> addHoldingsToBibliographic(int agency, String recordId, Integer holdingsAgency, String bibliographicRecordId) {
        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                holdingsAgency, recordId, agency, bibliographicRecordId
        );
        return h2bBean.attachToAgency(h2b);
    }

//    private Set<AgencyItemKey> updateHoldingsSingleRecord(int agency, String recordId) {
//        TypedQuery<Long> query = entityManager.createQuery("SELECT count(h.agencyId) FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", Long.class);
//        query.setParameter("agency", agency);
//        query.setParameter("bibId", recordId);
//
//        if (query.getSingleResult() > 0) {
//            addHoldingsToBibliographic(agency, recordId, agency);
//            return EnqueueAdapter.setOfOne(agency,recordId);
//        }
//        return Collections.emptySet();
//    }
//
//    private Set<AgencyItemKey> addHoldingsToBibliographic(int agency, String recordId, Integer holdingsAgency) {
//        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
//                holdingsAgency, recordId,agency
//        );
//        return h2bBean.attachToAgency(h2b);
//
//    }

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
