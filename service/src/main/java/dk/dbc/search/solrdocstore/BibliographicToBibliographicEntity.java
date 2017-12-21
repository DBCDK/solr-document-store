package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "BibliographicToBibliographic")
public class BibliographicToBibliographicEntity implements Serializable {

    private static final long serialVersionUID = -4000756841976185211L;

    @Id
    public String deadBibliograohicRecordId;

    public String liveBibliographicRecordId;
}
