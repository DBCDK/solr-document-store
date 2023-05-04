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
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.Invocation;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class Requests {

    private static final Logger log = LoggerFactory.getLogger(Requests.class);

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Client CLIENT = ClientBuilder.newClient();

    private static final Pattern HOLDING_PATTERN = Pattern.compile("^h-(\\d+-\\d+)");

    static void load(String testName, String solrDocStoreUrl) throws IOException {
        load(CLIENT, testName, UriBuilder.fromUri(solrDocStoreUrl));
    }

    static void load(Client client, String testName, UriBuilder solrDocStoreUrl) throws IOException {
        String uuid = UUID.randomUUID().toString();
        JsonNode rules;
        try (final InputStream is = Requests.class.getClassLoader().getResourceAsStream("ITRequests/load.json")) {
            rules = OBJECT_MAPPER.readTree(is);
        }
        JsonNode test = rules.get(testName);
        if (test == null) {
            throw new IllegalStateException("Don't know about test: " + testName);
        }
        System.out.println("evict-all: " + client.target(solrDocStoreUrl.clone().path("api/evict-all")).request().get().toString());
        for (Iterator<Map.Entry<String, JsonNode>> iterator = test.fields() ; iterator.hasNext() ;) {
            Map.Entry<String, JsonNode> entry = iterator.next();
            String api = entry.getKey();
            JsonNode array = entry.getValue();
            if (!array.isArray()) {
                throw new IllegalStateException("Value of " + api + " in test: " + testName + " is not an array");
            }
            for (JsonNode file : array) {
                String fileName = file.asText();
                log.debug("fileName = {}", fileName);
                switch (api) {
                    case "holdings":
                        loadHold(client, fileName, solrDocStoreUrl);
                        break;
                    case "bibliographic":
                        loadBibl(client, fileName, solrDocStoreUrl);
                        break;
                    default:
                        throw new AssertionError();
                }
            }
        }
        System.out.println("evict-all: " + client.target(solrDocStoreUrl.clone().path("api/evict-all")).request().get().toString());
    }

    private static void loadHold(Client client, String fileName, UriBuilder solrDocStoreUrl) throws IOException {
        Matcher matcher = HOLDING_PATTERN.matcher(fileName);
        if (!matcher.find())
            throw new IllegalArgumentException("Unknown file: " + fileName);
        String uuid = UUID.randomUUID().toString();
        UriBuilder targetUrl = solrDocStoreUrl.clone().path("api").path("holdings").path(matcher.group(1));
        try (final InputStream is = Requests.class.getClassLoader().getResourceAsStream("ITRequests/" + fileName)) {
            JsonNode content = OBJECT_MAPPER.readTree(is);
            Invocation.Builder request = client.target(targetUrl)
                    .request(MediaType.APPLICATION_JSON_TYPE);
            Invocation invocation;
            if (content.isEmpty()) {
                invocation = request.buildDelete();
            } else {
                invocation = request.buildPut(Entity.json(content.toString()));
            }
            Response resp = invocation.invoke();
            System.out.println("resp.getStatusInfo() = " + resp.getStatusInfo());
            if (resp.getStatus() != 200) {
                throw new IllegalArgumentException("Cannot post content of: ITRequests/" + fileName + " to: " + targetUrl + ": " + resp.getStatusInfo());
            }
        }
    }

    private static void loadBibl(Client client, String fileName, UriBuilder solrDocStoreUrl) throws IOException {
        String uuid = UUID.randomUUID().toString();
        UriBuilder targetUrl = solrDocStoreUrl.clone().path("api").path("bibliographic");
        try (final InputStream is = Requests.class.getClassLoader().getResourceAsStream("ITRequests/" + fileName)) {
            JsonNode content = OBJECT_MAPPER.readTree(is);
            if (content.isObject()) {
                ( (ObjectNode) content ).put("trackingId", uuid);
            }
            Response resp = client.target(targetUrl)
                    .request(MediaType.APPLICATION_JSON_TYPE)
                    .buildPost(Entity.json(content.toString()))
                    .invoke();
            System.out.println("resp.getStatusInfo() = " + resp.getStatusInfo());
            if (resp.getStatus() != 200) {
                throw new IllegalArgumentException("Cannot post content of: ITRequests/" + fileName + " to: " + targetUrl + ": " + resp.getStatusInfo());
            }
        }
    }
}
