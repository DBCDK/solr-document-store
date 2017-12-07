package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRulesProxy;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
public class AgencyLibraryTypeBean {

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public LibraryConfig.LibraryType fetchAndCacheLibraryType(int agency){
        return LibraryConfig.LibraryType.FBS;
    }

    private void storeTypeOnAgency(int agency, LibraryConfig.LibraryType libraryType){
        AgencyLibraryTypeEntity e = new AgencyLibraryTypeEntity();
        e.agencyId = agency;
        e.libraryType = libraryType.name();
        entityManager.persist(e);
    }

    private void deleteLibraryTypeOnAgency(int agency){
        AgencyLibraryTypeEntity e = findByAgency(agency);
        if (e != null) {
            entityManager.remove(e);
        }
    }

    private AgencyLibraryTypeEntity findByAgency(int agency){
        AgencyLibraryTypeEntity e = entityManager.find(AgencyLibraryTypeEntity.class, agency);
        return e;
    }

}
