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
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import dk.dbc.search.solrdocstore.response.ExistsResponse;

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
public class ExistenceBean {

    private static final Logger log = LoggerFactory.getLogger(ExistenceBean.class);

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

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
        log.info("Checking existence of bibliographic item {}-{}:{}", agencyId, classifier, bibliographicRecordId);
        ExistsResponse response = new ExistsResponse();
        BibliographicEntity entity = entityManager.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, classifier, bibliographicRecordId));
        if (entity == null) {
            response.exists = false;
        } else {
            response.exists = !entity.isDeleted();
        }
        return response;
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
        log.info("Checking existence of holdings item {}:{}", agencyId, bibliographicRecordId);
        ExistsResponse response = new ExistsResponse();
        HoldingsItemEntity entity = entityManager.find(HoldingsItemEntity.class, new AgencyItemKey(agencyId, bibliographicRecordId));
        response.exists = entity != null;
        return response;
    }
}
