package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.IndexKeysList;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemIndexKeysRequest {

    public IndexKeysList indexKeys;

    public HoldingsItemIndexKeysRequest() {
    }

    public HoldingsItemIndexKeysRequest(IndexKeysList indexKeys) {
        this.indexKeys = indexKeys;
    }
}
