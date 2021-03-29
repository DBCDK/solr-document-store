package dk.dbc.search.solrdocstore;

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
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);
    private static final ObjectMapper O = new ObjectMapper();

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
    public Response setHoldingsKeys(String jsonContent) throws JSONBException, JsonProcessingException  {

        HoldingsItemEntityRequest hi = jsonbContext.unmarshall(jsonContent, HoldingsItemEntityRequest.class);
        if (hi.getTrackingId() == null)
            hi.setTrackingId(UUID.randomUUID().toString());
        try (LogWith logWith = track(hi.getTrackingId())) {

            setHoldingsKeys(hi.asHoldingsItemEntity());

            return Response.ok().entity("{ \"ok\": true }").build();
        } catch (SQLException | RuntimeException ex) {
            log.error("setHoldingsKeys error: {}", ex.getMessage());
            log.debug("setHoldingsKeys error: ", ex);
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

    public void setHoldingsKeys(HoldingsItemEntity hi) throws SQLException {
        EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();

        log.info("Updating holdings for {}:{}", hi.getAgencyId(), hi.getBibliographicRecordId());
        entityManager.merge(hi);
        h2bBean.tryToAttachToBibliographicRecord(hi.getAgencyId(), hi.getBibliographicRecordId(), enqueue, QueueType.HOLDING);
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
