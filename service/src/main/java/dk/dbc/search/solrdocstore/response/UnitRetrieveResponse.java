package dk.dbc.search.solrdocstore.response;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.util.List;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class UnitRetrieveResponse {

    public final String unitId;
    public final List<DocumentRetrieveResponse> manifestations;

    public UnitRetrieveResponse(String unitId, List<DocumentRetrieveResponse> manifestations) {
        this.unitId = unitId;
        this.manifestations = manifestations;
    }
}
