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
public class EnqueueCollector {

    private static final Logger log = LoggerFactory.getLogger(EnqueueCollector.class);

    private final Connection connection;
    private final Collection<QueueRuleEntity> queueRules;
    private final EnumMap<QueueType, EnqueueTarget> targetTypes;

    public EnqueueCollector(Connection connection, Collection<QueueRuleEntity> queueRules) {
        this.connection = connection;
        this.queueRules = queueRules;
        this.targetTypes = new EnumMap<>(QueueType.class);
    }

    public void add(BibliographicEntity entity, QueueType type) {
        targetTypes.computeIfAbsent(type, this::makeTarget)
                .add(entity);
    }

    public void commit() throws SQLException {
        for (EnqueueTarget target : targetTypes.values()) {
            target.commit();
        }
    }

    private EnqueueTarget makeTarget(QueueType type) {
        Collection<QueueRuleEntity> targets = queueRules.stream()
                .filter(type.asPredicate())
                .collect(toList());
        if (targets.isEmpty()) {
            log.info("No queues defined for target: {}", type);
            return new EnqueueTargetNull();
        }
        switch (type) {
            case MANIFESTATION:
            case HOLDING:
            case FIRSTLASTHOLDING:
                return new EnqueueTargetManifestation(connection, targets);
            case WORK:
            case WORKFIRSTLASTHOLDING:
                return new EnqueueTargetWork(connection, targets);
            default:
                throw new AssertionError();
        }
    }

}
