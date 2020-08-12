package dk.dbc.search.solrdocstore.emulator;

import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
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
