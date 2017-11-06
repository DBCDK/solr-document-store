package dk.dbc.search.solrdocstore;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class AgencyItemKey implements Serializable {
    public int agencyId;
    public String bibliographicRecordId;
    
    public AgencyItemKey withAgencyId(int agencyId) {
        this.agencyId = agencyId;
        return this;
    }

    public AgencyItemKey withBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
        return this;
    }
}
