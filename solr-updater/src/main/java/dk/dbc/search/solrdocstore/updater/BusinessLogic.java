package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.search.solrdocstore.updater.profile.Profile;
import dk.dbc.search.solrdocstore.updater.profile.ProfileServiceBean;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.updater.DocHelpers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@ApplicationScoped
@Singleton
@Lock(LockType.READ)
public class BusinessLogic {

    private static final Logger log = LoggerFactory.getLogger(BusinessLogic.class);

    private static final String COLLECTION_IDENTIFIER_FIELD = "rec.collectionIdentifier";

    @Inject
    OpenAgency oa;

    @Inject
    SolrFields solrFields;

    @Inject
    Config config;

    @Inject
    ProfileServiceBean profileService;

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
     * @throws PostponedNonFatalQueueError if unable to communicate with
     *                                     openagency
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
            log.trace("adding 800000-bibdk");
            addField(indexKeys, COLLECTION_IDENTIFIER_FIELD, "800000-bibdk");
        }
        if (addDanbib && !hasDanbib) {
            log.trace("adding 800000-danbib");
            addField(indexKeys, COLLECTION_IDENTIFIER_FIELD, "800000-danbib");
        }
    }

    private static final String COMMON_RECORD_BASE_PREFIX = "870970-basis:";

    /**
     * Add holdingsitem.role as declared in #SE-2369
     * <p>
     * Generate 'bibdk' and/or 'danbib' (or none) values for holdingsitem.role,
     * depending on if the holdings are part of bibdk/danbib holdings
     *
     * @param sourceDoc entire json from solr-doc-store
     * @throws PostponedNonFatalQueueError if unable to communicate with
     *                                     openagency
     */
    @Timed
    public void addHoldingsItemRole(JsonNode sourceDoc) throws PostponedNonFatalQueueError {
        JsonNode bibliographicRecord = find(sourceDoc, "bibliographicRecord");
        JsonNode indexKeys = find(bibliographicRecord, "indexKeys");
        String repositoryId = find(bibliographicRecord, "repositoryId").asText();
        boolean excludeFromUnionCatalogue = "true".equalsIgnoreCase(
                getField(indexKeys, "rec.excludeFromUnionCatalogue")
        );

        JsonNode holdingsItems = find(sourceDoc, "holdingsItemRecords");
        for (JsonNode holdingItem : holdingsItems) {
            String agencyId = find(holdingItem, "agencyId").asText();
            OpenAgency.LibraryRule libraryRule = oa.libraryRule(agencyId);
            boolean authCreateCommonRecord = libraryRule.hasAuthCreateCommonRecord();
            JsonNode holdingsItemIndexKeys = holdingItem.get("indexKeys");
            if (holdingsItemIndexKeys != null)
                holdingsItemIndexKeys.forEach(doc -> {
                    addHoldingsItemRole(doc, "bibdk", libraryRule.isPartOfBibliotekDk(),
                                        excludeFromUnionCatalogue, authCreateCommonRecord, repositoryId);
                    addHoldingsItemRole(doc, "danbib", libraryRule.isPartOfDanbib(),
                                        excludeFromUnionCatalogue, authCreateCommonRecord, repositoryId);
                });
        }

    }

    private void addHoldingsItemRole(JsonNode doc, String role,
                                     boolean partOf, boolean excludeFromUnionCatalogue,
                                     boolean authCreateCommonRecord, String repositoryId) {
        if (partOf && !excludeFromUnionCatalogue)
            addField(doc, "holdingsitem.role", role);
        if (!partOf && authCreateCommonRecord && repositoryId.startsWith(COMMON_RECORD_BASE_PREFIX))
            addField(doc, "holdingsitem.role", role);
    }

    /**
     * Append all holdings as nested document
     *
     * @param doc          root solr document
     * @param sourceDoc    document containing holdings
     * @param repositoryId id of record used by
     */
    @Timed
    public void addNestedHoldingsDocuments(SolrInputDocument doc, JsonNode sourceDoc, String repositoryId) {
        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        for (JsonNode record : records) {
            String id = DocProducer.bibliographicShardId(sourceDoc) + "@" + find(record, "agencyId").asText() + "-" + find(record, "bibliographicRecordId").asText();
            JsonNode indexKeyList = find(record, "indexKeys");
            int i = 0;
            for (JsonNode indexKeys : indexKeyList) {
                setField(indexKeys, "rec.repositoryId", repositoryId);
                setField(indexKeys, "id", id + "#" + i++);
                setField(indexKeys, "t", "h"); // Holdings type
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
                    anyTrueSet(indexKeys, "rec." + name, entry.getValue(), false);
                    break;
                default:
                    allTrueSet(indexKeys, "rec." + name, entry.getValue(), false);
                    break;
            }
        }
    }

    /**
     * Add special profile specific scan fields, depending upon profile match
     *
     * @param sourceDoc entire json from solr-doc-store
     * @throws RuntimeException If there's problems with the profile-service
     */
    @Timed
    public void addScan(JsonNode sourceDoc) {
        scanDefault(sourceDoc);
        scanAny(sourceDoc);
        scanProfiles(sourceDoc);
    }

    public void scanAny(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        Set<String> collected = new HashSet<>();
        for (Iterator<Entry<String, JsonNode>> i = indexKeys.fields() ; i.hasNext() ;) {
            Entry<String, JsonNode> entry = i.next();
            if (entry.getKey().equals("scan.any"))
                throw new IllegalStateException("scan.any is already defined");
            if (entry.getKey().startsWith("scan.") &&
                entry.getValue().isArray()) {
                entry.getValue().forEach(e -> collected.add(e.asText()));
            }
        }
        collected.forEach(v -> addField(indexKeys, "scan.any", v));
    }

    public void scanDefault(JsonNode sourceDoc) {
        Set<String> fields = config.getScanDefaultFields();
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        HashSet<String> collected = new HashSet<>();
        for (Iterator<Entry<String, JsonNode>> i = indexKeys.fields() ; i.hasNext() ;) {
            Entry<String, JsonNode> entry = i.next();
            if (entry.getKey().equals("scan.default"))
                throw new IllegalStateException("scan.default is already defined");
            if (fields.contains(entry.getKey()) &&
                entry.getValue().isArray()) {
                entry.getValue().forEach(e -> collected.add(e.asText()));
            }
        }
        collected.forEach(v -> addField(indexKeys, "scan.default", v));
    }

    public void scanProfiles(JsonNode sourceDoc) {
        Map<String, Set<String>> scanProfiles = config.getScanProfiles();
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        HashSet<String> holdingsAgencies = scanProfileHoldingAgencies(sourceDoc);
        HashSet<String> collectionIdentifiers = scanProfileCollectionIdentifiers(indexKeys);
        HashSet<String> fields = scanProfileScanFieldNames(indexKeys);
        scanProfiles.forEach((agencyId, profiles) -> {
            profiles.forEach(profile -> {
                log.trace("testing profile: {}-{}", agencyId, profile);
                Profile p = profileService.getProfile(agencyId, profile);
                boolean hasOwnHolding = p.includeOwnHoldings && holdingsAgencies.contains(agencyId);
                log.trace("hasOwnHolding = {}", hasOwnHolding);
                boolean matchesCollectionIdentifier = p.search.stream().anyMatch(collectionIdentifiers::contains);
                log.trace("pprofileCollectionIdentifiers = {}", p.search);
                log.trace("matchesCollectionIdentifier = {}", matchesCollectionIdentifier);
                if (hasOwnHolding ||
                    matchesCollectionIdentifier) {
                    log.debug("Adding scan keys for: {}-{}", agencyId, profile);
                    String postfix = "_" + agencyId + "_" + profile;
                    addScanKeys(indexKeys, postfix, fields);
                }
            });
        });
    }

    private HashSet<String> scanProfileHoldingAgencies(JsonNode sourceDoc) {
        HashSet<String> holdingsAgencies = new HashSet<>();
        find(sourceDoc, "holdingsItemRecords")
                .forEach(n -> {
                    if (n.get("hasLiveHoldings").asBoolean())
                        holdingsAgencies.add(find(n, "agencyId").asText());
                });
        log.trace("holdingsAgencies = {}", holdingsAgencies);
        return holdingsAgencies;
    }

    private HashSet<String> scanProfileCollectionIdentifiers(JsonNode indexKeys) {
        HashSet<String> collectionIdentifiers = new HashSet<>();
        JsonNode collectionIndentifiersNode = indexKeys.get(COLLECTION_IDENTIFIER_FIELD);
        if (collectionIndentifiersNode != null)
            collectionIndentifiersNode
                    .forEach(n -> collectionIdentifiers.add(n.asText()));
        log.trace("collectionIdentifiers = {}", collectionIdentifiers);
        return collectionIdentifiers;
    }

    private HashSet<String> scanProfileScanFieldNames(JsonNode indexKeys) {
        HashSet<String> fields = new HashSet<>();
        indexKeys.fieldNames()
                .forEachRemaining(s -> {
                    if (s.startsWith("scan."))
                        fields.add(s);
                });
        log.trace("fields = {}", fields);
        return fields;
    }

    private void anyTrueSet(JsonNode indexKeys, String key, JsonNode values, boolean setFalseOverrideExisting) {
        Optional<String> isTrue = fieldsStream(values)
                .filter(e -> e.getValue().asBoolean(false))
                .map(Entry::getKey)
                .findAny();
        if (isTrue.isPresent()) {
            log.trace("key {} (anyTrue), {} is true", key, isTrue.get());
            setField(indexKeys, key, "true");
        } else if (setFalseOverrideExisting) {
            setField(indexKeys, key, "false");
        }
    }

    private void allTrueSet(JsonNode indexKeys, String key, JsonNode values, boolean setFalseOverrideExisting) {
        Optional<String> isFalse = fieldsStream(values)
                .filter(e -> !e.getValue().asBoolean(false))
                .map(Entry::getKey)
                .findAny();
        if (isFalse.isPresent()) {
            log.trace("key {} (anyTrue), {} is true", key, isFalse.get());
            if (setFalseOverrideExisting) {
                setField(indexKeys, key, "false");
            }
        } else {
            setField(indexKeys, key, "true");
        }
    }

    private void addScanKeys(JsonNode indexKeys, String postfix, HashSet<String> fields) {
        for (String field : fields) {
            ArrayNode target = (ArrayNode) indexKeys.withArray(field + postfix);
            indexKeys.get(field)
                    .forEach(n -> target.add(n.asText()));
        }
    }

    private static Stream<Entry<String, JsonNode>> fieldsStream(JsonNode node) {
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(node.fields(), 0), false);
    }

}
