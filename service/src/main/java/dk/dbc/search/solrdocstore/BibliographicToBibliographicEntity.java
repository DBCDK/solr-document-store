package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "BibliographicToBibliographic")
public class BibliographicToBibliographicEntity {
    @Id
    public String decommissionedRecordId;

    public String currentRecordId;
}
