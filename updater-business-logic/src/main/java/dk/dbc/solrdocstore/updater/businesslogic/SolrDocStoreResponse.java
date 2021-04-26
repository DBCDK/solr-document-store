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
import java.io.IOException;
import java.io.InputStream;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
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

    public static SolrDocStoreResponse from(InputStream is) throws JsonProcessingException, IOException {
        return O.readValue(is, SolrDocStoreResponse.class);
    }

    public BibliographicRecord bibliographicRecord;
    public List<HoldingsItemRecord> holdingsItemRecords;
    public List<Integer> partOfDanbib;
    public Map<String, Map<Integer, Boolean>> attachedResources;
    public Map<String, Integer> totalStatusCount;

    public SolrDocStoreResponse deepCopy() {
        SolrDocStoreResponse copy = new SolrDocStoreResponse();
        copy.bibliographicRecord = bibliographicRecord.deepCopy();
        copy.holdingsItemRecords = new ArrayList<>();
        holdingsItemRecords.forEach(h -> copy.holdingsItemRecords.add(h.deepCopy()));
        copy.partOfDanbib = new ArrayList<>(partOfDanbib);
        copy.attachedResources = new HashMap<>();
        attachedResources.forEach((k, vs) -> copy.attachedResources.put(k, new HashMap<>(vs)));
        copy.totalStatusCount = new HashMap<>(totalStatusCount);
        return copy;
    }

    public Map<String, List<String>> getIndexKeys() {
        return bibliographicRecord.indexKeys;
    }

    public Map<String, List<Map<String, List<String>>>> getHoldingsItemsIndexKeys() {
        if (holdingsItemRecords == null)
            return EMPTY_MAP;
        return holdingsItemRecords.stream()
                .flatMap(h -> h.indexKeys.stream()
                        .map(i -> new AbstractMap.SimpleEntry<>(String.valueOf(h.agencyId), i)))
                .collect(groupingBy(Map.Entry::getKey, mapping(Map.Entry::getValue, toList())));
    }

    @Override
    public String toString() {
        return "SolrDocStoreResponse{" + "bibliographicRecord=" + bibliographicRecord + ", holdingsItemRecords=" + holdingsItemRecords + ", partOfDanbib=" + partOfDanbib + ", attachedResources=" + attachedResources + ", totalStatusCount=" + totalStatusCount + '}';
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

        private BibliographicRecord deepCopy() {
            BibliographicRecord copy = new BibliographicRecord();
            copy.agencyId = agencyId;
            copy.classifier = classifier;
            copy.bibliographicRecordId = bibliographicRecordId;
            copy.repositoryId = repositoryId;
            copy.work = work;
            copy.unit = unit;
            copy.indexKeys = new HashMap<>();
            indexKeys.forEach((k, vs) -> copy.indexKeys.put(k, new ArrayList<>(vs)));
            return copy;
        }

        @Override
        public String toString() {
            return "BibliographicRecord{" + "agencyId=" + agencyId + ", classifier=" + classifier + ", bibliographicRecordId=" + bibliographicRecordId + ", repositoryId=" + repositoryId + ", work=" + work + ", unit=" + unit + ", deleted=" + deleted + '}';
        }
    }

    public static class HoldingsItemRecord {

        public int agencyId;
        public String bibliographicRecordId;
        public List<Map<String, List<String>>> indexKeys;

        private HoldingsItemRecord deepCopy() {
            HoldingsItemRecord copy = new HoldingsItemRecord();
            copy.agencyId = agencyId;
            copy.bibliographicRecordId = bibliographicRecordId;
            copy.indexKeys = new ArrayList<>();
            indexKeys.forEach(map -> {
                HashMap<String, List<String>> mapCopy = new HashMap<>();
                map.forEach((k, vs) -> mapCopy.put(k, new ArrayList<>(vs)));
                copy.indexKeys.add(mapCopy);
            });
            return copy;
        }

        @Override
        public String toString() {
            return "HoldingsItemRecord{" + "agencyId=" + agencyId + ", bibliographicRecordId=" + bibliographicRecordId + '}';
        }
    }
}
