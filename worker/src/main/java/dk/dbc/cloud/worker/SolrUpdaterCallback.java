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
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(identifier, "identifier", log);
        ExceptionUtil.checkForNullAndLogAndThrow(responseContext, "responseContext", log);
        ExceptionUtil.checkForNullAndLogAndThrow(responseQueue, "responseQueue", log);

        this.identifier = identifier;
        this.responseContext = responseContext;
        this.responseQueue = responseQueue;
    }


    public void addDocument(Object index) {
        ExceptionUtil.checkForNullAndLogAndThrow(index, "index", log);
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
            throw new IllegalArgumentException("Unknown document type added by javascript: " + index.getClass());
        }
    }

    void addToQueue(SolrInputDocument doc){
        responseContext.createProducer().send(responseQueue, doc);
        updatedDocumentsCount++;
    }

    public void deleteDocument(String docId) {
        log.debug("Deleting document for {}", docId);
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(docId, "docId", log);

        responseContext.createProducer().send(responseQueue, docId);
        deletedDocumentsCount++;
    }

    public int getUpdatedDocumentsCount() {
        return updatedDocumentsCount;
    }

    public int getDeletedDocumentsCount() {
        return deletedDocumentsCount;
    }

    private static SolrInputDocument extractIndexDocumentFromNativeArray(NativeArray index) throws IllegalStateException {
        long length = index.getLength();
        log.debug("Extracting index from data: {}, length {}", index, length);
        SolrInputDocument document = new SolrInputDocument();
        for (Object obj : index) {
            if (!(obj instanceof NativeObject)) {
                throw new IllegalArgumentException("Unknown result element type returned by javascript: " + obj.getClass());
            }
            NativeObject nat = (NativeObject) obj;
            String name, value;
            if (nat.has("name", null)) {
                Object nameObject = nat.get("name", null);
                name = (String) nameObject;
            } else {
                throw new IllegalArgumentException("'name' field missing from object "+obj);
            }
            if (nat.has("value", null)) {
                Object valueObject = nat.get("value", null);
                value = (String) valueObject;
            } else {
                throw new IllegalArgumentException("'name' field missing from object "+obj);
            }

            log.debug("name: '{}', value '{}'", name, value);
            document.addField(name, value);
        }
        return document;
    }

}
