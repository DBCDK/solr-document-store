package dk.dbc.search.solrdocstore.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.request.BibliographicEntitySchemaAnnotated;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import org.eclipse.microprofile.metrics.annotation.Timed;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;


@Stateless
@Path("bibliographic")
public class BibliographicBeanV1 {

    @Inject
    public BibliographicBeanV2 proxy;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    @Operation(
            operationId = "set-manifestation",
            summary = "set manifestation solr document",
            description = "This operation sets the manifestation and connect" +
                          " it to holdingsitems, if possible.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Manifestation has been added",
                     ref = StatusResponse.NAME)})
    @Parameters({
        @Parameter(name = "skipQueue",
                   description = "If this is an update of an existing document," +
                                 " the optionally skip queueing for further processing.")
    })
    @RequestBody(ref = BibliographicEntitySchemaAnnotated.NAME)
    public Response addBibliographicKeys(@QueryParam("skipQueue") @DefaultValue("false") boolean skipQueue,
                                         String jsonContent) throws JsonProcessingException {
        return proxy.addBibliographicKeys(skipQueue, jsonContent);
    }
}
