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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.log.DBCTrackedLogContext;
import dk.dbc.opensearch.commons.repository.RepositoryException;
import dk.dbc.solr.indexer.cloud.shared.DeleteMessage;
import dk.dbc.solr.indexer.cloud.shared.LogAppender;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
import org.apache.http.Header;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@MessageDriven(
        activationConfig = {
            @ActivationConfigProperty(propertyName = "endpointExceptionRedeliveryAttempts", propertyValue = "5")
            ,
            @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue")
            ,
            @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = "jms/pidQueue")
            ,
            @ActivationConfigProperty(propertyName = "connectionFactoryLookup", propertyValue = "jms/indexerConnectionFactory")
        })
public class SolrWorker implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(SolrWorker.class);

    private static final Pattern ID_PATTERN = Pattern.compile("^(\\d+-\\w+:(.*))-(\\d+)-(\\w+)$");
    private static final ObjectMapper O = new ObjectMapper();

    @EJB
    MetricsRegistry registry;

    @EJB
    SolrIndexer docBuilder;

    @EJB
    SolrIndexerJS javascriptWrapper;

    @EJB
    OtherRecordIds otherRecordIds;

    @Inject
    @JMSConnectionFactory("jms/indexerConnectionFactory")
    JMSContext responseContext;

    final static int REDELIVERY_LIMIT = 5;

    Timer onMessageTimer;
    Timer solrDocStoreTimer;

    @Inject
    AdjacentFailureHandler failureHandler;

    @Inject
    @EEConfig.Name("deadPidQueue")
    @EEConfig.Default(App.JMS_DEADPID_QUEUE_NAME)
    String deadPidQueue;

    @Inject
    @EEConfig.Name("prettyPrintJson")
    @EEConfig.Default("false")
    boolean prettyPrintJson;

    @Inject
    @EEConfig.Name("solrDocStoreUrl")
    private String solrDocStoreUrl;

    @Inject
    @EEConfig.Name("commitWithin")
    @EEConfig.Default("-1")
    private long commitWithin;

    private CloseableHttpClient client;
    private ObjectWriter printer;

    @PostConstruct
    public void init() {
        log.info("Initializing SolrWorker");
        onMessageTimer = registry.getRegistry().timer(MetricRegistry.name(SolrWorker.class, "onMessage"));
        solrDocStoreTimer = registry.getRegistry().timer(MetricRegistry.name(SolrWorker.class, "solrDocStore"));
        log.info("solrDocStoreUrl = {}", solrDocStoreUrl);
        this.client = HttpClientBuilder.create()
                .build();
        this.printer = prettyPrintJson ?
                       O.writer(new DefaultPrettyPrinter()) :
                       O.writer();
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down SolrWorker");
    }

    /**
     * Pushes records to SolrDocStore
     *
     * @param foXml   the original FoXML
     * @param updater Object containing all generated documents
     */
    public void deployRecords(String foXml, SolrUpdaterCallback updater) {
        String trackingId = updater.getTrackingId();
        HashSet<String> marc002a = otherRecordIds.fromFoXML(foXml);
        try {
            String pid = updater.getPid();
            String unit = docBuilder.unitFor(pid);
            String work = docBuilder.workFor(unit);

            for (Map<String, Set<String>> updatedDocument : updater.getUpdatedDocuments()) {
                ObjectNode record = O.createObjectNode();
                String id = updatedDocument.get("id").iterator().next();
                makeMetadata(record, id, false, unit, work, trackingId, marc002a);
                ObjectNode document = record.putObject("indexKeys");
                for (Map.Entry<String, Set<String>> entry : updatedDocument.entrySet()) {
                    ArrayNode documentKey = document.putArray(entry.getKey());
                    for (String value : entry.getValue()) {
                        documentKey.add(value);
                    }
                }
                sendRecordToSolrDocStore(id, record);
            }

            for (DeleteMessage deletedDocument : updater.getDeletedDocuments()) {
                ObjectNode record = O.createObjectNode();
                String id = deletedDocument.getDocumentId();
                makeMetadata(record, id, true, unit, work, trackingId, Collections.EMPTY_SET);
                sendRecordToSolrDocStore(id, record);
            }

        } catch (RepositoryException ex) {
            throw new RuntimeException("Defect unit structure", ex);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Error making JSON", ex);
        } catch (IOException ex) {
            throw new RuntimeException("Error communicating with solrDocStore", ex);
        }
    }

    /**
     * Add metadata to structure
     *
     * @param record     Json to add metadata to
     * @param id         ID of record as procuced by the javascript
     * @param deleted    deleted value
     * @param unit       member of unit
     * @param work       member of work
     * @param trackingId trackingId to include
     * @param superceds  which other ids do this record cover (only
     *                   bibliographicrecordid)
     */
    private void makeMetadata(ObjectNode record, String id, boolean deleted, String unit, String work, String trackingId, Set<String> superceds) {
        Matcher matcher = ID_PATTERN.matcher(id);
        if(!matcher.matches()) {
            throw new RuntimeException("invalid id: " + id);
        }

        String repositoryId = matcher.group(1);
        String bibliographicRecordId = matcher.group(2);
        String agencyId = matcher.group(3);
        String classifier = matcher.group(4);
        record.put("agencyId", Integer.parseInt(agencyId, 10));
        record.put("classifier", classifier);
        record.put("bibliographicRecordId", bibliographicRecordId);
        record.put("repositoryId", repositoryId);
        record.put("deleted", deleted);
        if (unit != null) {
            record.put("unit", unit);
        }
        if (work != null) {
            record.put("work", work);
        }
        record.put("producerVersion", javascriptWrapper.getVersion());
        record.put("trackingId", trackingId);
        if (commitWithin > 0) {
            record.put("commitWithin", commitWithin);
        }
        ArrayNode covers = record.putArray("superceds");
        for (String coverId : superceds) {
            covers.add(coverId);
        }
    }

    /**
     *
     * @param pid    Only used for logging
     * @param record the json to post
     * @throws JsonProcessingException Unrealistic (unable to print json to
     *                                 bytes?)
     * @throws IOException             in case of communication errors with the
     *                                 http endpoint
     */
    private void sendRecordToSolrDocStore(String pid, ObjectNode record) throws JsonProcessingException, IOException {
        try (Timer.Context timer = solrDocStoreTimer.time()) {
            HttpPost post = new HttpPost(solrDocStoreUrl);
            post.setEntity(new ByteArrayEntity(
                    printer.writeValueAsBytes(record),
                    ContentType.APPLICATION_JSON));

            log.info("posting pid: " + pid + " to solrDocStore");
            try (CloseableHttpResponse resp = client.execute(post)) {
                log.debug("resp = {}", resp);
                int code = resp.getStatusLine().getStatusCode();
                if (code != 200) {
                    log.error("solrDocStore responded: {}", resp.getStatusLine());
                    try (InputStream is = resp.getEntity().getContent()) {
                        String content = readInputStream(is);
                        log.error(content);
                    }
                    throw new RuntimeException("Error communicating with solrDocStore, got status: " + code);
                }
                Header contentType = resp.getFirstHeader("content-type");
                if (contentType == null) {
                    throw new RuntimeException("Response from solrDocStore had no content-type set");
                }
                String contentTypeValue = contentType.getValue().split(";")[0];
                if (contentTypeValue.equals("application/json")) {
                    JsonNode content;
                    try (InputStream is = resp.getEntity().getContent()) {
                        content = O.readTree(is);
                    }
                    JsonNode ok = content.get("ok");
                    if (ok == null) {
                        log.debug(O.writeValueAsString(content));
                        throw new RuntimeException("Response had no 'ok' field");
                    }
                    if (!ok.asBoolean(false)) {
                        log.debug(O.writeValueAsString(content));
                        throw new RuntimeException("Response had not ok response");
                    }
                } else {
                    try (InputStream is = resp.getEntity().getContent()) {
                        String content = readInputStream(is);
                        log.debug("content type error:");
                        log.debug(content);
                    }
                    throw new RuntimeException("Response from solrDocStore hadwrong content-type: " + contentTypeValue);
                }
            }
        }
    }

    /**
     * Creates CORepo Solr documents and pushes to JMS document queue. Only
     * IOExceptions should cause a message retry and a sleep penalty.
     *
     * @param message Pid
     */
    @Override
    public void onMessage(Message message) {
        try (Timer.Context time = onMessageTimer.time()) {

            MapMessage m = (MapMessage) message;
            long timeStamp = m.getJMSTimestamp();
            String pid = m.getString("pid");
            log.info("Processing pid: {}" , pid);
            DBCTrackedLogContext.setTrackingId("SolrWorker:" + pid);
            int deliveryAttempts = message.getIntProperty("JMSXDeliveryCount");

            log.info(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.STARTED).
                    and(append("JmsTimestamp", timeStamp).
                            and(append("deliveryAttempts", deliveryAttempts))),
                     "Started processing message");

            try {

                docBuilder.buildDocuments(pid, javascriptWrapper, this::deployRecords);
                failureHandler.reset();
            } catch (Exception ex) {

                // Looking for IOException in exception chain.
                // Have to do this since some exception wrapping is going on,
                // otherwise refactoring is needed for a cleaner solution.
                if (ExceptionUtils.indexOfType(ex, IOException.class) != -1) {
                    if (deliveryAttempts < REDELIVERY_LIMIT) {
                        throw ex;
                    }
                    sendToDeadPidQueue(pid, "Redelivery limit reached, " + LogAppender.getCauses(ex));
                    log.error("Sent to dead pid queue: {}", ex.getMessage());
                    log.debug("Sent to dead pid queue: ", ex);
                } else {
                    sendToDeadPidQueue(pid, LogAppender.getCauses(ex));
                    log.error("Sent to dead pid queue: {}", ex.getMessage());
                    log.debug("Sent to dead pid queue: ", ex);
                }
            }

        } catch (Exception ex) {
            log.error(LogAppender.getMarker(App.APP_NAME, LogAppender.FAILED), "Unable to process message {}", message, ex);
            log.debug("Error processing message: ", ex);
            failureHandler.failure();
            throw new EJBException(ex.getMessage());
        } finally {
            DBCTrackedLogContext.remove();
        }
    }

    void sendToDeadPidQueue(String pid, String message) throws JMSException {
        try {
            MapMessage failed = responseContext.createMapMessage();
            failed.setString("pid", pid);
            failed.setString("exception", message);
            responseContext.createProducer().send(responseContext.createQueue(deadPidQueue), failed);
            log.info(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.SUCCEDED), "Pid {} moved to dead pid queue. Caused by: {}", pid, message);
        } catch (JMSException ex) {
            log.error("Could not move pid {} to dead pid queue. Reason: {}", pid, ex.getMessage());
            throw ex;
        }
    }

    /**
     * Drain an inputstream (UTF-8) into a string
     *
     * @param is some data provider
     * @return String (UTF-8) content of stream
     * @throws IOException in case of reading errors
     */
    public static String readInputStream(final InputStream is) throws IOException {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            while (is.available() > 0) {
                int read = is.read(buffer);
                if (read > 0) {
                    bos.write(buffer, 0, read);
                }
            }
            String s = new String(bos.toByteArray(), StandardCharsets.UTF_8);
            return s;
        }
    }

}
