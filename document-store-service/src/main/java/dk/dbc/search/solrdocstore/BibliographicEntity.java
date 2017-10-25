package dk.dbc.search.solrdocstore;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

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
    public Boolean deleted;
    @Convert(converter = pgStringToJsonConverter.class)
    public String indexKeys;
    public int commitWithin;
    public String trackingId;
}
