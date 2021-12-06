/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of solrdocstore-monitor
 *
 * solrdocstore-monitor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solrdocstore-monitor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.monitor;

import dk.dbc.pgqueue.ee.diags.Process;
import dk.dbc.pgqueue.ee.diags.Processes;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.net.URI;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
@Path("queue-all")
public class QueueAll {

    private static final Logger log = LoggerFactory.getLogger(QueueAll.class);

    private long commitEvery;

    @EJB
    Processes processes;

    @Resource(name = "jdbc/solr-doc-store")
    DataSource dataSource;

    @PostConstruct
    public void init() {
        log.info("init");
        commitEvery = Long.max(
                10_000, // Atleast 10_000 between commit
                Long.parseUnsignedLong(
                        System.getenv()
                                .getOrDefault("COMMIT_EVERY",
                                              "50000")));
    }

    @GET
    @Path("{consumer}/{trackingId}")
    @SuppressFBWarnings("RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE")
    public Response queueAll(@Context UriInfo UriInfo,
                             @PathParam("consumer") String consumer,
                             @PathParam("trackingId") String trackingId) {

        if (consumer == null || consumer.isEmpty())
            return Response.status(Response.Status.BAD_REQUEST).entity("consumer is required").build();
        if (trackingId == null || trackingId.isEmpty())
            return Response.status(Response.Status.BAD_REQUEST).entity("trackingId is required").build();

        String id = processes.registerProcess(new Process("queue-all") {
            @Override
            public void run(Logger log) {

                try {
                    Thread.sleep(1_000L); // Ensure UI is ready to get 1st log line
                    log.info("Select non work/unit pids that are not deleted");
                    try (Connection connection = dataSource.getConnection() ;
                         Statement stmt = connection.createStatement() ;
                         PreparedStatement pstmt = connection.prepareStatement("INSERT INTO queue(pid, consumer, trackingId) VALUES(?, ?, ?)") ;
                         ResultSet resultSet = stmt.executeQuery("SELECT pid FROM records WHERE NOT deleted AND pid NOT LIKE 'work:%' AND pid NOT LIKE 'unit:%'")) {
                        log.info("Select complete");
                        pstmt.setString(2, consumer);
                        pstmt.setString(3, trackingId);
                        if (connection.getAutoCommit())
                            connection.setAutoCommit(false);
                        long row = 0;

                        while (isAlive() && resultSet.next()) {
                            String pid = resultSet.getString(1);
                            pstmt.setString(1, pid);
                            pstmt.executeUpdate();
                            if (++row % commitEvery == 0) {
                                log.info("Committing row: {}", row);
                                connection.commit();
                            }
                        }
                        if (row % commitEvery != 0) {
                            log.info("Committing row: {}", row);
                            connection.commit();
                        }
                        log.info("Everything is queued");
                    }
                } catch (SQLException | InterruptedException ex) {
                    log.error("Exception: {}", ex.getMessage());
                    log.debug("Exception: ", ex);
                }
            }
        });
        processes.startProcess(id);
        URI monitorUri = UriInfo.getBaseUriBuilder()
                .path("../pg-queue-admin.html")
                .build();
        return Response.temporaryRedirect(monitorUri).build();
    }

}
