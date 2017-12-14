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

    public void tryToAttachToBibliographicRecord(int agencyId, String bibliographicRecordId) {
        log.info("Update HoldingsToBibliographic for {} {}", agencyId,bibliographicRecordId);
        LibraryConfig.LibraryType libraryType = libraryConfig.getLibraryType(agencyId);


        switch (libraryType) {
            case NonFBS:
                attachToBibliographicRecord(agencyId, bibliographicRecordId, agencyId);
                break;
            case FBS:
                attachToBibliographicRecord(agencyId, bibliographicRecordId, agencyId,COMMON_AGENCY);
                break;
            case FBSSchool:
                attachToBibliographicRecord(agencyId, bibliographicRecordId, agencyId,COMMON_AGENCY,SCHOOL_COMMON_AGENCY);
                break;
        }
    }

    private void attachToBibliographicRecord(int agencyId, String bibliographicRecordId, int ... agencyPriority) {
        for (int i=0; i<agencyPriority.length;i++) {
            boolean attached = attachIfExists(agencyPriority[i],agencyId, bibliographicRecordId);
            if (attached) return;
        }
    }


    private boolean attachIfExists(int bibliographicAgencyId, int holdingAgencyId, String holdingBibliographicRecordId) {
        if (bibliographicEntityExists(bibliographicAgencyId,holdingBibliographicRecordId)){
            attachToAgency(bibliographicAgencyId, holdingAgencyId, holdingBibliographicRecordId);
            return true;
        }
        return false;
    }

    private boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        AgencyItemKey k = new AgencyItemKey(agencyId, bibliographicRecordId);
        BibliographicEntity e = entityManager.find(BibliographicEntity.class, k);
        return ((e!=null)&&(!e.deleted));
    }

    private void attachToAgency(int attachToAgency, int holdingAgencyId, String holdingBibliographicRecordId) {

        HoldingsToBibliographicEntity updatedEntity = updateHoldingToBibliographic(attachToAgency,
                new HoldingsToBibliographicKey()
                        .withHoldingAgencyId(holdingAgencyId)
                        .withHoldingsBibliographicRecordId(holdingBibliographicRecordId));
        if (updatedEntity!=null){
            addAttachEventQueue(updatedEntity.holdingsAgencyId,updatedEntity.bibliographicRecordId);
            entityManager.merge(updatedEntity);
        }

    }

    private HoldingsToBibliographicEntity updateHoldingToBibliographic(int attachToAgency, HoldingsToBibliographicKey itemKey) {
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

    private HoldingsToBibliographicEntity createH2B(int attachToAgency, HoldingsToBibliographicKey itemKey) {
        return new HoldingsToBibliographicEntity(
                itemKey.holdingsAgencyId,
                itemKey.holdingsBibliographicRecordId,
                attachToAgency
        );
    }

    private void addAttachEventQueue(int bibliographicAgencyId, String bibliographicRecordId) {
        //TODO: Implement
    }



}
