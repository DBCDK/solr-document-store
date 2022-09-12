package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import dk.dbc.search.solrdocstore.request.HoldingsItemIndexKeysRequest;
import java.util.List;
import java.util.function.Consumer;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingItemIndexKeys {

    private static final ObjectMapper O = new ObjectMapper();

    public static BuildIndexKeysList indexKeysList(int agencyId, String bibliographicRecordId) {
        return new BuildIndexKeysList(agencyId, bibliographicRecordId);
    }

    public static class BuildIndexKeysList {

        private final IndexKeysList indexKeysList = new IndexKeysList();
        private final int agencyId;
        private final String bibliographicRecordId;

        private BuildIndexKeysList(int agencyId, String bibliographicRecordId) {
            this.agencyId = agencyId;
            this.bibliographicRecordId = bibliographicRecordId;
        }

        public BuildIndexKeysList add(Consumer<BuildIndexKeys> b) {
            IndexKeys keys = new IndexKeys();
            indexKeysList.add(keys);
            b.accept(new BuildIndexKeys(keys)
                    .with("rec.bibliographicRecordId", bibliographicRecordId)
                    .agencyId(String.valueOf(agencyId))
                    .bibliographicRecordId(bibliographicRecordId));
            return this;
        }

        public IndexKeysList build() {
            return indexKeysList;
        }

        public String json() throws JsonProcessingException {
            HoldingsItemIndexKeysRequest req = new HoldingsItemIndexKeysRequest(indexKeysList);
            return O.writeValueAsString(req);
        }

    }

    public static class BuildIndexKeys {

        private final IndexKeys indexKeys;

        private BuildIndexKeys(IndexKeys keys) {
            this.indexKeys = keys;
        }

        private BuildIndexKeys with(String key, String... vals) {
            indexKeys.put(key, List.of(vals));
            return this;
        }

        public final BuildIndexKeys accessionDate(String... vals) {
            return with("holdingsitem.accessionDate", vals);
        }

        public final BuildIndexKeys agencyId(String... vals) {
            return with("holdingsitem.agencyId", vals);
        }

        public final BuildIndexKeys bibliographicRecordId(String... vals) {
            return with("holdingsitem.bibliographicRecordId", vals);
        }

        public final BuildIndexKeys branch(String... vals) {
            return with("holdingsitem.branch", vals);
        }

        public final BuildIndexKeys branchId(String... vals) {
            return with("holdingsitem.branchId", vals);
        }

        public final BuildIndexKeys circulationRule(String... vals) {
            return with("holdingsitem.circulationRule", vals);
        }

        public final BuildIndexKeys collection(String... vals) {
            return with("holdingsitem.collection", vals);
        }

        public final BuildIndexKeys created(String... vals) {
            return with("holdingsitem.created", vals);
        }

        public final BuildIndexKeys department(String... vals) {
            return with("holdingsitem.department", vals);
        }

        public final BuildIndexKeys issueId(String... vals) {
            return with("holdingsitem.issueId", vals);
        }

        public final BuildIndexKeys itemId(String... vals) {
            return with("holdingsitem.itemId", vals);
        }

        public final BuildIndexKeys loanRestriction(String... vals) {
            return with("holdingsitem.loanRestriction", vals);
        }

        public final BuildIndexKeys location(String... vals) {
            return with("holdingsitem.location", vals);
        }

        public final BuildIndexKeys modified(String... vals) {
            return with("holdingsitem.modified", vals);
        }

        public final BuildIndexKeys status(String... vals) {
            return with("holdingsitem.status", vals);
        }

        public final BuildIndexKeys subLocation(String... vals) {
            return with("holdingsitem.subLocation", vals);
        }

        public final IndexKeys build() {
            return indexKeys;
        }
    }
}
