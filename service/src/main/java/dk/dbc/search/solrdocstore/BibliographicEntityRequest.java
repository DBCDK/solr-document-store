package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class BibliographicEntityRequest extends BibliographicEntity {

    private static final long serialVersionUID = 0x0651088229508CF7L;

    private List<String> supersedes;

    public BibliographicEntityRequest() {
    }

    public BibliographicEntityRequest(int agencyId, String classifier, String bibliographicRecordId, String repositoryId, String work, String unit, String producerVersion, boolean deleted, Map<String, List<String>> indexKeys, String trackingId, List<String> supersedes) {
        super(agencyId, classifier, bibliographicRecordId, repositoryId, work, unit, producerVersion, deleted, indexKeys, trackingId);
        this.supersedes = supersedes;
    }

    public List<String> getSupersedes() {
        return supersedes;
    }

    public void setSupersedes(List<String> supersedes) {
        this.supersedes = supersedes;
    }

    //@todo remove this when corepo-indexer is deployed with correct spelling
    public List<String> getSuperceds() {
        return supersedes;
    }

    public void setSuperceds(List<String> supersedes) {
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
