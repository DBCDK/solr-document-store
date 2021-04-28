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

import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@Path("queue")
public class QueueBean {

    private static final Logger log = LoggerFactory.getLogger(QueueBean.class);

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

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
    @Timed(reusable = true)
    public Response queueManifestation(@PathParam("agencyId") Integer agencyId,
                                       @PathParam("classifier") String classifier,
                                       @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @QueryParam("trackingId") String trackingId) {
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        String pid = agencyId + "-" + classifier + ":" + bibliographicRecordId;
        try (LogWith logWith = LogWith.track(trackingId)
                .pid(pid)) {
            AgencyClassifierItemKey bibliographicKey = new AgencyClassifierItemKey(agencyId, classifier, bibliographicRecordId);
            BibliographicEntity biblEntity = entityManager.find(BibliographicEntity.class, bibliographicKey);
            if (biblEntity == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new StatusResponse("No such manifestation"))
                        .build();
            }
            EnqueueCollector enqueueCollector = enqueueSupplier.getEnqueueCollector();
            if (biblEntity.isDeleted()) {
                enqueueCollector.add(biblEntity, QueueType.ENDPOINT);
            } else {
                enqueueCollector.add(biblEntity, QueueType.ENDPOINT, QueueType.WORKENDPOINT);
            }
            enqueueCollector.commit();
            return Response.ok(new StatusResponse()).build();
        } catch (SQLException ex) {
            log.error("Error queueing: {}: {}", pid, ex.getMessage());
            log.debug("Error queueing: {}: ", pid, ex);
            return Response.serverError()
                    .entity(new StatusResponse(ex.getMessage()))
                    .build();
        }
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workId : work:\\d+ }")
    @Timed(reusable = true)
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
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = LogWith.track(trackingId)
                .pid(workId)) {
            List<BibliographicEntity> biblEntitys = BibliographicEntity.fetchByWork(entityManager, workId);
            if (biblEntitys.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new StatusResponse("No such work"))
                        .build();
            }
            EnqueueCollector enqueueCollector = enqueueSupplier.getEnqueueCollector();
            biblEntitys.forEach(biblEntity -> enqueueCollector.add(biblEntity, QueueType.ENDPOINT, QueueType.WORKENDPOINT));
            enqueueCollector.commit();
            return Response.ok(new StatusResponse()).build();
        } catch (SQLException ex) {
            log.error("Error queueing: {}: {}", workId, ex.getMessage());
            log.debug("Error queueing: {}: ", workId, ex);
            return Response.serverError()
                    .entity(new StatusResponse(ex.getMessage()))
                    .build();
        }
    }
}
