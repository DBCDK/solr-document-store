package dk.dbc.search.solrdocstore.updater;

import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.solrdocstore.updater.businesslogic.BusinessLogic;
import dk.dbc.solrdocstore.updater.businesslogic.LibraryRuleProvider;
import dk.dbc.solrdocstore.updater.businesslogic.PersistentWorkIdProvider;
import dk.dbc.solrdocstore.updater.businesslogic.ProfileProvider;
import dk.dbc.solrdocstore.updater.businesslogic.SolrDocStoreResponse;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.request.UpdateRequest;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.ws.rs.WebApplicationException;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class DocProducer {

    private static final Logger log = LoggerFactory.getLogger(DocProducer.class);

    @Inject
    Config config;

    @Inject
    ProfileProvider profileProvider;

    @Inject
    LibraryRuleProvider libraryRuleProvider;

    @Inject
    PersistentWorkIdProvider persistentWorkIdProvider;

    private Client client;
    private UriBuilder uriTemplate;

    @PostConstruct
    public void init() {
        log.info("Building DocProducer");
        this.client = config.getClient();
        String solrDocStoreUrl = config.getSolrDocStoreUrl();
        log.debug("solrDocStoreUrl = {}", solrDocStoreUrl);
        this.uriTemplate = UriBuilder.fromUri(solrDocStoreUrl)
                .path("api/retrieve/combined/{agencyId}/{classifier}/{bibliographicRecordId}");
    }

    public BusinessLogic getBusinessLogicFor(SolrCollection collection) {
        BusinessLogic businessLogic = collection.getBusinessLogic();
        if (businessLogic == null) {
            businessLogic = BusinessLogic.builder(collection.getFeatures(), collection.getSolrFields())
                    .enable800000AndRole(libraryRuleProvider)
                    .enablePersistentWorkId(persistentWorkIdProvider)
                    .enableScan(profileProvider, config.getScanDefaultFields(), config.getScanProfiles())
                    .build();
            collection.setBusinessLogic(businessLogic);
        }
        return businessLogic;
    }

    /**
     * Retrieve Document and process it
     * <p>
     * Delete from solr, of not deleted then add too
     *
     * @param doc            The document to post to the solr (null if no
     *                       documents)
     * @param solrCollection connection to solr collection
     * @throws IOException         if an retrieval error occurs
     * @throws SolrServerException if a sending error occurs
     */
    @Timed(reusable = true)
    public void deploy(SolrInputDocument doc, SolrCollection solrCollection) throws IOException, SolrServerException {

        if (doc != null) {
            if (log.isDebugEnabled()) {
                List<SolrInputDocument> children = doc.getChildDocuments();
                if (children == null) {
                    log.debug("Adding document {}", doc.getFieldValue("id"));
                } else {
                    log.debug("Adding document {}{}", doc.getFieldValue("id"),
                              children.stream().map(d -> ", " + d.getFieldValue("id"))
                                      .collect(Collectors.joining()));
                }
                log.trace("doc = {}", doc);
            }
            UpdateRequest updateRequest = new UpdateRequest();
            updateRequest.add(doc);
            updateRequest.setParam("appId", config.getAppId());
            UpdateResponse resp = updateRequest.process(solrCollection.getSolrClient());
            if (resp.getStatus() != 0) {
                throw new IllegalStateException("Got non-zero status: " + resp.getStatus() + " from solr on deploy");
            }
        }
    }

    /**
     * Delete documents from solr, by searching all those with
     * _root_:${biblShardId}
     *
     * @param bibliographicShardId the root id of the document to purge
     * @param solrCollection       connection to solr collection
     * @throws IOException         solr communication error
     * @throws SolrServerException solr communication error
     */
    @Timed(reusable = true)
    public void deleteSolrDocuments(String bibliographicShardId, SolrCollection solrCollection) throws IOException, SolrServerException {
        UpdateRequest updateRequest = new UpdateRequest();
        updateRequest.setParam("appId", config.getAppId());
        updateRequest.deleteById(bibliographicShardId);

        UpdateResponse resp = updateRequest.process(solrCollection.getSolrClient());
        if (resp.getStatus() != 0) {
            throw new IllegalStateException("Got non-zero status: " + resp.getStatus() + " from solr on delete");
        }
    }

    /**
     * Create the solr document with only the known field, inlining holdingitems
     * and synthesize fields
     *
     * @param sourceDoc      the document from
     *                       {@link #fetchSourceDoc(dk.dbc.search.solrdocstore.queue.QueueJob)}
     * @param solrCollection description of known fields in the solr collection
     * @return null if deleted otherwise a expanded solr document
     */
    @Timed(reusable = true)
    public SolrInputDocument createSolrDocument(SolrDocStoreResponse sourceDoc, SolrCollection solrCollection) {
        boolean deleted = sourceDoc.bibliographicRecord.deleted;
        log.trace("deleted = {}", deleted);
        SolrInputDocument doc = null;
        if (!deleted) {
            BusinessLogic businessLogic = getBusinessLogicFor(solrCollection);
            String id = bibliographicShardId(sourceDoc);
            return businessLogic.processAndAddIds(id, sourceDoc);
        }
        return doc;
    }

    /**
     * Get a json document from the solr-doc-store
     *
     * @param job What to fetch from solr-doc-store
     * @return the document collection
     * @throws IOException In case of http errors
     */
    @Timed(reusable = true)
    public SolrDocStoreResponse fetchSourceDoc(QueueJob job) throws IOException {
        URI uri = uriTemplate.buildFromMap(mapForUri(job));
        log.debug("Fetching: {}", uri);
        try (InputStream is = client.target(uri)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get(InputStream.class)) {
            return SolrDocStoreResponse.from(is);
        } catch (WebApplicationException ex) {
            log.error("Error fetching document {} from solr-doc-store: {}", job.getJobId(), ex.getMessage());
            log.debug("Error fetching document {} from solr-doc-store: ", job.getJobId(), ex);
            throw ex;
        }
    }

    /**
     * Build a UriBuilder build map
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return map
     */
    private static Map<String, String> mapForUri(QueueJob job) {
        HashMap<String, String> map = new HashMap<>();
        map.put("agencyId", String.valueOf(job.getAgencyId()));
        map.put("classifier", job.getClassifier());
        map.put("bibliographicRecordId", job.getBibliographicRecordId());
        return map;
    }

    /**
     * Construct an id string with sharding info using bibliographicrecordid
     *
     * @param sourceDoc Json source document from solr-doc-store
     * @return string of parts joined with '-'
     */
    public static String bibliographicShardId(SolrDocStoreResponse sourceDoc) {
        return sourceDoc.bibliographicRecord.bibliographicRecordId + "/32!" +
               String.join("-",
                           String.valueOf(sourceDoc.bibliographicRecord.agencyId),
                           sourceDoc.bibliographicRecord.classifier,
                           sourceDoc.bibliographicRecord.bibliographicRecordId);
    }
}
