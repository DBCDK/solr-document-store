package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.eclipse.microprofile.metrics.annotation.Timed;
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
    OpenAgencyBean openAgency;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    BibliographicRetrieveBean brBean;

    @Timed(reusable = true)
    public void tryToAttachToBibliographicRecord(int hAgencyId, String hBibliographicRecordId, EnqueueCollector enqueue, QueueType enqueueSource) {
        log.info("Update HoldingsToBibliographic for {} {}", hAgencyId, hBibliographicRecordId);
        LibraryType libraryType = openAgency.lookup(hAgencyId).getLibraryType();

        switch (libraryType) {
            case NonFBS:
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, hBibliographicRecordId, false, enqueue, enqueueSource, hAgencyId);
                break;

            case FBS: {
                String liveBibliographicRecordId = findLiveBibliographicRecordId(hBibliographicRecordId);
                boolean isCommonDerived = bibliographicEntityExists(870970, liveBibliographicRecordId);
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, liveBibliographicRecordId, isCommonDerived, enqueue, enqueueSource, hAgencyId, LibraryType.COMMON_AGENCY);
                break;
            }
            case FBSSchool: {
                String liveBibliographicRecordId = findLiveBibliographicRecordId(hBibliographicRecordId);
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, liveBibliographicRecordId, false, enqueue, enqueueSource, hAgencyId, LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY);
                break;
            }
        }
    }

    @Timed(reusable = true)
    public void recalcAttachments(String newRecordId, Set<String> supersededRecordIds, EnqueueCollector enqueue, QueueType enqueueSource) {
        Map<Integer, LibraryType> map = new HashMap<>();

        for (String supersededRecordId : supersededRecordIds) {
            List<HoldingsToBibliographicEntity> recalcCandidates = findRecalcCandidates(supersededRecordId);
            for (HoldingsToBibliographicEntity h2b : recalcCandidates) {

                LibraryType libraryType = getFromCache(map, h2b.getHoldingsAgencyId());
                switch (libraryType) {
                    case NonFBS:
                        break;
                    case FBS: {
                        boolean isCommonDerived = bibliographicEntityExists(870970, newRecordId);
                        attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, isCommonDerived, enqueue, enqueueSource, h2b.getBibliographicAgencyId(), LibraryType.COMMON_AGENCY);
                        break;
                    }
                    case FBSSchool:
                        attachToBibliographicRecord(h2b.getHoldingsAgencyId(), h2b.getHoldingsBibliographicRecordId(), newRecordId, false, enqueue, enqueueSource, h2b.getBibliographicAgencyId(), LibraryType.SCHOOL_COMMON_AGENCY, LibraryType.COMMON_AGENCY);
                        break;
                    default:
                        throw new AssertionError("Enum has unknown value" + libraryType);
                }
            }
        }
    }

    private LibraryType getFromCache(Map<Integer, LibraryType> map, int holdingsAgencyId) {
        LibraryType t = map.computeIfAbsent(holdingsAgencyId, k -> openAgency.lookup(holdingsAgencyId).getLibraryType());
        return t;
    }

    @Timed(reusable = true)
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

    private void attachToBibliographicRecord(int holdingsAgencyId, String holdingsBibliographicRecordId, String bibliographicRecordId, boolean isCommonDerived, EnqueueCollector enqueue, QueueType enqueueSource, int... bibliographicAgencyPriorities) {
        for (int i = 0 ; i < bibliographicAgencyPriorities.length ; i++) {
            
            boolean didAttach = attachIfExists(
                    bibliographicAgencyPriorities[i],
                            bibliographicRecordId,
                            holdingsAgencyId,
                            holdingsBibliographicRecordId,
                            isCommonDerived,
                            enqueue,
                            enqueueSource);
            if (didAttach) {
                return;
            }
        }
    }

    private boolean attachIfExists(int bibliographicAgencyId, String bibliographicRecordId, int holdingAgencyId, String holdingBibliographicRecordId, boolean isCommonDerived, EnqueueCollector enqueue, QueueType enqueueSource) {
        if (bibliographicEntityExists(bibliographicAgencyId, bibliographicRecordId)) {
            HoldingsToBibliographicEntity expectedState = new HoldingsToBibliographicEntity(holdingAgencyId, holdingBibliographicRecordId, bibliographicAgencyId, bibliographicRecordId, isCommonDerived);
            attachToAgency(expectedState, enqueue, enqueueSource);
            return true;
        }
        return false;
    }

    public boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = brBean.getBibliographicEntity(agencyId, bibliographicRecordId);
        return e != null && !e.isDeleted();
    }

    public void attachToAgency(HoldingsToBibliographicEntity expectedState, EnqueueCollector enqueue, QueueType enqueueSource) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, expectedState.asKey());

        if (foundEntity != null && !foundEntity.equals(expectedState)) {
            List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(foundEntity.getBibliographicAgencyId(), foundEntity.getBibliographicRecordId());
            entitiesAffected.forEach(e -> enqueue.add(e, enqueueSource));
        }
        List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(expectedState.getBibliographicAgencyId(), expectedState.getBibliographicRecordId());
        entitiesAffected.forEach(e -> enqueue.add(e, enqueueSource));
        entityManager.merge(expectedState);
    }

}
