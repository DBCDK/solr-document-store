package dk.dbc.search.solrdocstore.v2;

import dk.dbc.holdingsitemsdocuments.bindings.HoldingsItemsDocuments;
import dk.dbc.search.solrdocstore.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.logic.BibliographicRetrieveBean;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@Path("v2/holdings")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class HoldingsItemBeanV2 {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBeanV2.class);

    @Inject
    public HoldingsToBibliographicBean h2bBean;

    @Inject
    public BibliographicRetrieveBean brBean;

    @Inject
    public EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

    @GET
    @Path("{agencyId : \\d+}-{bibliographicRecordId}")
    @Timed
    public HoldingsItemsDocuments getHoldings(@PathParam("agencyId") int agencyId,
                                              @PathParam("bibliographicRecordId") String bibliographicRecordId) throws SQLException {
        AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
        HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);
        if (entity == null) {
            throw new NotFoundException(Response.status(Response.Status.NOT_FOUND).
                    header("X-DBC-Status", "200 OK")
                    .build());
        }
        return entity.toHoldingsItemsDocuments();
    }

    @PUT
    @Path("{agencyId : \\d+}-{bibliographicRecordId}")
    @Timed
    public StatusResponse putHoldings(HoldingsItemsDocuments hid,
                                      @PathParam("agencyId") int agencyId,
                                      @PathParam("bibliographicRecordId") String bibliographicRecordId) throws SQLException {
        if (agencyId != hid.getAgencyId() ||
            !bibliographicRecordId.equals(hid.getBibliographicRecordId())) {
            throw new BadRequestException("Document doesn't match key");
        }

        try (EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector()) {
            AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
            HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);
            if (entity == null) {
                log.info("Creating holdings for {}-{}", agencyId, bibliographicRecordId);
                entity = HoldingsItemEntity.from(hid);
                entityManager.persist(entity);
                if (!entity.getIndexKeys().isEmpty()) {
                    h2bBean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, enqueue,
                                                             QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                }
            } else {
                boolean hadNoIndexKeys = entity.getIndexKeys().isEmpty();
                if (entity.update(hid)) {
                    entityManager.merge(entity);
                    if (entity.getIndexKeys().isEmpty()) {
                        log.info("Removed holdings for {}-{}", agencyId, bibliographicRecordId);
                        queueRelatedBibliographic(entity, enqueue, QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                        HoldingsToBibliographicKey h2bKey = new HoldingsToBibliographicKey(agencyId, bibliographicRecordId);
                        HoldingsToBibliographicEntity binding = entityManager.find(HoldingsToBibliographicEntity.class, h2bKey);
                        if (binding != null) {
                            entityManager.remove(binding);
                        }
                    } else if (hadNoIndexKeys) {
                        log.info("Resurrected holdings for {}-{}", agencyId, bibliographicRecordId);
                        h2bBean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, enqueue,
                                                                 QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                    } else {
                        log.info("Updated holdings for {}-{}", agencyId, bibliographicRecordId);
                        queueRelatedBibliographic(entity, enqueue, QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                    }
                }
            }
        }

        return new StatusResponse();
    }

    @DELETE
    @Path("{agencyId : \\d+}-{bibliographicRecordId}")
    @Timed
    public StatusResponse deleteHoldings(@PathParam("agencyId") int agencyId,
                                         @PathParam("bibliographicRecordId") String bibliographicRecordId
    ) throws SQLException {
        AgencyItemKey key = new AgencyItemKey(agencyId, bibliographicRecordId);
        HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, key);
        if (entity != null) {
            try (EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector()) {
                log.warn("Deleting holdings for {}-{}", agencyId, bibliographicRecordId);
                queueRelatedBibliographic(entity, enqueue, QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                HoldingsToBibliographicKey h2bKey = new HoldingsToBibliographicKey(agencyId, bibliographicRecordId);
                HoldingsToBibliographicEntity binding = entityManager.find(HoldingsToBibliographicEntity.class, h2bKey);
                if (binding != null) {
                    entityManager.remove(binding);
                }
                entityManager.remove(entity);
            }
        }
        return new StatusResponse();
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
