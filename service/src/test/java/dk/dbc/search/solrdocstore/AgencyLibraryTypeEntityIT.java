package dk.dbc.search.solrdocstore;

import org.junit.Test;

import javax.persistence.EntityManager;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class AgencyLibraryTypeEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void insertFindAndDelete() {
        int key = 1234;
        LibraryConfig.LibraryType fbs = LibraryConfig.LibraryType.FBS;

        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {
            AgencyLibraryTypeEntity e = new AgencyLibraryTypeEntity();
            e.agencyId = key;
            e.libraryType = fbs.name();
            em.persist(e);
        });


        AgencyLibraryTypeEntity searchResult = findEntityWithKey(em, key);

        assertEquals(key, searchResult.agencyId);
        assertEquals(fbs, LibraryConfig.LibraryType.valueOf(searchResult.libraryType));

        env().getPersistenceContext().run( () -> em.remove(searchResult));

        AgencyLibraryTypeEntity res = findEntityWithKey(em, key);

        assertNull(res);

    }

    private AgencyLibraryTypeEntity findEntityWithKey(EntityManager em, int key){
        return env().getPersistenceContext().run(() -> em.find(AgencyLibraryTypeEntity.class, key));

    }
}
