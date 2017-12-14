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

import dk.dbc.commons.testutils.postgres.connection.PostgresITDataSource;
import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DatabaseMigratorIT {

    private static PostgresITDataSource pg;
    private static DataSource dataSource;

    @Before
    public void setUp() throws Exception {
        pg = new PostgresITDataSource("queue");
        dataSource = pg.getDataSource();
    }

    @After
    public void shutDown() throws Exception {
        try(Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DROP TABLE queue");
            stmt.executeUpdate("DROP TABLE queue_error");
            stmt.executeUpdate("DROP TABLE solr_doc_store_queue_version");
            stmt.executeUpdate("DROP TABLE queue_version");
        }
    }


    @Test
    public void testMigrate() throws Exception {
        System.out.println("migrate");
        DatabaseMigrator.migrate(dataSource);
    }

}
