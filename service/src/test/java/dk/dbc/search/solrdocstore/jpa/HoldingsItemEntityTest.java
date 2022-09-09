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

import dk.dbc.search.solrdocstore.SolrIndexKeys;
import java.util.List;
import java.util.Map;
import org.junit.Test;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemEntityTest {

    @Test(timeout = 2_000L)
    public void testLocations() throws Exception {
        System.out.println("testLocations");

        HoldingsItemEntity hi = new HoldingsItemEntity();
        hi.setAgencyId(777777);

        IndexKeysList values = SolrIndexKeys.holdingsIndexKeys(
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

    @Test(timeout = 2_000L)
    public void testStatusCodes() throws Exception {
        System.out.println("testStatusCodes");
        HoldingsItemEntity hi = new HoldingsItemEntity();
        hi.setAgencyId(777777);

        IndexKeysList values = SolrIndexKeys.holdingsIndexKeys(
                "[" +
                " {" +
                "  'holdingsitem.itemId': [ 'abc' ]," +
                "  'holdingsitem.status': [ 'OnShelf' ]" +
                " }," +
                " {" +
                "  'holdingsitem.itemId': [ 'bcd' ]," +
                "  'holdingsitem.status': [ 'OnShelf' ]" +
                " }," +
                " {" +
                "  'holdingsitem.itemId': [ 'cde', 'def' ]," +
                "  'holdingsitem.status': [ 'OnLoan' ]" +
                " }," +
                " {" +
                "  'holdingsitem.status': [ 'Online' ]" +
                " }" +
                "]");
        hi.setIndexKeys(values);
        System.out.println("values = " + hi.getLocations());
        Map<String, Integer> statusCount = hi.getStatusCount();
        List<String> status = statusCount.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(toList());

        assertThat(status, containsInAnyOrder(
                   "onshelf=2",
                   "onloan=2",
                   "online=1"));
    }
}
