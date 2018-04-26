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

@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    LibraryConfig libraryConfig;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    BibliographicRetrieveBean brBean;

    @Timed
    public Set<AgencyClassifierItemKey> tryToAttachToBibliographicRecord(int hAgencyId, String hBibliographicRecordId) {
        log.info("Update HoldingsToBibliographic for {} {}", hAgencyId, hBibliographicRecordId);
        LibraryType libraryType = libraryConfig.getLibraryType(hAgencyId);

        switch (libraryType) {
            case NonFBS:
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, hBibliographicRecordId, false, hAgencyId);

            case FBS: {
                String liveBibliographicRecordId = findLiveBibliographicRecordId(hBibliographicRecordId);
                boolean isCommonDerived = bibliographicEntityExists(870970, liveBibliographicRecordId);
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, liveBibliographicRecordId, isCommonDerived, hAgencyId, LibraryType.COMMON_AGENCY);
            }
            case FBSSchool: {
                String liveBibliographicRecordId = findLiveBibliographicRecordId(hBibliographicRecordId);
                return attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, liveBibliographicRecordId, false, hAgencyId, LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY);
            }
        }
        return Collections.emptySet();
    }

    @Timed
    public Set<AgencyClassifierItemKey> recalcAttachments(String newRecordId, Set<String> supersededRecordIds) {
        Map<Integer, LibraryType> map = new HashMap<>();
        Set<AgencyClassifierItemKey> keysUpdated = EnqueueAdapter.makeSet();

        for (String supersededRecordId : supersededRecordIds) {
            List<HoldingsToBibliographicEntity> recalcCandidates = findRecalcCandidates(supersededRecordId);
            for (HoldingsToBibliographicEntity h2b : recalcCandidates) {

                LibraryType libraryType = getFromCache(map, h2b.getHoldingsAgencyId());
                switch (libraryType) {
                    case NonFBS:
                        break;
                    case FBS: {
                        boolean isCommonDerived = bibliographicEntityExists(870970, newRecordId);
                        keysUpdated.addAll(attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, isCommonDerived, h2b.getBibliographicAgencyId(), LibraryType.COMMON_AGENCY));
                        break;
                    }
                    case FBSSchool:
                        keysUpdated.addAll(attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, false, h2b.getBibliographicAgencyId(), LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY));
                        break;
                }
            }
        }
        return keysUpdated;
    }

    private LibraryType getFromCache(Map<Integer, LibraryType> map, int holdingsAgencyId) {
        LibraryType t = map.computeIfAbsent(holdingsAgencyId, k -> libraryConfig.getLibraryType(holdingsAgencyId));
        return t;
    }

    @Timed
    public List<HoldingsToBibliographicEntity> getRelatedHoldingsToBibliographic(int bibliographicAgencyId, String bibliographicRecordId) {
        return entityManager.createQuery(
                "SELECT h FROM HoldingsToBibliographicEntity h WHERE " +
                "h.bibliographicRecordId=:bibId and " +
                "h.bibliographicAgencyId=:agencyId", HoldingsToBibliographicEntity.class)
                .setParameter("agencyId", bibliographicAgencyId)
                .setParameter("bibId", bibliographicRecordId).getResultList();
    }

    public List<HoldingsToBibliographicEntity> findRecalcCandidates(String bibliographicRecordId) {

        Query q = entityManager.createQuery(
                "SELECT h FROM HoldingsToBibliographicEntity h " +
                "WHERE h.bibliographicRecordId = :recId", HoldingsToBibliographicEntity.class);
        q.setParameter("recId", bibliographicRecordId);
        return q.getResultList();
    }

    private String findLiveBibliographicRecordId(String bibliographicRecordId) {
        BibliographicToBibliographicEntity e = entityManager.find(BibliographicToBibliographicEntity.class, bibliographicRecordId);
        if (e == null) {
            return bibliographicRecordId;
        } else {
            return e.getLiveBibliographicRecordId();
        }
    }

    private Set<AgencyClassifierItemKey> attachToBibliographicRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, String bibliographicRecordId, boolean isCommonDerived, int... bibliographicAgencyPriorities) {
        for (int i = 0 ; i < bibliographicAgencyPriorities.length ; i++) {
            Set<AgencyClassifierItemKey> keysUpdated =
                    attachIfExists(
                            bibliographicAgencyPriorities[i],
                            bibliographicRecordId,
                            holdingsAgencyId,
                            holdingsBibliographicRecordId,
                            isCommonDerived);
            if (!keysUpdated.isEmpty()) {
                return keysUpdated;
            }
        }
        return Collections.emptySet();
    }

    private Set<AgencyClassifierItemKey> attachIfExists(int bibliographicAgencyId, String bibliographicRecordId, int holdingAgencyId, String holdingBibliographicRecordId, boolean isCommonDerived) {
        if (bibliographicEntityExists(bibliographicAgencyId, bibliographicRecordId)) {
            HoldingsToBibliographicEntity expectedState = new HoldingsToBibliographicEntity(holdingAgencyId, holdingBibliographicRecordId, bibliographicAgencyId, bibliographicRecordId, isCommonDerived);
            return attachToAgency(expectedState);
        }
        return Collections.emptySet();
    }

    public boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = brBean.getBibliographicEntity(agencyId, bibliographicRecordId);
        return ( ( e != null ) && ( !e.isDeleted() ) );
    }

    public Set<AgencyClassifierItemKey> attachToAgency(HoldingsToBibliographicEntity expectedState) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, expectedState.asKey());
        Set<AgencyClassifierItemKey> affectedKeys = EnqueueAdapter.makeSet();

        if (( foundEntity != null ) && !foundEntity.equals(expectedState)) {
            List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(foundEntity.getBibliographicAgencyId(), foundEntity.getBibliographicRecordId());
            for (BibliographicEntity entityAffected : entitiesAffected) {
                affectedKeys.add(entityAffected.asAgencyClassifierItemKey());
            }
        }
        List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(expectedState.getBibliographicAgencyId(), expectedState.getBibliographicRecordId());
        for (BibliographicEntity entityAffected : entitiesAffected) {
            affectedKeys.add(entityAffected.asAgencyClassifierItemKey());
        }
        entityManager.merge(expectedState);
        return affectedKeys;
    }

}
