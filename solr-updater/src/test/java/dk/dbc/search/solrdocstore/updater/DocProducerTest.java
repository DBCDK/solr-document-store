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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import dk.dbc.solrdocstore.updater.businesslogic.FeatureSwitch;
import dk.dbc.solrdocstore.updater.businesslogic.KnownSolrFields;
import dk.dbc.solrdocstore.updater.businesslogic.SolrDocStoreResponse;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreLibraryRule;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreProfile;
import java.io.FileInputStream;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Test;
import org.xml.sax.SAXException;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DocProducerTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private static final Client CLIENT = ClientBuilder.newClient();

    @Test
    public void test() throws Exception {
        System.out.println("test");

        Config config = new Config("solrUrl=Not-Relevant",
                                   "zookeeperUrl=Not-Relevant",
                                   "profileServiceUrl=Not-Relevant",
                                   "solrDocStoreUrl=Not-Relevant",
                                   "solrAppId=Not-Relevant",
                                   "queues=Not-Relevant",
                                   "openAgencyUrl=Not-Relevant",
                                   "vipCoreEndpoint=Not-Relevant",
                                   "workPresentationUrl=not-relevant",
                                   "scanProfiles=102030-magic,123456-basic",
                                   "scanDefaultFields=abc,def") {
            @Override
            protected Set<SolrCollection> makeSolrCollections(Client client) throws IllegalArgumentException {
                return Collections.EMPTY_SET;
            }

            @Override
            public Client getClient() {
                return CLIENT;
            }
        };

        DocProducer docProducer = new DocProducer() {
            @Override
            public SolrDocStoreResponse fetchSourceDoc(QueueJob job) throws IOException {
                String file = "DocProducerTest/" + job.getAgencyId() + "-" + job.getBibliographicRecordId() + ".json";
                System.out.println("file = " + file);
                try (InputStream stream = DocProducerTest.class.getClassLoader().getResourceAsStream(file)) {
                    return OBJECT_MAPPER.readValue(stream, SolrDocStoreResponse.class);
                }
            }
        };
        docProducer.config = config;
        docProducer.libraryRuleProvider = new LibraryRuleProviderBean() {
            @Override
            public VipCoreLibraryRule libraryRulesFor(String agencyId) {
                return new VipCoreLibraryRuleMockResponse(true, true, true, true, false, true);
            }
        };

        docProducer.persistentWorkIdProvider = new PersistentWorkIdProviderBean() {
            @Override
            public String persistentWorkIdFor(String corepoWorkId) {
                return "persistent-for-" + corepoWorkId;
            }
        };

        docProducer.profileProvider = new ProfileProviderBean() {
            @Override
            public VipCoreProfile profileFor(String agencyId, String profile) {
                switch (agencyId + "-" + profile) {
                    case "102030-magic":
                        return new VipCoreProfile(true, "220000-katalog");
                    case "123456-basic":
                        return new VipCoreProfile(false, "220000-katalog");
                    default:
                        throw new AssertionError();
                }
            }
        };

        SolrDocStoreResponse node = docProducer.fetchSourceDoc(QueueJob.manifestation(300101, "clazzifier", "23645564"));

        System.out.println("node = " + node);

        SolrCollection solrCollection = new SolrCollection() {
            @Override
            public FeatureSwitch getFeatures() {
                return new FeatureSwitch("all");
            }

            @Override
            public KnownSolrFields getSolrFields() {
                try (FileInputStream is = new FileInputStream("target/solr/corepo-config/schema.xml")) {
                    return new KnownSolrFields(is);
                } catch (IOException | SAXException ex) {
                    throw new RuntimeException(ex);
                }
            }
        };

        SolrInputDocument document = docProducer.createSolrDocument(node, solrCollection);
        System.out.println("document = " + document);
        assertTrue(document.containsKey("dkcclterm.po"));
        assertFalse(document.containsKey("unknown.field"));

        assertEquals(3, document.get("rec.holdingsAgencyId").getValues().size());
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300101"));
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300102"));
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300104"));

        assertTrue(document.get("rec.repositoryId").getValues().contains("870970-basis:23645564"));

        assertTrue(document.containsKey("dkcclterm.ln"));
        assertTrue(document.get("dkcclterm.ln").getValues().contains("777777"));

        System.out.println("OK");
    }
}
