package dk.dbc.search.solrdocstore;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;

public class AgencyLibraryTypeBeanIT extends JpaSolrDocStoreIntegrationTester {

    EntityManager em;

    AgencyLibraryTypeBean bean;

    @Before
    public void setupBean() {
        em = env().getEntityManager();
        bean = new AgencyLibraryTypeBean();
        bean.entityManager = em;
    }

    @Test
    public void insertFindAndDelete(){
        int dummyAgency = 1234;
        LibraryConfig.LibraryType dummyType = LibraryConfig.LibraryType.FBSSchool;

        persist(dummyAgency,dummyType, bean.entityManager);

        LibraryConfig.LibraryType libraryType = bean.fetchAndCacheLibraryType(dummyAgency);
        Assert.assertEquals(dummyType,libraryType);
        remove(dummyAgency,bean.entityManager);

        AgencyLibraryTypeEntity entity = findEntityWithKey(dummyAgency, bean.entityManager);
        Assert.assertNull(entity);
    }

    private void remove(int agency, EntityManager em) {
        AgencyLibraryTypeEntity entity = findEntityWithKey(agency, em);
        env().getPersistenceContext().run( () -> em.remove(entity));
    }

    private void persist(int key, LibraryConfig.LibraryType fbs, EntityManager em) {
        env().getPersistenceContext().run(() -> {
            AgencyLibraryTypeEntity e = new AgencyLibraryTypeEntity();
            e.agencyId = key;
            e.libraryType = fbs.name();
            em.persist(e);
        });
    }

    private AgencyLibraryTypeEntity findEntityWithKey(int key, EntityManager em){
        return env().getPersistenceContext().run(() -> em.find(AgencyLibraryTypeEntity.class, key));

    }

}