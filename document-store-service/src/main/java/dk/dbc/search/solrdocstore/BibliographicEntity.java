package dk.dbc.search.solrdocstore;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "bibliographicSolrKeys")
public class BibliographicEntity {
    @Id
    public String id;
    public int agencyId;
    public String bibliographicRecordId;
    public String work;
    public String unit;
    public String producerVersion;
    public boolean deleted;
    @Convert(converter = pgMapOfStringsToJsonConverter.class)
    public Map<String, List<String> > indexKeys;
    public int commitWithin;
    public String trackingId;
}
