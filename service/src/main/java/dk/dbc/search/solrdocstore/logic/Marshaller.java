package dk.dbc.search.solrdocstore.logic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class Marshaller {

    private static final ObjectMapper O = new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    public <T> T unmarshall(String json, Class<T> clazz) throws JsonProcessingException {
        return O.readValue(json, clazz);
    }

    public String marshall(Object content) throws JsonProcessingException {
        return O.writeValueAsString(content);
    }
}
