package dk.dbc.search.solrdocstore.asyncjob;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;

import java.util.UUID;

public class AsyncJobWesocketAppender extends AppenderBase<ILoggingEvent> {

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
