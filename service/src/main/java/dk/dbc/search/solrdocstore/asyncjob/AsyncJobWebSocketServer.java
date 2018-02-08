package dk.dbc.search.solrdocstore.asyncjob;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.StringReader;

/**
 * Class managing websocket connections, mainly parses and delegates to the session handler
 * */
@Singleton
@ServerEndpoint("/ws")
public class AsyncJobWebSocketServer {
    private static final Logger log = LoggerFactory.getLogger(AsyncJobWebSocketServer.class);

    @Inject
    AsyncJobSessionHandler sessionHandler;

    @OnOpen
    public void open(Session session){
        sessionHandler.addSession(session);
    }

    @OnClose
    public void close(Session session){
        sessionHandler.removeSession(session);
    }

    @OnError
    public void error(Throwable error){
        log.error("Web socket error:", error);
    }

    @OnMessage
    public void message(String message, Session session) {
        log.info("Recieved message: {}", message);
        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();

        }
    }
}
