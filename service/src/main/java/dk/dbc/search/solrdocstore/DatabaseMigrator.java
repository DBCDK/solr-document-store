package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.HashSet;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import javax.sql.DataSource;

@Singleton
@Startup
public class DatabaseMigrator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrator.class);

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

    @Inject
    Config config;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @EJB
    OpenAgencyBean openAgency;

    @PostConstruct
    public void init() {
        log.info("Running database migration");
        HashSet<String> migrated = dk.dbc.search.solrdocstore.db.DatabaseMigrator.migrate(dataSource);
        log.debug("migrated = {}", migrated);

        boolean has_logged = false;
        if (migrated.contains("1")) {
            log.info("Migrated from scratch - no existing data manipulation needed");
            return; // Drops out here to not handle data migrations from "*Default" tables in a test setup
        }
        if (migrated.contains("14")) {
            log.info("----------------------OpenAgencyReload-------------------------");
            has_logged = true;
            reloadOpenAgency();
        }
        if (migrated.contains("18")) {
            log.info("----------------------OpenAgency partOfBibDk-------------------");
            has_logged = true;
            reloadOpenAgencyPartOfBibDk();
        }
        if (has_logged) {
            log.info("---------------------------------------------------------------");
        }
    }

    public DatabaseMigrator() {
    }

    /**
     * For Integration test only
     *
     * @param dataSource .
     */
    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public DatabaseMigrator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private void reloadOpenAgency() {
        log.info("Reloading openagency cache");
        List<Integer> knownAgencies = entityManager
                .createQuery("SELECT h.agencyId FROM HoldingsItemEntity h GROUP BY h.agencyId", Integer.class)
                .getResultList();
        for (Integer agencyId : knownAgencies) {
            log.info("Reloading agency: {}", agencyId);
            try {
                openAgency.lookupNoFail(agencyId);
            } catch (RuntimeException e) {
                log.error("Error loading agency: {}: {}", agencyId, e.getMessage());
                log.debug("Error loading agency: {}: ", agencyId, e);
            }
        }
    }

    private void reloadOpenAgencyPartOfBibDk() {
        log.info("Reloading openagency cache - adding real part_of_bibdk");
        List<Integer> knownAgencies = entityManager
                .createQuery("SELECT oa.agencyId FROM OpenAgencyEntity oa WHERE oa.libraryType <> :type", Integer.class)
                .setParameter("type", LibraryType.Missing)
                .getResultList();
        for (Integer agencyId : knownAgencies) {
            log.info("Reloading agency: {}", agencyId);
            try {
                openAgency.migratePartOfBibDk(agencyId);
            } catch (RuntimeException e) {
                log.error("Error loading agency: {}: {}", agencyId, e.getMessage());
                log.debug("Error loading agency: {}: ", agencyId, e);
            }
        }

    }
}
