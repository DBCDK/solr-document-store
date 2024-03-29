package dk.dbc.search.solrdocstore.updater.rest;

import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.DocProducer;
import dk.dbc.search.solrdocstore.updater.SolrCollection;
import dk.dbc.solrdocstore.updater.businesslogic.SolrDocStoreResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;

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
                           @PathParam("bibliographicRecordId") String bibliographicRecordId,
                           @QueryParam("collection") String collection) throws InterruptedException, ExecutionException, IOException {
        log.debug("agencyId = {}; bibliographicRecordId = {}", agencyId, bibliographicRecordId);
        try {
            SolrDocStoreResponse sourceDoc = docProducer.fetchSourceDoc(QueueJob.manifestation(agencyId, classifier, bibliographicRecordId));
            if (sourceDoc.bibliographicRecord.deleted) {
                return Response.noContent().build();
            }
            Set<SolrCollection> solrCollections = config.getSolrCollections();
            Optional<SolrCollection> solrCollection;
            if (collection == null) {
                solrCollection = solrCollections.stream().findAny();
            } else {
                solrCollection = solrCollections.stream()
                        .filter(c -> c.getName().equalsIgnoreCase(collection))
                        .findAny();
            }
            if (!solrCollection.isPresent())
                throw new InternalServerErrorException("Cannot find collection");

            SolrInputDocument document = docProducer.createSolrDocument(sourceDoc, solrCollection.get());
            String xml = ClientUtils.toXML(document);

            return Response.ok(xml, MediaType.APPLICATION_XML_TYPE).build();
        } catch (IOException | RuntimeException ex) {
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
                              @PathParam("bibliographicRecordId") String bibliographicRecordId,
                              @QueryParam("collection") String collection) throws InterruptedException, ExecutionException, IOException {
        return format(agencyId, classifier, bibliographicRecordId, collection);
    }
}
