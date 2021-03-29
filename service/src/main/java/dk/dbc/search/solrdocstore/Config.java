package dk.dbc.search.solrdocstore;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
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

    private long jobPruneMinutes;
    private String systemName;
    private int[] openAgencyValidateTime;
    private String vipCoreEndpoint;

    @PostConstruct
    public void loadProperties() {
        Properties props = findProperties("solr-doc-store-service");
        jobPruneMinutes = getValue(props, "jobPruneMinutes", "JOB_PRUNE_MINUTES", "60", null, Long::parseUnsignedLong);
        // Name displayed in frontend to tell the user which system they are looking at (FBSTest, Cisterne etc.)
        systemName = getValue(props, "systemName", "SYSTEM_NAME", "System navn ikke konfigureret", null);
        openAgencyValidateTime = getValue(props, "openAgencyValidateTime", "OPEN_AGENCY_VALIDATE_TIME", "04:23:17", null, Config::validateTime);
        // Number of milliseconds to delay bib entities that are being deleted
        vipCoreEndpoint = getValue(props, "vipCoreEndpoint", "VIPCORE_ENDPOINT", "http://vipcore.iscrum-vip-staging.svc.cloud.dbc.dk", "No URL found for VipCore");
    }

    public String getVipCoreEndpoint() {
        return vipCoreEndpoint;
    }

    public long getJobPruneMinutes() {
        return jobPruneMinutes;
    }

    public String getSystemName() {
        return systemName;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public int[] getOpenAgencyValidateTime() {
        return openAgencyValidateTime;
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
                return (Properties) lookup;
            } else if(lookup != null) {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + lookup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.debug("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }

    private static int[] validateTime(String time) {
        String[] parts = time.split(":");
        try {
            if (parts.length == 3) {
                int[] ret = new int[3];

                for (int i = 0 ; i < 3 ; i++) {
                    if (parts[i].isEmpty()) {
                        throw new IllegalArgumentException("Empty part");
                    }
                    ret[i] = Integer.parseUnsignedInt(parts[i], 10);
                }
                return ret;
            }
        } catch (RuntimeException ex) {
            log.error("Error processing time: {}", ex.getMessage());
            log.debug("Error processing time: ", ex);
        }
        throw new IllegalArgumentException("Invalid time: " + time);
    }
}
