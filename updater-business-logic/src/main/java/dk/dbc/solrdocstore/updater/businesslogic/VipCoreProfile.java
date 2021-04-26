/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater-business-logic
 *
 * solr-doc-store-updater-business-logic is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater-business-logic is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.solrdocstore.updater.businesslogic;

import dk.dbc.vipcore.marshallers.ProfileServiceResponse;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class VipCoreProfile implements Serializable {

    private static final long serialVersionUID = 0x3FDCC38B0E089069L;

    private final boolean includeOwnHoldings;
    private final Collection<String> collectionIdentifiers;

    public VipCoreProfile(boolean includeOwnHoldings, String... collectionIdentifiers) {
        this.includeOwnHoldings = includeOwnHoldings;
        this.collectionIdentifiers = Arrays.asList(collectionIdentifiers);

    }

    public VipCoreProfile(ProfileServiceResponse vipCoreProfileResponse) {
        this.includeOwnHoldings = vipCoreProfileResponse.getIncludeOwnHoldings();
        this.collectionIdentifiers = Collections.unmodifiableCollection(vipCoreProfileResponse.getCollectionIdentifiers());
    }

    public Collection<String> getCollectionIdentifiers() {
        return collectionIdentifiers;
    }

    public boolean hasIncludeOwnHoldings() {
        return includeOwnHoldings;
    }

    @Override
    public String toString() {
        return "VipCoreProfile{" + "includeOwnHoldings=" + includeOwnHoldings + ", collectionIdentifiers=" + collectionIdentifiers + '}';
    }
}
