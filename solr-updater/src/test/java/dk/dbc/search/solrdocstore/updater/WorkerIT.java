package dk.dbc.search.solrdocstore.updater;

import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.pgqueue.supplier.PreparedQueueSupplier;
import dk.dbc.pgqueue.supplier.QueueSupplier;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreLibraryRule;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.UriBuilderException;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.commons.testcontainers.postgres.AbstractJpaTestBase.PG;
import static dk.dbc.search.solrdocstore.updater.IntegrationTestBase.solrBase;
import static org.junit.Assert.*;

public class WorkerIT extends IntegrationTestBase {

    Config config;
    Worker worker;

    @Before
    public void setup() {
        config = makeConfig(getClient());
        config.getSolrCollections().forEach(this::wipe);
        executeSqlScript("solrdocstore-data.sql");
        evictAll();
        worker = makeWorker(config);
    }

    @After
    public void finish() throws InterruptedException {
        worker.es.shutdown();
        boolean terminated = worker.es.awaitTermination(1, TimeUnit.SECONDS);
        if (!terminated)
            throw new AssertionError("Cannot terminate executorservice");
    }

    @Test(timeout = 5000L)
    public void testQueueWorkerConsumes() throws Exception {
        System.out.println("testQueueWorkerConsumes");

        assertEquals("Number of collections: ", config.getSolrCollections().size(), 2);

        try (Connection connection = PG.createConnection()) {
            Requests.load(getClient(), "test1-part1", serviceBase());

            config.getSolrCollections().forEach(solrClient -> {
                long count = count(solrClient);
                assertEquals("After delete solr document count in: " + solrClient.getName(), 0, count);
            });

            PreparedQueueSupplier supplier = new QueueSupplier<>(QueueJob.STORAGE_ABSTRACTION)
                    .preparedSupplier(connection);

            supplier.enqueue("test", QueueJob.manifestation(870970, "basis", "23645564"));
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
        try (Connection connection = PG.createConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT jobid, diag FROM queue_error ORDER BY jobid")) {
            assertTrue("Atleast one in queue_error", resultSet.next());
            System.out.println("resultSet.getString(1) = " + resultSet.getString(1));
            System.out.println("resultSet.getString(2) = " + resultSet.getString(2));
            assertEquals("work:1", resultSet.getString(1));
            assertFalse("Only one in queue_error", resultSet.next());
        }
    }

    private static Config makeConfig(Client client) throws UriBuilderException, IllegalArgumentException {
        return new Config("queues=test",
                          "rescanEvery=2",
                          "idleRescanEvery=1",
                          "maxTries=1",
                          "emptyQueueSleep=10ms",
                          "scanProfiles=102030-magic,123456-basic",
                          "workPresentationUrl=not-relevant",
                          "scanDefaultFields=scan.abc,scan.def",
                          "solrAppId=app-id",
                          "workPresentationUrl=http://localhost:99999/n/a",
                          "vipCoreEndpoint=" + wireMockBase().path("vipcore").build().toString(),
                          "zookeeperUrl=" + zookeeperUrl(),
                          "zookeeperCollections=corepo-1",
                          "solrUrl=" + solrBase().path("corepo-2").build().toString(),
                          "solrDocStoreUrl=" + serviceBase().build().toString()) {
            @Override
            public Client getClient() {
                return client;
            }
        };
    }

    private static Worker makeWorker(Config config) {
        Worker worker = new Worker();
        worker.config = config;
        worker.dataSource = PG.datasource();
        worker.es = Executors.newCachedThreadPool();

        worker.docProducer = new DocProducer();
        worker.docProducer.config = config;
        worker.docProducer.libraryRuleProvider = new LibraryRuleProviderBean() {
            @Override
            public VipCoreLibraryRule libraryRulesFor(String agencyId) {
                switch (agencyId) {
                    case "870970":
                    case "300101":
                    case "300102":
                    case "300103":
                    case "300104":
                    case "777777":
                        return new VipCoreLibraryRuleMockResponse(true, true, false, true, false, true);
                    default:
                        throw new IllegalArgumentException("Don't know library rules for: " + agencyId);
                }
            }
        };
        ProfileProviderBean profileProviderBean = new ProfileProviderBean();
        profileProviderBean.config = config;
        profileProviderBean.vipCoreHttpClient = new VipCoreHttpClient();
        worker.docProducer.profileProvider = profileProviderBean;

        worker.docProducer.init();
        worker.init();
        return worker;
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

    void wipe(SolrCollection solrCollection) {
        try {
            SolrClient solrClient = solrCollection.getSolrClient();
            solrClient.deleteByQuery("*:*");
            solrClient.commit();
        } catch (SolrServerException | IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}
