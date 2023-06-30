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

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.queue.QueueJob;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collection;
import java.util.EnumMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.stream.Collectors.toList;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class EnqueueCollector implements AutoCloseable {

    private static final Logger log = LoggerFactory.getLogger(EnqueueCollector.class);

    private final Connection connection;
    private final Collection<QueueRuleEntity> queueRules;
    private final EnumMap<QueueType, EnqueueTarget> targetTypes;

    public static final EnqueueCollector VOID = new EnqueueCollector() {
        @Override
        public void add(BibliographicEntity entity, QueueType type) {
        }

        @Override
        public void commit() throws SQLException {
        }
    };

    protected EnqueueCollector() {
        this.connection = null;
        this.queueRules = null;
        this.targetTypes = null;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public EnqueueCollector(Connection connection, Collection<QueueRuleEntity> queueRules) {
        this.connection = connection;
        this.queueRules = queueRules;
        this.targetTypes = new EnumMap<>(QueueType.class);
    }

    /**
     * Add to queues for a given supplier
     *
     * @param entity   the entity that should be added to queue
     * @param supplier the supplier (source of this queue event)
     */
    public void add(BibliographicEntity entity, QueueType supplier) {
        QueueJob job = entity.asQueueJobFor(supplier);
        if (job != null) {
            targetTypes.computeIfAbsent(supplier, this::makeTarget)
                    .add(job);
        }
    }

    /**
     * Add to queues for a number of supplier
     *
     * @param entity    the entity that should be added to queue
     * @param suppliers the suppliers (source of this queue event)
     */
    public void add(BibliographicEntity entity, QueueType... suppliers) {
        for (QueueType supplier : suppliers) {
            add(entity, supplier);
        }
    }

    /**
     * Put all unique entities added onto the database queue
     *
     * @throws SQLException If the database acts up
     */
    public void commit() throws SQLException {
        for (EnqueueTarget target : targetTypes.values()) {
            target.commit();
        }
    }

    @Override
    public void close() throws SQLException {
        commit();
    }

    private EnqueueTarget makeTarget(QueueType type) {
        Collection<QueueRuleEntity> targets = queueRules.stream()
                .filter(type.asPredicate())
                .collect(toList());
        if (targets.isEmpty()) {
            log.debug("No queues defined for target: {}", type);
            return new EnqueueTargetNull();
        }
        return new EnqueueTargetCollector(connection, targets);
    }
}
