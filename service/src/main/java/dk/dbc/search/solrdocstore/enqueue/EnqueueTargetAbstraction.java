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

import dk.dbc.pgqueue.PreparedQueueSupplier;
import dk.dbc.pgqueue.QueueSupplier;
import dk.dbc.search.solrdocstore.BibliographicEntity;
import dk.dbc.search.solrdocstore.QueueRuleEntity;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashSet;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public abstract class EnqueueTargetAbstraction implements EnqueueTarget {

    private final Connection connection;
    private final Collection<QueueRuleEntity> targets;
    private final HashSet<QueueJob> jobs;

    public EnqueueTargetAbstraction(Connection connection, Collection<QueueRuleEntity> targets) {
        this.connection = connection;
        this.targets = targets;
        this.jobs = new HashSet<>();
    }

    @Override
    public void add(BibliographicEntity entity) {
        jobs.add(queueJobOf(entity));
    }

    abstract protected QueueJob queueJobOf(BibliographicEntity entity);

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
