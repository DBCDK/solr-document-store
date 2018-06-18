package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.gracefulcache.CacheTimeoutException;
import dk.dbc.gracefulcache.CacheValueException;
import dk.dbc.gracefulcache.GracefulCache;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.EJBException;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.UriBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class OpenAgency {

    private static final Logger log = LoggerFactory.getLogger(OpenAgency.class);
//    private static final String SCHOOL_LIBRARY = "Skolebibliotek";
    private static final String RESEARCH_LIBRARY = "Forskningsbibliotek";

    public static class LibraryRule {

        private final boolean use_localdata_stream;
        private final boolean use_holdings_item;
        private final boolean part_of_danbib;
        private final boolean part_of_bibliotek_dk;
        private final boolean research_library;

        public LibraryRule(boolean use_localdata_stream, boolean use_holdings_item, boolean part_of_danbib, boolean part_of_bibliotek_dk, boolean research_library) {
            this.use_localdata_stream = use_localdata_stream;
            this.use_holdings_item = use_holdings_item;
            this.part_of_danbib = part_of_danbib;
            this.part_of_bibliotek_dk = part_of_bibliotek_dk;
            this.research_library = research_library;
        }

        public boolean hasUseLocaldataStream() {
            return use_localdata_stream;
        }

        public boolean hasUseHoldingItem() {
            return use_holdings_item;
        }

        public boolean isPartOfBibliotekDk() {
            return part_of_bibliotek_dk;
        }

        public boolean isPartOfDanbib() {
            return part_of_danbib;
        }

        public boolean isResearchLibrary() {
            return research_library;
        }

        @Override
        public String toString() {
            return "LibraryRule{" + "use_localdata_stream=" + use_localdata_stream + ", use_holding_item=" + use_holdings_item + ", part_of_danbib=" + part_of_danbib + ", part_of_bibliotek_dk=" + part_of_bibliotek_dk + ", research_library=" + research_library + '}';
        }
    }

    GracefulCache<String, LibraryRule> libraryRules;

    @Inject
    Config config;

    @Inject
    OpenAgencyHttp http;

    @Resource(type = ManagedExecutorService.class)
    ExecutorService mes;

    Client client;
    private UriBuilder libraryRulesUri;

    public OpenAgency() {

    }

    @PostConstruct
    public void init() {
        this.client = ClientBuilder.newBuilder().build();
        this.libraryRulesUri = UriBuilder.fromUri(config.getOpenAgencyUrl())
                .queryParam("action", "libraryRules")
                .queryParam("outputType", "json")
                .queryParam("agencyId", "{agencyId}");

        this.libraryRules = new GracefulCache<>(
                this::provideLibraryRules, mes,
                config.getOpenAgencyAge(),
                config.getOpenAgencyFailureAge(),
                25,
                config.getOpenAgencyTimeout());
    }

    public LibraryRule libraryRule(String agencyId) {
        try {
            return libraryRules.get(agencyId);
        } catch (CacheTimeoutException | CacheValueException ex) {
            log.error("Error looking up {} in open agency: {}", agencyId, ex.getMessage());
            log.debug("Error looking up {} in open agency: ", agencyId, ex);
            throw new EJBException("Error looking up: " + agencyId + " in open agency");
        }
    }

    public LibraryRule provideLibraryRules(String agencyId) throws IOException {
        try {
            log.info("Fetching openagency rules for {}", agencyId);
            URI uri = libraryRulesUri.build(agencyId);
            ObjectNode json = http.fetchJson(uri);
            LibraryRule rule = buildLibraryRule(agencyId, json);
            log.info("Fetched openagency rules for {}", agencyId);
            return rule;
        } catch (IOException | RuntimeException ex) {
            log.error("Error providing openagency answer for: {}: {}", agencyId, ex.getMessage());
            log.debug("Error providing openagency answer for: {}: ", agencyId, ex);
            ArrayList<String> messages = new ArrayList<>();
            for (Throwable t = ex ; t != null ; t = t.getCause()) {
                String message = t.getMessage();
                if (message != null) {
                    messages.add(message);
                }
            }
            if (messages.isEmpty()) {
                messages.add("Found no causes");
            }
            String message = String.join(", ", messages);
            throw new RuntimeException(message, ex);
        }
    }

    LibraryRule buildLibraryRule(String agencyId, ObjectNode json) throws IOException {
        log.debug("Processing JSON");
        JsonNode libraryRuleResponse = getJsonKey(json, "libraryRulesResponse");
        JsonNode libraryRulesList = getJsonKey(libraryRuleResponse, "libraryRules");
        for (JsonNode libraryRule : libraryRulesList) {
            String agencyIdText = getJsonValue(getJsonKey(libraryRule, "agencyId"));
            String agencyTypeText = getJsonValue(getJsonKey(libraryRule, "agencyType"));
            if (!agencyId.equals(agencyIdText)) {
                continue;
            }
            JsonNode rules = getJsonKey(libraryRule, "libraryRule");

            boolean use_localdata_stream = false;
            boolean use_holdings_item = false;
            boolean part_of_danbib = false;
            boolean part_of_bibliotek_dk = false;

            for (JsonNode rule : rules) {
                String name = getJsonValue(getJsonKey(rule, "name"));
                switch (name) {
                    case "use_localdata_stream":
                        use_localdata_stream = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                        break;
                    case "use_holdings_item":
                        use_holdings_item = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                        break;
                    case "part_of_danbib":
                        part_of_danbib = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                        break;
                    case "part_of_bibliotek_dk":
                        part_of_bibliotek_dk = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                        break;
                    default:
                        break;
                }
            }
            return new LibraryRule(use_localdata_stream, use_holdings_item, part_of_danbib, part_of_bibliotek_dk,
                                   RESEARCH_LIBRARY.equals(agencyTypeText));
        }
        throw new IOException("Cannot find valid openagency in json for agency: " + agencyId);
    }

    private static JsonNode getJsonKey(JsonNode node, String key) {
        JsonNode value = node.get(key);
        if (value == null) {
            throw new IllegalStateException("No key: " + key + " in json");
        }
        return value;
    }

    private static String getJsonValue(JsonNode node) {
        JsonNode value = node.get("$");
        if (value == null) {
            return null;
        }
        return value.asText(null);
    }

}
