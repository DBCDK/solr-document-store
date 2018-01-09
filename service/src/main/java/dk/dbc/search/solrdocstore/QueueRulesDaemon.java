/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
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

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.sql.DataSource;
import org.postgresql.PGConnection;
import org.postgresql.PGNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class QueueRulesDaemon {

    private static final Logger log = LoggerFactory.getLogger(QueueRulesDaemon.class);

    @Resource(type = ManagedExecutorService.class)
    ExecutorService mes;

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

    private Future<?> future;
    private Thread thread;

    private Set<String> manifestationQueues = Collections.EMPTY_SET;

    @PostConstruct
    public void init() {
        future = mes.submit(this::monitorMain);
    }

    @PreDestroy
    public void destroy() {
        log.debug("destroy ");
        if (future.cancel(false)) {
            return;
        }
        thread.interrupt();
        try {
            future.get(1, TimeUnit.MINUTES);
        } catch (InterruptedException | ExecutionException | TimeoutException ex) {
            log.error("Error waiting for QueueRules monitor to terminate: {}", ex.getMessage());
            log.debug("Error waiting for QueueRules monitor to terminate: ", ex);
        }
    }

    public Collection<String> getManifestationQueues() {
        return manifestationQueues;
    }

    private static final long[] THROTTLE_SLEEP = {1, 10, 10, 10, 20, 20, 20, 30, 30, 30, 60};

    /**
     * Daemon entry
     */
    private void monitorMain() {
        log.info("Started queuerules monitor thread");
        thread = Thread.currentThread();
        thread.setName(getClass().getSimpleName());
        while (alive()) {
            try {
                monitorLoop();
            } catch (RuntimeException ex) {
                log.error("Error in monitor daemon: {}", ex.getMessage());
                log.debug("Error in monitor daemon: ", ex);
            }
        }
        log.info("Ended queuerules monitor thread");
    }

    /**
     * Daemon loop
     */
    private void monitorLoop() {
        int throttle_pos = 0;
        while (alive()) {
            try (Connection connection = dataSource.getConnection() ;
                 Statement stmt = connection.createStatement()) {
                PGConnection pgConnection = untanglePostgresConnection(connection);
                stmt.executeUpdate("LISTEN queueNotify");
                readQueueRules();

                while (alive()) {
                    if (pollNotification(pgConnection)) {
                        readQueueRules();
                    }
                    throttle_pos = 0;
                }
                stmt.executeUpdate("UNLISTEN queueNotify");

            } catch (SQLException ex) {
                log.error("Error communicating with database: {}", ex.getMessage());
                log.debug("Error communicating with database: ", ex);
            } catch (RuntimeException ex) {
                log.error("Runtime error: {}", ex.getMessage());
                log.debug("Runtime error: ", ex);
            }
            if (alive()) {
                try {
                    long throttle = THROTTLE_SLEEP[throttle_pos++];
                    if (throttle_pos >= THROTTLE_SLEEP.length) {
                        throttle_pos = THROTTLE_SLEEP.length - 1;
                    }
                    Thread.sleep(throttle * 1_000L);
                } catch (InterruptedException ex) {
                    log.error("Exception: {}", ex.getMessage());
                    log.debug("Exception: ", ex);
                }
            }
        }
    }

    /**
     * Since PGConnection.getNotifications(int) is not affected by
     * Thread.interrupt(): do time limited polling, so that the thread can
     * identify it's being shut down
     *
     * @param connection database connection
     * @return If a notification has arrived
     * @throws SQLException If the database connection dies
     */
    private boolean pollNotification(PGConnection pgConnection) throws SQLException {
        while (alive()) {
            PGNotification[] notifications = pgConnection.getNotifications(1_000);
            if (notifications != null) {
                log.debug("notifications = {}", Arrays.toString(notifications));
                return true;
            }
        }
        return false;
    }

    /**
     * UGLY!!!
     * <p>
     * Since com.sun.gjc.spi.jdbc40.ConnectionWrapper40 from fish.payara,
     * somehow crashed the compile phase of maven The reflection hack is needed.
     *
     * @param connection connection from datasource
     * @return postgres connection
     */
    private PGConnection untanglePostgresConnection(Connection connection) {
        while (!( connection instanceof PGConnection )) {
            Class<? extends Connection> clazz = connection.getClass();
            try {
                Method method1 = clazz.getMethod("getConnection");
                if (method1 != null) {
                    Object c1 = method1.invoke(connection);
                    if (c1 == null) {
                        throw new RuntimeException("Cannot unwrap to postgresql connection");
                    }
                    connection = (Connection) c1;
                }
            } catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException ex) {
                log.error("Exception: {}", ex.getMessage());
                log.debug("Exception: ", ex);
            }
        }
        return (PGConnection) connection;
    }

    private void readQueueRules(Connection connection) throws SQLException {
        try (Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT queue FROM queueRule")) {
            HashSet<String> queueNames = new HashSet<>();
            while (resultSet.next()) {
                int i = 0;
                String queue = resultSet.getString(++i);
                queueNames.add(queue);
            }
            manifestationQueues = queueNames;
        }
    }

    /**
     * (Re)read queueRules
     */
    public void readQueueRules() {
        try (Connection connection = dataSource.getConnection()) {
            readQueueRules(connection);
        } catch (SQLException ex) {
            log.error("Error reading queue rules from database: {}", ex.getMessage());
            log.debug("Error reading queue rules from database: ", ex);
        }
    }

    /**
     * Test if the thread has been interrupted
     *
     * @return still supposed to run
     */
    private boolean alive() {
        return !thread.isInterrupted();
    }

}
