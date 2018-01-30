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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
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
public class DocProducer {

    private static final Logger log = LoggerFactory.getLogger(DocProducer.class);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Inject
    Config config;

    @Inject
    SolrFields solrFields;

    private Client client;
    private UriBuilder uriTemplate;

    @PostConstruct
    public void init() {
        log.info("Building DocProducer");
        this.client = ClientBuilder.newClient();
        String solrDocStoreUrl = config.getSolrDocStoreUrl();
        log.debug("solrDocStoreUrl = {}", solrDocStoreUrl);
        this.uriTemplate = UriBuilder.fromUri(solrDocStoreUrl)
                .path("api/retrieve/combined/{agencyId}/{bibliographicRecordId}");
    }

    /**
     * Retrieve Document and process it
     * <p>
     * Delete from solr, of not deleted then add too
     *
     * @param agencyId              agency of document
     * @param bibliographicRecordId record id of document
     * @param client                Solr instance connection
     * @param commitWithin          optional - number of milliseconds before a
     *                              commit should occur
     * @throws IOException         if an retrieval error occurs
     * @throws SolrServerException if a sending error occurs
     */
    public void deploy(int agencyId, String bibliographicRecordId, SolrClient client, Integer commitWithin) throws IOException, SolrServerException {
        log.debug("agencyId = {}; bibliographicRecordId = {}", agencyId, bibliographicRecordId);
        JsonNode collection = get(agencyId, bibliographicRecordId);
        log.trace("collection = {}", collection);
        boolean deleted = isDeleted(collection);

        SolrInputDocument doc = null;
        if (!deleted) {
            doc = inputDocument(collection);
        }
        String id = shardId(find(collection, "bibliographicRecord"), "bibliographic");
        // Deletye by query:
        // http://lucene.472066.n3.nabble.com/Nested-documents-deleting-the-whole-subtree-td4294557.html
        String query = "_root_:" + ClientUtils.escapeQueryChars(id);
        log.debug("Delete by Query: {}", query);
        if (commitWithin == null || commitWithin <= 0) {
            client.deleteByQuery(query);
        } else {
            client.deleteByQuery(query, commitWithin);
        }
        if (doc != null) {
            log.debug("Adding document");
            log.trace("doc = {}", doc);
            if (commitWithin == null || commitWithin <= 0) {
                client.add(doc);
            } else {
                client.add(doc, commitWithin);
            }
        }
    }

    /**
     * Get a json document from the solr-doc-store
     *
     * @param agencyId              agency for a document
     * @param bibliographicRecordId recordid for document
     * @return the document collection
     * @throws IOException In case of http errors
     */
    public JsonNode get(int agencyId, String bibliographicRecordId) throws IOException {
        URI uri = uriTemplate.buildFromMap(mapForUri(agencyId, bibliographicRecordId));
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
        return OBJECT_MAPPER.readTree((InputStream) entity);
    }

    /**
     * Build a UriBuilder build map
     *
     * @param agencyId agency
     * @param bibliographicRecordId record
     * @return map
     */
    private static Map<String, String> mapForUri(int agencyId, String bibliographicRecordId) {
        HashMap<String, String> map = new HashMap<>();
        map.put("agencyId", String.valueOf(agencyId));
        map.put("bibliographicRecordId", bibliographicRecordId);
        return map;
    }

    /**
     * Check if a document is deleted
     *
     * @param collection from {@link #get(int, java.lang.String) }
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

        JsonNode indexKeys = find(collection, "bibliographicRecord", "indexKeys");
        setField(indexKeys, "id", id);
        setField(indexKeys, "t", "m"); // Manifestation type
        addField(indexKeys, "rec.childDocId", linkId);
        addRecHoldingsAgencyId(indexKeys, collection);
        SolrInputDocument doc = newDocumentFromIndexKeys(indexKeys);
        addNestedHoldingsDocuments(doc, collection, linkId);

        return doc;
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
     * @param doc        root solr document
     * @param collection document containing holdings
     * @param linkId     id for linking foe solr join searches
     */
    private void addNestedHoldingsDocuments(SolrInputDocument doc, JsonNode collection, String linkId) {
        JsonNode records = find(collection, "holdingsItemRecords");
        for (JsonNode record : records) {
            String id = shardId(record, "holdings");
            JsonNode indexKeyList = find(record, "indexKeys");
            int i = 0;
            for (JsonNode indexKeys : indexKeyList) {
                setField(indexKeys, "id" + "#" + i++, id);
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
     * @param record Json node with agencyid/bibliographicrecordid
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
                }
            }
        }
        return doc;
    }

}
