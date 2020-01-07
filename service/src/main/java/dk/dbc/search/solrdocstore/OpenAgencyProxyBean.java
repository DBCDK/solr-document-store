package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;
import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class OpenAgencyProxyBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyProxyBean.class);

    private static final ObjectMapper O = new ObjectMapper();
    private static final String SCHOOLLIBRARY = "Skolebibliotek";

    private static final RetryPolicy RETRY_POLICY = new RetryPolicy()
            .withDelay(250, TimeUnit.MILLISECONDS)
            .retryOn(Exception.class)
            .withMaxRetries(4);

    @Inject
    Config config;

    @Timed
    public OpenAgencyEntity loadOpenAgencyEntry(int agencyId) {
        try {
            JsonNode json = loadOpenAgencyJson(agencyId);
            return parseOpenAgencyJSON(json);
        } catch (EJBException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            log.error("Error processing agency: {}: {}", agencyId, ex.getMessage());
            log.debug("Error processing agency: {}: ", agencyId, ex);
            throw new EJBException(ex);
        }
    }

    @Timed
    public JsonNode loadOpenAgencyJson(int agencyId) {
        try {
            return Failsafe.with(RETRY_POLICY).get(() -> fetchOpenAgencyJSON(agencyId));
        } catch (EJBException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            log.error("Cannot get openagency entry for: {}: {}", agencyId, ex.getMessage());
            log.debug("Cannot get openagency entry for: {}:", agencyId, ex);
            throw new EJBException(ex);
        }
    }

    public JsonNode fetchOpenAgencyJSON(int agencyId) throws IOException {
        Response resp = ClientBuilder.newClient()
                .target(UriBuilder.fromUri(URI.create(config.getOaURL()))
                        .queryParam("action", "libraryRules")
                        .queryParam("agencyId", String.format("%06d", agencyId))
                        .queryParam("outputType", "json"))
                .request(MediaType.APPLICATION_JSON_TYPE)
                .buildGet()
                .invoke();
        String content = resp.readEntity(String.class);
        if (resp.getStatusInfo().equals(Response.Status.OK) &&
            resp.getMediaType().equals(MediaType.APPLICATION_JSON_TYPE)) {
            return O.readTree(content);
        }
        log.error("openagency respone is of type: {}/{} with content:", resp.getStatusInfo(), resp.getMediaType());
        log.error(content);
        throw new EJBException("openagency respone is of type: " + resp.getMediaType());
    }

    private static OpenAgencyEntity parseOpenAgencyJSON(JsonNode tree) {
        log.debug("Processing JSON");
        JsonNode libraryRuleResponse = getJsonKey(tree, "libraryRulesResponse");
        JsonNode libraryRules = getJsonKey(libraryRuleResponse, "libraryRules");
        for (JsonNode libraryRule : libraryRules) {
            String agencyIdText = getJsonValue(getJsonKey(libraryRule, "agencyId"));
            String agencyTypeText = getJsonValue(getJsonKey(libraryRule, "agencyType"));
            if (agencyIdText != null) {
                int agencyId = Integer.parseUnsignedInt(agencyIdText, 10);
                JsonNode rules = getJsonKey(libraryRule, "libraryRule");
                boolean auth_create_common_record = false;
                boolean part_of_danbib = false;
                boolean use_enrichments = false;
                for (JsonNode rule : rules) {
                    String name = getJsonValue(getJsonKey(rule, "name"));
                    switch (name) {
                        case "auth_create_common_record":
                            auth_create_common_record = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                            break;
                        case "part_of_danbib":
                            part_of_danbib = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                            break;
                        case "use_enrichments":
                            use_enrichments = getJsonValue(getJsonKey(rule, "bool")).equals("1");
                            break;
                        default:
                            break;
                    }
                }
                LibraryType agencyType = LibraryType.NonFBS;
                if (use_enrichments) {
                    if (SCHOOLLIBRARY.equals(agencyTypeText)) {
                        agencyType = LibraryType.FBSSchool;
                    } else {
                        agencyType = LibraryType.FBS;
                    }
                }
                return new OpenAgencyEntity(agencyId, agencyType, auth_create_common_record, part_of_danbib);
            }
        }
        throw new EJBException("Cannot find valid openagency");
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
