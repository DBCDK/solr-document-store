package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import java.io.IOException;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class HoldingsSolrKeys {

    private static final ObjectMapper O = new ObjectMapper();
    public static final IndexKeysList ON_SHELF = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");

    public static IndexKeysList indexKeys(String json) {
        try {
            return O.readValue(json.replaceAll("'", "\""), IndexKeysList.class);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

}
