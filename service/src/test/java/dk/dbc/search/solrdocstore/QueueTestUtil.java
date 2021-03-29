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

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import javax.persistence.EntityManager;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class QueueTestUtil {

    private static final Logger log = LoggerFactory.getLogger(QueueTestUtil.class);

    /**
     * Test queue content
     *
     * @param em       entity manager, that provides a connection
     * @param elements list of string with
     *                 {consumer},{agencyId},{bibliographicRecordId}[,{commitWithin}]
     */
    public static void queueIs(EntityManager em, String... elements) {
        Connection connection = em.unwrap(java.sql.Connection.class);
        queueIs(connection, elements);
    }

    /**
     * Test queue content
     *
     * @param dataSource data source, that provides a connection
     * @param elements   list of string with
     *                   {consumer},{agencyId},{bibliographicRecordId}[,{commitWithin}]
     */
    public static void queueIs(DataSource dataSource, String... elements) {
        try (Connection connection = dataSource.getConnection()) {
            queueIs(connection, elements);
        } catch (SQLException ex) {
            fail("Error testing queue: " + ex.getMessage());
        }
    }

    /**
     * Test queue content
     *
     * @param connection database connection
     * @param elements   list of string with
     *                   {consumer},{agencyId},{bibliographicRecordId}[,{commitWithin}]
     */
    public static void queueIs(Connection connection, String... elements) {
        HashSet<String> enqueued = new HashSet<>();

        try (Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT consumer || ',' || jobid FROM queue")) {
            while (resultSet.next()) {
                enqueued.add(resultSet.getString(1));
            }
        } catch (SQLException ex) {
            log.error("Cannot exec query: {}", ex.getMessage());
            log.debug("Cannot exec query: ", ex);
        }
        log.debug("enqueued = {}", enqueued);
        assertThat(enqueued, containsInAnyOrder(elements));
    }

    public static void clearQueue(DataSource dataSource) {
        try (Connection connection = dataSource.getConnection()) {
            clearQueue(connection);
        } catch (SQLException ex) {
            fail("Error testing queue: " + ex.getMessage());
        }
    }

    public static void clearQueue(EntityManager em) {
        Connection connection = em.unwrap(java.sql.Connection.class);
        clearQueue(connection);
    }

    public static void clearQueue(Connection connection) {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE queue");
        } catch (SQLException ex) {
            log.error("Error truncating queue: {}", ex.getMessage());
            log.debug("Error truncating queue: ", ex);
        }
    }
}
