package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.hazelcast.util.executor.ManagedExecutorService;
import dk.dbc.log.DBCTrackedLogContext;
import dk.dbc.log.LogWith;
import dk.dbc.pgqueue.consumer.FatalQueueError;
import dk.dbc.pgqueue.consumer.JobConsumer;
import dk.dbc.pgqueue.consumer.JobMetaData;
import dk.dbc.pgqueue.consumer.NonFatalQueueError;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.pgqueue.consumer.QueueWorker;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.IOException;
import java.sql.Connection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.DependsOn;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.sql.DataSource;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.microprofile.metrics.MetricRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.log.LogWith.track;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
@DependsOn(value = "DatabaseMigrator")
public class Worker {

    private static final Logger log = LoggerFactory.getLogger(Worker.class);
    private QueueWorker worker;

    @Inject
    Config config;

    @Inject
    DocProducer docProducer;

    @Inject
    DocStasher docStasher;

    @Inject
    MetricRegistry metrics;

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @Resource(type = ManagedExecutorService.class, lookup = "java:comp/DefaultManagedExecutorService")
    ExecutorService es;

    private Set<SolrCollection> solrCollections;

    @PostConstruct
    public void init() {
        this.solrCollections = config.getSolrCollections();
        this.worker = QueueWorker.builder(QueueJob.STORAGE_ABSTRACTION)
                .skipDuplicateJobs(QueueJob.DEDUPLICATE_ABSTRACTION)
                .dataSource(dataSource)
                .consume(config.getQueues())
                .databaseConnectThrottle(config.getDatabaseConnectThrottle())
                .failureThrottle(config.getFailureThrottle())
                .emptyQueueSleep(config.getEmptyQueueSleep())
                .window(config.getQueueWindow())
                .rescanEvery(config.getRescanEvery())
                .idleRescanEvery(config.getIdleRescanEvery())
                .maxTries(config.getMaxTries())
                .maxQueryTime(config.getMaxQueryTime())
                .metricRegistryMicroProfile(metrics)
                .build(config.getThreads(),
                       this::makeWorker);
        this.worker.start();
    }

    @PreDestroy
    public void destroy() {
        this.worker.stop();
        this.worker.awaitTermination(1, TimeUnit.MINUTES);
    }

    public List<String> hungThreads() {
        if (worker == null)
            return Collections.singletonList("consumer-not-started");
        return worker.hungThreads();
    }

    public JobConsumer<QueueJob> makeWorker() {
        return (Connection connection, QueueJob job, JobMetaData metaData) -> {
            try (LogWith logWith = track(null)) {
                log.info("job = {}, metadata = {}", job, metaData);

                String pid = new StringBuilder()
                        .append(job.getAgencyId())
                        .append('-')
                        .append(job.getClassifier())
                        .append(':')
                        .append(job.getBibliographicRecordId())
                        .toString();

                JsonNode sourceDoc = docProducer.fetchSourceDoc(job);

                sourceDoc.deepCopy();
                List<Runnable> tasks = solrCollections.stream()
                        .map(solrCollection -> processForOneCollection(sourceDoc.deepCopy(), solrCollection, pid, job.getCommitwithin()))
                        .collect(Collectors.toList());
                try {
                    switch (tasks.size()) {
                        case 0:
                            throw new IllegalStateException("No collection to put " + pid + " into");
                        case 1:
                            tasks.get(0).run();
                        default: {
                            RuntimeException rex = null;
                            List<Future<?>> futures = tasks.stream()
                                    .map(es::submit)
                                    .collect(Collectors.toList());
                            for (Future<?> future : futures) {
                                try {
                                    future.get();
                                } catch (InterruptedException ex) {
                                    rex = new RuntimeException(ex);
                                } catch (ExecutionException ex) {
                                    Throwable cause = ex.getCause();
                                    if (cause instanceof RuntimeException) {
                                        rex = (RuntimeException) cause;
                                    } else {
                                        rex = new RuntimeException(cause);
                                    }
                                } catch (CancellationException ex) {
                                    rex = ex;
                                }
                            }
                            if (rex != null)
                                throw rex;
                        }
                        throw new AssertionError();
                    }
                } catch (RethrowableException ex) {
                    ex.throwAs(IOException.class);
                    ex.throwAs(SolrServerException.class);
                    throw new FatalQueueError(ex);
                }
            } catch (IOException ex) {
                throw new NonFatalQueueError(ex);
            } catch (SolrServerException ex) {
                throw new FatalQueueError(ex);
            }
        };
    }

    public Runnable processForOneCollection(JsonNode sourceDoc, SolrCollection collection, String pid, Integer commitWithin) {
        return () -> {
            try (DBCTrackedLogContext logContext = new DBCTrackedLogContext()
                    .with("pid", pid)
                    .with("solrCollection", collection.getName())) {
                SolrInputDocument solrDocument = docProducer.createSolrDocument(sourceDoc, collection);
                String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);
                int nestedDocumentCount = docProducer.getNestedDocumentCount(bibliographicShardId, collection);

                docProducer.deleteSolrDocuments(bibliographicShardId, nestedDocumentCount, collection, commitWithin);

                docProducer.deploy(solrDocument, collection, commitWithin);
                int count = 1;
                if (solrDocument != null && solrDocument.hasChildDocuments())
                    count += solrDocument.getChildDocumentCount();
                log.info("Deleted {} record(s) and added {} to SolR", nestedDocumentCount + 1, count);
                docStasher.store(pid, solrDocument);
            } catch (PostponedNonFatalQueueError | IOException | SolrServerException ex) {
                throw new RethrowableException(ex);
            }
        };
    }
}
