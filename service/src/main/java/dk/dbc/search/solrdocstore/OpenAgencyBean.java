package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.List;
import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class OpenAgencyBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyBean.class);

    private static final ObjectMapper O = new ObjectMapper();
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
        OpenAgencyEntity entity = entityManager.find(OpenAgencyEntity.class, agencyId);

            // If someone keeps hammering with an unknown agencyid, multiple requests
        if (entity == null || ( entity.getLibraryType() == LibraryType.Missing && entity.getFetchedAgeMs() > MISSING_AGENCY_TIMEOUT )) {
            entity = proxy.loadOpenAgencyEntry(agencyId);
            if (entity == null) {
                entity = new OpenAgencyEntity(agencyId, LibraryType.Missing, false);
            }
            entityManager.persist(entity);
        }
        if(entity.getLibraryType() == LibraryType.Missing) {
            throw new EJBException("Cannot find openagency entry for: " + agencyId);
        }
        return entity;
    }

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
            }
        }
    }

    void agencyHasChanged(OpenAgencyEntity oldEntry, OpenAgencyEntity newEntry) {
        int agencyId = oldEntry.getAgencyId();
        List<Boolean> booleans = entityManager.createQuery("SELECT NEW java.lang.Boolean(h.hasLiveHoldings) FROM HoldingsItemEntity h WHERE h.agencyId = :agencyId GROUP BY h.hasLiveHoldings", Boolean.class)
                .setParameter("agencyId", agencyId)
                .getResultList();
        log.debug("has live holdings for {} is {}", agencyId, booleans);
        if (booleans.contains(true)) {
            log.error("Cannot migrate OpenAgency entry for {}, has live holdings ({} -> {})", agencyId, oldEntry, newEntry);
        } else if (booleans.contains(false)) {
            log.warn("Migrate OpenAgency entry for {}, has no live holdings ({} -> {})", agencyId, oldEntry, newEntry);
            purgeHoldingFor(agencyId);
            entityManager.merge(newEntry);
        } else {
            log.warn("Migrate OpenAgency entry for {}, has no holdings ({} -> {})", agencyId, oldEntry, newEntry);
            entityManager.merge(newEntry);
        }
    }

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

}
