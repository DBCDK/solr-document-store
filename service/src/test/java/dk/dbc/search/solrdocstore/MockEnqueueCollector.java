/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import java.sql.SQLException;
import java.util.HashSet;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class MockEnqueueCollector extends EnqueueCollector {

    private final HashSet<String> jobs = new HashSet<>();

    @Override
    public void add(BibliographicEntity entity, QueueType supplier) {
        String jobName = supplier.toString() + ":" + entity.asQueueJobFor(supplier).getJobId();
        jobs.add(jobName);
    }

    @Override
    public void commit() throws SQLException {
    }

    public HashSet<String> getJobs() {
        return jobs;
    }
}
