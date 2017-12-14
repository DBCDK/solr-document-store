package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
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

    @Inject
    HoldingsToBibliographicBean h2bBean;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addHoldingsKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        HoldingsItemEntityRequest hi = jsonbContext.unmarshall(jsonContent, HoldingsItemEntityRequest.class);

        addHoldingsKeys(hi.asHoldingsItemEntity());

        return Response.ok().entity("{ \"ok\": true }").build();
    }

    public void addHoldingsKeys(HoldingsItemEntity hi){
        log.info("Updating holdings for {}:{}", hi.agencyId, hi.bibliographicRecordId);
        entityManager.merge(hi);
        h2bBean.tryToAttachToBibliographicRecord(hi.agencyId, hi.bibliographicRecordId);
    }
}
