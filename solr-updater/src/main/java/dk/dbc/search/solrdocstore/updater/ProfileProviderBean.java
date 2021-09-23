/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
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
package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.openagency.http.VipCoreHttpClient;
import dk.dbc.solrdocstore.updater.businesslogic.ProfileProvider;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreProfile;
import dk.dbc.vipcore.marshallers.ProfileServiceResponse;
import javax.cache.annotation.CacheResult;
import javax.ejb.EJB;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.ServerErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Singleton
@Startup // to avoid: javax.ejb.EJBTransactionRolledbackException: Exception thrown from bean: java.lang.IllegalStateException: Cannot overwrite a Cache's CacheManager
@Lock(LockType.READ)
public class ProfileProviderBean implements ProfileProvider {

    private static final Logger log = LoggerFactory.getLogger(ProfileProviderBean.class);

    private static final ObjectMapper O = new ObjectMapper()
            .configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true)
            .configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Inject
    Config config;

    @EJB
    VipCoreHttpClient vipCoreHttpClient;

    @Override
    @CacheResult(cacheName = "vipProfile",
                 exceptionCacheName = "vipProfileError",
                 cachedExceptions = {IllegalStateException.class,
                                     ClientErrorException.class,
                                     ServerErrorException.class})
    public VipCoreProfile profileFor(String agencyId, String profile) {
        try {
            String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.PROFILE_SERVICE_PATH + "/search/" + agencyId + "/" + profile);
            log.debug("vipCoreResponse was: {}", vipCoreResponse);
            ProfileServiceResponse profileServiceResponse = O.readValue(vipCoreResponse, ProfileServiceResponse.class);
            if (profileServiceResponse.getError() != null)
                throw new IllegalStateException("profile service: " + profileServiceResponse.getError().value());
            return new VipCoreProfile(profileServiceResponse);
        } catch (OpenAgencyException ex) {
            log.error("Error when fetching profile {} for agencyId {}", profile, agencyId);
            throw new IllegalStateException("profile service: " + ex.getMessage());
        } catch (JsonProcessingException ex) {
            log.error("Error when processing response from VipCore profileservice for agency {} and profile {}: {}", agencyId, profile, ex.getMessage());
            log.debug("Error when processing response from VipCore profileservice for agency {} and profile {}: {}", agencyId, profile, ex);
            throw new IllegalStateException("profile service: " + ex.getMessage());
        }
    }

}
