package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import java.util.Objects;

public class BibliographicEntityRequest extends BibliographicEntity {

    private static final long serialVersionUID = 0x0651088229508CF7L;

    private List<String> supersedes;

    public BibliographicEntityRequest() {
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public BibliographicEntityRequest(int agencyId, String classifier, String bibliographicRecordId, String repositoryId, String work, String unit, boolean deleted, IndexKeys indexKeys, String trackingId, List<String> supersedes) {
        super(agencyId, classifier, bibliographicRecordId, repositoryId, work, unit, deleted, indexKeys, trackingId);
        this.supersedes = supersedes;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public List<String> getSupersedes() {
        return supersedes;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public void setSupersedes(List<String> supersedes) {
        this.supersedes = supersedes;
    }

    @Override
    public int hashCode() {
        int hash = super.hashCode();
        hash = 71 * hash + Objects.hashCode(this.supersedes);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final BibliographicEntityRequest other = (BibliographicEntityRequest) obj;
        return super.equals(obj) &&
               Objects.equals(this.supersedes, other.supersedes);
    }
}
