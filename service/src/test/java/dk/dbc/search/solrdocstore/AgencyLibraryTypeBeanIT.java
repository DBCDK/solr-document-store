package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRuleException;
import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRulesProxy;
import dk.dbc.search.solrdocstore.openagency.libraryrules.OpenAgencyClient;
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
        OpenAgencyClient openAgencyClient = new OpenAgencyClient();
        Config openAgencyConfig = new Config();
        openAgencyConfig.loadProperties();
        openAgencyClient.setConfig(openAgencyConfig);
        bean.proxy.setOaclient(openAgencyClient);
    }

    @Test
    public void ensureReadsCache() {
        int dummyAgency = 1234;
        LibraryType dummyType = LibraryType.NonFBS;

        persist(dummyAgency, dummyType);

        LibraryType libraryType = bean.fetchAndCacheLibraryType(dummyAgency);
        Assert.assertEquals(dummyType, libraryType);
        remove(dummyAgency);

        AgencyLibraryTypeEntity entity = findEntityWithKey(dummyAgency);
        Assert.assertNull(entity);
    }

    @Test
    public void canReadRealAgency() {

        LibraryType expectedType = LibraryType.FBSSchool;

        LibraryType libraryType = bean.fetchAndCacheLibraryType(realAgency);
        Assert.assertEquals(expectedType, libraryType);
    }

    @Test
    public void ensureReadCacheFirst() {
        canReadRealAgency(); //Plants realAgency in the database
        update(realAgency, LibraryType.FBS);
        Assert.assertEquals(LibraryType.FBS, bean.fetchAndCacheLibraryType(realAgency));
        remove(realAgency);
    }

    @Test
    public void nonExisting() {
        try {
            bean.fetchAndCacheLibraryType(42);
            Assert.fail("Should throw hard exception");
        } catch (LibraryRuleException e) {
            // all good
        }
    }

    private void remove(int agency) {
        AgencyLibraryTypeEntity entity = findEntityWithKey(agency);
        env().getPersistenceContext().run(() -> em.remove(entity));
    }

    private void update(int agency, LibraryType libraryType) {
        AgencyLibraryTypeEntity entity = findEntityWithKey(agency);
        entity.setLibraryType(libraryType.name());
        env().getPersistenceContext().run(() -> em.merge(entity));
    }

    private void persist(int key, LibraryType fbs) {
        env().getPersistenceContext().run(() -> {
            em.persist(new AgencyLibraryTypeEntity(key, fbs.name()));
        });
    }

    private AgencyLibraryTypeEntity findEntityWithKey(int key) {
        return env().getPersistenceContext().run(() -> em.find(AgencyLibraryTypeEntity.class, key));

    }

}
