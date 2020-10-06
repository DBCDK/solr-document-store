package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Iterables;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import net.jodah.failsafe.RetryPolicy;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import java.time.Duration;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class OpenAgencyProxyBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyProxyBean.class);

    @Inject
    Config config;

    @Inject
    private VipCoreHttpClient vipCoreHttpClient;

    @Timed
    public OpenAgencyEntity loadOpenAgencyEntry(int agencyId) {
        try {
            String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.LIBRARY_RULES_PATH + "/" + agencyId);
            LibraryRulesResponse libraryRulesResponse = new ObjectMapper().readValue(vipCoreResponse, LibraryRulesResponse.class);
            return libraryRulesResponse == null ? null : new OpenAgencyEntity(Iterables.getFirst(libraryRulesResponse.getLibraryRules(), null));
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
