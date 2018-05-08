package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
@Table(name = "OpenAgencyCache")
public class OpenAgencyEntity implements Serializable {

    private static final long serialVersionUID = 2352663426617537636L;

    @Id
    private int agencyId;

    @Enumerated(EnumType.STRING)
    private LibraryType libraryType;

    private boolean partOfDanbib;

    private Timestamp fetched;

    public OpenAgencyEntity() {
    }

    public OpenAgencyEntity(int agencyId, LibraryType libraryType, boolean partOfDanbib) {
        this.agencyId = agencyId;
        this.libraryType = libraryType;
        this.partOfDanbib = partOfDanbib;
        this.fetched = Timestamp.from(Instant.now());
    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public LibraryType getLibraryType() {
        return libraryType;
    }

    public void setLibraryType(LibraryType libraryType) {
        this.libraryType = libraryType;
    }

    public boolean getPartOfDanbib() {
        return partOfDanbib;
    }

    public void setPartOfDanbib(boolean partOfDanbib) {
        this.partOfDanbib = partOfDanbib;
    }

    public Timestamp getFetched() {
        return fetched;
    }

    public void setFetched(Timestamp fetched) {
        this.fetched = fetched;
    }

    public void setFetchedNow() {
        this.fetched = Timestamp.from(Instant.now());
    }

    public long getFetchedAgeMs() {
        return Instant.now().toEpochMilli() - fetched.toInstant().toEpochMilli();
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 67 * hash + this.agencyId;
        hash = 67 * hash + Objects.hashCode(this.libraryType);
        hash = 67 * hash + ( this.partOfDanbib ? 1 : 0 );
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final OpenAgencyEntity other = (OpenAgencyEntity) obj;
        if (this.agencyId != other.agencyId) {
            return false;
        }
        if (this.partOfDanbib != other.partOfDanbib) {
            return false;
        }
        if (this.libraryType != other.libraryType) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "OpenAgencyEntity{" + "agencyId=" + agencyId + ", libraryType=" + libraryType + ", partOfDanbib=" + partOfDanbib + '}';
    }

}
