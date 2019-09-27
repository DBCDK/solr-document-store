package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "BibliographicToBibliographic")
public class BibliographicToBibliographicEntity implements Serializable {

    private static final long serialVersionUID = -4000756841976185211L;

    @Id
    private String deadBibliographicRecordId;

    private String liveBibliographicRecordId;

    public BibliographicToBibliographicEntity() {
    }

    public BibliographicToBibliographicEntity(String deadBibliographicRecordId, String liveBibliographicRecordId) {
        this.deadBibliographicRecordId = deadBibliographicRecordId;
        this.liveBibliographicRecordId = liveBibliographicRecordId;
    }

    public String getLiveBibliographicRecordId() {
        return liveBibliographicRecordId;
    }

    public void setLiveBibliographicRecordId(String liveBibliographicRecordId) {
        this.liveBibliographicRecordId = liveBibliographicRecordId;
    }

    public String getDeadBibliographicRecordId() {
        return deadBibliographicRecordId;
    }

    public void setDeadBibliographicRecordId(String deadBibliographicRecordId) {
        this.deadBibliographicRecordId = deadBibliographicRecordId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.deadBibliographicRecordId,
                            this.liveBibliographicRecordId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final BibliographicToBibliographicEntity other = (BibliographicToBibliographicEntity) obj;
        return Objects.equals(this.deadBibliographicRecordId, other.deadBibliographicRecordId) &&
               Objects.equals(this.liveBibliographicRecordId, other.liveBibliographicRecordId);
    }

    @Override
    public String toString() {
        return "BibliographicToBibliographicEntity{" + "deadBibliographicRecordId=" + deadBibliographicRecordId + ", liveBibliographicRecordId=" + liveBibliographicRecordId + '}';
    }

}
