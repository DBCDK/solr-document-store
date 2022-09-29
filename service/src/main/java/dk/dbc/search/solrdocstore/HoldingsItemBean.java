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
import dk.dbc.search.solrdocstore.request.HoldingsItemIndexKeysRequest;
import java.sql.SQLException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);

    private static final Marshaller MARSHALLER = new Marshaller();
    private static final Predicate<String> LIVE_STATUS_PREDICATE = Predicate.not(Set.of("Lost", "Discarded")::contains);

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
        System.out.println("json = " + jsonContent);
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

    void putIndexKeys(int agencyId, String bibliographicRecordId, IndexKeysList indexKeys, String trackingId) throws SQLException {
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
            boolean oldLiveHolding = containsLiveHolding(entity.getIndexKeys());
            entity.setIndexKeys(indexKeys);
            entityManager.merge(entity);
            Set<String> newLocations = entity.getLocations();
            boolean newLiveHolding = containsLiveHolding(entity.getIndexKeys());
            System.out.println("oldLiveHolding = " + oldLiveHolding);
            System.out.println("newLiveHolding = " + newLiveHolding);

            if (oldLiveHolding != newLiveHolding) {
                queueRelatedBibliographic(entity, enqueue,
                                                      QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                                      QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                                      QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
            } else if (oldLocations.equals(newLocations)) {
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
                    if (containsLiveHolding(entity.getIndexKeys())) {
                        queueRelatedBibliographic(entity, enqueue,
                                                  QueueType.HOLDING, QueueType.UNIT, QueueType.WORK,
                                                  QueueType.MAJORHOLDING, QueueType.UNITMAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                                  QueueType.FIRSTLASTHOLDING, QueueType.UNITFIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
                    } else {
                        queueRelatedBibliographic(entity, enqueue,
                                                  QueueType.HOLDING, QueueType.UNIT, QueueType.WORK);
                    }
                    entityManager.remove(binding);
                }
                entityManager.remove(entity);
                enqueue.commit();
            }
            return new StatusResponse();
        }
    }


    private boolean containsLiveHolding(IndexKeysList indexKeysList) {
        return indexKeysList.stream()
                .flatMap(m -> m.entrySet().stream())
                .filter(e -> e.getKey().equals("holdingsitem.status"))
                .flatMap(e -> e.getValue().stream())
                .anyMatch(LIVE_STATUS_PREDICATE);
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

    public List<HoldingsItemEntity> getRelatedHoldingsWithIndexKeys(String bibliographicRecordId, int bibliographicAgencyId) {
        return entityManager.createQuery("SELECT h2b FROM HoldingsToBibliographicEntity h2b" +
                                         " WHERE h2b.bibliographicAgencyId = :bibliographicAgencyId" +
                                         "  AND h2b.bibliographicRecordId = :bibliographicRecordId", HoldingsToBibliographicEntity.class)
                .setParameter("bibliographicAgencyId", bibliographicAgencyId)
                .setParameter("bibliographicRecordId", bibliographicRecordId)
                .getResultStream()
                .map(h2b -> entityManager.find(HoldingsItemEntity.class, new AgencyItemKey(h2b.getHoldingsAgencyId(), h2b.getBibliographicRecordId())))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
