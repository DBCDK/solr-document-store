/*
 * Copyright (C) 2014 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-cloud-indexer
 *
 * Solr-cloud-indexer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Solr-cloud-indexer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package dk.dbc.cloud.worker;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import dk.dbc.log.DBCTrackedLogContext;
import dk.dbc.solr.indexer.cloud.shared.LogAppender;
import java.io.IOException;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.MessageDriven;
import javax.inject.Inject;
import javax.jms.JMSConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;
import static net.logstash.logback.marker.Markers.append;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@MessageDriven(
        activationConfig = {
            @ActivationConfigProperty( propertyName = "endpointExceptionRedeliveryAttempts", propertyValue = "5" ),
            @ActivationConfigProperty( propertyName = "destinationType", propertyValue = "javax.jms.Queue" ),
            @ActivationConfigProperty( propertyName = "destinationLookup", propertyValue = "jms/pidQueue" ),
            @ActivationConfigProperty( propertyName = "connectionFactoryLookup", propertyValue = "jms/indexerConnectionFactory" )
        })
public class SolrWorker implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(SolrWorker.class);

    @EJB
    MetricsRegistry registry;

    @EJB
    SolrIndexer docBuilder;

    @EJB
    SolrIndexerJS javascriptWrapper;

    @Inject
    @JMSConnectionFactory( "jms/indexerConnectionFactory" )
    JMSContext responseContext;

    final static int REDELIVERY_LIMIT = 5;

    Timer onMessageTimer;

    @Inject
    AdjacentFailureHandler failureHandler;


    @Inject
    @EEConfig.Name("documentQueue")
    @EEConfig.Default(App.JMS_DOCUMENT_QUEUE_NAME)
    String documentQueue;

    @Inject
    @EEConfig.Name("deadPidQueue")
    @EEConfig.Default(App.JMS_DEADPID_QUEUE_NAME)
    String deadPidQueue;

    @PostConstruct
    public void init() {
        log.info( "Initializing SolrWorker" );
        onMessageTimer = registry.getRegistry().timer( MetricRegistry.name( SolrWorker.class, "onMessage" ) );
    }

    @PreDestroy
    public void shutdown() {
        log.info( "Shutting down SolrWorker");
    }

    /**
     * Creates CORepo Solr documents and pushes to JMS document queue.
     * Only IOExceptions should cause a message retry and a sleep penalty.
     *
     * @param message Pid
     */
    @Override
    public void onMessage( Message message ) {
        Timer.Context time = onMessageTimer.time();
        try {

            MapMessage m = (MapMessage) message;
            long timeStamp = m.getJMSTimestamp();
            String pid = m.getString( "pid" );
            DBCTrackedLogContext.setTrackingId( "SolrWorker:" + pid );
            int deliveryAttempts = message.getIntProperty( "JMSXDeliveryCount" );

            log.info(LogAppender.getMarker( App.APP_NAME, pid, LogAppender.STARTED ).
                    and( append( "JmsTimestamp", timeStamp ).
                    and( append( "deliveryAttempts", deliveryAttempts ) ) ),
                            "Started processing message" );

            try {
                docBuilder.buildDocuments(pid, javascriptWrapper, responseContext, responseContext.createQueue(documentQueue ) );
                failureHandler.reset();
            } catch (Exception ex) {

                // Looking for IOException in exception chain.
                // Have to do this since some exception wrapping is going on,
                // otherwise refactoring is needed for a cleaner solution.
                if(ExceptionUtils.indexOfType(ex, IOException.class) != -1) {
                    if (deliveryAttempts < REDELIVERY_LIMIT) {
                        throw ex;
                    }
                    sendToDeadPidQueue(pid, "Redelivery limit reached, " + LogAppender.getCauses(ex));
                } else {
                    sendToDeadPidQueue(pid, LogAppender.getCauses(ex));
                }
            }

        } catch (Exception ex) {
            log.error( LogAppender.getMarker( App.APP_NAME, LogAppender.FAILED ), "Unable to process message {}", message, ex );
            failureHandler.failure();
            throw new EJBException( ex.getMessage() );
        } finally {
            DBCTrackedLogContext.remove();
            time.stop();
        }
    }

     void sendToDeadPidQueue(String pid, String message) throws JMSException {
        try {
            MapMessage failed = responseContext.createMapMessage();
            failed.setString("pid", pid);
            failed.setString("exception", message);
            responseContext.createProducer().send(responseContext.createQueue( deadPidQueue ), failed);
            log.info( LogAppender.getMarker(App.APP_NAME, pid, LogAppender.SUCCEDED ), "Pid {} moved to dead pid queue. Caused by: {}", pid, message);
        } catch( JMSException ex ){
            log.error("Could not move pid {} to dead pid queue. Reason: {}", pid, ex.getMessage());
            throw ex;
        }
    }

}
