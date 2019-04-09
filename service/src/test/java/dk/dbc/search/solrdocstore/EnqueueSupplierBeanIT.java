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

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.QueueTestUtil.clearQueue;
import static dk.dbc.search.solrdocstore.QueueTestUtil.queueIs;
import static org.junit.Assert.assertEquals;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(EnqueueSupplierBeanIT.class);
    private BibliographicBean bibliographicBean;
    private HoldingsItemBean holdingsItemBean;
    private EntityManager em;

    @Before
    public void onTest() {
        bibliographicBean = BeanFactoryUtil.createBibliographicBean(env());
        holdingsItemBean = BeanFactoryUtil.createHoldingsItemBean(env());

        em = env().getEntityManager();

    }

    @Test(timeout = 1000L)
    public void testEnqueueManifestationAddsToQueueTable() throws Exception {
        System.out.println("testEnqueueManifestationAddsToQueueTable");

        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {

            EnqueueSupplierBean bean = new EnqueueSupplierBean();
            bean.daemon = new QueueRulesDaemon() {
                @Override
                public Collection<String> getManifestationQueues() {
                    return Arrays.asList("a", "b");
                }
            };
            bean.entityManager = em;

            clearQueue(em);
            EnqueueService<AgencyClassifierItemKey> enqeueService = bean.getManifestationEnqueueService();

            try {
                System.out.println("* no commitWithin");
                enqeueService.enqueue(new AgencyClassifierItemKey(870970, "clazzifier", "12345678"));
                System.out.println("* commitWithin");
                enqeueService.enqueue(new AgencyClassifierItemKey(870970, "clazzifier", "87654321"), 100, Optional.empty());
                System.out.println("* null commitWithin");
                enqeueService.enqueue(new AgencyClassifierItemKey(870970, "clazzifier", "abc"), null, Optional.empty());
                System.out.println("* queueing done");
            } catch (SQLException ex) {
                log.error("Exception: " + ex.getMessage());
                log.debug("Exception:", ex);
            }

            queueIs(em,
                    "a,870970,clazzifier,12345678",
                    "b,870970,clazzifier,12345678",
                    "a,870970,clazzifier,87654321,100",
                    "b,870970,clazzifier,87654321,100",
                    "a,870970,clazzifier,abc",
                    "b,870970,clazzifier,abc");
        });
    }

    private Integer nonfbsAgency = 800111;
    private Integer schoolAgency = 300111;
    private Integer fbsAgency = 600111;
    private Integer commonAgency = LibraryType.COMMON_AGENCY;
    private Integer schoolCommonAgency = LibraryType.SCHOOL_COMMON_AGENCY;

    @Test
    public void checkConfig() {
        System.out.println("checkConfig");
        assertEquals(LibraryType.NonFBS, bibliographicBean.openAgency.lookup(nonfbsAgency).getLibraryType());
        assertEquals(LibraryType.FBS, bibliographicBean.openAgency.lookup(fbsAgency).getLibraryType());
        assertEquals(LibraryType.FBSSchool, bibliographicBean.openAgency.lookup(schoolAgency).getLibraryType());
    }

    @Test
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
        env().getPersistenceContext().run(() -> {
            String id = "test";
            BibliographicEntity fbsOwnEntryToDelete = addBibliographic(nonfbsAgency, id);
            addHoldings(nonfbsAgency, id);

            // Check setup of base holdings are showing up
            queueIs(em,
                    queueItem(nonfbsAgency, "clazzifier", id)
            );

            // No need to keep the old updates.
            clearQueue(em);

            // Updated to potentially the same
            addBibliographic(nonfbsAgency, id);
            queueIs(em,
                    queueItem(nonfbsAgency, "clazzifier", id)
            );

            // No need to keep the old updates.
            clearQueue(em);

            deleteBibliographic(fbsOwnEntryToDelete);
            queueIs(em,
                    queueItem(nonfbsAgency, "clazzifier", id)
            );

        });

    }

    @Test
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
        env().getPersistenceContext().run(() -> {
            String id = "test";
            addBibliographic(commonAgency, id);
            BibliographicEntity fbsToDelete = addBibliographic(fbsAgency, id);
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", id),
                    queueItem(fbsAgency, "clazzifier", id)
            );
            clearQueue(em);

            addHoldings(fbsAgency, id);
            queueIs(em,
                    queueItem(fbsAgency, "clazzifier", id));
            clearQueue(em);

            deleteBibliographic(fbsToDelete);
            queueIs(em,
                    queueItem(fbsAgency, "clazzifier", id),
                    queueItem(commonAgency, "clazzifier", id));
        });
    }

    @Test
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
        env().getPersistenceContext().run(() -> {
            String id = "test";
            addBibliographic(commonAgency, id);
            BibliographicEntity toDelete = addBibliographic(schoolCommonAgency, id);
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", id),
                    queueItem(schoolCommonAgency, "clazzifier", id));
            clearQueue(em);

            addHoldings(schoolAgency, id);
            queueIs(em,
                    queueItem(schoolCommonAgency, "clazzifier", id));
            clearQueue(em);

            deleteBibliographic(toDelete);
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", id),
                    queueItem(schoolCommonAgency, "clazzifier", id));
        });

    }

    @Test
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
        env().getPersistenceContext().run(() -> {
            String id = "test";
            addBibliographic(commonAgency, id);
            HoldingsItemEntity h = addHoldings(fbsAgency, id);
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", id));
            clearQueue(em);

            h.setTrackingId("NEW");
            holdingsItemBean.setHoldingsKeys(h, Optional.empty());
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", id));
        });

    }

    @Test
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
        env().getPersistenceContext().run(() -> {
            List<String> ids = Arrays.asList("test1", "test2", "test3");
            String superseedId = "test4";

            for (String id : ids) {
                addBibliographic(commonAgency, id);
                addHoldings(fbsAgency, id);
            }
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", "test1"),
                    queueItem(commonAgency, "clazzifier", "test2"),
                    queueItem(commonAgency, "clazzifier", "test3"));
            clearQueue(em);

            int commitWithin = 100;
            addBibliographic(commonAgency, superseedId, Optional.of(ids), Optional.of(commitWithin));
            queueIs(em,
                    queueItem(commonAgency, "clazzifier", "test1", commitWithin),
                    queueItem(commonAgency, "clazzifier", "test2", commitWithin),
                    queueItem(commonAgency, "clazzifier", "test3", commitWithin),
                    queueItem(commonAgency, "clazzifier", "test4", commitWithin));

        });

    }

    @Test
    public void multipleClassifiersMoveHolding() {
        System.out.println("multipleClassifiersMoveHolding");
        env().getPersistenceContext().run(() -> {
            addBibliographic(870970, "foo", "a", Optional.empty(), Optional.empty());
            addBibliographic(870970, "bar", "a", Optional.empty(), Optional.empty());
            clearQueue(em);
            addHoldings(777777, "a");
            queueIs(em,
                    queueItem(870970, "foo", "a"),
                    queueItem(870970, "bar", "a"));

            clearQueue(em);

            addBibliographic(777777, "woop", "a", Optional.empty(), Optional.empty());
            queueIs(em,
                    queueItem(870970, "foo", "a"),
                    queueItem(870970, "bar", "a"),
                    queueItem(777777, "woop", "a"));
        });
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId) {
        return addBibliographic(agency, bibliographicRecordId, Optional.empty());
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId, Optional<List<String>> superseed) {
        return addBibliographic(agency, bibliographicRecordId, superseed, Optional.empty());
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId, Optional<List<String>> superseed, Optional commitWithin) {
        return addBibliographic(agency, "clazzifier", bibliographicRecordId, superseed, commitWithin);
    }

    private BibliographicEntity addBibliographic(int agency, String classifier, String bibliographicRecordId, Optional<List<String>> superseed, Optional commitWithin) {
        List<String> superseedList = superseed.orElse(Collections.emptyList());
        BibliographicEntity e = new BibliographicEntity(agency, classifier, bibliographicRecordId, "id#1", "w", "u", "v0.1", false, Collections.EMPTY_MAP, "IT");
        bibliographicBean.addBibliographicKeys(e, superseedList, commitWithin);
        return e;
    }

    private void deleteBibliographic(BibliographicEntity ownRecord) {
        ownRecord.setDeleted(true);
        bibliographicBean.addBibliographicKeys(ownRecord, Collections.emptyList(), Optional.empty());
    }

    private HoldingsItemEntity addHoldings(int holdingAgency, String holdingBibliographicId) {
        HoldingsItemEntity e = new HoldingsItemEntity(holdingAgency, holdingBibliographicId, "v0.1", Collections.EMPTY_LIST, "IT");
        holdingsItemBean.setHoldingsKeys(e, Optional.empty());
        return e;
    }

    private String queueItem(int agency, String classifier, String bibliographicRecordId) {
        return "a," + agency + "," + classifier + "," + bibliographicRecordId;
    }

    private String queueItem(int agency, String classifier, String bibliographicRecordId, int commitWithin) {
        return "a," + agency + "," + classifier + "," + bibliographicRecordId + "," + commitWithin;
    }

}
