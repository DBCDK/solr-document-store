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
import dk.dbc.solr.indexer.cloud.shared.SleepHandler;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.MessageDriven;
import javax.inject.Inject;
import javax.jms.JMSConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.JMSRuntimeException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;
import static net.logstash.logback.marker.Markers.append;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@MessageDriven(
        activationConfig = {
            @ActivationConfigProperty(propertyName = "endpointExceptionRedeliveryAttempts", propertyValue = "5"),
            @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
            @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = "jms/pidQueue"),
            @ActivationConfigProperty(propertyName = "connectionFactoryLookup", propertyValue = "jms/indexerConnectionFactory")
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
    @JMSConnectionFactory("jms/indexerConnectionFactory")
    JMSContext responseContext;

    final int redeliveryLimit = 5;

    Timer onMessageTimer;
    
    @Inject
    AdjacentFailureHandler failureHandler;
    
    @PostConstruct
    public void init() {
        log.info("Initializing SolrWorker");
        onMessageTimer = registry.getRegistry().timer(MetricRegistry.name(SolrWorker.class, "onMessage"));
    }

    @PreDestroy
    public void shutdown() {
        log.info( "Shutting down SolrWorker");
    }

    @Override
    public void onMessage(Message message) {
        try {
            Timer.Context time = onMessageTimer.time();
            MapMessage m = (MapMessage) message;
            long timeStamp = m.getJMSTimestamp();
            String pid = m.getString("pid");
            DBCTrackedLogContext.setTrackingId( "SolrWorker:" + pid );
            int deliveryAttempts = message.getIntProperty("JMSXDeliveryCount");

            log.info(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.STARTED).
                    and(append("JmsTimestamp", timeStamp).
                    and(append("deliveryAttempts", deliveryAttempts))),
                            "Started processing message");
            if(deliveryAttempts <= redeliveryLimit){
                docBuilder.buildDocuments(pid, javascriptWrapper, responseContext, responseContext.createQueue(App.JMS_DOCUMENT_QUEUE_NAME) );
                failureHandler.reset();
            }else{
                //Put on dead message queue
                log.error(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.FAILED),"Unable to proces message {} - redelivery limit reached", message);
                try{                    
                    responseContext.createProducer().send(responseContext.createQueue(App.JMS_DEADPID_QUEUE_NAME), message);
                    log.info(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.SUCCEDED),"Message {} moved to dead message queue", message);
                }catch(JMSRuntimeException ex){
                    log.error(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.FAILED),"Message {} could not be moved to dead message queue", message, ex);
                    throw ex;
                }
            }
            time.stop();
        } catch (Exception ex) {
            log.error(LogAppender.getMarker(App.APP_NAME, LogAppender.FAILED),"Unable to process message {}", message, ex);
            failureHandler.failure();
            throw new EJBException(ex.getMessage());
        } finally {
            DBCTrackedLogContext.remove();
        }
    }

}
