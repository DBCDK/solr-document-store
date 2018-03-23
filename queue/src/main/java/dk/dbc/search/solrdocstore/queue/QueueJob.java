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

import dk.dbc.pgqueue.QueueStorageAbstraction;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static java.sql.Types.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueJob {

    private final int agencyId;
    private final String classifier;
    private final String bibliographicRecordId;
    private final Integer commitWithin;

    public QueueJob(int agencyId, String classifier, String bibliographicRecordId) {
        this.agencyId = agencyId;
        this.classifier = classifier;
        this.bibliographicRecordId = bibliographicRecordId;
        this.commitWithin = null;
    }

    public QueueJob(int agencyId, String classifier, String bibliographicRecordId, Integer commitWithin) {
        this.agencyId = agencyId;
        this.classifier = classifier;
        this.bibliographicRecordId = bibliographicRecordId;
        this.commitWithin = commitWithin;
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

    public Integer getCommitwithin() {
        return commitWithin;
    }

    public boolean hasCommitWithin() {
        return commitWithin != null;
    }

    @Override
    public String toString() {
        return "QueueJob{" + "agencyId=" + agencyId + ", classifier=" + classifier + ", bibliographicRecordId=" + bibliographicRecordId + ", commitWithin=" + commitWithin + '}';
    }

    public static final QueueStorageAbstraction<QueueJob> STORAGE_ABSTRACTION = new QueueStorageAbstraction<QueueJob>() {
        private final String[] COLUMNS = "agencyId,classifier,bibliographicRecordId,commitWithin".split(",");

        @Override
        public String[] columnList() {
            return COLUMNS;
        }

        @Override
        public QueueJob createJob(ResultSet resultSet, int startColumn) throws SQLException {
            int agencyId = resultSet.getInt(startColumn++);
            String classifier = resultSet.getString(startColumn++);
            String bibliographicRecordId = resultSet.getString(startColumn++);
            Integer commitwithin = resultSet.getInt(startColumn++);
            if (resultSet.wasNull()) {
                commitwithin = null;
            }
            return new QueueJob(agencyId, classifier, bibliographicRecordId, commitwithin);
        }

        @Override
        public void saveJob(QueueJob job, PreparedStatement stmt, int startColumn) throws SQLException {
            stmt.setInt(startColumn++, job.getAgencyId());
            stmt.setString(startColumn++, job.getClassifier());
            stmt.setString(startColumn++, job.getBibliographicRecordId());
            if (job.hasCommitWithin()) {
                stmt.setInt(startColumn++, job.getCommitwithin());
            } else {
                stmt.setNull(startColumn++, INTEGER);
            }
        }
    };

}
