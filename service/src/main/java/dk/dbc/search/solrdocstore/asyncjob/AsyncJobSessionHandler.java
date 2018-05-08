package dk.dbc.search.solrdocstore.asyncjob;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.websocket.Session;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Maintains session with frontend clients. Communicates changes to queues and
 * asynchronous jobs.
 * It broadcast specific actions to all sessions, to keep frontend data up to
 * date. These are:
 * - QueueRule creation and deletion
 * - Any asynchronous job start and finish
 * It keeps track of "subscribers", which are session who wish to receive log
 * messages from a specific
 * asynchronous job, and facilitates sending these log messages to the
 * appropriate subscribers.
 * */
@Singleton
@Startup
public class AsyncJobSessionHandler {

    private static final String SUBSCRIBE_FRONTEND_TYPE = "Subscribing";
    private static final String UNSUBSCRIBE_FRONTEND_TYPE = "Unsubscribing";
    private static final String APPEND_LOG_FRONTEND_TYPE = "Appending log";
    private static final String JOB_STARTED_FRONTEND_TYPE = "Job started";
    private static final String JOB_FINISHED_FRONTEND_TYPE = "Job finished";
    public static final String QUEUE_RULE_ADDED_FRONTEND_TYPE = "Creating queue rule succeeded!";
    private static final Logger log = LoggerFactory.getLogger(AsyncJobWebSocketServer.class);
    private static final ObjectMapper O = new ObjectMapper();

    // All active sessions
    private final Set<Session> sessions = new HashSet<>();
    // Maps UUID of an asynchronous job to all its frontend session subscribers
    private final Map<UUID, List<Session>> subscribers = new HashMap<>();

    public void addSession(Session session) {
        sessions.add(session);
    }

    public void removeSession(Session session) {
        sessions.remove(session);
        subscribers.forEach((uuid, sessionList) -> sessionList.remove(session));
    }

    public void subscribe(Session session, String id) {
        UUID uuid = UUID.fromString(id);
        List<Session> sessions = subscribers.get(uuid);
        if (sessions != null) {
            sessions.add(session);
        } else {
            subscribers.put(uuid, Collections.singletonList(session));
        }
        HashMap<String, Object> fields = new HashMap<>();
        fields.put("uuid", uuid.toString());
        ObjectNode subscribeAction = buildAction(SUBSCRIBE_FRONTEND_TYPE, fields);
        sendToSession(session, subscribeAction);
    }

    public void unsubscribe(Session session, String id) {
        UUID uuid = UUID.fromString(id);
        subscribers.get(uuid).remove(session);
        HashMap<String, Object> fields = new HashMap<>();
        fields.put("uuid", id);
        ObjectNode unsubscribeAction = buildAction(UNSUBSCRIBE_FRONTEND_TYPE, fields);
        sendToSession(session, unsubscribeAction);
    }

    public void broadcastAction(String type, Map<String, Object> fields) {
        broadcast(buildAction(type, fields));
    }

    public ObjectNode buildAction(String type, Map<String, Object> fields) {
        ObjectNode obj = O.createObjectNode();
        obj.put("type", type);
        fields.forEach((fieldName, fieldValue) -> {
            Class fieldValueClass = fieldValue.getClass();
            if (fieldValueClass == String.class) {
                obj.put(fieldName, (String) fieldValue);
            } else if (fieldValueClass == Boolean.class) {
                obj.put(fieldName, (Boolean) fieldValue);
            } else if (fieldValueClass == Integer.class) {
                obj.put(fieldName, (Integer) fieldValue);
            } else if (fieldValueClass == Float.class) {
                obj.put(fieldName, (Float) fieldValue);
            } else {
                obj.putPOJO(fieldName, fieldValue);
            }
        });
        return obj;
    }

    public void register(UUID uuid, AsyncJobHandle job) {
        subscribers.computeIfAbsent(uuid, id -> new ArrayList<>());
        HashMap<String, Object> fields = new HashMap<>();
        fields.put("uuid", uuid.toString());
        fields.put("job", new AsyncJobControl.StatusResponse(job, uuid.toString()));
        broadcastAction(JOB_STARTED_FRONTEND_TYPE, fields);
    }

    public void unregister(UUID uuid, AsyncJobHandle job) {
        List<Session> sessions = subscribers.remove(uuid);
        HashMap<String, Object> fieldsUnsubscribe = new HashMap<>();
        fieldsUnsubscribe.put("uuid", uuid.toString());
        ObjectNode unsubscribeAction = buildAction(UNSUBSCRIBE_FRONTEND_TYPE, fieldsUnsubscribe);
        sessions.forEach(session -> sendToSession(session, unsubscribeAction));
        HashMap<String, Object> fields = new HashMap<>();
        fields.put("uuid", uuid.toString());
        fields.put("job", new AsyncJobControl.StatusResponse(job, uuid.toString()));
        broadcastAction(JOB_FINISHED_FRONTEND_TYPE, fields);
    }

    /*
     * Sends a log message to all sessions subscribed to the job with the
     * corresponding UUID argument
     */
    public void appendLog(UUID uuid, String message) {
        // If this job has not been messaged yet, we create it
        List<Session> sessions = subscribers.computeIfAbsent(uuid, id -> new ArrayList<>());
        // Building log message
        HashMap<String, Object> fields = new HashMap<>();
        fields.put("uuid", uuid.toString());
        fields.put("logLine", message);
        ObjectNode action = buildAction(APPEND_LOG_FRONTEND_TYPE, fields);
        // Sending log message to subscribers
        sessions.forEach((session) -> sendToSession(session, action));
    }

    private void broadcast(String message) {
        sessions.forEach(session -> {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                removeSession(session);
                log.warn("Unexpected closing when broadcasting to session: {}", session.getRequestURI());
            }
        });
    }

    private void broadcast(ObjectNode message) {
        try {
            broadcast(O.writeValueAsString(message));
        } catch (JsonProcessingException e) {
            log.error("Could not parse {}, received exception: {}", message, e);
        }
    }

    private void sendToSession(Session session, ObjectNode message) {
        try {
            session.getBasicRemote().sendText(O.writeValueAsString(message));
        } catch (IOException ex) {
            removeSession(session);
            log.warn("Unexpected closing when messaging session: {}", session.getRequestURI());
        }
    }
}
