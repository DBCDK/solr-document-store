package dk.dbc.search.solrdocstore;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import org.junit.Test;

import javax.persistence.EntityManager;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BibliographicEntityIT extends JpaSolrDocstoreIntegrationTester {

    @Test
    public void StoreEntity() {
        EntityManager em=env().getEntityManager();
        env().getPersistenceContext().run( () -> {
            BibliographicEntity be=new BibliographicEntity();
            be.agencyId = 200;
            be.bibliographicRecordId = "1234";
            be.work = "work:1";
            be.unit = "unit:2";
            be.producerVersion = "1234";
            be.deleted = false;
            be.indexKeys = new HashMap<>();
            be.indexKeys.put("titel", Collections.singletonList("unix bogen"));
            be.indexKeys.put("id", Collections.singletonList("argle"));
            be.commitWithin = 1000;
            be.trackingId = "";
            em.persist(be);
        });

        AgencyItemKey key=new AgencyItemKey().withAgencyId(200).withBibliographicRecordId("1234");
        BibliographicEntity be2=env().getPersistenceContext().run( () -> em.find(BibliographicEntity.class, key) );

        assertThat( be2.agencyId, is(200));
        assertThat( be2.bibliographicRecordId, is("1234"));
    }

    @Test
    public void LoadEntity() throws Exception {
        executeScriptResource("/entityTestData.sql");
        EntityManager em=env().getEntityManager();

        AgencyItemKey key=new AgencyItemKey().withAgencyId(300).withBibliographicRecordId("4321");
        BibliographicEntity be=env().getPersistenceContext().run( () -> em.find(BibliographicEntity.class, key));

        assertThat( be.agencyId, is(300));
        assertThat( be.bibliographicRecordId, is("4321"));
        
        assertThat(be.agencyId , is( 300 ));
        assertThat(be.bibliographicRecordId , is( "4321" ));
        assertThat(be.work , is( "work:3" ));
        assertThat(be.unit , is( "unit:3" ));
        assertThat(be.producerVersion , is( "5544" ));
        assertThat(be.deleted , is( true ));
        Map<String,List<String>> expected= new HashMap<>();
        expected.put("ti", Arrays.asList("isdnBogen", "title2"));
        expected.put("001", Collections.singletonList("argle"));
        assertThat(be.indexKeys, is( expected ));

        assertThat(be.commitWithin , is( 7788 ));
        assertThat(be.trackingId , is( "track" ));

    }
}