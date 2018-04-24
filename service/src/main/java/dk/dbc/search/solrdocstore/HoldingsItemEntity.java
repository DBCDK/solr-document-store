package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import org.eclipse.persistence.annotations.Mutable;

import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@NamedEntityGraph(name = "holdingItemsWithIndexKeys", attributeNodes =
                  @NamedAttributeNode("indexKeys"))
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity implements Serializable {

    private static final long serialVersionUID = 2469572172167117328L;

    public HoldingsItemEntity() {
    }

    @Id
    private int agencyId;

    @Id
    private String bibliographicRecordId;

    private String producerVersion;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgHoldingsKeysToPgConverter.class)
    private List<Map<String, List<String>>> indexKeys;

    private String trackingId;

    HoldingsItemEntity(int agencyId, String bibliographicRecordId, String producerVersion, List<Map<String, List<String>>> indexKeys, String trackingId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.producerVersion = producerVersion;
        this.indexKeys = indexKeys;
        this.trackingId = trackingId;
    }

    /**
     * Ensure the class is of type Entity, if needed make a shallow copy
     *
     * @return self or copy of self
     */
    public HoldingsItemEntity asHoldingsItemEntity() {
        if (getClass().equals(HoldingsItemEntity.class)) {
            return this;
        }
        return new HoldingsItemEntity(agencyId, bibliographicRecordId, producerVersion, indexKeys, trackingId);
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 41 * hash + this.agencyId;
        hash = 41 * hash + Objects.hashCode(this.bibliographicRecordId);
        hash = 41 * hash + Objects.hashCode(this.producerVersion);
        hash = 41 * hash + Objects.hashCode(this.trackingId);
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
        final HoldingsItemEntity other = (HoldingsItemEntity) obj;
        if (this.agencyId != other.agencyId) {
            return false;
        }
        if (!Objects.equals(this.bibliographicRecordId, other.bibliographicRecordId)) {
            return false;
        }
        if (!Objects.equals(this.producerVersion, other.producerVersion)) {
            return false;
        }
        if (!Objects.equals(this.trackingId, other.trackingId)) {
            return false;
        }
        return true;
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

    public List<Map<String, List<String>>> getIndexKeys() {
        return indexKeys;
    }

    public void setIndexKeys(List<Map<String, List<String>>> indexKeys) {
        this.indexKeys = indexKeys;
    }

}
