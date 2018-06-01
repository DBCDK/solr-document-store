package dk.dbc.search.solrdocstore.updater;

import dk.dbc.search.solrdocstore.updater.rest.DocTest;
import dk.dbc.search.solrdocstore.updater.rest.Status;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@ApplicationPath("api")
public class RestConfig extends Application {

    private static final Set<Class<?>> CLASSES = new HashSet<>(
            Arrays.asList(DocProducer.class,
                          DocTest.class,
                          Status.class));

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
