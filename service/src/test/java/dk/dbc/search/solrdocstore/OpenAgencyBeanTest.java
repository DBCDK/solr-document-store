package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyProxyBean;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyBeanTest extends BeanTester {

    @Test
    public void openAgencyVerify() throws Exception {
        System.out.println("openAgencyVerify");

        Set<Integer> changedAgencies = new HashSet<>();
        Set<Integer> purgedAgencies = new HashSet<>();

        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false));

        bean(bf -> {
            bf.openAgencyBean(collectingOpenAgencyBean(changedAgencies, purgedAgencies));
            bf.openAgencyProxyBean(openAgencyProxyBeanWith(openAgencyEntityCommonAgency,
                                                           new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false)));
            bf.openAgencyBean()
                    .verifyOpenAgencyCache();
        });
        System.out.println("changedAgencies = " + changedAgencies);
        assertTrue(changedAgencies.isEmpty());
    }

    @Test
    public void openAgencyVerifyChangesOpenAgencyReverted() throws Exception {
        System.out.println("openAgencyVerifyChangesOpenAgencyReverted");

        Set<Integer> changedAgencies = new HashSet<>();
        Set<Integer> purgedAgencies = new HashSet<>();

        OpenAgencyEntity original = new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false);
        original.setValid(false);
        persist(original);

        jpa(em -> {
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(false, oae711100.getValid());
        });
        bean(bf -> {
            bf.openAgencyBean(collectingOpenAgencyBean(changedAgencies, purgedAgencies));
            bf.openAgencyProxyBean(openAgencyProxyBeanWith(
                    new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false)));
            bf.openAgencyBean()
                    .verifyOpenAgencyCache();
        });
        jpa(em -> {
            // Migrated
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false), oae711100);
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

        Set<Integer> changedAgencies = new HashSet<>();
        Set<Integer> purgedAgencies = new HashSet<>();

        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false));

        bean(bf -> {
            bf.openAgencyBean(collectingOpenAgencyBean(changedAgencies, purgedAgencies));
            bf.openAgencyProxyBean(openAgencyProxyBeanWith(openAgencyEntityCommonAgency,
                                                           new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true)));
            bf.openAgencyBean()
                    .verifyOpenAgencyCache();
        });

        // Migrated
        jpa(em -> {
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true), oae711100);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
    }

    @Test
    public void openAgencyVerifyChangesCantMigrate() throws Exception {
        System.out.println("openAgencyVerifyChangesCantMigrate");

        Set<Integer> changedAgencies = new HashSet<>();
        Set<Integer> purgedAgencies = new HashSet<>();

        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false),
                Doc.holdingsItem(711100, "n").addHolding(filler -> filler.itemId("x").status("OnShelf")));

        bean(bf -> {
            bf.openAgencyBean(collectingOpenAgencyBean(changedAgencies, purgedAgencies));
            bf.openAgencyProxyBean(openAgencyProxyBeanWith(openAgencyEntityCommonAgency,
                                                           new OpenAgencyEntity(711100, LibraryType.FBS, true, true, true)));
            bf.openAgencyBean()
                    .verifyOpenAgencyCache();
        });

        jpa(em -> {
            OpenAgencyEntity oae711100 = em.find(OpenAgencyEntity.class, 711100);
            assertEquals(new OpenAgencyEntity(711100, LibraryType.FBS, true, false, false), oae711100);
        });
        System.out.println("changedAgencies = " + changedAgencies);
        System.out.println("purgedAgencies = " + purgedAgencies);
        assertTrue(changedAgencies.contains(711100));
        assertEquals(1, changedAgencies.size());
    }

    private OpenAgencyBean collectingOpenAgencyBean(Set<Integer> changedAgencies, Set<Integer> purgedAgencies) {
        return new OpenAgencyBean() {

            @Override
            public void agencyHasChanged(OpenAgencyEntity oldEntry, OpenAgencyEntity newEntry) {
                super.agencyHasChanged(oldEntry, newEntry);
                changedAgencies.add(oldEntry.getAgencyId());
            }

            @Override
            public void purgeHoldingFor(int agencyId) {
                super.purgeHoldingFor(agencyId);
                purgedAgencies.add(agencyId);
            }
        };
    }

    private OpenAgencyProxyBean openAgencyProxyBeanWith(OpenAgencyEntity... entries) {
        return new OpenAgencyProxyBean() {
            @Override
            public OpenAgencyEntity loadOpenAgencyEntry(int agencyId) {
                System.out.println("agencyId = " + agencyId);
                for (OpenAgencyEntity entry : entries) {
                    if (entry.getAgencyId() == agencyId)
                        return entry;
                }
                throw new IllegalStateException("Unknown agency: " + agencyId);
            }
        };
    }
}
