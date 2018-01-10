package dk.dbc.search.solrdocstore;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.PersistenceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EnqueueAdapter {

    private static Logger log = LoggerFactory.getLogger(EnqueueAdapter.class);

    public static void enqueueAll(EnqueueSupplierBean queue, Set<AgencyItemKey> agencyItemKeys, Optional<Integer> commitWithin) {
        for (AgencyItemKey k: agencyItemKeys) {
            try {
                queue.getManifestationEnqueueService().enqueue(k,commitWithin.orElse(null));
            } catch (SQLException e) {
                log.error("Error enqueuing item: " + k);
                log.debug("Error enqueuing item: " + k,e);
                throw new PersistenceException(e);
            }
        }
    }

    public static Set<AgencyItemKey> setOfOne(int agency, String recordId) {
        HashSet<AgencyItemKey> s = new HashSet<>();
        s.add( makeKey(agency,recordId));
        return s;
    }

    public static AgencyItemKey makeKey(int agency, String bibliographicRecordId){
        return new AgencyItemKey( agency, bibliographicRecordId );
    }

    public static Set<AgencyItemKey> makeSet() {
        return new HashSet<>();
    }
}
