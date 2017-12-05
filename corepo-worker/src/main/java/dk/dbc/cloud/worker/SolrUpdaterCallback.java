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
import dk.dbc.solr.indexer.cloud.shared.DeleteMessage;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import jdk.nashorn.api.scripting.JSObject;
import org.slf4j.ext.XLogger;
import org.slf4j.ext.XLoggerFactory;

/**
 *
 */
public class SolrUpdaterCallback {

    private final static XLogger log = XLoggerFactory.getXLogger(SolrUpdaterCallback.class);
    private static final String TRACKING_ID_FIELD = "rec.trackingId";

    private final Environment jsEnvironment;
    private final String trackingId;
    private final String pid;

    private final ArrayList<Map<String, Set<String>>> updatedDocuments = new ArrayList<>();
    private final ArrayList<DeleteMessage> deletedDocuments = new ArrayList<>();

    SolrUpdaterCallback(Environment jsEnvironment, String trackingId, String pid) {
        this.jsEnvironment = jsEnvironment;
        this.trackingId = trackingId;
        this.pid = pid;
    }

    public void addDocument(Object index) {
        ExceptionUtil.checkForNullAndLogAndThrow(index, "index", log);
        Map<String, Set<String>> doc = extractIndexFieldsFromNativeArray((JSObject) index);
        if (trackingId != null) {
            doc.computeIfAbsent(TRACKING_ID_FIELD, n -> new HashSet<>())
                    .add(trackingId);
        }
        updatedDocuments.add(doc);
    }

    public void deleteDocument(String docId, String streamDate, String bibliographicRecordId) {
        log.debug("Deleting document for {}", docId);
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(docId, "docId", log);
        ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(streamDate, "streamDate", log);
        deletedDocuments.add(new DeleteMessage(docId, streamDate));
    }

    public ArrayList<Map<String, Set<String>>> getUpdatedDocuments() {
        return updatedDocuments;
    }

    public int getUpdatedDocumentsCount() {
        return updatedDocuments.size();
    }

    public int getDeletedDocumentsCount() {
        return deletedDocuments.size();
    }

    public ArrayList<DeleteMessage> getDeletedDocuments() {
        return deletedDocuments;
    }

    public String getPid() {
        return pid;
    }

    public String getTrackingId() {
        return trackingId;
    }

    private Map<String, Set<String>> extractIndexFieldsFromNativeArray(JSObject index) throws IllegalStateException {
        Object[] resultArray = jsEnvironment.getJavascriptObjectAsArray(index);
        long length = resultArray.length;
        log.debug("Result of running JS: {}, length {}", index, length);

        // Create a map of field names to values and eliminate any duplicate values in each field name
        Map<String, Set<String>> docMap = new HashMap<String, Set<String>>() {
            @Override
            public Set<String> get(Object key) {
                return computeIfAbsent((String) key, k -> new HashSet<>());
            }
        };

        for (Object obj : resultArray) {
            if (!( obj instanceof JSObject )) {
                throw new IllegalStateException("Unknown result element type returned by javascript: " + obj.getClass());
            }
            String name = jsEnvironment.getJavascriptObjectFieldAsString(obj, "name");
            String value = jsEnvironment.getJavascriptObjectFieldAsString(obj, "value");
            ExceptionUtil.checkForNullOrEmptyAndLogAndThrow(name, "index field name", log);
            ExceptionUtil.checkForNullAndLogAndThrow(value, "index field value", log);

            Set<String> values = docMap.computeIfAbsent(name, n -> new HashSet<>());
            if (values.add(value)) {
                log.debug("Adding name: '{}', value '{}'", name, value);
            } else {
                log.trace("Skipping duplicate name: '{}', value '{}'", name, value);
            }
        }
        return docMap;
    }

}
