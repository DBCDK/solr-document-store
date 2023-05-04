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
import dk.dbc.solrdocstore.updater.businesslogic.LibraryRuleProvider;
import dk.dbc.solrdocstore.updater.businesslogic.VipCoreLibraryRule;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import javax.cache.annotation.CacheResult;
import jakarta.ejb.EJB;
import jakarta.ejb.Lock;
import jakarta.ejb.LockType;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.inject.Inject;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.ServerErrorException;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Singleton
@Startup // to avoid: javax.ejb.EJBTransactionRolledbackException: Exception thrown from bean: java.lang.IllegalStateException: Cannot overwrite a Cache's CacheManager
@Lock(LockType.READ)
public class LibraryRuleProviderBean implements LibraryRuleProvider {

    private static final Logger log = LoggerFactory.getLogger(LibraryRuleProviderBean.class);

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
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    @CacheResult(cacheName = "vipLibraryRules",
                 exceptionCacheName = "vipLibraryRulesError",
                 cachedExceptions = {IllegalStateException.class,
                                     ClientErrorException.class,
                                     ServerErrorException.class})
    public VipCoreLibraryRule libraryRulesFor(String agencyId) {
        try {
            String vipCoreResponse = vipCoreHttpClient.getFromVipCore(config.getVipCoreEndpoint(), VipCoreHttpClient.LIBRARY_RULES_PATH + "/" + agencyId);
            if (vipCoreResponse.startsWith("{")) {
                log.debug("vipCoreResponse was: {}", vipCoreResponse);
                LibraryRulesResponse libraryRulesResponse = O.readValue(vipCoreResponse, LibraryRulesResponse.class);
                if (libraryRulesResponse.getError() != null)
                    throw new IllegalStateException("library rules: " + libraryRulesResponse.getError().value());
                return new VipCoreLibraryRule(libraryRulesResponse);
            } else {
                throw new ClientErrorException("Vipcore said: " + vipCoreResponse.substring(Integer.max(0, vipCoreResponse.length()-50)), Response.Status.BAD_REQUEST);
            }
        } catch (OpenAgencyException ex) {
            log.error("Error when fetching libraryrules for agencyId {}", agencyId);
            throw new IllegalStateException("library rules: " + ex.getMessage());
        } catch (JsonProcessingException ex) {
            log.error("Error when processing response from VipCore libraryrules for agency {}: {}", agencyId, ex.getMessage());
            log.debug("Error when processing response from VipCore libraryrules for agency {}: {}", agencyId, ex);
            throw new IllegalStateException("library rules: " + ex.getMessage());
        }
    }
}
