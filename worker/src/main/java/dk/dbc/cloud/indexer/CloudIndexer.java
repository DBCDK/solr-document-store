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

package dk.dbc.cloud.indexer;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import dk.dbc.opensearch.commons.fcrepo.rest.FCRepoRestClient;
import dk.dbc.opensearch.commons.fcrepo.rest.FCRepoRestClientException;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.MessageDriven;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSRuntimeException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageListener;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author kasper
 */
@MessageDriven(
        activationConfig = {
            @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
            @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = "jms/pidQueue")
//            @ActivationConfigProperty(propertyName = "connectionFactoryLookup", propertyValue = "jms/cloudConnectionFactory")
        })
public class CloudIndexer implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(CloudIndexer.class);

    @EJB
    MetricsRegistry registry;

    @EJB
    SolrIndexer docBuilder;

    @EJB
    SolrIndexerJS javascriptWrapper;

    @Inject
    JMSContext responseContext;

    FCRepoRestClient restClient;

    final int redeliveryLimit = 5;
    final String deadQueueName = "deadPidQueue";

    Timer onMessageTimer;

    @PostConstruct
    public void init() {
        onMessageTimer = registry.getRegistry().timer(MetricRegistry.name(CloudIndexer.class, "onMessage"));

        HttpClient httpClient = HttpClientBuilder.create().build();

        try {
            restClient = new FCRepoRestClient(httpClient, "dummyurl", "", "");
        }
        catch (FCRepoRestClientException ex) {
            log.error("Initializing FCRepoRestClient failed", ex);
            throw new EJBException(ex);
        }
    }

    @PreDestroy
    public void shutdown() {
        restClient.shutdown();
    }


    @Override
    public void onMessage(Message message) {
        try {
            Timer.Context time = onMessageTimer.time();
            MapMessage m = (MapMessage) message;
            String targetQueue = m.getString("documentQueueName");
            String fedoraUrl = m.getString("fedoraUrl");
            String user = m.getString("fedoraUsername");
            String password = m.getString("fedoraPassword");
            long timeStamp = m.getJMSTimestamp();
            String pid = m.getString("pid");
            int deliveryAttempts = message.getIntProperty("JMSXDeliveryCount");

            log.info("Processing message. pid: '{}'", pid);
            log.debug("FCRepo: '{}', Document Queue: '{}', Message timestamp: {}, Delivery attempts: {}",
                    new Object[] { fedoraUrl, targetQueue, timeStamp, deliveryAttempts});

            if(deliveryAttempts <= redeliveryLimit){
                restClient.updateAddress(fedoraUrl, user, password);
                docBuilder.buildDocuments(pid, javascriptWrapper, restClient, targetQueue, responseContext);
            }else{
                //Put on dead message queue
                log.error("Unable to proces message {} - redelivery limit reached", message);
                try{
                    responseContext.createProducer().send(responseContext.createQueue(deadQueueName), message);
                    log.info("Message {} moved to dead message queue", message);
                }catch(JMSRuntimeException ex){
                    log.error("Message {} could not be moved to dead message queue", message, ex);
                    throw ex;
                }
            }
            time.stop();
        } catch (JMSException ex) {
            log.error("unable to extract fields from message {}", message, ex);
            throw new EJBException(ex);
        } catch (Exception ex) {
            log.error("unable to process message {}", message, ex);
            throw new EJBException(ex.getMessage());
        }
    }

}
