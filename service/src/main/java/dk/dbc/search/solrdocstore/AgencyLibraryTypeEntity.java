package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "AgencyLibraryType")
public class AgencyLibraryTypeEntity implements Serializable {

    @Id
    public int agencyId;

    public String libraryType;

}
