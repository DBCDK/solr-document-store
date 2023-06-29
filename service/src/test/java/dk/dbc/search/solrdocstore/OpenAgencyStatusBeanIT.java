package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.response.OpenAgencyStatusResponse;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import java.net.URLEncoder;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.SolrIndexKeys.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyStatusBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void getStatusOk() throws Exception {
        System.out.println("getStatusOk");
        jpa(em -> {
            OpenAgencyStatusBean openAgencyStatus = createOpenAgencyStatusBean(em);
            em.persist(new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true));
            OpenAgencyStatusResponse status = (OpenAgencyStatusResponse) openAgencyStatus.getStatus().getEntity();
            assertThat(status.ok, is(true));
        });
    }

    @Test
    public void getStatusNotOk() throws Exception {
        System.out.println("getStatusNotOk");
        jpa(em -> {
            OpenAgencyStatusBean openAgencyStatus = createOpenAgencyStatusBean(em);
            OpenAgencyEntity entity = new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false);
            entity.setValid(false);
            em.persist(entity);
            OpenAgencyStatusResponse status = (OpenAgencyStatusResponse) openAgencyStatus.getStatus().getEntity();
            assertThat(status.ok, is(false));
            OpenAgencyStatusResponse.Diag diag = status.states.get(711100);
            assertThat(diag.openAgency, not(is(diag.solrDocStore)));
        });
    }

    @Test
    public void hashProducesUriSafe() throws Exception {
        System.out.println("hashProducesUriSafe");
        for (int i = 0 ; i < 33 ; i++) {
            String hash = new OpenAgencyStatusBean().hash(i);
            String uri = URLEncoder.encode(hash, "UTF-8");
            assertThat(hash, is(uri));
        }
    }

    @Test
    public void purgeEnqueuesWhenHasLiveHoldings() throws Exception {
        System.out.println("purgeEnqueuesWhenHasLiveHoldings");

        jpa(em -> {
            OpenAgencyStatusBean openAgencyStatus = createOpenAgencyStatusBean(em);
            em.persist(new BibliographicEntity(870970, "basis", "23645564", "", "", "", false, new IndexKeys(), ""));
            em.persist(new HoldingsToBibliographicEntity(711111, 870970, "23645564", true));
            em.persist(new HoldingsItemEntity(711111, "23645564", ON_SHELF, null, ""));
            Object status = openAgencyStatus.purgeAgency(711111, "").getEntity();

            System.out.println("status = " + status);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:23645564"));
    }
}
