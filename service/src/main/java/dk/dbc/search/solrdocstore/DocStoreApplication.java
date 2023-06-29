package dk.dbc.search.solrdocstore;

import java.util.HashMap;
import java.util.Map;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.Set;
import org.glassfish.jersey.jackson.JacksonFeature;

/**
 * This class defines the other classes that make up this JAX-RS application by
 * having the getClasses method return a specific set of resources.
 */
@ApplicationPath("/api")
public class DocStoreApplication extends Application {

    private static final Set<Class<?>> BEANS = Set.of(
            BibliographicBean.class,
            BibliographicRecordAPIBean.class,
            DocumentRetrieveBean.class,
            EvictAll.class,
            ExistenceBean.class,
            HoldingsItemBean.class,
            OpenAgencyStatusBean.class,
            QueueBean.class,
            ResourceBean.class,
            StatusBean.class,
            // Tools
            JacksonFeature.class,
            JacksonObjectMapperProvider.class);

    @Override
    public Set<Class<?>> getClasses() {
        return super.getClasses();
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> props = new HashMap<>();

        props.put("jersey.config.server.disableMoxyJson", true);

        return props;
    }
}
