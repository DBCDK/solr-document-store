package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import java.util.Arrays;
import java.util.HashSet;
import javax.persistence.EntityManager;
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
            createH2BRecord(em, agencyId, bibliographicRecordId, 132);
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
    public void onFBCSchoolTest3Levels() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            createBibRecord(em, LibraryType.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.SCHOOL_COMMON_AGENCY, e.getBibliographicAgencyId());
        });
    }

    @Test
    public void failingToAttachIsNoError() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNull(e);
        });
    }

    @Test
    public void onFBSwillReadB2B() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.FBS);

            createBibRecord(em, LibraryType.COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(em, agencyId, newRecordId);
            createB2B(em, bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(agencyId, e.getBibliographicAgencyId());
            assertEquals(newRecordId, e.getBibliographicRecordId());
        });
    }

    @Test
    public void onFBCSchoolWillReadB2B() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            createBibRecord(em, LibraryType.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(em, LibraryType.COMMON_AGENCY, newRecordId);
            createB2B(em, bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.COMMON_AGENCY, e.getBibliographicAgencyId());
            assertEquals(newRecordId, e.getBibliographicRecordId());
        });
    }

    @Test
    public void onB2BUpdateRecalc() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            bean.openAgency = new OpenAgencyBean();
            bean.openAgency.entityManager = em;
            bean.openAgency.proxy = null;

            // Override LibraryConfig OpenAgency by add agencies directly to cache
            int fbsSchoolAgency = 300711;
            int fbsAgencyWithoutLocalBib = 704711;
            int fbsAgencyWithLocalBib = 704712;
            int nonFbsAgency = 884750;
            createAgency(em, fbsSchoolAgency);
            createAgency(em, fbsAgencyWithoutLocalBib);
            createAgency(em, fbsAgencyWithLocalBib);
            createAgency(em, nonFbsAgency);

            int[] agencies = {fbsAgencyWithLocalBib, LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY};
            String originalRecordId = "A";
            String superseedingRecordId = "B";

            String[] recordIds = {originalRecordId, superseedingRecordId};
            for (int a : agencies) {
                for (String r : recordIds) {
                    createBibRecord(em, a, r);
                }
            }
            createH2BRecord(em, fbsAgencyWithoutLocalBib, originalRecordId, LibraryType.COMMON_AGENCY, originalRecordId);
            createH2BRecord(em, fbsAgencyWithLocalBib, originalRecordId, fbsAgencyWithLocalBib, originalRecordId);
            createH2BRecord(em, fbsSchoolAgency, originalRecordId, LibraryType.SCHOOL_COMMON_AGENCY, originalRecordId);
            createH2BRecord(em, nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
            createB2B(em, originalRecordId, superseedingRecordId);
            em.flush();

            MockEnqueueCollector mockEnqueueCollector = new MockEnqueueCollector();
            bean.recalcAttachments(superseedingRecordId, new HashSet<>(Arrays.asList(new String[] {originalRecordId})),
                                   mockEnqueueCollector, QueueType.HOLDING);

            assertThat(mockEnqueueCollector.getJobs(), containsInAnyOrder(
                       "HOLDING:" + LibraryType.COMMON_AGENCY + "-clazzifier:" + originalRecordId,
                       "HOLDING:" + LibraryType.SCHOOL_COMMON_AGENCY + "-clazzifier:" + originalRecordId,
                       "HOLDING:" + fbsAgencyWithLocalBib + "-clazzifier:" + originalRecordId,
                       "HOLDING:" + LibraryType.COMMON_AGENCY + "-clazzifier:" + superseedingRecordId,
                       "HOLDING:" + LibraryType.SCHOOL_COMMON_AGENCY + "-clazzifier:" + superseedingRecordId,
                       "HOLDING:" + fbsAgencyWithLocalBib + "-clazzifier:" + superseedingRecordId));
            assertH2B(em, fbsAgencyWithoutLocalBib, originalRecordId, LibraryType.COMMON_AGENCY, superseedingRecordId);
            assertH2B(em, fbsSchoolAgency, originalRecordId, LibraryType.SCHOOL_COMMON_AGENCY, superseedingRecordId);
            assertH2B(em, nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
        });
    }

    @Test
    public void onNonFBSWillIgnoreB2B() {
        jpa(em -> {
            HoldingsToBibliographicBean bean = createHoldingsToBibliographicBean(em);
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.NonFBS);
            createBibRecord(em, agencyId, bibliographicRecordId);
            createBibRecord(em, LibraryType.COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(em, LibraryType.COMMON_AGENCY, newRecordId);
            createB2B(em, bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId, EnqueueCollector.VOID, QueueType.HOLDING);
            HoldingsToBibliographicEntity e = fetchH2BRecord(em, agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(agencyId, e.getBibliographicAgencyId());
            assertEquals(bibliographicRecordId, e.getBibliographicRecordId());
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
            assertEquals(new HoldingsToBibliographicEntity(301020, biblId, 301020, false), h2b_301020);
            assertEquals(new HoldingsToBibliographicEntity(302030, biblId, LibraryType.COMMON_AGENCY, false), h2b_302030);
            assertEquals(new HoldingsToBibliographicEntity(701020, biblId, 701020, true), h2b_701020);
            assertEquals(new HoldingsToBibliographicEntity(702030, biblId, LibraryType.COMMON_AGENCY, true), h2b_702030);
            assertEquals(new HoldingsToBibliographicEntity(876543, biblId, 876543, false), h2b_876543);
        });
    }

    private void createB2B(EntityManager em, String oldRecordId, String newRecordId) {
        em.merge(new BibliographicToBibliographicEntity(oldRecordId, newRecordId));
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

    private void createH2BRecord(EntityManager em, int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId) {
        createH2BRecord(em, holdingsAgencyId, holdingsBibliographicRecordId, bibliographicAgencyId, holdingsBibliographicRecordId);
    }

    private void createH2BRecord(EntityManager em, int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId, String bibliographicRecordId) {
        HoldingsToBibliographicEntity e = new HoldingsToBibliographicEntity(
                holdingsAgencyId,
                holdingsBibliographicRecordId,
                bibliographicAgencyId,
                bibliographicRecordId,
                false
        );
        em.merge(e);
    }

    private void assertH2B(EntityManager em, int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId, String bibliographicRecordId) {
        HoldingsToBibliographicEntity e = fetchH2BRecord(em, holdingsAgencyId, holdingsBibliographicRecordId);
        assertEquals(e.toString(), bibliographicAgencyId, e.getBibliographicAgencyId());
        assertEquals(e.toString(), bibliographicRecordId, e.getBibliographicRecordId());
    }

    private void createAgency(EntityManager em, int agencyId) {
        em.merge(makeOpenAgencyEntity(agencyId));
    }
}
