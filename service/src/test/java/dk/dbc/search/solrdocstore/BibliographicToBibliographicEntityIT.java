package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicToBibliographicEntity;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

import javax.persistence.EntityManager;

public class BibliographicToBibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeEntity() {
        executeScriptResource("/entityTestData.sql");
        EntityManager em = env().getEntityManager();

        env().getPersistenceContext().run(() -> {
            em.persist(new BibliographicToBibliographicEntity("300", "4321"));
        });
    }

    @Test
    public void loadEntity() {
        executeScriptResource("/entityTestData.sql");

        EntityManager em = env().getEntityManager();

        BibliographicToBibliographicEntity b2b = env().getPersistenceContext()
                .run(() -> em.find(BibliographicToBibliographicEntity.class, "399"));

        assertThat(b2b.getLiveBibliographicRecordId(), is("600"));
    }
}
