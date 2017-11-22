package dk.dbc.search.solrdocstore;

import java.io.Serializable;
import org.eclipse.persistence.annotations.Mutable;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "holdingsItemsSolrKeys")
@IdClass(AgencyItemKey.class)
public class HoldingsItemEntity implements Serializable {

    private static final long serialVersionUID = 2469572172167117328L;

    @Id
    public int agencyId;

    @Id
    public String bibliographicRecordId;

    public String producerVersion;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Mutable
    @Convert(converter = PgHoldingsKeysToPgConverter.class)
    public List<Map<String, List<String>>> indexKeys;

    public String trackingId;

    @Transient
    public int commitWithin;
}
