package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import org.eclipse.microprofile.metrics.annotation.Timed;

@Stateless
public class BibliographicResourceRetrieveBean {

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Timed(reusable = true)
    public List<BibliographicResourceEntity> getResourcesFor(int agencyId, String bibliographicRecordId) {
        TypedQuery<BibliographicResourceEntity> query = entityManager.createQuery(
                "SELECT br FROM BibliographicResourceEntity br" +
                " WHERE br.agencyId = :agencyId" +
                " AND br.bibliographicRecordId = :bibId", BibliographicResourceEntity.class);
        return query.setParameter("agencyId", agencyId)
                .setParameter("bibId", bibliographicRecordId)
                .getResultList();
    }

    @Timed(reusable = true)
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
