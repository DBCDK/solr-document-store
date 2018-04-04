package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import dk.dbc.search.solrdocstore.monitor.Timed;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
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

    private static final int DIAG_PERCENT_MATCH = 90;
    protected static final int DIAG_COLLAPSE_MAX_ROWS = 12500;

    @Inject
    Config config;

    @Resource(lookup = "jdbc/solr-doc-store")
    DataSource dataSource;

    @Resource(type = ManagedExecutorService.class)
    ExecutorService es;

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

    private static final ObjectNode QUEUE_STATUS = O.createObjectNode();;

    @GET
    @Path("queue")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueStatus(@QueryParam("max-age") @DefaultValue("60") Integer maxAge) {
        log.info("getQueueStatus called");
        try {
            synchronized (QUEUE_STATUS) {
                JsonNode expires = QUEUE_STATUS.get("expires");
                if (expires != null && Instant.parse(expires.asText()).isAfter(Instant.now())) {
                    QUEUE_STATUS.put("cached", Boolean.TRUE);
                } else {
                    QUEUE_STATUS.removeAll();
                    QUEUE_STATUS.put("cached", Boolean.FALSE);
                    QUEUE_STATUS.put("queue", "Internal Error");
                    QUEUE_STATUS.put("diag", "Internal Error");
                    Future<JsonNode> queue = es.submit(this::createQueueStatusNode);
                    Future<JsonNode> diag = es.submit(this::createDiagStatusNode);
                    QUEUE_STATUS.set("queue", queue.get());
                    QUEUE_STATUS.set("diag", diag.get());
                    QUEUE_STATUS.put("expires", Instant.now().plusSeconds(60).toString());
                }
                QUEUE_STATUS.put("max-age", maxAge);
                JsonNode queue = QUEUE_STATUS.get("queue");
                if (queue.isObject()) {
                    QUEUE_STATUS.put("ok", Boolean.TRUE);
                    for (JsonNode node : queue) {
                        if (node.isObject() && node.has("age")) {
                            int age = node.get("age").asInt();
                            if (age > maxAge) {
                                QUEUE_STATUS.put("ok", Boolean.FALSE);
                            }
                        }
                    }
                } else {
                    QUEUE_STATUS.put("ok", Boolean.FALSE);
                }
                return Response.ok().entity(O.writeValueAsString(QUEUE_STATUS)).build();
            }
        } catch (InterruptedException | ExecutionException ex) {
            log.error("Error getting queue status: {}", ex.getMessage());
            log.debug("Error getting queue status: ", ex);
            return Response.status(Response.Status.REQUEST_TIMEOUT).build();
        } catch (JsonProcessingException ex) {
            log.error("Error getting queue status: {}", ex.getMessage());
            log.debug("Error getting queue status: ", ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    private JsonNode createQueueStatusNode() {
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             PreparedStatement prepStmt = connection.prepareStatement("SELECT CAST(EXTRACT('epoch' FROM NOW() - dequeueafter) AS INTEGER) FROM queue WHERE consumer = ? ORDER BY dequeueafter LIMIT 1") ;
             ResultSet resultSet = stmt.executeQuery("SELECT consumer, COUNT(*) FROM queue GROUP BY consumer")) {
            ObjectNode node = O.createObjectNode();
            while (resultSet.next()) {
                int i = 0;
                String consumer = resultSet.getString(++i);
                int count = resultSet.getInt(++i);
                Integer age = null;
                prepStmt.setString(1, consumer);
                try (ResultSet preResultSet = prepStmt.executeQuery()) {
                    if (preResultSet.next()) {
                        age = preResultSet.getInt(1);
                    }
                }
                ObjectNode scope = node.putObject(consumer);
                scope.put("count", count);
                scope.put("age", age);
            }
            return node;
        } catch (SQLException ex) {
            log.error("Sql error counting queue entries: {}", ex.getMessage());
            log.debug("Sql error counting queue entries: ", ex);
            return new TextNode("SQL Exception");
        }
    }

    private JsonNode createDiagStatusNode() {
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT diag FROM queue_error")) {
            ObjectNode node = O.createObjectNode();
            HashMap<ArrayList<String>, AtomicInteger> diags = new HashMap<>();
            int c = 0;
            while (resultSet.next() && c++ <= DIAG_COLLAPSE_MAX_ROWS) {
                addToDiags(diags, resultSet.getString(1));
            }
            if(c > DIAG_COLLAPSE_MAX_ROWS) {
                node.put("", "Diags limited to " + DIAG_COLLAPSE_MAX_ROWS + " rows");
            }
            Map<ArrayList<String>, String> sortKey = diags.keySet().stream()
                    .collect(Collectors.toMap(a -> a, a -> diagAsString(a)));
            diags.entrySet().stream()
                    .sorted((l, r) -> sortKey.get(l.getKey()).compareToIgnoreCase(sortKey.get(r.getKey())))
                    .forEach(e -> {
                        node.put(sortKey.get(e.getKey()), e.getValue().get());
                    });
            return node;
        } catch (SQLException ex) {
            log.error("Sql error counting queue entries: {}", ex.getMessage());
            log.debug("Sql error counting queue entries: ", ex);
            return new TextNode("SQL Exception");
        }
    }

    private void addToDiags(HashMap<ArrayList<String>, AtomicInteger> accumulated, String text) {
        ArrayList<String> target = null;
        int lenLeftTarget = 0;
        int lenRightTarget = 0;
        int lenTotalTarget = 0;
        List<String> diag = Arrays.asList(text.split("\\b"));
        int lenDiag = diag.size();
        for (ArrayList<String> candidate : accumulated.keySet()) {
            int lenLeft = diagLenLeft(candidate, diag);
            if (lenLeft == lenDiag) {
                accumulated.get(candidate).incrementAndGet();
                return;
            }
            int lenRight = diagLenRight(candidate, diag);
            int lenTotal = lenLeft + lenRight;
            if (( lenTotal > lenTotalTarget ) ||
                ( lenTotal == lenTotalTarget && lenRight > lenRightTarget )) { // Prioritize longer trailing match (failure reason)
                lenLeftTarget = lenLeft;
                lenRightTarget = lenRight;
                lenTotalTarget = lenTotal;
                target = candidate;
            }
        }
        if (target != null) {
            if (target.size() == ( 1 + lenTotalTarget ) && target.get(lenLeftTarget).isEmpty()) {
                accumulated.get(target).incrementAndGet();
                return;
            } else {
                int maxLen = Integer.max(diag.size(), target.size());
                if (lenTotalTarget >= maxLen * DIAG_PERCENT_MATCH / 100) {
                    AtomicInteger integer = accumulated.remove(target);
                    integer.incrementAndGet();
                    target.clear();
                    target.addAll(diag.subList(0, lenLeftTarget));
                    target.add("");
                    int len = diag.size();
                    target.addAll(diag.subList(len - lenRightTarget, len));
                    accumulated.put(target, integer);
                    return;
                }
            }
        }
        target = new ArrayList<>(diag);
        accumulated.put(target, new AtomicInteger(1));
    }

    private int diagLenRight(List<String> combined, List<String> errs) {
        combined = new ArrayList<>(combined);
        errs = new ArrayList<>(errs);
        Collections.reverse(combined);
        Collections.reverse(errs);
        Iterator<String> ci = combined.iterator();
        Iterator<String> ei = errs.iterator();
        int lenRight = 0;
        while (ci.hasNext() && ei.hasNext()) {
            String cstr = ci.next();
            String estr = ei.next();
            if (cstr.equals(estr)) {
                lenRight++;
            } else {
                break;
            }
        }
        return lenRight;
    }

    private int diagLenLeft(List<String> combined, List<String> errs) {
        Iterator<String> ci = combined.iterator();
        Iterator<String> ei = errs.iterator();
        int lenLeft = 0;
        while (ci.hasNext() && ei.hasNext()) {
            String cstr = ci.next();
            String estr = ei.next();
            if (cstr.equals(estr)) {
                lenLeft++;
            } else {
                break;
            }
        }
        return lenLeft;
    }

    private String diagAsString(ArrayList<String> pattern) {
        return pattern.stream()
                .map(s -> s.isEmpty() ? "*" : s)
                .collect(Collectors.joining());
    }

}
