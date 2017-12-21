package dk.dbc.search.solrdocstore.openagency.libraryrules;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Iterator;

public class JSONParser {

    private static final Logger log = LoggerFactory.getLogger(JSONParser.class);

    public static LibraryRules getLibraryRules(String jsonInput){
        LibraryRules result = new LibraryRules();
        JsonNode productNode = parseJSON(jsonInput);
        JsonNode rootElement = getRootElement(productNode);
        result.agencyType = getAsText(rootElement,"agencyType");
        result.canUseEnrichments = findUseEnrichments(rootElement);
        return result;
    }

    protected static JsonNode parseJSON(String jsonInput) {

        try {
            return new ObjectMapper().readTree(jsonInput);
        } catch (IOException e) {
            log.error("Failed to parse JSON. {}",jsonInput);
            throw new LibraryRuleException("Failed to parse JSON",e);
        }
    }

    protected static Boolean findUseEnrichments(JsonNode rootElement) {
        Iterator<JsonNode> libraryRuleIterator = getNodeFailIfNull(rootElement,"libraryRule").elements();

        while(libraryRuleIterator.hasNext()) {
            JsonNode e = libraryRuleIterator.next();
            String name = getAsText(e,"name");
            if ("use_enrichments".equals(name)){
                String boolAsText = getAsText(e,"bool");
                return "1".equals(boolAsText);
            }
        }
        throw new LibraryRuleException("Failed to find use_enrichments in libraryRule elements");
    }

    protected static String getAsText(JsonNode e, String fieldName) {
        JsonNode jsonNode = e.get(fieldName);
        failIfNull(jsonNode,fieldName);
        jsonNode = jsonNode.get("$");
        failIfNull(jsonNode,fieldName+"/$");
        return jsonNode.asText();
    }

    protected static JsonNode getRootElement(JsonNode productNode) {
        JsonNode n = productNode;
        n = getNodeFailIfNull(n,"libraryRulesResponse");
        n = getNodeFailIfNull(n,"libraryRules");
        JsonNode libraryRules = n.get(0);
        failIfNull(n,"No elements under libraryRulesResponse/libraryRules");
        return libraryRules;
    }

    protected static JsonNode getNodeFailIfNull(JsonNode n, String elementname) {
        JsonNode result = n.get(elementname);
        failIfNull(result,elementname);
        return result;
    }

    protected static void failIfNull(JsonNode jsonNode, String fieldName) {
        if (jsonNode==null){
            log.error("Failed to read element: \"{}\" from input \"{}\"",fieldName,jsonNode);
            throw new LibraryRuleException("Failed to read field " + fieldName);
        }
    }

}
