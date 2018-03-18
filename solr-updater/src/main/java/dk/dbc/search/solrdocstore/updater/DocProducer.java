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
package dk.dbc.search.solrdocstore.updater;

import com.codahale.metrics.Timer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class DocProducer {

    private static final Logger log = LoggerFactory.getLogger(DocProducer.class);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final int MAX_ROWS_OF_SHARDED_SOLR = 10000;
    private static final int MAX_SOLR_FIELD_VALUE_SIZE = 32000;

    @Inject
    Config config;

    @Inject
    SolrFields solrFields;

    @Inject
    Timer fetchTimer;

    @Inject
    Timer selectByRootTimer;

    @Inject
    Timer deleteByIdTimer;

    @Inject
    Timer addDocumentTimer;

    private Client client;
    private UriBuilder uriTemplate;
    SolrClient solrClient;

    private static final Timer UNITTESTING_TIMER = new Timer();

    public DocProducer() {
        // Create timers for unit testing
        fetchTimer = deleteByIdTimer = selectByRootTimer = addDocumentTimer = UNITTESTING_TIMER;
    }

    @PostConstruct
    public void init() {
        log.info("Building DocProducer");
        this.client = ClientBuilder.newClient();
        String solrDocStoreUrl = config.getSolrDocStoreUrl();
        log.debug("solrDocStoreUrl = {}", solrDocStoreUrl);
        this.uriTemplate = UriBuilder.fromUri(solrDocStoreUrl)
                .path("api/retrieve/combined/{agencyId}/{bibliographicRecordId}");
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
            try (Timer.Context time = addDocumentTimer.time()) {
                if (commitWithin == null || commitWithin <= 0) {
                    solrClient.add(doc);
                } else {
                    solrClient.add(doc, commitWithin);
                }
            }
        }
    }

    /**
     * Delete documents from solr, by searching all those with
     * _root_:${biblShardId}
     *
     * @param bibliographicShardId the root id of the document to purge
     * @param commitWithin         then to commit
     * @throws IOException         solr communication error
     * @throws SolrServerException solr communication error
     */
    //! Todo: add another n sub documents pr holdingid if more has been addad before last commit, also take into account the known subdocument ids from sourceDoc
    public void deleteSolrDocuments(String bibliographicShardId, Integer commitWithin) throws IOException, SolrServerException {
        List<String> ids = documentsIdsByRoot(bibliographicShardId, solrClient);
        if (!ids.isEmpty()) {
            try (Timer.Context time = deleteByIdTimer.time()) {
                if (commitWithin == null || commitWithin <= 0) {
                    solrClient.deleteById(ids);
                } else {
                    solrClient.deleteById(ids, commitWithin);
                }
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
     */
    public SolrInputDocument createSolrDocument(JsonNode sourceDoc) {
        boolean deleted = isDeleted(sourceDoc);
        log.trace("deleted = {}", deleted);
        SolrInputDocument doc = null;
        if (!deleted) {
            doc = inputDocument(sourceDoc);
        }
        return doc;
    }

    private List<String> documentsIdsByRoot(String id, SolrClient client1) throws IOException, SolrServerException {
        // Delete by query:
        // http://lucene.472066.n3.nabble.com/Nested-documents-deleting-the-whole-subtree-td4294557.html
        // Converted to nested to delete subdocuments only, then delete owner by id
        String query = "{!child of=\"t:m\"}id:" + ClientUtils.escapeQueryChars(id);
        log.debug("Delete by Query - Select: {}", query);
        SolrQuery req = new SolrQuery(query);
        req.setFields("id");
        req.setRows(MAX_ROWS_OF_SHARDED_SOLR);
        req.setStart(0);
        try (final Timer.Context time = selectByRootTimer.time()) {
            ArrayList<String> list = new ArrayList<>();
            list.add(id);
            client1.query(req).getResults().stream()
                    .map(d -> String.valueOf(d.getFirstValue("id")))
                    .forEach(list::add);
            return list;
        }
    }

    /**
     * Get a json document from the solr-doc-store
     *
     * @param job What to fetch from solr-doc-store
     * @return the document collection
     * @throws IOException In case of http errors
     */
    public JsonNode fetchSourceDoc(QueueJob job) throws IOException {
        URI uri = uriTemplate.buildFromMap(mapForUri(job));
        log.debug("Fetching: {}", uri);
        Response response;
        try (Timer.Context time = fetchTimer.time()) {
            response = client.target(uri)
                    .request(MediaType.APPLICATION_JSON_TYPE)
                    .get();
        }
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
     * @param collection from {@link #fetchSourceDoc(dk.dbc.search.solrdocstore.queue.QueueJob)  }
     * @return if it's deleted or not
     */
    public boolean isDeleted(JsonNode collection) {
        return find(collection, "bibliographicRecord", "deleted").asBoolean();
    }

    /**
     * Construct a solr input document from solr-doc-store content
     *
     * @param collection docstore collection
     * @return solr document
     */
    public SolrInputDocument inputDocument(JsonNode collection) {
        String id = shardId(find(collection, "bibliographicRecord"), "bibliographic");
        String linkId = id(find(collection, "bibliographicRecord"), "link");

        filterOutDecommissioned(collection);

        JsonNode indexKeys = find(collection, "bibliographicRecord", "indexKeys");
        String repositoryId = getField(indexKeys, "rec.repositoryId");
        if (repositoryId == null) {
            throw new IllegalStateException("Cannot get rec.repositoryId from document");
        }

        setField(indexKeys, "id", id);
        setField(indexKeys, "t", "m"); // Manifestation type
        addField(indexKeys, "rec.childDocId", linkId);
        addRecHoldingsAgencyId(indexKeys, collection);
        SolrInputDocument doc = newDocumentFromIndexKeys(indexKeys);
        addNestedHoldingsDocuments(doc, collection, linkId, repositoryId);

        return doc;
    }

    private void filterOutDecommissioned(JsonNode collection) {
        JsonNode records = find(collection, "holdingsItemRecords");
        if (records == null) {
            return;
        }

        for (Iterator<JsonNode> i1 = records.elements() ; i1.hasNext() ;) {
            boolean keepRecord = false;
            JsonNode record = i1.next();
            for (Iterator<JsonNode> i2 = find(record, "indexKeys").elements() ; i2.hasNext() ;) {
                boolean keepHoldingsDocument = false;
                JsonNode holdingsRecord = i2.next();
                for (Iterator<JsonNode> i3 = holdingsRecord.withArray("holdingsitem.status").elements() ; i3.hasNext() ;) {
                    String status = i3.next().asText("");
                    if (status.equalsIgnoreCase("decommissioned")) {
                        i3.remove();
                    } else {
                        keepHoldingsDocument = true;
                    }
                }
                if (keepHoldingsDocument) {
                    keepRecord = true;
                } else {
                    i2.remove();
                }
            }
            if (!keepRecord) {
                i1.remove();
            }
        }
    }

    static void trimIndexFieldsLength(ObjectNode indexKeys, int maxLength) {
        for (Iterator<Map.Entry<String, JsonNode>> entries = indexKeys.fields() ; entries.hasNext() ;) {
            Map.Entry<String, JsonNode> entry = entries.next();
            JsonNode oldValue = entry.getValue();
            ArrayNode newValue = indexKeys.putArray(entry.getKey());
            for (Iterator<JsonNode> texts = oldValue.iterator() ; texts.hasNext() ;) {
                String text = texts.next().asText();
                if (text.length() > maxLength) {
                    text = text.substring(0, maxLength);
                }
                newValue.add(text);
            }
        }
    }

    /**
     * Find all holdings agencies and record them
     *
     * @param indexKeys  solr output document
     * @param collection entire json from solr-doc-store
     */
    private void addRecHoldingsAgencyId(JsonNode indexKeys, JsonNode collection) {
        JsonNode records = find(collection, "holdingsItemRecords");
        for (JsonNode record : records) {
            JsonNode holdingsIndexKeys = find(record, "indexKeys");
            if (holdingsIndexKeys != null && holdingsIndexKeys.size() > 0) {
                String agency = find(record, "agencyId").asText();
                addField(indexKeys, "rec.holdingsAgencyId", agency);
            }
        }
    }

    /**
     * Append all holdings as nested document
     *
     * @param doc          root solr document
     * @param collection   document containing holdings
     * @param linkId       id for linking foe solr join searches
     * @param repositoryId id of record used by
     */
    private void addNestedHoldingsDocuments(SolrInputDocument doc, JsonNode collection, String linkId, String repositoryId) {
        JsonNode records = find(collection, "holdingsItemRecords");
        for (JsonNode record : records) {
            String id = shardId(record, "holdings");
            JsonNode indexKeyList = find(record, "indexKeys");
            int i = 0;
            for (JsonNode indexKeys : indexKeyList) {
                setField(indexKeys, "rec.repositoryId", repositoryId);
                setField(indexKeys, "id", id + "#" + i++);
                setField(indexKeys, "t", "h"); // Holdings type
                addField(indexKeys, "parentDocId", linkId);
                SolrInputDocument nested = newDocumentFromIndexKeys(indexKeys);
                doc.addChildDocument(nested);
            }
        }
    }

    /**
     * Construct an id string with sharding info using bibliographicrecordid
     *
     * @param sourceDoc Json source document from solr-doc-store
     * @return string of parts joined with '-'
     */
    public String bibliographicShardId(JsonNode sourceDoc) {
        return shardId(find(sourceDoc, "bibliographicRecord"), "bibliographic");
    }

    /**
     * Construct an id string with sharding info using bibliographicrecordid
     *
     * @param record Json source document from solr-doc-store
     * @param type   id prefix
     * @return string of parts joined with '-'
     */
    private String shardId(JsonNode record, String type) {
        String bibliographicRecordId = find(record, "bibliographicRecordId").asText();
        return bibliographicRecordId + "/32!" + id(record, type);
    }

    /**
     * Construct an id string
     *
     * @param record Json node with agencyid/bibliographicrecordid
     * @param type   id prefix
     * @return string of parts joined with '-'
     */
    private String id(JsonNode record, String type) {
        String bibliographicRecordId = find(record, "bibliographicRecordId").asText();
        String agencyId = find(record, "agencyId").asText();
        return String.join("-", type, agencyId, bibliographicRecordId);
    }

    /**
     * Find a node in a json structure
     *
     * @param node  start node
     * @param index list of node names
     * @return nested node
     */
    private static JsonNode find(JsonNode node, String... index) {
        String path = "";
        for (String name : index) {
            if (path.isEmpty()) {
                path = name;
            } else {
                path = path + "/" + name;
            }
            if (!node.has(name)) {
                throw new IllegalArgumentException("Cannot locate node: " + path + " in document");
            }
            node = node.get(name);
        }
        return node;
    }

    /**
     * Add a value to an indexKeys node
     *
     * @param indexKeys target node
     * @param name      name of key
     * @param value     content to add
     * @throws IllegalStateException if indexKeys isn't an json object node
     */
    private void addField(JsonNode indexKeys, String name, String value) {
        if (!indexKeys.isObject()) {
            log.debug("Cannot add " + name + " to non Object Document: " + indexKeys);
            throw new IllegalStateException("Cannot add " + name + " to non Object Document");
        }
        JsonNode idNode = indexKeys.get(name);
        if (idNode == null || !idNode.isArray()) {
            idNode = ( (ObjectNode) indexKeys ).putArray(name);
        }
        ( (ArrayNode) idNode ).add(value);
    }

    /**
     * Get first value in an indexKeys node
     *
     * @param indexKeys target node
     * @param name      name of key
     * @throws IllegalStateException if indexKeys isn't an json object node
     */
    private String getField(JsonNode indexKeys, String name) {
        if (!indexKeys.isObject()) {
            log.debug("Cannot set " + name + " in non Object Document: " + indexKeys);
            throw new IllegalStateException("Cannot add " + name + " to non Object Document");
        }

        JsonNode array = ( (ObjectNode) indexKeys ).get(name);
        if (array == null || !array.isArray() || array.size() == 0) {
            return null;
        }
        return array.get(0).asText();
    }

    /**
     * Set a value in an indexKeys node
     *
     * @param indexKeys target node
     * @param name      name of key
     * @param value     content to set/override
     * @throws IllegalStateException if indexKeys isn't an json object node
     */
    private void setField(JsonNode indexKeys, String name, String value) {
        if (!indexKeys.isObject()) {
            log.debug("Cannot set " + name + " in non Object Document: " + indexKeys);
            throw new IllegalStateException("Cannot add " + name + " to non Object Document");
        }
        ( (ObjectNode) indexKeys ).putArray(name).add(value);
    }

    /**
     * Construct a document from indexKeys filtered by what the solr knows about
     *
     * @param indexKeys document keys
     * @return new document
     */
    private SolrInputDocument newDocumentFromIndexKeys(JsonNode indexKeys) {
        if (indexKeys.isObject()) {
            trimIndexFieldsLength((ObjectNode) indexKeys, MAX_SOLR_FIELD_VALUE_SIZE);
        }
        SolrInputDocument doc = new SolrInputDocument();
        if (indexKeys.isObject()) {
            for (Iterator<String> nameIterator = indexKeys.fieldNames() ; nameIterator.hasNext() ;) {
                String name = nameIterator.next();
                if (solrFields.isKnownField(name)) {
                    JsonNode array = indexKeys.get(name);
                    ArrayList<String> values = new ArrayList<>(array.size());
                    for (Iterator<JsonNode> valueIterator = array.iterator() ; valueIterator.hasNext() ;) {
                        values.add(valueIterator.next().asText(""));
                    }
                    doc.addField(name, values);
                } else {
                    log.trace("Unknown field: {}", name);
                }
            }
        }
        return doc;
    }

}
