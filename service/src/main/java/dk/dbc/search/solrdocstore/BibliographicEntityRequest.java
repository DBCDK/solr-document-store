package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class BibliographicEntityRequest extends BibliographicEntity {

    private static final long serialVersionUID = -2569433415434599872L;

    private List<String> superceds;

    public BibliographicEntityRequest() {
    }

    public BibliographicEntityRequest(int agencyId, String classifier, String bibliographicRecordId, String repositoryId, String work, String unit, String producerVersion, boolean deleted, Map<String, List<String>> indexKeys, String trackingId, List<String> superceds) {
        super(agencyId, classifier, bibliographicRecordId, repositoryId, work, unit, producerVersion, deleted, indexKeys, trackingId);
        this.superceds = superceds;
    }

    public List<String> getSuperceds() {
        return superceds;
    }

    public void setSuperceds(List<String> superceds) {
        this.superceds = superceds;
    }

    @Override
    public int hashCode() {
        int hash = super.hashCode();
        hash = 71 * hash + Objects.hashCode(this.superceds);
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
               Objects.equals(this.superceds, other.superceds);
    }

}
