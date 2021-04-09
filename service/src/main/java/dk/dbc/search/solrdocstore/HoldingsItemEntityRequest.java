package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import java.util.List;
import java.util.Map;

public class HoldingsItemEntityRequest extends HoldingsItemEntity {

    private static final long serialVersionUID = 1991771211227276502L;

    public HoldingsItemEntityRequest() {
    }

    public HoldingsItemEntityRequest(int agencyId, String bibliographicRecordId, List<Map<String, List<String>>> indexKeys, String trackingId) {
        super(agencyId, bibliographicRecordId, indexKeys, trackingId);
    }

    public void setProducerVersion(String producerVersion) {
    }
}
