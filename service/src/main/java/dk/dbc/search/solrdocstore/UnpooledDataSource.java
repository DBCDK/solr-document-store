/*
 * Copyright (C) 2019 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.sql.DataSource;
import org.postgresql.ds.PGSimpleDataSource;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class UnpooledDataSource {
    private static final Pattern POSTGRES_URL_REGEX = Pattern.compile("(?:postgres(?:ql)?://)?(?:([^:@]+)(?::([^@]*))@)?([^:/]+)(?::([1-9][0-9]*))?/(.+)");

    public static DataSource dataSourceOf(String connectionName) {
        String url = System.getenv("DOCSTORE_POSTGRES_URL");
        Matcher matcher = POSTGRES_URL_REGEX.matcher(url);
        if (!matcher.matches())
            throw new IllegalStateException("Cannot parse pg-url: " + url);

        PGSimpleDataSource ds = new PGSimpleDataSource();
        if (matcher.group(1) != null) {
            ds.setUser(matcher.group(1));
            if (matcher.group(2) != null)
                ds.setPassword(matcher.group(2));
        }
        ds.setServerNames(new String[]{matcher.group(3)});
        if (matcher.group(4) != null)
            ds.setPortNumbers(new int[]{Integer.parseUnsignedInt(matcher.group(4))});
        ds.setDatabaseName(matcher.group(5));
        ds.setApplicationName("SolrDocStore-" + connectionName);
        return ds;
    }

}
