package dk.dbc.search.solrdocstore.updater.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.DocProducer;
import dk.dbc.search.solrdocstore.updater.SolrCollection;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.dbc.vipcore.marshallers.LibraryRules;
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

    @EJB
    VipCoreHttpClient vipCoreHttpClient;


    private LibraryRules libraryRulesFromVipCore(String agencyId) {
        final ObjectMapper O = new ObjectMapper();
        try {
            final String path = VipCoreHttpClient.LIBRARY_RULES_PATH + agencyId;
            final String responseFromVipCore = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), path);
            final LibraryRules res = O.readValue(responseFromVipCore, LibraryRules.class);
        } catch (OpenAgencyException e) {
            log.error("OA Exception when fetching from vipCore for agency {}: {}", agencyId, e.getMessage());
        } catch (JsonMappingException e) {
            log.error("JsonMapping exception when unmarshalling vipCore response for agency {}: {}", agencyId, e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingEx when unmarshalling vipCore response for agency {}: {}", agencyId, e.getMessage());
        }
        return null;
    }


    @GET
    @Produces("application/json")
    @Path("libRule/{agencyId}")
    public Response libRule(@PathParam("agencyId") String agencyId) {
        log.debug("libRule called for agency {}", agencyId);
        final LibraryRules res = libraryRulesFromVipCore(agencyId);
        return Response.ok(res, MediaType.APPLICATION_JSON_TYPE).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_XML)
    @Path("format/{agencyId : \\d+}/{classifier}/{bibliographicRecordId : .*$}")
    public Response format(@PathParam("agencyId") int agencyId,
                           @PathParam("classifier") String classifier,
                           @PathParam("bibliographicRecordId") String bibliographicRecordId,
                           @QueryParam("collection") String collection) throws InterruptedException, ExecutionException, IOException {
        log.debug("agencyId = {}; bibliographicRecordId = {}", agencyId, bibliographicRecordId);
        try {
            JsonNode node = docProducer.fetchSourceDoc(new QueueJob(agencyId, classifier, bibliographicRecordId));
            boolean deleted = docProducer.isDeleted(node);
            if (deleted) {
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

            SolrInputDocument document = docProducer.inputDocument(node, solrCollection.get());
            String xml = ClientUtils.toXML(document);

            return Response.ok(xml, MediaType.APPLICATION_XML_TYPE).build();
        } catch (IOException | PostponedNonFatalQueueError | RuntimeException ex) {
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
