package dk.dbc.search.solrdocstore.emulator;

import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.EJBException;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import java.net.URI;

@Stateless
@Path("/")
@Produces("application/json")
public class BibliographicResource {
    private static final Logger log = LoggerFactory.getLogger(BibliographicResource.class);

    @Inject
    private Config config;

    @POST
    @Path("bibliographic")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response forwardBibliographicKeys(@QueryParam("skipQueue") @DefaultValue("false") boolean skipQueue,
                                             String jsonContent) throws EJBException
    {
        UriBuilder solrDocStoreUrlBuilder = config.getSolrDocStoreUriBuilder();
        URI uri = solrDocStoreUrlBuilder
                .path("api/bibliographic")
                .queryParam("skipQueue", skipQueue)
                .build();
        log.debug("Forwarding json: {} to url: {}", jsonContent, uri.getHost() + uri.getPath());
        Response resp = ClientBuilder.newClient()
                .target(uri)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .post(Entity.json(jsonContent));
        String content = resp.readEntity(String.class);
        if (resp.getStatusInfo().equals(Response.Status.OK) &&
                resp.getMediaType().equals(MediaType.APPLICATION_JSON_TYPE)) {
            // things are looking OK, return whatever solr-doc-store returned.
            return Response.ok(content).build();
        }
        log.error("SolrDocStore response is of type {}/{} for url {} with this content:",
                resp.getStatusInfo(), resp.getMediaType(), uri.getHost() + uri.getPath());
        log.error(content);
        throw new EJBException("SolrDocStore response is of type: " + resp.getMediaType());
    }

}
