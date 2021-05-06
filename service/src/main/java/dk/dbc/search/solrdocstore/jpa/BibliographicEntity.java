package dk.dbc.search.solrdocstore.jpa;

import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.ColumnResult;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EntityResult;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Table;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import javax.persistence.EntityManager;

import org.eclipse.persistence.annotations.Mutable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static javax.persistence.FetchType.LAZY;

@Entity
@Table(name = "bibliographicSolrKeys")
@NamedEntityGraph(name = "bibPostWithIndexKeys", attributeNodes =
                  @NamedAttributeNode("indexKeys"))
@SqlResultSetMapping(name = "BibliographicEntityWithSupersedeId", entities = {
    @EntityResult(entityClass = BibliographicEntity.class),}, columns = {
    @ColumnResult(name = "supersede_id")})
@IdClass(AgencyClassifierItemKey.class)
public class BibliographicEntity implements Serializable {

    private static final Logger log = LoggerFactory.getLogger(BibliographicEntity.class);

    public static final List<String> sortableColumns = Collections.unmodifiableList(Arrays.asList(
            "agencyId", "bibliographicRecordId", "deleted", "trackingId"));

    private static final long serialVersionUID = -2773872842011755768L;

    private static final String SELECT_MANIFESTATIONS_FOR_WORK_JPA =
            "SELECT be FROM BibliographicEntity be" +
            " WHERE be.work = :workId";

    public static List<BibliographicEntity> fetchByWork(EntityManager entityManager, String workId) {
        return entityManager.createQuery(SELECT_MANIFESTATIONS_FOR_WORK_JPA, BibliographicEntity.class)
                .setParameter("workId", workId)
                .getResultList();
    }

    public BibliographicEntity() {
    }

    @Id
    private int agencyId;

    @Id
    private String classifier;

    @Id
    private String bibliographicRecordId;

    private String repositoryId;
    private String work;
    private String unit;
    private boolean deleted;

    @SuppressWarnings("JpaAttributeTypeInspection")
    @Basic(fetch = LAZY)
    @Mutable
    @Convert(converter = PgMapOfStringsToJsonConverter.class)
    private IndexKeys indexKeys;

    private String trackingId;

    public BibliographicEntity(int agencyId, String classifier, String bibliographicRecordId, String repositoryId, String work, String unit, boolean deleted, IndexKeys indexKeys, String trackingId) {
        this.agencyId = agencyId;
        this.classifier = classifier;
        this.bibliographicRecordId = bibliographicRecordId;
        this.repositoryId = repositoryId;
        this.work = work;
        this.unit = unit;
        this.deleted = deleted;
        this.indexKeys = indexKeys;
        this.trackingId = trackingId;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 43 * hash + this.agencyId;
        hash = 43 * hash + Objects.hashCode(this.classifier);
        hash = 43 * hash + Objects.hashCode(this.bibliographicRecordId);
        hash = 43 * hash + Objects.hashCode(this.repositoryId);
        hash = 43 * hash + Objects.hashCode(this.work);
        hash = 43 * hash + Objects.hashCode(this.unit);
        hash = 43 * hash + ( this.deleted ? 1 : 0 );
        hash = 43 * hash + Objects.hashCode(this.trackingId);
        return hash;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        BibliographicEntity that = (BibliographicEntity) o;
        return agencyId == that.agencyId &&
               Objects.equals(classifier, that.classifier) &&
               Objects.equals(bibliographicRecordId, that.bibliographicRecordId) &&
               Objects.equals(repositoryId, that.repositoryId) &&
               Objects.equals(work, that.work) &&
               Objects.equals(unit, that.unit) &&
               deleted == that.deleted &&
               Objects.equals(trackingId, that.trackingId);
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
        return new BibliographicEntity(agencyId, classifier, bibliographicRecordId, repositoryId, work, unit, deleted, indexKeys, trackingId);

    }

    public int getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(int agencyId) {
        this.agencyId = agencyId;
    }

    public String getClassifier() {
        return classifier;
    }

    public void setClassifier(String classifier) {
        this.classifier = classifier;
    }

    public String getBibliographicRecordId() {
        return bibliographicRecordId;
    }

    public void setBibliographicRecordId(String bibliographicRecordId) {
        this.bibliographicRecordId = bibliographicRecordId;
    }

    public String getRepositoryId() {
        return repositoryId;
    }

    public void setRepositoryId(String repositoryId) {
        this.repositoryId = repositoryId;
    }

    public String getWork() {
        return work;
    }

    public void setWork(String work) {
        this.work = work;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public IndexKeys getIndexKeys() {
        return indexKeys;
    }

    public void setIndexKeys(IndexKeys indexKeys) {
        this.indexKeys = indexKeys;
    }

    public AgencyClassifierItemKey asAgencyClassifierItemKey() {
        return new AgencyClassifierItemKey(agencyId, classifier, bibliographicRecordId);
    }

    public QueueJob asQueueJobFor(QueueType supplier) {
        switch (supplier.getType()) {
            case MANIFESTATION:
                return QueueJob.manifestation(agencyId, classifier, bibliographicRecordId);
            case WORK:
                if(deleted) {
                    log.warn("Not queueing for WORK type because {}-{}:{} is deleted", agencyId, classifier, bibliographicRecordId);
                    return null;
                }
                return QueueJob.work(work);
            default:
                throw new AssertionError();
        }
    }
}
