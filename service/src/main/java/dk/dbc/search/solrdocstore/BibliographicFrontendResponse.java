package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import java.util.Objects;

public class BibliographicFrontendResponse extends BibliographicEntity {

    private String supersedeId;

    BibliographicFrontendResponse(BibliographicEntity b, String liveId) {
        super(b.getAgencyId(), b.getClassifier(), b.getBibliographicRecordId(), b.getRepositoryId(), b.getWork(), b.getUnit(), b.isDeleted(), b.getIndexKeys(), b.getTrackingId());
        supersedeId = liveId;
    }

    public String getSupersedeId() {
        return supersedeId;
    }

    public void setSupersedeId(String supersedeId) {
        this.supersedeId = supersedeId;
    }

    @Override
    public int hashCode() {
        int hash = super.hashCode();
        hash = 97 * hash + Objects.hashCode(this.supersedeId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final BibliographicFrontendResponse other = (BibliographicFrontendResponse) obj;
        return super.equals(obj) &&
               Objects.equals(this.supersedeId, other.supersedeId);
    }

}
