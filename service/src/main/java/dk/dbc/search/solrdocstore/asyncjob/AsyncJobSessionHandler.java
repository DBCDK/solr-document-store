package dk.dbc.search.solrdocstore.asyncjob;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.search.solrdocstore.QueueRuleEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Singleton;
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

@Singleton
public class AsyncJobSessionHandler {
    private static final Logger log = LoggerFactory.getLogger(AsyncJobWebSocketServer.class);
    private static final ObjectMapper O = new ObjectMapper();
    @Inject
    AsyncJobRunner runner;
    private final Set<Session> sessions = new HashSet<>();
    private final Set<AsyncJob> jobs = new HashSet<>();
    private final Map<UUID,List<Session>> subscribers = new HashMap<>();

    public void addSession(Session session){
        sessions.add(session);
    }

    public void removeSession(Session session){
        sessions.remove(session);
        subscribers.forEach((uuid,sessionList)-> sessionList.remove(session));
    }

    public void jobs(Session session){
        JsonProvider provider = JsonProvider.provider();
        JsonArrayBuilder result = provider.createArrayBuilder();
        for (String job : runner.jobs().keySet()){
            result.add(job);
        }
        JsonObject json = provider.createObjectBuilder()
                .add("result",result)
                .add("pages",1)
                .build();
        sendToSession(session,json);
    }

    public void subscribe(Session session, String id){
        UUID uuid = UUID.fromString(id);
        List <Session> sessions = subscribers.get(uuid);
        if(sessions != null){
            sessions.add(session);
        } else {
            subscribers.put(uuid, Collections.singletonList(session));
        }
    }

    public void unsubscribe(Session session, String id){
        subscribers.get(UUID.fromString(id)).remove(session);
    }

    public void addQueueRule(QueueRuleEntity queueRuleEntity) {
        ObjectNode obj = O.createObjectNode();
        obj.put("type","Creating queue rule succeeded!");
        obj.putPOJO("queueRule",queueRuleEntity);
        try {
            broadcast(O.writeValueAsString(obj));
        } catch (JsonProcessingException e) {
            log.error("Unable to parse queue for some reason...",e);
        }
    }

    public void broadcast(String message){
        sessions.forEach(session -> {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                removeSession(session);
                log.warn("Unexpected closing when brodcasting to session: {}",session.getRequestURI());
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
            log.warn("Unexpected closing when messaging session: {}",session.getRequestURI());
        }
    }
}
