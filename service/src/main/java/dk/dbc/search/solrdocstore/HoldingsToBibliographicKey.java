package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import java.util.Objects;

public class HoldingsToBibliographicKey implements Serializable {
    private static final long serialVersionUID = -2054293971622143423L;

    public int holdingsAgencyId;
    public String bibliographicRecordId;

    public HoldingsToBibliographicKey() {
    }

    public HoldingsToBibliographicKey(int holdingsAgencyId, String bibliographicRecordId) {
        this.holdingsAgencyId = holdingsAgencyId;
        this.bibliographicRecordId = bibliographicRecordId;
    }
    public HoldingsToBibliographicKey withHoldingAgencyId(int agencyId){
        this.holdingsAgencyId = agencyId;
        return this;
    }
    public HoldingsToBibliographicKey withHoldingsBibliographicRecordId(String bibliographicRecordId){
        this.bibliographicRecordId = bibliographicRecordId;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HoldingsToBibliographicKey that = (HoldingsToBibliographicKey) o;
        return holdingsAgencyId == that.holdingsAgencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId);
    }

    @Override
    public int hashCode() {

        return Objects.hash(holdingsAgencyId, bibliographicRecordId);
    }
}
