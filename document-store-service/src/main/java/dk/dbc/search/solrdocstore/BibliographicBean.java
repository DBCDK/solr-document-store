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
@Path("")
public class BibliographicBean {
    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);

    
    private final JSONBContext jsonbContext = new JSONBContext();

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Path("bibliographic")
    @Consumes({ MediaType.APPLICATION_JSON })
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBibliographicKeys(@Context UriInfo uriInfo, String KeyJsonContent) throws Exception {
        BibliographicEntity be=jsonbContext.unmarshall(KeyJsonContent, BibliographicEntity.class);
        log.info("AddBibliographicKeys called {}:{}", be.agencyId,be.bibliographicRecordId);

        entityManager.merge( be );
        return Response.ok().entity("{ \"test\": True }").build();
    }
}
