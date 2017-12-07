package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRulesProxy;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
public class AgencyLibraryTypeBean {

    @Inject
    LibraryRulesProxy proxy;


    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public LibraryConfig.LibraryType fetchAndCacheLibraryType(int agency){
        LibraryConfig.LibraryType returnValue;
        AgencyLibraryTypeEntity cachedValue = findByAgency(agency);
        if (cachedValue!=null){
            returnValue = LibraryConfig.LibraryType.valueOf(cachedValue.libraryType);
        } else {
            LibraryConfig.LibraryType libraryType = proxy.fetchLibraryTypeFor(agency);
            storeTypeOnAgency(agency,libraryType);
            returnValue = libraryType;
        }
        return returnValue;
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
