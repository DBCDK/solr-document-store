/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-postgresql
 *
 * solr-doc-store-postgresql is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-postgresql is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.postgresql;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.postgresql.ds.PGSimpleDataSource;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class MigrateMain {

    private static final Pattern DB_URL = Pattern.compile("^(?:postgres(?:ql)?)?(?:([^/@]+)(?::([^@]+))@)?([^:/]+)(?::([1-9][0-9]*))?/(\\w+)$");

    public static void main(String[] args) {

        if (args.length != 1) {
            System.err.println("Usage: [database-url]");
            System.exit(1);
        }
        Matcher matcher = DB_URL.matcher(args[0]);
        if (!matcher.matches()) {
            System.err.println("Usage: [database-url]");
            System.err.println("");
            System.err.println("Not a database url");
            System.exit(1);
        }
        String username = matcher.group(1);
        String password = matcher.group(2);
        String hostname = matcher.group(3);
        String port = matcher.group(4);
        String database = matcher.group(5);

        PGSimpleDataSource ds = new PGSimpleDataSource();
        if (username != null)
            ds.setUser(username);
        if (password != null)
            ds.setPassword(password);
        ds.setServerNames(new String[] {hostname});
        if (port != null)
            ds.setPortNumbers(new int[] {Integer.parseUnsignedInt(port)});
        ds.setDatabaseName(database);

        dk.dbc.search.solrdocstore.db.DatabaseMigrator.migrate(ds);
    }
}
