package dk.dbc.search.solrdocstore.response;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.util.List;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class WorkRetrieveResponse {

    public final String workId;
    public final List<DocumentRetrieveResponse> manifestations;

    public WorkRetrieveResponse(String workId, List<DocumentRetrieveResponse> manifestations) {
        this.workId = workId;
        this.manifestations = manifestations;
    }
}
