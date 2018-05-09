package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyProxyBeanTest {

    private static final ObjectMapper O = new ObjectMapper();

    private OpenAgencyProxyBean proxy;

    @Before
    public void setUp() {
        proxy = createOpenAgencyProxyBean();
    }

    @Test
    public void openAgencyParser() throws Exception {
        System.out.println("openAgencyParser");

        OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(COMMON_AGENCY);
        System.out.println("COMMON_AGENCY = " + openAgency);
        assertEquals(makeOpenAgencyEntity(COMMON_AGENCY), openAgency);
    }

    @Test
    public void openAgencyParserAgencyGone() throws Exception {
        System.out.println("openAgencyParserAgencyGone");

        OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(999999);
        System.out.println("999999 = " + openAgency);
        assertNull(openAgency);
    }

}
