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
import dk.dbc.search.solrdocstore.logic.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicReference;
import jakarta.persistence.EntityManager;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void testEnqueueAddsTotTables() throws Exception {
        System.out.println("testEnqueueAddsTotTables");

        jpa( em -> {
            for( var e : Arrays.asList(
                    new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                    new QueueRuleEntity("b", QueueType.MANIFESTATION, 5),
                    new QueueRuleEntity("c", QueueType.HOLDING, 0),
                    new QueueRuleEntity("d", QueueType.HOLDING, 20),
                    new QueueRuleEntity("g", QueueType.WORK, 0),
                    new QueueRuleEntity("h", QueueType.WORK, 100),
                    new QueueRuleEntity("k", QueueType.UNIT, 0),
                    new QueueRuleEntity("l", QueueType.UNIT, 100)) ) {
                em.persist(e);
            }
        });

        jpa(em -> {
            try {
                EnqueueSupplierBean bean = new EnqueueSupplierBean();
                bean.entityManager = em;
                EnqueueCollector collector = bean.getEnqueueCollector();
                collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.WORK);
                collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.UNIT);
                collector.add(entity(123456, "katalog", "87654321", "work:2", "unit:0"), QueueType.MANIFESTATION);
                collector.commit();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
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

    @Test(timeout = 2_000L)
    public void checkConfig() {
        System.out.println("checkConfig");
        jpa(em -> {
            BibliographicBeanV2 bibliographicBean = BeanFactoryUtil.createBibliographicBean(em, null);
            HoldingsItemBeanV1 holdingsItemBean = BeanFactoryUtil.createHoldingsItemBeanV1(em);
            assertEquals(LibraryType.NonFBS, bibliographicBean.openAgency.lookup(nonfbsAgency).getLibraryType());
            assertEquals(LibraryType.FBS, bibliographicBean.openAgency.lookup(fbsAgency).getLibraryType());
            assertEquals(LibraryType.FBS, bibliographicBean.openAgency.lookup(schoolAgency).getLibraryType());
        });
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
        AtomicReference<BibliographicEntity> fbsOwnEntryToDelete = new AtomicReference<>();
        jpa(em -> {
            try {
                BibliographicEntity entry = addBibliographic(em, nonfbsAgency, "test");
                addHoldings(em, nonfbsAgency, "test");
                fbsOwnEntryToDelete.set(entry);
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(nonfbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")
           ));

        // Updated to potentially the same
        jpa(em -> {
            addBibliographic(em, nonfbsAgency, "test");
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(nonfbsAgency, "clazzifier", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")
           ));

        jpa(em -> {
            deleteBibliographic(em, fbsOwnEntryToDelete.get());
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

        AtomicReference<BibliographicEntity> fbsToDelete = new AtomicReference<>();
        jpa(em -> {
            addBibliographic(em, commonAgency, "basis", "test");
            BibliographicEntity entity = addBibliographic(em, fbsAgency, "katalog", "test");
            fbsToDelete.set(entity);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "basis", "test"),
                   queueItem(fbsAgency, "katalog", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        jpa(em -> {
            addHoldings(em, fbsAgency, "test");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(fbsAgency, "katalog", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        jpa(em -> {
            deleteBibliographic(em, fbsToDelete.get());
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "basis", "test"),
                   queueItem(fbsAgency, "katalog", "test"),
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
        AtomicReference<HoldingsItemEntity> h = new AtomicReference<>();
        jpa(em -> {
            addBibliographic(em, commonAgency, "basis", "test");
            HoldingsItemEntity entity = addHoldings(em, fbsAgency, "test");
            h.set(entity);
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "basis", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));

        jpa(em -> {
            HoldingsItemBeanV1 holdingsItemBean = BeanFactoryUtil.createHoldingsItemBeanV1(em);
            HoldingsItemEntity hold = h.get();
            hold.setTrackingId("NEW");
            holdingsItemBean.putIndexKeys(hold.getAgencyId(), hold.getBibliographicRecordId(), hold.getIndexKeys(), hold.getTrackingId());
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(commonAgency, "basis", "test"),
                   queueItem("unit:0"),
                   queueItem("work:0")));
    }

    private BibliographicEntity addBibliographic(EntityManager em, int agency, String bibliographicRecordId) throws SQLException {
        return addBibliographic(em, agency, "clazzifier", bibliographicRecordId);
    }

    private BibliographicEntity addBibliographic(EntityManager em, int agency, String classifier, String bibliographicRecordId) throws SQLException {
        BibliographicEntity e = new BibliographicEntity(agency, classifier, bibliographicRecordId, "id#1", "work:0", "unit:0", false, new IndexKeys(), "IT");
        BibliographicBeanV2 bibliographicBean = BeanFactoryUtil.createBibliographicBean(em, null);
        bibliographicBean.addBibliographicKeys(e, true);
        return e;
    }

    private void deleteBibliographic(EntityManager em, BibliographicEntity ownRecord) throws SQLException {
        ownRecord.setDeleted(true);
        BibliographicBeanV2 bibliographicBean = BeanFactoryUtil.createBibliographicBean(em, null);
        bibliographicBean.addBibliographicKeys(ownRecord, true);
    }

    private HoldingsItemEntity addHoldings(EntityManager em, int holdingAgency, String holdingBibliographicId) throws SQLException {
        // Dummy holding - ensure enqueue from non existing to this
        HoldingsItemEntity e = new HoldingsItemEntity(holdingAgency, holdingBibliographicId, SolrIndexKeys.ON_SHELF, null, "IT");
        HoldingsItemBeanV1 holdingsItemBean = BeanFactoryUtil.createHoldingsItemBeanV1(em);
        holdingsItemBean.putIndexKeys(e.getAgencyId(), e.getBibliographicRecordId(), e.getIndexKeys(), e.getTrackingId());
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
