package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.eclipse.persistence.exceptions.JPQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.LibraryConfig.RecordType.SingleRecord;
@Stateless
public class BibliographicRetrieveBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicRetrieveBean.class);



    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public List<BibliographicEntity> getBibliographicEntities(String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("bibId",bibliographicRecordId).getResultList();
    }

    public BibliographicEntity getBibliographicEntity(int agencyId, String bibliographicRecordId) {
        List<BibliographicEntity> entities = getBibliographicEntities(agencyId, bibliographicRecordId);
        if (entities.isEmpty()) {
            return null;
        } else {
            return entities.get(0);
        }
    }

    public List<BibliographicEntity> getBibliographicEntities(int agencyId, String bibliographicRecordId) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.agencyId = :agencyId AND b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        return query.setParameter("agencyId",agencyId).setParameter("bibId",bibliographicRecordId).getResultList();
    }

    public BibliographicEntity getBibliographicEntity(AgencyItemKey key) {
        List<BibliographicEntity> entities = getBibliographicEntities(key);
        if (entities.isEmpty()) {
            return null;
        } else {
            return entities.get(0);
        }
    }

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
