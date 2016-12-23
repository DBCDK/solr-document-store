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

import com.sun.messaging.ConnectionConfiguration;
import dk.dbc.corepo.access.CORepoProvider;
import dk.dbc.opensearch.commons.repository.IRepositoryDAO;
import java.io.File;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.MessageConsumer;
import javax.jms.MessageProducer;
import javax.jms.ObjectMessage;
import javax.jms.Queue;
import javax.jms.Session;
import org.apache.commons.io.FileUtils;
import org.apache.solr.common.SolrInputDocument;
import org.junit.After;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

/**
 *
 * @author kasper
 */
public class SolrWorkerIT {

    private final String pidQueueName = "jms_pidQueue";
    private final String documentQueueName = "jms_solrDocuments";
    private final String deadPidQueueName = "jms_deadPidQueue";

    private final String REAL_PID_FILE = "target/test-classes/870970-basis_23645564.xml";
    private final String DELETED_PID_FILE = "target/test-classes/870970-basis_23645564_Deleted.xml";
    private final String INVALID_PID_FILE = "target/test-classes/870970-basis_23645564_Invalid.xml";
    private static final String PID = "870970-basis:23645564";

    CORepoProvider provider;
    IRepositoryDAO repository;

    private ConnectionFactory connectionFactory;
    private Connection connection;
    private Session session;
    private MessageProducer pidProducer;
    private MessageConsumer documentConsumer;
    private MessageConsumer deadPidConsumer;

    @Rule
    public Timeout globalTimeout = new Timeout( 120000 );

    @Before
    public void before() throws Exception {
        connectionFactory = new com.sun.messaging.ConnectionFactory();
        ( ( com.sun.messaging.ConnectionFactory ) connectionFactory ).setProperty( ConnectionConfiguration.imqAddressList, "localhost:" + System.getProperty( "glassfish.jms.port" ) );
        connection = connectionFactory.createConnection();
        connection.start();
        session = connection.createSession( false, Session.AUTO_ACKNOWLEDGE );
        Queue pidQueue = session.createQueue( pidQueueName );
        Queue documentQueue = session.createQueue( documentQueueName );
        Queue deadPidQueue = session.createQueue( deadPidQueueName );
        pidProducer = session.createProducer( pidQueue );
        documentConsumer = session.createConsumer( documentQueue );
        deadPidConsumer = session.createConsumer( deadPidQueue );

        provider = new CORepoProvider( "IT_REPO", "jdbc:postgresql://localhost:" + System.getProperty( "corepo.port" ) + "/corepo" );
        repository = provider.getRepository();
    }

    @After
    public void after() throws Exception {
        deadPidConsumer.close();
        documentConsumer.close();
        pidProducer.close();
        session.close();
        connection.close();
        repository.removeObject( repository.createIdentifier( PID ) );
        repository.commit();
        provider.shutdown();
    }

    @Test
    public void testAddDocument() throws Exception {
        repository.ingestObject( FileUtils.readFileToString( new File( REAL_PID_FILE ) ) );
        repository.commit();
        //Put pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString( "pid", PID );
        pidProducer.send( mm );

        //Let SolrWorker handle message
        //Check that a "add-document-message" is on documentQueue
        //and that we can cast it to SolrInputDocument
        ObjectMessage message = ( ObjectMessage ) documentConsumer.receive();
        SolrInputDocument doc = ( SolrInputDocument ) message.getObject();
    }

    @Test
    public void testDeleteDocument() throws Exception {
        repository.ingestObject( FileUtils.readFileToString( new File( DELETED_PID_FILE ) ) );
        repository.commit();

        //Put pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString( "pid", PID );
        pidProducer.send( mm );

        //Let SolrWorker handle message
        //Check that a "delete-document-message" is on documentQueue
        MapMessage deleteMessage = ( MapMessage ) documentConsumer.receive();
        assertEquals( "Deleted expected document id", "23645564/32!" + PID + "-870970-basis", deleteMessage.getString( SolrUpdaterCallback.DOCUMENT_ID ) );
        assertEquals( "Deleted expected stream date", "2016-08-26T04:25:20.331Z", deleteMessage.getString( SolrUpdaterCallback.STREAM_DATE ) );

    }

    // This test does not verify the SolrWorker.redeliveryLimit
    // The glassfish message queue automatically moves the message to "mq.sys.dmq" after one redelivery attempt
    @Test
    public void testMaxRetryAttemptsReached() throws JMSException, Exception {
        repository.ingestObject( FileUtils.readFileToString( new File( INVALID_PID_FILE ) ) );
        repository.commit();

        //Put "faulty" pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString( "pid", PID );
        pidProducer.send( mm );

        // Let SolrWorker handle-and-fail message until retry-limit is reached, and
        // check that the pid-message is put on dead message queue.
        // Should happen after retry-limit is reached
        MapMessage deadMessage = ( MapMessage ) deadPidConsumer.receive();

        assertEquals( PID, deadMessage.getString( "pid" ) );
        assertNotNull( deadMessage.getString( "exception" ) );
        
    }
}
