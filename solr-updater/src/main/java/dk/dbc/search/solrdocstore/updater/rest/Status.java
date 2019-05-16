package dk.dbc.search.solrdocstore.updater.rest;

import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.Worker;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("status")
public class Status {

    private static final Logger log = LoggerFactory.getLogger(Status.class);

    @Resource(lookup = Config.DATABASE)
    DataSource dataSource;

    @Inject
    Config config;

    @Inject
    HazelCastStatus hzStatus;

    @EJB
    Worker worker;

    public Status() {
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStatus() {
        log.info("getStatus called");

        if (!config.isWorker())
            return Response.ok(StatusResponse.ok()).build();
        try (Connection connection = dataSource.getConnection() ;
             PreparedStatement stmt = connection.prepareStatement("SELECT clock_timestamp()") ;
             ResultSet resultSet = stmt.executeQuery()) {
            if (!resultSet.next())
                return fail("Could not get timestamp from database");
            resultSet.getTimestamp(1);
            List<String> hungThreads = worker.hungThreads();
            if (!hungThreads.isEmpty())
                return fail("Hung threads: " + hungThreads);
            if(!hzStatus.good())
                return fail("Hazelcast is in bad state");
            return Response.ok(StatusResponse.ok()).build();
        } catch (SQLException ex) {
            log.error("Error accessing database by status(rest): {}", ex.getMessage());
            log.debug("Error accessing database by status(rest):", ex);
            return fail("Cannot access database (" + ex.getMessage() + ")");
        }
    }

    private static Response fail(String message) {
        return Response.ok(StatusResponse.error(message))
                .status(INTERNAL_SERVER_ERROR)
                .build();
    }

    /**
     * Status payload
     */
    @SuppressFBWarnings(value = {"URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD"})
    public static final class StatusResponse {

        public boolean ok;

        public String error;

        public StatusResponse() {
        }

        private StatusResponse(boolean ok, String error) {
            this.ok = ok;
            this.error = error;
        }

        public static StatusResponse ok() {
            return new StatusResponse(true, null);
        }

        public static StatusResponse error(String message) {
            return new StatusResponse(false, message);
        }
    }
}
