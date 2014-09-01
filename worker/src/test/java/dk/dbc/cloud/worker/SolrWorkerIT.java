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

import dk.dbc.cloud.worker.SolrWorker;
import dk.dbc.cloud.worker.SolrUpdaterCallback;
import dk.dbc.cloud.worker.MetricsRegistry;
import dk.dbc.cloud.worker.SolrIndexerJS;
import dk.dbc.cloud.worker.SolrIndexer;
import dk.dbc.opensearch.commons.fcrepo.rest.FCRepoRestClient;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJBException;
import javax.jms.ConnectionFactory;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.ObjectMessage;
import javax.jms.TextMessage;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.solr.common.SolrInputDocument;
import org.hornetq.api.core.TransportConfiguration;
import org.hornetq.core.config.impl.ConfigurationImpl;
import org.hornetq.core.remoting.impl.netty.NettyAcceptorFactory;
import org.hornetq.core.remoting.impl.netty.NettyConnectorFactory;
import org.hornetq.jms.server.config.ConnectionFactoryConfiguration;
import org.hornetq.jms.server.config.JMSConfiguration;
import org.hornetq.jms.server.config.JMSQueueConfiguration;
import org.hornetq.jms.server.config.impl.ConnectionFactoryConfigurationImpl;
import org.hornetq.jms.server.config.impl.JMSConfigurationImpl;
import org.hornetq.jms.server.config.impl.JMSQueueConfigurationImpl;
import org.hornetq.jms.server.embedded.EmbeddedJMS;
import org.junit.After;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author kasper
 */
public class SolrWorkerIT {

    private SolrWorker documentWorker;
    private final String pidQueueName = "pidQueue";
    private final String documentQueueName = "documentQueue";
    private final String deadPidQueueName = "deadPidQueue";
    private EmbeddedJMS broker;
    private ConnectionFactory connectionFactory;

    public SolrWorkerIT() {
    }

    @Before
    public void before() throws Exception {
        //Setup JMS broker
        startBroker();

        //Setup document worker
        documentWorker = new SolrWorker();
        JMSContext context = connectionFactory.createContext();
        documentWorker.responseContext = context;
        JMSConsumer consumer = context.createConsumer(context.createQueue(pidQueueName));
        consumer.setMessageListener(documentWorker);
        HttpClient httpClient = HttpClientBuilder.create().build();
        documentWorker.restClient = new FCRepoRestClient(httpClient, "dummyurl", "", "");
        documentWorker.registry = new MetricsRegistry();
        documentWorker.init();

    }

    @After
    public void after() throws Exception{
        documentWorker.responseContext.close();
        documentWorker.shutdown();
        broker.stop();
    }

    @Test(timeout=10000)
    public void testAddDocument() throws JMSException {
        //init mocked Javescript SolrIndexer framework
        AddDocumentSolrIndexerMock docBuilder = new AddDocumentSolrIndexerMock();
        documentWorker.docBuilder=docBuilder;

        //Put pid-message on pidQueue
        JMSContext context = connectionFactory.createContext();
        MapMessage mm = context.createMapMessage();
        mm.setString("pid", "deletepid");
        mm.setString("documentQueueName", documentQueueName);
        context.createProducer().send(context.createQueue(pidQueueName), mm);

        //Let SolrWorker handle message
        //Check that a "add-document-message" is on documentQueue
        //and that we can cast it to SolrInputDocument
        ObjectMessage message = (ObjectMessage) context.createConsumer(context.createQueue(documentQueueName)).receive();
        SolrInputDocument doc = (SolrInputDocument) message.getObject();
    }

    @Test(timeout=10000)
    public void testDeleteDocument() throws JMSException {
        //init mocked Javescript SolrIndexer framework
        DeleteDocumentSolrIndexerMock docBuilder = new DeleteDocumentSolrIndexerMock();
        documentWorker.docBuilder=docBuilder;

        //Put pid-message on pidQueue
        JMSContext context = connectionFactory.createContext();
        MapMessage mm = context.createMapMessage();
        mm.setString("pid", "deletepid");
        mm.setString("documentQueueName", documentQueueName);
        context.createProducer().send(context.createQueue(pidQueueName), mm);

        //Let SolrWorker handle message
        //Check that a "delete-document-message" is on documentQueue
        TextMessage deleteMessage = (TextMessage) context.createConsumer(context.createQueue(documentQueueName)).receive();
        assertEquals(deleteMessage.getText(), "deletepid");

    }

    @Test(timeout=10000)
    public void testMaxRetryAttemptsReached() throws JMSException, Exception{
        //init mocked Javescript SolrIndexer framework
        ExceptionSolrIndexerMock docBuilder = new ExceptionSolrIndexerMock();
        documentWorker.docBuilder = docBuilder;

        //Put "faulty" pid-message on pidQueue
        JMSContext context = connectionFactory.createContext();
        MapMessage mm = context.createMapMessage();
        mm.setString("pid", "somepid");
        context.createProducer().send(context.createQueue(pidQueueName), mm);

        // Let SolrWorker handle-and-fail message until retry-limit is reached, and
        // check that the pid-message is put on dead message queue.
        // Should happen after retry-limit is reached
        MapMessage deadMessage = (MapMessage) context.createConsumer(context.createQueue(deadPidQueueName)).receive();
        assertEquals(deadMessage.getString("pid"), "somepid");

        //Check that buildDocuments-method has been called correct number of times
        assertEquals(docBuilder.counter, documentWorker.redeliveryLimit);

    }

    public class DeleteDocumentSolrIndexerMock extends SolrIndexer{
        @Override
        public void buildDocuments(String pid, SolrIndexerJS jsWrapper, FCRepoRestClient restClient, String targetQueue, JMSContext responseContext) {
            SolrUpdaterCallback callback = new SolrUpdaterCallback(pid, responseContext, responseContext.createQueue(targetQueue));
            callback.deleteDocument(pid);
        }
    }

    public class AddDocumentSolrIndexerMock extends SolrIndexer{
        @Override
        public void buildDocuments(String pid, SolrIndexerJS jsWrapper, FCRepoRestClient restClient, String targetQueue, JMSContext responseContext) {
            SolrUpdaterCallback callback = new SolrUpdaterCallback(pid, responseContext, responseContext.createQueue(targetQueue));
            callback.addToQueue(new SolrInputDocument());
        }
    }

    public class ExceptionSolrIndexerMock extends SolrIndexer{
        int counter = 0;
        @Override
        public void buildDocuments(String pid, SolrIndexerJS jsWrapper, FCRepoRestClient restClient, String targetQueue, JMSContext responseContext) {
            counter++;
            throw new EJBException("mocked exception");
        }
    }

    private void startBroker() throws Exception{

        org.hornetq.core.config.Configuration configuration = new ConfigurationImpl();
        configuration.setPersistenceEnabled(false);
        configuration.setSecurityEnabled(false);
        configuration.getAcceptorConfigurations()
                .add(new TransportConfiguration(NettyAcceptorFactory.class
                                .getName()));
        configuration.setPersistenceEnabled(false);

        final TransportConfiguration connectorConfig = new TransportConfiguration(
                NettyConnectorFactory.class.getName());
        configuration.getConnectorConfigurations().put("connector",
                connectorConfig);

        JMSConfiguration jmsConfig = new JMSConfigurationImpl();

        //Configure connection factory
        final List<String> connectorNames = new ArrayList<>();
        connectorNames.add("connector");
        final ConnectionFactoryConfiguration cfConfig = new ConnectionFactoryConfigurationImpl(
                "cf", false, connectorNames,
                "/cf");
        jmsConfig.getConnectionFactoryConfigurations().add(cfConfig);

        //Configure queues
        JMSQueueConfiguration queueConfig1 = new JMSQueueConfigurationImpl(pidQueueName, null, false, pidQueueName);
        jmsConfig.getQueueConfigurations().add(queueConfig1);
        JMSQueueConfiguration queueConfig2 = new JMSQueueConfigurationImpl(documentQueueName, null, false, documentQueueName);
        jmsConfig.getQueueConfigurations().add(queueConfig2);
        JMSQueueConfiguration queueConfig3 = new JMSQueueConfigurationImpl(deadPidQueueName, null, false, deadPidQueueName);
        jmsConfig.getQueueConfigurations().add(queueConfig3);

        //Start broker
        broker = new EmbeddedJMS();
        broker.setConfiguration(configuration);
        broker.setJmsConfiguration(jmsConfig);
        broker.start();
        connectionFactory = (ConnectionFactory)broker.lookup("/cf");
    }

}
