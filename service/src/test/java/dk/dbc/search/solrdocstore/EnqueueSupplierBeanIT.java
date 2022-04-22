/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final Logger log = LoggerFactory.getLogger(EnqueueSupplierBeanIT.class);

    private BibliographicBean bibliographicBean;
    private HoldingsItemBean holdingsItemBean;
    private EntityManager em;

    @Before
    public void onTest() {
        bibliographicBean = BeanFactoryUtil.createBibliographicBean(env(), null);
        holdingsItemBean = BeanFactoryUtil.createHoldingsItemBean(env());

        em = env().getEntityManager();

    }

    @Test(timeout = 2_000L)
    public void testEnqueueAddsTotTables() throws Exception {
        System.out.println("testEnqueueAddsTotTables");

        EntityManager em = env().getEntityManager();
        EnqueueSupplierBean bean = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(
                        new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                        new QueueRuleEntity("b", QueueType.MANIFESTATION, 5),
                        new QueueRuleEntity("c", QueueType.HOLDING, 0),
                        new QueueRuleEntity("d", QueueType.HOLDING, 20),
                        new QueueRuleEntity("e", QueueType.FIRSTLASTHOLDING, 0),
                        new QueueRuleEntity("f", QueueType.FIRSTLASTHOLDING, 20),
                        new QueueRuleEntity("g", QueueType.WORK, 0),
                        new QueueRuleEntity("h", QueueType.WORK, 100),
                        new QueueRuleEntity("i", QueueType.WORKFIRSTLASTHOLDING, 0),
                        new QueueRuleEntity("j", QueueType.WORKFIRSTLASTHOLDING, 100),
                        new QueueRuleEntity("k", QueueType.UNIT, 0),
                        new QueueRuleEntity("l", QueueType.UNIT, 100),
                        new QueueRuleEntity("m", QueueType.UNITFIRSTLASTHOLDING, 0),
                        new QueueRuleEntity("n", QueueType.UNITFIRSTLASTHOLDING, 100));
            }
        };
        bean.entityManager = em;

        env().getPersistenceContext().run(() -> {
            EnqueueCollector collector = bean.getEnqueueCollector();
            collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.WORK);
            collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.UNIT);
            collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.MANIFESTATION);
            collector.commit();
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,123456-katalog:87654321",
                   "b,123456-katalog:87654321",
                   "g,work:2",
                   "h,work:2",
                   "k,unit:0",
                   "l,unit:0"));
    }

    private static final Integer nonfbsAgency = 800111;
    private static final Integer schoolAgency = 300111;
    private static final Integer fbsAgency = 600111;
    private static final Integer commonAgency = LibraryType.COMMON_AGENCY;
    private static final Integer schoolCommonAgency = LibraryType.SCHOOL_COMMON_AGENCY;

    @Test(timeout = 2_000L)
    public void checkConfig() {
        System.out.println("checkConfig");
        assertEquals(LibraryType.NonFBS, bibliographicBean.openAgency.lookup(nonfbsAgency).getLibraryType());
        assertEquals(LibraryType.FBS, bibliographicBean.openAgency.lookup(fbsAgency).getLibraryType());
        assertEquals(LibraryType.FBSSchool, bibliographicBean.openAgency.lookup(schoolAgency).getLibraryType());
    }

    @Test(timeout = 2_000L)
    public void singleRecords() {
        System.out.println("singleRecords");
        /*
         * Single records
         * --------------
         * Add Bib (OWN:NONFBS), with (OWN) holding
         * Queue contains OWN, clear queue
         *
         * Delete holding
         * Queue contains OWN
         */
        BibliographicEntity fbsOwnEntryToDelete = env().getPersistenceContext().run(() -> {
            BibliographicEntity entry = addBibliographic(nonfbsAgency, "test");
            addHoldings(nonfbsAgency, "test");
            return entry;
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(nonfbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")
           ));

        // Updated to potentially the same
        env().getPersistenceContext().run(() -> {
            addBibliographic(nonfbsAgency, "test");
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(nonfbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")
           ));

        env().getPersistenceContext().run(() -> {
            deleteBibliographic(fbsOwnEntryToDelete);
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(nonfbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")
           ));
    }

    @Test(timeout = 2_000L)
    public void localAndCommonBibAndHoldings() {
        System.out.println("localAndCommonBibAndHoldings");
        /*
         * Local bib and holdings
         * ----------------------
         * Add Bib (870970)
         * Add Bib (OWN)
         * Queue contains (OWN, 870970)
         * clear queue
         *
         * Add Holding (OWN) -> Holding attaches to Bib (OWN)
         * Queue contains (OWN)
         * Clear queue
         *
         * Delete Bib(OWN)
         * Holding reattaches to 870970
         * Queue contains (870970, OWN).
         */

        BibliographicEntity fbsToDelete = env().getPersistenceContext().run(() -> {
            addBibliographic(commonAgency, "test");
            return addBibliographic(fbsAgency, "test");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test"),
                   queueItem(fbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            addHoldings(fbsAgency, "test");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(fbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            deleteBibliographic(fbsToDelete);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test"),
                   queueItem(fbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));
    }

    @Test(timeout = 2_000L)
    public void commonAndSchoolRecords() {
        System.out.println("commonAndSchoolRecords");
        /*
         * Common & School records
         * -----------------------
         * add Bib (870970), queue includes new Bib
         * add Bib (300000)
         * Queue contains [870970, 300000], clear queue
         * Queue is empty
         *
         * add Holding (SCHOOL) -> Holding attaches to Bib (300000)
         * Queue contains [300000], clear queue
         *
         * Delete Bib(300000)
         * Holding reattaches to 870970
         * Queue contains [870970, 300000]
         *
         * Delete Bib(OWN)
         * Holding reattaches to (FBS).
         * Queue contains (OWN, 870970)
         *
         */
        BibliographicEntity toDelete = env().getPersistenceContext().run(() -> {
            addBibliographic(commonAgency, "test");
            return addBibliographic(schoolCommonAgency, "test");
        });
        assertThat(queueContentAndClear(),
                   containsInAnyOrder(
                           queueItem(commonAgency, "clazzifier", "test"),
                           queueItem(schoolCommonAgency, "clazzifier", "test"),
                           queueItem("unit:0"),
                           queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            addHoldings(schoolAgency, "test");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(schoolCommonAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            deleteBibliographic(toDelete);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test"),
                   queueItem(schoolCommonAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

    }

    @Test(timeout = 2_000L)
    public void holdingsUpdate() {
        System.out.println("holdingsUpdate");
        /*
         * Add Bib( 870970 )
         * Add Holding ( FBS )
         * Queue contains 870970
         * Clear queue
         *
         * Fetch Holding back, update some field
         * Queue contains 870970
         */
        HoldingsItemEntity h = env().getPersistenceContext().run(() -> {
            addBibliographic(commonAgency, "test");
            return addHoldings(fbsAgency, "test");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            h.setTrackingId("NEW");
            holdingsItemBean.setHoldingsKeys(h);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));
    }

    @Test(timeout = 2_000L)
    public void superseeds() {
        System.out.println("superseeds");
        /*
         * Superseeds
         * ----------
         * Add Bib(870970) rec 1,2,3
         * Add Holdings (OWN:FBS) rec 1,2,3
         * Attaches to Bib
         * Queue contains 870970: 1,2,3
         *
         * Add Bib(870970) 4 (to superseed 1,2,3).
         * Holdings reattaches to new Bib
         * Queue contains 870970: 1,2,3,4
         *
         */

        String superseedId = "test4";
        List<String> ids = Arrays.asList("test1", "test2", "test3");

        env().getPersistenceContext().run(() -> {
            for (String id : ids) {
                addBibliographic(commonAgency, id);
                addHoldings(fbsAgency, id);
            }
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test1"),
                   queueItem(commonAgency, "clazzifier", "test2"),
                   queueItem(commonAgency, "clazzifier", "test3"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            addBibliographic(commonAgency, superseedId, Optional.of(ids));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "clazzifier", "test1"),
                   queueItem(commonAgency, "clazzifier", "test2"),
                   queueItem(commonAgency, "clazzifier", "test3"),
                   queueItem(commonAgency, "clazzifier", "test4"),
                   queueItem("unit:0"),
                   queueItem("work:0")));
    }

    @Test(timeout = 2_000L)
    public void multipleClassifiersMoveHolding() {
        System.out.println("multipleClassifiersMoveHolding");
        env().getPersistenceContext().run(() -> {
            addBibliographic(commonAgency, "foo", "a", Optional.empty());
            addBibliographic(commonAgency, "bar", "a", Optional.empty());
        });
        queueContentAndClear();

        env().getPersistenceContext().run(() -> {
            addHoldings(777777, "a");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "foo", "a"),
                   queueItem(commonAgency, "bar", "a"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        env().getPersistenceContext().run(() -> {
            addBibliographic(777777, "woop", "a", Optional.empty());
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "foo", "a"),
                   queueItem(commonAgency, "bar", "a"),
                   queueItem(777777, "woop", "a"),
                   queueItem("unit:0"),
                   queueItem("work:0")));
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId) throws SQLException {
        return addBibliographic(agency, bibliographicRecordId, Optional.empty());
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId, Optional<List<String>> superseed) throws SQLException {
        return addBibliographic(agency, "clazzifier", bibliographicRecordId, superseed);
    }

    private BibliographicEntity addBibliographic(int agency, String classifier, String bibliographicRecordId, Optional<List<String>> superseed) throws SQLException {
        List<String> superseedList = superseed.orElse(Collections.emptyList());
        BibliographicEntity e = new BibliographicEntity(agency, classifier, bibliographicRecordId, "id#1", "work:0", "unit:0", false, new IndexKeys(), "IT");
        bibliographicBean.addBibliographicKeys(e, superseedList, true);
        return e;
    }

    private void deleteBibliographic(BibliographicEntity ownRecord) throws SQLException {
        ownRecord.setDeleted(true);
        bibliographicBean.addBibliographicKeys(ownRecord, Collections.emptyList(), true);
    }

    private HoldingsItemEntity addHoldings(int holdingAgency, String holdingBibliographicId) throws SQLException {
        // Dummy holding - ensure enqueue from non existing to this
        HoldingsItemEntity e = new HoldingsItemEntity(holdingAgency, holdingBibliographicId, SolrIndexKeys.ON_SHELF, "IT");
        holdingsItemBean.setHoldingsKeys(e);
        return e;
    }

    private String queueItem(int agency, String classifier, String bibliographicRecordId) {
        return "a," + agency + "-" + classifier + ":" + bibliographicRecordId;
    }

    private String queueItem(String id) {
        if (id.startsWith("unit:")) {
            return "b," + id;
        } else if (id.startsWith("work:")) {
            return "c," + id;
        } else {
            return "?," + id;
        }
    }

    private BibliographicEntity entity(int agencyId, String classifier, String bibliogrephicRecordId, String work, String unit) {
        BibliographicEntity bib = new BibliographicEntity();
        bib.setAgencyId(agencyId);
        bib.setClassifier(classifier);
        bib.setBibliographicRecordId(bibliogrephicRecordId);
        bib.setWork(work);
        bib.setUnit(unit);
        return bib;
    }
}
