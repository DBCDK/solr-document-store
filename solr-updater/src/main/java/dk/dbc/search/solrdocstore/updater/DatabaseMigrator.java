package dk.dbc.search.solrdocstore.updater;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
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
