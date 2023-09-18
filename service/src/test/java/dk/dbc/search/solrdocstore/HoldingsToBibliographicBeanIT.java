package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import jakarta.persistence.EntityManager;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Set;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class HoldingsToBibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 10_000L)
    public void testBibliographicFirst() throws Exception {
        System.out.println("testBibliographicFirst");

        jpa(em -> {
            em.merge(new OpenAgencyEntity(870970, LibraryType.FBS, true, true, true));
            em.merge(new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false));
            em.merge(new OpenAgencyEntity(700001, LibraryType.FBS, true, false, false));
            em.merge(new OpenAgencyEntity(800000, LibraryType.NonFBS, false, true, true));
            em.merge(new OpenAgencyEntity(800001, LibraryType.NonFBS, false, true, true));
        });

        jpa(em -> {
            createBibRecord(em, 700000, "katalog", "a");
            createBibRecord(em, 800000, "katalog", "a");
            createBibRecord(em, 870970, "basis", "a");
        });

        MockEnqueueCollector enqueueCollector = new MockEnqueueCollector();

        jpa(em -> createHoldingsRecord(em, 700000, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(700000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:700000-katalog:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> createHoldingsRecord(em, 700001, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(700001, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:870970-basis:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> createHoldingsRecord(em, 800000, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(800000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:800000-katalog:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> createHoldingsRecord(em, 800001, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(800001, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        jpa(em -> deleteHoldingsRecord(em, 700000, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(700000, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:700000-katalog:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> deleteHoldingsRecord(em, 700001, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(700001, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:870970-basis:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> deleteHoldingsRecord(em, 800000, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(800000, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:800000-katalog:a",
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> deleteHoldingsRecord(em, 800001, "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateHolding(800001, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();
    }

    @Test(timeout = 10_000L)
    public void testHoldingsFirst() throws Exception {
        System.out.println("testHoldingsFirst");

        jpa(em -> {
            em.merge(new OpenAgencyEntity(870970, LibraryType.FBS, true, true, true));
            em.merge(new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false));
            em.merge(new OpenAgencyEntity(700001, LibraryType.FBS, true, false, false));
            em.merge(new OpenAgencyEntity(800000, LibraryType.NonFBS, false, true, true));
            em.merge(new OpenAgencyEntity(800001, LibraryType.NonFBS, false, true, true));
        });

        jpa(em -> {
            createHoldingsRecord(em, 700000, "a");
            createHoldingsRecord(em, 700001, "a");
            createHoldingsRecord(em, 800000, "a");
        });

        MockEnqueueCollector enqueueCollector = new MockEnqueueCollector();

        jpa(em -> createBibRecord(em, 700000, "katalog", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(700000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", false)));
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        jpa(em -> createBibRecord(em, 870970, "basis", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(870970, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:700000-katalog:a", // changed common
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> createBibRecord(em, 800000, "katalog", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(800000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        // Remove common record
        jpa(em -> deleteBibRecord(em, 870970, "basis", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(870970, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", false)));
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), is(Set.of("HOLDING:700000-katalog:a", // changed common
                                                         "UNITHOLDING:unit:1",
                                                         "WORKHOLDING:work:1")));
        enqueueCollector.clear();

        jpa(em -> deleteBibRecord(em, 700000, "katalog", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(700000, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        jpa(em -> deleteBibRecord(em, 800000, "katalog", "a"));
        jpa(em -> createHoldingsToBibliographicBean(em).updateBibliographic(800000, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();
    }

    private HoldingsToBibliographicEntity fetchH2BRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        return em.find(HoldingsToBibliographicEntity.class,
                       new HoldingsToBibliographicKey(agencyId, bibliographicRecordId));
    }

    private void createHoldingsRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        HoldingsItemEntity e = new HoldingsItemEntity(agencyId, bibliographicRecordId, new IndexKeysList(), Timestamp.from(Instant.now()), "IT");
        em.persist(e);
    }

    private void deleteHoldingsRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        HoldingsItemEntity e = em.find(HoldingsItemEntity.class, new AgencyItemKey(agencyId, bibliographicRecordId));
        if(e != null)
            em.remove(e);
    }

    private void createBibRecord(EntityManager em, int agencyId, String clazzifier, String bibliographicRecordId) {
        BibliographicEntity e = new BibliographicEntity(agencyId, clazzifier, bibliographicRecordId,
                                                        agencyId + "-" + clazzifier + ":" + bibliographicRecordId,
                                                        "work:1", "unit:1", false, new IndexKeys(), "IT");
        em.persist(e);
    }

    private void deleteBibRecord(EntityManager em, int agencyId, String clazzifier, String bibliographicRecordId) {
        BibliographicEntity e = em.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, clazzifier, bibliographicRecordId));
        e.setDeleted(true);
        e.setIndexKeys(null);
        em.merge(e);
    }
}
