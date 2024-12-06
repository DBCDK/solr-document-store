package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.logic.OpenAgencyProxyBean;
import jakarta.ejb.EJBException;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyProxyBeanTest {

    private OpenAgencyProxyBean proxy = new MockOpenAgencyProxyBean();

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void openAgencyParser() throws Exception {
        System.out.println("openAgencyParser");

        OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(LibraryType.COMMON_AGENCY);
        System.out.println("COMMON_AGENCY = " + openAgency);
        assertEquals(new OpenAgencyEntity(LibraryType.COMMON_AGENCY, LibraryType.NonFBS, true, false, true), openAgency);
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void openAgencyParser15() throws Exception {
        System.out.println("openAgencyParser15");

        OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(150059);
        System.out.println("150059 = " + openAgency);
        assertEquals(new OpenAgencyEntity(150059, LibraryType.NonFBS, false, false, false), openAgency);
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void openAgencyParserAgencyGone() throws Exception {
        System.out.println("openAgencyParserAgencyGone");

        try {
            OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(999999);
            System.out.println("999999 = " + openAgency);
            fail("Expected EJBException");
        } catch (EJBException ex) {
        }
    }
}
