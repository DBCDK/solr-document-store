/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.Executors;
import javax.sql.DataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueRulesDaemonIT extends JpaSolrDocStoreIntegrationTester {

    private QueueRulesDaemon daemon;
    private DataSource datasource;

    @Before
    public void setUp() throws SQLException {
        datasource = jpaTestEnvironment.getDatasource();
        try (Connection connection = datasource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE queueRule");
        }

        daemon = new QueueRulesDaemon();
        daemon.dataSource = null; // set from environment in init()
        daemon.mes = Executors.newCachedThreadPool();
        daemon.init();
    }

    @After
    public void tearDown() {
        daemon.destroy();
    }

    @Test
    public void syncWithDatabase() throws Exception {
        System.out.println("syncWithDatabase");

        // This is only testing of LISTEN/NOTIFY
        // Logic testing is in QueueRulesBeanIT, since
        // the interface for creating/deleting queuerules
        // is much simpler there.
        assertThat("Start with empty queuerule", daemon.getManifestationQueues().isEmpty(), is(true));
        try (Connection connection = datasource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("INSERT INTO queueRule(queue) VALUES('myQueue')");
        }
        assertThat("Just after insert queuerule is still empty", daemon.getManifestationQueues().isEmpty(), is(true));

        for (int i = 0 ; i < 1000 ; i++) {
            if (!daemon.getManifestationQueues().isEmpty()) {
                break;
            }
            Thread.sleep(1);
        }
        System.out.println("queues = " + daemon.getManifestationQueues());
        assertThat("After notify queuerule is no longer empty", daemon.getManifestationQueues().size(), is(1));
        assertThat(daemon.getManifestationQueues().iterator().next(), is("myQueue"));
    }
}
