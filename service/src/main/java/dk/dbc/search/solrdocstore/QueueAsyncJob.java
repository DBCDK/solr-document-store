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
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.asyncjob.AsyncJob;
import dk.dbc.search.solrdocstore.asyncjob.AsyncJobRunner;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.function.Supplier;
import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.sql.DataSource;

import static javax.ejb.LockType.READ;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(READ)
public class QueueAsyncJob {

    DataSource dataSource;

    @Inject
    AsyncJobRunner runner;

    @PostConstruct
    public void init() {
        dataSource = UnpooledDataSource.dataSourceOf("asyncJob");
    }

    /**
     * Queue everything
     *
     * @param queue      Name of consumer
     * @param deletedToo even the deleted
     * @return async handle
     */
    public String runQueueAllManifestationsFor(String queue, boolean deletedToo) {
        return runner.start(queueAllManifestationsFor(queue, deletedToo));
    }
    private static final String ALL_MANIFESTATIONS = "SELECT agencyId, classifier, bibliographicRecordId FROM bibliographicsolrkeys";
    private static final String ALL_MANIFESTATIONS_NOT_DELETED = "SELECT agencyId, classifier, bibliographicRecordId FROM bibliographicsolrkeys WHERE NOT deleted";

    AsyncJob queueAllManifestationsFor(String queue, boolean deletedToo) {
        return new AsyncJob("Queue-all-for-" + queue) {

            @Override
            public void run(Supplier<Boolean> isCanceled) throws Exception {
                log.debug("Connectiong to database");
                try (Connection connection = dataSource.getConnection()) {
                    log.debug("Selecting all records");
                    try (Statement stmt = connection.createStatement() ;
                         ResultSet resultSet = stmt.executeQuery(deletedToo ? ALL_MANIFESTATIONS : ALL_MANIFESTATIONS_NOT_DELETED)) {
                        connection.setAutoCommit(false);
                        boolean shouldCommit = false;
                        EnqueueService<QueueJob> enqueueService = enqueueService(connection, queue);
                        int counter = 0;
                        while (resultSet.next() && !isCanceled.get()) {
                            int i = 0;
                            int agencyId = resultSet.getInt(++i);
                            String classifier = resultSet.getString(++i);
                            String bibliographicRecordId = resultSet.getString(++i);
                            enqueueService.enqueue(new QueueJob(agencyId, classifier, bibliographicRecordId));
                            shouldCommit = true;
                            if (++counter % 2500 == 0) {
                                log.info("Committet: {}", counter);
                                connection.commit();
                                shouldCommit = false;
                            }
                        }
                        if (shouldCommit) {
                            connection.commit();
                            log.info("Committet: {}", counter);
                        }
                    }
                } catch (SQLException ex) {
                    log.error("Got some sql exception: {}", ex.getMessage());
                    log.debug("Got some sql exception: ", ex);
                }
            }
        };
    }

    /**
     * List all errors matching a pattern
     *
     * @param consumer consumer that failed (can be null or empty string)
     * @param pattern  diag pattern with * and ?
     * @return async handle
     */
    public String runQueueErrorListJobs(String consumer, String pattern) {
        return runner.start(queueErrorListJobs(consumer, pattern));
    }

    AsyncJob queueErrorListJobs(String consumer, String pattern) {
        String like = makeLike(pattern);
        return new AsyncJob("List-errors-matching-" + pattern) {
            @Override
            public String getLogPattern() {
                return "";
            }

            @Override
            public void run(Supplier<Boolean> isCanceled) throws Exception {
                log.debug("Connectiong to database");

                try (Connection connection = dataSource.getConnection() ;
                     PreparedStatement stmt = makeErrorQuery(connection, consumer, like)) {
                    log.info("========= MATCHES BEGIN ========");
                    try (ResultSet resultSet = stmt.executeQuery()) {
                        while (!isCanceled.get() && resultSet.next()) {
                            ErrorEntry err = new ErrorEntry(resultSet);
                            log.info("{}-{}:{} | {}:{} | {} | {}", err.getAgencyId(), err.getClassifier(), err.getBibliographicRecordId(), err.getQueued(), err.getFailedAt(), err.getJobConsumer(), err.getDiag());
                        }
                    }
                    log.info("========= MATCHES END ========");
                }
            }
        };
    }

    /**
     * List all errors matching a pattern
     *
     * @param consumer consumer that failed (can be null or empty string)
     * @param pattern  diag pattern with * and ?
     * @return async handle
     */
    public String runQueueErrorDeleteJobs(String consumer, String pattern) {
        return runner.start(queueErrorDeleteJobs(consumer, pattern));
    }

    AsyncJob queueErrorDeleteJobs(String consumer, String pattern) {
        String like = makeLike(pattern);
        return new AsyncJob("Delete-errors-matching-" + pattern) {
            @Override
            public void run(Supplier<Boolean> isCanceled) throws Exception {
                log.debug("Connectiong to database");

                try (Connection connection = dataSource.getConnection() ;
                     PreparedStatement stmt = makeErrorQuery(connection, consumer, like) ;
                     PreparedStatement del = connection.prepareStatement("DELETE FROM queue_error WHERE ctid = ?")) {
                    connection.setAutoCommit(false);
                    boolean shouldCommit = false;
                    int counter = 0;
                    try (ResultSet resultSet = stmt.executeQuery()) {
                        while (!isCanceled.get() && resultSet.next()) {
                            ErrorEntry err = new ErrorEntry(resultSet);
                            log.info("Remove: {}-{}:{} | {}:{} | {} | {}", err.getAgencyId(), err.getClassifier(), err.getBibliographicRecordId(), err.getQueued(), err.getFailedAt(), err.getJobConsumer(), err.getDiag());
                            del.setObject(1, err.getCtid());
                            if (del.executeUpdate() != 0) {
                                shouldCommit = true;
                            }

                            if (++counter % 2500 == 0) {
                                connection.commit();
                                shouldCommit = false;
                            }
                        }
                        if (shouldCommit) {
                            connection.commit();
                        }
                    }
                }
            }
        };
    }

    public String runQueueErrorRequeueJobs(String consumer, String pattern) {
        return runner.start(queueErrorRequeueJobs(consumer, pattern));
    }

    AsyncJob queueErrorRequeueJobs(String consumer, String pattern) {
        String like = makeLike(pattern);
        return new AsyncJob("Requeue-errors-matching-" + pattern) {
            @Override
            public void run(Supplier<Boolean> isCanceled) throws Exception {
                log.debug("Connectiong to database");

                try (Connection connection = dataSource.getConnection() ;
                     PreparedStatement stmt = makeErrorQuery(connection, consumer, like) ;
                     PreparedStatement del = connection.prepareStatement("DELETE FROM queue_error WHERE ctid = ?")) {
                    connection.setAutoCommit(false);
                    boolean shouldCommit = false;
                    int counter = 0;

                    HashMap<String, EnqueueService<QueueJob>> enqueueServices = new HashMap<>();
                    try (ResultSet resultSet = stmt.executeQuery()) {
                        while (!isCanceled.get() && resultSet.next()) {
                            ErrorEntry err = new ErrorEntry(resultSet);
                            log.info("Requeue: {}-{}:{} | {}:{} | {} | {}", err.getAgencyId(), err.getClassifier(), err.getBibliographicRecordId(), err.getQueued(), err.getFailedAt(), err.getJobConsumer(), err.getDiag());
                            EnqueueService<QueueJob> enqueueService =
                                    enqueueServices.computeIfAbsent(err.getJobConsumer(),
                                                                    c -> enqueueService(connection, c));
                            enqueueService.enqueue(err.toQueueJob());
                            shouldCommit = true;
                            del.setObject(1, err.getCtid());
                            del.executeUpdate();

                            if (++counter % 2500 == 0) {
                                connection.commit();
                                shouldCommit = false;
                            }
                        }
                        if (shouldCommit) {
                            connection.commit();
                        }
                    }
                }
            }
        };
    }

    public static class ErrorEntry {

        private final int agencyId;
        private final String classifier;
        private final String bibliographicRecordId;
        private final Instant queued;
        private final Instant failedAt;
        private final String jobConsumer;
        private final String diag;
        private final Object ctid;

        public ErrorEntry(ResultSet resultSet) throws SQLException {
            int i = 0;
            agencyId = resultSet.getInt(++i);
            classifier = resultSet.getString(++i);
            bibliographicRecordId = resultSet.getString(++i);
            queued = resultSet.getTimestamp(++i).toInstant();
            failedAt = resultSet.getTimestamp(++i).toInstant();
            jobConsumer = resultSet.getString(++i);
            diag = resultSet.getString(++i);
            ctid = resultSet.getObject(++i);
        }

        public int getAgencyId() {
            return agencyId;
        }

        public String getClassifier() {
            return classifier;
        }

        public String getBibliographicRecordId() {
            return bibliographicRecordId;
        }

        public Instant getQueued() {
            return queued;
        }

        public Instant getFailedAt() {
            return failedAt;
        }

        public String getJobConsumer() {
            return jobConsumer;
        }

        public String getDiag() {
            return diag;
        }

        public Object getCtid() {
            return ctid;
        }

        public QueueJob toQueueJob() {
            return new QueueJob(agencyId, classifier, bibliographicRecordId);
        }

    }

    private static PreparedStatement makeErrorQuery(Connection connection, String consumer, String like) throws SQLException {
        StringBuilder query = new StringBuilder("SELECT agencyId, classifier, bibliographicRecordId, queued, failedat, consumer, diag , ctid FROM queue_error WHERE diag LIKE ?");
        boolean hasConsumer = !( consumer == null || consumer.isEmpty() );
        if (hasConsumer) {
            query.append(" AND consumer = ?");
        }
        query.append(" ORDER BY queued");
        PreparedStatement stmt = connection.prepareStatement(query.toString());
        try {
            int i = 0;
            stmt.setString(++i, like);
            if (hasConsumer) {
                stmt.setString(++i, consumer);
            }
        } catch (SQLException ex) {
            stmt.close();
            throw ex;
        }
        return stmt;
    }

    static String makeLike(String pattern) {
        StringBuilder sb = new StringBuilder();
        char[] chars = pattern.toCharArray();
        int i = 0;
        while (i < chars.length) {
            char c = chars[i++];
            switch (c) {
                case '\\':
                    if (i < chars.length) {
                        sb.append(chars[i++]);
                    } else {
                        throw new IllegalArgumentException("Dangling backslash in input");
                    }
                    break;
                case '%':
                case '_':
                    sb.append('\\').append(c);
                    break;
                case '*':
                    sb.append('%');
                    break;
                case '?':
                    sb.append('_');
                    break;
                default:
                    sb.append(c);
            }
        }
        return sb.toString();
    }

    private EnqueueService<QueueJob> enqueueService(Connection connection, String queue) {
        return new EnqueueService<>(connection, Arrays.asList(queue),
                                    (key, commitWithin) -> key);
    }

}
