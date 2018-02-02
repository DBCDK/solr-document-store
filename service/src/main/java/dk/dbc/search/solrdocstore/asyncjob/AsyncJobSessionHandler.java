package dk.dbc.search.solrdocstore.asyncjob;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.search.solrdocstore.QueueRuleEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Maintains session with frontend clients. Communicates changes to queues and asynchronous jobs.
 * It broadcast specific actions to all sessions, to keep frontend data up to date. These are:
 *  - QueueRule creation and deletion
 *  - Any asynchronous job start and finish
 * It keeps track of "subscribers", which are session who wish to receive log messages from a specific
 * asynchronous job, and facilitates sending these log messages to the appropriate subscribers.
 * */
@Singleton
@Startup
public class AsyncJobSessionHandler {
    private static final String SUBSCRIBE_FRONTEND_TYPE = "Subscribing";
    private static final String UNSUBSCRIBE_FRONTEND_TYPE = "Unsubscribing";
    private static final String APPEND_LOG_FRONTEND_TYPE = "Appending log";
    private static final String JOB_STARTED_FRONTEND_TYPE = "Job started";
    private static final String JOB_FINISHED_FRONTEND_TYPE = "Job finished";
    private static final Logger log = LoggerFactory.getLogger(AsyncJobWebSocketServer.class);
    private static final ObjectMapper O = new ObjectMapper();

    // All active sessions
    private final Set<Session> sessions = new HashSet<>();
    // Maps UUID of an asynchronous job to all its frontend session subscribers
    private final Map<UUID, List<Session>> subscribers = new HashMap<>();

    @Inject
    AsyncJobRunner runner;

    public void addSession(Session session){
        sessions.add(session);
    }

    public void removeSession(Session session){
        sessions.remove(session);
        subscribers.forEach((uuid, sessionList)-> sessionList.remove(session));
    }

    public void jobs(Session session){
        JsonProvider provider = JsonProvider.provider();
        JsonArrayBuilder result = provider.createArrayBuilder();
        for (String job : runner.jobs().keySet()){
            result.add(job);
        }
        JsonObject json = provider.createObjectBuilder()
                .add("result", result)
                .add("pages", 1)
                .build();
        sendToSession(session, json);
    }

    public void subscribe(Session session, String id){
        UUID uuid = UUID.fromString(id);
        List <Session> sessions = subscribers.get(uuid);
        if(sessions != null){
            sessions.add(session);
        } else {
            subscribers.put(uuid, Collections.singletonList(session));
        }
        sendToSession(session, buildUUIDAction(SUBSCRIBE_FRONTEND_TYPE,uuid));
    }

    public void unsubscribe(Session session, String id){
        UUID uuid = UUID.fromString(id);
        subscribers.get(uuid).remove(session);
        sendToSession(session, buildUUIDAction(UNSUBSCRIBE_FRONTEND_TYPE,uuid));
    }

    public void broadcastAction(String type, Map<String, Object> fields){
        ObjectNode obj = O.createObjectNode();
        obj.put("type", type);
        fields.forEach((fieldName, fieldValue) -> {
            Class fieldValueClass = fieldValue.getClass();
            if(fieldValueClass == String.class){
                obj.put(fieldName, (String) fieldValue);
            } else if(fieldValueClass == Boolean.class) {
               obj.put(fieldName, (Boolean) fieldValue);
            } else if(fieldValueClass == Integer.class){
                obj.put(fieldName, (Integer) fieldValue);
            } else if(fieldValueClass == Float.class) {
                obj.put(fieldName, (Float) fieldValue);
            } else {
                obj.putPOJO(fieldName, fieldValue);
            }
        });
    }

    public void broadcast(String message){
        sessions.forEach(session -> {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                removeSession(session);
                log.warn("Unexpected closing when broadcasting to session: {}", session.getRequestURI());
            }
        });
    }
    public void broadcast(JsonObject message){
        broadcast(message.toString());
    }

    private void sendToSession(Session session, JsonObject message){
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            removeSession(session);
            log.warn("Unexpected closing when messaging session: {}", session.getRequestURI());
        }
    }

    private JsonObject buildSingleArgAction(String type,String argName,String arg){
        return provider.createObjectBuilder()
                .add("type",type)
                .add(argName,arg)
                .build();
    }

    private JsonObject buildUUIDAction(String type,UUID uuid){
        return buildSingleArgAction(type,"uuid",uuid.toString());
    }
}
