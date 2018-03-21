package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.eclipse.persistence.exceptions.JPQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
public class BibliographicRetrieveBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicRetrieveBean.class);



    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Timed
    public List<BibliographicEntity> getBibliographicEntities(String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("bibId",bibliographicRecordId).getResultList();
    }

    @Timed
    public BibliographicEntity getBibliographicEntity(int agencyId, String bibliographicRecordId) {
        List<BibliographicEntity> entities = getBibliographicEntities(agencyId, bibliographicRecordId);
        if (entities.isEmpty()) {
            return null;
        } else {
            return entities.get(0);
        }
    }

    // Dodo Remove after migration to classifier
    @Timed
    public void migrateBibliographicEntityToClassifier(int agencyId, String bibliographicRecordId, String classifier) {
        AgencyClassifierItemKey key = new AgencyClassifierItemKey(agencyId, "UNKNOWN", bibliographicRecordId);
        BibliographicEntity entity = entityManager.find(BibliographicEntity.class, key);
        if (entity != null) {
            entityManager.remove(entity);
            log.info("Migrating {} to {}", key, classifier);
            entity = new BibliographicEntity(agencyId, classifier, bibliographicRecordId,
                                             entity.getWork(), entity.getUnit(), entity.getProducerVersion(),
                                             entity.isDeleted(), entity.getIndexKeys(), entity.getTrackingId());
            entity.setClassifier(classifier);
            entityManager.persist(entity);
        }
    }

    @Timed
    public List<BibliographicEntity> getBibliographicEntities(int agencyId, String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.agencyId = :agencyId AND b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("agencyId",agencyId).setParameter("bibId",bibliographicRecordId).getResultList();
    }

    @Timed
    public BibliographicEntity getBibliographicEntity(AgencyItemKey key) {
        List<BibliographicEntity> entities = getBibliographicEntities(key);
        if (entities.isEmpty()) {
            return null;
        } else {
            return entities.get(0);
        }
    }

    @Timed
    public List<BibliographicEntity> getBibliographicEntities(AgencyItemKey key) {
        return getBibliographicEntities(key.getAgencyId(), key.getBibliographicRecordId());
    }


    /**
     * Query bibliographic posts with the indexKey field set. This is necessary for the API, as the Jackson parser does
     * not use the getter, thereby not using the lazy load.
     * @param bibliographicRecordId bibliographic record id we match with
     * @param orderBy which column we order by
     * @param desc ascending or descending
     * @return Query of bibliographic entities joined with bibliographic to bibliographic table, so the supersede id is
     * included
     */
    public Query getBibliographicEntitiesWithIndexKeys(String bibliographicRecordId,String orderBy,boolean desc) {
        String direction = (desc) ? "DESC" : "ASC";
        if (!BibliographicEntity.sortableColumns.contains(orderBy)){
            throw new JPQLException("Invalid order by parameter");
        }
        Query frontendQuery = entityManager.createNativeQuery("SELECT b.*,b2b.livebibliographicrecordid as supersede_id " +
                "FROM bibliographicsolrkeys b " +
                "LEFT OUTER JOIN bibliographictobibliographic b2b ON b.bibliographicrecordid=b2b.deadbibliographicrecordid " +
                "WHERE b.bibliographicrecordid=?1 " +
                "ORDER BY b."+orderBy.toLowerCase()+" "+direction,"BibliographicEntityWithSupersedeId");
        return frontendQuery.setParameter(1,bibliographicRecordId);

    }

    public long getBibliographicEntityCountById(String bibliographicRecordId){
        Query queryTotal = entityManager.createQuery
                ("SELECT COUNT(b.bibliographicRecordId) FROM BibliographicEntity b WHERE b.bibliographicRecordId = :bibId")
                .setParameter("bibId",bibliographicRecordId);
        return (long)queryTotal.getSingleResult();

    }

}
