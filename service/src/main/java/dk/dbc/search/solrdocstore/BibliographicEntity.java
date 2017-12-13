package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;

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
