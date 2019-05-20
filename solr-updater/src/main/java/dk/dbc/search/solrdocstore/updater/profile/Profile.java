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

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class Profile implements Serializable {

    private static final long serialVersionUID = 7173963836276661255L;

    public boolean success;
    public String error;
    public boolean includeOwnHoldings;
    public List<String> search;

    public Profile() {
    }

    public Profile(boolean includeOwnHoldings, String... search) {
        this.includeOwnHoldings = includeOwnHoldings;
        this.search = Arrays.asList(search);
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 67 * hash + ( this.includeOwnHoldings ? 1 : 0 );
        hash = 67 * hash + Objects.hashCode(this.search);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final Profile other = (Profile) obj;
        return this.includeOwnHoldings == other.includeOwnHoldings &&
               Objects.equals(this.search, other.search);
    }

    @Override
    public String toString() {
        return success ?
               "Profile{" + "includeOwnHoldings=" + includeOwnHoldings + ", search=" + search + '}' :
               "Profile{" + "error=" + error + '}';
    }
}
