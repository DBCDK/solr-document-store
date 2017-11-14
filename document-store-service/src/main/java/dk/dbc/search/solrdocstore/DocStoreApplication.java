package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

    /**
     * This class defines the other classes that make up this JAX-RS application
     * by having the getClasses method return a specific set of resources.
     */
@ApplicationPath("")
public class DocStoreApplication extends Application {
        private static final Logger log = LoggerFactory.getLogger(DocStoreApplication.class);

        static final Set<Class<?>> classes = new HashSet<>();
        static {
            classes.add(StatusBean.class);
            classes.add(BibliographicBean.class);
            classes.add(HoldingsItemBean.class);

            for (Class<?> clazz : classes) {
                log.info("Registered {} resource", clazz.getName());
            }
        }

        @Override
        public Set<Class<?>> getClasses() {
                return classes;
        }
    }

