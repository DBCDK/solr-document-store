package dk.dbc.search.solrdocstore;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
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

    private boolean partOfBibDk;

    private boolean authCreateCommonRecord;

    private Timestamp fetched;

    private boolean valid;

    public OpenAgencyEntity() {
    }

    public OpenAgencyEntity(int agencyId, LibraryType libraryType, boolean authCreateCommonRecord, boolean partOfBibDk, boolean partOfDanbib) {
        this.agencyId = agencyId;
        this.libraryType = libraryType;
        this.authCreateCommonRecord = authCreateCommonRecord;
        this.partOfBibDk = partOfBibDk;
        this.partOfDanbib = partOfDanbib;
        this.fetched = Timestamp.from(Instant.now());
        this.valid = true;
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

    public boolean getPartOfBibDk() {
        return partOfBibDk;
    }

    public void setPartOfBibDk(boolean partOfBibDk) {
        this.partOfBibDk = partOfBibDk;
    }

    public boolean getAuthCreateCommonRecord() {
        return authCreateCommonRecord;
    }

    public void setAuthCreateCommonRecord(boolean authCreateCommonRecord) {
        this.authCreateCommonRecord = authCreateCommonRecord;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public Timestamp getFetched() {
        return fetched;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public void setFetched(Timestamp fetched) {
        this.fetched = fetched;
    }

    public void setFetchedNow() {
        this.fetched = Timestamp.from(Instant.now());
    }

    public long getFetchedAgeMs() {
        return Instant.now().toEpochMilli() - fetched.toInstant().toEpochMilli();
    }

    public boolean getValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 67 * hash + this.agencyId;
        hash = 67 * hash + Objects.hashCode(this.libraryType);
        hash = 67 * hash + ( this.authCreateCommonRecord ? 1 : 0 );
        hash = 67 * hash + ( this.partOfBibDk ? 1 : 0 );
        hash = 67 * hash + ( this.partOfDanbib ? 1 : 0 );
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final OpenAgencyEntity other = (OpenAgencyEntity) obj;
        return this.agencyId == other.agencyId &&
               this.authCreateCommonRecord == other.authCreateCommonRecord &&
               this.partOfBibDk == other.partOfBibDk &&
               this.partOfDanbib == other.partOfDanbib &&
               this.libraryType == other.libraryType;
    }

    @Override
    public String toString() {
        return "OpenAgencyEntity{" + "agencyId=" + agencyId + ", libraryType=" + libraryType + ", partOfDanbib=" + partOfDanbib + ", partOfBibDk=" + partOfBibDk + ", authCreateCommonRecord=" + authCreateCommonRecord + ", fetched=" + fetched + ", valid=" + valid + '}';
    }

}
