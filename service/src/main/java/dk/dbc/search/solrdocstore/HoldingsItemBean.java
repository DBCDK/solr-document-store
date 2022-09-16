package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import dk.dbc.search.solrdocstore.request.HoldingsItemEntityRequest;
import dk.dbc.search.solrdocstore.request.HoldingsItemEntitySchemaAnnotated;
import dk.dbc.search.solrdocstore.request.HoldingsItemIndexKeysRequest;
import java.sql.SQLException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import static dk.dbc.log.LogWith.track;
import static java.util.Collections.EMPTY_SET;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);

    private static final Marshaller MARSHALLER = new Marshaller();

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @Inject
    BibliographicRetrieveBean brBean;

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @PUT
    @Path("{agencyId : \\d+}-{bibliographicRecordId}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public StatusResponse putHoldings(String jsonContent,
                                      @PathParam("agencyId") int agencyId,
                                      @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                      @QueryParam("trackingId") String trackingId) throws SQLException, JsonProcessingException {
        if (trackingId == null)
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = track(trackingId)) {
            logWith.agencyId(agencyId).bibliographicRecordId(bibliographicRecordId);

            log.info("Update holdings: {}/{}", agencyId, bibliographicRecordId);
            HoldingsItemIndexKeysRequest request = MARSHALLER.unmarshall(jsonContent, HoldingsItemIndexKeysRequest.class);
            IndexKeysList indexKeys = request.indexKeys;
            if (indexKeys == null || indexKeys.isEmpty()) {
                throw new BadRequestException("Cannot send empty index-keys list in PUT - use DELETE");
            }
            AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
            HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);

            EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();

            if (entity == null) {
                log.trace("create");
                entity = new HoldingsItemEntity(agencyId, bibliographicRecordId, indexKeys, trackingId);
                entityManager.persist(entity);

                queueRelatedBibliographic(entity, enqueue,
                                          QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                          QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                          QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);

                h2bBean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, enqueue,
                                                         QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                                         QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                                         QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
            } else {
                log.trace("update");
                Set<String> oldLocations = entity.getLocations();
                entity.setIndexKeys(indexKeys);
                entityManager.merge(entity);
                Set<String> newLocations = entity.getLocations();

                if (oldLocations.equals(newLocations)) {
                    queueRelatedBibliographic(entity, enqueue,
                                              QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                } else {
                    queueRelatedBibliographic(entity, enqueue,
                                              QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                              QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING,
                                              QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING);
                }
            }

            enqueue.commit();
            return new StatusResponse();
        }
    }

    @DELETE
    @Path("{agencyId : \\d+}-{bibliographicRecordId}")
    @Timed
    public StatusResponse deleteHoldings(@PathParam("agencyId") int agencyId,
                                         @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                         @QueryParam("trackingId") String trackingId) throws SQLException {
        if (trackingId == null)
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = track(trackingId)) {
            logWith.agencyId(agencyId).bibliographicRecordId(bibliographicRecordId);

            log.info("Delete holdings: {}/{}", agencyId, bibliographicRecordId);

            AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
            HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);
            if (entity != null) {
                EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();
                HoldingsToBibliographicKey h2bKey = new HoldingsToBibliographicKey(agencyId, bibliographicRecordId);
                HoldingsToBibliographicEntity binding = entityManager.find(HoldingsToBibliographicEntity.class, h2bKey);
                if (binding != null) {
                    log.trace("binding = {} - enqueue", binding);
                    queueRelatedBibliographic(entity, enqueue,
                                              QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                              QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                              QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
                    entityManager.remove(binding);
                }
                entityManager.remove(entity);
                enqueue.commit();
            }
            return new StatusResponse();
        }
    }

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    @Operation(
            operationId = "set-holdings",
            summary = "set holdingsitems solr documents",
            description = "This operation sets the holdingsitems and connect" +
                          " them to a bibliographic item, if possible.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Holdings has been added",
                     ref = StatusResponse.NAME),
        @APIResponse(name = "Bad Request",
                     responseCode = "400",
                     description = "Holdings has NOT been added - invalid or missing parameters",
                     ref = StatusResponse.NAME),
        @APIResponse(name = "Internal Server Error",
                     responseCode = "500",
                     description = "Holdings has NOT been added - this really shouldn't happen",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = HoldingsItemEntitySchemaAnnotated.NAME)
    public Response setHoldingsKeys(String jsonContent) throws JsonProcessingException {

        HoldingsItemEntityRequest hi = MARSHALLER.unmarshall(jsonContent, HoldingsItemEntityRequest.class);
        if (hi.getTrackingId() == null)
            hi.setTrackingId(UUID.randomUUID().toString());
        try (LogWith logWith = track(hi.getTrackingId())) {
            if (hi.getAgencyId() == 0 ||
                hi.getBibliographicRecordId() == null ||
                hi.getIndexKeys() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new StatusResponse("Missing or invalid required parameters"))
                        .build();
            }

            setHoldingsKeys(hi.asHoldingsItemEntity());

            return Response.ok(new StatusResponse()).build();
        } catch (SQLException | RuntimeException ex) {
            log.error("setHoldingsKeys error: {}", ex.getMessage());
            log.debug("setHoldingsKeys error: ", ex);
            String message = null;
            Throwable tw = ex;
            while (tw != null && message == null) {
                message = tw.getMessage();
                tw = tw.getCause();
            }
            return Response.serverError()
                    .entity(new StatusResponse(message))
                    .build();
        }
    }

    public void setHoldingsKeys(HoldingsItemEntity hi) throws SQLException {
        EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();

// TODO rewrite to .find()
        List<HoldingsItemEntity> his = entityManager.createQuery("SELECT h FROM HoldingsItemEntity h WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", HoldingsItemEntity.class)
                .setParameter("agency", hi.getAgencyId())
                .setParameter("bibId", hi.getBibliographicRecordId())
                .getResultList();
        boolean hadLiveHoldings = !his.isEmpty();
        boolean hasLiveHoldings = !hi.getIndexKeys().isEmpty();
        Set<String> oldLocations = his.isEmpty() ? EMPTY_SET : his.get(0).getLocations();

        log.info("Updating holdings for {}:{}", hi.getAgencyId(), hi.getBibliographicRecordId());
        if (!hadLiveHoldings && !hasLiveHoldings) { // No holdings before or now
            log.debug("No holdings before or now");
        } else if (hadLiveHoldings != hasLiveHoldings && hasLiveHoldings) { // holdings existence change -> exists
            entityManager.merge(hi);
            h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue,
                                                     QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                                     QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING,
                                                     QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING,
                                                     QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                                     QueueType.FIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
        } else if (hadLiveHoldings != hasLiveHoldings && hadLiveHoldings) { // holdings existence change -> none
            entityManager.remove(his.get(0)); // Remove existing
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(hi.getAgencyId(), hi.getBibliographicRecordId());
            HoldingsToBibliographicEntity binding = entityManager.find(HoldingsToBibliographicEntity.class, key);
            if (binding != null) {
                entityManager.remove(binding);
                queueRelatedBibliographic(binding, enqueue,
                                          QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                          QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING,
                                          QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING,
                                          QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                          QueueType.FIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
            }
        } else if (!oldLocations.equals(hi.getLocations())) { // holdings accessibility change
            entityManager.merge(hi);
            queueRelatedBibliographic(hi, enqueue,
                                      QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                      QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING,
                                      QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING);
        } else {
            entityManager.merge(hi);
            queueRelatedBibliographic(hi, enqueue,
                                      QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
        }
        enqueue.commit();
    }

    private void queueRelatedBibliographic(HoldingsItemEntity hi, EnqueueCollector enqueue, QueueType... queues) {
        HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(hi.getAgencyId(), hi.getBibliographicRecordId());
        HoldingsToBibliographicEntity binding = entityManager.find(HoldingsToBibliographicEntity.class, key);
        if (binding != null) {
            queueRelatedBibliographic(binding, enqueue, queues);
        }
    }

    private void queueRelatedBibliographic(HoldingsToBibliographicEntity binding, EnqueueCollector enqueue, QueueType... queues) {
        BibliographicEntity e = brBean.getBibliographicEntity(binding.getBibliographicAgencyId(),
                                                              binding.getBibliographicRecordId());
        if (e != null && !e.isDeleted()) {
            enqueue.add(e, queues);
        }
    }

    private Query generateRelatedHoldingsQuery(String bibliographicRecordId, int bibliographicAgencyId) {
        Query query = entityManager.createNativeQuery(
                "select * " +
                "from holdingsitemssolrkeys  " +
                "where (agencyid,bibliographicrecordid) " +
                "IN ( select holdingsagencyid,bibliographicRecordId " +
                "FROM holdingstobibliographic h2b " +
                "where h2b.bibliographicagencyid = ? " +
                "and h2b.bibliographicrecordid = ?)",
                HoldingsItemEntity.class);
        query.setParameter(1, bibliographicAgencyId);
        query.setParameter(2, bibliographicRecordId);
        return query;
    }

    public List<HoldingsItemEntity> getRelatedHoldings(String bibliographicRecordId, int bibliographicAgencyId) {
        return generateRelatedHoldingsQuery(bibliographicRecordId, bibliographicAgencyId).getResultList();
    }

    public List<HoldingsItemEntity> getRelatedHoldingsWithIndexKeys(String bibliographicRecordId, int bibliographicAgencyId) {
        return generateRelatedHoldingsQuery(bibliographicRecordId, bibliographicAgencyId)
                .setHint("javax.persistence.loadgraph", entityManager.getEntityGraph("holdingItemsWithIndexKeys"))
                .getResultList();
    }
}
