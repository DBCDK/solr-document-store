package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static dk.dbc.search.solrdocstore.LibraryConfig.COMMON_AGENCY;
import static dk.dbc.search.solrdocstore.LibraryConfig.SCHOOL_COMMON_AGENCY;


@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    LibraryConfig libraryConfig;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    public void tryToAttachToBibliographicRecord(int hAgencyId, String hBibliographicRecordId) {
        log.info("Update HoldingsToBibliographic for {} {}", hAgencyId,hBibliographicRecordId);
        LibraryConfig.LibraryType libraryType = libraryConfig.getLibraryType(hAgencyId);


        switch (libraryType) {
            case NonFBS:
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, hBibliographicRecordId, hAgencyId);
                break;
            case FBS:
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, findLiveBibliographicRecordId(hBibliographicRecordId), hAgencyId, COMMON_AGENCY);
                break;
            case FBSSchool:
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, findLiveBibliographicRecordId(hBibliographicRecordId), hAgencyId, COMMON_AGENCY, SCHOOL_COMMON_AGENCY);
                break;
        }
    }


    public void recalcAttachments(String newRecordId, Set<String> supersededRecordIds) {
        Map<Integer,LibraryConfig.LibraryType> map = new HashMap<>();
        for (String supersededRecordId : supersededRecordIds) {
            List<HoldingsToBibliographicEntity> recalcCandidates = findRecalcCandidates(supersededRecordId);
            for (HoldingsToBibliographicEntity h2b : recalcCandidates){
                LibraryConfig.LibraryType libraryType = getFromCache(map, h2b.holdingsAgencyId);
                switch (libraryType){
                    case NonFBS:
                        break;
                    case FBS:
                        attachToBibliographicRecord(h2b.holdingsAgencyId, h2b.holdingsBibliographicRecordId, newRecordId, h2b.bibliographicAgencyId, COMMON_AGENCY);
                        break;
                    case FBSSchool:
                        attachToBibliographicRecord(h2b.holdingsAgencyId, h2b.holdingsBibliographicRecordId, newRecordId, h2b.bibliographicAgencyId, COMMON_AGENCY, SCHOOL_COMMON_AGENCY);
                        break;
                }
            }
        }
    }

    private LibraryConfig.LibraryType getFromCache(Map<Integer, LibraryConfig.LibraryType> map, int holdingsAgencyId) {
        LibraryConfig.LibraryType t = map.computeIfAbsent(holdingsAgencyId, k->libraryConfig.getLibraryType(holdingsAgencyId));
        return t;
    }

    public List<HoldingsToBibliographicEntity> getRelatedHoldingsToBibliographic(int bibliographicAgencyId, String bibliographicRecordId){
        return entityManager.createQuery(
                "SELECT h FROM HoldingsToBibliographicEntity h WHERE " +
                        "h.bibliographicRecordId=:bibId and " +
                        "h.bibliographicAgencyId=:agencyId", HoldingsToBibliographicEntity.class)
                .setParameter("agencyId",bibliographicAgencyId)
                .setParameter("bibId",bibliographicRecordId).getResultList();
    }

    public List<HoldingsToBibliographicEntity> findRecalcCandidates(String bibliographicRecordId) {

        Query q = entityManager.createQuery(
                "SELECT h FROM HoldingsToBibliographicEntity h " +
                        "WHERE h.bibliographicRecordId = :recId", HoldingsToBibliographicEntity.class);
        q.setParameter("recId", bibliographicRecordId);
        return  q.getResultList();
    }

    private String findLiveBibliographicRecordId(String bibliographicRecordId) {
        BibliographicToBibliographicEntity e = entityManager.find(BibliographicToBibliographicEntity.class, bibliographicRecordId);
        if (e==null) {
            return bibliographicRecordId;
        } else {
            return e.liveBibliographicRecordId;
        }
    }

    private void attachToBibliographicRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, String bibliographicRecordId, int... bibliographicAgencyPriorities) {
        for (int i=0; i<bibliographicAgencyPriorities.length;i++) {
            boolean attached = attachIfExists(bibliographicAgencyPriorities[i], bibliographicRecordId, holdingsAgencyId, holdingsBibliographicRecordId);
            if (attached) return;
        }
    }


    private boolean attachIfExists(int bibliographicAgencyId, String bibliographicRecordId, int holdingAgencyId, String holdingBibliographicRecordId) {
        if (bibliographicEntityExists(bibliographicAgencyId,bibliographicRecordId)){
            HoldingsToBibliographicEntity expectedState = new HoldingsToBibliographicEntity(holdingAgencyId, holdingBibliographicRecordId, bibliographicAgencyId, bibliographicRecordId);
            attachToAgency(expectedState);
            return true;
        }
        return false;
    }

    private boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        AgencyItemKey k = new AgencyItemKey(agencyId, bibliographicRecordId);
        BibliographicEntity e = entityManager.find(BibliographicEntity.class, k);
        return ((e!=null)&&(!e.deleted));
    }

    private void attachToAgency(HoldingsToBibliographicEntity expectedState) {

        if (needToUpdate(expectedState)){
            addAttachEventQueue(expectedState.holdingsAgencyId,expectedState.bibliographicRecordId);
            entityManager.merge(expectedState);
        }

    }

    private boolean needToUpdate(HoldingsToBibliographicEntity expectedState) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, expectedState.asKey());
        if ((foundEntity!=null) && foundEntity.equals(expectedState)) {
            return false;
        }
        return true;
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
