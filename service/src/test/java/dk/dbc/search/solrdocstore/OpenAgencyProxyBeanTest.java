package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import javax.ejb.EJBException;
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

    OpenAgencyProxyBean openAgencyLoader;

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
    public void openAgencyParser15() throws Exception {
        System.out.println("openAgencyParser15");

        OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(150059);
        System.out.println("150059 = " + openAgency);
        assertEquals(new OpenAgencyEntity(150059, LibraryType.NonFBS, false, false, false), openAgency);
    }

    @Test
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
