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

import dk.dbc.solrdocstore.updater.businesslogic.PersistentWorkIdProvider;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Singleton
@Lock(LockType.READ)
public class PersistenWorkIdProviderBean implements PersistentWorkIdProvider {

    @Inject
    Config config;

    @Override
    public String persistentWorkIdFor(String corepoWorkId) {
        Client client = config.getClient();
        String wpUri = config.getWorkPresentationEndpoint();
        return client.target(wpUri)
                .queryParam("corepoWorkId", corepoWorkId)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get(String.class);
    }
}
