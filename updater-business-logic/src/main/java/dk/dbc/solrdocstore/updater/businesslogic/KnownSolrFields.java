package dk.dbc.solrdocstore.updater.businesslogic;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
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
public class KnownSolrFields {

    private static final Logger log = LoggerFactory.getLogger(KnownSolrFields.class);

    private static final DocumentBuilder DOCUMENT_BUILDER = newDocumentBuilder();

    private final ConcurrentHashMap<String, Boolean> knownFields;
    private final ArrayList<String[]> dynamicFieldSpecs;

    protected KnownSolrFields() {
        this.knownFields = null;
        this.dynamicFieldSpecs = null;
    }

    public KnownSolrFields(InputStream is) throws SAXException, IOException {
        this(DOCUMENT_BUILDER.parse(is));
    }

    public KnownSolrFields(Document doc) {
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
        throw new IllegalStateException("Cound not find XML element: " + name);
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
            throw new IllegalArgumentException("Error making a XML parser", ex);
        }
    }
}
