package dk.dbc.search.solrdocstore;

import org.junit.Test;

import javax.persistence.EntityManager;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class HoldingsToBibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void StoreEntity() {
        executeScriptResource("/entityTestData.sql");
        EntityManager em = env().getEntityManager();

        env().getPersistenceContext().run(() -> {
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                    300,
                    "4321",
                    200,
                    true
            );
            em.persist(h2b);
        });
    }

    @Test
    public void LoadEntity() {
        executeScriptResource("/entityTestData.sql");

        EntityManager em = env().getEntityManager();

        HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(600, "600");
        HoldingsToBibliographicEntity h2b = env().getPersistenceContext()
                .run(() -> em.find(HoldingsToBibliographicEntity.class, key));

        assertThat(h2b.getHoldingsAgencyId(), is(600));
        assertThat(h2b.getBibliographicRecordId(), is("600"));
        assertThat(h2b.getBibliographicAgencyId(), is(100));
        assertThat(h2b.getIsCommonDerived(), is(false));
    }
}
