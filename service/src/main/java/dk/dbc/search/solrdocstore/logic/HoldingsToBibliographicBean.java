package dk.dbc.search.solrdocstore.logic;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import java.util.List;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    public OpenAgencyBean openAgency;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

    @Inject
    public BibliographicRetrieveBean brBean;

    @Timed
    public void tryToAttachToBibliographicRecord(int hAgencyId, String hBibliographicRecordId, EnqueueCollector enqueue, QueueType... enqueueSources) {
        log.info("Update HoldingsToBibliographic for {} {}", hAgencyId, hBibliographicRecordId);
        LibraryType libraryType = openAgency.lookup(hAgencyId).getLibraryType();

        switch (libraryType) {
            case NonFBS:
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, false, enqueue, enqueueSources, hAgencyId);
                break;

            case FBS: {
                boolean isCommonDerived = bibliographicEntityExists(870970, hBibliographicRecordId);
                attachToBibliographicRecord(hAgencyId, hBibliographicRecordId, isCommonDerived, enqueue, enqueueSources, hAgencyId, LibraryType.COMMON_AGENCY);
                break;
            }

            default: {
                break;
            }
        }
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

    private void attachToBibliographicRecord(int holdingsAgencyId, String bibliographicRecordId, boolean isCommonDerived, EnqueueCollector enqueue, QueueType[] enqueueSources, int... bibliographicAgencyPriorities) {
        for (int i = 0 ; i < bibliographicAgencyPriorities.length ; i++) {

            boolean didAttach = attachIfExists(bibliographicAgencyPriorities[i],
                                               bibliographicRecordId,
                                               holdingsAgencyId,
                                               isCommonDerived,
                                               enqueue,
                                               enqueueSources);
            if (didAttach) {
                return;
            }
        }
    }

    private boolean attachIfExists(int bibliographicAgencyId, String bibliographicRecordId, int holdingAgencyId, boolean isCommonDerived, EnqueueCollector enqueue, QueueType[] enqueueSources) {
        if (bibliographicEntityExists(bibliographicAgencyId, bibliographicRecordId)) {
            HoldingsToBibliographicEntity expectedState = new HoldingsToBibliographicEntity(holdingAgencyId, bibliographicAgencyId, bibliographicRecordId, isCommonDerived);
            attachToAgency(expectedState, enqueue, enqueueSources);
            return true;
        }
        return false;
    }

    public boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        BibliographicEntity e = brBean.getBibliographicEntity(agencyId, bibliographicRecordId);
        return e != null && !e.isDeleted();
    }

    public void attachToAgency(HoldingsToBibliographicEntity expectedState, EnqueueCollector enqueue, QueueType[] enqueueSources) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, expectedState.asKey());

        if (foundEntity != null && !foundEntity.equals(expectedState)) {
            List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(foundEntity.getBibliographicAgencyId(), foundEntity.getBibliographicRecordId());
            entitiesAffected.forEach(e -> enqueue.add(e, enqueueSources));
        }
        List<BibliographicEntity> entitiesAffected = brBean.getBibliographicEntities(expectedState.getBibliographicAgencyId(), expectedState.getBibliographicRecordId());
        entitiesAffected.forEach(e -> enqueue.add(e, enqueueSources));
        entityManager.merge(expectedState);
    }
}
