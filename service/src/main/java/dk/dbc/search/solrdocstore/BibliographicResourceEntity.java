package dk.dbc.search.solrdocstore;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Table(name = "resource")
public class BibliographicResourceEntity {
    @Id
    private int agencyId;

    @Id
    private String bibliographicRecordId;

    @Id
    private String field;

    private boolean value;

    public BibliographicResourceEntity(){}

    public BibliographicResourceEntity(int agencyId, String bibliographicRecordId, String field, boolean value){
        this.agencyId = agencyId;
        this.field = field;
        this.bibliographicRecordId = bibliographicRecordId;
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BibliographicResourceEntity that = (BibliographicResourceEntity) o;
        return agencyId == that.agencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId) &&
                Objects.equals(field, that.field);
    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }

    public boolean getValue() {
        return value;
    }

    public void setValue(boolean value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "BibliographicResourceEntity{" + "agencyId=" + agencyId + ", field=" + field + ", bibliographicRecordId=" + bibliographicRecordId + ", value=" + value + '}';
    }


}
