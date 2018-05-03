package dk.dbc.search.solrdocstore;

import java.util.HashSet;
import java.util.List;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.sql.DataSource;

@Singleton
@Startup
public class DatabaseMigrator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrator.class);

    @Resource(lookup = "jdbc/solr-doc-store-nt")
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
        HashSet<String> migrated = migrate();
        log.debug("migrated = {}", migrated);

        boolean has_logged = false;
        if (migrated.contains("13")) {
            log.info("----------------------OpenAgencyReload-------------------------");
            has_logged = true;
            reloadOpenAgency();
        }
        if (has_logged) {
            log.info("---------------------------------------------------------------");
        }
    }

    public HashSet<String> migrate() {
        HashSet<String> migrates = new HashSet<>();
        final Flyway flyway = new Flyway();
        flyway.setTable("schema_version");
        if (config.getAllowNonEmptySchema()) {
            flyway.setBaselineOnMigrate(true);
            flyway.setBaselineVersionAsString("0"); // This is needed for afterMigrate
        }
        flyway.setDataSource(dataSource);
        for (MigrationInfo i : flyway.info().applied()) {
            log.info("db task {} : {} from file '{}' (applied)", i.getVersion(), i.getDescription(), i.getScript());
        }
        for (MigrationInfo i : flyway.info().pending()) {
            migrates.add(i.getVersion().getVersion());
            log.info("db task {} : {} from file '{}' (pending)", i.getVersion(), i.getDescription(), i.getScript());
        }
        flyway.migrate();
        dk.dbc.search.solrdocstore.queue.DatabaseMigrator.migrate(dataSource);
        return migrates;
    }

    public DatabaseMigrator() {
    }

    /**
     * For Integration test only
     *
     * @param dataSource .
     */
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
                openAgency.lookup(agencyId, false);
            } catch (RuntimeException e) {
                log.error("Error loading agency: {}: {}", agencyId, e.getMessage());
                log.debug("Error loading agency: {}: ", agencyId, e);
            }
        }
    }

}
