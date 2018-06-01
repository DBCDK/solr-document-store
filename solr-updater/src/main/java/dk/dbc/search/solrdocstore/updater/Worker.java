package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.pgqueue.consumer.FatalQueueError;
import dk.dbc.pgqueue.consumer.JobConsumer;
import dk.dbc.pgqueue.consumer.JobMetaData;
import dk.dbc.pgqueue.consumer.NonFatalQueueError;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.pgqueue.consumer.QueueWorker;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.IOException;
import java.sql.Connection;
import java.util.concurrent.TimeUnit;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    Metrics metricRegistry;

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @PostConstruct
    public void init() {
        this.worker = QueueWorker.builder(QueueJob.STORAGE_ABSTRACTION)
                .skipDuplicateJobs(QueueJob.DEDUPLICATE_ABSTRACTION)
                .dataSource(dataSource)
                .consume(config.getQueues())
                .databaseConnectThrottle(config.getDatabaseConnectThrottle())
                .failureThrottle(config.getFailureThrottle())
                .emptyQueueSleep(config.getEmptyQueueSleep())
                .rescanEvery(config.getRescanEvery())
                .idleRescanEvery(config.getIdleRescanEvery())
                .maxTries(config.getMaxTries())
                .maxQueryTime(config.getMaxQueryTime())
                .metricRegistry(metricRegistry.getMetrics())
                .build(config.getThreads(),
                       this::makeWorker);
        this.worker.start();
    }

    @PreDestroy
    public void destroy() {
        this.worker.stop();
        this.worker.awaitTermination(1, TimeUnit.MINUTES);
    }

    public JobConsumer<QueueJob> makeWorker() {
        return new JobConsumer<QueueJob>() {
            @Override
            public void accept(Connection connection, QueueJob job, JobMetaData metaData) throws FatalQueueError, NonFatalQueueError, PostponedNonFatalQueueError {
                log.info("job = {}, metadata = {}", job, metaData);
                try {
                    JsonNode sourceDoc = docProducer.fetchSourceDoc(job);
                    SolrInputDocument solrDocument = docProducer.createSolrDocument(sourceDoc);
                    String bibliographicShardId = docProducer.bibliographicShardId(sourceDoc);
                    docProducer.deleteSolrDocuments(bibliographicShardId, job.getCommitwithin());

                    docProducer.deploy(solrDocument, job.getCommitwithin());
                } catch (IOException ex) {
                    throw new NonFatalQueueError(ex);
                } catch (SolrServerException ex) {
                    throw new FatalQueueError(ex);
                }
            }
        };
    }

}
