package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicToBibliographicEntity;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;


public class BibliographicToBibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeEntity() {
        executeSqlScript("entityTestData.sql");
        jpa(em -> {
            em.persist(new BibliographicToBibliographicEntity("300", "4321"));
        });
    }

    @Test
    public void loadEntity() {
        executeSqlScript("entityTestData.sql");

        jpa(em -> {
            BibliographicToBibliographicEntity b2b = em.find(BibliographicToBibliographicEntity.class, "399");

            assertThat(b2b.getLiveBibliographicRecordId(), is("600"));
        });
    }
}
