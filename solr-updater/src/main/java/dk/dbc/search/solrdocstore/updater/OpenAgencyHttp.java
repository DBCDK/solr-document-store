package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;
import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class OpenAgencyHttp {

    private static final ObjectMapper O = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(OpenAgencyHttp.class);

    @Inject
    Config config;

    private Client client;

    private static final RetryPolicy RETRY_POLICY = new RetryPolicy()
            .withDelay(250, TimeUnit.MILLISECONDS)
            .retryOn(Exception.class)
            .withMaxRetries(4);

    public OpenAgencyHttp() {
    }

    @PostConstruct
    public void init() {
        this.client = ClientBuilder.newBuilder().build();
    }

    public ObjectNode fetchJson(URI uri) throws IOException {
        return Failsafe.with(RETRY_POLICY).get(() -> fetchJsonImpl(uri));
    }

    private ObjectNode fetchJsonImpl(URI uri) throws IOException {
        Response response = client.target(uri)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .buildGet()
                .invoke();
        if (response.getStatus() != 200) {
            throw new IOException("Got status:" + response.getStatusInfo() + " from uri: " + uri);
        }
        if (!response.getMediaType().equals(MediaType.APPLICATION_JSON_TYPE)) {
            throw new IOException("Got media type:" + response.getMediaType() + " from uri: " + uri);
        }
        String content = response.readEntity(String.class);
        log.trace("content = {}", content);
        JsonNode tree = O.readTree(content);
        if (!tree.isObject()) {
            throw new IOException("Got content from: " + uri + " but it's not a json object");
        }
        return (ObjectNode) tree;
    }
}
