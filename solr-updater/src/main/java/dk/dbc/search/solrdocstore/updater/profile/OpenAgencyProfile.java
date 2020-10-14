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

import dk.dbc.vipcore.marshallers.ProfileServiceResponse;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class OpenAgencyProfile implements Serializable {

    private static final long serialVersionUID = 7173963836276661255L;

    public boolean success;
    public String error;
    public boolean includeOwnHoldings;
    public List<String> collectionIdentifiers;

    public OpenAgencyProfile() {
    }

    public OpenAgencyProfile(boolean includeOwnHoldings, String... collectionIdentifiers) {
        this.includeOwnHoldings = includeOwnHoldings;
        this.collectionIdentifiers = Arrays.asList(collectionIdentifiers);
    }

    public OpenAgencyProfile(ProfileServiceResponse vipCoreProfileResponse) {
        this.collectionIdentifiers = new ArrayList<>(vipCoreProfileResponse.getCollectionIdentifiers());
        this.success = true;
        this.includeOwnHoldings = vipCoreProfileResponse.getIncludeOwnHoldings();
    }

    public static OpenAgencyProfile errorProfile(String errorText) {
        OpenAgencyProfile res = new OpenAgencyProfile();
        res.error = errorText;
        res.success = false;
        return res;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 67 * hash + ( this.includeOwnHoldings ? 1 : 0 );
        hash = 67 * hash + Objects.hashCode(this.collectionIdentifiers);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final OpenAgencyProfile other = (OpenAgencyProfile) obj;
        return this.includeOwnHoldings == other.includeOwnHoldings &&
               Objects.equals(this.collectionIdentifiers, other.collectionIdentifiers);
    }

    @Override
    public String toString() {
        return success ?
               "OpenAgencyProfile{" + "includeOwnHoldings=" + includeOwnHoldings + ", search=" + collectionIdentifiers + '}' :
               "OpenAgencyProfile{" + "error=" + error + '}';
    }
}
