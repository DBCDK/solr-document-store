package dk.dbc.search.solrdocstore.updater;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.UriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@ApplicationScoped
@Singleton
@Lock(LockType.READ)
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    public static final String DATABASE = "jdbc/solr-doc-store";

    final Properties props;
    private String solrUrl;
    private String solrDocStoreUrl;

    private String[] queues;
    private String databaseConnectThrottle;
    private String failureThrottle;
    private long emptyQueueSleep;
    private long queueWindow;
    private int rescanEvery;
    private int idleRescanEvery;
    private int maxTries;
    private long maxQueryTime;
    private int threads;
    private String openAgencyUrl;
    private long openAgencyTimeout;
    private long openAgencyAge;
    private long openAgencyFailureAge;
    private UriBuilder profileService;
    private Map<String, Set<String>> scanProfiles;
    private Set<String> scanDefaultFields;
    private Client client;

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
        if (isWorker()) {
            queues = toCollection(get("queues", "QUEUES", null)).toArray(String[]::new);
            databaseConnectThrottle = get("databaseConnectThrottle", "DATABASE_CONNECT_THROTTLE", "1/s,5/m");
            failureThrottle = get("failureThrottle", "FAILURE_THROTTLE", "2/100ms,5/500ms,10/s,20/m");
            emptyQueueSleep = Long.max(100L, milliseconds(get("emptyQueueSleep", "EMPTY_QUEUE_SLEEP", "10s")));
            queueWindow = Long.max(0, milliseconds(get("queueWindow", "QUEUE_WINDOW", "1s")));
            rescanEvery = Integer.max(1, Integer.parseUnsignedInt(get("rescanEvery", "RESCAN_EVERY", "100"), 10));
            idleRescanEvery = Integer.max(1, Integer.parseUnsignedInt(get("idleRescanEvery", "IDLE_RESCAN_EVERY", "5"), 10));
            maxQueryTime = Long.max(100L, milliseconds(get("maxQueryTime", "MAX_QUERY_TIME", "100ms")));
            threads = Integer.max(1, Integer.parseUnsignedInt(get("threads", "THREADS", "1"), 10));
            maxTries = Integer.max(1, Integer.parseUnsignedInt(get("maxTries", "THREADS", "3"), 10));
        }
        openAgencyUrl = get("openAgencyUrl", "OPEN_AGENCY_URL", null);
        openAgencyTimeout = Long.max(1000, milliseconds(get("openAgencyTimeout", "OPEN_AGENCY_TIMEOUT", "1s")));
        openAgencyAge = Long.max(1000, milliseconds(get("openAgencyAge", "OPEN_AGENCY_AGE", "4h")));
        openAgencyFailureAge = Long.max(1000, milliseconds(get("openAgencyFailureAge", "OPEN_AGENCY_FAILURE_AGE", "5m")));
        profileService = UriBuilder.fromUri(get("profileServiceUrl", "PROFILE_SERVICE_URL", null))
                .path("api").path("profile").path("{agencyId}").path("{profile}");
        scanProfiles = Arrays.stream(get("scanProfiles", "SCAN_PROFILES", null).split("\\s*,\\s*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.split("-", 2))
                .collect(Collectors.groupingBy(a -> a[0],
                                               Collectors.mapping(a -> a[1],
                                                                  Collectors.toSet())));
        scanDefaultFields = toCollection(get("scanDefaultFields", "SCAN_DEFAULT_FIELDS", null),
                                         Collectors.toSet(),
                                         Collections::unmodifiableSet);
        String userAgent = get("userAgent", "USER_AGENT", "Unknown/0.0");
        log.debug("Using: {} as HttpUserAgent", userAgent);
        client = ClientBuilder.newBuilder()
                .register((ClientRequestFilter) (ClientRequestContext context) -> {
                    context.getHeaders().putSingle("User-Agent", userAgent);
                }).build();

    }

    public boolean isWorker() {
        return !( "FORMAT_ONLY".equals(solrUrl) );
    }

    public String getSolrUrl() {
        return solrUrl;
    }

    public String getSolrDocStoreUrl() {
        return solrDocStoreUrl;
    }

    public String[] getQueues() {
        return queues;
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

    public long getQueueWindow() {
        return queueWindow;
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

    public String getOpenAgencyUrl() {
        return openAgencyUrl;
    }

    public long getOpenAgencyAge() {
        return openAgencyAge;
    }

    public long getOpenAgencyFailureAge() {
        return openAgencyFailureAge;
    }

    public long getOpenAgencyTimeout() {
        return openAgencyTimeout;
    }

    public UriBuilder getProfileServiceUrl() {
        return profileService.clone();
    }

    public Map<String, Set<String>> getScanProfiles() {
        return scanProfiles;
    }

    public Set<String> getScanDefaultFields() {
        return scanDefaultFields;
    }

    public Client getClient() {
        return client;
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

    /**
     * Convert a string representation of a duration (number{h|m|s|ms}) to
     * milliseconds
     *
     * @param spec string representation
     * @return number of milliseconds
     */
    static long milliseconds(String spec) {
        String[] split = spec.split("(?<=\\d)(?=\\D)");
        if (split.length == 2) {
            long units = Long.parseUnsignedLong(split[0], 10);
            switch (split[1].toLowerCase(Locale.ROOT)) {
                case "ms":
                    return TimeUnit.MILLISECONDS.toMillis(units);
                case "s":
                    return TimeUnit.SECONDS.toMillis(units);
                case "m":
                    return TimeUnit.MINUTES.toMillis(units);
                case "h":
                    return TimeUnit.HOURS.toMillis(units);
                default:
                    break;
            }
        }
        throw new IllegalArgumentException("Invalid time spec: " + spec);
    }

    private static <T> T toCollection(String source, Collector<String, ?, T> collector, Function<T, T> unmodifiable) {
        return unmodifiable.apply(toCollection(source, collector));
    }

    private static <T> T toCollection(String source, Collector<String, ?, T> collector) {
        return toCollection(source)
                .collect(collector);
    }

    private static Stream<String> toCollection(String source) {
        return Arrays.stream(source.split("\\s*,\\s*"))
                .map(String::trim)
                .filter(s -> !s.isEmpty());
    }

}
