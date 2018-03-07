package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import static dk.dbc.search.solrdocstore.LibraryConfig.COMMON_AGENCY;
import static dk.dbc.search.solrdocstore.LibraryConfig.SCHOOL_COMMON_AGENCY;


@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    LibraryConfig libraryConfig;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Timed
    public Set<AgencyItemKey> tryToAttachToBibliographicRecord(int hAgencyId, String hBibliographicRecordId) {
        log.info("Update HoldingsToBibliographic for {} {}", hAgencyId,hBibliographicRecordId);
        LibraryConfig.LibraryType libraryType = libraryConfig.getLibraryType(hAgencyId);


        switch (libraryType) {
            case NonFBS:
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, hBibliographicRecordId, hAgencyId);

            case FBS:
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, findLiveBibliographicRecordId(hBibliographicRecordId), hAgencyId, COMMON_AGENCY);

            case FBSSchool:
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, findLiveBibliographicRecordId(hBibliographicRecordId), hAgencyId, SCHOOL_COMMON_AGENCY, COMMON_AGENCY);

        }
        return Collections.emptySet();
    }


    @Timed
    public Set<AgencyItemKey> recalcAttachments(String newRecordId, Set<String> supersededRecordIds) {
        Map<Integer,LibraryConfig.LibraryType> map = new HashMap<>();
        Set<AgencyItemKey> keysUpdated = EnqueueAdapter.makeSet();

        for (String supersededRecordId : supersededRecordIds) {
            List<HoldingsToBibliographicEntity> recalcCandidates = findRecalcCandidates(supersededRecordId);
            for (HoldingsToBibliographicEntity h2b : recalcCandidates){

                LibraryConfig.LibraryType libraryType = getFromCache(map, h2b.getHoldingsAgencyId());
                switch (libraryType){
                    case NonFBS:
                        break;
                    case FBS:
                        keysUpdated.addAll(attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, h2b.getBibliographicAgencyId(), COMMON_AGENCY));
                        break;
                    case FBSSchool:
                        keysUpdated.addAll(attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, h2b.getBibliographicAgencyId(), SCHOOL_COMMON_AGENCY, COMMON_AGENCY));
                        break;
                }
            }
        }
        return keysUpdated;
    }

    private LibraryConfig.LibraryType getFromCache(Map<Integer, LibraryConfig.LibraryType> map, int holdingsAgencyId) {
        LibraryConfig.LibraryType t = map.computeIfAbsent(holdingsAgencyId, k->libraryConfig.getLibraryType(holdingsAgencyId));
        return t;
    }

    @Timed
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
            return e.getLiveBibliographicRecordId();
        }
    }

    private Set<AgencyItemKey> attachToBibliographicRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, String bibliographicRecordId, int... bibliographicAgencyPriorities) {
        for (int i=0; i<bibliographicAgencyPriorities.length;i++) {
            Set<AgencyItemKey> keysUpdated;
            keysUpdated =
                    attachIfExists(
                            bibliographicAgencyPriorities[i],
                            bibliographicRecordId,
                            holdingsAgencyId,
                            holdingsBibliographicRecordId);
            if (!keysUpdated.isEmpty()) return keysUpdated;
        }
        return Collections.emptySet();
    }


    private Set<AgencyItemKey> attachIfExists(int bibliographicAgencyId, String bibliographicRecordId, int holdingAgencyId, String holdingBibliographicRecordId) {
        if (bibliographicEntityExists(bibliographicAgencyId,bibliographicRecordId)){
            HoldingsToBibliographicEntity expectedState = new HoldingsToBibliographicEntity(holdingAgencyId, holdingBibliographicRecordId, bibliographicAgencyId, bibliographicRecordId);
            return attachToAgency(expectedState);
        }
        return Collections.emptySet();
    }

    private boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        AgencyItemKey k = new AgencyItemKey(agencyId, bibliographicRecordId);
        BibliographicEntity e = entityManager.find(BibliographicEntity.class, k);
        return ((e!=null)&&(!e.isDeleted()));
    }

    public Set<AgencyItemKey> attachToAgency(HoldingsToBibliographicEntity expectedState) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, expectedState.asKey());
        Set<AgencyItemKey> affectedKeys = EnqueueAdapter.makeSet();

        if ((foundEntity!=null) && !foundEntity.equals(expectedState)){
            affectedKeys.add( EnqueueAdapter.makeKey(foundEntity.getBibliographicAgencyId(), foundEntity.getBibliographicRecordId()) );
        }
        affectedKeys.add( EnqueueAdapter.makeKey(expectedState.getBibliographicAgencyId(), expectedState.getBibliographicRecordId()) );
        entityManager.merge(expectedState);
        return affectedKeys;
    }

}
