/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater-business-logic
 *
 * solr-doc-store-updater-business-logic is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater-business-logic is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.solrdocstore.updater.businesslogic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

import static java.util.Collections.EMPTY_MAP;
import static java.util.stream.Collectors.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class SolrDocStoreResponse {

    private static final ObjectMapper O = new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    public static SolrDocStoreResponse from(JsonNode sourceDoc) throws JsonProcessingException {
        return O.treeToValue(sourceDoc, SolrDocStoreResponse.class);
    }

    public BibliographicRecord bibliographicRecord;
    public List<HoldingsItemRecord> holdingsItemRecords;
    public List<Integer> partOfDanbib;
    public Map<String, Map<Integer, Boolean>> attachedResources;
    public Map<String, Integer> totalStatusCount;

    public Map<String, List<String>> getIndexKeys() {
        return bibliographicRecord.indexKeys;
    }

    public Map<String, List<Map<String, List<String>>>> getHoldingsItemsIndexKeys() {
        if (holdingsItemRecords == null)
            return EMPTY_MAP;
        return holdingsItemRecords.stream()
                .collect(toMap(h -> String.valueOf(h.agencyId), h -> h.indexKeys));
    }

    public static class BibliographicRecord {

        public int agencyId;
        public String classifier;
        public String bibliographicRecordId;
        public String repositoryId;
        public String work;
        public String unit;
        public boolean deleted;
        public Map<String, List<String>> indexKeys;
    }

    public static class HoldingsItemRecord {

        public int agencyId;
        public String bibliographicRecordId;
        public List<Map<String, List<String>>> indexKeys;
    }

}
