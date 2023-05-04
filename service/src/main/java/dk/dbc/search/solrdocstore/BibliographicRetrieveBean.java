package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import java.util.List;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.eclipse.microprofile.metrics.annotation.Timed;

import org.eclipse.persistence.exceptions.JPQLException;

@Stateless
public class BibliographicRetrieveBean {

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Timed
    public List<BibliographicEntity> getBibliographicEntities(String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                                                                          "WHERE b.bibliographicRecordId = :bibId", BibliographicEntity.class);
        return query.setParameter("bibId", bibliographicRecordId).getResultList();
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

    @Timed
    public List<BibliographicEntity> getBibliographicEntities(int agencyId, String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                                                                          "WHERE b.agencyId = :agencyId AND b.bibliographicRecordId = :bibId", BibliographicEntity.class);
        return query.setParameter("agencyId", agencyId).setParameter("bibId", bibliographicRecordId).getResultList();
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
     * Query bibliographic posts with the indexKey field set. This is necessary
     * for the API, as the Jackson parser does
     * not use the getter, thereby not using the lazy load.
     *
     * @param bibliographicRecordId bibliographic record id we match with
     * @param orderBy               which column we order by
     * @param desc                  ascending or descending
     * @return Query of bibliographic entities joined with bibliographic to
     *         bibliographic table
     */
    public TypedQuery<BibliographicEntity> getBibliographicEntitiesWithIndexKeys(String bibliographicRecordId, String orderBy, boolean desc) {
        String direction = desc ? "DESC" : "ASC";
        if (!BibliographicEntity.sortableColumns.contains(orderBy)) {
            throw new JPQLException("Invalid order by parameter");
        }
        return entityManager.createQuery("SELECT b " +
                                         "FROM BibliographicEntity b " +
                                         "WHERE b.bibliographicRecordId=:bibliographicRecordId " +
                                         "ORDER BY b." + orderBy + " " + direction, BibliographicEntity.class)
                .setParameter("bibliographicRecordId", bibliographicRecordId);
    }

    public long getBibliographicEntityCountById(String bibliographicRecordId) {
        Query queryTotal = entityManager.createQuery("SELECT COUNT(b.bibliographicRecordId) FROM BibliographicEntity b WHERE b.bibliographicRecordId = :bibId")
                .setParameter("bibId", bibliographicRecordId);
        return (long) queryTotal.getSingleResult();

    }
}
