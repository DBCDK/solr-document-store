package dk.dbc.search.solrdocstore.jpa;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AgencyItemKey implements Serializable {

    private static final long serialVersionUID = -2054293971622143423L;

    private int agencyId;
    private String bibliographicRecordId;

    public AgencyItemKey() {
    }

    public AgencyItemKey(int agencyId, String bibliographicRecordId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 43 * hash + this.agencyId;
        hash = 43 * hash + Objects.hashCode(this.bibliographicRecordId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final AgencyItemKey other = (AgencyItemKey) obj;
        if (this.agencyId != other.agencyId) {
            return false;
        }
        if (!Objects.equals(this.bibliographicRecordId, other.bibliographicRecordId)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "AgencyItemKey{" +
               "agencyId=" + agencyId +
               ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
               '}';
    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }
}
