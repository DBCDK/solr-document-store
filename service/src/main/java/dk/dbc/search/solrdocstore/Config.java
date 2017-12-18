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
import java.net.URL;
import java.util.Properties;


@Stateless
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private String oaURL;

    @PostConstruct
    public void loadProperties() {
        Properties props = findProperties("solr-doc-store-service");
        oaURL = props.getProperty("openAgencyUrl", System.getenv("OPEN_AGENCY_URL"));
        if (oaURL==null){
            throw new EJBException("No URL found for Open Agency. Please provide env:OPEN_AGENCY_URL or property:openAgencyURL");
        }
    }

    public String getOaURL() {
        return oaURL;
    }

    private Properties findProperties(String resourceName) {
        try {
            InputStream resource = this.getClass().getClassLoader().getResourceAsStream(resourceName + ".properties");
            if (resource!=null){
                Properties fromFile = new Properties();
                try {
                    fromFile.load(resource);
                    return fromFile;
                } catch (IOException e){
                    throw new EJBException("Property file" + resourceName + ".properties exists. But I can't load it?",e);
                }
            }
            Object lookup = InitialContext.doLookup(resourceName);
            if (lookup instanceof Properties) {
                return (Properties) lookup;
            } else {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + lookup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.error("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }

}

