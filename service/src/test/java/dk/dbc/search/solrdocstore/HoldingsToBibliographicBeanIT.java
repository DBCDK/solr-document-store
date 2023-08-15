package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.logic.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import jakarta.persistence.EntityManager;
import org.junit.Test;
import org.mockito.Mockito;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;
import static org.hamcrest.MatcherAssert.assertThat;

public class HoldingsToBibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void updatesIfExists() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            MockEnqueueCollector mockEnqueueCollector = new MockEnqueueCollector();

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(em, agencyId, bibliographicRecordId);
            createH2BRecord(em, agencyId, 132, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, mockEnqueueCollector, QueueType.HOLDING);
            HoldingsToBibliographicEntity abc = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertThat(mockEnqueueCollector.getJobs(), containsInAnyOrder(
                       "HOLDING:" + agencyId + "-clazzifier:" + bibliographicRecordId));
            assertNotNull(abc);
            assertEquals(132, abc.getBibliographicAgencyId());
        });
    }

    @Test
    public void createsNewIfNeeded() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(em, agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity h2BRecord = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(h2BRecord);
            assertEquals(132, h2BRecord.getBibliographicAgencyId());
        });
    }

    @Test
    public void ignoresDeletedBibRecords() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(em, agencyId, bibliographicRecordId);
            deleteBibRecord(em, agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            assertNull(fetchH2BRecord(em, agencyId, bibliographicRecordId));
        });
    }

    @Test
    public void onFBSTest2Levels() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);

            createBibRecord(em, LibraryType.COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.COMMON_AGENCY, e.getBibliographicAgencyId());
        });
    }

    @Test
    public void failingToAttachIsNoError() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNull(e);
        });
    }

    @Test
    public void isCommonDerived() throws Exception {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            String biblId = "87654321";
            createBibRecord(em, 301020, biblId);
            createBibRecord(em, 701020, biblId);
            createBibRecord(em, 870970, biblId);
            createBibRecord(em, 876543, biblId);
            createAgency(em, 301020);
            createAgency(em, 302030);
            createAgency(em, 701020);
            createAgency(em, 702030);
            createAgency(em, 876543);
            bean.tryToAttachToBibliographicRecord(301020, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            bean.tryToAttachToBibliographicRecord(302030, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            bean.tryToAttachToBibliographicRecord(701020, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            bean.tryToAttachToBibliographicRecord(702030, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            bean.tryToAttachToBibliographicRecord(702030, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            bean.tryToAttachToBibliographicRecord(876543, biblId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity h2b_301020 = fetchH2BRecord(em, 301020, biblId);
            HoldingsToBibliographicEntity h2b_302030 = fetchH2BRecord(em, 302030, biblId);
            HoldingsToBibliographicEntity h2b_701020 = fetchH2BRecord(em, 701020, biblId);
            HoldingsToBibliographicEntity h2b_702030 = fetchH2BRecord(em, 702030, biblId);
            HoldingsToBibliographicEntity h2b_876543 = fetchH2BRecord(em, 876543, biblId);
            assertEquals(new HoldingsToBibliographicEntity(301020, biblId, 301020, true), h2b_301020);
            assertEquals(new HoldingsToBibliographicEntity(302030, biblId, LibraryType.COMMON_AGENCY, true), h2b_302030);
            assertEquals(new HoldingsToBibliographicEntity(701020, biblId, 701020, true), h2b_701020);
            assertEquals(new HoldingsToBibliographicEntity(702030, biblId, LibraryType.COMMON_AGENCY, true), h2b_702030);
            assertEquals(new HoldingsToBibliographicEntity(876543, biblId, 876543, false), h2b_876543);
        });
    }

    private OpenAgencyBean mockToReturn(LibraryType libraryType) {
        OpenAgencyBean mock = Mockito.mock(OpenAgencyBean.class);
        Mockito.when(mock.lookup(Mockito.anyInt())).thenReturn(new OpenAgencyEntity(-1, libraryType, true, true, true));
        return mock;
    }

    private HoldingsToBibliographicEntity fetchH2BRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        return em.find(HoldingsToBibliographicEntity.class,
                       new HoldingsToBibliographicKey(agencyId, bibliographicRecordId));
    }

    private void deleteBibRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = em.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, "clazzifier", bibliographicRecordId));
        e.setDeleted(true);
        em.merge(e);
    }

    private void createBibRecord(EntityManager em, int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#1", "w", "u", false, new IndexKeys(), "IT");
        em.merge(e);
    }

    private void createH2BRecord(EntityManager em, int holdingsAgencyId, int bibliographicAgencyId, String bibliographicRecordId) {
        HoldingsToBibliographicEntity e = new HoldingsToBibliographicEntity(
                holdingsAgencyId,
                bibliographicAgencyId,
                bibliographicRecordId,
                false
        );
        em.merge(e);
    }

    private void createAgency(EntityManager em, int agencyId) {
        em.merge(makeOpenAgencyEntity(agencyId));
    }
}
