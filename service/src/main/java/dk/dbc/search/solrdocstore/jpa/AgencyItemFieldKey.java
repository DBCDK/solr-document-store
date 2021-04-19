package dk.dbc.search.solrdocstore.jpa;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AgencyItemFieldKey implements Serializable {

    private static final long serialVersionUID = -2054293971622143423L;

    private int agencyId;
    private String bibliographicRecordId;
    private String field;

    public AgencyItemFieldKey() {
    }

    public AgencyItemFieldKey(int agencyId, String bibliographicRecordId, String field) {
        this.agencyId = agencyId;
        this.field = field;
        this.bibliographicRecordId = bibliographicRecordId;
    }


    @Override
    public int hashCode() {
        int hash = 3;
        hash = 43 * hash + this.agencyId;
        hash = 43 * hash + Objects.hashCode(this.bibliographicRecordId);
        hash = 43 * hash + Objects.hashCode(this.field);
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
        final AgencyItemFieldKey other = (AgencyItemFieldKey) obj;
        if (this.agencyId != other.agencyId) {
            return false;
        }
        if (!Objects.equals(this.bibliographicRecordId, other.bibliographicRecordId)) {
            return false;
        }
        if (!Objects.equals(this.field, other.field)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "AgencyBibliographicFieldKey{" +
               "agencyId=" + agencyId +
               ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
               ", field=" + field +
               '}';
    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getClassifier() {
        return field;
    }

    public void setClassifier(String classifier) {
        this.field = classifier;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }
}
