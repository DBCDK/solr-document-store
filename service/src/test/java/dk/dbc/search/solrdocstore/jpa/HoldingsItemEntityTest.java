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
package dk.dbc.search.solrdocstore.jpa;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemEntityTest {

    private static final ObjectMapper O = new ObjectMapper();

    /**
     * Test of asHoldingsItemEntity method, of class HoldingsItemEntity.
     */
    @Test
    public void verifySyntheticHasLiveHoldings() throws Exception {
        System.out.println("asHoldingsItemEntity");

        HoldingsItemEntity he = new HoldingsItemEntity(0, "A", "", indexKeys("[{}]"), "");
        assertTrue(he.getHasLiveHoldings());
        he.setIndexKeys(indexKeys("[]"));
        assertFalse(he.getHasLiveHoldings());
        he.setIndexKeys(null);
        assertFalse(he.getHasLiveHoldings());
    }

    @Test(timeout = 2_000L)
    public void test1() throws Exception {
        System.out.println("test1");

        HoldingsItemEntity hi = new HoldingsItemEntity();
        hi.setAgencyId(777777);

        List<Map<String, List<String>>> values = indexKeys(
                "[" +
                " {" +
                "  'holdingsitem.branchId': [ 'abc' ]," +
                "  'holdingsitem.status': [ 'OnShelf' ]" +
                " }," +
                " {" +
                "  'holdingsitem.branchId': [ 'bcd' ]," +
                "  'holdingsitem.status': [ 'OnShelf', 'NotForLoan' ]" +
                " }," +
                " {" +
                "  'holdingsitem.branchId': [ 'cde' ]," +
                "  'holdingsitem.status': [ 'OnLoan', 'NotForLoan' ]" +
                " }," +
                " {" +
                "  'holdingsitem.branchId': [ 'def' ]," +
                "  'holdingsitem.status': [ 'OnOrder' ]" +
                " }," +
                " {" +
                "  'holdingsitem.status': [ 'Online' ]" +
                " }" +
                "]");
        hi.setIndexKeys(values);
        System.out.println("values = " + hi.getLocations());

        assertThat(hi.getLocations(), containsInAnyOrder(
                   "777777-onshelf",
                   "777777-notforloan",
                   "777777-abc-onshelf",
                   "777777-bcd-onshelf",
                   "777777-bcd-notforloan",
                   "777777-cde-notforloan",
                   "777777-online"));
    }

    private static List<Map<String, List<String>>> indexKeys(String json) throws Exception {
        return O.readValue(json.replaceAll("'", "\""), new TypeReference<List<Map<String, List<String>>>>() {
                   });
    }

}
