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

import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.commons.testutils.postgres.connection.PostgresITDataSource;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.search.solrdocstore.updater.profile.ProfileServiceBean;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.MediaType;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrInputDocument;
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
public class DocProducerIT {

    private static final Logger log = LoggerFactory.getLogger(DocProducerIT.class);
    private static final Client CLIENT = ClientBuilder.newClient();

    private static String solrDocStoreUrl;

    private static PostgresITDataSource pg;
    private static DataSource dataSource;
    private static Config config;

    private DocProducer docProducer;

    @BeforeClass
    public static void setUpClass() throws Exception {
        solrDocStoreUrl = System.getenv("SOLR_DOC_STORE_URL");

        pg = new PostgresITDataSource("solrdocstore");
        dataSource = pg.getDataSource();
        config = new Config("queues=test",
                            "scanProfiles=102030-magic,123456-basic",
                            "vipCoreEndpoint=Not-Relevant",
                            "scanDefaultFields=abc,def") {
            @Override
            public Client getClient() {
                return CLIENT;
            }
        };
        initPayara();
    }

    private static void initPayara() throws Exception {
        String evictAll = solrDocStoreUrl + "api/evict-all";
        log.debug("evictAll = {}", evictAll);

        Invocation invocation = CLIENT.target(evictAll)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .buildGet();
        for (int i = 0 ; i < 1000 ; i++) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException ex) {
                log.error("Exception: {}", ex.getMessage());
                log.debug("Exception: ", ex);
            }
            int status = invocation.invoke().getStatus();
            if (status == 200) {
                log.debug("eviction success in n'th try ({})", i);
                return;
            }
        }
        throw new IllegalStateException("solr-doc-store not ready yet");
    }

    @Before
    public void setUp() throws Exception {
        try {
            pg.clearTables("bibliographicSolrKeys", "bibliographictobibliographic", "holdingsitemssolrkeys", "holdingstobibliographic");
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
        for (SolrCollection collection : config.getSolrCollections()) {
            SolrClient solrClient = collection.getSolrClient();
            solrClient.deleteByQuery("*:*");
            solrClient.commit();
        }

        docProducer = new DocProducer();
        docProducer.config = config;
        docProducer.businessLogic = new BusinessLogic();
        docProducer.businessLogic.config = config;
        docProducer.businessLogic.profileService = new ProfileServiceBean();
        docProducer.businessLogic.profileService.config = config;
        docProducer.businessLogic.oa = new OpenAgency() {
            @Override
            public OpenAgencyLibraryRule libraryRule(String agencyId) {
                return new OpenAgencyLibraryRule(true, true, true, true, false, true);
            }
        };
        docProducer.init();
    }

    @Test
    public void loadAndDelete() throws Exception {
        System.out.println("loadAndDelete");
        SolrCollection solrCollection = config.getSolrCollections().iterator().next();

        Requests.load("test1-part1", solrDocStoreUrl);

        deployAndSearch(300000, docProducer, solrCollection, 5);

        Requests.load("test1-part2", solrDocStoreUrl);

        deployAndSearch(300000, docProducer, solrCollection, 0);
    }

    @Test
    public void loadAndFewerHolding() throws Exception {
        System.out.println("loadAndFewerHolding");
        SolrCollection solrCollection = config.getSolrCollections().iterator().next();

        Requests.load("test1-part1", solrDocStoreUrl);

        deployAndSearch(300000, docProducer, solrCollection, 5);

        Requests.load("test1-part3", solrDocStoreUrl);

        deployAndSearch(300000, docProducer, solrCollection, 3);
    }

    @Test
    public void creatAndDeleteWithoutHoldings() throws Exception {
        System.out.println("creatAndDeleteWithoutHoldings");
        SolrCollection solrCollection = config.getSolrCollections().iterator().next();

        Requests.load("test2-part1", solrDocStoreUrl);

        deployAndSearch(300010, docProducer, solrCollection, 1);

        Requests.load("test2-part2", solrDocStoreUrl);

        deployAndSearch(300010, docProducer, solrCollection, 0);
    }

    private void deployAndSearch(int agencyId, DocProducer docProducer, SolrCollection solrCollection, int expected) throws SolrServerException, IOException, PostponedNonFatalQueueError {
        JsonNode sourceDoc = docProducer.fetchSourceDoc(QueueJob.manifestation(agencyId, "clazzifier", "23645564"));
        SolrInputDocument doc = docProducer.createSolrDocument(sourceDoc, solrCollection);
        String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);
        int nestedDocumentCount = docProducer.getNestedDocumentCount(bibliographicShardId, solrCollection);
        docProducer.deleteSolrDocuments(bibliographicShardId, nestedDocumentCount, solrCollection);
        docProducer.deploy(doc, solrCollection);
        SolrClient solrClient = solrCollection.getSolrClient();
        solrClient.commit(true, true);
        QueryResponse response = solrClient.query(new SolrQuery("*:*"));
        System.out.println("response = " + response);
        assertEquals(expected, response.getResults().getNumFound());
    }

}
