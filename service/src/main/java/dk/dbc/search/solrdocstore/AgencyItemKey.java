package dk.dbc.search.solrdocstore;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AgencyItemKey implements Serializable {

    private static final long serialVersionUID = -2054293971622143423L;

    public int agencyId;
    public String bibliographicRecordId;

    public AgencyItemKey() {
    }

    AgencyItemKey(int agencyId, String bibliographicRecordId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
    }

    public AgencyItemKey withAgencyId(int agencyId) {
        this.agencyId = agencyId;
        return this;
    }

    public AgencyItemKey withBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
        return this;
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
}
