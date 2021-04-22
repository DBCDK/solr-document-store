package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.request.HoldingsItemEntityRequest;
import dk.dbc.search.solrdocstore.request.HoldingsItemEntitySchemaAnnotated;
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

import static dk.dbc.log.LogWith.track;
import static java.util.Collections.EMPTY_SET;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
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
    public Response setHoldingsKeys(String jsonContent) throws JSONBException, JsonProcessingException {

        HoldingsItemEntityRequest hi = jsonbContext.unmarshall(jsonContent, HoldingsItemEntityRequest.class);
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

        List<HoldingsItemEntity> his = entityManager.createQuery("SELECT h FROM HoldingsItemEntity h WHERE h.bibliographicRecordId = :bibId and h.agencyId = :agency", HoldingsItemEntity.class)
                .setParameter("agency", hi.getAgencyId())
                .setParameter("bibId", hi.getBibliographicRecordId())
                .getResultList();
        boolean hadLiveHoldings = !his.isEmpty() && his.get(0).getHasLiveHoldings();
        boolean hasLiveHoldings = hi.getHasLiveHoldings();
        Set<String> oldLocations = his.isEmpty() ? EMPTY_SET : his.get(0).getLocations();

        log.info("Updating holdings for {}:{}", hi.getAgencyId(), hi.getBibliographicRecordId());
        entityManager.merge(hi);
        if (!hadLiveHoldings && !hasLiveHoldings) { // No holdings before or now
            h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue);
        } else if (hadLiveHoldings != hasLiveHoldings) { // holdings existence change
            h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue,
                                                     QueueType.HOLDING, QueueType.WORK,
                                                     QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING,
                                                     QueueType.FIRSTLASTHOLDING, QueueType.WORKFIRSTLASTHOLDING);
        } else if (!oldLocations.equals(hi.getLocations())) { // holdings accessibility change
            h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue,
                                                     QueueType.HOLDING, QueueType.WORK,
                                                     QueueType.MAJORHOLDING, QueueType.WORKMAJORHOLDING);
        } else {
            h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue,
                                                     QueueType.HOLDING, QueueType.WORK);
        }
        enqueue.commit();
    }

    private Query generateRelatedHoldingsQuery(String bibliographicRecordId, int bibliographicAgencyId) {
        Query query = entityManager.createNativeQuery(
                "select * " +
                "from holdingsitemssolrkeys  " +
                "where (agencyid,bibliographicrecordid) " +
                "IN ( select holdingsagencyid,holdingsbibliographicrecordid " +
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
