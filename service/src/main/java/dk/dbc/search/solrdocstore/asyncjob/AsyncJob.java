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

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.OutputStreamAppender;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.UUID;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public abstract class AsyncJob {

    private static final Logger logger = LoggerFactory.getLogger(AsyncJob.class);

    private final String name;
    private String id;
    private File file;
    private FileOutputStream write;
    private RandomAccessFile read;
    private OutputStreamAppender appender;

    //! This log instance logs to special
    //! Pass this along
    protected ch.qos.logback.classic.Logger log;

    /**
     * The actual job
     *
     * @param isCanceled method to check if job has been canceled
     * @throws Exception in case oof an error
     */
    abstract void run(Supplier<Boolean> isCanceled) throws Exception;

    /**
     * Named job
     *
     * @param name job name
     */
    public AsyncJob(String name) {
        this.name = name;
        id = null;
        file = null;
        write = null;
        read = null;
        appender = null;
        log = null;
    }

    /**
     * Get current size of log file
     *
     * @return logfile size
     */
    final long getFileSize() {
        return file.length();
    }

    /**
     * Name of job (used by job list)
     *
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * Read from a point in logfile
     *
     * @param data   buffer to fill
     * @param offset offset in file
     * @return number of bytes read
     * @throws IOException if file is closed
     */
    final synchronized int readAt(byte[] data, long offset) throws IOException {
        read.seek(offset);
        return read.read(data, 0, data.length);
    }

    /**
     * Set up logging for this class
     *
     * @throws IOException in case of file errors
     */
    final void initLog() throws IOException {
        this.id = UUID.randomUUID().toString();
        this.file = File.createTempFile("/tmp/async-", ".log");
        this.write = new FileOutputStream(file);
        this.read = new RandomAccessFile(file, "r");

        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        this.log = context.getLogger(id);
        log.setLevel(Level.DEBUG);
        this.appender = new OutputStreamAppender();
        appender.setName(id);
        appender.setContext(log.getLoggerContext());
        appender.setOutputStream(write);

        PatternLayoutEncoder encoder = new PatternLayoutEncoder();
        encoder.setContext(context);
        encoder.setPattern("%d{HH:mm:ss:SSS}|%-5level|%msg%n%rEx");
        encoder.init(write);// Not really sure why this is nessecary appender.setEncoder should do that
        encoder.start();

        appender.setEncoder(encoder);
        appender.start();
        log.addAppender(appender);
    }

    /**
     * close the logger output
     */
    final void stopLog() {
        if (appender != null) {
            log.detachAppender(appender);
        }
        try {
            if (write != null) {
                write.close();
            }
        } catch (IOException ex) {
            logger.error("Cannot close log file (write): {}", ex.getMessage());
            logger.debug("Cannot close log file (write): ", ex);
        }
    }

    /**
     * remove the logfile (and close the reader)
     */
    final void removeLog() {
        try {
            if (read != null) {
                read.close();
            }
        } catch (IOException ex) {
            logger.error("Cannot close log file (read): {}", ex.getMessage());
            logger.debug("Cannot close log file (read): ", ex);
        }
        if (!file.delete()) {
            logger.info("Could not delete: {}", file.toString());
        }
    }

}
