/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater.rest;

import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.DocProducer;
import dk.dbc.search.solrdocstore.updater.SolrApi;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("doctest")
public class DocTest {

    private static final Logger log = LoggerFactory.getLogger(DocTest.class);

    @Inject
    DocProducer docProducer;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("format/{agencyId : \\d+}/{bibliographicRecordId : .*$}")
    public Response format(@PathParam("agencyId") int agencyId,
                           @PathParam("bibliographicRecordId") String bibliographicRecordId) throws InterruptedException, ExecutionException, IOException {
        log.debug("agencyId = {}; bibliographicRecordId = {}", agencyId, bibliographicRecordId);
        try {
            JsonNode node = docProducer.fetchSourceDoc(agencyId, bibliographicRecordId);
            boolean deleted = docProducer.isDeleted(node);
            if (deleted) {
                return Response.ok(false).build();

            }
            SolrInputDocument document = docProducer.inputDocument(node);
            String xml = ClientUtils.toXML(document);

            return Response.ok(xml, MediaType.APPLICATION_XML_TYPE).build();
        } catch (IOException ex) {
            log.error("Exception: {}", ex.getMessage());
            log.debug("Exception:", ex);
            return Response.ok(ex.getMessage(), MediaType.TEXT_PLAIN).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("deploy/{agencyId : \\d+}/{bibliographicRecordId : .*$}")
    public Response deploy(@PathParam("agencyId") int agencyId,
                           @PathParam("bibliographicRecordId") String bibliographicRecordId,
                           @QueryParam("commitWithin") Integer commitWithin) throws InterruptedException, ExecutionException, IOException {
        try {
            JsonNode sourceDoc = docProducer.fetchSourceDoc(agencyId, bibliographicRecordId);
            SolrInputDocument doc = docProducer.createSolrDocument(sourceDoc);
            String bibliographicShardId = docProducer.bibliographicShardId(sourceDoc);
            docProducer.deleteSolrDocuments(bibliographicShardId, 0);
            docProducer.deploy(doc, commitWithin);
            return Response.ok("{\"ok\":true}", MediaType.APPLICATION_XML_TYPE).build();
        } catch (SolrServerException | IOException ex) {
            log.error("Exception: {}", ex.getMessage());
            log.debug("Exception:", ex);
            return Response.ok(ex.getMessage()).build();
        }
    }
}
