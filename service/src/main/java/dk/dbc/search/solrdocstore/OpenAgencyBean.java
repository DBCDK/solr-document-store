package dk.dbc.search.solrdocstore;

import java.util.List;
import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static javax.ejb.TransactionAttributeType.REQUIRES_NEW;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class OpenAgencyBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyBean.class);

    private static final long MISSING_AGENCY_TIMEOUT = 60_000L;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    OpenAgencyProxyBean proxy;

    public RecordType getRecordType(int agency) {
        switch (agency) {
            case LibraryType.COMMON_AGENCY:  // Common Record Agency For School Libraries
            case LibraryType.SCHOOL_COMMON_AGENCY:  // Common Record Agency For All Libraries
                return RecordType.CommonRecord;
            default:
                return RecordType.SingleRecord;
        }
    }

    @Timed
    public OpenAgencyEntity lookup(int agencyId) {
        return lookup(agencyId, true);
    }

    public OpenAgencyEntity lookup(int agencyId, boolean fail_missing) {
        OpenAgencyEntity entity = entityManager.find(OpenAgencyEntity.class, agencyId);

        // If someone keeps hammering with an unknown agencyid, multiple requests
        if (entity == null ||
            entity.getLibraryType() == LibraryType.Missing && entity.getFetchedAgeMs() > MISSING_AGENCY_TIMEOUT) {
            entity = proxy.loadOpenAgencyEntry(agencyId);
            entityManager.persist(entity);
        }
        if (entity.getLibraryType() == LibraryType.Missing) {
            log.warn("Agency is missing");
            if (fail_missing) {
                throw new EJBException("Cannot find openagency entry for: " + agencyId);
            }
            return null;
        }
        return entity;
    }

    /**
     * Run through known open agency entries,
     * call agencyHasChanged if an agency has new values, otherwise set
     * fetched-now value to indicate last time it was fetched from oa with this
     * value
     */
    @Timed
    public void verifyOpenAgencyCache() {
        List<OpenAgencyEntity> entries = entityManager.createQuery("SELECT oa FROM OpenAgencyEntity oa", OpenAgencyEntity.class)
                .getResultList();
        for (OpenAgencyEntity entry : entries) {
            if (entry.getLibraryType() == LibraryType.Missing) {
                continue;
            }
            log.debug("verifying openagency status for: {}", entry.getAgencyId());
            OpenAgencyEntity newEntry = proxy.loadOpenAgencyEntry(entry.getAgencyId());
            if (!entry.equals(newEntry)) {
                agencyHasChanged(entry, newEntry);
            } else {
                entry.setFetchedNow();
                entry.setValid(true); // In case openagency has reverted back to our state
            }
        }
    }

    /**
     * Migrate open agency.
     * <p>
     * - If live holding exists log error
     * <p>
     * - If no live holdings exists clear h2b and old holdings
     * <p>
     * - If no holdings exists (strange why should oa have been cached then?)
     * then just update the cache
     *
     * @param oldEntry how things was before
     * @param newEntry how things are supposed to be now
     */
    void agencyHasChanged(OpenAgencyEntity oldEntry, OpenAgencyEntity newEntry) {
        int agencyId = oldEntry.getAgencyId();
        List<Boolean> booleans = entityManager.createQuery("SELECT NEW java.lang.Boolean(h.hasLiveHoldings) FROM HoldingsItemEntity h WHERE h.agencyId = :agencyId GROUP BY h.hasLiveHoldings", Boolean.class)
                .setParameter("agencyId", agencyId)
                .getResultList();
        log.debug("has live holdings for {} is {}", agencyId, booleans);
        if (booleans.contains(true)) {
            log.error("Cannot migrate OpenAgency entry for {}, has live holdings ({} -> {})", agencyId, oldEntry, newEntry);
            oldEntry.setValid(false);
            entityManager.merge(oldEntry);
        } else if (booleans.contains(false)) {
            log.warn("Migrate OpenAgency entry for {}, has no live holdings ({} -> {})", agencyId, oldEntry, newEntry);
            purgeHoldingFor(agencyId);
            entityManager.merge(newEntry);
        } else {
            log.warn("Migrate OpenAgency entry for {}, has no holdings ({} -> {})", agencyId, oldEntry, newEntry);
            oldEntry.setFetched(newEntry.getFetched());
            oldEntry.setLibraryType(newEntry.getLibraryType());
            oldEntry.setPartOfBibDk(newEntry.getPartOfBibDk());
            oldEntry.setPartOfDanbib(newEntry.getPartOfDanbib());
            entityManager.merge(oldEntry);
        }
    }

    /**
     * Remove all trace of existing holdings
     *
     * @param agencyId agency that needs purging
     */
    void purgeHoldingFor(int agencyId) {
        List<HoldingsToBibliographicEntity> h2b = entityManager.createQuery("SELECT h FROM HoldingsToBibliographicEntity h WHERE h.holdingsAgencyId = :agencyId", HoldingsToBibliographicEntity.class)
                .setParameter("agencyId", agencyId)
                .getResultList();
        for (HoldingsToBibliographicEntity entity : h2b) {
            entityManager.remove(entity);
        }
        List<HoldingsItemEntity> h = entityManager.createQuery("SELECT h FROM HoldingsItemEntity h WHERE h.agencyId = :agencyId", HoldingsItemEntity.class)
                .setParameter("agencyId", agencyId)
                .getResultList();
        for (HoldingsItemEntity entity : h) {
            entityManager.remove(entity);
        }
    }

    /**
     * For updating part_of_bibdk from real OpenAgency Response
     *
     * @param agencyId agency that needs real part_of_bibdk value
     */
    @TransactionAttribute(REQUIRES_NEW)
    public void migratePartOfBibDk(int agencyId) {
        OpenAgencyEntity local = lookup(agencyId, false);
        if (local == null) {
            log.error("Could not get local copy of OpenAgencyCache {}", agencyId);
            return;
        }
        OpenAgencyEntity remote = proxy.loadOpenAgencyEntry(agencyId);
        local.setPartOfBibDk(remote.getPartOfBibDk());
        entityManager.merge(local);
    }
}
