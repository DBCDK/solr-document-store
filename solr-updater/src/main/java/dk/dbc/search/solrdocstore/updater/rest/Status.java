package dk.dbc.search.solrdocstore.updater.rest;

import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.search.solrdocstore.updater.Worker;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import jakarta.annotation.Resource;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import javax.sql.DataSource;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static jakarta.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;

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

    @EJB
    Worker worker;

    public Status() {
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @SuppressFBWarnings("RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE")
    public Response getStatus() {
        log.info("getStatus called");

        try (Connection connection = dataSource.getConnection() ;
             PreparedStatement stmt = connection.prepareStatement("SELECT clock_timestamp()") ;
             ResultSet resultSet = stmt.executeQuery()) {
            if (!resultSet.next())
                return fail("Could not get timestamp from database");
            resultSet.getTimestamp(1);
            List<String> hungThreads = worker.hungThreads();
            if (!hungThreads.isEmpty())
                return fail("Hung threads: " + hungThreads);
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
