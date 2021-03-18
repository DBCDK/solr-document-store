package dk.dbc.search.solrdocstore.db;

import java.util.HashSet;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import org.flywaydb.core.api.configuration.FluentConfiguration;

public class DatabaseMigrator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrator.class);

    public static HashSet<String> migrate(DataSource dataSource) {
        HashSet<String> migrates = new HashSet<>();
        FluentConfiguration flywayConfigure = Flyway.configure()
                .table("schema_version")
                .dataSource(dataSource);

        final Flyway flyway = flywayConfigure.load();
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

}
