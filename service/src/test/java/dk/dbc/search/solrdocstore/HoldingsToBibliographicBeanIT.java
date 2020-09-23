package dk.dbc.search.solrdocstore;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;
import static org.hamcrest.MatcherAssert.assertThat;

public class HoldingsToBibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private HoldingsToBibliographicBean bean;
    private EntityManager em;

    @Before
    public void before() {
        em = env().getEntityManager();
        bean = createHoldingsToBibliographicBean(env());
    }

    @Test
    public void updatesIfExists() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            createH2BRecord(agencyId, bibliographicRecordId, 132);
            Set<AgencyClassifierItemKey> affectedKeys = bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity abc = fetchH2BRecord(agencyId, bibliographicRecordId);
            affectedIs(affectedKeys,
                       EnqueueAdapter.makeKey(agencyId, "clazzifier", bibliographicRecordId));
            assertNotNull(abc);
            assertEquals(132, abc.getBibliographicAgencyId());
        });
    }

    @Test
    public void createsNewIfNeeded() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity h2BRecord = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(h2BRecord);
            assertEquals(132, h2BRecord.getBibliographicAgencyId());
        });
    }

    @Test
    public void ignoresDeletedBibRecords() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            deleteBibRecord(agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            assertNull(fetchH2BRecord(agencyId, bibliographicRecordId));
        });
    }

    @Test
    public void onFBSTest2Levels() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBS);

            createBibRecord(LibraryType.COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.COMMON_AGENCY, e.getBibliographicAgencyId());
        });
    }

    @Test
    public void onFBCSchoolTest3Levels() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            createBibRecord(LibraryType.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.SCHOOL_COMMON_AGENCY, e.getBibliographicAgencyId());
        });
    }

    @Test
    public void failingToAttachIsNoError() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNull(e);
        });
    }

    @Test
    public void onFBSwillReadB2B() {
        env().getPersistenceContext().run(
                () -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.FBS);

            createBibRecord(LibraryType.COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(agencyId, newRecordId);
            createB2B(bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(agencyId, e.getBibliographicAgencyId());
            assertEquals(newRecordId, e.getBibliographicRecordId());
        }
        );
    }

    @Test
    public void onFBCSchoolWillReadB2B() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.FBSSchool);
            createBibRecord(LibraryType.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(LibraryType.COMMON_AGENCY, newRecordId);
            createB2B(bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryType.COMMON_AGENCY, e.getBibliographicAgencyId());
            assertEquals(newRecordId, e.getBibliographicRecordId());
        });
    }

    @Test
    public void onB2BUpdateRecalc() {
        env().getPersistenceContext().run(() -> {
            bean.openAgency = new OpenAgencyBean();
            bean.openAgency.entityManager = em;
            bean.openAgency.proxy = null;

            // Override LibraryConfig OpenAgency by add agencies directly to cache
            int fbsSchoolAgency = 300711;
            int fbsAgencyWithoutLocalBib = 704711;
            int fbsAgencyWithLocalBib = 704712;
            int nonFbsAgency = 884750;
            createAgency(fbsSchoolAgency);
            createAgency(fbsAgencyWithoutLocalBib);
            createAgency(fbsAgencyWithLocalBib);
            createAgency(nonFbsAgency);

            int[] agencies = {fbsAgencyWithLocalBib, LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY};
            String originalRecordId = "A";
            String superseedingRecordId = "B";

            String[] recordIds = {originalRecordId, superseedingRecordId};
            for (int a : agencies) {
                for (String r : recordIds) {
                    createBibRecord(a, r);
                }
            }
            createH2BRecord(fbsAgencyWithoutLocalBib, originalRecordId, LibraryType.COMMON_AGENCY, originalRecordId);
            createH2BRecord(fbsAgencyWithLocalBib, originalRecordId, fbsAgencyWithLocalBib, originalRecordId);
            createH2BRecord(fbsSchoolAgency, originalRecordId, LibraryType.SCHOOL_COMMON_AGENCY, originalRecordId);
            createH2BRecord(nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
            createB2B(originalRecordId, superseedingRecordId);
            em.flush();

            Set<AgencyClassifierItemKey> affectedKeys = bean.recalcAttachments(superseedingRecordId, new HashSet<>(Arrays.asList(new String[] {originalRecordId})));

            affectedIs(affectedKeys,
                       EnqueueAdapter.makeKey(LibraryType.COMMON_AGENCY, "clazzifier", originalRecordId),
                       EnqueueAdapter.makeKey(LibraryType.SCHOOL_COMMON_AGENCY, "clazzifier", originalRecordId),
                       EnqueueAdapter.makeKey(fbsAgencyWithLocalBib, "clazzifier", originalRecordId),
                       EnqueueAdapter.makeKey(LibraryType.COMMON_AGENCY, "clazzifier", superseedingRecordId),
                       EnqueueAdapter.makeKey(LibraryType.SCHOOL_COMMON_AGENCY, "clazzifier", superseedingRecordId),
                       EnqueueAdapter.makeKey(fbsAgencyWithLocalBib, "clazzifier", superseedingRecordId)
            );
            assertH2B(fbsAgencyWithoutLocalBib, originalRecordId, LibraryType.COMMON_AGENCY, superseedingRecordId);
            assertH2B(fbsSchoolAgency, originalRecordId, LibraryType.SCHOOL_COMMON_AGENCY, superseedingRecordId);
            assertH2B(nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
        });
    }

    private void assertH2B(
            int holdingsAgencyId,
            String holdingsBibliographicRecordId,
            int bibliographicAgencyId,
            String bibliographicRecordId) {
        HoldingsToBibliographicEntity e = fetchH2BRecord(holdingsAgencyId, holdingsBibliographicRecordId);
        assertEquals(e.toString(), bibliographicAgencyId, e.getBibliographicAgencyId());
        assertEquals(e.toString(), bibliographicRecordId, e.getBibliographicRecordId());
    }

    @Test
    public void onNonFBSWillIgnoreB2B() {
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.openAgency = mockToReturn(LibraryType.NonFBS);
            createBibRecord(agencyId, bibliographicRecordId);
            createBibRecord(LibraryType.COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(LibraryType.COMMON_AGENCY, newRecordId);
            createB2B(bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(agencyId, e.getBibliographicAgencyId());
            assertEquals(bibliographicRecordId, e.getBibliographicRecordId());
        });
    }

    @Test
    public void isCommonDerived() throws Exception {
        env().getPersistenceContext().run(() -> {
            String biblId = "87654321";
            createBibRecord(301020, biblId);
            createBibRecord(701020, biblId);
            createBibRecord(870970, biblId);
            createBibRecord(876543, biblId);
            createAgency(301020);
            createAgency(302030);
            createAgency(701020);
            createAgency(702030);
            createAgency(876543);
            bean.tryToAttachToBibliographicRecord(301020, biblId);
            bean.tryToAttachToBibliographicRecord(302030, biblId);
            bean.tryToAttachToBibliographicRecord(701020, biblId);
            bean.tryToAttachToBibliographicRecord(702030, biblId);
            bean.tryToAttachToBibliographicRecord(702030, biblId);
            bean.tryToAttachToBibliographicRecord(876543, biblId);
            HoldingsToBibliographicEntity h2b_301020 = fetchH2BRecord(301020, biblId);
            HoldingsToBibliographicEntity h2b_302030 = fetchH2BRecord(302030, biblId);
            HoldingsToBibliographicEntity h2b_701020 = fetchH2BRecord(701020, biblId);
            HoldingsToBibliographicEntity h2b_702030 = fetchH2BRecord(702030, biblId);
            HoldingsToBibliographicEntity h2b_876543 = fetchH2BRecord(876543, biblId);
            assertEquals(new HoldingsToBibliographicEntity(301020, biblId, 301020, false), h2b_301020);
            assertEquals(new HoldingsToBibliographicEntity(302030, biblId, LibraryType.COMMON_AGENCY, false), h2b_302030);
            assertEquals(new HoldingsToBibliographicEntity(701020, biblId, 701020, true), h2b_701020);
            assertEquals(new HoldingsToBibliographicEntity(702030, biblId, LibraryType.COMMON_AGENCY, true), h2b_702030);
            assertEquals(new HoldingsToBibliographicEntity(876543, biblId, 876543, false), h2b_876543);
        });
    }

    private void createB2B(String oldRecordId, String newRecordId) {
        em.merge(new BibliographicToBibliographicEntity(oldRecordId, newRecordId));
    }

    private OpenAgencyBean mockToReturn(LibraryType libraryType) {
        OpenAgencyBean mock = Mockito.mock(OpenAgencyBean.class);
        Mockito.when(mock.lookup(Mockito.anyInt())).thenReturn(new OpenAgencyEntity(-1, libraryType, true, true, true));
        return mock;
    }

    private HoldingsToBibliographicEntity fetchH2BRecord(int agencyId, String bibliographicRecordId) {
        return em.find(HoldingsToBibliographicEntity.class,
                       new HoldingsToBibliographicKey(agencyId, bibliographicRecordId));
    }

    private void deleteBibRecord(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = em.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, "clazzifier", bibliographicRecordId));
        e.setDeleted(true);
        em.merge(e);
    }

    private void createBibRecord(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#1", "w", "u", "v0.1", false, Collections.EMPTY_MAP, "IT");
        em.merge(e);
    }

    private void affectedIs(Set<AgencyClassifierItemKey> affectedKeys, AgencyClassifierItemKey... keys) {
        assertThat(affectedKeys, containsInAnyOrder(keys));
        assertEquals(keys.length, affectedKeys.size());
    }

    private void createH2BRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId) {
        createH2BRecord(holdingsAgencyId, holdingsBibliographicRecordId, bibliographicAgencyId, holdingsBibliographicRecordId);
    }

    private void createH2BRecord(
            int holdingsAgencyId,
            String holdingsBibliographicRecordId,
            int bibliographicAgencyId,
            String bibliographicRecordId) {

        HoldingsToBibliographicEntity e = new HoldingsToBibliographicEntity(
                holdingsAgencyId,
                holdingsBibliographicRecordId,
                bibliographicAgencyId,
                bibliographicRecordId,
                false
        );
        em.merge(e);
    }

    private void createAgency(int agencyId) {
        em.merge(makeOpenAgencyEntity(agencyId));
    }

}
