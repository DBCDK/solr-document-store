package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static dk.dbc.search.solrdocstore.LibraryConfig.RecordType.SingleRecord;
@Stateless
@Path("bibliographic")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    LibraryConfig libraryConfig;

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBibliographicKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        BibliographicEntityRequest request = jsonbContext.unmarshall(jsonContent, BibliographicEntityRequest.class);
        addBibliographicKeys(request.asBibliographicEntity(), request.superceds);
        return Response.ok().entity("{ \"ok\": true }").build();
    }

    public List<BibliographicEntity> getBibliographicEntities(String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("bibId",bibliographicRecordId).getResultList();
    }

    public void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> superceds){

        log.info("AddBibliographicKeys called {}:{}", bibliographicEntity.agencyId, bibliographicEntity.bibliographicRecordId);

        BibliographicEntity dbbe = entityManager.find(BibliographicEntity.class, new AgencyItemKey(bibliographicEntity.agencyId, bibliographicEntity.bibliographicRecordId), LockModeType.PESSIMISTIC_WRITE);
        if (dbbe == null) {
            entityManager.merge(bibliographicEntity.asBibliographicEntity());
            updateHoldingsToBibliographic(bibliographicEntity.agencyId, bibliographicEntity.bibliographicRecordId);
        } else {
            log.info("AddBibliographicKeys - Updating existing entity");
            // If we delete or re-create, related holdings must be moved appropriately
            if(bibliographicEntity.deleted != dbbe.deleted){
                log.info("AddBibliographicKeys - Delete or recreate, going from {} -> {}",dbbe.deleted,bibliographicEntity.deleted);
                // We must flush since the tryAttach looks at the deleted field
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
                entityManager.flush();
                List<HoldingsToBibliographicEntity> relatedHoldings = (bibliographicEntity.deleted) ?
                        h2bBean.getRelatedHoldingsToBibliographic(dbbe.agencyId,dbbe.bibliographicRecordId) :
                        h2bBean.findRecalcCandidates(dbbe.bibliographicRecordId);
                for (HoldingsToBibliographicEntity relatedHolding : relatedHoldings){
                    h2bBean.tryToAttachToBibliographicRecord(
                            relatedHolding.holdingsAgencyId,
                            relatedHolding.holdingsBibliographicRecordId);
                }
            } else {
                // Simple update
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
            }
        }

        Set<String> supersededRecordIds = updateSuperceded(bibliographicEntity.bibliographicRecordId, superceds);
        if (supersededRecordIds.size()>0){
            h2bBean.recalcAttachments(bibliographicEntity.bibliographicRecordId,supersededRecordIds);
        }
    }

    /*
     *
     */
    private void updateHoldingsToBibliographic(int agency, String recordId) {
        if (libraryConfig.getRecordType(agency) == SingleRecord) {
            updateHoldingsSingleRecord(agency, recordId);
        } else {
            updateHoldingsForCommonRecords(agency, recordId);
        }
    }

    private void updateHoldingsForCommonRecords(int agency, String recordId) {
        TypedQuery<Integer> query = entityManager.createQuery("SELECT h.agencyId FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId", Integer.class);
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
            addHoldingsToBibliographic(agency, recordId, holdingsAgency);
        }
    }

    private void updateHoldingsSingleRecord(int agency, String recordId) {
        TypedQuery<Long> query = entityManager.createQuery("SELECT count(h.agencyId) FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", Long.class);
        query.setParameter("agency", agency);
        query.setParameter("bibId", recordId);

        if (query.getSingleResult() > 0) {
            addHoldingsToBibliographic(agency, recordId, agency);
        }
    }

    private void addHoldingsToBibliographic(int agency, String recordId, Integer holdingsAgency) {
        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                holdingsAgency, recordId,agency
        );
        entityManager.merge(h2b);
    }

    private Set<String> updateSuperceded(String bibliographicRecordId, List<String> supercededs) {
        if (supercededs == null) {
            return Collections.EMPTY_SET;
        }
        HashSet<String> changedBibliographicRecordIds = new HashSet<>();
        for (String superceded : supercededs) {
            BibliographicToBibliographicEntity b2b = entityManager.find(BibliographicToBibliographicEntity.class, superceded, LockModeType.PESSIMISTIC_WRITE);
            if (b2b == null) {
                b2b = new BibliographicToBibliographicEntity();
                b2b.deadBibliographicRecordId = superceded;
                b2b.liveBibliographicRecordId = bibliographicRecordId;
            } else {
                if (b2b.liveBibliographicRecordId.equals(bibliographicRecordId)) {
                    continue;
                }
                b2b.liveBibliographicRecordId = bibliographicRecordId;
            }
            entityManager.merge(b2b);
            changedBibliographicRecordIds.add(superceded);
        }
        return changedBibliographicRecordIds;
    }

}
