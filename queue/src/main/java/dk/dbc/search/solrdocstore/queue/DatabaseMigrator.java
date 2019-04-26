/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-queue
 *
 * dbc-solr-doc-store-queue is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-queue is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.queue;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DatabaseMigrator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrator.class);

    public static void migrate(DataSource dataSource) {
        Flyway flyway =
                Flyway.configure()
                        .table("solr_doc_store_queue_version")
                        .baselineOnMigrate(true)
                        .dataSource(dataSource)
                        .locations("solr-doc-store-queue/migration")
                        .load();
        for (MigrationInfo i : flyway.info().all()) {
            log.info("db task {} : {} from file '{}'", i.getVersion(), i.getDescription(), i.getScript());
        }
        flyway.migrate();
        dk.dbc.pgqueue.DatabaseMigrator.migrate(dataSource);
    }

}
