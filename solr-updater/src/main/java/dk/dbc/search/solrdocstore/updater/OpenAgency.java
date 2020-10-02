package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dk.dbc.gracefulcache.CacheTimeoutException;
import dk.dbc.gracefulcache.CacheValueException;
import dk.dbc.gracefulcache.GracefulCache;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.UriBuilder;

import dk.dbc.vipcore.marshallers.LibraryRule;
import dk.dbc.vipcore.marshallers.LibraryRules;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
@Startup
public class OpenAgency {

    private static final Logger log = LoggerFactory.getLogger(OpenAgency.class);
//    private static final String SCHOOL_LIBRARY = "Skolebibliotek";
    private static final String RESEARCH_LIBRARY = "Forskningsbibliotek";

    public static class OpenAgencyLibraryRule {

        private final boolean use_localdata_stream;
        private final boolean use_holdings_item;
        private final boolean part_of_danbib;
        private final boolean part_of_bibliotek_dk;
        private final boolean research_library;
        private final boolean auth_create_common_record;

        public OpenAgencyLibraryRule(boolean use_localdata_stream, boolean use_holdings_item, boolean part_of_danbib, boolean part_of_bibliotek_dk, boolean research_library, boolean auth_create_common_record) {
            this.use_localdata_stream = use_localdata_stream;
            this.use_holdings_item = use_holdings_item;
            this.part_of_danbib = part_of_danbib;
            this.part_of_bibliotek_dk = part_of_bibliotek_dk;
            this.research_library = research_library;
            this.auth_create_common_record = auth_create_common_record;
        }

        private static boolean getLibraryRuleBoolean(Stream<LibraryRule> libraryRuleStream, String libraryRuleName) {
            final LibraryRule libRule = libraryRuleStream.filter(lr -> lr.getName().equals(libraryRuleName)).findFirst().orElse(null);
            return libRule != null ? libRule.getBool() : false;
        }

        public OpenAgencyLibraryRule(LibraryRules vipCoreLibraryRules) {
            Stream<LibraryRule> libraryRules = vipCoreLibraryRules.getLibraryRule().stream();
            this.use_localdata_stream = getLibraryRuleBoolean(libraryRules, "use_localdata_stream");
            this.use_holdings_item = getLibraryRuleBoolean(libraryRules, "use_holdings_item");
            this.part_of_danbib = getLibraryRuleBoolean(libraryRules, "part_of_danbib");
            this.part_of_bibliotek_dk = getLibraryRuleBoolean(libraryRules, "part_of_bibliotek_dk");
            this.research_library = getLibraryRuleBoolean(libraryRules, "research_library");
            this.auth_create_common_record = getLibraryRuleBoolean(libraryRules, "auth_create_common_record");
        }

        public boolean hasUseLocaldataStream() {
            return use_localdata_stream;
        }

        public boolean hasUseHoldingItem() {
            return use_holdings_item;
        }

        public boolean hasAuthCreateCommonRecord() {
            return auth_create_common_record;
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
            return "OpenAgencyLibraryRule{" + "use_localdata_stream=" + use_localdata_stream + ", use_holding_item=" + use_holdings_item + ", part_of_danbib=" + part_of_danbib + ", part_of_bibliotek_dk=" + part_of_bibliotek_dk + ", research_library=" + research_library + '}';
        }
    }

    GracefulCache<String, OpenAgencyLibraryRule> libraryRules;

    @Inject
    Config config;

    @EJB
    VipCoreHttpClient vipCoreHttpClient;

    @Inject
    OpenAgencyHttp http;

    @Resource(type = ManagedExecutorService.class)
    ExecutorService mes;

    Client client;
    private UriBuilder libraryRulesUri;
    private ObjectMapper O;

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

        this.O = new ObjectMapper();
    }

    public OpenAgencyLibraryRule libraryRule(String agencyId) throws PostponedNonFatalQueueError {
        try {
            return libraryRules.get(agencyId);
        } catch (CacheTimeoutException | CacheValueException ex) {
            log.error("Error looking up {} in open agency: {}", agencyId, ex.getMessage());
            log.debug("Error looking up {} in open agency: ", agencyId, ex);
            throw new PostponedNonFatalQueueError("Error looking up: " + agencyId + " in open agency", 5000L);
        }
    }

    private LibraryRules libraryRulesFromVipCore(String agencyId) {
        try {
            final String path = VipCoreHttpClient.LIBRARY_RULES_PATH + agencyId;
            final String responseFromVipCore = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), path);
            final LibraryRules res = O.readValue(responseFromVipCore, LibraryRules.class);
        } catch (OpenAgencyException e) {
            log.error("OA Exception when fetching from vipCore for agency {}: {}", agencyId, e.getMessage());
        } catch (JsonMappingException e) {
            log.error("JsonMapping exception when unmarshalling vipCore response for agency {}: {}", agencyId, e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingEx when unmarshalling vipCore response for agency {}: {}", agencyId, e.getMessage());
        }
        return null;
    }

    public OpenAgencyLibraryRule provideLibraryRules(String agencyId) throws IOException {
        try {
            log.info("Fetching openagency rules for {}", agencyId);
            URI uri = libraryRulesUri.build(agencyId);
            ObjectNode json = http.fetchJson(uri);
            final LibraryRules vipCoreLibRules = libraryRulesFromVipCore(agencyId);
            if (json == null) {
                throw new NullPointerException("Error fetching library rules for: " + agencyId);
            }
            if (vipCoreLibRules != null) {
                log.info("Library rules from VipCore: {}", vipCoreLibRules);
            }
            OpenAgencyLibraryRule rule = buildLibraryRule(agencyId, json);
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

    OpenAgencyLibraryRule buildLibraryRule(String agencyId, ObjectNode json) throws IOException {
        log.debug("Processing JSON");
        JsonNode libraryRuleResponse = getJsonKey(json, "libraryRulesResponse");
        JsonNode libraryRulesList = getJsonKey(libraryRuleResponse, "libraryRules");
        for (JsonNode libraryRule : libraryRulesList) {
            String agencyIdText = getJsonValue(getJsonKey(libraryRule, "agencyId"));
            String agencyTypeText = getJsonValue(getJsonKey(libraryRule, "agencyType"));
            if (agencyId.equals(agencyIdText)) {
                JsonNode rules = getJsonKey(libraryRule, "libraryRule");

                boolean use_localdata_stream = false;
                boolean use_holdings_item = false;
                boolean part_of_danbib = false;
                boolean part_of_bibliotek_dk = false;
                boolean auth_create_common_record = false;

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
                        case "auth_create_common_record":
                            auth_create_common_record = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                            break;
                        default:
                            break;
                    }
                }
                return new OpenAgencyLibraryRule(use_localdata_stream, use_holdings_item, part_of_danbib, part_of_bibliotek_dk,
                                       RESEARCH_LIBRARY.equals(agencyTypeText), auth_create_common_record);
            }
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
