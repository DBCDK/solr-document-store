package dk.dbc.search.solrdocstore.emulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJBException;
import jakarta.ejb.Startup;
import jakarta.ejb.Stateless;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import jakarta.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Stateless
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private UriBuilder solrDocStoreUriBuilder;

    @PostConstruct
    public void loadProperties() {
        Properties props = findProperties("solr-doc-store-emulator-service");
        String solrDocStoreUrl = getValue(props, "solrDocStoreUrl", "SOLR_DOC_STORE_URL", null, "No solrDocStore url specified");
        try {
            solrDocStoreUriBuilder = UriBuilder.fromPath(solrDocStoreUrl);
        } catch (IllegalArgumentException e) {
            log.error("Error when resolving URL for SolrDocStore ({})", solrDocStoreUrl);
            log.error("Error was: ", e);
            throw new EJBException("Error in configuration:" + e.getMessage());
        }
    }

    public UriBuilder getSolrDocStoreUriBuilder() {
        return solrDocStoreUriBuilder.clone();
    }

    private static String getValue(Properties props, String propertyName, String envName, String defaultValue, String error) {
        String value = props.getProperty(propertyName);
        if (value == null) {
            value = System.getenv(envName);
        }
        if (value == null) {
            value = defaultValue;
        }
        if (value == null) {
            throw new EJBException(error + ". " +
                    "Please provide env:" + envName + " or property:" + propertyName);
        }
        return value;
    }

    private Properties findProperties(String resourceName) {
        try {
            InputStream resource = this.getClass().getClassLoader().getResourceAsStream(resourceName + ".properties");
            if (resource != null) {
                Properties fromFile = new Properties();
                try {
                    fromFile.load(resource);
                    return fromFile;
                } catch (IOException e) {
                    throw new EJBException("Property file" + resourceName + ".properties exists. But an IOException occurred when loading it.", e);
                }
            }
            Object lookup = InitialContext.doLookup(resourceName);
            if (lookup instanceof Properties) {
                return (Properties) lookup;
            } else if(lookup != null) {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + lookup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.debug("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }

}
