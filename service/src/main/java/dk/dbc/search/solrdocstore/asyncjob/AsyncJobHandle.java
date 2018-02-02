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

import java.time.Instant;
import javax.ws.rs.core.StreamingOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class AsyncJobHandle implements Runnable {

    private static final Logger log = LoggerFactory.getLogger(AsyncJobHandle.class);
    private AsyncJobWesocketAppender wesocketAppender = null;

    private Instant startedAt;
    private final AsyncJob job;
    private Instant completedAt;
    private boolean canceled;
    private Thread thread;

    /**
     * Construct a handle from a job
     *
     * @param job async job to be processed
     */
    public AsyncJobHandle(AsyncJob job) {
        this.startedAt = null;
        this.job = job;
        this.completedAt = null;
        this.canceled = false;
    }

    /**
     * process job setting up log, and thread, ,and cleaning up
     */
    @Override
    public void run() {
        try {
            job.initLog(wesocketAppender);
            startedAt = Instant.now();
            thread = Thread.currentThread();
            job.run(this::isCanceled);
            thread = null;
        } catch (Exception ex) {
            job.log.error("------------------------");
            job.log.error("JOB FAILED");
            for (Throwable tw = ex ; tw != null ; tw = tw.getCause()) {
                job.log.error("{}: {}", tw.getClass().getSimpleName(), tw.getMessage());
            }
            log.error("Job exception: {}", ex.getMessage());
            log.debug("Job exception: ", ex);
            log.error("Job: {}", ex.getMessage());
            log.debug("Exception: ", ex);
        } finally {
            completedAt = Instant.now();
            job.stopLog();
        }
    }

    public void setWebsocketAppender(AsyncJobWesocketAppender appender){
        this.wesocketAppender = appender;
    }

    public AsyncJob getJob() {
        return job;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public boolean isStarted() {
        return startedAt != null;
    }

    public boolean isCompleted() {
        return completedAt != null || canceled && startedAt == null;
    }

    public boolean isRunning() {
        return isStarted() && !isCompleted();
    }

    public boolean isCanceled() {
        return canceled;
    }

    public void cancel() {
        if (isRunning() && thread != null) {
            thread.interrupt();
        }
        this.canceled = true;
    }

    /**
     * Job completed long ago or canceled and not started
     *
     * @param maxCompletionTime when jbo was completed, to be eligible for
     *                          pruning
     * @return can be pruned
     */
    boolean canPrune(Instant maxCompletionTime) {
        if (completedAt != null) {
            return completedAt.isBefore(maxCompletionTime);
        } else {
            return canceled && startedAt == null;
        }
    }

    /**
     * Stream the las n bytes of data from the log (starting after a newline)
     *
     * @param size number of bytes wanted
     * @return content stream
     */
    public StreamingOutput tail(int size) {
        return (output) -> {
            byte[] bytes = new byte[size];
            long fileSize = job.getFileSize();
            long offset = Long.max(fileSize - bytes.length, 0);
            int length = job.readAt(bytes, offset);
            if (length > 0) {
                int o = 0;
                if (offset > 0) {
                    int o1 = 0;
                    while (o1 < length) {
                        if (bytes[o1++] == '\n' && o1 != length) {
                            o = o1;
                            break;
                        }
                    }
                }
                output.write(bytes, o, length - o);
            }
        };
    }

    public StreamingOutput content() {
        return (output) -> {
            byte[] bytes = new byte[4096];
            long offset = 0;
            int length;
            do {
                length = job.readAt(bytes, offset);
                offset += length;
                if (length > 0) {
                    output.write(bytes, 0, length);
                }
            } while (length == bytes.length);
        };
    }
}
