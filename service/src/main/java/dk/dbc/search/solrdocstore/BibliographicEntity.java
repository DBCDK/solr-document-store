package dk.dbc.search.solrdocstore;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.List;
import java.util.Map;

import org.eclipse.persistence.annotations.Mutable;
import org.eclipse.persistence.annotations.Mutable;

@Entity
@Table(name = "bibliographicSolrKeys")
@IdClass(AgencyItemKey.class)
public class BibliographicEntity {
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
    @Convert(converter = pgMapOfStringsToJsonConverter.class)
    public Map<String, List<String> > indexKeys;
    public String trackingId;
    @Transient
    public int commitWithin;
}
