package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.eclipse.persistence.annotations.Mutable;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "bibliographicSolrKeys")
@NamedEntityGraph(name = "bibPostWithIndexKeys",attributeNodes = @NamedAttributeNode("indexKeys"))
@IdClass(AgencyItemKey.class)
public class BibliographicEntity implements Serializable {
    public static final List<String> sortableColumns = Arrays.asList("agencyId","bibliographicRecordId","producerVersion","deleted","trackingId");

    private static final long serialVersionUID = -2773872842011755768L;

    public BibliographicEntity() {
    }

    @Id
    private int agencyId;

    @Id
    private String bibliographicRecordId;

    private String work;
    private String unit;
    private String producerVersion;
    private boolean deleted;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgMapOfStringsToJsonConverter.class)
    private Map<String, List<String>> indexKeys;

    private String trackingId;

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
    public int hashCode() {
        int hash = 3;
        hash = 43 * hash + this.agencyId;
        hash = 43 * hash + Objects.hashCode(this.bibliographicRecordId);
        hash = 43 * hash + Objects.hashCode(this.work);
        hash = 43 * hash + Objects.hashCode(this.unit);
        hash = 43 * hash + Objects.hashCode(this.producerVersion);
        hash = 43 * hash + ( this.deleted ? 1 : 0 );
        hash = 43 * hash + Objects.hashCode(this.trackingId);
        return hash;
    }

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BibliographicEntity that = (BibliographicEntity) o;
        return agencyId == that.agencyId &&
                Objects.equals(bibliographicRecordId, that.bibliographicRecordId) &&
                Objects.equals(work, that.work) &&
                Objects.equals(unit, that.unit) &&
                Objects.equals(producerVersion, that.producerVersion) &&
                deleted == that.deleted &&
                Objects.equals(trackingId, that.trackingId);
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

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }

    public String getWork() {
        return work;
    }

    public void setWork(String work) {
        this.work = work;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getProducerVersion() {
        return producerVersion;
    }

    public void setProducerVersion(String producerVersion) {
        this.producerVersion = producerVersion;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Map<String, List<String>> getIndexKeys() {
        return indexKeys;
    }

    public void setIndexKeys(Map<String, List<String>> indexKeys) {
        this.indexKeys = indexKeys;
    }
}
