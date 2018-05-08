package dk.dbc.search.solrdocstore.asyncjob;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

public class AsyncJobWesocketAppender extends AppenderBase<ILoggingEvent> {

    private static final Logger log = LoggerFactory.getLogger(AsyncJobHandle.class);
    private final UUID uuid;
    private final AsyncJobHandle job;
    private final AsyncJobSessionHandler sessionHandler;

    public AsyncJobWesocketAppender(UUID uuid, AsyncJobHandle job, AsyncJobSessionHandler sessionHandler) {
        this.uuid = uuid;
        this.job = job;
        this.sessionHandler = sessionHandler;
    }

    @Override
    public void start() {
        super.start();
        sessionHandler.register(uuid, job);
    }

    @Override
    protected void append(ILoggingEvent eventObject) {
        sessionHandler.appendLog(uuid, eventObject.getFormattedMessage());
    }

    @Override
    public void stop() {
        sessionHandler.unregister(uuid, job);
        super.stop();
    }
}
