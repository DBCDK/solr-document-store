/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
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
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.StreamingResponseCallback;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.SolrHttpClientBuilder;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.params.SolrParams;
import org.junit.Assume;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestRule;
import org.junit.runners.model.Statement;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class newEmptyTest {

    public newEmptyTest() {
    }

    @Test
    public void test() throws Exception {
        System.out.println("test");
        CloudSolrClient cloudSolrClient = new CloudSolrClient.Builder()
                .withSolrUrl("http://cisterne-solr.dbc.dk:8984/solr")
                .build();
        cloudSolrClient.setDefaultCollection("cisterne-corepo-searcher");

        SolrQuery solrQuery = new SolrQuery("submitter:150033");
        solrQuery.setFields("rec.repositoryId");

        solrQuery.setSort("id", SolrQuery.ORDER.asc);
        solrQuery.setRows(Integer.MAX_VALUE/2);
        StreamingResponseCallback callback = new StreamingResponseCallback() {
            @Override
            public void streamSolrDocument(SolrDocument doc) {
                System.out.println("doc = " + String.valueOf(doc.getFirstValue("rec.repositoryId")));
            }

            @Override
            public void streamDocListInfo(long rows, long start, Float arg2) {
                System.out.println("streamDocListInfo = " + rows + "," + start + "," + arg2);
            }
        };
        cloudSolrClient.queryAndStreamResponse(solrQuery, callback);

        System.out.println("OK");
        fail("OK");
    }

    /*
     * Don't run as part of normal testing, only as part of ide testing
     */
    @Rule
    public TestRule dummyTestRule = (stmt, description) -> {
        if (System.getProperty("test") == null) {
            stmt = new Statement() {
                @Override
                public void evaluate() throws Throwable {
                    Assume.assumeTrue(true);
                }
            };
        }
        return stmt;
    };
}
