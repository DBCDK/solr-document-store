package dk.dbc.search.solrdocstore;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

public class HoldingsToBibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private HoldingsToBibliographicBean bean;
    private EntityManager em;

    @Before
    public void before(){
        em = env().getEntityManager();
        bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.libraryConfig = new LibraryConfig();
    }

    @Test
    public void updatesIfExists(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            createH2BRecord(agencyId, bibliographicRecordId, 132);
            Set<AgencyItemKey> affectedKeys = bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity abc = fetchH2BRecord(agencyId, bibliographicRecordId);
            affectedIs(affectedKeys,
                    EnqueueAdapter.makeKey(agencyId,bibliographicRecordId));
            assertNotNull(abc);
            assertEquals(132, abc.bibliographicAgencyId);
        });
    }

    @Test
    public void createsNewIfNeeded(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity h2BRecord = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(h2BRecord);
            assertEquals(132, h2BRecord.bibliographicAgencyId);
        });
    }

    @Test
    public void ignoresDeletedBibRecords(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
            createBibRecord(agencyId, bibliographicRecordId);
            deleteBibRecord(agencyId, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            assertNull(fetchH2BRecord(agencyId, bibliographicRecordId));
        });
    }

    @Test
    public void onFBSTest2Levels(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);

            createBibRecord(LibraryConfig.COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryConfig.COMMON_AGENCY, e.bibliographicAgencyId);
        });
    }

    @Test
    public void onFBCSchoolTest3Levels(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
            createBibRecord(LibraryConfig.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryConfig.SCHOOL_COMMON_AGENCY, e.bibliographicAgencyId);
        });
    }

    @Test
    public void failingToAttachIsNoError(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNull(e);
        });
    }

    @Test
    public void onFBSwillReadB2B(){
        env().getPersistenceContext().run(
                () -> {
                    int agencyId = 132;
                    String bibliographicRecordId = "ABC";
                    String newRecordId="DEF";

                    bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);

                    createBibRecord(LibraryConfig.COMMON_AGENCY, bibliographicRecordId);
                    createBibRecord(agencyId,newRecordId);
                    createB2B(bibliographicRecordId,newRecordId);
                    bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
                    HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
                    assertNotNull(e);
                    assertEquals(agencyId,e.bibliographicAgencyId);
                    assertEquals(newRecordId,e.bibliographicRecordId);
                }
        );
    }

    @Test
    public void onFBCSchoolWillReadB2B(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
            createBibRecord(LibraryConfig.SCHOOL_COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(LibraryConfig.COMMON_AGENCY, newRecordId);
            createB2B(bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(LibraryConfig.COMMON_AGENCY, e.bibliographicAgencyId);
            assertEquals(newRecordId, e.bibliographicRecordId);
        });
    }

    @Test
    public void onB2BUpdateRecalc(){
        env().getPersistenceContext().run(() -> {
            bean.libraryConfig = new LibraryConfig();
            bean.libraryConfig.agencyLibraryTypeBean = new AgencyLibraryTypeBean();
            bean.libraryConfig.agencyLibraryTypeBean.entityManager = em;

            // Override LibraryConfig OpenAgency by add agencies directly to cache
            int fbsSchoolAgency = 3711;
            int fbsAgencyWithoutLocalBib = 4711;
            int fbsAgencyWithLocalBib = 4712;
            int nonFbsAgency = 4750;
            createAgency(fbsSchoolAgency, LibraryConfig.LibraryType.FBSSchool);
            createAgency(fbsAgencyWithoutLocalBib, LibraryConfig.LibraryType.FBS);
            createAgency(fbsAgencyWithLocalBib, LibraryConfig.LibraryType.FBS);
            createAgency(nonFbsAgency, LibraryConfig.LibraryType.NonFBS);

            int[] agencies = {fbsAgencyWithLocalBib, LibraryConfig.SCHOOL_COMMON_AGENCY, LibraryConfig.COMMON_AGENCY};
            String originalRecordId = "A";
            String superseedingRecordId = "B";

            String[] recordIds = {originalRecordId, superseedingRecordId};
            for (int a : agencies) {
                for (String r : recordIds) {
                    createBibRecord(a, r);
                }
            }
            createH2BRecord(fbsAgencyWithoutLocalBib, originalRecordId, LibraryConfig.COMMON_AGENCY, originalRecordId);
            createH2BRecord(fbsAgencyWithLocalBib, originalRecordId, fbsAgencyWithLocalBib, originalRecordId);
            createH2BRecord(fbsSchoolAgency, originalRecordId, LibraryConfig.SCHOOL_COMMON_AGENCY, originalRecordId);
            createH2BRecord(nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
            createB2B(originalRecordId, superseedingRecordId);
            em.flush();

            Set<AgencyItemKey> affectedKeys = bean.recalcAttachments(superseedingRecordId, new HashSet<>(Arrays.asList(new String[]{originalRecordId})));

            affectedIs(affectedKeys,
                    EnqueueAdapter.makeKey(LibraryConfig.COMMON_AGENCY, originalRecordId),
                    EnqueueAdapter.makeKey(LibraryConfig.SCHOOL_COMMON_AGENCY, originalRecordId),
                    EnqueueAdapter.makeKey(fbsAgencyWithLocalBib, originalRecordId),
                    EnqueueAdapter.makeKey(LibraryConfig.COMMON_AGENCY, superseedingRecordId),
                    EnqueueAdapter.makeKey(LibraryConfig.SCHOOL_COMMON_AGENCY, superseedingRecordId),
                    EnqueueAdapter.makeKey(fbsAgencyWithLocalBib, superseedingRecordId)
                    );
            assertH2B(fbsAgencyWithoutLocalBib, originalRecordId, LibraryConfig.COMMON_AGENCY, superseedingRecordId);
            assertH2B(fbsSchoolAgency, originalRecordId, LibraryConfig.SCHOOL_COMMON_AGENCY, superseedingRecordId);
            assertH2B(nonFbsAgency, originalRecordId, nonFbsAgency, originalRecordId);
        });
    }
    private void assertH2B(
            int holdingsAgencyId,
            String holdingsBibliographicRecordId,
            int bibliographicAgencyId,
            String bibliographicRecordId){
        HoldingsToBibliographicEntity e = fetchH2BRecord(holdingsAgencyId, holdingsBibliographicRecordId);
        assertEquals(e.toString(),bibliographicAgencyId, e.bibliographicAgencyId);
        assertEquals(e.toString(),bibliographicRecordId, e.bibliographicRecordId);
    }

    @Test
    public void onNonFBSWillIgnoreB2B(){
        env().getPersistenceContext().run(() -> {
            int agencyId = 132;
            String bibliographicRecordId = "ABC";
            String newRecordId = "DEF";

            bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.NonFBS);
            createBibRecord(agencyId, bibliographicRecordId);
            createBibRecord(LibraryConfig.COMMON_AGENCY, bibliographicRecordId);
            createBibRecord(LibraryConfig.COMMON_AGENCY, newRecordId);
            createB2B(bibliographicRecordId, newRecordId);
            bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
            HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
            assertNotNull(e);
            assertEquals(agencyId, e.bibliographicAgencyId);
            assertEquals(bibliographicRecordId, e.bibliographicRecordId);
        });
    }

    private void createB2B(String oldRecordId, String newRecordId) {
        BibliographicToBibliographicEntity e = new BibliographicToBibliographicEntity();
        e.deadBibliographicRecordId = oldRecordId;
        e.liveBibliographicRecordId = newRecordId;
        em.merge(e);
    }

    private LibraryConfig mockToReturn(LibraryConfig.LibraryType libraryType){
        LibraryConfig mock = Mockito.mock(LibraryConfig.class);
        Mockito.when(mock.getLibraryType(Mockito.anyInt())).thenReturn(libraryType);

        return mock;

    }

    private HoldingsToBibliographicEntity fetchH2BRecord(int agencyId, String bibliographicRecordId){
        return
            em.find(HoldingsToBibliographicEntity.class,
                    new HoldingsToBibliographicKey(agencyId, bibliographicRecordId));
    }
    private void deleteBibRecord(int agencyId, String bibliographicRecordId){
        BibliographicEntity e = em.find(BibliographicEntity.class, new AgencyItemKey().withAgencyId(agencyId).withBibliographicRecordId(bibliographicRecordId));
        e.setDeleted(true);
        em.merge(e);
    }

    private void createBibRecord(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = new BibliographicEntity(agencyId, bibliographicRecordId, "w", "u", "v0.1", false, Collections.EMPTY_MAP, "IT");
        em.merge(e);
    }

    private void affectedIs(Set<AgencyItemKey> affectedKeys, AgencyItemKey... keys) {
        assertThat(affectedKeys, containsInAnyOrder(keys));
        assertEquals(keys.length,affectedKeys.size());
    }

    private void createH2BRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId) {
        createH2BRecord(holdingsAgencyId,holdingsBibliographicRecordId,bibliographicAgencyId,holdingsBibliographicRecordId);
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
                   bibliographicRecordId
                   );
           em.merge(e);
    }

    private void createAgency(int agencyId, LibraryConfig.LibraryType t){
            em.merge(new AgencyLibraryTypeEntity(agencyId, t.name()));
    }

}
