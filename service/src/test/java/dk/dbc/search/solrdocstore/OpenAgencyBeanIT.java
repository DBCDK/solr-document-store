package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashSet;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;
import static dk.dbc.search.solrdocstore.HoldingsSolrKeys.*;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyBeanIT extends JpaSolrDocStoreIntegrationTester {

    private final HashSet<Integer> changedAgencies;
    private final HashSet<Integer> purgedAgencies;
    private EntityManager em;
    private OpenAgencyBean openAgency;

    public OpenAgencyBeanIT() {
        this.changedAgencies = new HashSet<>();
        this.purgedAgencies = new HashSet<>();
    }

    @Before
    public void setupLoader() {
        this.em = env().getEntityManager();
        this.openAgency = new OpenAgencyBean() {

            @Override
            void agencyHasChanged(OpenAgencyEntity oldEntry, OpenAgencyEntity newEntry) {
                super.agencyHasChanged(oldEntry, newEntry);
                changedAgencies.add(oldEntry.getAgencyId());
            }

            @Override
            void purgeHoldingFor(int agencyId) {
                super.purgeHoldingFor(agencyId);
                purgedAgencies.add(agencyId);
            }
        };
        this.openAgency.entityManager = em;
        this.openAgency.proxy = createOpenAgencyProxyBean();
    }

    @Test
    public void openAgencyVerify() throws Exception {
        System.out.println("openAgencyVerify");

        env().getPersistenceContext().run(() -> {
            em.persist(makeOpenAgencyEntity(COMMON_AGENCY));
            em.persist(makeOpenAgencyEntity(711100));
            openAgency.verifyOpenAgencyCache();
        });
        System.out.println("changedAgencies = " + changedAgencies);
        assertTrue(changedAgencies.isEmpty());
    }

    @Test
    public void openAgencyVerifyChangesOpenAgencyReverted() throws Exception {
        System.out.println("openAgencyVerifyChangesOpenAgencyReverted");

        env().getPersistenceContext().run(() -> {
            OpenAgencyEntity original = new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true);
            original.setValid(false); // Has Holdings but openagency has changed
            em.persist(original);
            em.flush();
        });
        env().getPersistenceContext().run(() -> {
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(false, oae711100.getValid()); //
            openAgency.verifyOpenAgencyCache();
        });
        env().getPersistenceContext().run(() -> {
            // Migrated
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true), oae711100);
            assertEquals(true, oae711100.getValid()); //
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.isEmpty());
        assertTrue(purgedAgencies.isEmpty());
    }

    @Test
    public void openAgencyVerifyChangesCanMigrateNoHoldings() throws Exception {
        System.out.println("openAgencyVerifyChangesCanMigrateNoHoldings");

        env().getPersistenceContext().run(() -> {
            em.persist(makeOpenAgencyEntity(COMMON_AGENCY));
            em.persist(makeOpenAgencyEntity(711100, true, false, false));
            em.flush();
            openAgency.verifyOpenAgencyCache();

            // Migrated
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(makeOpenAgencyEntity(711100), oae711100);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
    }

    @Test
    public void openAgencyVerifyChangesCanMigrateDecommissioned() throws Exception {
        System.out.println("openAgencyVerifyChangesCanMigrateDecommissioned");

        env().getPersistenceContext().run(() -> {
            em.persist(makeOpenAgencyEntity(COMMON_AGENCY));
            em.persist(makeOpenAgencyEntity(711100, true, true, false));
            em.persist(new HoldingsItemEntity(711100, "1", "", DECOMMISSIONED, ""));
            em.persist(new HoldingsToBibliographicEntity(711100, "1", COMMON_AGENCY, "1", true));
            em.flush();
            openAgency.verifyOpenAgencyCache(); // loads 711100.json

            // Migrated
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(makeOpenAgencyEntity(711100), oae711100);
            HoldingsItemEntity holding = em.find(HoldingsItemEntity.class, new AgencyItemKey(711100, "1"));
            assertNull(holding);
            HoldingsToBibliographicEntity relation = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(711100, "1"));
            assertNull(relation);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
        assertTrue(purgedAgencies.contains(711100));
        assertEquals(1, purgedAgencies.size());
    }

    @Test
    public void openAgencyVerifyChangesCantMigrate() throws Exception {
        System.out.println("openAgencyVerifyChangesCantMigrate");

        env().getPersistenceContext().run(() -> {
            em.persist(makeOpenAgencyEntity(COMMON_AGENCY));
            em.persist(makeOpenAgencyEntity(711100, true, true, false));
            em.persist(new HoldingsItemEntity(711100, "1", "", ON_SHELF_AND_DECOMMISSIONED, ""));
            em.flush();
            openAgency.verifyOpenAgencyCache();

            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(makeOpenAgencyEntity(711100, true, true, false), oae711100);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
    }

}
