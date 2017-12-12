/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

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
import java.util.logging.Level;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.DependsOn;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.sql.DataSource;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
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

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @PostConstruct
    public void init() {
        this.worker = QueueWorker.builder()
                .dataSource(dataSource)
                .consume(config.getQueues())
                .databaseConnectThrottle(config.getDatabaseConnectThrottle())
                .failureThrottle(config.getFailureThrottle())
                .emptyQueueSleep(config.getEmptyQueueSleep())
                .rescanEvery(config.getRescanEvery())
                .idleRescanEvery(config.getIdleRescanEvery())
                .maxTries(config.getMaxTries())
                .maxQueryTime(config.getMaxQueryTime())
                .build(QueueJob.STORAGE_ABSTRACTION,
                       config.getThreads(),
                       this::makeWorker);
        this.worker.start();
    }

    @PreDestroy
    public void destroy() {
        this.worker.stop();
        this.worker.awaitTermination(1, TimeUnit.MINUTES);
    }

    public JobConsumer<QueueJob> makeWorker() {
        SolrClient client = SolrApi.makeSolrClient(config.getSolrUrl());
        return (Connection connection, QueueJob job, JobMetaData metaData) -> {
            log.debug("job = {}, metadata = {}", job, metaData);

            try {
                docProducer.deploy(job.getAgencyId(), job.getBibliographicRecordId(), client, job.getCommitwithin());
            } catch (IOException ex) {
                throw new NonFatalQueueError(ex);
            } catch (SolrServerException ex) {
                throw new FatalQueueError(ex);
            }
        };
    }

}
