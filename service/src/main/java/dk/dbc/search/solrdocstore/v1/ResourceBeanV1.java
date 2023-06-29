package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.response.BibliographicResourceSchemaAnnotated;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import dk.dbc.search.solrdocstore.v2.ResourceBeanV2;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

@Stateless
@Path("resource")
public class ResourceBeanV1 {

    @Inject
    public ResourceBeanV2 proxy;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("add")
    @Operation(
            operationId = "add-resource",
            summary = "Adds a resource to an item",
            description = "This operation sets the resource and connect" +
                          " it to a number of manifestations item, if possible.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response addResource(String jsonContent) throws JsonProcessingException {
        return proxy.addResource(jsonContent);
    }

    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("{fieldName}/{agencyId}:{bibliographicRecordId}")
    @Operation(
            operationId = "add/update-resource",
            summary = "Adds/updates/removes a resource to/from an item",
            description = "This operation sets/removes the resource and connected" +
                          " manifestations item, are queued.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response putResource(String jsonContent,
                                @PathParam("fieldName") String fieldName,
                                @PathParam("agencyId") Integer agencyId,
                                @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                @QueryParam("trackingId") String trackingId) throws JsonProcessingException {
        return proxy.putResource(jsonContent, fieldName, agencyId, bibliographicRecordId, trackingId);
    }

    @DELETE
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("{fieldName}/{agencyId}:{bibliographicRecordId}")
    @Operation(
            operationId = "delete-resource",
            summary = "Removes a resource to an item",
            description = "This operation removed the resource and queues old connected" +
                          " manifestations item, if any.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response deleteResource(@PathParam("fieldName") String fieldName,
                                   @PathParam("agencyId") Integer agencyId,
                                   @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                   @QueryParam("trackingId") String trackingId) {
        return proxy.deleteResource(fieldName, agencyId, bibliographicRecordId, trackingId);
    }
}
