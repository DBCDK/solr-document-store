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

package dk.dbc.cloud.indexer;

import javax.jms.Destination;
import javax.jms.JMSContext;
import org.apache.solr.common.SolrInputDocument;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 *
 */
public class SolrUpdaterCallback
{
    private final static XLogger log = XLoggerFactory.getXLogger(SolrUpdaterCallback.class);

    private int updatedDocumentsCount;
    private int deletedDocumentsCount;
    private final String identifier;
    private final JMSContext responseContext;
    private final Destination responseQueue;

    SolrUpdaterCallback(String identifier, JMSContext responseContext, Destination responseQueue) {
        this.identifier = identifier;
        this.responseContext = responseContext;
        this.responseQueue = responseQueue;
    }


    public void addDocument(Object index) {
        if (index instanceof NativeArray) {
            SolrInputDocument solrDocument = extractIndexDocumentFromNativeArray((NativeArray) index);
            if (log.isTraceEnabled()) {
                log.trace("Sending {} document to solr: {}", identifier,  solrDocument);
            }
            else {
                log.debug("Sending {} document to solr", identifier);
            }
            addToQueue(solrDocument);
        }
        else {
            throw new IllegalStateException("Unknown document type added by javascript: " + index.getClass());
        }
    }
    public void addToQueue(SolrInputDocument doc){
        responseContext.createProducer().send(responseQueue, doc);
        updatedDocumentsCount++;
    }

    public void deleteDocument(String docId) {
        log.debug("Deleting document for {}", docId);
        responseContext.createProducer().send(responseQueue, docId);
        deletedDocumentsCount++;
    }

    public int getUpdatedDocumentsCount() {
        return updatedDocumentsCount;
    }

    public int getDeletedDocumentsCount() {
        return deletedDocumentsCount;
    }

    private static SolrInputDocument extractIndexDocumentFromNativeArray(NativeArray result) throws IllegalStateException {
        long length = result.getLength();
        log.debug("Result of running JS: {}, length {}", result, length);
        SolrInputDocument document = new SolrInputDocument();
        for (Object obj : result) {
            if (!(obj instanceof NativeObject)) {
                throw new IllegalStateException("Unknown result element type returned by javascript: " + obj.getClass());
            }
            NativeObject nat = (NativeObject) obj;
            String name = (String) nat.get("name", null);
            String value = (String) nat.get("value", null);
            log.debug("name: '{}', value '{}'", name, value);
            document.addField(name, value);
        }
        return document;
    }

}
