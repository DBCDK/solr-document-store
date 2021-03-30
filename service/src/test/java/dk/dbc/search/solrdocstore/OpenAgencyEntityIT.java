package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import javax.persistence.EntityManager;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void openAgencyEntityPersist() throws Exception {
        System.out.println("openAgencyEntityPersist");
        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {

            OpenAgencyEntity foundBefore = em.find(OpenAgencyEntity.class, LibraryType.COMMON_AGENCY);
            assertNull(foundBefore);

            OpenAgencyEntity oa870970 = makeOpenAgencyEntity(COMMON_AGENCY);
            em.persist(oa870970);
            em.getEntityManagerFactory().getCache().evictAll();

            OpenAgencyEntity foundAfter = em.find(OpenAgencyEntity.class, LibraryType.COMMON_AGENCY);
            assertNotNull(foundAfter);
            assertEquals(LibraryType.COMMON_AGENCY, foundAfter.getAgencyId());
            assertEquals(LibraryType.NonFBS, foundAfter.getLibraryType());
            assertTrue(foundAfter.getPartOfDanbib());
            assertTrue(foundAfter.getAuthCreateCommonRecord());
        });
    }
}
