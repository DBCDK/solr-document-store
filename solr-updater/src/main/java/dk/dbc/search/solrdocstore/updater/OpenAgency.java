package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Iterables;
import dk.dbc.gracefulcache.CacheTimeoutException;
import dk.dbc.gracefulcache.CacheValueException;
import dk.dbc.gracefulcache.GracefulCache;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.pgqueue.consumer.PostponedNonFatalQueueError;
import dk.dbc.vipcore.marshallers.LibraryRule;
import dk.dbc.vipcore.marshallers.LibraryRules;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
@Startup
public class OpenAgency {

    private static final Logger log = LoggerFactory.getLogger(OpenAgency.class);
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

        @SuppressFBWarnings(value = {"NP_NONNULL_PARAM_VIOLATION", "RCN_REDUNDANT_NULLCHECK_OF_NULL_VALUE"})
        private static boolean getLibraryRuleBoolean(List<LibraryRule> libraryRuleList, String libraryRuleName) {
            LibraryRule libraryRule = Iterables.find(libraryRuleList, lr -> lr != null && lr.getName().equals(libraryRuleName), null);
            return libraryRule != null && libraryRule.getBool();
        }

        public OpenAgencyLibraryRule(LibraryRules vipCoreLibraryRules) {
            List<LibraryRule> libraryRules = vipCoreLibraryRules.getLibraryRule();
            this.use_localdata_stream = getLibraryRuleBoolean(libraryRules, "use_localdata_stream");
            this.use_holdings_item = getLibraryRuleBoolean(libraryRules, "use_holdings_item");
            this.part_of_danbib = getLibraryRuleBoolean(libraryRules, "part_of_danbib");
            this.part_of_bibliotek_dk = getLibraryRuleBoolean(libraryRules, "part_of_bibliotek_dk");
            this.research_library = (vipCoreLibraryRules.getAgencyType() == null) ? false : vipCoreLibraryRules.getAgencyType().equals(RESEARCH_LIBRARY);
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

    @Resource(type = ManagedExecutorService.class)
    ExecutorService mes;

    Client client;
    private ObjectMapper O;

    public OpenAgency() {

    }

    @PostConstruct
    public void init() {
        this.client = ClientBuilder.newBuilder().build();

        this.libraryRules = new GracefulCache<>(
                this::provideLibraryRules, mes,
                config.getOpenAgencyAge(),
                config.getOpenAgencyFailureAge(),
                25,
                config.getOpenAgencyTimeout());

        this.O = new ObjectMapper();
        this.O.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
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

    @SuppressFBWarnings(value = "NP_NONNULL_PARAM_VIOLATION")
    private LibraryRules libraryRulesFromVipCore(String agencyId) {
        try {
            final String path = VipCoreHttpClient.LIBRARY_RULES_PATH + "/" + agencyId;
            final String responseFromVipCore = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), path);
            final LibraryRulesResponse libraryRulesResponse = O.readValue(responseFromVipCore, LibraryRulesResponse.class);
            if (libraryRulesResponse == null) {
             return null;
            }
            if (libraryRulesResponse.getError() != null) {
                log.error("Error occurred when fetching library rules for agency {}: {}", agencyId, libraryRulesResponse.getError().value());
                throw new RuntimeException("\"Error occurred when fetching library rules for agency " + agencyId);
            }
            return Iterables.getFirst(libraryRulesResponse.getLibraryRules(), null);
        } catch (OpenAgencyException | JsonProcessingException e) {
            log.error("OA Exception when fetching from vipCore for agency {}: {}", agencyId, e.getMessage());
            log.debug("OA Exception when fetching from vipCore for agency {}: {}", agencyId, e);
            throw new RuntimeException(e);
        }
    }

    public OpenAgencyLibraryRule provideLibraryRules(String agencyId) throws RuntimeException {
        try {
            log.info("Fetching vipCore rules for {}", agencyId);
            final LibraryRules vipCoreLibRules = libraryRulesFromVipCore(agencyId);
            OpenAgencyLibraryRule rule = new OpenAgencyLibraryRule(vipCoreLibRules);
            log.info("Fetched vipCore rules for {}", agencyId);
            return rule;
        } catch (RuntimeException ex) {
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

}
