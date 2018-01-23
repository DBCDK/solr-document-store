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

public class BibliographicEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void StoreEntity() {
        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {
            Map<String, List<String>> indexKeys = new HashMap<>();
            indexKeys.put("titel", Collections.singletonList("unix bogen"));
            indexKeys.put("id", Collections.singletonList("argle"));
            BibliographicEntity be = new BibliographicEntity(200, "1234", "work:1", "unit:2", "1234", false, indexKeys, "");
            em.persist(be);
        });

        AgencyItemKey key = new AgencyItemKey().withAgencyId(200).withBibliographicRecordId("1234");
        BibliographicEntity be2 = env().getPersistenceContext()
                .run(() -> em.find(BibliographicEntity.class, key));

        assertThat(be2.getAgencyId(), is(200));
        assertThat(be2.getBibliographicRecordId(), is("1234"));
    }

    @Test
    public void LoadEntity() {
        executeScriptResource("/entityTestData.sql");
        EntityManager em = env().getEntityManager();

        AgencyItemKey key = new AgencyItemKey().withAgencyId(300).withBibliographicRecordId("4321");
        BibliographicEntity be = env().getPersistenceContext()
                .run(() -> em.find(BibliographicEntity.class, key));

        assertThat(be.getAgencyId(), is(300));
        assertThat(be.getBibliographicRecordId(), is("4321"));

        assertThat(be.getAgencyId(), is(300));
        assertThat(be.getBibliographicRecordId(), is("4321"));
        assertThat(be.getWork(), is("work:3"));
        assertThat(be.getUnit(), is("unit:3"));
        assertThat(be.getProducerVersion(), is("5544"));
        assertThat(be.isDeleted(), is(true));
        Map<String, List<String>> expected = new HashMap<>();
        expected.put("ti", Arrays.asList("isdnBogen", "title2"));
        expected.put("001", Collections.singletonList("argle"));
        assertThat(be.getIndexKeys(), is(expected));

        assertThat(be.getTrackingId(), is("track"));

    }
}
