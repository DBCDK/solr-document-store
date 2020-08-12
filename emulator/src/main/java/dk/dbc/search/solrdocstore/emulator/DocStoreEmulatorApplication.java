package dk.dbc.search.solrdocstore.emulator;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * This class defines the other classes that make up this JAX-RS application by
 * having the getClasses method return a specific set of resources.
 */
@ApplicationPath("api")
public class DocStoreEmulatorApplication extends Application {

    private final static Set<Class<?>> CLASSES = new HashSet<>(Arrays.asList(BibliographicResource.class, Config.class));

    @Override
    public Set<Class<?>> getClasses() {
        return CLASSES;
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("jersey.config.server.disableMoxyJson", true);
        return props;
    }

}
