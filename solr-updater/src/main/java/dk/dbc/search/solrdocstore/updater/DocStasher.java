/*
 * Copyright (C) 2019 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.Instant;
import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import org.apache.solr.common.SolrInputDocument;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
public class DocStasher {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(DocStasher.class);

    private static final ObjectMapper O = new ObjectMapper();

    private Path path;

    @Inject
    Config config;

    @PostConstruct
    public void init() {
        String pathBase = config.getJsonStash();
        if (pathBase.isEmpty()) {
            path = null;
        } else {
            path = new File(pathBase).toPath();
            log.info("Using base: {} for storing json files");
        }
    }

    public void store(String pid, SolrInputDocument doc) {
        if (path == null)
            return;
        try {
            File file = path.resolve(pid + "_" + Instant.now().toString()).toFile();
            ObjectNode obj = O.createObjectNode();
            docIntoObject(doc, obj);
            log.info("Writing to file: {}", file);
            O.writeValue(file, obj);
        } catch (IOException ex) {
            log.error("Error writeing JSON doc: {}", ex.getMessage());
            log.debug("Error writeing JSON doc: ", ex);
        }
    }

    private void docIntoObject(SolrInputDocument doc, ObjectNode obj) {
        doc.getFieldNames().forEach(field -> {
            ArrayNode values = obj.putArray(field);
            doc.getFieldValues(field).stream()
                    .map(String::valueOf)
                    .forEach(values::add);
        });
        if (doc.hasChildDocuments()) {
            ArrayNode children = obj.putArray("_childDocuments_");
            doc.getChildDocuments().forEach(d -> docIntoObject(d, children.addObject()));
        }
    }

}
