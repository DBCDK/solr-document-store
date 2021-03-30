package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class HoldingsItemEntityRequest extends HoldingsItemEntity {

    private static final long serialVersionUID = 1991771211227276502L;

    // commitWithin is unused - however the skeleton for sending optional
    // extra fields remains present, for the upcoming removal af producerVersion
    // Where it is removed from the database - but not from the request
    private Integer commitWithin;

    public HoldingsItemEntityRequest() {
    }

    public HoldingsItemEntityRequest(int agencyId, String bibliographicRecordId, String producerVersion, List<Map<String, List<String>>> indexKeys, String trackingId, Integer commitWithin) {
        super(agencyId, bibliographicRecordId, producerVersion, indexKeys, trackingId);
        this.commitWithin = commitWithin;
    }

    public Integer getCommitWithin() {
        return commitWithin;
    }

    public void setCommitWithin(Integer commitWithin) {
        this.commitWithin = commitWithin;
    }

    @Override
    public int hashCode() {
        int hash = super.hashCode();
        hash = 89 * hash + Objects.hashCode(this.commitWithin);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final HoldingsItemEntityRequest other = (HoldingsItemEntityRequest) obj;
        return super.equals(obj) &&
               Objects.equals(this.commitWithin, other.commitWithin);
    }

}
