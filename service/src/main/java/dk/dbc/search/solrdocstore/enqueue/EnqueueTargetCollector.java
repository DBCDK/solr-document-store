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
package dk.dbc.search.solrdocstore.enqueue;

import dk.dbc.pgqueue.supplier.PreparedQueueSupplier;
import dk.dbc.pgqueue.supplier.QueueSupplier;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashSet;

/**
 * This is a base implementation for {@link EnqueueTarget}
 * <p>
 * This collects unique {@link QueueJob}s, and upon commit transfers then to the
 * database
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class EnqueueTargetCollector implements EnqueueTarget {

    private final Connection connection;
    private final Collection<QueueRuleEntity> targets;
    private final HashSet<QueueJob> jobs;

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public EnqueueTargetCollector(Connection connection, Collection<QueueRuleEntity> targets) {
        this.connection = connection;
        this.targets = targets;
        this.jobs = new HashSet<>();
    }

    @Override
    public void add(QueueJob entity) {
        jobs.add(entity);
    }

    @Override
    public void commit() throws SQLException {
        if (!jobs.isEmpty()) {
            PreparedQueueSupplier<QueueJob> queueSupplier = new QueueSupplier<>(QueueJob.STORAGE_ABSTRACTION)
                    .preparedSupplier(connection);
            for (QueueJob job : jobs) {
                for (QueueRuleEntity target : targets) {
                    queueSupplier.enqueue(target.getQueue(), job, target.getPostpone());
                }
            }
        }
    }
}
