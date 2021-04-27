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

/**
 * Interface for class that provides access to vipcore profile (search) endpoint.
 *
 * In a ".war" it is implemented like this:
 * <pre>
 *       \@Singleton
 *       \@Lock(LockType.READ)
 *       public class ProfileProviderBean implements ProfileProvider {
 *           ... implementation of interface
 *       }
 * </pre>
 *
 * And use it like this:
 *
 * <pre>
 *       \@Inject
 *       ProfileProvider provider;
 * </pre>
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public interface ProfileProvider {

    VipCoreProfile profileFor(String agencyId, String profile);
}
