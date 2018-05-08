package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.pgqueue.diags.QueueStatusBean;
import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.annotation.Resource;
import javax.ejb.EJB;
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

    private static final int DIAG_MAX_CACHE_AGE = 45;
    private static final int DIAG_PERCENT_MATCH = 90;
    private static final int DIAG_COLLAPSE_MAX_ROWS = 12500;

    @Inject
    Config config;

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

    @EJB
    QueueStatusBean queueStatus;

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

    @GET
    @Path("queue")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueStatus(@QueryParam("ignore") String ignore) {
        Set<String> ign = Collections.EMPTY_SET;
        if (ignore != null && !ignore.isEmpty()) {
            ign = new HashSet<>(Arrays.asList(ignore.split(",")));
            log.debug("getQueueStatus(ign = {})", ign);
        }
        return queueStatus.getQueueStatus(dataSource, DIAG_MAX_CACHE_AGE, DIAG_PERCENT_MATCH, DIAG_COLLAPSE_MAX_ROWS, ign);
    }

    @GET
    @Path("diags")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getDiagDistribution(@QueryParam("zone") @DefaultValue("CET") String timeZoneName) {
        return queueStatus.getDiagDistribution(timeZoneName, dataSource, DIAG_PERCENT_MATCH, DIAG_COLLAPSE_MAX_ROWS);
    }

}
