package dk.dbc.search.solrdocstore;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.sql.DataSource;

@Singleton
@Startup
public class DatabaseMigrator {
    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseMigrator.class);

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

   	@PostConstruct
   	public void migrate() {
   		final Flyway flyway = new Flyway();
        flyway.setTable("schema_version");
        flyway.setBaselineOnMigrate(true);
   		flyway.setDataSource(dataSource);
   		for (MigrationInfo i : flyway.info().all()) {
   			LOGGER.info("db task {} : {} from file '{}'", i.getVersion(), i.getDescription(), i.getScript());
   		}
   		flyway.migrate();
   	}


	/**
	 * For Integration test only
	 * @param dataSource .
	 */
	public DatabaseMigrator(DataSource dataSource) {
		this.dataSource = dataSource;
	}
}

