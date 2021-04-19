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

import dk.dbc.search.solrdocstore.request.BibliographicEntityRequest;
import dk.dbc.commons.jsonb.JSONBContext;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class BibliographicEntityRequestTest {

    private final JSONBContext context = new JSONBContext();

    @Test(timeout = 2_000L)
    public void testDecode() throws Exception {
        System.out.println("testDecode");

        String jsonContentOld = "{\"superceds\":[\"a\"]}";
        BibliographicEntityRequest beOld = context.unmarshall(jsonContentOld, BibliographicEntityRequest.class);
        assertThat(beOld.getSupersedes(), containsInAnyOrder("a"));

        String jsonContentNew = "{\"supersedes\":[\"a\"]}";
        BibliographicEntityRequest beNew = context.unmarshall(jsonContentNew, BibliographicEntityRequest.class);
        assertThat(beNew.getSupersedes(), containsInAnyOrder("a"));
    }
}
