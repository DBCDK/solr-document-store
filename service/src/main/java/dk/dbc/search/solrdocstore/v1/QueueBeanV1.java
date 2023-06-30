/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.response.StatusResponse;
import dk.dbc.search.solrdocstore.v2.QueueBeanV2;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@Path("queue")
public class QueueBeanV1 {

    @Inject
    public QueueBeanV2 proxy;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("manifestation/{ agencyId : \\d+}-{ classifier : \\w+ }:{ bibliographicRecordId : .+}")
    @Operation(
            summary = "Queue a manifestation",
            description = "This operation puts a manifestation," +
                          " and optionally (if it isn't deleted) its work on queue.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "The manifestation was found, and put onto the queue",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME))),
        @APIResponse(name = "Not Found",
                     responseCode = "404",
                     description = "There's no such manifestation",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME)))
    })
    @Parameters({
        @Parameter(name = "agencyId",
                   description = "The agency that owns the record",
                   required = true),
        @Parameter(name = "classifier",
                   description = "The classifier of the records (usually basis or katalog)",
                   required = true),
        @Parameter(name = "bibliographicRecordId",
                   description = "The id of the record",
                   required = true),
        @Parameter(name = "trackingId",
                   description = "For tracking the request",
                   required = false)})
    @Timed
    public Response queueManifestation(@PathParam("agencyId") Integer agencyId,
                                       @PathParam("classifier") String classifier,
                                       @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @QueryParam("trackingId") String trackingId) {
        return proxy.queueManifestation(agencyId, classifier, bibliographicRecordId, trackingId);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("unit/{ unitId : unit:\\d+ }")
    @Timed
    @Operation(
            summary = "Queue a manifestation",
            description = "This operation puts a unit and its manifestations on queue.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "The unit was found, and put onto the queue",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME))),
        @APIResponse(name = "Not Found",
                     responseCode = "404",
                     description = "There's no such unit",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME)))
    })
    @Parameters({
        @Parameter(name = "unitId",
                   description = "The (corepo-)id of the unit",
                   required = true),
        @Parameter(name = "trackingId",
                   description = "For tracking the request",
                   required = false)})
    public Response queueUnit(@PathParam("unitId") String unitId,
                              @QueryParam("trackingId") String trackingId) {
        return proxy.queueUnit(unitId, trackingId);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workId : work:\\d+ }")
    @Timed
    @Operation(
            summary = "Queue a manifestation",
            description = "This operation puts a work and its manifestations on queue.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "The work was found, and put onto the queue",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME))),
        @APIResponse(name = "Not Found",
                     responseCode = "404",
                     description = "There's no such work",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = StatusResponse.NAME)))
    })
    @Parameters({
        @Parameter(name = "workId",
                   description = "The (corepo-)id of the work",
                   required = true),
        @Parameter(name = "trackingId",
                   description = "For tracking the request",
                   required = false)})
    public Response queueWork(@PathParam("workId") String workId,
                              @QueryParam("trackingId") String trackingId) {
        return proxy.queueWork(workId, trackingId);
    }
}
