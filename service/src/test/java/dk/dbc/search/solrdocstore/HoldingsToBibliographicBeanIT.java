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
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        AgencyItemKey key = new AgencyItemKey(132,"ABC");
        createBibRecord(key, LibraryConfig.LibraryType.FBS);
        createH2BRecord(key,132);
        bean.tryToAttachToBibliographicRecord(key);
        HoldingsToBibliographicEntity abc = fetchH2BRecord(key);
        Assert.assertNotNull(abc);
        Assert.assertEquals(132,abc.bibliographicAgencyId);
    }

    @Test
    public void createsNewIfNeeded(){
        AgencyItemKey key = new AgencyItemKey(132,"ABC");
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(key, LibraryConfig.LibraryType.FBS);
        bean.tryToAttachToBibliographicRecord(key);
        HoldingsToBibliographicEntity h2BRecord = fetchH2BRecord(key);
        Assert.assertNotNull(h2BRecord);
        Assert.assertEquals(132,h2BRecord.bibliographicAgencyId);
    }

    @Test
    public void ignoresDeletedBibRecords(){
        AgencyItemKey key = new AgencyItemKey(132,"ABC");
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(key,LibraryConfig.LibraryType.FBS);
        deleteBibRecord(key);
        bean.tryToAttachToBibliographicRecord(key);
        Assert.assertNull( fetchH2BRecord(key) );
    }

    @Test
    public void onFBSTest2Levels(){
        AgencyItemKey holdingKey = new AgencyItemKey(123, "ABC");
        AgencyItemKey bibKey = new AgencyItemKey(LibraryConfig.COMMON_AGENCY,"ABC");
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBS);
        createBibRecord(bibKey,LibraryConfig.LibraryType.FBS);
        bean.tryToAttachToBibliographicRecord(holdingKey);
        HoldingsToBibliographicEntity e = fetchH2BRecord(holdingKey);
        Assert.assertNotNull(e);
        Assert.assertEquals(LibraryConfig.COMMON_AGENCY,e.bibliographicAgencyId);
    }

    @Test
    public void onFBCSchoolTest3Levels(){
        AgencyItemKey holdingKey = new AgencyItemKey(123, "ABC");
        AgencyItemKey bibKey = new AgencyItemKey(LibraryConfig.SCHOOL_COMMON_AGENCY,"ABC");
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
        createBibRecord(bibKey,LibraryConfig.LibraryType.FBSSchool);
        bean.tryToAttachToBibliographicRecord(holdingKey);
        HoldingsToBibliographicEntity e = fetchH2BRecord(holdingKey);
        Assert.assertNotNull(e);
        Assert.assertEquals(LibraryConfig.SCHOOL_COMMON_AGENCY,e.bibliographicAgencyId);
    }

    @Test
    public void failingToAttachIsNoError(){
        AgencyItemKey holdingKey = new AgencyItemKey(123, "ABC");
        bean.libraryConfig = mockToReturn(LibraryConfig.LibraryType.FBSSchool);
        bean.tryToAttachToBibliographicRecord(holdingKey);
        HoldingsToBibliographicEntity e = fetchH2BRecord(holdingKey);
        Assert.assertNull(e);
    }

    private LibraryConfig mockToReturn(LibraryConfig.LibraryType libraryType){
        LibraryConfig mock = Mockito.mock(LibraryConfig.class);
        Mockito.when(mock.getLibraryType(Mockito.anyInt())).thenReturn(libraryType);

        return mock;

    }

    private HoldingsToBibliographicEntity fetchH2BRecord(AgencyItemKey k){
        return env().getPersistenceContext().run( () ->
            em.find(HoldingsToBibliographicEntity.class, k)
        );
    }
    private void deleteBibRecord(AgencyItemKey k){
        BibliographicEntity e = env().getPersistenceContext().run(() ->
                em.find(BibliographicEntity.class, k));
        e.deleted = true;
        em.merge(e);
    }
    private void createBibRecord(AgencyItemKey key, LibraryConfig.LibraryType libraryType) {
        env().getPersistenceContext().run(() -> {
            BibliographicEntity e = new BibliographicEntity();
            e.bibliographicRecordId = key.bibliographicRecordId;
            e.agencyId = key.agencyId;
            e.work = "{}";
            e.unit = "{}";
            e.deleted=false;
            e.trackingId = "dummy";
            em.merge(e);
        });
    }

    private void createH2BRecord(AgencyItemKey key, int bibliographicAgencyId) {
        env().getPersistenceContext().run( () -> {
           HoldingsToBibliographicEntity e = new HoldingsToBibliographicEntity();
           e.agencyId = key.agencyId;
           e.bibliographicRecordId = key.bibliographicRecordId;
           e.bibliographicAgencyId = bibliographicAgencyId;
           em.merge(e);
        });
    }

}
