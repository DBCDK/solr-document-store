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

import dk.dbc.pgqueue.common.DeduplicateAbstraction;
import dk.dbc.pgqueue.common.QueueStorageAbstraction;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueJob {

    private static final Pattern MANIFESTATION = Pattern.compile("([0-9]+)-([^:]+):(.+)");

    private final String jobId;

    private QueueJob(String jobId) {
        this.jobId = jobId;
    }

    public static QueueJob manifestation(int agencyId, String classifier, String bibliographicRecordId) {
        QueueJob job = new QueueJob(agencyId + "-" + classifier + ":" + bibliographicRecordId);
        if (!job.isManifestation())
            throw new IllegalArgumentException("Invalid arguments to manifestation");
        return job;
    }

    public static QueueJob work(String work) {
        QueueJob job = new QueueJob(work);
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
            throw new IllegalStateException("Trying to get bibliographicRecordId from jobId: " + jobId);
        return m.group(3);
    }

    public boolean isWork() {
        return jobId.startsWith("work:");
    }

    public String getWork() {
        if (!jobId.startsWith("work:"))
            throw new IllegalStateException("Trying to get work from jobId: " + jobId);
        return jobId;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final QueueJob other = (QueueJob) obj;
        return Objects.equals(this.jobId, other.jobId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(37, jobId);
    }

    @Override
    public String toString() {
        return "QueueJob{" + "jobId=" + jobId + '}';
    }

    public static final QueueStorageAbstraction<QueueJob> STORAGE_ABSTRACTION = new QueueStorageAbstraction<QueueJob>() {
        private final String[] COLUMNS = "jobid".split(",");

        @Override
        public String[] columnList() {
            return COLUMNS;
        }

        @Override
        public QueueJob createJob(ResultSet resultSet, int startColumn) throws SQLException {
            String jobId = resultSet.getString(startColumn);
            return new QueueJob(jobId);
        }

        @Override
        public void saveJob(QueueJob job, PreparedStatement stmt, int startColumn) throws SQLException {
            stmt.setString(startColumn, job.getJobId());
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
            return originalJob;
        }
    };

}
