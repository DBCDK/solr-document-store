package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Iterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.updater.DocHelpers.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class BusinessLogic {

    private static final Logger log = LoggerFactory.getLogger(BusinessLogic.class);

    static void filterOutDecommissioned(JsonNode sourceDoc) {
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
    static void addRecHoldingsAgencyId(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");

        JsonNode records = find(sourceDoc, "holdingsItemRecords");
        for (JsonNode record : records) {
            JsonNode holdingsIndexKeys = find(record, "indexKeys");
            if (holdingsIndexKeys != null && holdingsIndexKeys.size() > 0) {
                String agency = find(record, "agencyId").asText();
                addField(indexKeys, "rec.holdingsAgencyId", agency);
            }
        }
    }

    /**
     * Include add agencies listed in 'partOfDanbib' in ln field
     *
     * @param sourceDoc entire json from solr-doc-store
     */
    static void addFromPartOfDanbib(JsonNode sourceDoc) {
        JsonNode indexKeys = find(sourceDoc, "bibliographicRecord", "indexKeys");
        JsonNode agencies = find(sourceDoc, "partOfDanbib");
        for (JsonNode agency : agencies) {
            String agencyId = String.format("%06d", agency.asInt());
            addField(indexKeys, "dkcclterm.ln", agencyId);
        }
    }

}
