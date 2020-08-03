package dk.dbc.search.solrdocstore.emulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.EJBException;
import javax.ejb.Startup;
import javax.ejb.Stateless;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.function.Function;

@Stateless
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private String solrDocStoreUrl;

    @PostConstruct
    public void loadProperties() {
        Properties props = findProperties("solr-doc-store-emulator-service");
        solrDocStoreUrl = getValue(props, "solrDocStoreUrl", "SOLR_DOC_STORE_URL", null, "No solrDocStore url specified");
    }

    public String getSolrDocStoreUrl() {
        return solrDocStoreUrl;
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

    private static <T> T getValue(Properties props, String propertyName, String envName, String defaultValue, String error, Function<String, T> mapper) {
        return mapper.apply(getValue(props, propertyName, envName, defaultValue, error));
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
