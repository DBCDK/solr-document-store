package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "AgencyLibraryType")
public class AgencyLibraryTypeEntity implements Serializable {

    private static final long serialVersionUID = 2352663426617537636L;

    @Id
    private int agencyId;

    private String libraryType;

    public AgencyLibraryTypeEntity() {
    }

    public AgencyLibraryTypeEntity(int agencyId, String libraryType) {
        this.agencyId = agencyId;
        this.libraryType = libraryType;
    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getLibraryType() {
        return libraryType;
    }

    public void setLibraryType(String libraryType) {
        this.libraryType = libraryType;
    }
}
