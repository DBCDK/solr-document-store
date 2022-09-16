package dk.dbc.search.solrdocstore.jpa;

import java.io.Serializable;
import java.util.Objects;

public class HoldingsToBibliographicKey implements Serializable {

    private static final long serialVersionUID = -2054293971622143423L;

    private int holdingsAgencyId;
    private String bibliographicRecordId;

    public HoldingsToBibliographicKey() {
    }

    public HoldingsToBibliographicKey(int holdingsAgencyId, String bibliographicRecordId) {
        this.holdingsAgencyId = holdingsAgencyId;
        this.bibliographicRecordId = bibliographicRecordId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        HoldingsToBibliographicKey that = (HoldingsToBibliographicKey) o;
        return holdingsAgencyId == that.holdingsAgencyId &&
               Objects.equals(bibliographicRecordId, that.bibliographicRecordId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(holdingsAgencyId, bibliographicRecordId);
    }

    public int getHoldingsAgencyId() {
        return holdingsAgencyId;
    }

    public void setHoldingsAgencyId(int holdingsAgencyId) {
        this.holdingsAgencyId = holdingsAgencyId;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }
}
