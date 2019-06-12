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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.updater.Config;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.rmi.ServerException;
import java.util.HashMap;
import javax.cache.annotation.CacheResult;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.ServerErrorException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @CacheResult(cacheName = "oaProfile",
                 exceptionCacheName = "oaProfileError",
                 cachedExceptions = {ClientErrorException.class,
                                     ServerErrorException.class})
    public Profile getProfile(String agencyId, String profile) {
        URI uri = config.getProfileServiceUrl()
                .buildFromMap(new PropsMap()
                        .with("agencyId", agencyId)
                        .with("profile", profile));
        try (InputStream is = get(uri)) {
            Profile response = O.readValue(is, Profile.class);
            if (!response.success)
                throw new ServerException("Profile error: " + response.error);
            return response;
        } catch (IOException ex) {
            log.error("Error processing OpenAgency response for profile: {}-{}: {}", agencyId, profile, ex.getMessage());
            log.debug("Error processing OpenAgency response for profile: {}-{}: ", agencyId, profile, ex);
            throw new ServerErrorException("Error processing profile-service response for " + agencyId + "-" + profile,
                                           Response.Status.INTERNAL_SERVER_ERROR, ex);
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