package dk.dbc.search.solrdocstore.logic;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import jakarta.ejb.EJBException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Objects;
import java.util.stream.Stream;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.FBS;
import static dk.dbc.search.solrdocstore.jpa.LibraryType.NonFBS;
import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;

@Stateless
public class HoldingsToBibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsToBibliographicBean.class);

    @Inject
    public OpenAgencyBean openAgency;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager em;

    @Inject
    public BibliographicRetrieveBean brBean;

    @Timed
    public void updateHolding(int agencyId, String bibliographicRecordId, boolean delete, EnqueueCollector enqueue) {
        if (agencyId == COMMON_AGENCY) {
            return; // Common agency cannot have holdings
        }
        updateHolding(agencyId, delete, bibliographicRecordId)
                .forEach(b -> enqueue.add(b, QueueType.HOLDING, QueueType.UNITHOLDING, QueueType.WORKHOLDING));
    }

    @Timed
    public void updateBibliographic(int agencyId, String bibliographicRecordId, boolean deleted, EnqueueCollector enqueue) {
        updateBibliographic(agencyId, bibliographicRecordId, deleted)
                .forEach(b -> enqueue.add(b, QueueType.HOLDING, QueueType.UNITHOLDING, QueueType.WORKHOLDING));
    }

    private Stream<BibliographicEntity> updateHolding(int agencyId, boolean delete, String bibliographicRecordId) {
        switch (retryingLookup(agencyId).getLibraryType()) {
            case NonFBS:
                if (delete) {
                    return detachHolding(agencyId, bibliographicRecordId);
                } else {
                    return attachHolding(agencyId, bibliographicRecordId);
                }
            case FBS: {
                if (delete) {
                    return detachHolding(agencyId, bibliographicRecordId);
                } else {
                    return attachToLocalOrCommon(agencyId, bibliographicRecordId, true);
                }
            }
            default:
                break;
        }
        return Stream.empty();
    }

    private OpenAgencyEntity retryingLookup(int agencyId) throws RuntimeException {
        for (int i = 0 ; i < 3 ; i++) {
            try {
                return openAgency.lookup(agencyId);
            } catch (EJBException e) {
                if (i == 2)
                    throw e;
            }
        }
        throw new IllegalStateException("Cannot get here");
    }

    private Stream<BibliographicEntity> updateBibliographic(int agencyId, String bibliographicRecordId, boolean deleted) {
        if (agencyId == COMMON_AGENCY) {
            if (deleted) {
                return removeAllHoldingsFromCommon(bibliographicRecordId);
            } else {
                return attachHoldingsToCommon(bibliographicRecordId);
            }
        } else {
            switch (openAgency.lookup(agencyId).getLibraryType()) {
                case NonFBS:
                    if (deleted) {
                        return detachBibliographic(agencyId, bibliographicRecordId);
                    } else {
                        return attachBibliographic(agencyId, bibliographicRecordId);
                    }
                case FBS: {
                    if (deleted) {
                        return moveToCommon(agencyId, bibliographicRecordId);
                    } else {
                        return attachToLocalOrCommon(agencyId, bibliographicRecordId, false);
                    }
                }
                default:
                    return Stream.empty();
            }
        }
    }

    private Stream<BibliographicEntity> removeAllHoldingsFromCommon(String bibliographicRecordId) {
        log.debug("removeAllHoldingsFromCommon");
        return em.createQuery(
                "SELECT h FROM HoldingsToBibliographicEntity h WHERE " +
                "h.bibliographicRecordId=:bibId",
                HoldingsToBibliographicEntity.class)
                .setParameter("bibId", bibliographicRecordId)
                .getResultStream()
                .map(entity -> {
                    if (entity.getBibliographicAgencyId() == COMMON_AGENCY) {
                        em.remove(entity);
                        return null;
                    } else if (entity.getIsCommonDerived()) {
                        entity.setIsCommonDerived(false);
                        em.merge(entity);
                        return findLocalRecord(entity.getBibliographicAgencyId(), bibliographicRecordId, false);
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull);
    }

    private Stream<BibliographicEntity> attachHoldingsToCommon(String bibliographicRecordId) {
        log.debug("attachHoldingsToCommon");
        BibliographicEntity commonRecord = findCommonRecord(bibliographicRecordId, false);
        if (commonRecord == null) {
            log.warn("No common record to attach to for id: {}", bibliographicRecordId);
            return Stream.empty();
        }
        return em.createQuery("SELECT h FROM HoldingsItemEntity h WHERE " +
                              "h.bibliographicRecordId=:bibId",
                              HoldingsItemEntity.class)
                .setParameter("bibId", bibliographicRecordId)
                .getResultStream()
                .map(entity -> {
                    log.debug("entity = {}", entity);
                    if (openAgency.lookup(entity.getAgencyId()).getLibraryType() == FBS) {
                        HoldingsToBibliographicEntity existingEntity = find(entity.getAgencyId(), bibliographicRecordId);
                        if (existingEntity == null) {
                            em.persist(new HoldingsToBibliographicEntity(entity.getAgencyId(), COMMON_AGENCY, bibliographicRecordId, true));
                        } else if (!existingEntity.getIsCommonDerived()) {
                            existingEntity.setIsCommonDerived(true);
                            em.merge(existingEntity);
                            if (existingEntity.getBibliographicAgencyId() != COMMON_AGENCY) {
                                return em.find(BibliographicEntity.class, new AgencyClassifierItemKey(existingEntity.getBibliographicAgencyId(), "katalog", bibliographicRecordId));
                            }
                        }
                    }
                    return null;
                })
                .filter(Objects::nonNull);
    }

    /**
     * Try to find holdings and attach
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return list of affected
     */
    private Stream<BibliographicEntity> attachBibliographic(int agencyId, String bibliographicRecordId) {
        log.debug("tryAttach");
        HoldingsToBibliographicEntity entity = find(agencyId, bibliographicRecordId);
        if (entity == null) {
            HoldingsItemEntity holdings = findHoldings(agencyId, bibliographicRecordId);
            if (holdings != null) {
                em.persist(new HoldingsToBibliographicEntity(agencyId, agencyId, bibliographicRecordId, false));
            }
        }
        return Stream.empty();
    }

    /**
     * Try to detach holdings for an existing bibliographic record (cannot be common)
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return list of affected
     */
    private Stream<BibliographicEntity> detachBibliographic(int agencyId, String bibliographicRecordId) {
        log.debug("tryDetach");
        HoldingsToBibliographicEntity entity = find(agencyId, bibliographicRecordId);
        if (entity != null) {
            em.remove(entity);
        }
        return Stream.empty();
    }

    /**
     * Try to attach holdings to own record
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return list of affected
     */
    private Stream<BibliographicEntity> attachHolding(int agencyId, String bibliographicRecordId) {
        log.debug("attach");
        BibliographicEntity bibl = findLocalRecord(agencyId, bibliographicRecordId, false);
        if (bibl != null) {
            HoldingsItemEntity holdings = findHoldings(agencyId, bibliographicRecordId);
            if (holdings != null) {
                em.persist(new HoldingsToBibliographicEntity(agencyId, agencyId, bibliographicRecordId, false));
            }
            return Stream.of(bibl);
        }
        return Stream.empty();
    }

    /**
     * Try to detach holdings from own record
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return list of affected
     */
    private Stream<BibliographicEntity> detachHolding(int agencyId, String bibliographicRecordId) {
        log.debug("detach");
        HoldingsToBibliographicEntity entity = find(agencyId, bibliographicRecordId);
        if (entity != null) {
            em.remove(entity);
            if (entity.getBibliographicAgencyId() == COMMON_AGENCY) {
                BibliographicEntity bibl = findCommonRecord(bibliographicRecordId, false);
                if (bibl != null) {
                    return Stream.of(bibl);
                }
            } else {
                BibliographicEntity bibl = findLocalRecord(agencyId, bibliographicRecordId, false);
                if (bibl != null) {
                    return Stream.of(bibl);
                }
            }
        }
        return Stream.empty();
    }

    /**
     * Try to attach holdings to own or common record
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @param includeSelf           am i affected self?
     * @return list of affected
     */
    private Stream<BibliographicEntity> attachToLocalOrCommon(int agencyId, String bibliographicRecordId, boolean includeSelf) {
        if (findHoldings(agencyId, bibliographicRecordId) == null)
            return Stream.empty(); // Nothing to attach to
        log.debug("attachToCommon");
        Stream.Builder<BibliographicEntity> builder = Stream.builder();
        BibliographicEntity bibl = findLocalRecord(agencyId, bibliographicRecordId, false);
        BibliographicEntity common = findCommonRecord(bibliographicRecordId, false);
        boolean isCommonDerived = common != null;
        HoldingsToBibliographicEntity entity = find(agencyId, bibliographicRecordId);
        if (bibl != null) { // Attach to own
            if (includeSelf) {
                builder.add(bibl);
            }
            if (entity == null) {
                em.persist(new HoldingsToBibliographicEntity(agencyId, agencyId, bibliographicRecordId, isCommonDerived));
            } else if (entity.getIsCommonDerived() != isCommonDerived ||
                       entity.getBibliographicAgencyId() != agencyId) {
                // Move to own bibl
                entity.setBibliographicAgencyId(agencyId);
                entity.setIsCommonDerived(isCommonDerived);
                em.merge(entity);
                if (isCommonDerived) {
                    builder.add(common);
                }
            }
        } else if (common != null) { // Attach to common
            builder.add(common);
            if (entity == null) {
                em.persist(new HoldingsToBibliographicEntity(agencyId, COMMON_AGENCY, bibliographicRecordId, isCommonDerived));
            } else if (entity.getIsCommonDerived() != isCommonDerived ||
                       entity.getBibliographicAgencyId() != agencyId) {
                // Move to own bibl
                entity.setBibliographicAgencyId(agencyId);
                entity.setIsCommonDerived(isCommonDerived);
                em.merge(entity);
            }
        } // Nothing to attach to
        return builder.build();
    }

    /**
     * Try to move holdings to common record (own record is deleted)
     *
     * @param agencyId              agency
     * @param bibliographicRecordId record
     * @return list of affected
     */
    private Stream<BibliographicEntity> moveToCommon(int agencyId, String bibliographicRecordId) {
        log.debug("tryMoveToCommon");
        HoldingsToBibliographicEntity entity = find(agencyId, bibliographicRecordId);
        BibliographicEntity common = findCommonRecord(bibliographicRecordId, false);
        if (common != null) {
            if (entity != null && entity.getBibliographicAgencyId() != COMMON_AGENCY) {
                entity.setBibliographicAgencyId(COMMON_AGENCY);
                entity.setIsCommonDerived(true);
                em.merge(entity);
            }
            return Stream.of(common);
        } else if (entity != null) {
            em.remove(entity);
        }
        return Stream.empty();
    }

    private HoldingsToBibliographicEntity find(int agencyId, String bibliographicRecordId) {
        return em.find(HoldingsToBibliographicEntity.class,
                       new HoldingsToBibliographicKey(agencyId, bibliographicRecordId));
    }

    private BibliographicEntity findLocalRecord(int agencyId, String bibliographicRecordId, boolean allowDeleted) {
        BibliographicEntity record = em.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, "katalog", bibliographicRecordId));
        return record != null && ( allowDeleted || !record.isDeleted() ) ? record : null;
    }

    private HoldingsItemEntity findHoldings(int agencyId, String bibliographicRecordId) {
        HoldingsItemEntity holdings = em.find(HoldingsItemEntity.class, new AgencyItemKey(agencyId, bibliographicRecordId));
        return holdings == null || holdings.getIndexKeys().isEmpty() ? null : holdings;
    }

    private BibliographicEntity findCommonRecord(String bibliographicRecordId, boolean allowDeleted) {
        BibliographicEntity record = em.find(BibliographicEntity.class, new AgencyClassifierItemKey(COMMON_AGENCY, "basis", bibliographicRecordId));
        return record != null && ( allowDeleted || !record.isDeleted() ) ? record : null;
    }
}
