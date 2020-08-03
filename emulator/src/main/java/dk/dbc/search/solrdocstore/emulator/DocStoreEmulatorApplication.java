package dk.dbc.search.solrdocstore.emulator;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashMap;
import java.util.Map;


/**
 * This class defines the other classes that make up this JAX-RS application by
 * having the getClasses method return a specific set of resources.
 */
@ApplicationPath("/api")
public class DocStoreEmulatorApplication extends Application {

    @Override
    public Map<String, Object> getProperties() {
        final Map<String, Object> res = new HashMap<>();
        res.put("jersey.config.server.disableMoxyJson", true);

        return res;

    }

}
