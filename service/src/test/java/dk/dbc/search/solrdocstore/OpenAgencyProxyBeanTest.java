package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyProxyBeanTest {

    private static final ObjectMapper O = new ObjectMapper();


    @Test
    public void openAgencyParser() throws Exception {
        System.out.println("openAgencyParser");

        OpenAgencyProxyBean openAgencyLoader = makeBean();

        OpenAgencyEntity openAgency = openAgencyLoader.loadOpenAgencyEntry(LibraryType.COMMON_AGENCY);
        System.out.println("COMMON_AGENCY = " + openAgency);
        assertEquals(new OpenAgencyEntity(LibraryType.COMMON_AGENCY, LibraryType.NonFBS, true, true), openAgency);
    }

    @Test
    public void openAgencyParserAgencyGone() throws Exception {
        System.out.println("openAgencyParserAgencyGone");

        OpenAgencyProxyBean openAgencyLoader = makeBean();

        OpenAgencyEntity openAgency = openAgencyLoader.loadOpenAgencyEntry(999999);
        System.out.println("999999 = " + openAgency);
        assertNull(openAgency);
    }

    private static OpenAgencyProxyBean makeBean() {
        return  new OpenAgencyProxyBean() {

            @Override
            public JsonNode loadOpenAgencyJson(int agencyId) {
                try {
                    String resource = "openagency-" + agencyId + ".json";
                    return O.readTree(OpenAgencyProxyBeanTest.class.getClassLoader().getResourceAsStream(resource));
                } catch (IOException ex) {
                    return null;
                }
            }
        };
    }

}
