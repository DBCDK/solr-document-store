package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import static dk.dbc.search.solrdocstore.LibraryConfig.COMMON_AGENCY;
import static dk.dbc.search.solrdocstore.LibraryConfig.SCHOOL_COMMON_AGENCY;


@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    LibraryConfig libraryConfig;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public void tryToAttachToBibliographicRecord(AgencyItemKey holdingsId) {
        log.info("Update HoldingsToBibliographic for {} {}", holdingsId.agencyId,holdingsId.bibliographicRecordId);
        LibraryConfig.LibraryType libraryType = libraryConfig.getLibraryType(holdingsId.agencyId);


        switch (libraryType) {
            case NonFBS:
                attachToBibliographicRecord(holdingsId, holdingsId.agencyId);
                break;
            case FBS:
                attachToBibliographicRecord(holdingsId, holdingsId.agencyId,COMMON_AGENCY);
                break;
            case FBSSchool:
                attachToBibliographicRecord(holdingsId,holdingsId.agencyId,COMMON_AGENCY,SCHOOL_COMMON_AGENCY);
                break;
        }
    }

    private void attachToBibliographicRecord(AgencyItemKey holdingsId, int ... agencyPriority) {
        for (int i=0; i<agencyPriority.length;i++) {
            boolean attached = attachIfExists(agencyPriority[i],holdingsId);
            if (attached) return;
        }
    }


    private boolean attachIfExists(int agencyId, AgencyItemKey holdingsId) {
        if (bibliographicEntityExists(agencyId,holdingsId.bibliographicRecordId)){
            attachToAgency(agencyId, holdingsId);
            return true;
        }
        return false;
    }

    private boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        AgencyItemKey k = new AgencyItemKey(agencyId, bibliographicRecordId);
        BibliographicEntity e = entityManager.find(BibliographicEntity.class, k);
        return ((e!=null)&&(!e.deleted));
    }

    private void attachToAgency(int attachToAgency, AgencyItemKey itemKey) {

        HoldingsToBibliographicEntity updatedEntity = updateHoldingToBibliographic(attachToAgency,itemKey);
        if (updatedEntity!=null){
            addAttachEventQueue(updatedEntity.agencyId,updatedEntity.bibliographicRecordId);
            entityManager.merge(updatedEntity);
        }

    }

    private HoldingsToBibliographicEntity updateHoldingToBibliographic(int attachToAgency, AgencyItemKey itemKey) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, itemKey);
        if (foundEntity!=null){
            if (foundEntity.bibliographicAgencyId==attachToAgency) {
                return null;
            } else {
                foundEntity.bibliographicAgencyId = attachToAgency;
                return foundEntity;
            }
        } else {
            return createH2B(attachToAgency,itemKey);
        }
    }

    private HoldingsToBibliographicEntity createH2B(int attachToAgency, AgencyItemKey itemKey) {
        HoldingsToBibliographicEntity newEntity = new HoldingsToBibliographicEntity();
        newEntity.agencyId = itemKey.agencyId;
        newEntity.bibliographicRecordId = itemKey.bibliographicRecordId;
        newEntity.bibliographicAgencyId = attachToAgency;
        return newEntity;
    }

    private void addAttachEventQueue(int bibliographicAgencyId, String bibliographicRecordId) {
        //TODO: Implement
    }



}
