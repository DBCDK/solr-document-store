package dk.dbc.search.solrdocstore;

import dk.dbc.ee.stats.Timed;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

@Stateless
public class BibliographicResourceRetrieveBean {

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Timed
    public List<BibliographicResourceEntity> getResourcesFor(int agencyId, String bibliographicRecordId) {
        TypedQuery<BibliographicResourceEntity> query = entityManager.createQuery(
                "SELECT br FROM BibliographicResourceEntity br" +
                " WHERE br.agencyId = :agencyId" +
                " AND br.bibliographicRecordId = :bibId", BibliographicResourceEntity.class);
        return query.setParameter("agencyId", agencyId)
                .setParameter("bibId", bibliographicRecordId)
                .getResultList();
    }

    @Timed
    public List<BibliographicResourceEntity> getResourcesForCommon(String bibliographicRecordId) {
        TypedQuery<BibliographicResourceEntity> query = entityManager.createQuery(
                "SELECT br FROM BibliographicResourceEntity br" +
                " JOIN OpenAgencyEntity AS oa" +
                " ON br.agencyId = oa.agencyId " +
                " WHERE oa.libraryType IN :types" +
                " AND br.bibliographicRecordId = :bibId", BibliographicResourceEntity.class);
        return query.setParameter("types", LibraryType.FBS_LIBS)
                .setParameter("bibId", bibliographicRecordId)
                .getResultList();
    }
}
