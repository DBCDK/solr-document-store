/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class Requests {

    private static final Logger log = LoggerFactory.getLogger(Requests.class);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Client client = ClientBuilder.newClient();

    static void load(String solrDocStoreUrl, String testName) throws IOException {
        String uuid = UUID.randomUUID().toString();
        JsonNode rules;
        try (final InputStream is = Requests.class.getClassLoader().getResourceAsStream("ITRequests/load.json")) {
            rules = OBJECT_MAPPER.readTree(is);
        }
        JsonNode test = rules.get(testName);
        if (test == null) {
            throw new IllegalStateException("Don't know about test: " + testName);
        }
        for (Iterator<Map.Entry<String, JsonNode>> iterator = test.fields() ; iterator.hasNext() ;) {
            Map.Entry<String, JsonNode> entry = iterator.next();
            String api = entry.getKey();
            JsonNode array = entry.getValue();
            if (!array.isArray()) {
                throw new IllegalStateException("Value of " + api + " in test: " + testName + " is not an array");
            }
            WebTarget target = client.target(solrDocStoreUrl + "/api/" + api);
            for (JsonNode file : array) {
                String fileName = file.asText();
                log.debug("fileName = {}", fileName);
                try (final InputStream is = Requests.class.getClassLoader().getResourceAsStream("ITRequests/" + fileName)) {
                    JsonNode content = OBJECT_MAPPER.readTree(is);
                    if (content.isObject()) {
                        ( (ObjectNode) content ).put("trackingId", uuid);
                    }
                    Response resp = target.request(MediaType.APPLICATION_JSON_TYPE).buildPost(Entity.entity(content.toString(), MediaType.APPLICATION_JSON)).invoke();
                    System.out.println("resp.getStatusInfo() = " + resp.getStatusInfo());
                    if (resp.getStatus() != 200) {
                        throw new IllegalArgumentException("Cannot post: ITRequests/" + fileName + ": " + resp.getStatusInfo());
                    }
                }
            }
        }
    }

}
