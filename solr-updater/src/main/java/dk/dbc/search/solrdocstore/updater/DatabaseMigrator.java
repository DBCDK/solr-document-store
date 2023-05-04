package dk.dbc.search.solrdocstore.updater;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import javax.sql.DataSource;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class DatabaseMigrator {

    @Inject
    Config config;

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @PostConstruct
    public void migrate() {
        migrate(dataSource);
    }

    static void migrate(DataSource dataSource) {
        dk.dbc.search.solrdocstore.queue.DatabaseMigrator.migrate(dataSource);
    }
}
