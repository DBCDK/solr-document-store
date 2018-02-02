package dk.dbc.search.solrdocstore.asyncjob;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class AsyncJobWesocketAppender extends AppenderBase<ILoggingEvent> {
    private static final Logger log = LoggerFactory.getLogger(AsyncJobHandle.class);
    private final UUID uuid;
    private final AsyncJobSessionHandler sessionHandler;

    public AsyncJobWesocketAppender(UUID uuid,String name,AsyncJobSessionHandler sessionHandler) {
        this.uuid = uuid;
        this.sessionHandler = sessionHandler;
        sessionHandler.register(uuid,name);
    }

    @Override
    protected void append(ILoggingEvent eventObject) {
        log.info("We are websocket appending: {}",eventObject);
        sessionHandler.appendLog(uuid,eventObject.getFormattedMessage());
    }

    @Override
    public void stop(){
        sessionHandler.unregister(uuid);
        super.stop();
    }
}
