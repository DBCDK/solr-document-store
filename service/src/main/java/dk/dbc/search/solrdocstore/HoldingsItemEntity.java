package dk.dbc.search.solrdocstore;

import org.eclipse.persistence.annotations.Mutable;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity {
    @Id
    public int agencyId;
    @Id
    public String bibliographicRecordId;
    public String producerVersion;
    @SuppressWarnings("JpaAttributeTypeInspection")
    @Mutable
    @Convert(converter = pgHoldingsKeysToPgConverter.class)
    public List<Map<String, List<String>>> indexKeys;
    public int commitWithin;
    public String trackingId;
}
