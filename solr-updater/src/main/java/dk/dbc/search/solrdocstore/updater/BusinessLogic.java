package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.ee.stats.Timed;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.inject.Inject;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.updater.DocHelpers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
public class BusinessLogic {

    private static final Logger log = LoggerFactory.getLogger(BusinessLogic.class);

    private static final String COLLECTION_IDENTIFIER_FIELD = "rec.collectionIdentifier";

    @Inject
    OpenAgency oa;

    @Inject
    SolrFields solrFields;

    @Timed
    public void filterOutDecommissioned(JsonNode sourceDoc) {
        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        if (records == null) {
            return;
        }
        for (Iterator<JsonNode> i1 = records.elements() ; i1.hasNext() ;) {
            boolean keepRecord = false;
            JsonNode record = i1.next();
            for (Iterator<JsonNode> i2 = find(record, "indexKeys").elements() ; i2.hasNext() ;) {
                boolean keepHoldingsDocument = false;
                JsonNode holdingsRecord = i2.next();
                for (Iterator<JsonNode> i3 = holdingsRecord.withArray("holdingsitem.status").elements() ; i3.hasNext() ;) {
                    String status = i3.next().asText("");
                    if (status.equalsIgnoreCase("decommissioned")) {
                        i3.remove();
                    } else {
                        keepHoldingsDocument = true;
                    }
                }
                if (keepHoldingsDocument) {
                    keepRecord = true;
                } else {
                    i2.remove();
                }
            }
            if (!keepRecord) {
                i1.remove();
            }
        }
    }

    /**
     * Find all holdings agencies and record them
     *
     * @param sourceDoc entire json from solr-doc-store
     */
    @Timed
    public void addRecHoldingsAgencyId(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");

        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        for (JsonNode record : records) {
            JsonNode holdingsIndexKeys = find(record, "indexKeys");
            if (holdingsIndexKeys != null && holdingsIndexKeys.size() > 0) {
                String agencyId = find(record, "agencyId").asText();
                addField(indexKeys, "rec.holdingsAgencyId", agencyId);
            }
        }
    }

    /**
     * Include add agencies listed in 'partOfDanbib' in ln field
     *
     * @param sourceDoc entire json from solr-doc-store
     */
    @Timed
    public void addFromPartOfDanbib(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        JsonNode agencies = find(sourceDoc, "partOfDanbib");
        for (JsonNode agency : agencies) {
            String agencyId = String.format("%06d", agency.asInt());
            addField(indexKeys, "dkcclterm.ln", agencyId);
        }
    }

    /**
     * Include add agencies listed in 'partOfDanbib' in ln field
     *
     * @param sourceDoc entire json from solr-doc-store
     */
    @Timed
    public void addCollectionIdentifier800000(JsonNode sourceDoc) throws PostponedNonFatalQueueError {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        String field = getField(indexKeys, "rec.excludeFromUnionCatalogue");
        if ("true".equalsIgnoreCase(field)) {
            return;
        }
        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        List<String> collectionIdentifiers = getFields(indexKeys, COLLECTION_IDENTIFIER_FIELD);
        if (collectionIdentifiers == null) {
            collectionIdentifiers = Collections.EMPTY_LIST;
        }
        boolean hasBibDk = collectionIdentifiers.contains("800000-bibdk");
        boolean hasDanbib = collectionIdentifiers.contains("800000-danbib");
        boolean addBibDk = hasBibDk;
        boolean addDanbib = hasDanbib;
        for (Iterator<JsonNode> iterator = records.iterator() ; iterator.hasNext() && !addBibDk && !addDanbib ;) {
            JsonNode record = iterator.next();
            JsonNode holdingsIndexKeys = find(record, "indexKeys");
            if (holdingsIndexKeys != null && holdingsIndexKeys.size() > 0) {
                String agencyId = find(record, "agencyId").asText();
                OpenAgency.LibraryRule libraryRule = oa.libraryRule(agencyId);
                if (libraryRule.isResearchLibrary() &&
                    libraryRule.hasUseHoldingItem()) {
                    addBibDk = addBibDk || libraryRule.isPartOfBibliotekDk();
                    addDanbib = addDanbib || libraryRule.isPartOfDanbib();
                }
            }
        }
        if (addBibDk && !hasBibDk) {
            addField(indexKeys, COLLECTION_IDENTIFIER_FIELD, "800000-bibdk");
        }
        if (addDanbib && !hasDanbib) {
            addField(indexKeys, COLLECTION_IDENTIFIER_FIELD, "800000-danbib");
        }
    }

    /**
     * Append all holdings as nested document
     *
     * @param doc          root solr document
     * @param sourceDoc    document containing holdings
     * @param linkId       id for linking foe solr join searches
     * @param repositoryId id of record used by
     */
    @Timed
    public void addNestedHoldingsDocuments(SolrInputDocument doc, JsonNode sourceDoc, String linkId, String repositoryId, DocProducer docProducer) {
        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        for (JsonNode record : records) {
            String id = DocProducer.bibliographicShardId(sourceDoc) + "@" + find(record, "agencyId").asText() + "-" + find(record, "bibliographicRecordId").asText();
            JsonNode indexKeyList = find(record, "indexKeys");
            int i = 0;
            for (JsonNode indexKeys : indexKeyList) {
                setField(indexKeys, "rec.repositoryId", repositoryId);
                setField(indexKeys, "id", id + "#" + i++);
                setField(indexKeys, "t", "h"); // Holdings type
                addField(indexKeys, "parentDocId", linkId);
                SolrInputDocument nested = solrFields.newDocumentFromIndexKeys(indexKeys);
                doc.addChildDocument(nested);
            }
        }
    }

    @Timed
    public void attachedResources(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        JsonNode resources = find(sourceDoc, "attachedResources");
        for (Iterator<Entry<String, JsonNode>> iterator = resources.fields() ; iterator.hasNext() ;) {
            Entry<String, JsonNode> entry = iterator.next();
            log.debug("entry = {}", entry);
            String name = entry.getKey();
            switch (name) {
                case "hasCoverUrl":
                    anyTrue(indexKeys, "rec." + name, entry.getValue());
                    break;
                default:
                    allTrue(indexKeys, "rec." + name, entry.getValue());
                    break;
            }
        }
    }

    private void anyTrue(JsonNode indexKeys, String key, JsonNode values) {
        Optional<String> isTrue = fieldsStream(values)
                .filter(e -> e.getValue().asBoolean(false))
                .map(Entry::getKey)
                .findAny();
        if (isTrue.isPresent()) {
            log.trace("key {} (anyTrue), {} is true", key, isTrue.get());
            addField(indexKeys, key, "true");
        }
    }

    private void allTrue(JsonNode indexKeys, String key, JsonNode values) {
        Optional<String> isFalse = fieldsStream(values)
                .filter(e -> !e.getValue().asBoolean(false))
                .map(Entry::getKey)
                .findAny();
        if (isFalse.isPresent()) {
            log.trace("key {} (anyTrue), {} is true", key, isFalse.get());
        } else {
            addField(indexKeys, key, "true");
        }
    }

    private static Stream<Entry<String, JsonNode>> fieldsStream(JsonNode node) {
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(node.fields(), 0), false);
    }

}
