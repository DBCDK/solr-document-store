package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.ee.stats.Timed;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.ejb.EJBException;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.cloud.ClusterState;
import org.apache.solr.common.cloud.Replica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class SolrFields {

    private static final Logger log = LoggerFactory.getLogger(SolrFields.class);

    private static final DocumentBuilder DOCUMENT_BUILDER = newDocumentBuilder();
    private static final int MAX_SOLR_FIELD_VALUE_SIZE = 32000;

    private final ConcurrentHashMap<String, Boolean> knownFields;
    private final ArrayList<String[]> dynamicFieldSpecs;

    @Inject
    Config config;

    public SolrFields() {
        this.knownFields = new ConcurrentHashMap<>();
        this.dynamicFieldSpecs = new ArrayList<>();
    }

    @PostConstruct
    public void init() {
        log.info("Getting solr fields");
        URI uri = UriBuilder.fromPath(getUrl())
                .path("admin/file")
                .queryParam("file", "schema.xml")
                .build();
        log.debug("fetching: uri = {}", uri);
        Object entity = getSchemaXml(uri);
        Document doc;
        try {
            doc = DOCUMENT_BUILDER.parse((InputStream) entity);
        } catch (SAXException | IOException ex) {
            throw new EJBException("Error parsing response from: " + uri, ex);
        }
        processDoc(doc);
    }

    /**
     * Find an url for any solr client, that should provide a schema.xml
     *
     * @return url as string
     */
    String getUrl() {
        SolrClient client = SolrApi.makeSolrClient(config.getSolrUrl());
        if (client instanceof HttpSolrClient) {
            return config.getSolrUrl();
        }
        if (client instanceof CloudSolrClient) {
            CloudSolrClient cloud = (CloudSolrClient) client;

            String collectionName = cloud.getDefaultCollection();
            ClusterState state = cloud.getZkStateReader().getClusterState();
            Set<String> nodes = state.getLiveNodes();
            if (nodes.isEmpty()) {
                throw new IllegalArgumentException("Zookeeper don't know about live nodes");
            }

            List<Replica> liveReplicas = state.getCollection(collectionName)
                    .getReplicas()
                    .stream()
                    .filter(r -> nodes.contains(r.getNodeName()))
                    .collect(Collectors.toList());
            if (liveReplicas.isEmpty()) {
                throw new IllegalArgumentException("Zookeeper don't know any live replicas");
            }

            Replica replica = liveReplicas.get((int) Math.floor(Math.random() * liveReplicas.size()));
            return replica.getBaseUrl() + "/" + collectionName;
        }
        throw new IllegalStateException("Don't know about this solr client type: " + client.getClass().getSimpleName());
    }

    /**
     * Lookup field in knownFields, if nonexistent get a value from
     * dynamicFieldSpecs
     *
     * @param name name of field
     * @return is it known by the solr
     */
    public boolean isKnownField(String name) {
        return knownFields.computeIfAbsent(name, this::getKnownDynamicField);
    }

    /**
     * Iterate over dynamicFieldSpecs looking for any that matches
     *
     * @param name name of field
     * @return if any matches
     */
    private boolean getKnownDynamicField(String name) {
        for (String[] dynamicFieldParts : dynamicFieldSpecs) {
            int offset = 0;
            int i = 0;
            for (;;) {
                int pos = name.indexOf(dynamicFieldParts[i], offset);
                if (pos < 0) {
                    break;
                }
                offset = pos + dynamicFieldParts[i].length();
                if (++i == dynamicFieldParts.length) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Get inputstream of schema xml url
     *
     * @param uri where schema xml is sopposed to be found
     * @return content stream
     */
    InputStream getSchemaXml(URI uri) {
        Response response = ClientBuilder.newClient()
                .target(uri)
                .request(MediaType.APPLICATION_XML_TYPE)
                .get();
        Response.StatusType status = response.getStatusInfo();
        if (status.getStatusCode() != 200) {
            throw new EJBException("Cannot get " + uri + ": " + status);
        }
        if (!response.bufferEntity()) {
            throw new EJBException("Response from " + uri + " is not a buffer entity");
        }
        Object entity = response.getEntity();
        if (!( entity instanceof InputStream )) {
            throw new EJBException("Response from " + uri + " is not an InputStream");
        }
        return (InputStream) entity;
    }

    /**
     * Process the document extracting the field and dynamicFields
     *
     * @param doc schema.xml content
     */
    private void processDoc(Document doc) {
        log.info("Processing schema.xml");
        Element root = doc.getDocumentElement();
        Element fields = getElement(root, "fields");
        for (Node child = fields.getFirstChild() ; child != null ; child = child.getNextSibling()) {
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                Element field = (Element) child;
                switch (child.getNodeName()) {
                    case "field":
                        knownFields.put(field.getAttribute("name"), true);
                        break;
                    case "dynamicField":
                        dynamicFieldSpecs.add(field.getAttribute("name").split("\\*+"));
                        break;
                    default:
                        break;
                }

            }
        }
    }

    /**
     * Find an given element inside this element
     *
     * @param node the containing node
     * @param name name of the element
     * @return the first element of said name
     */
    private static Element getElement(Element node, String name) {
        for (Node child = node.getFirstChild() ; child != null ; child = child.getNextSibling()) {
            if (child.getNodeType() == Node.ELEMENT_NODE &&
                child.getNodeName().equals(name)) {
                return (Element) child;
            }
        }
        throw new EJBException("Cound not find XML element: " + name);
    }

    /**
     * Construct an xml parser
     *
     * @return new document builder
     */
    private static DocumentBuilder newDocumentBuilder() {
        try {
            synchronized (DocumentBuilderFactory.class) {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                factory.setIgnoringComments(true);
                factory.setNamespaceAware(true);
                factory.setCoalescing(true);
                factory.setIgnoringElementContentWhitespace(true);
                factory.setValidating(false);
                factory.setXIncludeAware(false);
                return factory.newDocumentBuilder();
            }
        } catch (ParserConfigurationException ex) {
            throw new EJBException("Error making a XML parser", ex);
        }
    }

    /**
     * Construct a document from indexKeys filtered by what the solr knows about
     *
     * @param indexKeys document keys
     * @return new document
     */
    @Timed
    SolrInputDocument newDocumentFromIndexKeys(JsonNode indexKeys) {
        if (indexKeys.isObject()) {
            trimIndexFieldsLength((ObjectNode) indexKeys, MAX_SOLR_FIELD_VALUE_SIZE);
        }
        SolrInputDocument doc = new SolrInputDocument();
        if (indexKeys.isObject()) {
            for (Iterator<String> nameIterator = indexKeys.fieldNames() ; nameIterator.hasNext() ;) {
                String name = nameIterator.next();
                if (isKnownField(name)) {
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
}
