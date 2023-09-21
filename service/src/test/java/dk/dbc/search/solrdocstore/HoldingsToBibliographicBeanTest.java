package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import jakarta.persistence.EntityManager;
import java.util.Set;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class HoldingsToBibliographicBeanTest extends BeanTester {

    @Test(timeout = 10_000L)
    public void testBibliographicFirst() throws Exception {
        System.out.println("testBibliographicFirst");

        persist(new OpenAgencyEntity(870970, LibraryType.FBS, true, true, true),
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700001, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, true, true),
                new OpenAgencyEntity(800001, LibraryType.NonFBS, false, true, true),
                Doc.bibliographic("a").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(700000, "a").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(800000, "a").indexKeys(filler -> filler.add("id", "a")));

        MockEnqueueCollector enqueueCollector = new MockEnqueueCollector();

        persist(Doc.holdingsItem(700000, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(700000, "a", false, enqueueCollector));
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

        persist(Doc.holdingsItem(700001, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(700001, "a", false, enqueueCollector));
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

        persist(Doc.holdingsItem(800000, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(800000, "a", false, enqueueCollector));
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

        persist(Doc.holdingsItem(800001, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(800001, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        delete(HoldingsItemEntity.class, new AgencyItemKey(700000, "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(700000, "a", true, enqueueCollector));
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

        delete(HoldingsItemEntity.class, new AgencyItemKey(700001, "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(700001, "a", true, enqueueCollector));
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

        delete(HoldingsItemEntity.class, new AgencyItemKey(800000, "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(800000, "a", true, enqueueCollector));
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

        delete(HoldingsItemEntity.class, new AgencyItemKey(800001, "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateHolding(800001, "a", true, enqueueCollector));
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

        persist(new OpenAgencyEntity(870970, LibraryType.FBS, true, true, true),
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700001, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, true, true),
                new OpenAgencyEntity(800001, LibraryType.NonFBS, false, true, true),
                Doc.holdingsItem(700000, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")),
                Doc.holdingsItem(700001, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")),
                Doc.holdingsItem(800000, "a").addHolding(filler -> filler.itemId("a").status("OnLoan")));

        MockEnqueueCollector enqueueCollector = new MockEnqueueCollector();

        persist(Doc.bibliographic(700000, "a").indexKeys(filler -> filler.add("id", "a")));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(700000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", false)));
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        persist(Doc.bibliographic("a").indexKeys(filler -> filler.add("id", "a")));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(870970, "a", false, enqueueCollector));
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

        persist(Doc.bibliographic(800000, "a").indexKeys(filler -> filler.add("id", "a")));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(800000, "a", false, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), is(new HoldingsToBibliographicEntity(700000, 700000, "a", true)));
            assertThat(fetchH2BRecord(em, 700001, "a"), is(new HoldingsToBibliographicEntity(700001, 870970, "a", true)));
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        // Remove common record
        delete(BibliographicEntity.class, new AgencyClassifierItemKey(870970, "basis", "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(870970, "a", true, enqueueCollector));
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

        delete(BibliographicEntity.class, new AgencyClassifierItemKey(700000, "katalog", "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(700000, "a", true, enqueueCollector));
        jpa(em -> {
            assertThat(fetchH2BRecord(em, 700000, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 700001, "a"), nullValue());
            assertThat(fetchH2BRecord(em, 800000, "a"), is(new HoldingsToBibliographicEntity(800000, 800000, "a", false)));
            assertThat(fetchH2BRecord(em, 800001, "a"), nullValue());
        });
        assertThat(enqueueCollector.getJobs(), empty());
        enqueueCollector.clear();

        delete(BibliographicEntity.class, new AgencyClassifierItemKey(800000, "katalog", "a"));
        bean(bf -> bf.holdingsToBibliographicBean().updateBibliographic(800000, "a", true, enqueueCollector));
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
}
