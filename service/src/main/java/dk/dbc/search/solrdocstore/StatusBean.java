package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.search.solrdocstore.monitor.Timed;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.sql.DataSource;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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
        return Response.ok().entity("{ \"ok\": true }").build();
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

    private ObjectNode queueStatus = null;
    private long queueStatusExpiresAtEpochMs = 0;
    private static final Object QUEUE_STATUS_SYNC = new Object();

    @GET
    @Path("queue")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueStatus(@QueryParam("max-age") @DefaultValue("60") Integer maxAge) throws JsonProcessingException {
        log.info("getQueueStatus called");
        synchronized (QUEUE_STATUS_SYNC) {
            if (queueStatus != null && queueStatusExpiresAtEpochMs > System.currentTimeMillis()) {
                queueStatus.put("cached", Boolean.TRUE);
            } else {
                queueStatus = O.createObjectNode();
                queueStatus.put("cached", Boolean.FALSE);
                queueStatus.put("ok", Boolean.TRUE);
                try (Connection connection = dataSource.getConnection() ;
                     Statement stmt = connection.createStatement() ;
                     PreparedStatement prepStmt = connection.prepareStatement("SELECT CAST(EXTRACT('epoch' FROM NOW() - dequeueafter) AS INTEGER) FROM queue WHERE consumer = ? ORDER BY dequeueafter LIMIT 1") ;
                     ResultSet resultSet = stmt.executeQuery("SELECT consumer, COUNT(*) FROM queue GROUP BY consumer")) {
                    while (resultSet.next()) {
                        int i = 0;
                        String consumer = resultSet.getString(++i);
                        int count = resultSet.getInt(++i);
                        Integer age = null;
                        prepStmt.setString(1, consumer);
                        try (ResultSet preResultSet = prepStmt.executeQuery()) {
                            if (preResultSet.next()) {
                                age = preResultSet.getInt(1);
                                if (age > maxAge) {
                                    queueStatus.put("ok", Boolean.FALSE);
                                }
                            }
                        }
                        ObjectNode scope = queueStatus.putObject(consumer);
                        scope.put("count", count);
                        scope.put("age", age);
                    }
                } catch (SQLException ex) {
                    queueStatus.put("ok", Boolean.FALSE);
                    queueStatus.put("status", "Sql Exception");
                    log.error("Sql error counting queue entries: {}", ex.getMessage());
                    log.debug("Sql error counting queue entries: ", ex);
                }
                queueStatusExpiresAtEpochMs = System.currentTimeMillis() + 60_000L;
            }
        }
        return Response.ok().entity(O.writeValueAsString(queueStatus)).build();
    }
}
