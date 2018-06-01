package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DocHelpers {

    private static final Logger log = LoggerFactory.getLogger(DocHelpers.class);

    /**
     * Add a value to an indexKeys node
     *
     * @param indexKeys target node
     * @param name      name of key
     * @param value     content to add
     * @throws IllegalStateException if indexKeys isn't an json object node
     */
    static void addField(JsonNode indexKeys, String name, String value) {
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
    static String getField(JsonNode indexKeys, String name) {
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
    static void setField(JsonNode indexKeys, String name, String value) {
        if (!indexKeys.isObject()) {
            log.debug("Cannot set " + name + " in non Object Document: " + indexKeys);
            throw new IllegalStateException("Cannot add " + name + " to non Object Document");
        }
        ( (ObjectNode) indexKeys ).putArray(name).add(value);
    }

    /**
     * Find a node in a json structure
     *
     * @param node  start node
     * @param index list of node names
     * @return nested node
     */
    static JsonNode find(JsonNode node, String... index) {
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

}
