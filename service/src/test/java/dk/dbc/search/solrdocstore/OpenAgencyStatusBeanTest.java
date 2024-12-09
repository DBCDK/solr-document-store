package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.response.OpenAgencyStatusResponse;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.v2.OpenAgencyStatusBeanV2;
import java.net.URLEncoder;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyStatusBeanTest extends BeanTester {

    private static final String BIB_ID = "23645564";

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getStatusOk() throws Exception {
        System.out.println("getStatusOk");
        persist(new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true));
        bean(bf -> {
            OpenAgencyStatusResponse status = (OpenAgencyStatusResponse) bf.openAgencyStatusBeanV2().getStatus().getEntity();
            assertThat(status.ok, is(true));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getStatusNotOk() throws Exception {
        System.out.println("getStatusNotOk");
        OpenAgencyEntity entity = new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false);
        entity.setValid(false);
        persist(entity);

        bean(bf -> {
            bf.openAgencyProxyBean(new MockOpenAgencyProxyBean());
            OpenAgencyStatusResponse status = (OpenAgencyStatusResponse) bf.openAgencyStatusBeanV2().getStatus().getEntity();
            assertThat(status.ok, is(false));
            OpenAgencyStatusResponse.Diag diag = status.states.get(711100);
            assertThat(diag.openAgency, not(is(diag.solrDocStore)));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void hashProducesUriSafe() throws Exception {
        System.out.println("hashProducesUriSafe");
        for (int i = 0 ; i < 33 ; i++) {
            String hash = new OpenAgencyStatusBeanV2().hash(i);
            String uri = URLEncoder.encode(hash, "UTF-8");
            assertThat(hash, is(uri));
        }
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void purgeEnqueuesWhenHasLiveHoldings() throws Exception {
        System.out.println("purgeEnqueuesWhenHasLiveHoldings");

        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(711111, LibraryType.FBS, true, true, true),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.holdingsItem(711111, BIB_ID).addHolding(filler -> filler.status("OnShelf")),
                new HoldingsToBibliographicEntity(711111, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            String status = (String) bf.openAgencyStatusBeanV2()
                    .purgeAgency(711111, "").getEntity();

            System.out.println("status = " + status);
            assertThat(status, not(containsString("SUCCESS")));
        });
    }

}
