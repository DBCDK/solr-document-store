package dk.dbc.search.solrdocstore;

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
import java.util.stream.Collectors;
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
     * holdingsBibliographicRecordId with the argument. Also includes the supersede id, if it exists.
     */
    @GET
    @Path("bibliographic-records/bibliographic-record-id/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
    public Response getBibliographicKeysWithSupersedeId(
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
            Query frontendQuery = brBean.getBibliographicEntitiesWithIndexKeys(bibliographicRecordId, orderBy, desc);
            List<Object[]> resultList = frontendQuery.setFirstResult(( page - 1 ) * pageSize).setMaxResults(pageSize).getResultList();
            List<BibliographicFrontendEntity> bibliographicFrontendEntityList = resultList.stream().map((record) -> {
                BibliographicEntity b = (BibliographicEntity) record[0];
                return new BibliographicFrontendEntity(b, (String) record[1]);
            }).collect(Collectors.toList());
            long countResult = brBean.getBibliographicEntityCountById(bibliographicRecordId);
            return Response.ok(new FrontendReturnListType<>(bibliographicFrontendEntityList, pageCount(countResult, pageSize)), MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("bibliographic-records/repository-id/{repositoryId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
    public Response getBibliographicKeysByRepositoryIdWithSupersedeId(
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
            Query frontendQuery = entityManager.createNativeQuery("SELECT b.*,b2b.livebibliographicrecordid as supersede_id " +
                                                                  "FROM bibliographicsolrkeys b " +
                                                                  "LEFT OUTER JOIN bibliographictobibliographic b2b ON b.bibliographicrecordid=b2b.deadbibliographicrecordid " +
                                                                  "WHERE b.repositoryId = ? ORDER BY b." + orderBy + " " + direction, "BibliographicEntityWithSupersedeId")
                    .setParameter(1, repositoryID)
                    .setParameter(2, orderBy)
                    .setFirstResult(( page - 1 ) * pageSize)
                    .setMaxResults(pageSize);
            List<BibliographicFrontendEntity> res = ( (List<Object[]>) frontendQuery.getResultList() ).stream().map((record) -> {
                BibliographicEntity b = (BibliographicEntity) record[0];
                return new BibliographicFrontendEntity(b, (String) record[1]);
            }).collect(Collectors.toList());
            Query queryTotal = entityManager.createNativeQuery("SELECT COUNT(b.bibliographicRecordId) FROM bibliographicsolrkeys b WHERE b.repositoryId = ?")
                    .setParameter(1, repositoryID);
            long count = (long) queryTotal.getSingleResult();
            return Response.ok(new FrontendReturnListType<>(res, pageCount(count, pageSize)), MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("bibliographic-record/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
    public Response getBibliographicRecord(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @PathParam("bibliographicAgencyId") int bibliographicAgencyId) {
        try (LogWith logWith = track(null)) {
            Query frontendQuery = entityManager.createNativeQuery("SELECT b.*,b2b.livebibliographicrecordid as supersede_id " +
                                                                  "FROM bibliographicsolrkeys b " +
                                                                  "LEFT OUTER JOIN bibliographictobibliographic b2b ON b.bibliographicrecordid=b2b.deadbibliographicrecordid " +
                                                                  "WHERE (b.bibliographicrecordid=?1 AND b.agencyid=?2)", "BibliographicEntityWithSupersedeId")
                    .setParameter(1, bibliographicRecordId)
                    .setParameter(2, bibliographicAgencyId);
            Object[] record = (Object[]) frontendQuery.getSingleResult();
            return Response.ok(new BibliographicFrontendEntity((BibliographicEntity) record[0], (String) record[1])).build();
        }
    }

    /*
     * Returns a json object with a result field, which is a list of json HoldingsItemEntity mapped via the
     * holdingsToBibliographic table.
     */
    @GET
    @Path("related-holdings/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
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
