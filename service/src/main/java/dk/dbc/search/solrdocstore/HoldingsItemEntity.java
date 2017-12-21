package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import org.eclipse.persistence.annotations.Mutable;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;
import javax.persistence.Basic;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity implements Serializable {

    private static final long serialVersionUID = 2469572172167117328L;

    public HoldingsItemEntity() {
    }

    @Id
    public int agencyId;

    @Id
    public String bibliographicRecordId;

    public String producerVersion;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgHoldingsKeysToPgConverter.class)
    public List<Map<String, List<String>>> indexKeys;

    public String trackingId;

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

}
