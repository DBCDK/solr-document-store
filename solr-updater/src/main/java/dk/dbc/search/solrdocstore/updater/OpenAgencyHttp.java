package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicReference;
import javax.ejb.EJB;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.dbc.openagency.http.VipCoreHttpClient;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
@Startup
public class OpenAgencyHttp {

    private static final ObjectMapper O = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(OpenAgencyHttp.class);

    @Inject
    Config config;

    @EJB
    private VipCoreHttpClient vipCoreHttpClient;

    private static final RetryPolicy RETRY_POLICY = new RetryPolicy<>()
            .handle(Exception.class)
            .handleResult(null)
            .withDelay(Duration.ofMillis(250))
            .withMaxRetries(4);

    public OpenAgencyHttp() {
    }


    public ObjectNode fetchJson(URI uri) throws IOException {
        AtomicReference<ObjectNode> res = new AtomicReference<>();
        Failsafe.with(RETRY_POLICY).run(() -> res.set(fetchJsonImpl(uri)));
        return res.get();
    }

    private ObjectNode fetchJsonImpl(URI uri) throws IOException {
        Response response = config.getClient().target(uri)
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
