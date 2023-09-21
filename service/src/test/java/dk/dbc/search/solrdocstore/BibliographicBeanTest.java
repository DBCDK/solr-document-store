package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import org.junit.Test;

import jakarta.ws.rs.core.Response;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

public class BibliographicBeanTest extends BeanTester {

    private static final String BIB_ID = "record";

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700100, LibraryType.FBS, true, false, false),
                Doc.holdingsItem(700000, BIB_ID).addHolding(filler -> filler.status("OnShelf").itemId("a")),
                Doc.holdingsItem(700100, BIB_ID).addHolding(filler -> filler.status("OnLoan").itemId("b")));

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery(
                    "SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='" + BIB_ID + "'",
                    HoldingsToBibliographicEntity.class)
                    .getResultList();

            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, COMMON_AGENCY, BIB_ID, true),
                       new HoldingsToBibliographicEntity(700100, COMMON_AGENCY, BIB_ID, true)
               ));
        });

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(700000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery(
                    "SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='" + BIB_ID + "'",
                    HoldingsToBibliographicEntity.class)
                    .getResultList();

            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, 700000, BIB_ID, true),
                       new HoldingsToBibliographicEntity(700100, COMMON_AGENCY, BIB_ID, true)
               ));
        });

        // Delete removes holdings
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).deleted().json());
            assertThat(resp.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery(
                    "SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='" + BIB_ID + "'",
                    HoldingsToBibliographicEntity.class)
                    .getResultList();

            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, 700000, BIB_ID, false)
               ));
        });
    }

    @Test
    public void updateExistingBibliographicPost() throws Exception {

        BibliographicEntity docBefore = Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("foo", "bar")).build();
        String docUpdate = Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("foo", "buh")).json();
        persist(OPEN_AGENCY_COMMON_AGNECY,
                docBefore);

        jpa(em -> {
            assertThat(em.find(BibliographicEntity.class, docBefore.asAgencyClassifierItemKey()), equalTo(docBefore));
        });

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, docUpdate);
            assertThat(resp.getStatus(), is(200));
        });

        jpa(em -> {
            assertThat(em.find(BibliographicEntity.class, docBefore.asAgencyClassifierItemKey()), not(equalTo(docBefore)));
        });
    }

    @Test(timeout = 2_000L)
    public void reviveOlderDeletedRecordFail() throws Exception {
        System.out.println("reviveOlderDeletedRecordFail");

        Instant now = Instant.now();

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID)
                                          .indexKeys(filler -> filler.add("rec.fedoraStreamDate", now.toString()))
                                          .deleted()
                                          .json());
            assertThat(resp.getStatus(), is(200));
        });

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID)
                                          .indexKeys(filler -> filler.add("rec.fedoraStreamDate", now.minus(1, ChronoUnit.HOURS).toString()))
                                          .json());
            assertThat(resp.getStatus(), not(is(200)));
        });
    }

    @Test(timeout = 2_000L)
    public void reviveOlderDeletedRecordSuccess() throws Exception {
        System.out.println("reviveOlderDeletedRecordSuccess");

        Instant now = Instant.now();

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID)
                                          .indexKeys(filler -> filler.add("rec.fedoraStreamDate", now.minus(10, ChronoUnit.HOURS).toString()))
                                          .deleted()
                                          .json());
            assertThat(resp.getStatus(), is(200));
        });

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID)
                                          .indexKeys(filler -> filler.add("rec.fedoraStreamDate", now.minus(1, ChronoUnit.HOURS).toString()))
                                          .json());
            assertThat(resp.getStatus(), is(200));
        });
    }

    @Test(timeout = 2_000L)
    public void testMovedRecordEnqueuesAllUnitsAndWorks() throws Exception {
        System.out.println("testMovedRecordEnqueuesAllUnitsAndWorks");

        persist(OPEN_AGENCY_COMMON_AGNECY);
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID)
                                          .unit("unit:2")
                                          .work("work:2")
                                          .indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1", "b,unit:2", "c,work:2"));
    }

    @Test
    public void updateExistingBibliographicPostToDeletedQueueIsDelayedAndResurrect() throws Exception {
        System.out.println("updateExistingBibliographicPostToDeletedQueueIsDelayedAndResurrect");
        persist(OPEN_AGENCY_COMMON_AGNECY);
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClearPostponedOnly(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).deleted().json());
            assertThat(resp.getStatus(), is(200));
        });

        assertThat(queueContentAndClearPostponedOnly(), containsInAnyOrder("a,870970-basis:record"));
        assertThat(queueContentAndClear(), containsInAnyOrder("b,unit:1", "c,work:1"));

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClearPostponedOnly(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));

    }

    @Test(timeout = 20_000L)
    public void skipQueueParameter() throws Exception {
        System.out.println("skipQueueParameter");

        persist(OPEN_AGENCY_COMMON_AGNECY);
        stdQueueRules();

        // New record shall always be queued
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(true, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "one")).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));

        // Changed record should not be queued
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(true, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "two")).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), empty());

        // Existing->Deleted record shall always be queued
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).deleted().json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));

        // Deleted->Deleted record shall not be queued
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(BIB_ID).deleted().json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), empty());

        // Resurrected record shall always be queued
        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(true, Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "one")).json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder("a,870970-basis:record", "b,unit:1", "c,work:1"));
    }

    @Test(timeout = 2_000L)
    public void testHoldingsUponCommonStaysIfDeletedManifestationIsCreated() throws Exception {
        System.out.println("testHoldingsUponCommonStaysIfDeletedManifestationIsCreated");

        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.holdingsItem(700000, BIB_ID).addHolding(filler -> filler.status("OnShelf").itemId("a")),
                new HoldingsToBibliographicEntity(700000, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            Response resp = bf.bibliographicBeanV2()
                    .addBibliographicKeys(false, Doc.bibliographic(700000, BIB_ID).deleted().json());
            assertThat(resp.getStatus(), is(200));
        });

        jpa(em -> {
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(700000, BIB_ID));
            assertThat(h2b, is(new HoldingsToBibliographicEntity(700000, COMMON_AGENCY, BIB_ID, true)));
        });
    }
}
