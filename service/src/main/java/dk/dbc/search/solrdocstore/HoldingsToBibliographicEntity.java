package dk.dbc.search.solrdocstore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "holdingsToBibliographic")
@IdClass(HoldingsToBibliographicKey.class)
public class HoldingsToBibliographicEntity implements Serializable {

    private static final long serialVersionUID = -6441410794836406593L;

    @Id
    public int holdingsAgencyId;
    @Id
    public String holdingsBibliographicRecordId;

    public String bibliographicRecordId;
    public int bibliographicAgencyId;

    public HoldingsToBibliographicEntity() {
    }

    HoldingsToBibliographicEntity(int holdingsAgencyId, String bibliographicRecordId, int bibliographicAgencyId) {
        this(holdingsAgencyId,bibliographicRecordId, bibliographicAgencyId, bibliographicRecordId);
    }

    public HoldingsToBibliographicEntity(int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId, String bibliographicRecordId) {
        this.holdingsAgencyId = holdingsAgencyId;
        this.holdingsBibliographicRecordId = holdingsBibliographicRecordId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.bibliographicAgencyId = bibliographicAgencyId;
    }

    @Override
    public String toString() {
        return "HoldingsToBibliographicEntity{" +
                "holdingsAgencyId=" + holdingsAgencyId +
                ", holdingsBibliographicRecordId='" + holdingsBibliographicRecordId + '\'' +
                ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
                ", bibliographicAgencyId=" + bibliographicAgencyId +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HoldingsToBibliographicEntity that = (HoldingsToBibliographicEntity) o;
        return holdingsAgencyId == that.holdingsAgencyId &&
                bibliographicAgencyId == that.bibliographicAgencyId &&
                Objects.equals(holdingsBibliographicRecordId, that.holdingsBibliographicRecordId) &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(holdingsAgencyId, holdingsBibliographicRecordId, bibliographicRecordId, bibliographicAgencyId);
    }

    public HoldingsToBibliographicKey asKey() {
        return new HoldingsToBibliographicKey(holdingsAgencyId,holdingsBibliographicRecordId);
    }
}