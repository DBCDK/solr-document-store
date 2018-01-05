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
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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

    /**
     * Returns a json object with a result field, which is a list of json BibliographicEntity that matches
     * holdingsBibliographicRecordId with the argument.
     * @param bibliographicRecordId path parameter, expects URI encoding
     * @return Response
     */
    @GET
    @Path("getBibliographicRecords/bibliographicRecordId/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBibliographicKeys(@PathParam("bibliographicRecordId") String bibliographicRecordId) {
        log.info("Requesting bibliographic record id: {}", bibliographicRecordId);

        // Must be queried with index keys set, because of the Jackson parser ignores lazy loading
        List<BibliographicEntity> res = bibliographicBean.getBibliographicEntitiesWithIndexKeys(bibliographicRecordId);
        return Response.ok(new FrontendReturnListType<>(res),MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("getBibliographicRecords/repositoryId/{repositoryId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBibliographicKeysByRepositoryId(@PathParam("repositoryId") String repositoryID) throws JsonProcessingException {

        log.info("Requesting bibliographic record with repository id: {}",repositoryID);

        // Escaping quotes to avoid parameter injections
        ObjectNode obj = O.createObjectNode();
        ArrayNode arr = obj.putArray("rec.repositoryId");
        arr.add(repositoryID);
        String param = O.writeValueAsString(obj);

        List<BibliographicEntity> res = entityManager.createNativeQuery("SELECT b.* FROM bibliographicsolrkeys b WHERE b.indexkeys @> ?::jsonb",BibliographicEntity.class)
                .setParameter(1,param)
                .setHint("javax.persistence.loadgraph",entityManager.getEntityGraph("bibPostWithIndexKeys"))
                .getResultList();
        return Response.ok(new FrontendReturnListType<>(res),MediaType.APPLICATION_JSON).build();
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
        return Response.ok(new FrontendReturnListType<>(res),MediaType.APPLICATION_JSON).build();
    }

}
