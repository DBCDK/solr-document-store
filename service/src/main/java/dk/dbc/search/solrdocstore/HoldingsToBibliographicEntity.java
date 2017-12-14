package dk.dbc.search.solrdocstore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "holdingsToBibliographic")
@IdClass(HoldingsToBibliographicKey.class)
public class HoldingsToBibliographicEntity {
    @Id
    public int holdingsAgencyId;
    @Id
    public String bibliographicRecordId;
    public int bibliographicAgencyId;

    public HoldingsToBibliographicEntity() {
    }

    HoldingsToBibliographicEntity(int agencyId, String bibliographicRecordId, int bibliographicAgencyId) {
        this.holdingsAgencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.bibliographicAgencyId = bibliographicAgencyId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HoldingsToBibliographicEntity that = (HoldingsToBibliographicEntity) o;
        return holdingsAgencyId == that.holdingsAgencyId &&
                bibliographicAgencyId == that.bibliographicAgencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(holdingsAgencyId, bibliographicRecordId, bibliographicAgencyId);
    }

    @Override
    public String toString() {
        return "HoldingsToBibliographicEntity{" +
                "holdingsAgencyId=" + holdingsAgencyId +
                ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
                ", bibliographicAgencyId=" + bibliographicAgencyId +
                '}';
    }
}
