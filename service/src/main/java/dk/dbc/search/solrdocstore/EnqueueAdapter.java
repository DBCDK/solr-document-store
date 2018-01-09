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

    public static void enqueueAll(EnqueueSupplierBean queue, Set<AgencyItemKey> setOfT, Optional<Integer> commitWithin) {
        for (AgencyItemKey t: setOfT) {
            try {
                queue.getManifestationEnqueueService().enqueue(t,commitWithin.orElse(null));
            } catch (SQLException e) {
                log.error("Error enqueuing item: " + t);
                log.debug("Error enqueuing item: " + t,e);
                throw new PersistenceException(e);
            }
        }
    }

    public static Set<AgencyItemKey> setOfOne(int agency, String recordId) {
        HashSet<AgencyItemKey> s = new HashSet<>();
        s.add( new AgencyItemKey(agency,recordId));
        return s;
    }

    public static AgencyItemKey makeKey(int agency, String bibliographicRecordId){
        return new AgencyItemKey( agency, bibliographicRecordId );
    }

    public static Set<AgencyItemKey> makeSet() {
        return new HashSet<>();
    }
}
