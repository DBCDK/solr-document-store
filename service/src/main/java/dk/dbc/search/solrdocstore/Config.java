package dk.dbc.search.solrdocstore;

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
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.function.Function;
import java.util.stream.Collectors;

@Stateless
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private String oaURL;

    @PostConstruct
    public void loadProperties() {
        Properties props = findProperties("solr-doc-store-service");
        oaURL = getValue(props, "openAgencyUrl", "OPEN_AGENCY_URL", null, "No URL found for Open Agency");
    }

    public String getOaURL() {
        return oaURL;
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
                                   "Please provide env:" + envName +
                                   " or property:" + propertyName);
        }
        return value;
    }

    private static <T> T getValue(Properties props, String propertyName, String envName, String defaultValue, String error, Function<String, T> mapper) {
        return mapper.apply(getValue(props, propertyName, envName, defaultValue, error));
    }

    private static List<String> asStringList(String str) {
        return Arrays.stream(str.split("[\\s,]+"))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
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
                    throw new EJBException("Property file" + resourceName + ".properties exists. But I can't load it?", e);
                }
            }
            Object lookup = InitialContext.doLookup(resourceName);
            if (lookup instanceof Properties) {
                return (Properties)lookup;
            } else {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + lookup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.error("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }
}
