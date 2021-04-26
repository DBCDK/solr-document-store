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

import dk.dbc.solrdocstore.updater.businesslogic.FeatureSwitch.Feature;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Stream;
import org.apache.solr.common.SolrDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.Collections.EMPTY_LIST;
import static java.util.stream.Collectors.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class BusinessLogic {

    private static final Logger log = LoggerFactory.getLogger(BusinessLogic.class);

    private static final String REC_COLLECTION_IDENTIFIER_FIELD = "rec.collectionIdentifier";
    private static final String REC_EXCLUDE_FROM_UNION_CATALOGUE = "rec.excludeFromUnionCatalogue";
    private static final String REC_HOLDINGS_AGENCY_ID = "rec.holdingsAgencyId";
    private static final String REC_HOLDINGS_COUNT = "rec.holdingsCount";
    private static final String REC_HOLDINGS_ON_LOAN = "rec.holdingsOnLoan";
    private static final String REC_PERSISTENT_WORK_ID = "rec.persistentWorkId";
    private static final String HOLDINGSITEM_ROLE = "holdingsitem.role";
    private static final String COMMON_RECORD_ID_PREFIX = "870970-basis:";
    private static final int MAX_SOLR_FIELD_VALUE_SIZE = 32000;

    private final FeatureSwitch featureSwitch;
    private final KnownSolrFields knownSolrFields;

    private final LibraryRuleProvider libraryRuleProvider;

    private final PersistentWorkIdProvider persistentWorkIdProvider;

    private final ProfileProvider profileProvider;
    private final Set<String> scanDefaultFields;
    private final Map<String, Set<String>> scanAgencyProfiles;

    public static Builder builder(FeatureSwitch featureSwitch, KnownSolrFields knownSolrFields) {
        return new Builder(featureSwitch, knownSolrFields);
    }

    public static class Builder {

        private final FeatureSwitch featureSwitch;
        private final KnownSolrFields knownSolrFields;

        private LibraryRuleProvider libraryRuleProvider;

        private PersistentWorkIdProvider persistentWorkIdProvider;

        private ProfileProvider profileProvider;
        private Set<String> scanDefaultFields;
        private Map<String, Set<String>> scanAgencyProfiles;

        public Builder(FeatureSwitch featureSwitch, KnownSolrFields knownSolrFields) {
            if (featureSwitch == null)
                throw new IllegalArgumentException("FeatureSwitch cannot be null");
            this.featureSwitch = featureSwitch;
            this.knownSolrFields = knownSolrFields;
        }

        public Builder enable800000AndRole(LibraryRuleProvider libraryRuleProvider) {
            if (libraryRuleProvider == null)
                throw new IllegalArgumentException("LibraryRuleProvider cannot be null");
            if (this.libraryRuleProvider != null)
                throw new IllegalStateException("LibraryRuleProvider has already been enabled");
            this.libraryRuleProvider = libraryRuleProvider;
            return this;
        }

        public Builder enablePersistentWorkId(PersistentWorkIdProvider persistentWorkIdProvider) {
            if (profileProvider == null)
                throw new IllegalArgumentException("PersistentWorkIdProvider cannot be null");
            if (this.persistentWorkIdProvider != null)
                throw new IllegalStateException("PersistentWorkId has already been enabled");
            this.persistentWorkIdProvider = persistentWorkIdProvider;
            return this;
        }

        public Builder enableScan(ProfileProvider profileProvider, String scanDefaultFields, String scanAgencyProfiles) {
            if (this.profileProvider != null)
                throw new IllegalStateException("Scan has already been enabled");
            if (profileProvider == null)
                throw new IllegalArgumentException("ProfileProvider cannot be null");
            if (scanDefaultFields == null)
                throw new IllegalArgumentException("ScanDefaultFields cannot be null");
            if (scanAgencyProfiles == null)
                throw new IllegalArgumentException("ScanAgencyProfiles cannot be null");
            this.profileProvider = profileProvider;
            this.scanDefaultFields = defaultFieldsFrom(scanDefaultFields);
            this.scanAgencyProfiles = profilesMapFrom(scanAgencyProfiles);
            return this;
        }

        public Builder enableScan(ProfileProvider profileProvider, Set<String> scanDefaultFields, Map<String, Set<String>> scanAgencyProfiles) {
            if (profileProvider == null)
                throw new IllegalArgumentException("ProfileProvider cannot be null");
            if (scanDefaultFields == null)
                throw new IllegalArgumentException("ScanDefaultFields cannot be null");
            if (scanAgencyProfiles == null)
                throw new IllegalArgumentException("ScanAgencyProfiles cannot be null");
            if (this.profileProvider != null)
                throw new IllegalStateException("Scan has already been enabled");
            this.profileProvider = profileProvider;
            this.scanDefaultFields = scanDefaultFields;
            this.scanAgencyProfiles = scanAgencyProfiles;
            return this;
        }

        public BusinessLogic build() {
            return new BusinessLogic(libraryRuleProvider, featureSwitch, knownSolrFields, profileProvider, scanDefaultFields, scanAgencyProfiles, persistentWorkIdProvider);
        }
    }

    public BusinessLogic(LibraryRuleProvider libraryRuleProvider, FeatureSwitch featureSwitch, KnownSolrFields knownSolrFields,
                         ProfileProvider profileProvider, Set<String> scanDefaultFields, Map<String, Set<String>> scanAgencyProfiles,
                         PersistentWorkIdProvider persistentWorkIdProvider) {
        this.featureSwitch = featureSwitch;
        this.knownSolrFields = knownSolrFields;
        this.libraryRuleProvider = libraryRuleProvider;
        this.persistentWorkIdProvider = persistentWorkIdProvider;
        this.profileProvider = profileProvider;
        this.scanDefaultFields = scanDefaultFields;
        this.scanAgencyProfiles = scanAgencyProfiles;
    }

    public SolrDocument processAndAddIds(String rootId, SolrDocStoreResponse source) {
        SolrDocument doc = process(source);
        addIdToSolrDocument(rootId, doc);
        return doc;
    }

    public SolrDocument process(SolrDocStoreResponse source) {

        Map<String, List<String>> indexKeys = source.getIndexKeys();
        Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeys = source.getHoldingsItemsIndexKeys();

        addType(indexKeys, holdingsItemsIndexKeys);
        if (should(Feature.HOLDINGS_AGENCY)) {
            addHoldingsAgency(indexKeys, holdingsItemsIndexKeys);
        }
        if (should(Feature.HOLDINGS_STATS)) {
            addHoldingsStats(indexKeys, source);
        }
        if (should(Feature.PART_OF_DANBIB)) {
            addPartOfDanbib(indexKeys, source.partOfDanbib, source);
        }
        if (should(Feature.COLLECTION_IDENTIFIER_800000)) {
            if (libraryRuleProvider == null) {
                log.error("Feature '{}' is enabled but not configured", Feature.COLLECTION_IDENTIFIER_800000.name());
            } else {
                add800000CollectionIdenitifers(indexKeys, holdingsItemsIndexKeys);
            }
        }
        if (should(Feature.HOLDING_ITEMS_ROLE)) {
            if (libraryRuleProvider == null) {
                log.error("Feature '{}' is enabled but not configured", Feature.HOLDING_ITEMS_ROLE.name());
            } else {
                addHoldingsItemsRole(indexKeys, holdingsItemsIndexKeys, source);
            }
        }
        if (should(Feature.ATTACH_RESOURCES)) {
            addResources(indexKeys, source.attachedResources, source.bibliographicRecord.agencyId);
        }
        if (should(Feature.SCAN)) {
            if (profileProvider == null) {
                log.error("Feature '{}' is enabled but not configured", Feature.SCAN.name());
            } else {
                addScan(indexKeys, holdingsItemsIndexKeys);
            }
        }
        if (should(Feature.PERSISTENT_WORK_ID)) {
            if (persistentWorkIdProvider == null) {
                log.error("Feature '{}' is enabled but not configured", Feature.PERSISTENT_WORK_ID.name());
            } else {
                addPersistentWorkId(indexKeys, source);
            }
        }
        return solrDocument(indexKeys, holdingsItemsIndexKeys);
    }

    private void addType(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeysList) {
        indexKeys.put("t", Collections.singletonList("m"));
        holdingsItemsIndexKeysList.values().stream()
                .flatMap(Collection::stream)
                .forEach(i -> i.put("t", Collections.singletonList("h")));
    }

    private void add800000CollectionIdenitifers(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeysList) {
        if (excludeFromUnionCatalogue(indexKeys)) {
            return;
        }
        List<String> collectionIdentifiers = indexKeys.computeIfAbsent(REC_COLLECTION_IDENTIFIER_FIELD, list());
        boolean hasBibDk = collectionIdentifiers.contains("800000-bibdk");
        boolean hasDanbib = collectionIdentifiers.contains("800000-danbib");
        boolean shouldHaveBibDk = hasBibDk;
        boolean shouldHaveDanbib = hasDanbib;

        for (String agencyId : extractHoldingsAgencies(holdingsItemsIndexKeysList)) {
            if (shouldHaveBibDk && shouldHaveDanbib)
                break;
            VipCoreLibraryRule libraryRules = libraryRuleProvider.libraryRulesFor(agencyId);
            if (libraryRules.isResearchLibrary() &&
                libraryRules.useHoldingsItem()) {
                shouldHaveBibDk = shouldHaveBibDk || libraryRules.isPartOfBibdk();
                shouldHaveDanbib = shouldHaveDanbib || libraryRules.isPartOfDanbib();
            }
        }
        if (shouldHaveBibDk && !hasBibDk) {
            log.trace("adding 800000-bibdk");
            collectionIdentifiers.add("800000-bibdk");
        }
        if (shouldHaveDanbib && !hasDanbib) {
            log.trace("adding 800000-danbib");
            collectionIdentifiers.add("800000-danbib");
        }
    }

    private void addHoldingsAgency(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeysList) {
        Set<String> agencyIds = extractHoldingsAgencies(holdingsItemsIndexKeysList);
        if (!agencyIds.isEmpty()) {
            log.trace("adding " + REC_HOLDINGS_AGENCY_ID + ": {}", agencyIds);
            indexKeys.computeIfAbsent(REC_HOLDINGS_AGENCY_ID, list())
                    .addAll(agencyIds);
        }
    }

    private void addHoldingsItemsRole(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeys, SolrDocStoreResponse source) {
        boolean excludeFromUnionCatalogue = excludeFromUnionCatalogue(indexKeys);
        boolean commonRecord = source.bibliographicRecord.repositoryId.startsWith(COMMON_RECORD_ID_PREFIX);
        holdingsItemsIndexKeys.forEach((agencyId, hiIndexKeys) -> {
            VipCoreLibraryRule libraryRules = libraryRuleProvider.libraryRulesFor(agencyId);
            boolean authCreateComonRecord = libraryRules.authCreateComonRecord();
            if (shouldAddholdingsItemRole(libraryRules.isPartOfBibdk(), excludeFromUnionCatalogue, authCreateComonRecord, commonRecord)) {
                hiIndexKeys.forEach(hi -> hi.computeIfAbsent(HOLDINGSITEM_ROLE, list()).add("bibdk"));
            }
            if (shouldAddholdingsItemRole(libraryRules.isPartOfDanbib(), excludeFromUnionCatalogue, authCreateComonRecord, commonRecord)) {
                hiIndexKeys.forEach(hi -> hi.computeIfAbsent(HOLDINGSITEM_ROLE, list()).add("danbib"));
            }
        });
    }

    private boolean shouldAddholdingsItemRole(boolean partOf, boolean excludeFromUnionCatalogue,
                                              boolean authCreateCommonRecord, boolean commonRecord) {
        return ( partOf && !excludeFromUnionCatalogue ||
                 !partOf && authCreateCommonRecord && commonRecord );
    }

    private void addHoldingsStats(Map<String, List<String>> indexKeys, SolrDocStoreResponse source) {
        int onShelf = source.totalStatusCount.getOrDefault("onshelf", 0);
        int onLoan = source.totalStatusCount.getOrDefault("onloan", 0);
        int totalForLoan = onShelf + onLoan;
        indexKeys.computeIfAbsent(REC_HOLDINGS_COUNT, list()).add(String.valueOf(totalForLoan));
        indexKeys.computeIfAbsent(REC_HOLDINGS_ON_LOAN, list()).add(String.valueOf((float) onLoan / (float) totalForLoan));
    }

    private void addPartOfDanbib(Map<String, List<String>> indexKeys, List<Integer> partOfDanbib, SolrDocStoreResponse source) {
        if (source.bibliographicRecord.repositoryId.startsWith(COMMON_RECORD_ID_PREFIX)) {
            List<String> ln = indexKeys.computeIfAbsent("dkcclterm.ln", list());
            partOfDanbib.forEach(agencyId -> ln.add(String.valueOf(agencyId)));
        }
    }

    private void addPersistentWorkId(Map<String, List<String>> indexKeys, SolrDocStoreResponse source) {
        String corepoWorkId = source.bibliographicRecord.work;
        if (corepoWorkId == null)
            throw new IllegalStateException("Cannot add persistent-work-id, since no corepo-work-id is present");
        String persistentWorkId = persistentWorkIdProvider.persistentWorkIdFor(corepoWorkId);
        log.trace("setting " + REC_PERSISTENT_WORK_ID + " to {}", persistentWorkId);
        indexKeys.put(REC_PERSISTENT_WORK_ID, Collections.singletonList(persistentWorkId));
    }

    private void addResources(Map<String, List<String>> indexKeys, Map<String, Map<Integer, Boolean>> resources, int agencyId) {
        resources.forEach((resourceName, owners) -> {
            boolean add;
            switch (resourceName) {
                case "hasCoverUrl": // Anyone has
                    add = owners.values().contains(Boolean.TRUE);
                    break;
                default:
                    add = owners.getOrDefault(agencyId, false);
                    break;
            }
            if (add) {
                indexKeys.computeIfAbsent("rec." + resourceName, list())
                        .add("true");
            }
        });
    }

    private void addScan(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeys) {
        addScanAny(indexKeys);
        addScanDefault(indexKeys);
        addScanProfiles(indexKeys, holdingsItemsIndexKeys);
    }

    private void addScanAny(Map<String, List<String>> indexKeys) {
        Set<String> anyKeys = indexKeys.keySet().stream()
                .filter(s -> s.startsWith("scan."))
                .filter(s -> !s.contains("_"))
                .map(indexKeys::get)
                .flatMap(Collection::stream)
                .collect(toSet());
        if (!anyKeys.isEmpty()) {
            indexKeys.put("scan.any", new ArrayList<>(anyKeys));
        }
    }

    private void addScanDefault(Map<String, List<String>> indexKeys) {
        Set<String> anyKeys = indexKeys.keySet().stream()
                .filter(scanDefaultFields::contains)
                .map(indexKeys::get)
                .flatMap(Collection::stream)
                .collect(toSet());
        if (!anyKeys.isEmpty()) {
            indexKeys.put("scan.default", new ArrayList<>(anyKeys));
        }
    }

    private void addScanProfiles(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeys) {
        List<String> fieldNames = indexKeys.keySet().stream()
                .filter(s -> s.startsWith("scan."))
                .filter(s -> !s.contains("_"))
                .collect(toList());

        Set<String> collectionIdentifiers = new HashSet<>(indexKeys.getOrDefault(REC_COLLECTION_IDENTIFIER_FIELD, EMPTY_LIST));
        Set<String> holdingsAgencies = extractHoldingsAgencies(holdingsItemsIndexKeys);

        if (!fieldNames.isEmpty()) {
            scanAgencyProfiles.forEach((agencyId, profiles) -> {
                profiles.forEach(profile -> {
                    if (shouldAddScanForProfile(agencyId, profile, collectionIdentifiers, holdingsAgencies)) {
                        fieldNames.forEach(fieldName -> {
                            indexKeys.put(String.join("_", fieldName, agencyId, profile), indexKeys.get(fieldName));
                        });
                    }
                });
            });
        }
    }

    private boolean shouldAddScanForProfile(String agencyId, String profile, Set<String> collectionIdentifiers, Set<String> holdingsAgencies) {
        VipCoreProfile profileRules = profileProvider.profileFor(agencyId, profile);
        log.debug("agencyId = {}; profile = {}; profileRules = {}", agencyId, profile, profileRules);
        if (profileRules.hasIncludeOwnHoldings() && holdingsAgencies.contains(agencyId))
            return true;
        return profileRules.getCollectionIdentifiers().stream()
                .anyMatch(collectionIdentifiers::contains);
    }

    private boolean should(Feature feature) {
        return featureSwitch.shound(feature);
    }

    private static <T, R> Function<T, List<R>> list() {
        return x -> new ArrayList<>();
    }

    private static Map<String, Set<String>> profilesMapFrom(String profiles) {
        return Stream.of(profiles.split("(?:,|\\s)+"))
                .filter(s -> !s.isEmpty())
                .map(s -> s.split("-", 2))
                .collect(groupingBy(a -> a[0],
                                    mapping(a -> a[1], toSet())));
    }

    private static Set<String> defaultFieldsFrom(String fields) {
        return Stream.of(fields.split("(?:,|\\s)+"))
                .filter(s -> !s.isEmpty())
                .collect(toSet());
    }

    private static boolean excludeFromUnionCatalogue(Map<String, List<String>> indexKeys) {
        return indexKeys.getOrDefault(REC_EXCLUDE_FROM_UNION_CATALOGUE, EMPTY_LIST).contains("true");
    }

    private static Set<String> extractHoldingsAgencies(Map<String, List<Map<String, List<String>>>> holdingsItemsIndexKeysList) {
        return holdingsItemsIndexKeysList.entrySet().stream()
                .filter(e -> !e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(toSet());
    }

    public SolrDocument solrDocument(Map<String, List<String>> indexKeys, Map<String, List<Map<String, List<String>>>> holdingsIndexKeys) {
        SolrDocument solrDocument = indexKeysToSolrDocument(indexKeys);
        holdingsIndexKeys.entrySet().stream()
                .sorted(Map.Entry.comparingByKey()) // In order for easyunittest
                .map(Map.Entry::getValue)
                .flatMap(Collection::stream)
                .map(this::indexKeysToSolrDocument)
                .forEach(solrDocument::addChildDocument);
        return solrDocument;
    }

    private SolrDocument indexKeysToSolrDocument(Map<String, List<String>> indexKeys) {
        SolrDocument solrDocument = new SolrDocument();
        indexKeys.forEach((k, vs) -> {
            if (knownSolrFields.isKnownField(k)) {
                solrDocument.addField(k, trimFieldLengths(vs));
            }
        });
        return solrDocument;
    }

    private static List<String> trimFieldLengths(List<String> values) {
        return values.stream()
                .map(text -> {
                    if (text.length() > MAX_SOLR_FIELD_VALUE_SIZE) {
                        int pos = text.lastIndexOf(' ', MAX_SOLR_FIELD_VALUE_SIZE);
                        if (pos <= 0) {
                            pos = MAX_SOLR_FIELD_VALUE_SIZE;
                        }
                        text = text.substring(0, pos);
                    }
                    return text;
                })
                .collect(toList());
    }

    private static void addIdToSolrDocument(String rootId, SolrDocument doc) {
        doc.setField("id", rootId);
        if (doc.hasChildDocuments()) {
            int i = 0;
            for (SolrDocument child : doc.getChildDocuments()) {
                addIdToSolrDocument(rootId + "#" + i++, child);
            }
        }
    }
}
