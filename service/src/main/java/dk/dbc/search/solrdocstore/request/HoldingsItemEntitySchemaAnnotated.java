package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = HoldingsItemEntitySchemaAnnotated.NAME)
@SuppressFBWarnings(value = "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class HoldingsItemEntitySchemaAnnotated {

    public static final String NAME = "holdings-items";

    @Schema(description = "The agency that owns the holdingsitems")
    public int agencyId;

    @Schema(description = "The item to which these holdingsitems are related")
    public String bibliographicRecordId;

    @Schema(ref = IndexKeysList.NAME)
    public IndexKeysList indexKeys;

    @Schema(description = "A tracking-id for tracing records throughout the system")
    public String trackingId;
}
