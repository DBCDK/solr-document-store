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

import dk.dbc.search.solrdocstore.queue.QueueJob;
import java.sql.SQLException;

/**
 * Interface of handling a specific queue
 * <p>
 * When
 * {@link EnqueueCollector#add(dk.dbc.search.solrdocstore.BibliographicEntity, dk.dbc.search.solrdocstore.QueueType)}
 * in called, this interface is used for an abstraction for the the supplier
 * type
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public interface EnqueueTarget {

    /**
     * Add a single entity to this queue-job collection
     *
     * @param job what job to enqueue
     */
    void add(QueueJob job);

    /**
     * Transfer queue-jobs to the database
     *
     * @throws SQLException in case the database acts up in any way
     */
    void commit() throws SQLException;
}
