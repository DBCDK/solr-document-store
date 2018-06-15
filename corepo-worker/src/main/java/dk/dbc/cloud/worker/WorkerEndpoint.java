/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-corepo-worker
 *
 * dbc-solr-doc-store-corepo-worker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-corepo-worker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.cloud.worker;

import dk.dbc.solr.indexer.cloud.shared.DeleteMessage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.validation.constraints.NotNull;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Path("test")
@Stateless
public class WorkerEndpoint {

    private static final Logger log = LoggerFactory.getLogger(WorkerEndpoint.class);
    @EJB
    SolrIndexer docBuilder;

    @EJB
    SolrIndexerJS javascriptWrapper;

    @GET
    @Path("/{pid}")
    @Produces(MediaType.APPLICATION_XML)
    public DocsGroup process(@PathParam("pid") @NotNull String pid) {
        DocsGroup docs = new DocsGroup();
        docs.pid = pid;
        try {
            if (javascriptWrapper.isIndexableIdentifier(pid)) {
                docs.unit = docBuilder.unitFor(pid);
                docs.work = docBuilder.workFor(docs.unit);
                docBuilder.buildDocuments(pid, javascriptWrapper, docs::storeRecords);

            }
        } catch (Exception exception) {
            docs.errors = Arrays.asList(exception.getMessage());
            log.error("Exception: {}", exception.getMessage());
            log.debug("Exception: ", exception);
        }
        return docs;
    }

    @XmlRootElement(name = "response")
    public static class DocsGroup {

        public String pid;
        public String unit;
        public String work;

        @XmlElementWrapper(name = "delete", required = false)
        @XmlElement(name = "doc", required = false)
        public List<Doc> deletes;

        @XmlElementWrapper(name = "update", required = false)
        @XmlElement(name = "doc", required = false)
        public List<Doc> updates;

        @XmlElementWrapper(name = "errors", required = false)
        @XmlElement(name = "error", required = false)
        public List<String> errors;

        private void storeRecords(String foXml, SolrUpdaterCallback updater) {
            ArrayList<DeleteMessage> deletedDocuments = updater.getDeletedDocuments();

            if (!deletedDocuments.isEmpty()) {
                deletes = deletedDocuments.stream()
                        .map(m -> new Doc(m.getDocumentId(), m.getStreamDate()))
                        .collect(Collectors.toList());
            }
            ArrayList<Map<String, Set<String>>> updatedDocuments = updater.getUpdatedDocuments();
            if (!updatedDocuments.isEmpty()) {
                updates = updatedDocuments
                        .stream()
                        .map(d -> new Doc(d))
                        .collect(Collectors.toList());
            }
        }
    }

    @XmlRootElement
    public static class Doc {

        @XmlElement(required = false)
        public String id;

        @XmlElement(required = false)
        public String streamDate;

        @XmlElementWrapper(name = "fields", required = false)
        @XmlElement(name = "field", required = false)
        public List<Field> fields;

        public Doc() {
        }

        public Doc(String id, String streamDate) {
            this.id = id;
            this.streamDate = streamDate;
        }

        public Doc(Map<String, Set<String>> updatedDocument) {
            this.fields = updatedDocument.entrySet()
                    .stream()
                    .sorted(Map.Entry.comparingByKey())
                    .flatMap(this::toFields)
                    .collect(Collectors.toList());
        }

        private Stream<Field> toFields(Map.Entry<String, Set<String>> entry) {
            return entry.getValue().stream()
                    .sorted()
                    .map(v -> new Field(entry.getKey(), v));
        }

    }

    @XmlRootElement
    public static class Field {

        @XmlAttribute(name = "key")
        public String key;

        @XmlAttribute(name = "value")
        public String value;

        public Field() {
        }

        public Field(String key, String value) {
            this.key = key;
            this.value = value;
        }

    }
}
