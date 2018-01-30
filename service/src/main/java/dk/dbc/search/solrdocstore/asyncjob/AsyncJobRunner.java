/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.asyncjob;

import dk.dbc.search.solrdocstore.Config;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.Lock;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.time.Instant.now;
import static javax.ejb.LockType.READ;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
@Lock(READ)
public class AsyncJobRunner {

    @Inject
    Config config;

    @Resource(type = ManagedExecutorService.class)
    ExecutorService mes;

    private static final Logger log = LoggerFactory.getLogger(AsyncJobRunner.class);

    private final ConcurrentSkipListMap<UUID, AsyncJobHandle> jobs;

    public AsyncJobRunner() {
        this.jobs = new ConcurrentSkipListMap<>();
    }

    /**
     * Clean up jobs before undeploy
     */
    @PreDestroy
    public void destroy() {
        log.info("Shutting down jobs");
        for (AsyncJobHandle handle : jobs.values()) {
            if (handle.isStarted()) {
                log.info("Canceling job: {}", handle.getJob().getName());
                handle.cancel();

            }
            if (handle.isStarted()) {
                log.info("Removing log for job: {}", handle.getJob().getName());
                handle.getJob().removeLog();
            }
        }
    }

    public Map<String, String> jobs() {
        return jobs.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().toString(),
                                          e -> e.getValue().getJob().getName()));
    }

    /**
     * Get a job id and queue job for processing
     *
     * @param job async job
     * @return handle
     */
    public String start(AsyncJob job) {
        prune();
        UUID id;
        AsyncJobHandle wrapper = new AsyncJobHandle(job);
        do {
            id = UUID.randomUUID();
        } while (jobs.computeIfAbsent(id, s -> wrapper) != wrapper);
        mes.execute(wrapper);
        return id.toString();
    }

    private synchronized void prune() {
        Instant maxCompletionTime = now().minus(config.getJobPruneMinutes(), ChronoUnit.MINUTES);
        for (Iterator<Map.Entry<UUID, AsyncJobHandle>> iterator = jobs.entrySet().iterator() ; iterator.hasNext() ;) {
            Map.Entry<UUID, AsyncJobHandle> next = iterator.next();
            AsyncJobHandle handle = next.getValue();
            if (handle.canPrune(maxCompletionTime)) {
                log.info("Pruning log for {}/{}",
                         next.getKey().toString(),
                         handle.getJob().getName());
                handle.getJob().removeLog();
                iterator.remove();
            }
        }
    }

    /**
     * Find a job by handle
     *
     * @param uuid handle of job
     * @return job or null if no job is found
     */
    public AsyncJobHandle job(String uuid) {
        try {
            return jobs.get(UUID.fromString(uuid));
        } catch (RuntimeException ex) {
            log.error("Error getting job: {}", ex.getMessage());
            log.debug("Error getting job: ", ex);
            return null;
        }
    }
}
