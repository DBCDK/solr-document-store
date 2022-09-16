package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.request.BibliographicEntitySchemaAnnotated;
import dk.dbc.search.solrdocstore.response.StatusResponse;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

import static dk.dbc.log.LogWith.track;
import static dk.dbc.search.solrdocstore.jpa.RecordType.SingleRecord;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

@Stateless
@Path("bibliographic")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);

    private static final Marshaller MARSHALLER = new Marshaller();

    @Inject
    Config config;

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
     *                    {@link BibliographicEntity})
     * @return Json with ok: true/false
     * @throws JsonProcessingException JSON cannot be created
     */
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    @Operation(
            operationId = "set-manifestation",
            summary = "set manifestation solr document",
            description = "This operation sets the manifestation and connect" +
                          " it to holdingsitems, if possible.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Manifestation has been added",
                     ref = StatusResponse.NAME)})
    @Parameters({
        @Parameter(name = "skipQueue",
                   description = "If this is an update of an existing document," +
                                 " the optionally skip queueing for further processing.")
    })
    @RequestBody(ref = BibliographicEntitySchemaAnnotated.NAME)
    public Response addBibliographicKeys(@QueryParam("skipQueue") @DefaultValue("false") boolean skipQueue,
                                         String jsonContent) throws JsonProcessingException {

        BibliographicEntity request = MARSHALLER.unmarshall(jsonContent, BibliographicEntity.class);
        if (request.getTrackingId() == null)
            request.setTrackingId(UUID.randomUUID().toString());
        try (LogWith logWith = track(request.getTrackingId())
                .pid(request.getRepositoryId())) {
            if (request.getIndexKeys() == null && !request.isDeleted()) {
                log.warn("Got a request which wasn't deleted but had no indexkeys");
                return Response.status(BAD_REQUEST).entity("{ \"ok\": false, \"error\": \"You must have indexKeys when deleted is false\" }").build();
            }
            addBibliographicKeys(request.asBibliographicEntity(), !skipQueue);
            return Response.ok().entity(new StatusResponse()).build();
        } catch (SQLException | RuntimeException ex) {
            log.error("addBibliographicKeys error: {}", ex.getMessage());
            log.debug("addBibliographicKeys error: ", ex);
            String message = null;
            Throwable tw = ex;
            while (tw != null && message == null) {
                message = tw.getMessage();
                tw = tw.getCause();
            }
            return Response.serverError().entity(new StatusResponse(message, ex instanceof IntermittentErrorException)).build();
        }
    }

    void addBibliographicKeys(BibliographicEntity bibliographicEntity, boolean queueAll) throws SQLException {
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
            // Going from non existing to deleted shouldn't result in queue jobs
            if (!bibliographicEntity.isDeleted()) {
                enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.UNIT, QueueType.WORK);
            }
            entityManager.merge(bibliographicEntity.asBibliographicEntity());
            if (!bibliographicEntity.isDeleted()) {
                // Only update holdings for this, if manifestation isn't deleted
                updateHoldingsToBibliographic(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId(), enqueue);
            }
            // Record creates queue even id said not to
        } else {
            log.info("AddBibliographicKeys - Updating existing entity");

            Instant dbTime = extractFedoraStreamDate(dbbe);
            Instant reqTime = extractFedoraStreamDate(bibliographicEntity);
            if (reqTime != null && dbTime != null && dbTime.isAfter(reqTime)) {
                if (dbbe.isDeleted() && dbTime.isBefore(Instant.now().minusMillis(config.getReviveOlderWhenDeletedForAtleast()))) {
                    log.warn("Updating to an older stream date: pid = {}-{}:{}, request.repositoryId = {}, database.repositoryId = {}, database.time = {}, request.time = {}",
                             bibliographicEntity.getAgencyId(), bibliographicEntity.getClassifier(), bibliographicEntity.getBibliographicRecordId(),
                             bibliographicEntity.getRepositoryId(), dbbe.getRepositoryId(), dbTime, reqTime);
                } else {
                    log.warn("Cannot update to an older stream date: pid = {}-{}:{}, request.repositoryId = {}, database.repositoryId = {}, database.time = {}, request.time = {}",
                             bibliographicEntity.getAgencyId(), bibliographicEntity.getClassifier(), bibliographicEntity.getBibliographicRecordId(),
                             bibliographicEntity.getRepositoryId(), dbbe.getRepositoryId(), dbTime, reqTime);
                    throw new IntermittentErrorException("Cannot update to an older stream date");
                }
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
                    enqueue.add(dbbe, QueueType.MANIFESTATION_DELETED, QueueType.UNIT, QueueType.WORK);
                } else {
                    enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.UNIT, QueueType.WORK);
                    updateHoldingsToBibliographic(bibliographicEntity.getAgencyId(), bibliographicEntity.getBibliographicRecordId(), enqueue);
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
                    h2bBean.tryToAttachToBibliographicRecord(relatedHolding.getHoldingsAgencyId(), relatedHolding.getBibliographicRecordId(), enqueue, QueueType.MANIFESTATION);
                }
            } else {
                // Going from deleted to deleted shouldn't result in queue jobs
                if (!bibliographicEntity.isDeleted()) {
                    enqueue.add(bibliographicEntity, QueueType.MANIFESTATION, QueueType.UNIT, QueueType.WORK);
                }
                // Simple update
                entityManager.merge(bibliographicEntity.asBibliographicEntity());
            }
        }
        enqueue.commit();
    }

    private Instant extractFedoraStreamDate(BibliographicEntity entity) {
        if (entity == null)
            return null;
        IndexKeys indexKeys = entity.getIndexKeys();
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
        HoldingsItemEntity holding = entityManager.find(HoldingsItemEntity.class, new AgencyItemKey(agency, recordId));
        if (holding != null) {
            if (openAgency.lookup(agency).getLibraryType() == LibraryType.NonFBS) {
                addHoldingsToBibliographic(agency, recordId, agency, enqueue, QueueType.MANIFESTATION);
            } else {
                addHoldingsToBibliographic(agency, agency, recordId, enqueue, QueueType.MANIFESTATION, QueueType.UNIT, QueueType.WORK);
            }
        }
    }

    private void addHoldingsToBibliographic(int agency, String recordId, int holdingsAgency, EnqueueCollector enqueue, QueueType... enqueueSources) {
        addHoldingsToBibliographic(agency, holdingsAgency, recordId, enqueue, enqueueSources);
    }

    private void addHoldingsToBibliographic(int agency, int holdingsAgency, String bibliographicRecordId, EnqueueCollector enqueue, QueueType... enqueueSources) {
        LibraryType libraryType = openAgency.lookup(holdingsAgency).getLibraryType();
        boolean isCommonDerived = libraryType == LibraryType.FBS && h2bBean.bibliographicEntityExists(agency, bibliographicRecordId);
        HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                holdingsAgency, agency, bibliographicRecordId, isCommonDerived
        );
        h2bBean.attachToAgency(h2b, enqueue, enqueueSources);
    }

}
