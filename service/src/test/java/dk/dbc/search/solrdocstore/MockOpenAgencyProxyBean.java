package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.search.solrdocstore.logic.OpenAgencyProxyBean;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class MockOpenAgencyProxyBean extends OpenAgencyProxyBean {

    private static final ObjectMapper O = new ObjectMapper();

    @Override
    protected LibraryRulesResponse getLibraryRuleResponse(int agencyId) throws OpenAgencyException, JsonProcessingException, IOException {
        String resource = "openagency-" + agencyId + ".json";
        try (InputStream is = OpenAgencyProxyBeanTest.class.getClassLoader().getResourceAsStream(resource)) {
            return O.readValue(is, LibraryRulesResponse.class);
        }
    }

}
