package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicToBibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.log.LogWith;
import java.sql.SQLException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static dk.dbc.log.LogWith.track;
import static dk.dbc.search.solrdocstore.RecordType.SingleRecord;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

@Stateless
@Path("bibliographic")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);
    private static final ObjectMapper O = new ObjectMapper();

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    OpenAgencyBean openAgency;

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @Inject
    BibliographicRetrieveBean brBean;

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    /**
     * Add bibliographic SolR keys and reorganize related holdings
     * <p>
     * It enqueues all affected documents, fx. if a holding has been moved from
     * another bibliographic record to this.
     * <p>
     * If skipQueue is set to true, then don't add the record to the queue,
     * unless, holdings has been moved (ie. if only this record is to be queued
     * then don't queue it). This is usefull if you have added a new fiels to
     * the SolR keys, that the current systems doesn't know about. So that from
     * their perspective nothing has changed. This is to avoid unnecessary load
     * on the downstream systems.
     *
     * @param skipQueue   Don't queue unless necessary
     * @param jsonContent The json request (see
     *                    {@link BibliographicEntityRequest})
     * @return Json with ok: true/false
     * @throws JSONBException          JSON cannot be parsed
     * @throws JsonProcessingException JSON cannot be created
     */
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
    public Response addBibliographicKeys(@QueryParam("skipQueue") @DefaultValue("false") boolean skipQueue,
                                         String jsonContent) throws JSONBException, JsonProcessingException {

        BibliographicEntityRequest request = jsonbContext.unmarshall(jsonContent, BibliographicEntityRequest.class);
        if (request.getTrackingId() == null)
            request.setTrackingId(UUID.randomUUID().toString());
        try (LogWith logWith = track(request.getTrackingId())
                .pid(request.getRepositoryId())) {
            if (request.getIndexKeys() == null && !request.isDeleted()) {
                log.warn("Got a request which wasn't deleted but had no indexkeys");
                return Response.status(BAD_REQUEST).entity("{ \"ok\": false, \"error\": \"You must have indexKeys when deleted is false\" }").build();
            }
            addBibliographicKeys(request.asBibliographicEntity(), request.getSupersedes(), !skipQueue);
            return Response.ok().entity("{ \"ok\": true }").build();
        } catch (SQLException | RuntimeException ex) {
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
            err.put("intermittent", ex instanceof IntermittentErrorException);
            err.put("message", message);
            return Response.serverError().entity(O.writeValueAsString(err)).build();
        }
    }

    void addBibliographicKeys(BibliographicEntity bibliographicEntity, List<String> supersedes, boolean queueAll) throws SQLException {
        EnqueueCollector enqueue = queueAll ? enqueueSupplier.getEnqueueCollector() : EnqueueCollector.VOID;

        if (bibliographicEntity.getClassifier() == null) {
            throw new IllegalStateException("classifier is not set");
        }

        log.info("AddBibliographicKeys called {}-{}:{}", bibliographicEntity.getAgencyId(), bibliographicEntity.getClassifier(), bibliographicEntity.getBibliographicRecordId());

        BibliographicEntity dbbe = entityManager.find(BibliographicEntity.class, bibliographicEntity.asAgencyClassifierItemKey(), LockModeType.PESSIMISTIC_WRITE);
        if (dbbe == null) {
            if (!queueAll && !bibliographicEntity.isDeleted()) {
                // A new record, should not respect the skipQueue flag
                enqueue = enqueueSupplier.getEnqueueCollector();
            }
            enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.WORK);
            entityManager.merge(bibliographicEntity.asBibliographicEntity());
            updateHoldingsToBibliographic(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId(), enqueue);
            // Record creates queue even id said not to
        } else {
            log.info("AddBibliographicKeys - Updating existing entity");

            Instant dbTime = extractFedoraStreamDate(dbbe);
            Instant reqTime = extractFedoraStreamDate(bibliographicEntity);
            if (reqTime != null && dbTime != null && dbTime.isAfter(reqTime)) {
                log.warn("Cannot update to an older stream date: pid = {}-{}:{}, request.repositoryId = {}, database.repositoryId = {}, database.time = {}, request.time = {}",
                         bibliographicEntity.getAgencyId(), bibliographicEntity.getClassifier(), bibliographicEntity.getBibliographicRecordId(),
                         bibliographicEntity.getRepositoryId(), dbbe.getRepositoryId(), dbTime, reqTime);
                throw new IntermittentErrorException("Cannot update to an older stream date");
            }
            // If we delete or re-create, related holdings must be moved appropriately
            if (bibliographicEntity.isDeleted() != dbbe.isDeleted()) {
                if (!queueAll) {
                    // The record, changed delete status - should not respect the skipQueue flag
                    enqueue = enqueueSupplier.getEnqueueCollector();
                }
                // If incoming bib entity is deleted, we mark it as delete so the enqueue adapter
                // will delay the queue job, to prevent race conditions with updates to this same
                // bib entity
                if (bibliographicEntity.isDeleted()) {
                    if (bibliographicEntity.getAgencyId() == LibraryType.COMMON_AGENCY) {
                        deleteSuperseded(bibliographicEntity.getBibliographicRecordId());
                    }
                    enqueue.add(dbbe, QueueType.MANIFESTATION_DELETED, QueueType.WORK);
                } else {
                    enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.WORK);
                }
                log.info("AddBibliographicKeys - Delete or recreate, going from {} -> {}", dbbe.isDeleted(), bibliographicEntity.isDeleted());
                // We must flush since the tryAttach looks at the deleted field
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
                entityManager.flush();

                List<HoldingsToBibliographicEntity> relatedHoldings =
                        bibliographicEntity.isDeleted() ?
                        h2bBean.getRelatedHoldingsToBibliographic(dbbe.getAgencyId(), dbbe.getBibliographicRecordId()) :
                        h2bBean.findRecalcCandidates(dbbe.getBibliographicRecordId());
                for (HoldingsToBibliographicEntity relatedHolding : relatedHoldings) {
                    h2bBean.tryToAttachToBibliographicRecord(relatedHolding.getHoldingsAgencyId(), relatedHolding.getHoldingsBibliographicRecordId(), enqueue, QueueType.MANIFESTATION);
                }
            } else {
                // Going from deleted to deleted shouldn't result in queue jobs
                if (!bibliographicEntity.isDeleted()) {
                    enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.WORK);
                }
                // Simple update
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
            }
        }

        if (bibliographicEntity.getAgencyId() == LibraryType.COMMON_AGENCY && !bibliographicEntity.isDeleted()) {
            Set<String> supersededRecordIds = updateSuperseded(bibliographicEntity.getBibliographicRecordId(), supersedes);
            if (supersededRecordIds.size() > 0) {
                h2bBean.recalcAttachments(bibliographicEntity.getBibliographicRecordId(), supersededRecordIds, enqueue, QueueType.MANIFESTATION);
            }
        }
        enqueue.commit();
    }

    private Instant extractFedoraStreamDate(BibliographicEntity entity) {
        if (entity == null)
            return null;
        Map<String, List<String>> indexKeys = entity.getIndexKeys();
        if (indexKeys == null)
            return null;
        List<String> dates = indexKeys.get("rec.fedoraStreamDate");
        if (dates == null || dates.size() != 1)
            return null;
        return Instant.parse(dates.get(0));
    }

    /*
     *
     */
    private void updateHoldingsToBibliographic(int agency, String recordId, EnqueueCollector enqueue) {
        if (openAgency.getRecordType(agency) == SingleRecord) {
            updateHoldingsSingleRecord(agency, recordId, enqueue);
        } else {
            updateHoldingsForCommonRecords(agency, recordId, enqueue);
        }
    }

    private void updateHoldingsForCommonRecords(int agency, String recordId, EnqueueCollector enqueue) {
        TypedQuery<Integer> query = entityManager.createQuery("SELECT h.agencyId FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId", Integer.class);
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
            addHoldingsToBibliographic(agency, recordId, holdingsAgency, enqueue, QueueType.MANIFESTATION);

        }
    }

    private void updateHoldingsSingleRecord(int agency, String recordId, EnqueueCollector enqueue) {
        if (openAgency.lookup(agency).getLibraryType() == LibraryType.NonFBS) {
            TypedQuery<Long> query = entityManager.createQuery("SELECT count(h.agencyId) FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", Long.class);
            query.setParameter("agency", agency);
            query.setParameter("bibId", recordId);

            if (query.getSingleResult() > 0) {
                addHoldingsToBibliographic(agency, recordId, agency, enqueue, QueueType.MANIFESTATION);
            }
        } else {
            TypedQuery<String> superseded = entityManager.createQuery(
                    "SELECT b.deadBibliographicRecordId FROM BibliographicToBibliographicEntity b" +
                    " WHERE b.liveBibliographicRecordId = :bibId", String.class);
            superseded.setParameter("bibId", recordId);
            List<String> allIds = new ArrayList<>(superseded.getResultList());
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
            holdingsItems.forEach(holdingsItem ->
                    addHoldingsToBibliographic(agency, holdingsItem, agency, recordId, enqueue, QueueType.MANIFESTATION, QueueType.WORK)
            );
        }
    }

    private void addHoldingsToBibliographic(int agency, String recordId, int holdingsAgency, EnqueueCollector enqueue, QueueType... enqueueSources) {
        addHoldingsToBibliographic(agency, recordId, holdingsAgency, recordId, enqueue, enqueueSources);
    }

    private void addHoldingsToBibliographic(int agency, String recordId, int holdingsAgency, String bibliographicRecordId, EnqueueCollector enqueue, QueueType... enqueueSources) {
        LibraryType libraryType = openAgency.lookup(holdingsAgency).getLibraryType();
        boolean isCommonDerived = libraryType == LibraryType.FBS && h2bBean.bibliographicEntityExists(agency, bibliographicRecordId);
        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                holdingsAgency, recordId, agency, bibliographicRecordId, isCommonDerived
        );
        h2bBean.attachToAgency(h2b, enqueue, enqueueSources);
    }

    private void deleteSuperseded(String bibliographicRecordId) {
        List<BibliographicToBibliographicEntity> resultList =
                entityManager.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity AS b2b" +
                                          " WHERE b2b.liveBibliographicRecordId = :bibliographicRecordId",
                                          BibliographicToBibliographicEntity.class)
                        .setParameter("bibliographicRecordId", bibliographicRecordId)
                        .getResultList();
        for (BibliographicToBibliographicEntity b2b : resultList) {
            String deadBibliographicRecordId = b2b.getDeadBibliographicRecordId();
            log.info("Removing reference from dead bibliographicrecordid({}) to this", deadBibliographicRecordId);
            entityManager.remove(b2b);
        }
    }

    private Set<String> updateSuperseded(String bibliographicRecordId, List<String> supersededs) {
        if (supersededs == null) {
            return Collections.emptySet();
        }
        HashSet<String> changedBibliographicRecordIds = new HashSet<>();
        for (String superseded : supersededs) {
            BibliographicToBibliographicEntity b2b = entityManager.find(BibliographicToBibliographicEntity.class, superseded, LockModeType.PESSIMISTIC_WRITE);
            if (b2b == null) {
                b2b = new BibliographicToBibliographicEntity(superseded, bibliographicRecordId);
            } else {
                if (b2b.getLiveBibliographicRecordId().equals(bibliographicRecordId)) {
                    continue;
                }
                b2b.setLiveBibliographicRecordId(bibliographicRecordId);
            }
            entityManager.merge(b2b);
            changedBibliographicRecordIds.add(superseded);
        }
        return changedBibliographicRecordIds;
    }
}
