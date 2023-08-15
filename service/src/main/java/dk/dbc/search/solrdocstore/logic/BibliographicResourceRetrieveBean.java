package dk.dbc.search.solrdocstore.logic;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import java.util.List;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.eclipse.microprofile.metrics.annotation.Timed;

@Stateless
public class BibliographicResourceRetrieveBean {

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

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
                " WHERE oa.libraryType = :type" +
                " AND br.bibliographicRecordId = :bibId", BibliographicResourceEntity.class);
        return query.setParameter("type", LibraryType.FBS)
                .setParameter("bibId", bibliographicRecordId)
                .getResultList();
    }
}
