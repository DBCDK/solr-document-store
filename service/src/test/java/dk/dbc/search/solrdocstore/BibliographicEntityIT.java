package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

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
    public void LoadEntity() throws IOException, SQLException {
        executeSqlScript("entityTestData.sql");

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
