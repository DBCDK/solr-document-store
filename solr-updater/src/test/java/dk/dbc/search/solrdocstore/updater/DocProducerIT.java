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

import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.solrdocstore.updater.businesslogic.SolrDocStoreResponse;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreLibraryRule;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.client.Client;
import java.io.IOException;
import java.util.Collection;
import javax.ws.rs.core.UriBuilderException;

import static dk.dbc.search.solrdocstore.updater.IntegrationTestBase.serviceBase;
import static org.junit.Assert.assertEquals;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DocProducerIT extends IntegrationTestBase {

    private static final Logger log = LoggerFactory.getLogger(DocProducerIT.class);

    private Config config;

    private DocProducer docProducer;

    @Before
    public void setUp() throws Exception {
        config = makeConfig(getClient());
        config.getSolrCollections().forEach(this::wipe);
        executeSqlScript("solrdocstore-data.sql");
        evictAll();

        docProducer = makeDocProducer(config);
    }

    @Test
    public void loadAndDelete() throws Exception {
        System.out.println("loadAndDelete");

        Requests.load(getClient(), "test1-part1", serviceBase());

        deployAndSearch(300000, docProducer, config.getSolrCollections(), 5);

        Requests.load(getClient(), "test1-part2", serviceBase());

        deployAndSearch(300000, docProducer, config.getSolrCollections(), 0);
    }

    @Test
    public void loadAndFewerHolding() throws Exception {
        System.out.println("loadAndFewerHolding");

        Requests.load(getClient(), "test1-part1", serviceBase());

        deployAndSearch(300000, docProducer, config.getSolrCollections(), 5);

        Requests.load(getClient(), "test1-part3", serviceBase());

        deployAndSearch(300000, docProducer, config.getSolrCollections(), 3);
    }

    @Test
    public void creatAndDeleteWithoutHoldings() throws Exception {
        System.out.println("creatAndDeleteWithoutHoldings");

        Requests.load(getClient(), "test2-part1", serviceBase());

        deployAndSearch(300010, docProducer, config.getSolrCollections(), 1);

        Requests.load(getClient(), "test2-part2", serviceBase());

        deployAndSearch(300010, docProducer, config.getSolrCollections(), 0);
    }

    private void deployAndSearch(int agencyId, DocProducer docProducer, Collection<SolrCollection> solrCollections, int expected) throws SolrServerException, IOException, PostponedNonFatalQueueError {
        for (SolrCollection solrCollection : solrCollections) {
            SolrDocStoreResponse sourceDoc = docProducer.fetchSourceDoc(QueueJob.manifestation(agencyId, "clazzifier", "23645564"));
            SolrInputDocument doc = docProducer.createSolrDocument(sourceDoc, solrCollection);
            String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);
            docProducer.deleteSolrDocuments(bibliographicShardId, solrCollection);
            docProducer.deploy(doc, solrCollection);
            SolrClient solrClient = solrCollection.getSolrClient();
            solrClient.commit(true, true);
            QueryResponse response = solrClient.query(new SolrQuery("*:*"));
            System.out.println("response = " + response);
            System.out.println("response = " + response.getResults());
            assertEquals(expected, response.getResults().getNumFound());
        }
    }

    private static Config makeConfig(Client client) throws UriBuilderException, IllegalArgumentException {
        return new Config("queues=test",
                          "rescanEvery=2",
                          "idleRescanEvery=1",
                          "maxTries=1",
                          "emptyQueueSleep=10ms",
                          "scanDefaultFields=abc,def",
                          "scanProfiles=102030-magic,123456-basic",
                          "workPresentationUrl=not-relevant",
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

    private static DocProducer makeDocProducer(Config config) {
        DocProducer docProducer = new DocProducer();
        docProducer.config = config;
        docProducer.libraryRuleProvider = new LibraryRuleProviderBean() {
            @Override
            public VipCoreLibraryRule libraryRulesFor(String agencyId) {
                switch (agencyId) {
                    case "300000":
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
        docProducer.persistentWorkIdProvider = new PersistentWorkIdProviderBean() {
            @Override
            public String persistentWorkIdFor(String corepoWorkId) {
                return "xxx";
            }
        };
        ProfileProviderBean profileProviderBean = new ProfileProviderBean();
        profileProviderBean.config = config;
        profileProviderBean.vipCoreHttpClient = new VipCoreHttpClient();
        docProducer.profileProvider = profileProviderBean;

        docProducer.init();
        return docProducer;
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
