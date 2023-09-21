package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.sql.SQLException;
import java.util.HashSet;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class MockEnqueueCollector extends EnqueueCollector {

    private final HashSet<String> jobs = new HashSet<>();

    @Override
    public void add(BibliographicEntity entity, QueueType supplier) {
        QueueJob queueJob = entity.asQueueJobFor(supplier);
        if (queueJob != null) {
            String jobName = supplier.toString() + ":" + queueJob.getJobId();
            jobs.add(jobName);
        }
    }

    @Override
    public void commit() throws SQLException {
    }

    public HashSet<String> getJobs() {
        return jobs;
    }

    public void clear() {
        jobs.clear();
    }
}
