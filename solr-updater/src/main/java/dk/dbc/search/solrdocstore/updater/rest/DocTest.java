package dk.dbc.search.solrdocstore.updater.rest;

import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.DocProducer;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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
    Config config;

    @Inject
    DocProducer docProducer;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    @Path("format/{agencyId : \\d+}/{classifier}/{bibliographicRecordId : .*$}")
    public Response format(@PathParam("agencyId") int agencyId,
                           @PathParam("classifier") String classifier,
                           @PathParam("bibliographicRecordId") String bibliographicRecordId) throws InterruptedException, ExecutionException, IOException {
        log.debug("agencyId = {}; bibliographicRecordId = {}", agencyId, bibliographicRecordId);
        try {
            JsonNode node = docProducer.fetchSourceDoc(new QueueJob(agencyId, classifier, bibliographicRecordId));
            boolean deleted = docProducer.isDeleted(node);
            if (deleted) {
                return Response.ok(false).build();

            }
            SolrInputDocument document = docProducer.inputDocument(node);
            String xml = ClientUtils.toXML(document);

            return Response.ok(xml, MediaType.APPLICATION_XML_TYPE).build();
        } catch (IOException | PostponedNonFatalQueueError ex) {
            log.error("Exception: {}", ex.getMessage());
            log.debug("Exception:", ex);
            return Response.ok(ex.getMessage(), MediaType.TEXT_PLAIN).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_XML)
    @Path("formatPid/{agencyId : \\d+}-{classifier}:{bibliographicRecordId : .*$}")
    public Response formatPid(@PathParam("agencyId") int agencyId,
                              @PathParam("classifier") String classifier,
                              @PathParam("bibliographicRecordId") String bibliographicRecordId) throws InterruptedException, ExecutionException, IOException {
        return format(agencyId, classifier, bibliographicRecordId);
    }

    @GET
    @Produces(MediaType.APPLICATION_XML)
    @Path("deploy/{agencyId : \\d+}/{classifier}/{bibliographicRecordId : .*$}")
    public Response deploy(@PathParam("agencyId") int agencyId,
                           @PathParam("classifier") String classifier,
                           @PathParam("bibliographicRecordId") String bibliographicRecordId,
                           @QueryParam("commitWithin") Integer commitWithin) throws InterruptedException, ExecutionException, IOException {
        try {
            JsonNode sourceDoc = docProducer.fetchSourceDoc(new QueueJob(agencyId, classifier, bibliographicRecordId));
            SolrInputDocument doc = docProducer.createSolrDocument(sourceDoc);
            String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);
            int nestedDocumentCount = docProducer.getNestedDocumentCount(bibliographicShardId);
            docProducer.deleteSolrDocuments(bibliographicShardId, nestedDocumentCount, 0);
            docProducer.deploy(doc, commitWithin);
            return Response.ok("{\"ok\":true}", MediaType.APPLICATION_XML_TYPE).build();
        } catch (SolrServerException | IOException | PostponedNonFatalQueueError ex) {
            log.error("Exception: {}", ex.getMessage());
            log.debug("Exception:", ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        }
    }
}
