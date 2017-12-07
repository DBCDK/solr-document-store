package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRulesProxy;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;

public class AgencyLibraryTypeBeanIT extends JpaSolrDocStoreIntegrationTester {

    private EntityManager em;

    private AgencyLibraryTypeBean bean;

    private int realAgency = 133020;

    @Before
    public void setupBean() {
        em = env().getEntityManager();
        bean = new AgencyLibraryTypeBean();
        bean.entityManager = em;
        bean.proxy = new LibraryRulesProxy();
    }

    @Test
    public void ensureReadsCache(){
        int dummyAgency = 1234;
        LibraryConfig.LibraryType dummyType = LibraryConfig.LibraryType.NonFBS;

        persist(dummyAgency,dummyType);

        LibraryConfig.LibraryType libraryType = bean.fetchAndCacheLibraryType(dummyAgency);
        Assert.assertEquals(dummyType,libraryType);
        remove(dummyAgency);

        AgencyLibraryTypeEntity entity = findEntityWithKey(dummyAgency);
        Assert.assertNull(entity);
    }

    @Test
    public void canReadRealAgency(){

        LibraryConfig.LibraryType expectedType = LibraryConfig.LibraryType.FBSSchool;

        LibraryConfig.LibraryType libraryType = bean.fetchAndCacheLibraryType(realAgency);
        Assert.assertEquals(expectedType,libraryType);
    }

    @Test
    public void ensureReadCacheFirst(){
        canReadRealAgency(); //Plants realAgency in the database
        update(realAgency, LibraryConfig.LibraryType.FBS);
        Assert.assertEquals(LibraryConfig.LibraryType.FBS,bean.fetchAndCacheLibraryType(realAgency));
        remove(realAgency);
    }

    private void remove(int agency) {
        AgencyLibraryTypeEntity entity = findEntityWithKey(agency);
        env().getPersistenceContext().run( () -> em.remove(entity));
    }

    private void update(int agency, LibraryConfig.LibraryType libraryType) {
        AgencyLibraryTypeEntity entity = findEntityWithKey(agency);
        entity.libraryType = libraryType.name();
        env().getPersistenceContext().run( () -> em.merge(entity));
    }

    private void persist(int key, LibraryConfig.LibraryType fbs) {
        env().getPersistenceContext().run(() -> {
            AgencyLibraryTypeEntity e = new AgencyLibraryTypeEntity();
            e.agencyId = key;
            e.libraryType = fbs.name();
            em.persist(e);
        });
    }

    private AgencyLibraryTypeEntity findEntityWithKey(int key){
        return env().getPersistenceContext().run(() -> em.find(AgencyLibraryTypeEntity.class, key));

    }

}