package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.jakarta.xmlbind.JakartaXmlBindAnnotationModule;
import dk.dbc.holdingsitemsdocuments.bindings.HoldingsItemsDocuments;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import dk.dbc.search.solrdocstore.request.AddResourceRequest;
import dk.dbc.search.solrdocstore.request.HoldingsItemIndexKeysRequest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

public class Doc {

    public static final ObjectMapper O = new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .registerModule(new JakartaXmlBindAnnotationModule())
            .registerModule(new JavaTimeModule());

    public static interface EntityProvider {

        Object entity();
    }

    private Doc() {
    }

    public static BibliographicEntityBuilder bibliographic(String bibliographicRecordId) {
        return new BibliographicEntityBuilder(bibliographicRecordId);
    }

    public static BibliographicEntityBuilder bibliographic(int agencyId, String bibliographicRecordId) {
        return new BibliographicEntityBuilder(agencyId, bibliographicRecordId);
    }

    public static HoldingsItemsDocumentsBuilder holdingsItem(int agencyId, String bibliographicRecordId) {
        return new HoldingsItemsDocumentsBuilder(agencyId, bibliographicRecordId);
    }

    public static AddResourceRequestBuilder resource(int agencyId, String bibliographicRecordId) {
        return new AddResourceRequestBuilder(agencyId, bibliographicRecordId);
    }

    public static String indexKeysRequest(Consumer<HoldingsItemsIndexKeysBuilder> filler) {
        HoldingsItemsIndexKeysBuilder obj = new HoldingsItemsIndexKeysBuilder();
        filler.accept(obj);
        HoldingsItemIndexKeysRequest req = new HoldingsItemIndexKeysRequest(IndexKeysList.from(obj.getIndexKeys().stream().map(IndexKeys::from).collect(Collectors.toList())));
        try {
            return O.writeValueAsString(req);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static class BibliographicEntityBuilder implements EntityProvider {

        private final BibliographicEntity entity;

        private BibliographicEntityBuilder(String bibliographicRecordId) {
            entity = makeEntity(870970, "basis", bibliographicRecordId);
        }

        private BibliographicEntityBuilder(int agencyId, String bibliographicRecordId) {
            entity = makeEntity(agencyId, "katalog", bibliographicRecordId);
        }

        private static BibliographicEntity makeEntity(int agencyId, String classifier, String bibliographicRecordId) {
            BibliographicEntity entity = new BibliographicEntity();
            entity.setAgencyId(agencyId);
            entity.setClassifier(classifier);
            entity.setBibliographicRecordId(bibliographicRecordId);
            entity.setRepositoryId(agencyId + "-" + classifier + ":" + bibliographicRecordId);
            entity.setDeleted(false);
            entity.setTrackingId("n/a");
            entity.setUnit("unit:1");
            entity.setWork("work:1");
            return entity;
        }

        public BibliographicEntityBuilder commonRepositoryId() {
            entity.setRepositoryId("870970-basis:" + entity.getBibliographicRecordId());
            return this;
        }

        public BibliographicEntityBuilder classifier(String classifier) {
            entity.setClassifier(classifier);
            entity.setRepositoryId(entity.getAgencyId() + "-" + classifier + ":" + entity.getBibliographicRecordId());
            return this;
        }

        public BibliographicEntityBuilder deleted() {
            entity.setDeleted(true);
            entity.setUnit(null);
            entity.setWork(null);
            return this;
        }

        public BibliographicEntityBuilder trackingId(String trackingId) {
            entity.setTrackingId(trackingId);
            return this;
        }

        public BibliographicEntityBuilder unit(String unit) {
            entity.setUnit(unit);
            return this;
        }

        public BibliographicEntityBuilder work(String work) {
            entity.setWork(work);
            return this;
        }


        public BibliographicEntityBuilder indexKeys(String json) throws JsonProcessingException {
            JsonNode tree = O
                    .enable(JsonParser.Feature.ALLOW_SINGLE_QUOTES,
                            JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES)
                    .readTree(json);
            if (!tree.isObject()) 
                throw new IllegalStateException("indexKeys should be an object");
            HashMap<String, List<String>> indeKeys = new HashMap<>();
            tree.fields().forEachRemaining(e -> {
                List<String> list = indeKeys.computeIfAbsent(e.getKey(), k -> new ArrayList<>());
                JsonNode value = e.getValue();
                if (value.isArray()) {
                    value.forEach(v -> {
                        if (v.isObject() || v.isArray() || v.isNull()) {
                            throw new IllegalStateException("Nested values should be arrays of primitives");
                        }
                        list.add(v.asText());
                    });
                } else if (value.isObject()) {
                    throw new IllegalStateException("Nested values should be in arrays");
                } else {
                    list.add(value.asText());
                }
            });
            entity.setIndexKeys(IndexKeys.from(indeKeys));
            return this;
        }

        public BibliographicEntityBuilder indexKeys(Consumer<IndexKeysBuilder> filler) {
            IndexKeysBuilder indexKeysBuilder = new IndexKeysBuilder();
            filler.accept(indexKeysBuilder);
            entity.setIndexKeys(IndexKeys.from(indexKeysBuilder.indexKeys));
            return this;
        }

        public BibliographicEntity build() {
            if (entity.getIndexKeys() == null && !entity.isDeleted())
                throw new IllegalStateException("Use .indexKeys()/.delete()");
            return entity;
        }

        @Override
        public Object entity() {
            return build();
        }

        public String json() {
            try {
                return O.writeValueAsString(build());
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    public static class HoldingsItemsIndexKeysBuilder {

        private final List<Map<String, List<String>>> indexKeys;

        protected HoldingsItemsIndexKeysBuilder() {
            indexKeys = new ArrayList<>();
        }

        public HoldingsItemsIndexKeysBuilder addHolding(Consumer<HoldingsItemsIndexKeys> filler) {
            HoldingsItemsIndexKeys indexKeysBuilder = new HoldingsItemsIndexKeys();
            filler.accept(indexKeysBuilder);
            indexKeys.add(indexKeysBuilder.indexKeys);
            return this;
        }

        public final List<Map<String, List<String>>> getIndexKeys() {
            return indexKeys;
        }
    }

    public static class HoldingsItemsDocumentsBuilder extends HoldingsItemsIndexKeysBuilder implements EntityProvider {

        private final HoldingsItemsDocuments entity;

        private HoldingsItemsDocumentsBuilder(int agencyId, String bibliographicRecordId) {
            entity = new HoldingsItemsDocuments();
            entity.setAgencyId(agencyId);
            entity.setBibliographicRecordId(bibliographicRecordId);
            entity.setModified(Instant.now());
            entity.setDocuments(getIndexKeys());
        }

        public HoldingsItemsDocumentsBuilder modified(Instant modified) {
            entity.setModified(modified);
            return this;
        }

        @Override
        public HoldingsItemsDocumentsBuilder addHolding(Consumer<HoldingsItemsIndexKeys> filler) {
            super.addHolding(filler);
            return this;
        }

        public HoldingsItemsDocuments build() {
            return entity;
        }

        @Override
        public HoldingsItemEntity entity() {
            return HoldingsItemEntity.from(build());
        }

        public String json() {
            try {
                return O.writeValueAsString(build());
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    public static class AddResourceRequestBuilder implements EntityProvider {

        private final AddResourceRequest entity;

        public AddResourceRequestBuilder(int agencyId, String bibliographicRecordId) {
            entity = new AddResourceRequest();
            entity.setAgencyId(agencyId);
            entity.setBibliographicRecordId(bibliographicRecordId);
            entity.setValue(true);
        }

        public AddResourceRequestBuilder hasNot() {
            entity.setValue(false);
            return this;
        }

        public AddResourceRequestBuilder field(String field) {
            entity.setField(field);
            return this;
        }

        public AddResourceRequest build() {
            return entity;
        }

        @Override
        public BibliographicResourceEntity entity() {
            return build().asBibliographicResource();
        }

        public String json() {
            try {
                return O.writeValueAsString(build());
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }

    }

    public static class IndexKeysBuilder {

        protected final Map<String, List<String>> indexKeys;

        private IndexKeysBuilder() {
            indexKeys = new HashMap<>();
        }

        public IndexKeysBuilder add(String key, String value) {
            indexKeys.computeIfAbsent(key, k -> new ArrayList<>())
                    .add(value);
            return this;
        }
    }

    public static class HoldingsItemsIndexKeys extends IndexKeysBuilder {

        public HoldingsItemsIndexKeys add(String key, String value) {
            return (HoldingsItemsIndexKeys) super.add(key, value);
        }

        private HoldingsItemsIndexKeys set(String key, String... vals) {
            indexKeys.put(key, List.of(vals));
            return this;
        }

        public final HoldingsItemsIndexKeys accessionDate(String... vals) {
            return set("holdingsitem.accessionDate", vals);
        }

        public final HoldingsItemsIndexKeys agencyId(String... vals) {
            return set("holdingsitem.agencyId", vals);
        }

        public final HoldingsItemsIndexKeys bibliographicRecordId(String... vals) {
            return set("holdingsitem.bibliographicRecordId", vals);
        }

        public final HoldingsItemsIndexKeys branch(String... vals) {
            return set("holdingsitem.branch", vals);
        }

        public final HoldingsItemsIndexKeys branchId(String... vals) {
            return set("holdingsitem.branchId", vals);
        }

        public final HoldingsItemsIndexKeys circulationRule(String... vals) {
            return set("holdingsitem.circulationRule", vals);
        }

        public final HoldingsItemsIndexKeys collection(String... vals) {
            return set("holdingsitem.collection", vals);
        }

        public final HoldingsItemsIndexKeys created(String... vals) {
            return set("holdingsitem.created", vals);
        }

        public final HoldingsItemsIndexKeys department(String... vals) {
            return set("holdingsitem.department", vals);
        }

        public final HoldingsItemsIndexKeys issueId(String... vals) {
            return set("holdingsitem.issueId", vals);
        }

        public final HoldingsItemsIndexKeys itemId(String... vals) {
            return set("holdingsitem.itemId", vals);
        }

        public final HoldingsItemsIndexKeys loanRestriction(String... vals) {
            return set("holdingsitem.loanRestriction", vals);
        }

        public final HoldingsItemsIndexKeys location(String... vals) {
            return set("holdingsitem.location", vals);
        }

        public final HoldingsItemsIndexKeys modified(String... vals) {
            return set("holdingsitem.modified", vals);
        }

        public final HoldingsItemsIndexKeys status(String... vals) {
            return set("holdingsitem.status", vals);
        }

        public final HoldingsItemsIndexKeys subLocation(String... vals) {
            return set("holdingsitem.subLocation", vals);
        }
    }
}
