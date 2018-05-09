package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final ObjectMapper O = new ObjectMapper();
    private final ClassLoader classLoader;
    private final HashSet<Integer> changedAgencies;
    private final HashSet<Integer> purgedAgencies;
    private EntityManager em;
    private OpenAgencyBean openAgencyLoader;

    public OpenAgencyBeanIT() {
        this.classLoader = getClass().getClassLoader();
        this.changedAgencies = new HashSet<>();
        this.purgedAgencies = new HashSet<>();
    }

    @Before
    public void setupLoader() {
        this.em = env().getEntityManager();
        this.openAgencyLoader = new OpenAgencyBean() {

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
        this.openAgencyLoader.proxy = new OpenAgencyProxyBean() {
            @Override
            public JsonNode loadOpenAgencyJson(int agencyId) {
                String resource = "openagency-" + agencyId + ".json";
                try {
                    return O.readTree(classLoader.getResourceAsStream(resource));
                } catch (IOException ex) {
                    throw new IllegalStateException("Cannot find json resource: " + resource);
                }
            }
        };
        this.openAgencyLoader.entityManager = em;
    }

    @Test
    public void openAgencyVerify() throws Exception {
        System.out.println("openAgencyVerify");

        env().getPersistenceContext().run(() -> {
            em.persist(new OpenAgencyEntity(870970, LibraryType.NonFBS, true, true));
            em.persist(new OpenAgencyEntity(711111, LibraryType.FBS, true, true));
            openAgencyLoader.verifyOpenAgencyCache();
        });
        System.out.println("changedAgencies = " + changedAgencies);
        assertTrue(changedAgencies.isEmpty());
    }

    @Test
    public void openAgencyVerifyChangesCanMigrateNoHoldings() throws Exception {
        System.out.println("openAgencyVerifyChangesCanMigrateNoHoldings");

        env().getPersistenceContext().run(() -> {
            em.persist(new OpenAgencyEntity(870970, LibraryType.NonFBS, true, true));
            em.persist(new OpenAgencyEntity(711111, LibraryType.FBS, true, false));
            em.flush();
            openAgencyLoader.verifyOpenAgencyCache();

            // Migrated
            OpenAgencyEntity oae711111 = em.find(OpenAgencyEntity.class, 711111);
            assertEquals(new OpenAgencyEntity(711111, LibraryType.FBS, true, true), oae711111);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711111));
        assertEquals(1, changedAgencies.size());
    }

    @Test
    public void openAgencyVerifyChangesCanMigrateDecommissioned() throws Exception {
        System.out.println("openAgencyVerifyChangesCanMigrateDecommissioned");

        env().getPersistenceContext().run(() -> {
            em.persist(new OpenAgencyEntity(870970, LibraryType.NonFBS, true, true));
            em.persist(new OpenAgencyEntity(711111, LibraryType.FBS, true, false));
            em.persist(new HoldingsItemEntity(711111, "1", "", indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]}]"), ""));
            em.persist(new HoldingsToBibliographicEntity(711111, "1", 870970, "1", true));
            em.flush();
            openAgencyLoader.verifyOpenAgencyCache();

            // Migrated
            OpenAgencyEntity oae711111 = em.find(OpenAgencyEntity.class, 711111);
            assertEquals(new OpenAgencyEntity(711111, LibraryType.FBS, true, true), oae711111);
            HoldingsItemEntity holding = em.find(HoldingsItemEntity.class, new AgencyItemKey(711111, "1"));
            assertNull(holding);
            HoldingsToBibliographicEntity relation = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(711111, "1"));
            assertNull(relation);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711111));
        assertEquals(1, changedAgencies.size());
        assertTrue(purgedAgencies.contains(711111));
        assertEquals(1, purgedAgencies.size());
    }

    @Test
    public void openAgencyVerifyChangesCantMigrate() throws Exception {
        System.out.println("openAgencyVerifyChangesCantMigrate");

        env().getPersistenceContext().run(() -> {
            em.persist(new OpenAgencyEntity(870970, LibraryType.NonFBS, true, true));
            em.persist(new OpenAgencyEntity(711111, LibraryType.FBS, true, false));
            em.persist(new HoldingsItemEntity(711111, "1", "", indexKeys("[{\"holdingsitem.status\":[\"Foo\", \"Decommissioned\"]}]"), ""));
            em.flush();
            openAgencyLoader.verifyOpenAgencyCache();

            OpenAgencyEntity oae711111 = em.find(OpenAgencyEntity.class, 711111);
            assertEquals(new OpenAgencyEntity(711111, LibraryType.FBS, true, false), oae711111);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711111));
        assertEquals(1, changedAgencies.size());
    }

    private static List<Map<String, List<String>>> indexKeys(String json) throws Exception {
        return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>() {
                   });
    }

}
