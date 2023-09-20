package dk.dbc.search.solrdocstore.jpa;

import dk.dbc.holdingsitemsdocuments.bindings.HoldingsItemsDocuments;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.io.Serializable;
import java.util.AbstractMap;
import org.eclipse.persistence.annotations.Mutable;

import jakarta.persistence.Basic;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import static java.util.Collections.*;
import static java.util.stream.Collectors.*;
import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@NamedEntityGraph(name = "holdingItemsWithIndexKeys",
                  attributeNodes = @NamedAttributeNode("indexKeys"))
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity implements Serializable {

    private static final long serialVersionUID = 2469572172167117328L;

    @Id
    private int agencyId;

    @Id
    private String bibliographicRecordId;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgHoldingsKeysToPgConverter.class)
    private IndexKeysList indexKeys;

    private String trackingId;

    private Timestamp modified;

    public static HoldingsItemEntity from(HoldingsItemsDocuments hid) {
        IndexKeysList indexKeys = new IndexKeysList();
        List<Map<String, List<String>>> documents = hid.getDocuments();
        if (documents != null) {
            documents.forEach(doc -> indexKeys.add(IndexKeys.from(doc)));
        }
        return new HoldingsItemEntity(hid.getAgencyId(), hid.getBibliographicRecordId(), indexKeys, Timestamp.from(hid.getModified()), "");
    }

    public HoldingsItemEntity() {
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public HoldingsItemEntity(int agencyId, String bibliographicRecordId, IndexKeysList indexKeys, Timestamp modified, String trackingId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.indexKeys = indexKeys;
        this.trackingId = trackingId;
        this.modified = modified;
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
        return new HoldingsItemEntity(agencyId, bibliographicRecordId, indexKeys, modified, trackingId);
    }

    public boolean update(HoldingsItemsDocuments hid) {
        if (modified != null &&
            getModified().isAfter(hid.getModified())) {
            return false;
        }
        setModified(hid.getModified());
        setTrackingId("");
        IndexKeysList newIndexKeys = new IndexKeysList();
        List<Map<String, List<String>>> documents = hid.getDocuments();
        if (documents != null) {
            documents.forEach(doc -> newIndexKeys.add(IndexKeys.from(doc)));
        }
        if (indexKeys.equals(newIndexKeys)) {
            return false;
        }
        setIndexKeys(newIndexKeys);
        return true;
    }

    public HoldingsItemsDocuments toHoldingsItemsDocuments() {
        return new HoldingsItemsDocuments()
                .withAgencyId(agencyId)
                .withBibliographicRecordId(bibliographicRecordId)
                .withModified(getModified())
                .withDocuments(indexKeys.stream()
                        .map(e -> (Map<String, List<String>>) e)
                        .collect(toList()));
    }

    @Override
    public int hashCode() {
        return Objects.hash(3, agencyId, bibliographicRecordId, trackingId, modified, indexKeys);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final HoldingsItemEntity other = (HoldingsItemEntity) obj;
        return this.agencyId == other.agencyId &&
               Objects.equals(this.bibliographicRecordId, other.bibliographicRecordId) &&
               Objects.equals(this.trackingId, other.trackingId) &&
               Objects.equals(this.modified, other.modified) &&
               Objects.equals(this.indexKeys, other.indexKeys);
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

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public IndexKeysList getIndexKeys() {
        return indexKeys;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public void setIndexKeys(IndexKeysList indexKeys) {
        this.indexKeys = indexKeys;
    }

    public Instant getModified() {
        return modified == null ? null : modified.toInstant();
    }

    public void setModified(Instant modified) {
        this.modified = modified == null ? null : Timestamp.from(modified);
    }

    public Map<String, Integer> getStatusCount() {
        if (indexKeys == null)
            return EMPTY_MAP;
        return indexKeys.stream()
                .flatMap(holding -> {
                    int itemCount = holding.getOrDefault("holdingsitem.itemId", (List<String>) EMPTY_LIST).size();
                    int count = Integer.max(1, itemCount); // Ensure at least one item
                    return holding.getOrDefault("holdingsitem.status", (List<String>) EMPTY_LIST)
                            .stream()
                            .map(status -> new AbstractMap.SimpleEntry<>(status.toLowerCase(Locale.ROOT), count));
                })
                .collect(groupingBy(Map.Entry::getKey, summingInt(Map.Entry::getValue)));
    }

    public HoldingsItemEntity copyForLightweightPresentation() {
        Map<String, Integer> statusCountCopy = getStatusCount();
        return new HoldingsItemEntity(agencyId, bibliographicRecordId, null, modified, trackingId) {
            @Override
            public Map<String, Integer> getStatusCount() {
                return statusCountCopy;
            }
        };
    }

    @Override
    public String toString() {
        return "HoldingsItemEntity{" + "agencyId=" + agencyId + ", " +
               "bibliographicRecordId=" + bibliographicRecordId + ", " +
               "indexKeys=" + indexKeys + ", " +
               "trackingId=" + trackingId + ", " +
               "modified=" + modified +
               '}';
    }
}
