package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.ejb.EJBException;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class SolrFields {

    private static final Logger log = LoggerFactory.getLogger(SolrFields.class);

    private static final int MAX_SOLR_FIELD_VALUE_SIZE = 32000;

    private final ConcurrentHashMap<String, Boolean> knownFields;
    private final ArrayList<String[]> dynamicFieldSpecs;

    SolrFields() {
        this.knownFields = new ConcurrentHashMap<>();
        this.dynamicFieldSpecs = new ArrayList<>();
    }


    public SolrFields(Document doc) {
        this.knownFields = new ConcurrentHashMap<>();
        this.dynamicFieldSpecs = new ArrayList<>();
        processDoc(doc);
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
     * Construct a document from indexKeys filtered by what the solr knows about
     *
     * @param indexKeys document keys
     * @return new document
     */
    @Timed(reusable = true)
    public SolrInputDocument newDocumentFromIndexKeys(JsonNode indexKeys) {
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
                    int pos = text.lastIndexOf(' ', maxLength);
                    if (pos <= 0) {
                        pos = maxLength;
                    }
                    text = text.substring(0, pos);
                }
                newValue.add(text);
            }
        }
    }
}
