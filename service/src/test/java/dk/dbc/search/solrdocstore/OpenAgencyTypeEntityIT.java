package dk.dbc.search.solrdocstore;

import org.junit.Assert;
import org.junit.Test;

import javax.persistence.EntityManager;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class OpenAgencyTypeEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void insertFindAndDelete() {
        int key = 1234;
        LibraryConfig.LibraryType fbs = LibraryConfig.LibraryType.FBS;

        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {
            OpenAgencyTypeEntity e = new OpenAgencyTypeEntity();
            e.agencyId = key;
            e.libraryType = fbs.name();
            em.persist(e);
        });


        OpenAgencyTypeEntity searchResult = findEntityWithKey(em, key);

        assertEquals(key, searchResult.agencyId);
        assertEquals(fbs, LibraryConfig.LibraryType.valueOf(searchResult.libraryType));

        env().getPersistenceContext().run( () -> em.remove(searchResult));

        OpenAgencyTypeEntity res = findEntityWithKey(em, key);

        assertNull(res);

    }

    private OpenAgencyTypeEntity findEntityWithKey(EntityManager em, int key){
        return env().getPersistenceContext().run(() -> em.find(OpenAgencyTypeEntity.class, key));

    }
}
