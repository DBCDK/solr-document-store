/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class HoldingsItemEntityTest {

    private static final ObjectMapper O = new ObjectMapper();

    /**
     * Test of asHoldingsItemEntity method, of class HoldingsItemEntity.
     */
    @Test
    public void verifySyntheticHasLiveHoldings() throws Exception {
        System.out.println("asHoldingsItemEntity");

        HoldingsItemEntity he = new HoldingsItemEntity(0, "A", "", indexKeys("[{\"holdingsitem.status\":[\"Foo\", \"Decommissioned\"]}]"), "");
        assertTrue(he.getHasLiveHoldings());
        he.setIndexKeys(indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]},{\"holdingsitem.status\":[\"Decommissioned\"]}]"));
        assertFalse(he.getHasLiveHoldings());

    }

    private static List<Map<String, List<String>>> indexKeys(String json) throws Exception {
        return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>(){});
    }

}
