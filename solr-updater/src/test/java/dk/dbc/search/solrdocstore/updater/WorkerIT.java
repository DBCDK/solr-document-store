/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import dk.dbc.commons.testutils.postgres.connection.PostgresITDataSource;
import dk.dbc.pgqueue.PreparedQueueSupplier;
import dk.dbc.pgqueue.QueueSupplier;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.search.solrdocstore.updater.profile.ProfileServiceBean;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import javax.sql.DataSource;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class WorkerIT {

    private static final Logger log = LoggerFactory.getLogger(WorkerIT.class);
    private static final Client CLIENT = ClientBuilder.newClient();

    private static String solrDocStoreUrl;

    private static PostgresITDataSource pg;
    private static DataSource dataSource;
    private static Config config;

    private Worker worker;

    @BeforeClass
    public static void setUpClass() throws Exception {

        solrDocStoreUrl = System.getenv("SOLR_DOC_STORE_URL");

        pg = new PostgresITDataSource("solrdocstore");
        dataSource = pg.getDataSource();
        DatabaseMigrator.migrate(dataSource);

        config = new Config("queues=test",
                            "rescanEvery=2",
                            "idleRescanEvery=1",
                            "maxTries=1",
                            "emptyQueueSleep=10ms",
                            "scanProfiles=102030-magic,123456-basic",
                            "scanDefaultFields=scan.abc,scan.def") {
            @Override
            public Client getClient() {
                return CLIENT;
            }

        };
    }

    @Before
    public void setUp() throws Exception {
        try {
            pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic", "openagencycache");
            try (Connection connection = dataSource.getConnection() ;
                 Statement stmt = connection.createStatement()) {
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300000, 'FBSSchool', False, False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300010, 'FBSSchool', False, False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300101, 'FBSSchool', False, False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300102, 'FBSSchool', False, False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofbibdk, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300103, 'FBSSchool', False, False, False, NOW(), True);");
            }
        } catch (SQLException ex) {
            log.trace("Exception: {}", ex.getMessage());
        }
        for (SolrCollection solrCollection : config.getSolrCollections()) {
            SolrClient solrClient = solrCollection.getSolrClient();
            solrClient.deleteByQuery("*:*");
            solrClient.commit();
        }

        worker = new Worker();
        worker.config = config;
        worker.dataSource = dataSource;
        worker.docProducer = new DocProducer();
        worker.docProducer.config = config;
        worker.es = Executors.newCachedThreadPool();
        worker.docProducer.businessLogic = new BusinessLogic();
        worker.docProducer.businessLogic.config = config;
        worker.docProducer.businessLogic.oa = new OpenAgency() {
            @Override
            public OpenAgencyLibraryRule libraryRule(String agencyId) {
                return new OpenAgencyLibraryRule(true, true, true, true, false, true);
            }
        };
        worker.docProducer.businessLogic.profileService = new ProfileServiceBean();
        worker.docProducer.businessLogic.profileService.config = config;
        worker.docProducer.init();
        worker.metrics = null;
        worker.docStasher = new DocStasher() {
            @Override
            public void store(String pid, SolrInputDocument doc) {
            }
        };
        worker.init();

        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE queue");
            stmt.executeUpdate("TRUNCATE queue_error");
        }
    }

    @After
    public void shutdown() throws Exception {
        worker.es.shutdown();
        boolean terminated = worker.es.awaitTermination(1, TimeUnit.SECONDS);
        if (!terminated)
            throw new AssertionError("Cannot terminate executorservice");
    }

    @Test(timeout = 5000L)
    public void testQueueWorkerConsumes() throws Exception {
        System.out.println("testQueueWorkerConsumes");

        assertEquals("Number of collections: ", config.getSolrCollections().size(), 2);

        try (Connection connection = dataSource.getConnection()) {
            Requests.load("test1-part1", solrDocStoreUrl);

            config.getSolrCollections().forEach(solrClient -> {
                long count = count(solrClient);
                assertEquals("After delete solr document count in: " + solrClient.getName(), 0, count);
            });

            PreparedQueueSupplier supplier = new QueueSupplier<>(QueueJob.STORAGE_ABSTRACTION)
                    .preparedSupplier(connection);

            supplier.enqueue("test", QueueJob.manifestation(300000, "clazzifier", "23645564"));
            supplier.enqueue("test", QueueJob.work("work:1")); // This is expected to be in the queue_error table

            int maxRuns = 2500 / 50;
            while (config.getSolrCollections().stream()
                    .map(this::count)
                    .anyMatch(l -> l == 0L)) {
                Thread.sleep(50L);
                config.getSolrCollections().forEach(this::commit);
                if (maxRuns-- <= 0) {
                    break;
                }
            }
            worker.destroy();
            config.getSolrCollections().forEach(solrCollection -> {
                long count = count(solrCollection);
                assertEquals("After dequeue - solr document count in: " + solrCollection.getName(), 5, count);
            });
        }
        try (Connection connection = dataSource.getConnection();
            Statement stmt = connection.createStatement();
            ResultSet resultSet = stmt.executeQuery("SELECT jobid, diag FROM queue_error ORDER BY jobid")) {
            assertTrue("Atleast one in queue_error", resultSet.next());
            System.out.println("resultSet.getString(1) = " + resultSet.getString(1));
            System.out.println("resultSet.getString(2) = " + resultSet.getString(2));
            assertEquals("work:1", resultSet.getString(1));
            assertFalse("Only one in queue_error", resultSet.next());
        }
    }

    long count(SolrCollection solrCollection) {
        try {
            return solrCollection.getSolrClient().query(new SolrQuery("*:*")).getResults().getNumFound();
        } catch (SolrServerException | IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    void commit(SolrCollection solrCollection) {
        try {
            solrCollection.getSolrClient().commit(true, true);
        } catch (SolrServerException | IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}
