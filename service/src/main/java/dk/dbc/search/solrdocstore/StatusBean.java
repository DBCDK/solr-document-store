package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.ee.stats.Timed;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import javax.annotation.Resource;
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
    @Timed
    public Response getStatus() {
        log.info("getStatus called ");

        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT NOW()")) {
            if (resultSet.next()) {
                Timestamp now = resultSet.getTimestamp(1);

                return Response.ok().entity(new Resp()).build();
            }
            return Response.ok().entity(new Resp("No rows when communicating with database")).build();

        } catch (SQLException ex) {
            log.error("Error getting connection for status: {}", ex.getMessage());
            log.debug("Error getting connection for status: ", ex);
            return Response.ok().entity(new Resp("SQL Exception: " + ex.getMessage())).build();
        }
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

    @SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
    public static class Resp {

        public boolean ok;
        public String text;

        public Resp() {
            this.ok = true;
            this.text = "Success";
        }

        public Resp(String diag) {
            this.ok = false;
            this.text = diag;
        }
    }

}
