/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-queue
 *
 * dbc-solr-doc-store-queue is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-queue is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.queue;

import dk.dbc.pgqueue.DeduplicateAbstraction;
import dk.dbc.pgqueue.QueueStorageAbstraction;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.sql.Types.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueJob {

    private static final Pattern MANIFESTATION = Pattern.compile("([0-9]+)-([^:]+):(.+)");

    private final String jobId;
    private final Integer commitWithin;

    private QueueJob(String jobId, Integer commitWithin) {
        this.jobId = jobId;
        this.commitWithin = commitWithin;
    }

    public static QueueJob manifestation(int agencyId, String classifier, String bibliographicRecordId) {
        return manifestation(agencyId, classifier, bibliographicRecordId, null);
    }

    public static QueueJob manifestation(int agencyId, String classifier, String bibliographicRecordId, Integer commitWithin) {
        QueueJob job = new QueueJob(agencyId + "-" + classifier + ":" + bibliographicRecordId, commitWithin);
        if (!job.isManifestation())
            throw new IllegalArgumentException("Invalid arguments to manifestation");
        return job;
    }

    public static QueueJob work(String work) {
        return work(work, null);
    }

    public static QueueJob work(String work, Integer commitWithin) {
        QueueJob job = new QueueJob(work, commitWithin);
        if (!job.isWork())
            throw new IllegalArgumentException("Invalid arguments to work");
        return job;
    }

    public String getJobId() {
        return jobId;
    }

    public boolean isManifestation() {
        Matcher m = MANIFESTATION.matcher(jobId);
        return m.matches();
    }

    public int getAgencyId() {
        Matcher m = MANIFESTATION.matcher(jobId);
        if (!m.matches())
            throw new IllegalStateException("Trying to get agencyId from jobId: " + jobId);
        return Integer.parseInt(m.group(1));
    }

    public String getClassifier() {
        Matcher m = MANIFESTATION.matcher(jobId);
        if (!m.matches())
            throw new IllegalStateException("Trying to get classifier from jobId: " + jobId);
        return m.group(2);
    }

    public String getBibliographicRecordId() {
        Matcher m = MANIFESTATION.matcher(jobId);
        if (!m.matches())
            throw new IllegalStateException("Trying to get classifier from jobId: " + jobId);
        return m.group(3);
    }

    public boolean isWork() {
        return jobId.startsWith("work:");
    }

    public String getWork() {
        if (!jobId.startsWith("work:"))
            throw new IllegalStateException("Trying to get wotk from jobId: " + jobId);
        return jobId;
    }

    public Integer getCommitwithin() {
        return commitWithin;
    }

    public boolean hasCommitWithin() {
        return commitWithin != null;
    }

    @Override
    public String toString() {
        return "QueueJob{" + "jobId=" + jobId + ", commitWithin=" + commitWithin + '}';
    }

    public static final QueueStorageAbstraction<QueueJob> STORAGE_ABSTRACTION = new QueueStorageAbstraction<QueueJob>() {
        private final String[] COLUMNS = "jobid,commitWithin".split(",");

        @Override
        public String[] columnList() {
            return COLUMNS;
        }

        @Override
        public QueueJob createJob(ResultSet resultSet, int startColumn) throws SQLException {
            String jobId = resultSet.getString(startColumn++);
            Integer commitwithin = resultSet.getInt(startColumn);
            if (resultSet.wasNull()) {
                commitwithin = null;
            }
            return new QueueJob(jobId, commitwithin);
        }

        @Override
        public void saveJob(QueueJob job, PreparedStatement stmt, int startColumn) throws SQLException {
            stmt.setString(startColumn++, job.getJobId());
            if (job.hasCommitWithin()) {
                stmt.setInt(startColumn, job.getCommitwithin());
            } else {
                stmt.setNull(startColumn, INTEGER);
            }
        }
    };

    public static final DeduplicateAbstraction<QueueJob> DEDUPLICATE_ABSTRACTION = new DeduplicateAbstraction<QueueJob>() {
        private final String[] COLUMNS = "jobid".split(",");

        @Override
        public String[] duplicateDeleteColumnList() {
            return COLUMNS;
        }

        @Override
        public void duplicateValues(QueueJob job, PreparedStatement stmt, int startColumn) throws SQLException {
            stmt.setString(startColumn, job.getJobId());
        }

        @Override
        public QueueJob mergeJob(QueueJob originalJob, QueueJob skippedJob) {
            Integer originalCommitWithin = originalJob.getCommitwithin();
            Integer skippedCommitWithin = skippedJob.getCommitwithin();
            if (originalCommitWithin == null) {
                if (skippedCommitWithin == null) {
                    return originalJob;
                } else {
                    return skippedJob;
                }
            } else {
                if (skippedCommitWithin == null) {
                    return originalJob;
                } else if (originalCommitWithin.compareTo(skippedCommitWithin) <= 0) {
                    return originalJob;
                } else {
                    return skippedJob;
                }
            }
        }
    };

}
