/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
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

import dk.dbc.pgqueue.PreparedQueueSupplier;
import dk.dbc.pgqueue.QueueSupplier;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.function.BiFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueService<T> {

    private static final Logger log = LoggerFactory.getLogger(EnqueueService.class);

    private final BiFunction<T, Integer, QueueJob> jobCreator;
    private final Collection<String> queueNames;
    private final PreparedQueueSupplier queueSupplier;

    public EnqueueService(Connection connection, Collection<String> queueNames, BiFunction<T, Integer, QueueJob> jobCreator) {
        this.jobCreator = jobCreator;
        this.queueNames = queueNames;
        this.queueSupplier = new QueueSupplier<>(QueueJob.STORAGE_ABSTRACTION)
                .preparedSupplier(connection);
    }

    public void enqueue(T t) throws SQLException {
        enqueue(t, null);
    }

    public void enqueue(T t, Integer commitWithin) throws SQLException {
        QueueJob job = jobCreator.apply(t, commitWithin);
        for (String queueName : queueNames) {
            log.trace("enqueue {} to: {}", job, queueName);
            queueSupplier.enqueue(queueName, job);
        }
    }
}
