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
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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

    private static final ObjectNode QUEUE_STATUS = makeQueueStatueFramework();

    private static ObjectNode makeQueueStatueFramework() {
        ObjectNode root = O.createObjectNode();
        root.putObject("props");
        return root;
    }

    @GET
    @Path("queue")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueStatus() {
        log.info("getQueueStatus called");
        try {
            synchronized (QUEUE_STATUS) {
                ObjectNode props = (ObjectNode) QUEUE_STATUS.get("props");
                JsonNode expires = props.get("expires");
                if (expires != null && Instant.parse(expires.asText()).isAfter(Instant.now())) {
                    props.put("cached", Boolean.TRUE);
                } else {
                    Instant preTime = Instant.now();
                    QUEUE_STATUS.removeAll();
                    props = QUEUE_STATUS.putObject("props");
                    props.put("cached", Boolean.FALSE);
                    QUEUE_STATUS.put("queue", "Internal Error");
                    QUEUE_STATUS.put("queue-max-age", "NaN");
                    QUEUE_STATUS.put("diag", "Internal Error");
                    QUEUE_STATUS.put("diag-count", "NaN");
                    Future<JsonNode> queue = es.submit(this::createQueueStatusNode);
                    Future<JsonNode> diag = es.submit(this::createDiagStatusNode);
                    Future<Integer> diagCount = es.submit(this::createDiagCount);

                    JsonNode queueNode = queue.get();
                    QUEUE_STATUS.set("queue", queueNode);
                    int queueMaxAge = 0;
                    if (queueNode.isObject()) {
                        for (JsonNode node : queueNode) {
                            if (node.isObject() && node.has("age")) {
                                int age = node.get("age").asInt();
                                queueMaxAge = Integer.max(queueMaxAge, age);
                            }
                        }
                    }
                    QUEUE_STATUS.put("queue-max-age", queueMaxAge);

                    QUEUE_STATUS.set("diag", diag.get());
                    int diagCountNumber = diagCount.get();
                    QUEUE_STATUS.put("diag-count", diagCountNumber);
                    if (diagCountNumber > DIAG_COLLAPSE_MAX_ROWS) {
                        QUEUE_STATUS.put("diag-count-warning", "Too many diag rows for collapsing, only looking at " + DIAG_COLLAPSE_MAX_ROWS + " rows");
                    }
                    Instant postTime = Instant.now();
                    long duration = preTime.until(postTime, ChronoUnit.MILLIS);
                    props.put("query-time(ms)", duration);
                    long seconds = Long.min(60, (long) Math.pow(2.0, Math.log(duration)));
                    props.put("will-cache(s)", seconds);
                    props.put("run-at", postTime.toString());
                    props.put("expires", postTime.plusSeconds(seconds).toString());
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

    @GET
    @Path("diags")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getDiagDistribution(@QueryParam("zone") @DefaultValue("CET") String timeZoneName) {
        log.info("getDiagDistribution");
        try {
            ZoneId zone = ZoneId.of(timeZoneName);
            ObjectNode obj = O.createObjectNode();
            JsonNode ret = obj;
            JsonNode node = createDiagStatusNode();
            if (node.isObject()) {
                HashMap<String, Future<JsonNode>> futures = new HashMap<>();
                for (Iterator<String> iterator = node.fieldNames() ; iterator.hasNext() ;) {
                    String pattern = iterator.next();
                    futures.put(pattern, es.submit(() -> listDiagsByTime(pattern, zone)));
                }
                for (Map.Entry<String, Future<JsonNode>> entry : futures.entrySet()) {
                    obj.set(entry.getKey(), entry.getValue().get());
                }
            } else {
                ret = node;
            }
            return Response.ok().entity(O.writeValueAsString(ret)).build();
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
        HashMap<ArrayList<String>, AtomicInteger> diags = new HashMap<>();
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT diag FROM queue_error LIMIT " + DIAG_COLLAPSE_MAX_ROWS)) {
            while (resultSet.next()) {
                addToDiags(diags, resultSet.getString(1));
            }
        } catch (SQLException ex) {
            log.error("Sql error counting queue entries: {}", ex.getMessage());
            log.debug("Sql error counting queue entries: ", ex);
            return new TextNode("SQL Exception");
        }
        ObjectNode node = O.createObjectNode();
        Map<ArrayList<String>, String> sortKey = diags.keySet().stream()
                .collect(Collectors.toMap(a -> a, a -> diagAsString(a)));
        diags.entrySet().stream()
                .sorted((l, r) -> sortKey.get(l.getKey()).compareToIgnoreCase(sortKey.get(r.getKey())))
                .forEach(e -> {
                    node.put(sortKey.get(e.getKey()), e.getValue().get());
                });
        return node;
    }

    private Integer createDiagCount() {
        try (Connection connection = dataSource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT COUNT(*) FROM queue_error")) {
            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
        } catch (SQLException ex) {
            log.error("Sql error counting queue entries: {}", ex.getMessage());
            log.debug("Sql error counting queue entries: ", ex);
        }
        return null;
    }

    private JsonNode listDiagsByTime(String pattern, ZoneId zone) {
        ObjectNode obj = O.createObjectNode();
        String likePattern = pattern.replaceAll("([_%])", "\\$1").replaceAll("\\*", "%");
        log.debug("pattern = {}; likePattern = {}", pattern, likePattern);
        try (Connection connection = dataSource.getConnection() ;
             PreparedStatement stmt = connection.prepareStatement("SELECT DATE_TRUNC('MINUTE',failedat) AS at, COUNT(*) FROM queue_error WHERE diag LIKE ? GROUP BY at ORDER BY at")) {
            stmt.setString(1, likePattern);
            try (ResultSet resultSet = stmt.executeQuery()) {
                while (resultSet.next()) {
                    obj.put(resultSet.getTimestamp(1).toInstant().atZone(zone).toString(), resultSet.getInt(2));
                }
            }
            return obj;
        } catch (SQLException ex) {
            log.error("Sql error grouping diags by time: {}", ex.getMessage());
            log.debug("Sql error grouping diags by time: ", ex);
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
