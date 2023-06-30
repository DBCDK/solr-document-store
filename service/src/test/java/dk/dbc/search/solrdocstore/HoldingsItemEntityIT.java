package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import org.junit.Test;

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class HoldingsItemEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeEntity() {
        jpa(em -> {

            IndexKeys doc1 = new IndexKeys();
            doc1.put("titel", Collections.singletonList("unix bogen"));
            doc1.put("id", Collections.singletonList("argle"));

            IndexKeys doc2 = new IndexKeys();
            doc2.put("titel", Collections.singletonList("unix bogen"));
            doc2.put("id", Collections.singletonList("argle"));
            doc2.put("dyr", Collections.singletonList("hest"));
            em.persist(new HoldingsItemEntity(200, "1234", IndexKeysList.from(doc1, doc2), null, ""));
        });

        jpa(em -> {
            Object key = new AgencyItemKey(200, "1234");
            HoldingsItemEntity be2 = em.find(HoldingsItemEntity.class, key);

            assertThat(be2.getAgencyId(), is(200));
            assertThat(be2.getBibliographicRecordId(), is("1234"));
        });
    }

    @Test
    public void loadEntity() throws Exception {
        executeSqlScript("entityTestData.sql");
        jpa(em -> {
            AgencyItemKey key = new AgencyItemKey(300, "4321");
            HoldingsItemEntity be = em.find(HoldingsItemEntity.class, key);

            assertThat(be.getAgencyId(), is(300));
            assertThat(be.getBibliographicRecordId(), is("4321"));

            IndexKeysList expected = new IndexKeysList();

            IndexKeys doc1 = new IndexKeys();
            doc1.put("title", Collections.singletonList("unix bogen"));
            doc1.put("id", Collections.singletonList("argle"));
            expected.add(doc1);

            IndexKeys doc2 = new IndexKeys();
            doc2.put("title", Collections.singletonList("unix bogen"));
            doc2.put("id", Collections.singletonList("argle"));
            doc2.put("dyr", Collections.singletonList("hest"));
            expected.add(doc2);

            assertThat(be.getIndexKeys(), is(expected));

            assertThat(be.getTrackingId(), is("track"));
        });
    }

}
