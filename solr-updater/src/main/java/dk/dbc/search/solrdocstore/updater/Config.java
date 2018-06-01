package dk.dbc.search.solrdocstore.updater;

import java.util.Properties;
import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    public static final String DATABASE = "jdbc/solr-doc-store";

    final Properties props;
    private String solrUrl;
    private String solrDocStoreUrl;

    private String queues;
    private String databaseConnectThrottle;
    private String failureThrottle;
    private long emptyQueueSleep;
    private int rescanEvery;
    private int idleRescanEvery;
    private int maxTries;
    private long maxQueryTime;
    private int threads;

    public Config() {
        props = findProperties("solr-doc-store-updater");
    }

    public Config(String... configs) {
        this.props = new Properties();
        for (String config : configs) {
            String[] kv = config.split("=", 2);
            props.setProperty(kv[0], kv[1]);
        }
        init();
    }

    @PostConstruct
    public final void init() {
        solrUrl = get("solrUrl", "SOLR_URL", null);
        solrDocStoreUrl = get("solrDocStoreUrl", "SOLR_DOC_STORE_URL", null);
        queues = get("queues", "QUEUES", null);
        databaseConnectThrottle = get("databaseConnectThrottle", "DATABASE_CONNECT_THROTTLE", "1/s,5/m");
        failureThrottle = get("failureThrottle", "FAILURE_THROTTLE", "2/100ms,5/500ms,10/s,20/m");
        emptyQueueSleep = Long.max(100L, Long.parseLong(get("emptyQueueSleep", "EMPTY_QUEUE_SLEEP", "10000"), 10));
        rescanEvery = Integer.max(1, Integer.parseUnsignedInt(get("rescanEvery", "RESCAN_EVERY", "100"), 10));
        idleRescanEvery = Integer.max(1, Integer.parseUnsignedInt(get("idleRescanEvery", "IDLE_RESCAN_EVERY", "5"), 10));
        maxQueryTime = Long.max(100L, Long.parseLong(get("maxQueryTime", "MAX_QUERY_TIME", "100"), 10));
        threads = Integer.max(1, Integer.parseUnsignedInt(get("threads", "THREADS", "1"), 10));
        maxTries = Integer.max(1, Integer.parseUnsignedInt(get("maxTries", "THREADS", "3"), 10));
    }

    public String getSolrUrl() {
        return solrUrl;
    }

    public String getSolrDocStoreUrl() {
        return solrDocStoreUrl;
    }

    public String[] getQueues() {
        return queues.split(",");
    }

    public String getDatabaseConnectThrottle() {
        return databaseConnectThrottle;
    }

    public String getFailureThrottle() {
        return failureThrottle;
    }

    public long getEmptyQueueSleep() {
        return emptyQueueSleep;
    }

    public int getRescanEvery() {
        return rescanEvery;
    }

    public int getIdleRescanEvery() {
        return idleRescanEvery;
    }

    public int getMaxTries() {
        return maxTries;
    }

    public long getMaxQueryTime() {
        return maxQueryTime;
    }

    public int getThreads() {
        return threads;
    }

    private Properties findProperties(String resourceName) {
        try {
            Object loopup = InitialContext.doLookup(resourceName);
            if (loopup instanceof Properties) {
                return (Properties) loopup;
            } else {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + loopup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.info("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }

    private String get(String propertyName, String envName, String defaultValue) {
        String value = firstOf(props.getProperty(propertyName),
                               System.getenv(envName),
                               defaultValue);
        if (value == null) {
            throw new IllegalArgumentException("Neither prop:" + propertyName + " nor env:" + envName + " is set");
        }
        return value;
    }

    private String firstOf(String... strings) {
        for (String string : strings) {
            if (string != null) {
                return string;
            }
        }
        return null;
    }
}
