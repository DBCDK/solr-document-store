package dk.dbc.search.solrdocstore.updater;

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
import dk.dbc.solrdocstore.updater.businesslogic.SolrDocStoreResponse;
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
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
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
@DependsOn(value = {"DatabaseMigrator", "LibraryRuleProviderBean", "ProfileProviderBean"})
public class Worker {

    private static final Logger log = LoggerFactory.getLogger(Worker.class);
    private QueueWorker worker;

    @Inject
    Config config;

    @Inject
    DocProducer docProducer;

    @Inject
    MetricRegistry metrics;

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @Resource(type = ManagedExecutorService.class, lookup = "java:comp/DefaultManagedExecutorService")
    ExecutorService es;

    @Resource
    TimerService timerService;

    private Set<SolrCollection> solrCollections;

    @PostConstruct
    public void init() {
        this.solrCollections = config.getSolrCollections();
        this.worker = QueueWorker.builder(QueueJob.STORAGE_ABSTRACTION)
                .skipDuplicateJobs(QueueJob.DEDUPLICATE_ABSTRACTION, true, true)
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
        if (timerService == null) {
            // Unittest immediate startup
            this.worker.start();
        } else {
            TimerConfig timerConfig = new TimerConfig();
            timerConfig.setPersistent(false);
            this.timerService.createSingleActionTimer(config.getStartupDelay(), timerConfig);
        }
    }

    @Timeout
    public void startupTimeout(Timer timer) {
        log.info("Starting worker");
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

                if (!job.isManifestation())
                    throw new FatalQueueError("Not a manifestation");

                String pid = job.getJobId();

                SolrDocStoreResponse sourceDoc = docProducer.fetchSourceDoc(job);
                List<Runnable> tasks = solrCollections.stream()
                        .map(solrCollection -> processForOneCollection(sourceDoc.deepCopy(), solrCollection, pid))
                        .collect(Collectors.toList());
                try {
                    switch (tasks.size()) {
                        case 0:
                            throw new IllegalStateException("No collection to put " + pid + " into");
                        case 1:
                            tasks.get(0).run();
                            break;
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
                    }
                } catch (RuntimeException ex) {
                    Throwable cause = ex;
                    while (cause != null) {
                        if (cause instanceof RethrowableException) {
                            RethrowableException ex1 = (RethrowableException) cause;
                            ex1.throwAs(IOException.class);
                            ex1.throwAs(SolrServerException.class);
                            ex1.throwAs(FatalQueueError.class);
                            ex1.throwAs(NonFatalQueueError.class);
                            ex1.throwAs(PostponedNonFatalQueueError.class);
                            throw new FatalQueueError(ex);
                        }
                        cause = cause.getCause();
                    }
                    throw new FatalQueueError(ex);
                }
            } catch (IOException ex) {
                throw new NonFatalQueueError(ex);
            } catch (SolrServerException ex) {
                throw new FatalQueueError(ex);
            } catch (RuntimeException ex) {
                log.error("Runtime Exception: {}", ex.getMessage());
                log.debug("Runtime Exception: ", ex);
                throw ex;
            }

        };
    }

    public Runnable processForOneCollection(SolrDocStoreResponse sourceDoc, SolrCollection collection, String pid) {
        return () -> {
            try (DBCTrackedLogContext logContext = new DBCTrackedLogContext()
                    .with("pid", pid)
                    .with("solrCollection", collection.getName())) {
                log.info("Building document");
                String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);

                SolrInputDocument solrDocument = docProducer.createSolrDocument(sourceDoc, collection);

                docProducer.deleteSolrDocuments(bibliographicShardId, collection);

                docProducer.deploy(solrDocument, collection);
                log.info("Added {} to SolR", bibliographicShardId);
            } catch (IOException | SolrServerException ex) {
                throw new RethrowableException(ex);
            }
        };
    }
}
