package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class HoldingsToBibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeEntity() {
        executeSqlScript("entityTestData.sql");

        jpa(em -> {
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(300, "4321", 200, true);
            em.persist(h2b);
        });
    }

    @Test
    public void loadEntity() {
        executeSqlScript("entityTestData.sql");

        HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(600, "600");
        jpa(em -> {
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, key);

            assertThat(h2b.getHoldingsAgencyId(), is(600));
            assertThat(h2b.getBibliographicRecordId(), is("600"));
            assertThat(h2b.getBibliographicAgencyId(), is(100));
            assertThat(h2b.getIsCommonDerived(), is(false));
        });
    }
}
