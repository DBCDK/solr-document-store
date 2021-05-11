package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;

public class HoldingsItemEntityRequest extends HoldingsItemEntity {

    private static final long serialVersionUID = 1991771211227276502L;

    public HoldingsItemEntityRequest() {
    }

    public HoldingsItemEntityRequest(int agencyId, String bibliographicRecordId, IndexKeysList indexKeys, String trackingId) {
        super(agencyId, bibliographicRecordId, indexKeys, trackingId);
    }
}
