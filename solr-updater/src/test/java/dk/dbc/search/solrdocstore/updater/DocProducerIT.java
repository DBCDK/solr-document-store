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
import java.io.IOException;
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
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
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
public class DocProducerIT {

    private static final Logger log = LoggerFactory.getLogger(DocProducerIT.class);

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
    private DocProducer docProducer;

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
                            "solrUrl=NONE") {
            // values are not ready at object construnction time
            @Override
            public String getSolrDocStoreUrl() {
                System.out.println("solrDocStoreUrl = " + solrDocStoreUrl);
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
    }

    private static void initPayara() throws RuntimeException {
        try {
            payaraPort = System.getProperty("glassfish.port", "18080");
            solrDocStoreUrl = "http://localhost:" + payaraPort + "/solr-doc-store";
            payara = Payara.getInstance(payaraPort)
                    .cmd("set-log-level dk.dbc=FINE")
                    .withDataSource("jdbc/solr-doc-store", pg.getUrl())
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
            pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic");
        } catch (SQLException ex) {
            log.trace("Exception: {}", ex.getMessage());
        }
        SolrClient solrClient = SolrApi.makeSolrClient(solrUrl);
        solrClient.deleteByQuery("*:*");
        solrClient.commit();

        docProducer = new DocProducer();
        docProducer.config = config;
        docProducer.solrFields = new SolrFields();
        docProducer.solrFields.config = config;
        docProducer.solrFields.init();
        docProducer.init();

    }

    @Test
    public void loadAndDelete() throws Exception {
        System.out.println("loadAndDelete");
        SolrClient solrClient = SolrApi.makeSolrClient(solrUrl);

        Requests.load("test1-part1", solrDocStoreUrl);
        // FAKE relations
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM holdingstobibliographic");
            stmt.executeUpdate("INSERT INTO holdingstobibliographic (holdingsagencyid, bibliographicrecordid, bibliographicagencyid) SELECT agencyid, bibliographicrecordid, 300101 FROM holdingsitemssolrkeys;");
        }

        deployAndSearch(docProducer, solrClient, 3);

        // Merge is no implemented yet, so clear table to load new (deleted) record
        pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic");
        Requests.load("test1-part2", solrDocStoreUrl);

        deployAndSearch(docProducer, solrClient, 0);
    }

    @Test
    public void loadAndFewerHolding() throws Exception {
        System.out.println("loadAndFewerHolding");
        SolrClient solrClient = SolrApi.makeSolrClient(solrUrl);

        Requests.load("test1-part1", solrDocStoreUrl);
        // FAKE relations
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM holdingstobibliographic");
            stmt.executeUpdate("INSERT INTO holdingstobibliographic (holdingsagencyid, bibliographicrecordid, bibliographicagencyid) SELECT agencyid, bibliographicrecordid, 300101 FROM holdingsitemssolrkeys");
        }

        deployAndSearch(docProducer, solrClient, 3);

        pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic");
        Requests.load("test1-part3", solrDocStoreUrl);
        // FAKE relations
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DELETE FROM holdingstobibliographic");
            stmt.executeUpdate("INSERT INTO holdingstobibliographic (holdingsagencyid, bibliographicrecordid, bibliographicagencyid) SELECT agencyid, bibliographicrecordid, 300101 FROM holdingsitemssolrkeys");
        }

        deployAndSearch(docProducer, solrClient, 2);
    }

    private void deployAndSearch(DocProducer docProducer, SolrClient solrClient, int expected) throws SolrServerException, IOException {
        docProducer.deploy(300101, "23645564", solrClient, 0);
        solrClient.commit(true, true);
        QueryResponse response1 = solrClient.query(new SolrQuery("*:*"));
        System.out.println("response = " + response1);
        assertEquals(expected, response1.getResults().getNumFound());
    }

}
