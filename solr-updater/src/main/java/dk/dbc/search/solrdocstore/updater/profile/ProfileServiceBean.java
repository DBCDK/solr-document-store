/*
 * Copyright (C) 2019 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater.profile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.search.solrdocstore.updater.Config;
import dk.dbc.vipcore.marshallers.ProfileServiceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.cache.annotation.CacheResult;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.ServerErrorException;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.net.URI;
import java.util.HashMap;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Stateless
public class ProfileServiceBean {

    private static final Logger log = LoggerFactory.getLogger(ProfileServiceBean.class);
    private static final ObjectMapper O = new ObjectMapper()
            .configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Inject
    public Config config;

    @Inject
    protected VipCoreHttpClient vipCoreHttpClient;

    @CacheResult(cacheName = "oaProfile",
                 exceptionCacheName = "oaProfileError",
                 cachedExceptions = {ClientErrorException.class,
                                     ServerErrorException.class})
    public OpenAgencyProfile getOpenAgencyProfile(String agencyId, String profile) {
        try {
            // the below check is needed for integration tests.
            if (vipCoreHttpClient == null) {
                vipCoreHttpClient = new VipCoreHttpClient();
            }
            String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.PROFILE_SERVICE_PATH + "/search/" + agencyId + "/" + profile);
            log.debug("vipCoreResponse was: {}", vipCoreResponse);
            ProfileServiceResponse profileServiceResponse = O.readValue(vipCoreResponse, ProfileServiceResponse.class);
            log.trace("response for agency {} is: {}", agencyId, profileServiceResponse);
            return profileServiceResponse.getError() == null
                    ? new OpenAgencyProfile(profileServiceResponse)
                    : OpenAgencyProfile.errorProfile(profileServiceResponse.getError().value());
        } catch (OpenAgencyException e) {
            log.error("Error when fetching profile {} for agencyId {}", profile, agencyId);
            return OpenAgencyProfile.errorProfile(e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("Error when processing response from VipCore profileservice for agency {} and profile {}: {}", agencyId, profile, e.getMessage());
            log.debug("Error when processing response from VipCore profileservice for agency {} and profile {}: {}", agencyId, profile, e);
            throw new RuntimeException(e);
        }
    }

    private InputStream get(URI uri) {
        try {
            log.debug("Fetching: {}", uri);
            InputStream is = config.getClient()
                    .target(uri)
                    .request()
                    .accept(MediaType.APPLICATION_JSON)
                    .get(InputStream.class
                    );
            if (is == null)
                throw new ClientErrorException("No content from downstream", 500);
            return is;
        } catch (ClientErrorException | ServerErrorException ex) {
            log.error("Error fetching resource: {}: {}", uri, ex.getMessage());
            log.debug("Error fetching resource: ", ex);
            throw ex;

        }
    }

    private static class PropsMap extends HashMap<String, Object> {

        public PropsMap with(String key, Object value) {
            put(key, value);
            return this;
        }
    }

}
