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
import java.util.*;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.QueueTestUtil.clearQueue;
import static dk.dbc.search.solrdocstore.QueueTestUtil.queueIs;
import static org.junit.Assert.fail;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(EnqueueSupplierBeanIT.class);
    private BibliographicBean bibliographicBean;
    private HoldingsItemBean holdingsItemBean;
    private EntityManager em ;

    @Before
    public void onTest(){
        bibliographicBean = BeanFactoryUtil.createBibliographicBean( env() );
        holdingsItemBean = BeanFactoryUtil.createHoldingsItemBean(bibliographicBean.entityManager, bibliographicBean.h2bBean, bibliographicBean.queue);
        em = bibliographicBean.entityManager;
    }

    @Test
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
            EnqeueService<AgencyItemKey> enqeueService = bean.getManifestationEnqueueService();

            try {
                System.out.println("* no commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "12345678"));
                System.out.println("* commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "87654321"), 100);
                System.out.println("* null commitWithin");
                enqeueService.enqueue(new AgencyItemKey(870970, "abc"), null);
            } catch (SQLException ex) {
                log.error("Exception: " + ex.getMessage());
                log.debug("Exception:", ex);
            }

            queueIs(em,
                    "a,870970,12345678",
                    "b,870970,12345678",
                    "a,870970,87654321,100",
                    "b,870970,87654321,100",
                    "a,870970,abc",
                    "b,870970,abc");
        });
    }


    public void queueReactsToChanges()  {
        int fbsLibrary       = 471100;
        int fbsSchoolLibrary = 222222;

        String bibliographicRecordId1 = "q1";
        String bibliographicRecordId2 = "q2";
        String bibliographicRecordId3 = "q3";
        String bibliographicRecordId4 = "q4";

        env().getPersistenceContext().run(() -> {
            addBibliographic(LibraryConfig.COMMON_AGENCY,bibliographicRecordId1);
            addHoldings(fbsLibrary,bibliographicRecordId1);

            addBibliographic(LibraryConfig.COMMON_AGENCY,bibliographicRecordId2);
            addHoldings(fbsLibrary,bibliographicRecordId2);

            addBibliographic(LibraryConfig.COMMON_AGENCY,bibliographicRecordId3);
            addHoldings(fbsLibrary,bibliographicRecordId3);

            BibliographicEntity fbsSchoolCommonEntryToDelete = addBibliographic(LibraryConfig.SCHOOL_COMMON_AGENCY, bibliographicRecordId3);

            addHoldings(fbsSchoolLibrary,bibliographicRecordId3);

            BibliographicEntity fbsOwnEntryToDelete = addBibliographic(fbsLibrary,bibliographicRecordId1);
            addHoldings(fbsLibrary,bibliographicRecordId1);

            // Check setup of base holdings are showing up
            queueIs(em,
                    queueItem(LibraryConfig.COMMON_AGENCY, bibliographicRecordId1),
                    queueItem(LibraryConfig.COMMON_AGENCY, bibliographicRecordId2),
                    queueItem(LibraryConfig.COMMON_AGENCY, bibliographicRecordId3),
                    queueItem(LibraryConfig.SCHOOL_COMMON_AGENCY, bibliographicRecordId3),
                    queueItem(fbsLibrary,bibliographicRecordId1)
            );

            // No need to keep the old updates.
            clearQueue(em);

            // Delete 471100's own version of "q1"
            deleteBibliographic( fbsOwnEntryToDelete );

            // The holdings on "q1" will now the moved to the common bibliographic record.
            // Expect notification on both the deleted own-record and the common record.

            queueIs(em,
                    queueItem(fbsLibrary,bibliographicRecordId1),
                    queueItem( LibraryConfig.COMMON_AGENCY,bibliographicRecordId1));

            // No need to keep the old updates.
            clearQueue(em);

            // Add a holding in fbsLibrary to "q2"
            addHoldings(fbsLibrary,bibliographicRecordId2);
            // Expect notification on own book
            queueIs(em,
                    queueItem( LibraryConfig.COMMON_AGENCY, bibliographicRecordId2));

            clearQueue(em);

            // Will attach to common school record
            addHoldings(fbsSchoolLibrary,bibliographicRecordId3);

            queueIs(em,
                    queueItem(LibraryConfig.SCHOOL_COMMON_AGENCY,bibliographicRecordId3) );

            clearQueue(em);

            deleteBibliographic(fbsSchoolCommonEntryToDelete);

            queueIs(em,
                    queueItem(LibraryConfig.SCHOOL_COMMON_AGENCY,bibliographicRecordId3),
                    queueItem(LibraryConfig.COMMON_AGENCY,bibliographicRecordId3));

            // At this point only LibraryConfig.COMMON_AGENCY, bibliographicRecordId1-3 exist
            // and all holdings are pointing to them.

            addBibliographic(LibraryConfig.COMMON_AGENCY, bibliographicRecordId4,
                    Optional.of(Arrays.asList( bibliographicRecordId1,bibliographicRecordId2,bibliographicRecordId3)));

            queueIs(em,
                    queueItem(LibraryConfig.COMMON_AGENCY,bibliographicRecordId1),
                    queueItem(LibraryConfig.COMMON_AGENCY,bibliographicRecordId2),
                    queueItem(LibraryConfig.COMMON_AGENCY,bibliographicRecordId3),
                    queueItem(LibraryConfig.COMMON_AGENCY,bibliographicRecordId4)
            );

        });
    }

    private void flushAndFail() {
        em.flush(); fail("Hard stop");
    }

    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId){
        return addBibliographic(agency,bibliographicRecordId,Optional.empty());
    }
    private BibliographicEntity addBibliographic(int agency, String bibliographicRecordId, Optional<List<String>> superseed){
        List<String> superseedList = superseed.orElse(Collections.emptyList());
        Optional<Integer> commitWithin  = Optional.empty();
        BibliographicEntityRequest e = new BibliographicEntityRequest();
        e.agencyId = agency;
        e.bibliographicRecordId = bibliographicRecordId;
        e.unit = "u";
        e.work = "w";
        e.trackingId = "IT";
        bibliographicBean.addBibliographicKeys(e,superseedList, commitWithin);
        return e;
    }

    private void deleteBibliographic(BibliographicEntity ownRecord) {
        ownRecord.deleted = true;
        bibliographicBean.addBibliographicKeys(ownRecord,Collections.emptyList(),Optional.empty());
    }

    private void superseedBibliographic(int agencyId, String bibliographicRecordId, List<String> strings) {

    }


    private HoldingsItemEntity addHoldings(int holdingAgency, String holdingBibliographicId) {
        HoldingsItemEntity e = new HoldingsItemEntity();
        e.agencyId = holdingAgency;
        e.bibliographicRecordId = holdingBibliographicId;
        e.indexKeys = Collections.emptyList();
        e.producerVersion = "1";
        e.trackingId = "IT";
        holdingsItemBean.setHoldingsKeys(e);
        return e;
    }
    private String queueItem(int agency, String bibliographicRecordId){
        return "a," + agency + "," + bibliographicRecordId;
    }
}
