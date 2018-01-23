package dk.dbc.search.solrdocstore;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import org.junit.Test;

import javax.persistence.EntityManager;

public class HoldingsToBibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {
    @Test
    public void StoreEntity() {
        executeScriptResource("/entityTestData.sql");
        EntityManager em=env().getEntityManager();

        env().getPersistenceContext().run( () -> {
            HoldingsToBibliographicEntity h2b=new HoldingsToBibliographicEntity(
                    300,
                    "4321",
                    200
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

        assertThat( h2b.holdingsAgencyId, is(600));
        assertThat( h2b.bibliographicRecordId, is("600"));
        assertThat( h2b.bibliographicAgencyId, is(100));
    }
}