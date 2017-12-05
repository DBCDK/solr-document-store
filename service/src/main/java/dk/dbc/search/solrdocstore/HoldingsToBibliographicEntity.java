package dk.dbc.search.solrdocstore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "holdingsToBibliographic")
@IdClass(AgencyItemKey.class)
public class HoldingsToBibliographicEntity {
    @Id
    @Column(name = "holdingsAgencyId")
    public int agencyId;
    @Id
    public String bibliographicRecordId;
    public int bibliographicAgencyId;

    public HoldingsToBibliographicEntity() {
    }

    HoldingsToBibliographicEntity(int agencyId, String bibliographicRecordId, int bibliographicAgencyId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.bibliographicAgencyId = bibliographicAgencyId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HoldingsToBibliographicEntity that = (HoldingsToBibliographicEntity) o;
        return agencyId == that.agencyId &&
                bibliographicAgencyId == that.bibliographicAgencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(agencyId, bibliographicRecordId, bibliographicAgencyId);
    }

    @Override
    public String toString() {
        return "HoldingsToBibliographicEntity{" +
                "agencyId=" + agencyId +
                ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
                ", bibliographicAgencyId=" + bibliographicAgencyId +
                '}';
    }
}
