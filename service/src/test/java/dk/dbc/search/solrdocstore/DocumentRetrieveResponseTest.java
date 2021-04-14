/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class DocumentRetrieveResponseTest {

    private static final ObjectMapper O = new ObjectMapper();
    private static final TypeReference<List<Map<String, List<String>>>> TYPE_REFERENCE = new TypeReference<List<Map<String, List<String>>>>() {
    };

    @Test(timeout = 2_000L)
    public void testCase() throws Exception {
        System.out.println("testCase");

        List<HoldingsItemEntity> holdingsItemRecords = Arrays.asList(
                hiEntityWith("[" +
                             "{'holdingsitem.status':['online']}," +
                             "{'holdingsitem.itemId':['a1', 'a2', 'a3'], 'holdingsitem.status':['onshelf']}" +
                             "]"),
                hiEntityWith("[" +
                             "{'holdingsitem.itemId':['b1', 'b2'], 'holdingsitem.status':['onshelf']}," +
                             "{'holdingsitem.itemId':['c1', 'c2'], 'holdingsitem.status':['onshelf']}," +
                             "{'holdingsitem.itemId':['d1'], 'holdingsitem.status':['onloan']}" +
                             "]")
        );

        DocumentRetrieveResponse resp = new DocumentRetrieveResponse(null, holdingsItemRecords, null, null);
        System.out.println("resp.totalStatusCount = " + resp.totalStatusCount);

        List<String> summarized = resp.totalStatusCount.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.toList());

        assertThat(summarized, containsInAnyOrder("onshelf=7", "online=1", "onloan=1"));
    }

    private static HoldingsItemEntity hiEntityWith(String json) throws JsonProcessingException {
        List<Map<String, List<String>>> indexKeys = O.readValue(json.replaceAll("'", "\""), TYPE_REFERENCE);
        return new HoldingsItemEntity(0, "", indexKeys, "");
    }
}
