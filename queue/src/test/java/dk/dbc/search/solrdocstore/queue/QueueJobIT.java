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

import dk.dbc.commons.testutils.postgres.connection.PostgresITDataSource;
import dk.dbc.pgqueue.supplier.QueueSupplier;
import dk.dbc.pgqueue.consumer.JobConsumer;
import dk.dbc.pgqueue.consumer.JobMetaData;
import dk.dbc.pgqueue.consumer.QueueWorker;
import dk.dbc.pgqueue.supplier.PreparedQueueSupplier;
import java.sql.Connection;
import java.sql.Statement;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import javax.sql.DataSource;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueJobIT {

    private static final QueueSupplier QUEUE_SUPPLIER = new QueueSupplier(QueueJob.STORAGE_ABSTRACTION);
    private static final String QUEUE = "test";

    private PostgresITDataSource pg;
    private DataSource dataSource;

    @Before
    public void setUp() throws Exception {
        pg = new PostgresITDataSource("queue");
        dataSource = pg.getDataSource();
        DatabaseMigrator.migrate(dataSource);
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE TABLE queue CASCADE");
            stmt.executeUpdate("TRUNCATE TABLE queue_error CASCADE");
        }
    }

    @Test(timeout = 5000L)
    public void testStoreRetrieve() throws Exception {
        System.out.println("store-retrieve");

        QueueJob job1 =  QueueJob.work("work:12345678");
        QueueJob job2 =  QueueJob.manifestation(888888, "clazzifier", "87654321"); // This should be collapsed
        QueueJob job3 =  QueueJob.manifestation(888888, "clazzifier", "87654321"); // Into this

        try (Connection connection = dataSource.getConnection()) {
            PreparedQueueSupplier<QueueJob> supplier = QUEUE_SUPPLIER.preparedSupplier(connection);

            supplier.enqueue(QUEUE, job1);
            supplier.enqueue(QUEUE, job2);
            supplier.enqueue(QUEUE, job3);

            BlockingDeque<QueueJob> list = new LinkedBlockingDeque<>();

            QueueWorker worker = QueueWorker.builder(QueueJob.STORAGE_ABSTRACTION)
                    .consume(QUEUE)
                    .dataSource(dataSource)
                    .skipDuplicateJobs(QueueJob.DEDUPLICATE_ABSTRACTION)
                    .build((JobConsumer<QueueJob>) (Connection connection1, QueueJob job, JobMetaData metaData) -> {
                       list.add(job);
                   });
            worker.start();

            QueueJob actual1 = list.pollFirst(5, TimeUnit.SECONDS);
            QueueJob actual2 = list.pollFirst(5, TimeUnit.SECONDS);

            worker.stop();

            assertEquals(job1.toString(), actual1.toString());
            assertEquals(job3.toString(), actual2.toString());
        }
    }
}
