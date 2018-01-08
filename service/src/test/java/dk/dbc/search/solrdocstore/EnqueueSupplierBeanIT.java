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
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
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
        holdingsItemBean = BeanFactoryUtil.createHoldingsItemBean(bibliographicBean.entityManager, bibliographicBean.h2bBean);
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


    private Integer nonfbsAgency = 800111;
    private Integer schoolAgency = 300111;
    private Integer fbsAgency = 600111;
    private Integer commonAgency = LibraryConfig.COMMON_AGENCY;
    private Integer schoolCommonAgency = LibraryConfig.SCHOOL_COMMON_AGENCY;

    @Test
    public void checkConfig(){
        assertEquals(LibraryConfig.LibraryType.NonFBS, bibliographicBean.libraryConfig.getLibraryType(nonfbsAgency));
        assertEquals(LibraryConfig.LibraryType.FBS, bibliographicBean.libraryConfig.getLibraryType(fbsAgency));
        assertEquals(LibraryConfig.LibraryType.FBSSchool, bibliographicBean.libraryConfig.getLibraryType(schoolAgency));
    }


    @Test
    public void singleRecords(){
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
                    queueItem(nonfbsAgency, id)
            );

            // No need to keep the old updates.
            clearQueue(em);

            deleteBibliographic(fbsOwnEntryToDelete);
            queueIs(em,
                    queueItem(nonfbsAgency, id)
            );

        });

    }

    @Test
    public void localAndCommonBibAndHoldings(){
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
        env().getPersistenceContext().run( () -> {
            String id = "test";
            addBibliographic(commonAgency, id);
            BibliographicEntity fbsToDelete = addBibliographic(fbsAgency, id);
            queueIs(em,
                    queueItem(commonAgency, id),
                    queueItem(fbsAgency, id)
                    );
            clearQueue(em);

            addHoldings(fbsAgency, id);
            queueIs(em,
                    queueItem(fbsAgency, id));
            clearQueue(em);

            deleteBibliographic(fbsToDelete);
            queueIs(em,
                    queueItem(fbsAgency, id),
                    queueItem(commonAgency, id));
        });
    }



    //TODO: @Test
    public void commonAndSchoolRecords(){
        /*
         * Common & School records
         * -----------------------
         * add Bib (870970), queue includes new Bib
         * add Bib (300000)
         * Queue contains [870970, 300000], clear queue
         * Queue is empty
         *
         * add Holding (FBS) -> Holding attaches to Bib (870970)
         * add Holding (SCHOOL) -> Holding attaches to Bib (300000)
         * Queue contains [870970, 300000], clear queue
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
        fail("Not implemented");

    }

    //TODO: @Test
    public void superseeds(){
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
