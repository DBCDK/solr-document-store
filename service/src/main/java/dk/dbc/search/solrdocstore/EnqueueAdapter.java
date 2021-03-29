package dk.dbc.search.solrdocstore;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.PersistenceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
public class EnqueueAdapter {

    @Inject
    Config config;

    @Inject
    EnqueueSupplierBean queue;

    private static Logger log = LoggerFactory.getLogger(EnqueueAdapter.class);

    public void enqueueAll(Set<AgencyClassifierItemKey> agencyItemKeys) {
        for (AgencyClassifierItemKey k : agencyItemKeys) {
            try {
                // If delete marked, set postponed option
                Optional<Long> postponed = k.isDeleteMarked() ? Optional.of(config.getDeleteMarkedDelay()) : Optional.empty();
                queue.getManifestationEnqueueService().enqueue(k, postponed);
            } catch (SQLException e) {
                log.error("Error enqueuing item: " + k);
                log.debug("Error enqueuing item: " + k, e);
                throw new PersistenceException(e);
            }
        }
    }

    public void enqueueAllHoldingsPostponed(Set<AgencyClassifierItemKey> agencyItemKeys) {
        for (AgencyClassifierItemKey k : agencyItemKeys) {
            try {
                // If delete marked, set postponed option
                Optional<Long> postponed = Optional.of(config.getHoldingQueueDelay());
                queue.getManifestationEnqueueService().enqueue(k, postponed);
            } catch (SQLException e) {
                log.error("Error enqueuing item: " + k);
                log.debug("Error enqueuing item: " + k, e);
                throw new PersistenceException(e);
            }
        }
    }

    public static Set<AgencyClassifierItemKey> setOfOne(int agency, String classifier, String recordId) {
        HashSet<AgencyClassifierItemKey> s = new HashSet<>();
        s.add(makeKey(agency, classifier, recordId));
        return s;
    }

    public static AgencyClassifierItemKey makeKey(int agency, String classifier, String bibliographicRecordId) {
        return new AgencyClassifierItemKey(agency, classifier, bibliographicRecordId);
    }

    public static Set<AgencyClassifierItemKey> makeSet() {
        return new HashSet<>();
    }
}
