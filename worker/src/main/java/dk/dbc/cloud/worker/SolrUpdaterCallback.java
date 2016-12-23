/*
This file is part of opensearch.
Copyright © 2013, Dansk Bibliotekscenter a/s,
Tempovej 7-11, DK-2750 Ballerup, Denmark. CVR: 15149043

opensearch is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

opensearch is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with opensearch.  If not, see <http://www.gnu.org/licenses/>.
*/

package dk.dbc.cloud.worker;

import dk.dbc.commons.exception.ExceptionUtil;
import dk.dbc.jslib.Environment;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.jms.Destination;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.JMSRuntimeException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import jdk.nashorn.api.scripting.JSObject;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 *
 */
public class SolrUpdaterCallback
{
    private final static XLogger log = XLoggerFactory.getXLogger(SolrUpdaterCallback.class);
    private static final String TRACKING_ID_FIELD = "rec.trackingId";
    static final String STREAM_DATE = "streamDate";
    static final String DOCUMENT_ID = "documentId";
    static final String TRACKING_ID = "trackingId";
    static final String PID = "pid";


    private int updatedDocumentsCount;
    private int deletedDocumentsCount;
    private final String identifier;
    private final Environment jsEnvironment;
    private final JMSContext responseContext;
    private final Destination responseQueue;
    private final String trackingId;

    SolrUpdaterCallback(String identifier, Environment jsEnvironment, JMSContext responseContext, Destination responseQueue, String trackingId) {
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(identifier, "identifier", log);
        ExceptionUtil.checkForNullAndLogAndThrow(responseContext, "responseContext", log);
        ExceptionUtil.checkForNullAndLogAndThrow(responseQueue, "responseQueue", log);

        this.identifier = identifier;
        this.jsEnvironment = jsEnvironment;
        this.responseContext = responseContext;
        this.responseQueue = responseQueue;
        this.trackingId = trackingId;
    }
    
    static String getShardedSolrId( String bibliographicRecordId, String solrId ){
        String shardKey = bibliographicRecordId.replaceAll("[^0-9a-zA-Z]", "");
        String shardedId = shardKey + "/32!" + solrId;
        return shardedId;
    }


    public void addDocument(Object index) {
        ExceptionUtil.checkForNullAndLogAndThrow(index, "index", log);
        SolrInputDocument solrDocument = extractIndexDocumentFromNativeArray((JSObject) index);
        if (trackingId != null && !solrDocument.isEmpty()) {
            solrDocument.addField(TRACKING_ID_FIELD, trackingId);
        }
        if (log.isTraceEnabled()) {
            log.trace("Sending {} document to queue: {}", identifier,  solrDocument);
        }
        else {
            log.info("Sending {} document to queue", identifier);
        }
        
        String bibliographicRecordId = solrDocument.getField( "rec.bibliographicRecordId" ).getValue().toString();
        String solrId = solrDocument.getField( "id" ).getValue().toString();
        String shardedId = getShardedSolrId( bibliographicRecordId, solrId );
        solrDocument.setField( "id", shardedId );
        
        addToQueue(solrDocument);
    }

    void addToQueue(SolrInputDocument doc){
        ObjectMessage message = responseContext.createObjectMessage( doc );
        sendRetryForever( message );
        updatedDocumentsCount++;
    }

    public void deleteDocument(String docId, String streamDate, String bibliographicRecordId) throws JMSException  {
        log.debug("Deleting document for {}", docId);
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(docId, "docId", log);
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(streamDate, "streamDate", log);
        MapMessage message = responseContext.createMapMessage();
        String shardedId = getShardedSolrId( bibliographicRecordId, docId );
        message.setString(DOCUMENT_ID, shardedId);
        message.setString(STREAM_DATE, streamDate);
        message.setString(TRACKING_ID, trackingId);
        message.setString(PID, identifier);

        sendRetryForever( message );
        deletedDocumentsCount++;
    }
    
    private void sendRetryForever( Message m ) {
        while( true ) {
            try {
                responseContext.createProducer().send(responseQueue, m);
                break;
            } catch ( JMSRuntimeException e ) {
                log.warn( "Push to queue failed, {}. Retry in 5s.", e.getMessage() );
                try {
                    Thread.sleep( 5000 );
                } catch (InterruptedException ex) {
                    log.warn( "Interrupted while sleeping for retry", ex );
                }
            }
        }
    }
    public int getUpdatedDocumentsCount() {
        return updatedDocumentsCount;
    }

    public int getDeletedDocumentsCount() {
        return deletedDocumentsCount;
    }

    private SolrInputDocument extractIndexDocumentFromNativeArray(JSObject index) throws IllegalStateException {
        Object[] resultArray = jsEnvironment.getJavascriptObjectAsArray( index );
        long length = resultArray.length;
        log.debug("Result of running JS: {}, length {}", index, length);

        // Create a map of field names to values and eliminate any duplicate values in each field name
        Map <String, Set<String>> docMap = new HashMap<>();

        for (Object obj : resultArray) {
            if (!(obj instanceof JSObject)) {
                throw new IllegalStateException("Unknown result element type returned by javascript: " + obj.getClass());
            }
            String name = jsEnvironment.getJavascriptObjectFieldAsString( obj, "name" );
            String value = jsEnvironment.getJavascriptObjectFieldAsString( obj, "value" );
            ExceptionUtil.checkForNullOrEmptyAndLogAndThrow( name, "index field name", log );

            Set<String> values = docMap.get(name);
            if (values == null) {
                values = new HashSet<>();
                docMap.put(name, values);
            }
            if (values.add(value)) {
                log.debug("Adding name: '{}', value '{}'", name, value);
            } else {
                log.trace("Skipping duplicate name: '{}', value '{}'", name, value);
            }
        }
        SolrInputDocument document = new SolrInputDocument();
        for (Map.Entry<String, Set<String>> entrySet : docMap.entrySet()) {
            String key = entrySet.getKey();
            Set<String> value = entrySet.getValue();
            if (value.size() == 1) {
                document.addField(key, value.iterator().next());
            } else {
                document.addField(key, value);
            }
        }
        return document;
    }

}
