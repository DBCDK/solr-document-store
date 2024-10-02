package dk.dbc.search.solrdocstore.logic;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.search.solrdocstore.Config;
import dk.dbc.vipcore.marshallers.LibraryRules;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import java.io.IOException;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.EJBException;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import java.util.List;

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
            LibraryRulesResponse libraryRulesResponse = getLibraryRuleResponse(agencyId);
            if (libraryRulesResponse.getError() != null) {
                return new OpenAgencyEntity(agencyId, LibraryType.Missing, false, false, false);
            }
            final List<LibraryRules> libraryRuleList = libraryRulesResponse.getLibraryRules();
            if (libraryRuleList == null || libraryRuleList.isEmpty()) {
                return new OpenAgencyEntity(agencyId, LibraryType.Unknown, false, false, false);
            } else {
                return new OpenAgencyEntity(libraryRuleList.get(0));
            }
        } catch (JsonProcessingException e) {
            log.error("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e.getMessage());
            log.debug("Unable to unmarshall response from vipCore from agency {}, error: {}", agencyId, e);
            throw new EJBException(e);
        } catch (RuntimeException | OpenAgencyException | IOException e) {
            log.error("Error happened while fetching vipCore library rules for agency {}: {}", agencyId, e.getMessage());
            throw new EJBException(e);
        }
    }

    protected LibraryRulesResponse getLibraryRuleResponse(int agencyId) throws OpenAgencyException, JsonProcessingException, IOException {
        String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.LIBRARY_RULES_PATH + "/" + agencyId);
        return new ObjectMapper().readValue(vipCoreResponse, LibraryRulesResponse.class);
    }
}
