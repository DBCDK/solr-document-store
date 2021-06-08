package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import java.io.IOException;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class SolrIndexKeys {

    private static final ObjectMapper O = new ObjectMapper();
    public static final IndexKeysList ON_SHELF = holdingsIndexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
    public static final IndexKeysList NO_HOLDINGS = holdingsIndexKeys("[]");

    public static IndexKeys biblIndexKeys(String json) {
        try {
            return O.readValue(json.replaceAll("'", "\""), IndexKeys.class);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static IndexKeysList holdingsIndexKeys(String json) {
        try {
            return O.readValue(json.replaceAll("'", "\""), IndexKeysList.class);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

}
