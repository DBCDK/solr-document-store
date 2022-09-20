package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.FrontendReturnListType;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.log.LogWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import org.eclipse.microprofile.metrics.annotation.Timed;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("")
public class BibliographicRecordAPIBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicRecordAPIBean.class);

    @Inject
    BibliographicRetrieveBean brBean;

    @Inject
    HoldingsItemBean holdingsItemBean;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    private int pageCount(long resCount, int pageSize) {
        return (int) Math.ceil((double) resCount / pageSize);
    }

    /*
     * Returns a json object with a result field, which is a list of json BibliographicEntity that matches
     * holdingsBibliographicRecordId with the argument.
     */
    @GET
    @Path("bibliographic-records/bibliographic-record-id/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicKeys(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc) {
        try (LogWith logWith = track(null)) {
            log.info("Requesting bibliographic record id: {}", bibliographicRecordId);
            log.info("Query parameters - page: {}, page_size: {}, order_by: {}, desc: {}", page, pageSize, orderBy, desc);
            // Checking for valid  query parameters
            if (!BibliographicEntity.sortableColumns.contains(orderBy)) {
                return Response.status(400).entity("{\"error\":\"order_by parameter not acceptable\"}").build();
            }
            List<BibliographicEntity> bibliographicFrontendEntityList = brBean.getBibliographicEntitiesWithIndexKeys(bibliographicRecordId, orderBy, desc)
                    .setFirstResult(( page - 1 ) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
            long countResult = brBean.getBibliographicEntityCountById(bibliographicRecordId);
            return Response.ok(new FrontendReturnListType<>(bibliographicFrontendEntityList, pageCount(countResult, pageSize)), MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("bibliographic-records/repository-id/{repositoryId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicKeysByRepositoryId(
            @PathParam("repositoryId") String repositoryID,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc) throws JsonProcessingException {
        try (LogWith logWith = track(null)) {
            log.info("Requesting bibliographic record with repository id: {}", repositoryID);
            log.info("Query parameters - page: {}, page_size: {}, order_by: {}", page, pageSize, orderBy);
            // Checking for valid  query parameters
            if (!BibliographicEntity.sortableColumns.contains(orderBy)) {
                return Response.status(400).entity("{\"error\":\"order_by parameter not acceptable\"}").build();
            }

            String direction = desc ? "DESC" : "ASC";
            List<BibliographicEntity> res = entityManager.createQuery(
                    "SELECT b " +
                    "FROM BibliographicEntity b " +
                    "WHERE b.repositoryId=:repositoryId ORDER BY b." + orderBy + " " + direction, BibliographicEntity.class)
                    .setParameter("repositoryId", repositoryID)
                    .setFirstResult(( page - 1 ) * pageSize)
                    .setMaxResults(pageSize)
                    .getResultList();
            Query queryTotal = entityManager.createNativeQuery("SELECT COUNT(b.bibliographicRecordId) FROM bibliographicsolrkeys b WHERE b.repositoryId = ?")
                    .setParameter(1, repositoryID);
            long count = (long) queryTotal.getSingleResult();
            return Response.ok(new FrontendReturnListType<>(res, pageCount(count, pageSize)), MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("bibliographic-record/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicRecord(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @PathParam("bibliographicAgencyId") int bibliographicAgencyId) {
        try (LogWith logWith = track(null)) {
            BibliographicEntity entity = entityManager.createQuery(
                    "SELECT b " +
                    "FROM BibliographicEntity b " +
                    "WHERE (b.bibliographicRecordId=:bibliographicRecordId AND b.agencyId=:agencyId)", BibliographicEntity.class)
                    .setParameter("bibliographicRecordId", bibliographicRecordId)
                    .setParameter("agencyId", bibliographicAgencyId)
                    .getSingleResult();
            return Response.ok(entity).build();
        }
    }

    /*
     * Returns a json object with a result field, which is a list of json HoldingsItemEntity mapped via the
     * holdingsToBibliographic table.
     */
    @GET
    @Path("related-holdings/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getRelatedHoldings(@PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @PathParam("bibliographicAgencyId") int bibliographicAgencyId) {
        try (LogWith logWith = track(null)) {
            log.info("Requesting bibliographic record id: {} and bibliographic agency id: {}",
                     bibliographicRecordId, bibliographicAgencyId);
            List<HoldingsItemEntity> res = holdingsItemBean.getRelatedHoldingsWithIndexKeys(bibliographicRecordId, bibliographicAgencyId);
            return Response.ok(new FrontendReturnListType<>(res, 0), MediaType.APPLICATION_JSON).build();
        }
    }
}
