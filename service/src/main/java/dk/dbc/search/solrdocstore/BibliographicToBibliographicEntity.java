package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "BibliographicToBibliographic")
public class BibliographicToBibliographicEntity {
    @Id
    public String oldRecordId;

    public String newRecordId;
}
