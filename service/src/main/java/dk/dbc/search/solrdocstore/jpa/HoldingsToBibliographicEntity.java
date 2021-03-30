package dk.dbc.search.solrdocstore.jpa;

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
    private int holdingsAgencyId;
    @Id
    private String holdingsBibliographicRecordId;

    private String bibliographicRecordId;
    private int bibliographicAgencyId;
    private boolean isCommonDerived;

    public HoldingsToBibliographicEntity() {
    }

    public HoldingsToBibliographicEntity(int holdingsAgencyId, String bibliographicRecordId, int bibliographicAgencyId, boolean isCommonDerived) {
        this(holdingsAgencyId, bibliographicRecordId, bibliographicAgencyId, bibliographicRecordId, isCommonDerived);
    }

    public HoldingsToBibliographicEntity(int holdingsAgencyId, String holdingsBibliographicRecordId, int bibliographicAgencyId, String bibliographicRecordId, boolean isCommonDerived) {
        this.holdingsAgencyId = holdingsAgencyId;
        this.holdingsBibliographicRecordId = holdingsBibliographicRecordId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.bibliographicAgencyId = bibliographicAgencyId;
        this.isCommonDerived = isCommonDerived;
    }

    @Override
    public String toString() {
        return "HoldingsToBibliographicEntity{" +
               "holdingsAgencyId=" + holdingsAgencyId +
               ", holdingsBibliographicRecordId='" + holdingsBibliographicRecordId + '\'' +
               ", bibliographicRecordId='" + bibliographicRecordId + '\'' +
               ", bibliographicAgencyId=" + bibliographicAgencyId +
               ", isCommonDerived=" + isCommonDerived +
               '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        HoldingsToBibliographicEntity that = (HoldingsToBibliographicEntity) o;
        return holdingsAgencyId == that.holdingsAgencyId &&
               bibliographicAgencyId == that.bibliographicAgencyId &&
               Objects.equals(holdingsBibliographicRecordId, that.holdingsBibliographicRecordId) &&
               Objects.equals(bibliographicRecordId, that.bibliographicRecordId) &&
               Objects.equals(isCommonDerived, that.isCommonDerived);
    }

    @Override
    public int hashCode() {
        return Objects.hash(holdingsAgencyId, holdingsBibliographicRecordId, bibliographicRecordId, bibliographicAgencyId, isCommonDerived);
    }

    public HoldingsToBibliographicKey asKey() {
        return new HoldingsToBibliographicKey(holdingsAgencyId, holdingsBibliographicRecordId);
    }

    public int getHoldingsAgencyId() {
        return holdingsAgencyId;
    }

    public void setHoldingsAgencyId(int holdingsAgencyId) {
        this.holdingsAgencyId = holdingsAgencyId;
    }

    public String getHoldingsBibliographicRecordId() {
        return holdingsBibliographicRecordId;
    }

    public void setHoldingsBibliographicRecordId(String holdingsBibliographicRecordId) {
        this.holdingsBibliographicRecordId = holdingsBibliographicRecordId;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }

    public int getBibliographicAgencyId() {
        return bibliographicAgencyId;
    }

    public void setBibliographicAgencyId(int bibliographicAgencyId) {
        this.bibliographicAgencyId = bibliographicAgencyId;
    }

    public boolean getIsCommonDerived() {
        return isCommonDerived;
    }

    public void setIsCommonDerived(boolean isCommonDerived) {
        this.isCommonDerived = isCommonDerived;
    }

}
