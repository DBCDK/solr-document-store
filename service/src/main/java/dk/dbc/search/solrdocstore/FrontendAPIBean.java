package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Stateless
@Path("")
public class FrontendAPIBean {
    private static final ObjectMapper O = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(FrontendAPIBean.class);

    @Inject
    BibliographicBean bibliographicBean;

    @Inject
    HoldingsItemBean holdingsItemBean;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    private int pageCount(long resCount,int pageSize){
        return (int)Math.ceil((double)resCount/pageSize);
    }

    /**
     * Returns a json object with a result field, which is a list of json BibliographicEntity that matches
     * holdingsBibliographicRecordId with the argument.
     * @return Response
     */
    @GET
    @Path("getBibliographicRecords/bibliographicRecordId/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBibliographicKeys(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc){
        log.info("Requesting bibliographic record id: {}", bibliographicRecordId);
        log.info("Query parameters - page: {}, page_size: {}, order_by: {}, desc: {}",page,pageSize,orderBy,desc);
        // Checking for valid  query parameters
        if (!BibliographicEntity.sortableColumns.contains(orderBy)){
            return Response.status(400).entity("{\"error\":\"order_by parameter not acceptable\"}").build();
        }

        // Must be queried with index keys set, because of the Jackson parser ignores lazy loading
        TypedQuery<BibliographicEntity> query = bibliographicBean.getBibliographicEntitiesWithIndexKeys(bibliographicRecordId,orderBy,desc);
        List<BibliographicEntity> res = query.setFirstResult((page-1)*pageSize).setMaxResults(pageSize).getResultList();
        long countResult = bibliographicBean.getBibliographicEntityCountById(bibliographicRecordId);
        return Response.ok(new FrontendReturnListType<>(res,pageCount(countResult,pageSize)), MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("getBibliographicRecords/repositoryId/{repositoryId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBibliographicKeysByRepositoryId(
            @PathParam("repositoryId") String repositoryID,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc) throws JsonProcessingException {

        log.info("Requesting bibliographic record with repository id: {}",repositoryID);
        log.info("Query parameters - page: {}, page_size: {}, order_by: {}",page,pageSize,orderBy);
        // Checking for valid  query parameters
        if (!BibliographicEntity.sortableColumns.contains(orderBy)){
            return Response.status(400).entity("{\"error\":\"order_by parameter not acceptable\"}").build();
        }

        // Escaping quotes to avoid parameter injections
        ObjectNode obj = O.createObjectNode();
        ArrayNode arr = obj.putArray("rec.repositoryId");
        arr.add(repositoryID);
        String param = O.writeValueAsString(obj);

        String direction = (desc) ? "DESC" : "ASC";
        List<BibliographicEntity> res = entityManager.createNativeQuery("SELECT b.* FROM bibliographicsolrkeys b WHERE b.indexkeys @> ?::jsonb ORDER BY b."+orderBy+" "+direction,BibliographicEntity.class)
                .setParameter(1,param)
                .setParameter(2,orderBy)
                .setHint("javax.persistence.loadgraph",entityManager.getEntityGraph("bibPostWithIndexKeys"))
                .setFirstResult((page-1)*pageSize)
                .setMaxResults(pageSize)
                .getResultList();
        Query queryTotal = entityManager.createNativeQuery
                ("SELECT COUNT(b.bibliographicRecordId) FROM bibliographicsolrkeys b WHERE b.indexKeys @> ?::jsonb")
                .setParameter(1,param);
        long count = (long)queryTotal.getSingleResult();
        return Response.ok(new FrontendReturnListType<>(res,pageCount(count,pageSize)),MediaType.APPLICATION_JSON).build();
    }

    /**
     * Returns a json object with a result field, which is a list of json HoldingsItemEntity mapped via the
     * holdingsToBibliographic table.
     * @param bibliographicRecordId
     * @param bibliographicAgencyId
     * @return Response
     */
    @GET
    @Path("getRelatedHoldings/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRelatedHoldings(@PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @PathParam("bibliographicAgencyId") int bibliographicAgencyId){
        log.info("Requesting bibliographic record id: {} and bibliographic agency id: {}",
                bibliographicRecordId,bibliographicAgencyId);
        List<HoldingsItemEntity> res = holdingsItemBean.getRelatedHoldings(bibliographicRecordId, bibliographicAgencyId);
        return Response.ok(new FrontendReturnListType<>(res,0),MediaType.APPLICATION_JSON).build();
    }

}
