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
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import javax.sql.DataSource;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
//@Ignore
public class WorkerIT {

    private static final Logger log = LoggerFactory.getLogger(WorkerIT.class);

    private static PostgresITDataSource pg;
    private static DataSource dataSource;

    private static String payaraPort;
    private static String solrDocStoreUrl;
    private static Payara payara;

    private static String solrPort;
    private static String solrUrl;
    private static Solr solr;

    private static Client client;

    private static Config config;
    private Worker worker;

    @ClassRule
    public static final TemporaryFolder tempSolr = new TemporaryFolder();

    @BeforeClass
    public static void setUpClass() throws Exception {

        ExecutorService executor = Executors.newFixedThreadPool(4);

        pg = new PostgresITDataSource("solrdocstore");
        dataSource = pg.getDataSource();

        List<Future> inits = Arrays.asList(
                executor.submit(() -> initPayara()),
                executor.submit(() -> initSolr()));

        client = ClientBuilder.newClient();

        config = new Config("queues=test",
                            "solrDocStoreUrl=NONE",
                            "solrUrl=NONE",
                            "rescanEvery=2",
                            "idleRescanEvery=1",
                            "maxTries=1",
                            "emptyQueueSleep=10") {
            // values are not ready at object construnction time
            @Override
            public String getSolrDocStoreUrl() {
                return solrDocStoreUrl;
            }

            @Override
            public String getSolrUrl() {
                System.out.println("solrUrl = " + solrUrl);
                return solrUrl;
            }
        };

        inits.stream().forEach((f) -> {
            try {
                f.get();
            } catch (InterruptedException | ExecutionException ex) {
                throw new RuntimeException(ex);
            }
        });
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
        DatabaseMigrator.migrate(dataSource);
    }

    private static void initPayara() throws RuntimeException {
        try {
            payaraPort = System.getProperty("glassfish.port", "18080");
            solrDocStoreUrl = "http://localhost:" + payaraPort + "/solr-doc-store";
            payara = Payara.getInstance(payaraPort)
                    .cmd("set-log-level dk.dbc=FINE")
                    .withDataSource("jdbc/solr-doc-store", pg.getUrl())
                    .withDataSourceNonTransactional("jdbc/solr-doc-store-nt", pg.getUrl())
                    .deploy("../service/target/solr-doc-store-service-1.0-SNAPSHOT.war", "/solr-doc-store");
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private static void initSolr() throws RuntimeException {
        try {
            solrPort = System.getProperty("solr.port", "18081");
            solr = new Solr(solrPort, DocProducerIT.class.getResource("/solr"), tempSolr);
            solrUrl = "http://localhost:" + solrPort + "/solr/corepo";
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
        solr.stop();
    }

    @Before
    public void setUp() throws Exception {
        try {
            pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic", "agencylibrarytype");
            try (Connection connection = dataSource.getConnection() ;
                 Statement stmt = connection.createStatement()) {
                stmt.executeUpdate("INSERT INTO agencylibrarytype (agencyid, librarytype) VALUES(300101, 'FBSSchool');");
                stmt.executeUpdate("INSERT INTO agencylibrarytype (agencyid, librarytype) VALUES(300102, 'FBSSchool');");
                stmt.executeUpdate("INSERT INTO agencylibrarytype (agencyid, librarytype) VALUES(300103, 'FBSSchool');");
            }
        } catch (SQLException ex) {
            log.trace("Exception: {}", ex.getMessage());
        }
        SolrClient solrClient = SolrApi.makeSolrClient(solrUrl);
        solrClient.deleteByQuery("*:*");
        solrClient.commit();

        worker = new Worker();
        worker.config = config;
        worker.dataSource = dataSource;
        worker.docProducer = new DocProducer();
        worker.docProducer.config = config;
        worker.docProducer.solrFields = new SolrFields();
        worker.docProducer.solrFields.config = config;
        worker.docProducer.solrFields.init();
        worker.docProducer.init();
        worker.init();
    }

    @Test(timeout = 5000L)
    public void testQueueWorkerConsumes() throws Exception {
        System.out.println("testQueueWorkerConsumes");
        SolrClient solrClient = SolrApi.makeSolrClient(solrUrl);

        try (Connection connection = dataSource.getConnection()) {

            Requests.load("test1-part1", solrDocStoreUrl);

            long count = solrClient.query(new SolrQuery("*:*")).getResults().getNumFound();
            assertEquals("After delete sorl document count: ", 0, count);

            PreparedQueueSupplier supplier = new QueueSupplier<>(QueueJob.STORAGE_ABSTRACTION)
                    .preparedSupplier(connection);

            supplier.enqueue("test", new QueueJob(300000, "23645564"));

            int maxRuns = 2500 / 50;
            while (solrClient.query(new SolrQuery("*:*")).getResults().getNumFound() == 0) {
                Thread.sleep(50L);
                solrClient.commit(true, true);
                if (maxRuns-- <= 0) {
                    break;
                }
            }
            worker.destroy();
            count = solrClient.query(new SolrQuery("*:*")).getResults().getNumFound();
            assertEquals("After dequeue -  sorl document count: ", 3, count);
        }
    }

}
