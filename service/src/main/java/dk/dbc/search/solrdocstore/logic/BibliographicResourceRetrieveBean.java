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
                " WHERE oa.libraryType IN :types" +
                " AND br.bibliographicRecordId = :bibId", BibliographicResourceEntity.class);
        return query.setParameter("types", LibraryType.FBS_LIBS)
                .setParameter("bibId", bibliographicRecordId)
                .getResultList();
    }
}
