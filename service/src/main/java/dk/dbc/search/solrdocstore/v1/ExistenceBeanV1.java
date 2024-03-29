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

import jakarta.ejb.Stateless;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import dk.dbc.search.solrdocstore.response.ExistsResponse;
import dk.dbc.search.solrdocstore.v2.ExistenceBeanV2;
import jakarta.inject.Inject;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@Path("exists")
@OpenAPIDefinition(
        info = @Info(
                title = "Record existence check",
                version = "1.0",
                description = "This service allows checking if a record exists and is not 'delete'",
                contact = @Contact(url = "mailto:dbc@dbc.dk")))
public class ExistenceBeanV1 {

    @Inject
    public ExistenceBeanV2 proxy;

    @Timed
    @GET
    @Path("bibliographicitem/{agencyId : \\d+}-{classifier : \\w+}:{bibliographicRecordId : .+}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
            summary = "Check if a manifestation-id has a 'live' record",
            description = "This operation checks for a given identifier," +
                          " and returns if a document is retrievable for it.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "An item for the given manifestation-id has been checked",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = ExistsResponse.NAME)))})
    @Parameters({
        @Parameter(name = "agencyId",
                   description = "The agency that should own the record",
                   required = true),
        @Parameter(name = "classifier",
                   description = "The classifier of the records (usually basis or katalog)",
                   required = true),
        @Parameter(name = "bibliographicRecordId",
                   description = "The id of the record",
                   required = true)})
    public ExistsResponse bibliographicExists(@PathParam("agencyId") Integer agencyId,
                                              @PathParam("classifier") String classifier,
                                              @PathParam("bibliographicRecordId") String bibliographicRecordId) {
        return proxy.bibliographicExists(agencyId, classifier, bibliographicRecordId);
    }

    @Timed
    @GET
    @Path("holdingsitem/{agencyId : \\d+}:{bibliographicRecordId : .+}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
            summary = "Check if a agency has a 'live' holdings for a bibliographic item",
            description = "This operation checks for a given agency/item," +
                          " and returns if a holding is retrievable for it.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "A holding for the given agency/item has been checked",
                     content = @Content(
                             mediaType = MediaType.APPLICATION_JSON,
                             schema = @Schema(ref = ExistsResponse.NAME)))})
    @Parameters({
        @Parameter(name = "agencyId",
                   description = "The agency that should own the record",
                   required = true),
        @Parameter(name = "bibliographicRecordId",
                   description = "The id of the record",
                   required = true)})
    public ExistsResponse holdingExists(@PathParam("agencyId") Integer agencyId,
                                        @PathParam("bibliographicRecordId") String bibliographicRecordId) {
        return proxy.holdingExists(agencyId, bibliographicRecordId);
    }
}
