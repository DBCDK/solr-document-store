package dk.dbc.search.solrdocstore.updater;

import com.codahale.metrics.MetricRegistry;
import com.fasterxml.jackson.databind.JsonNode;
import dk.dbc.log.LogWith;
import dk.dbc.pgqueue.consumer.FatalQueueError;
import dk.dbc.pgqueue.consumer.JobConsumer;
import dk.dbc.pgqueue.consumer.JobMetaData;
import dk.dbc.pgqueue.consumer.NonFatalQueueError;
import dk.dbc.pgqueue.consumer.QueueWorker;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.io.IOException;
import java.sql.Connection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.DependsOn;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.concurrent.ManagedScheduledExecutorService;
import javax.inject.Inject;
import javax.sql.DataSource;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.common.SolrInputDocument;
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
@LocalBean
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

    @Resource(type = ManagedScheduledExecutorService.class)
    ScheduledExecutorService ses;

    @PostConstruct
    public void init() {
        ses.schedule(() -> {
            log.info("Starting consumer");
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
                    .metricRegistry(metrics)
                    .build(config.getThreads(),
                           this::makeWorker);
            this.worker.start();
        }, 10, TimeUnit.SECONDS);
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
                JsonNode sourceDoc = docProducer.fetchSourceDoc(job);
                SolrInputDocument solrDocument = docProducer.createSolrDocument(sourceDoc);
                String bibliographicShardId = DocProducer.bibliographicShardId(sourceDoc);
                List<String> ids = docProducer.documentsIdsByRoot(bibliographicShardId);

                docProducer.deleteSolrDocuments(bibliographicShardId, ids, job.getCommitwithin());

                docProducer.deploy(solrDocument, job.getCommitwithin());
                StringBuilder pid = new StringBuilder();
                pid.append(job.getAgencyId())
                        .append('-')
                        .append(job.getClassifier())
                        .append(':')
                        .append(job.getBibliographicRecordId());
                int count = 1;
                if (solrDocument != null && solrDocument.hasChildDocuments())
                    count += solrDocument.getChildDocumentCount();
                log.info("Deleted {} record(s) and added {} to SolR", ids.size(), count);
                docStasher.store(pid.toString(), solrDocument);
            } catch (IOException ex) {
                throw new NonFatalQueueError(ex);
            } catch (SolrServerException ex) {
                throw new FatalQueueError(ex);
            }
        };
    }

}
