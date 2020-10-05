package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import com.google.common.collect.Iterables;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.vipcore.marshallers.LibraryRules;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
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

    private static final RetryPolicy RETRY_POLICY = new RetryPolicy<>()
            .handle(Exception.class)
            .handleResult(null)
            .withDelay(Duration.ofMillis(250))
            .withMaxRetries(4);

    @Inject
    Config config;

    @Inject
    private VipCoreHttpClient vipCoreHttpClient;

    @Timed
    public OpenAgencyEntity loadOpenAgencyEntry(int agencyId) {
        try {
            String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.LIBRARY_RULES_PATH + "/" + agencyId);
            LibraryRulesResponse libraryRulesResponse = new ObjectMapper().readValue(vipCoreResponse, LibraryRulesResponse.class);
            List<LibraryRules> libraryRulesList = libraryRulesResponse.getLibraryRules();
            final LibraryRules libraryRules = Iterables.getFirst(libraryRulesList, null);
            return new OpenAgencyEntity(libraryRules);
        } catch (OpenAgencyException e) {
            log.error("Error happened while fetching vipCore library rules for agency {}: {}", agencyId, e.getMessage());
            throw new EJBException(e);
        } catch (JsonMappingException e) {
            log.error("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e.getMessage());
            log.debug("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e);
            throw new EJBException(e);
        } catch (JsonProcessingException e) {
            log.error("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e.getMessage());
            log.debug("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e);
            throw new EJBException(e);
        }
    }

}
