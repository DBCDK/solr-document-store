package dk.dbc.search.solrdocstore;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import javax.persistence.EntityManager;

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
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(agencyId, bibliographicRecordId);
        createH2BRecord(agencyId, bibliographicRecordId, 132);
        bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
        HoldingsToBibliographicEntity abc = fetchH2BRecord(agencyId, bibliographicRecordId);
        Assert.assertNotNull(abc);
        Assert.assertEquals(132,abc.bibliographicAgencyId);
    }

    @Test
    public void createsNewIfNeeded(){
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(agencyId, bibliographicRecordId);
        bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
        HoldingsToBibliographicEntity h2BRecord = fetchH2BRecord(agencyId, bibliographicRecordId);
        Assert.assertNotNull(h2BRecord);
        Assert.assertEquals(132,h2BRecord.bibliographicAgencyId);
    }

    @Test
    public void ignoresDeletedBibRecords(){
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(agencyId,bibliographicRecordId);
        deleteBibRecord(agencyId,bibliographicRecordId);
        bean.tryToAttachToBibliographicRecord(agencyId,bibliographicRecordId);
        Assert.assertNull( fetchH2BRecord(agencyId,bibliographicRecordId) );
    }

    @Test
    public void onFBSTest2Levels(){
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);

        createBibRecord(LibraryConfig.COMMON_AGENCY, bibliographicRecordId);
        bean.tryToAttachToBibliographicRecord(agencyId, bibliographicRecordId);
        HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId, bibliographicRecordId);
        Assert.assertNotNull(e);
        Assert.assertEquals(LibraryConfig.COMMON_AGENCY,e.bibliographicAgencyId);
    }

    @Test
    public void onFBCSchoolTest3Levels(){
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
        createBibRecord(LibraryConfig.SCHOOL_COMMON_AGENCY,bibliographicRecordId);
        bean.tryToAttachToBibliographicRecord(agencyId,bibliographicRecordId);
        HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId,bibliographicRecordId);
        Assert.assertNotNull(e);
        Assert.assertEquals(LibraryConfig.SCHOOL_COMMON_AGENCY,e.bibliographicAgencyId);
    }

    @Test
    public void failingToAttachIsNoError(){
        int agencyId = 132;
        String bibliographicRecordId = "ABC";

        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
        bean.tryToAttachToBibliographicRecord(agencyId,bibliographicRecordId);
        HoldingsToBibliographicEntity e = fetchH2BRecord(agencyId,bibliographicRecordId);
        Assert.assertNull(e);
    }

    private LibraryConfig mockToReturn(LibraryConfig.LibraryType libraryType){
        LibraryConfig mock = Mockito.mock(LibraryConfig.class);
        Mockito.when(mock.getLibraryType(Mockito.anyInt())).thenReturn(libraryType);

        return mock;

    }

    private HoldingsToBibliographicEntity fetchH2BRecord(int agencyId, String bibliographicRecordId){
        return env().getPersistenceContext().run( () ->
            em.find(HoldingsToBibliographicEntity.class,
                    new HoldingsToBibliographicKey()
                            .withHoldingAgencyId(agencyId)
                            .withHoldingsBibliographicRecordId(bibliographicRecordId))
        );
    }
    private void deleteBibRecord(int agencyId, String bibliographicRecordId){
        BibliographicEntity e = env().getPersistenceContext().run(() ->
                em.find(BibliographicEntity.class, new AgencyItemKey().withAgencyId(agencyId).withBibliographicRecordId(bibliographicRecordId)));
        e.deleted = true;
        em.merge(e);
    }
    private void createBibRecord(int agencyId, String bibliographicRecordId) {
        env().getPersistenceContext().run(() -> {
            BibliographicEntity e = new BibliographicEntity();
            e.bibliographicRecordId = bibliographicRecordId;
            e.agencyId = agencyId;
            e.work = "{}";
            e.unit = "{}";
            e.deleted=false;
            e.trackingId = "dummy";
            em.merge(e);
        });
    }

    private void createH2BRecord(int agencyId, String bibliographicRecordId, int bibliographicAgencyId) {
        env().getPersistenceContext().run( () -> {
           HoldingsToBibliographicEntity e = new HoldingsToBibliographicEntity(
                   agencyId,
                   bibliographicRecordId,
                   bibliographicAgencyId
           );
           em.merge(e);
        });
    }

}
