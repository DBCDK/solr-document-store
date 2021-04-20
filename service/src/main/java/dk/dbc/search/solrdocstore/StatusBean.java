package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.StatusResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.annotation.Resource;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Stateless
@Path("status")
public class StatusBean {

    private static final ObjectMapper O = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(StatusBean.class);

    @Inject
    Config config;

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Timed(reusable = true)
    public Response getStatus() {
        log.trace("getStatus called ");

        try (Connection connection = getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT NOW()")) {
            if (resultSet.next()) {
                resultSet.getTimestamp(1);
                log.trace("status - ok");
                return Response.ok().entity(new StatusResponse()).build();
            }
            return Response.serverError().entity(new StatusResponse("No rows when communicating with database")).build();

        } catch (SQLException ex) {
            log.error("Error getting connection for status: {}", ex.getMessage());
            log.debug("Error getting connection for status: ", ex);
            return Response.serverError().entity(new StatusResponse("SQL Exception: " + ex.getMessage())).build();
        }
    }

    private Connection getConnection() throws SQLException {
        Connection connection = dataSource.getConnection();
        log.debug("Got connection");
        return connection;
    }

    @GET
    @Path("system")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSystemName() throws JsonProcessingException {
        log.info("getSystemName called");
        ObjectNode obj = O.createObjectNode();
        obj.put("systemName", config.getSystemName());
        return Response.ok().entity(O.writeValueAsString(obj)).build();
    }
}
