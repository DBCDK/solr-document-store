package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final ObjectMapper O = new ObjectMapper();
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
    public void openAgencyVerifyChangesCanMigrateNoHoldings() throws Exception {
        System.out.println("openAgencyVerifyChangesCanMigrateNoHoldings");

        env().getPersistenceContext().run(() -> {
            em.persist(makeOpenAgencyEntity(COMMON_AGENCY));
            em.persist(makeOpenAgencyEntity(711100, true, false));
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
            em.persist(makeOpenAgencyEntity(711100, true, false));
            em.persist(new HoldingsItemEntity(711100, "1", "", indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]}]"), ""));
            em.persist(new HoldingsToBibliographicEntity(711100, "1", COMMON_AGENCY, "1", true));
            em.flush();
            openAgency.verifyOpenAgencyCache();

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
            em.persist(makeOpenAgencyEntity(711100, true, false));
            em.persist(new HoldingsItemEntity(711100, "1", "", indexKeys("[{\"holdingsitem.status\":[\"Foo\", \"Decommissioned\"]}]"), ""));
            em.flush();
            openAgency.verifyOpenAgencyCache();

            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(makeOpenAgencyEntity(711100, true, false), oae711100);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
    }

    private static List<Map<String, List<String>>> indexKeys(String json) throws Exception {
        return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>() {
                   });
    }

}
