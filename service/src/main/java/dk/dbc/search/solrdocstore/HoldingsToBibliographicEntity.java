package dk.dbc.search.solrdocstore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

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
}
