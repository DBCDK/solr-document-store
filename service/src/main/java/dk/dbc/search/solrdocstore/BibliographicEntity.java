package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.eclipse.persistence.annotations.Mutable;

@Entity
@Table(name = "bibliographicSolrKeys")
@IdClass(AgencyItemKey.class)
public class BibliographicEntity implements Serializable {

    private static final long serialVersionUID = -2773872842011755768L;

    public BibliographicEntity() {
    }

    @Id
    public int agencyId;

    @Id
    public String bibliographicRecordId;

    public String work;
    public String unit;
    public String producerVersion;
    public boolean deleted;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Mutable
    @Convert(converter = PgMapOfStringsToJsonConverter.class)
    public Map<String, List<String>> indexKeys;

    public String trackingId;

    BibliographicEntity(int agencyId, String bibliographicRecordId, String work, String unit, String producerVersion, boolean deleted, Map<String, List<String>> indexKeys, String trackingId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.work = work;
        this.unit = unit;
        this.producerVersion = producerVersion;
        this.deleted = deleted;
        this.indexKeys = indexKeys;
        this.trackingId = trackingId;
    }

    @Override
    public boolean equals(Object o){
        System.out.println("Am I being called?");
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        System.out.println("Same class?");
        BibliographicEntity that = (BibliographicEntity) o;
        System.out.println(""+this.toString()+" vs. "+o.toString());
        boolean result = agencyId == that.agencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId) &&
                Objects.equals(work, that.work) &&
                Objects.equals(unit, that.unit) &&
                Objects.equals(producerVersion, that.producerVersion) &&
                deleted == that.deleted &&
                Objects.equals(indexKeys,that.indexKeys) &&
                Objects.equals(trackingId, that.trackingId);
        System.out.println("Result: "+result);
        return result;
    }

    /**
     * Ensure the class is of type Entity, if needed make a shallow copy
     *
     * @return self or copy of self
     */
    public BibliographicEntity asBibliographicEntity() {
        if (getClass().equals(BibliographicEntity.class)) {
            return this;
        }
        return new BibliographicEntity(agencyId, bibliographicRecordId, work, unit, producerVersion, deleted, indexKeys, trackingId);

    }

}
