package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Stateless
@Path("resource")
public class ResourceBean {

    private static final Logger log = LoggerFactory.getLogger(ResourceBean.class);
    private static final ObjectMapper O = new ObjectMapper();

    private final JSONBContext jsonbContext = new JSONBContext();
    @Inject
    OpenAgencyBean openAgency;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("add")
    public Response addResource(String jsonContent) throws JSONBException {
        AddResourceRequest request = jsonbContext.unmarshall(jsonContent, AddResourceRequest.class);
        log.debug("Added resource with key: {} - {} - {} having value: {}", request.getAgencyId(),
                request.getBibliographicRecordId(), request.getField(), request.getValue());
        // Verify agency exists, throws exception if not exist
        // TODO potentially improve error response???
        openAgency.lookup(request.getAgencyId());
        // Add resource
        BibliographicResource resource = request.asBibliographicResource();
        entityManager.merge(resource);
        return Response.ok().entity("{ \"ok\": true }").build();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("resources-by-bib-item/{agencyId}/{recId}")
    public Response getResourcesByBibItem(@PathParam("agencyId") int agencyId,
                                          @PathParam("recId") String recId) {
        log.debug("Retrieving resources relating to bib item: {} - {}", agencyId, recId);
        return Response.ok(getResourcesByAgencyAndRecId(agencyId, recId)).build();
    }

    public List<BibliographicResource> getResourcesByAgencyAndRecId(int agencyId, String recId) {
        TypedQuery<BibliographicResource> query = entityManager.createQuery(
                "SELECT br FROM BibliographicResource br " +
                   "WHERE br.agencyId = :agencyId AND br.bibliographicRecordId = :recId",
                BibliographicResource.class);
        query.setParameter("agencyId", agencyId);
        query.setParameter("recId", recId);
        return query.getResultList();
    }
}
