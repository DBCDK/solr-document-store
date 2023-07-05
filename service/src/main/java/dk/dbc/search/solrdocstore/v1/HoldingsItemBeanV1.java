package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.logic.BibliographicRetrieveBean;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.logic.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.logic.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.logic.Marshaller;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import dk.dbc.search.solrdocstore.request.HoldingsItemEntityRequest;
import dk.dbc.search.solrdocstore.request.HoldingsItemIndexKeysRequest;
import java.sql.SQLException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.UUID;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("holdings")
public class HoldingsItemBeanV1 {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBeanV1.class);

    private static final Marshaller MARSHALLER = new Marshaller();

    @Inject
    public HoldingsToBibliographicBean h2bBean;

    @Inject
    public BibliographicRetrieveBean brBean;

    @Inject
    public EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

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
            putIndexKeys(agencyId, bibliographicRecordId, indexKeys, trackingId);
            return new StatusResponse();
        }
    }

    public void putIndexKeys(int agencyId, String bibliographicRecordId, IndexKeysList indexKeys, String trackingId) throws SQLException {
        AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
        HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);

        EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();

        if (entity == null) {
            log.trace("create");
            entity = new HoldingsItemEntity(agencyId, bibliographicRecordId, indexKeys, null, trackingId);
            entityManager.persist(entity);

            h2bBean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, enqueue,
                                                     QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
        } else {
            log.trace("update");
            entity.setIndexKeys(indexKeys);
            entityManager.merge(entity);

            queueRelatedBibliographic(entity, enqueue,
                                      QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
        }

        enqueue.commit();
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
                                              QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
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
    public StatusResponse postHoldings(String jsonContent,
                                       @QueryParam("trackingId") String trackingId) throws SQLException, JsonProcessingException {
        if (trackingId == null)
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = track(trackingId)) {
            HoldingsItemEntityRequest request = MARSHALLER.unmarshall(jsonContent, HoldingsItemEntityRequest.class);
            int agencyId = request.getAgencyId();
            String bibliographicRecordId = request.getBibliographicRecordId();
            logWith.agencyId(agencyId).bibliographicRecordId(bibliographicRecordId);
            log.info("Update holdings: {}/{} (POST)", agencyId, bibliographicRecordId);
            IndexKeysList indexKeys = request.getIndexKeys();
            if (indexKeys == null || indexKeys.isEmpty()) {
                return deleteHoldings(agencyId, bibliographicRecordId, trackingId);
            } else {
                putIndexKeys(agencyId, bibliographicRecordId, indexKeys, trackingId);
                return new StatusResponse();
            }
        }
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
}
