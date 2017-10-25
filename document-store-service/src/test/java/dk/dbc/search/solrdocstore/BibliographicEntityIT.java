package dk.dbc.search.solrdocstore;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import org.junit.Test;

import javax.persistence.EntityManager;

public class BibliographicEntityIT extends JpaSolrDocstoreIntegrationTest {

    @Test
    public void StoreEntity() {
        EntityManager em=env().getEntityManager();
        env().getPersistenceContext().run( () -> {
            BibliographicEntity be=new BibliographicEntity();
            be.id = "Id:1";
            be.agencyId = 200;
            be.bibliographicRecordId = "1234";
            be.work = "work:1";
            be.unit = "unit:2";
            be.producerVersion = "1234";
            be.deleted = false;
            be.indexKeys = "[ {\"key\": \"titel\", \"value\": \"unix bogen\"}, {\"key\": \"titel\", \"value\": \"unix bogen\"} ]";
            be.commitWithin = 1000;
            be.trackingId = "";
            em.persist(be);
        });

        BibliographicEntity be2=em.find(BibliographicEntity.class, "Id:1");

        assertThat( be2.agencyId, is(200));
        assertThat( be2.bibliographicRecordId, is("1234"));
    }

    @Test
    public void LoadEntity() throws Exception {
        executeScriptResource("/entityTestData.sql");
        EntityManager em=env().getEntityManager();
        BibliographicEntity be=env().getPersistenceContext().run( () -> { return em.find(BibliographicEntity.class, "id:3"); });

        assertThat( be.agencyId, is(300));
        assertThat( be.bibliographicRecordId, is("4321"));
        

        assertThat(be.id , is( "id:3" ));
        assertThat(be.agencyId , is( 300 ));
        assertThat(be.bibliographicRecordId , is( "4321" ));
        assertThat(be.work , is( "work:3" ));
        assertThat(be.unit , is( "unit:3" ));
        assertThat(be.producerVersion , is( "5544" ));
        assertThat(be.deleted , is( true ));
        assertThat(be.indexKeys , is( "[{\"key\": \"ti\", \"value\": \"isdnBogen\"}, {\"key\": \"001\", \"value\": \"argle\"}]" ));
        assertThat(be.commitWithin , is( 7788 ));
        assertThat(be.trackingId , is( "track" ));

    }
}