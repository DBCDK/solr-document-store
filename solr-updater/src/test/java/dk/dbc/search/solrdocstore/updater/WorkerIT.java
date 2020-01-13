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
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
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

    private static String solrUrl;
    private static String solrDocStoreUrl;

    private static PostgresITDataSource pg;
    private static DataSource dataSource;
    private static Config config;

    private Worker worker;

    @BeforeClass
    public static void setUpClass() throws Exception {

        solrUrl = System.getenv("SOLR_URL");
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
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300000, 'FBSSchool', False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300101, 'FBSSchool', False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300102, 'FBSSchool', False, False, NOW(), True);");
                stmt.executeUpdate("INSERT INTO openagencycache (agencyid, librarytype, partofdanbib, authcreatecommonrecord, fetched, valid) VALUES(300103, 'FBSSchool', False, False, NOW(), True);");
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
        SolrFields solrFields = new SolrFields();
        worker.docProducer.solrFields = solrFields;
        worker.docProducer.solrFields.config = config;
        worker.docProducer.solrFields.init();
        worker.docProducer.businessLogic = new BusinessLogic();
        worker.docProducer.businessLogic.config = config;
        worker.docProducer.businessLogic.oa = new OpenAgency() {
            @Override
            public OpenAgency.LibraryRule libraryRule(String agencyId) {
                return new LibraryRule(true, true, true, true, false, true);
            }
        };
        worker.docProducer.businessLogic.profileService = new ProfileServiceBean();
        worker.docProducer.businessLogic.profileService.config = config;
        worker.docProducer.businessLogic.solrFields = solrFields;
        worker.docProducer.init();
        worker.metrics = null;
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

            supplier.enqueue("test", new QueueJob(300000, "clazzifier", "23645564"));

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
