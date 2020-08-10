package dk.dbc.search.solrdocstore.emulator;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

/**
 * This class defines the other classes that make up this JAX-RS application by
 * having the getClasses method return a specific set of resources.
 */
@ApplicationPath("/api")
public class DocStoreEmulatorApplication extends Application {
}
