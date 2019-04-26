package dk.dbc.search.solrdocstore;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class BibliographicEntityRequest extends BibliographicEntity {

    private static final long serialVersionUID = -2569433415434599872L;

    private List<String> superceds;

    private Integer commitWithin;

    public BibliographicEntityRequest() {
    }

    public BibliographicEntityRequest(int agencyId, String classifier, String bibliographicRecordId, String repositoryId, String work, String unit, String producerVersion, boolean deleted, Map<String, List<String>> indexKeys, String trackingId, List<String> superceds, Integer commitWithin) {
        super(agencyId, classifier, bibliographicRecordId, repositoryId, work, unit, producerVersion, deleted, indexKeys, trackingId);
        this.superceds = superceds;
        this.commitWithin = commitWithin;
    }

    public List<String> getSuperceds() {
        return superceds;
    }

    public void setSuperceds(List<String> superceds) {
        this.superceds = superceds;
    }

    public Integer getCommitWithin() {
        return commitWithin;
    }

    public void setCommitWithin(Integer commitWithin) {
        this.commitWithin = commitWithin;
    }

    @Override
    public int hashCode() {
        int hash = super.hashCode();
        hash = 71 * hash + Objects.hashCode(this.superceds);
        hash = 71 * hash + Objects.hashCode(this.commitWithin);
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
               Objects.equals(this.superceds, other.superceds) &&
               Objects.equals(this.commitWithin, other.commitWithin);
    }

}
