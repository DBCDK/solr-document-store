package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "OpenAgencyType")
public class OpenAgencyTypeEntity implements Serializable {

    @Id
    public int agencyId;

    public String libraryType;

}
