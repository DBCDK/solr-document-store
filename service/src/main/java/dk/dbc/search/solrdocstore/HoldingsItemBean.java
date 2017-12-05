package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addHoldingsKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        HoldingsItemEntity hi = jsonbContext.unmarshall(jsonContent, HoldingsItemEntity.class);
        log.info("Updating holdings for {}:{}", hi.agencyId, hi.bibliographicRecordId);

        entityManager.merge(hi);

        return Response.ok().entity("{ \"ok\": true }").build();
    }
}
