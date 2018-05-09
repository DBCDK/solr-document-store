package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class HoldingsSolrKeys {

    private static final ObjectMapper O = new ObjectMapper();
    public static final List<Map<String, List<String>>> DECOMMISSIONED = indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]}]");
    public static final List<Map<String, List<String>>> ON_SHELF = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
    public static final List<Map<String, List<String>>> ON_SHELF_AND_DECOMMISSIONED = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\", \"Decommissioned\"]}]");

    private static List<Map<String, List<String>>> indexKeys(String json) {
        try {
            return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>() {
                       });
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

}
