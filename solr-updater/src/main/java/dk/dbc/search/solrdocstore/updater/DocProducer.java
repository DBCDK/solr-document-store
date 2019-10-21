package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.ee.stats.Timed;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.request.UpdateRequest;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.updater.DocHelpers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class DocProducer {

    private static final Logger log = LoggerFactory.getLogger(DocProducer.class);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final int MAX_ROWS_OF_SHARDED_SOLR = 10000;

    @Inject
    Config config;

    @Inject
    SolrFields solrFields;

    @Inject
    BusinessLogic businessLogic;

    private Client client;
    private UriBuilder uriTemplate;
    SolrClient solrClient;

    @PostConstruct
    public void init() {
        log.info("Building DocProducer");
        this.client = ClientBuilder.newClient();
        String solrDocStoreUrl = config.getSolrDocStoreUrl();
        log.debug("solrDocStoreUrl = {}", solrDocStoreUrl);
        this.uriTemplate = UriBuilder.fromUri(solrDocStoreUrl)
                .path("api/retrieve/combined/{agencyId}/{classifier}/{bibliographicRecordId}");
        this.solrClient = SolrApi.makeSolrClient(config.getSolrUrl());
    }

    /**
     * Retrieve Document and process it
     * <p>
     * Delete from solr, of not deleted then add too
     *
     * @param doc          The document to post to the solr (null if no
     *                     documents)
     * @param commitWithin optional - number of milliseconds before a
     *                     commit should occur
     * @throws IOException         if an retrieval error occurs
     * @throws SolrServerException if a sending error occurs
     */
    @Timed
    public void deploy(SolrInputDocument doc, Integer commitWithin) throws IOException, SolrServerException {

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
            if (commitWithin != null && commitWithin > 0) {
                updateRequest.setCommitWithin(commitWithin);
            }
            UpdateResponse resp = updateRequest.process(solrClient);
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
     * @param ids                  id's to delete from SolR
     * @param commitWithin         then to commit
     * @throws IOException         solr communication error
     * @throws SolrServerException solr communication error
     */
    //! Todo: add another n sub documents pr holdingid if more has been addad before last commit, also take into account the known subdocument ids from sourceDoc
    @Timed
    public void deleteSolrDocuments(String bibliographicShardId, List<String> ids, Integer commitWithin) throws IOException, SolrServerException {
        if (!ids.isEmpty()) {
            UpdateRequest updateRequest = new UpdateRequest();
            updateRequest.deleteById(ids);
            updateRequest.setParam("appId", config.getAppId());
            if (commitWithin != null && commitWithin > 0) {
                updateRequest.setCommitWithin(commitWithin);
            }
            UpdateResponse resp = updateRequest.process(solrClient);
            if (resp.getStatus() != 0) {
                throw new IllegalStateException("Got non-zero status: " + resp.getStatus() + " from solr on delete");
            }
        }
        log.debug("Ids deleted: {}", ids);
    }

    /**
     * Create the solr document with only the known field, inlining holdingitems
     * and synthesize fields
     *
     * @param sourceDoc the document from {@link  #fetchSourceDoc(dk.dbc.search.solrdocstore.queue.QueueJob)
     *                  }
     * @return null if deleted otherwise a expanded solr document
     * @throws PostponedNonFatalQueueError if unable to communicate with
     *                                     openagency
     */
    @Timed
    public SolrInputDocument createSolrDocument(JsonNode sourceDoc) throws PostponedNonFatalQueueError {
        boolean deleted = isDeleted(sourceDoc);
        log.trace("deleted = {}", deleted);
        SolrInputDocument doc = null;
        if (!deleted) {
            doc = inputDocument(sourceDoc);
        }
        return doc;
    }

    @Timed
    public List<String> documentsIdsByRoot(String id) throws IOException, SolrServerException {
        // Delete by query:
        // http://lucene.472066.n3.nabble.com/Nested-documents-deleting-the-whole-subtree-td4294557.html
        // Converted to nested to delete subdocuments only, then delete owner by id
        String query = "{!child of=\"t:m\"}id:" + ClientUtils.escapeQueryChars(id);
        log.debug("Delete by Query - Select: {}", query);
        SolrQuery req = new SolrQuery(query);
        req.setFields("id");
        req.setRows(MAX_ROWS_OF_SHARDED_SOLR);
        req.set("appId", config.getAppId());
        req.setStart(0);
        ArrayList<String> list = new ArrayList<>();
        list.add(id);
        solrClient.query(req).getResults().stream()
                .map(d -> String.valueOf(d.getFirstValue("id")))
                .forEach(list::add);
        return list;
    }

    /**
     * Get a json document from the solr-doc-store
     *
     * @param job What to fetch from solr-doc-store
     * @return the document collection
     * @throws IOException In case of http errors
     */
    @Timed
    public JsonNode fetchSourceDoc(QueueJob job) throws IOException {
        URI uri = uriTemplate.buildFromMap(mapForUri(job));
        log.debug("Fetching: {}", uri);
        Response response = client.target(uri)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();
        Response.StatusType status = response.getStatusInfo();
        if (status.getStatusCode() != HttpURLConnection.HTTP_OK) {
            throw new IOException("Could not access document " + uri + ": " + status);
        }
        if (!response.bufferEntity()) {
            throw new IOException("Could read document " + uri + ": not of buffer entity type");
        }
        Object entity = response.getEntity();
        if (!( entity instanceof InputStream )) {
            throw new IOException("Could read document " + uri + ": not of inputstream type");
        }
        JsonNode sourceDoc = OBJECT_MAPPER.readTree((InputStream) entity);
        log.trace("sourceDoc = {}", sourceDoc);
        return sourceDoc;
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
     * Check if a document is deleted
     *
     * @param collection from {@link #fetchSourceDoc(dk.dbc.search.solrdocstore.queue.QueueJob)
     *                   }
     * @return if it's deleted or not
     */
    public boolean isDeleted(JsonNode collection) {
        return find(collection, "bibliographicRecord", "deleted").asBoolean();
    }

    /**
     * Construct a solr input document from solr-doc-store content
     *
     * @param sourceDoc docstore collection
     * @return solr document
     * @throws PostponedNonFatalQueueError if unable to communicate with
     *                                     openagency
     */
    public SolrInputDocument inputDocument(JsonNode sourceDoc) throws PostponedNonFatalQueueError {
        try {
            String id = bibliographicShardId(sourceDoc);

            businessLogic.filterOutDecommissioned(sourceDoc);

            JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
            String repositoryId = getField(indexKeys, "rec.repositoryId");
            if (repositoryId == null) {
                throw new IllegalStateException("Cannot get rec.repositoryId from document");
            }

            setField(indexKeys, "id", id);
            setField(indexKeys, "t", "m"); // Manifestation type

            businessLogic.addRecHoldingsAgencyId(sourceDoc);
            businessLogic.addFromPartOfDanbib(sourceDoc);
            businessLogic.addCollectionIdentifier800000(sourceDoc);
            businessLogic.addHoldingsItemRole(sourceDoc);

            businessLogic.addScan(sourceDoc);

            businessLogic.attachedResources(sourceDoc);

            SolrInputDocument doc = solrFields.newDocumentFromIndexKeys(indexKeys);
            businessLogic.addNestedHoldingsDocuments(doc, sourceDoc, repositoryId);

            return doc;
        } catch (RuntimeException ex) {
            log.error("Exception: {}", ex.getMessage());
            log.debug("Exception: ", ex);
            throw ex;
        }
    }

    /**
     * Construct an id string with sharding info using bibliographicrecordid
     *
     * @param sourceDoc Json source document from solr-doc-store
     * @return string of parts joined with '-'
     */
    public static String bibliographicShardId(JsonNode sourceDoc) {
        JsonNode bibliographicRecord = find(sourceDoc, "bibliographicRecord");
        return shardId(bibliographicRecord);
    }

    /**
     * Construct an id string with sharding info using bibliographicrecordid
     *
     * @param bibliographicRecord Json source document from solr-doc-store
     * @return string of parts joined with '-'
     */
    static String shardId(JsonNode bibliographicRecord) {
        String agencyId = find(bibliographicRecord, "agencyId").asText();
        String classifier = find(bibliographicRecord, "classifier").asText();
        String bibliographicRecordId = find(bibliographicRecord, "bibliographicRecordId").asText();
        return bibliographicRecordId + "/32!" + String.join("-", agencyId, classifier, bibliographicRecordId);
    }

}
