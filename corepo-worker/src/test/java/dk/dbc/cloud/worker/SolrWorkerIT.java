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

import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.sun.messaging.ConnectionConfiguration;
import dk.dbc.corepo.access.CORepoProvider;
import dk.dbc.json.matcher.JsonMatcher;
import dk.dbc.opensearch.commons.repository.IRepositoryDAO;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.MessageConsumer;
import javax.jms.MessageProducer;
import javax.jms.Queue;
import javax.jms.Session;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FileUtils;
import org.junit.After;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AbstractHandler;
import org.junit.AfterClass;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author kasper
 */
public class SolrWorkerIT {

    private static final Logger log = LoggerFactory.getLogger(SolrWorkerIT.class);

    private static final ObjectMapper JSON_OBJECT_MAPPER = new ObjectMapper();
    private static final ObjectMapper YAML_OBJECT_MAPPER = new YAMLMapper();

    private final String pidQueueName = "jms_pidQueue";
    private final String deadPidQueueName = "jms_deadPidQueue";

    private final String REAL_PID_FILE = "target/test-classes/870970-basis_23645564.xml";
    private final String UNIT_FILE = "target/test-classes/unit_893270.xml";
    private final String DELETED_PID_FILE = "target/test-classes/870970-basis_23645564_Deleted.xml";
    private final String INVALID_PID_FILE = "target/test-classes/870970-basis_23645564_Invalid.xml";
    private static final String PID = "870970-basis:23645564";
    private static final String UNIT = "unit:893270";

    CORepoProvider provider;
    IRepositoryDAO repository;

    private ConnectionFactory connectionFactory;
    private Connection connection;
    private Session session;
    private MessageProducer pidProducer;
    private MessageConsumer deadPidConsumer;

    @Rule
    public Timeout globalTimeout = new Timeout(120000);

    private Server jetty;
    private BlockingQueue<String> content;

    private class Consumer extends AbstractHandler {

        @Override
        public void handle(String target,
                           Request baseRequest,
                           HttpServletRequest request,
                           HttpServletResponse response) throws IOException,
                                                                ServletException {
            log.debug("request = {}", request);

            if (request.getMethod().equals("POST")) {
                try (InputStream is = request.getInputStream()) {
                    String json = SolrWorker.readInputStream(is);
                    content.offer(json);
                }
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=utf-8");
            baseRequest.setHandled(true);
            PrintWriter writer = response.getWriter();
            writer.println("{ \"ok\": true }");
        }
    }

    @Before
    public void before() throws Exception {
        connectionFactory = new com.sun.messaging.ConnectionFactory();
        ( (com.sun.messaging.ConnectionFactory) connectionFactory ).setProperty(ConnectionConfiguration.imqAddressList, "localhost:" + System.getProperty("glassfish.jms.port"));
        connection = connectionFactory.createConnection();
        connection.start();
        session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        Queue pidQueue = session.createQueue(pidQueueName);
        Queue deadPidQueue = session.createQueue(deadPidQueueName);
        pidProducer = session.createProducer(pidQueue);
        deadPidConsumer = session.createConsumer(deadPidQueue);

        provider = new CORepoProvider("IT_REPO", "jdbc:postgresql://localhost:" + System.getProperty("corepo.port") + "/corepo");
        repository = provider.getRepository();

        content = new LinkedBlockingQueue<>();
        content.clear();
        String port = System.getProperty("docstore.port");
        this.jetty = new Server(Integer.parseUnsignedInt(port));
        this.jetty.setHandler(new Consumer());
        this.jetty.start();
    }

    @After
    public void after() throws Exception {
        this.jetty.stop();
        this.jetty.destroy();
        this.jetty.join();
        deadPidConsumer.close();
        pidProducer.close();
        session.close();
        connection.close();
        repository.removeObject(repository.createIdentifier(PID));
        repository.removeObject(repository.createIdentifier(UNIT));
        repository.commit();
        provider.shutdown();
    }

    @AfterClass
    public static void afterClass() {

    }

    @Test
    //    @Ignore
    public void testAddDocument() throws Exception {
        System.out.println("testAddDocument");
        repository.ingestObject(FileUtils.readFileToString(new File(UNIT_FILE)));
        repository.ingestObject(FileUtils.readFileToString(new File(REAL_PID_FILE)));
        repository.commit();
        //Put pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString("pid", PID);
        pidProducer.send(mm);

        ArrayNode responses = fetch();
        System.out.println("responses:" +
                           JSON_OBJECT_MAPPER.writer(new DefaultPrettyPrinter()).writeValueAsString(responses));

        contentTest(responses, "testAddDocument.yaml");
    }

    @Test
    //    @Ignore
    public void testDeleteDocument() throws Exception {
        System.out.println("testDeleteDocument");
        repository.ingestObject(FileUtils.readFileToString(new File(UNIT_FILE)));
        repository.ingestObject(FileUtils.readFileToString(new File(DELETED_PID_FILE)));
        repository.commit();

        //Put pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString("pid", PID);
        pidProducer.send(mm);

        ArrayNode responses = fetch();
        contentTest(responses, "testDeleteDocument.yaml");
    }

    // This test does not verify the SolrWorker.redeliveryLimit
    // The glassfish message queue automatically moves the message to "mq.sys.dmq" after one redelivery attempt
    @Test
    //    @Ignore
    public void testMaxRetryAttemptsReached() throws JMSException, Exception {
        System.out.println("testMaxRetryAttemptsReached");
        repository.ingestObject(FileUtils.readFileToString(new File(UNIT_FILE)));
        repository.ingestObject(FileUtils.readFileToString(new File(INVALID_PID_FILE)));
        repository.commit();

        //Put "faulty" pid-message on pidQueue
        MapMessage mm = session.createMapMessage();
        mm.setString("pid", PID);
        pidProducer.send(mm);

        // Let SolrWorker handle-and-fail message until retry-limit is reached, and
        // check that the pid-message is put on dead message queue.
        // Should happen after retry-limit is reached
        MapMessage deadMessage = (MapMessage) deadPidConsumer.receive();

        assertEquals(PID, deadMessage.getString("pid"));
        assertNotNull(deadMessage.getString("exception"));

    }

    private ArrayNode fetch() throws InterruptedException, IOException {
        long t = 150;
        ArrayNode array = JSON_OBJECT_MAPPER.createArrayNode();
        for (;;) {
            String json = content.poll(t, TimeUnit.SECONDS);
            if (json == null) {
                break;
            }
            array.add(JSON_OBJECT_MAPPER.readTree(json));
            t = 2;
        }
        return array;
    }

    private void contentTest(ArrayNode responses, String testAddDocumentyaml) throws IOException, IllegalStateException {
        JsonNode tests = YAML_OBJECT_MAPPER.readTree(getClass().getClassLoader().getResource(testAddDocumentyaml));
        if (!tests.isArray()) {
            throw new IllegalStateException("Cannot parse " + testAddDocumentyaml + " into array");
        }
        for (JsonNode test : tests) {
            String name = test.get("name").asText("UNKNOWN TEST");
            boolean expected = test.get("expected").asBoolean(true);
            JsonNode expression = test.get("expression");
            System.out.println("test: " + name);
            JsonMatcher matcher = new JsonMatcher(expression);
            boolean actual = matcher.matches(responses);
            assertEquals("test: " + name, expected, actual);
        }
    }
}
