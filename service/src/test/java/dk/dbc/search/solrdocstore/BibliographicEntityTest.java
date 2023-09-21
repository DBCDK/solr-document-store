package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.logic.Marshaller;
import java.sql.Statement;

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BibliographicEntityTest extends BeanTester {

    private static final Marshaller MARSHALLER = new Marshaller();

    @Test
    public void simpleEncode() throws Exception {
        IndexKeys indexKeys = new IndexKeys();
        indexKeys.put("title", Arrays.asList("unix bogen", "title2"));
        indexKeys.put("id", Collections.singletonList("argle"));

        BibliographicEntity be = new BibliographicEntity(200, "clazzifier", "1234", "id#1", "work:1", "unit:2", false, indexKeys, "");
        String s = MARSHALLER.marshall(be);
        assertThat(s, is("{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"deleted\":false,\"indexKeys\":{\"id\":[\"argle\"],\"title\":[\"unix bogen\",\"title2\"]},\"trackingId\":\"\"}"));
    }

    @Test
    public void simpleDecode() throws Exception {
        String jsonContent = "{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"deleted\":false,\"indexKeys\":{\"title\": [\"unix bogen\", \"title2\"], \"id\": [\"argle\"] },\"trackingId\":\"\"}";

        BibliographicEntity be = MARSHALLER.unmarshall(jsonContent, BibliographicEntity.class);
        assertThat(be.getAgencyId(), is(200));
        assertThat(be.getClassifier(), is("clazzifier"));
        assertThat(be.getBibliographicRecordId(), is("1234"));
        assertThat(be.getRepositoryId(), is("id#1"));
        assertThat(be.getWork(), is("work:1"));
        assertThat(be.getUnit(), is("unit:2"));
        assertThat(be.isDeleted(), is(false));
        assertThat(be.getTrackingId(), is(""));

        IndexKeys expected = new IndexKeys();
        expected.put("title", Arrays.asList("unix bogen", "title2"));
        expected.put("id", Collections.singletonList("argle"));
        assertThat(be.getIndexKeys(), is(expected));
    }

    @Test
    public void StoreEntity() {
        jpa(em -> {
            IndexKeys indexKeys = new IndexKeys();
            indexKeys.put("titel", Collections.singletonList("unix bogen"));
            indexKeys.put("id", Collections.singletonList("argle"));
            BibliographicEntity be = new BibliographicEntity(200, "clazzifier", "1234", "id#1", "work:1", "unit:2", false, indexKeys, "");
            em.persist(be);
        });

        AgencyClassifierItemKey key = new AgencyClassifierItemKey(200, "clazzifier", "1234");
        jpa(em -> {
            BibliographicEntity be2 = em.find(BibliographicEntity.class, key);

            assertThat(be2.getAgencyId(), is(200));
            assertThat(be2.getClassifier(), is("clazzifier"));
            assertThat(be2.getBibliographicRecordId(), is("1234"));
        });
    }

    @Test
    public void LoadEntity() throws Exception {
        sql(connection -> {
            try (Statement stmt = connection.createStatement()) {
                stmt.execute("INSERT INTO bibliographicSolrKeys ( AGENCYID, CLASSIFIER, BIBLIOGRAPHICRECORDID, REPOSITORYID, DELETED, INDEXKEYS, TRACKINGID, UNIT, WORK) " +
                             "VALUES ( 300, 'clazzifier', '4321', 'id#1', TRUE , '{\"ti\": [\"isdnBogen\", \"title2\"] , \"001\": [\"argle\"] }'::jsonb,'track', 'unit:3', 'work:3')");
            }
        });

        AgencyClassifierItemKey key = new AgencyClassifierItemKey(300, "clazzifier", "4321");
        jpa(em -> {
            BibliographicEntity be = em.find(BibliographicEntity.class, key);

            assertThat(be.getAgencyId(), is(300));
            assertThat(be.getClassifier(), is("clazzifier"));
            assertThat(be.getBibliographicRecordId(), is("4321"));
            assertThat(be.getWork(), is("work:3"));
            assertThat(be.getUnit(), is("unit:3"));
            assertThat(be.isDeleted(), is(true));
            IndexKeys expected = new IndexKeys();
            expected.put("ti", Arrays.asList("isdnBogen", "title2"));
            expected.put("001", Collections.singletonList("argle"));
            assertThat(be.getIndexKeys(), is(expected));

            assertThat(be.getTrackingId(), is("track"));
        });
    }

}
