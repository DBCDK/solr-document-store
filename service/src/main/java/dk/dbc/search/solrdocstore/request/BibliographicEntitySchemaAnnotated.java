package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = BibliographicEntitySchemaAnnotated.NAME)
@SuppressFBWarnings(value = "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class BibliographicEntitySchemaAnnotated {

    public static final String NAME = "manifestation";

    @Schema(description = "The agency that has this manifestation",
            required = true)
    public int agencyId;

    @Schema(description = "The classifier for the agency - usually basis or katalog",
            required = true)
    public String classifier;

    @Schema(description = "The identifier for this manifestation",
            required = true)
    public String bibliographicRecordId;

    @Schema(description = "The identifier of the generating document",
            required = true)
    public String repositoryId;

    @Schema(description = "The work this is a part of (should be null if deleted is true)",
            required = false)
    public String work;

    @Schema(description = "The unit this is a part of (should be null if deleted is true)",
            required = false)
    public String unit;

    @Schema(description = "If the manifestation has been deleted",
            required = false)
    public boolean deleted;

    @Schema(description = IndexKeys.DESCRIPTION + " (should be null if deleted is true)",
            required = false)
    public IndexKeys indexKeys;

    @Schema(description = "Tracking for tracing an event through the system",
            required = true)
    public String trackingId;
}
