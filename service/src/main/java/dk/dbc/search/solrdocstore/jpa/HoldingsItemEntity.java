package dk.dbc.search.solrdocstore.jpa;

import java.io.Serializable;
import java.util.AbstractMap;
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
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.Collections.*;
import static java.util.stream.Collectors.*;
import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@NamedEntityGraph(name = "holdingItemsWithIndexKeys",
                  attributeNodes = @NamedAttributeNode("indexKeys"))
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity implements Serializable {

    private static final long serialVersionUID = 2469572172167117328L;

    public HoldingsItemEntity() {
        this.hasLiveHoldings = false;
    }

    @Id
    private int agencyId;

    @Id
    private String bibliographicRecordId;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgHoldingsKeysToPgConverter.class)
    private List<Map<String, List<String>>> indexKeys;

    private String trackingId;

    private boolean hasLiveHoldings;

    public HoldingsItemEntity(int agencyId, String bibliographicRecordId, List<Map<String, List<String>>> indexKeys, String trackingId) {
        this.agencyId = agencyId;
        this.bibliographicRecordId = bibliographicRecordId;
        this.indexKeys = indexKeys;
        this.trackingId = trackingId;
        this.hasLiveHoldings = calcHasLiveHoldings(indexKeys);
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
        return new HoldingsItemEntity(agencyId, bibliographicRecordId, indexKeys, trackingId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(3, agencyId, bibliographicRecordId, trackingId, indexKeys);
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

    /**
     * Explain if any holdings are present for this agency
     * <p>
     * Decommissioned is no longer in index-keys, so presence of any holdings
     * constitutes a live holding
     *
     * @return true/false
     */
    public boolean getHasLiveHoldings() {
        return hasLiveHoldings;
    }

    public void setHasLiveHoldings(boolean hasLiveHoldings) {
        this.hasLiveHoldings = hasLiveHoldings;
    }

    public List<Map<String, List<String>>> getIndexKeys() {
        return indexKeys;
    }

    public void setIndexKeys(List<Map<String, List<String>>> indexKeys) {
        this.indexKeys = indexKeys;
        this.hasLiveHoldings = calcHasLiveHoldings(indexKeys);
    }

    public Set<String> getLocations() {
        if (indexKeys == null) {
            return EMPTY_SET;
        }
        return indexKeys.stream()
                .flatMap(holding -> holding.getOrDefault("holdingsitem.status", (List<String>) EMPTY_LIST)
                        .stream()
                        .map(status -> status.toLowerCase(Locale.ROOT))
                        .flatMap(status -> {
                            switch (status) {
                                case "online":
                                    return Stream.of(agencyId + "-online");
                                case "onshelf":
                                case "notforloan":
                                    return Stream.concat(
                                            Stream.of(agencyId + "-" + status),
                                            holding.getOrDefault("holdingsitem.branchId", (List<String>) EMPTY_LIST)
                                                    .stream()
                                                    .map((String branchId) -> agencyId + "-" + branchId + "-" + status));
                                default:
                                    return Stream.empty();
                            }
                        }))
                .collect(toSet());
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

    private static boolean calcHasLiveHoldings(List<Map<String, List<String>>> indexKeys) {
        return indexKeys != null && !indexKeys.isEmpty();
    }

    public HoldingsItemEntity copyForLightweightPresentation() {
        Set<String> locationsCopy = getLocations();
        Map<String, Integer> statusCountCopy = getStatusCount();

        return new HoldingsItemEntity(agencyId, bibliographicRecordId, null, trackingId) {
            @Override
            public Set<String> getLocations() {
                return locationsCopy;
            }

            @Override
            public Map<String, Integer> getStatusCount() {
                return statusCountCopy;
            }
        };
    }
}
