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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;

@Stateless
@Path("bibliographic")
public class BibliographicEmulatorBean {
    private static final Logger log = LoggerFactory.getLogger(BibliographicEmulatorBean.class);

    @Inject
    private Config config;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response addBibliographicKeys(@QueryParam("skipQueue") @DefaultValue("false") boolean skipQueue,
                                         String jsonContent) throws Exception
    {
        log.debug("Forwarding json: {}", jsonContent);
        URI uri = UriBuilder.fromUri(URI.create(config.getSolrDocStoreUrl()))
                .queryParam("skipQueue", skipQueue)
                .queryParam("jsonContent", jsonContent)
                .build();
        Response resp = ClientBuilder.newClient()
                .target(uri)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .buildGet()
                .invoke();
        String content = resp.readEntity(String.class);
        if (resp.getStatusInfo().equals(Response.Status.OK) &&
                resp.getMediaType().equals(MediaType.APPLICATION_JSON_TYPE)) {
            return resp;
        }
        log.error("SolrDocStore response is of type {}/{} for url {} with this content:",
                resp.getStatusInfo(), resp.getMediaType(), config.getSolrDocStoreUrl());
        log.error(content);
        throw new EJBException("SolrDocStore response is of type: " + resp.getMediaType());
    }

}
