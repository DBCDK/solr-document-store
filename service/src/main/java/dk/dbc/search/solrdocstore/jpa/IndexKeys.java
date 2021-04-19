/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
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
package dk.dbc.search.solrdocstore.jpa;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Schema(name = IndexKeys.NAME, description = IndexKeys.DESCRIPTION)
public class IndexKeys extends HashMap<String, List<String>> {

    private static final long serialVersionUID = 0x2B8059AFD2C1051AL;

    public static final String DESCRIPTION = "Generic object representing a SolR document." +
                                             " This is in the format of a map of: SolR field-name to" +
                                             " list of SolR field-value(s)." +
                                             " Even if the field in the SolR schema is not declared 'multiValued'," +
                                             " the value is represented as a list of one value.";
    public static final String NAME = "index-keys";

    public static IndexKeys from(Map<String, List<String>> indexKeys) {
        IndexKeys ret = new IndexKeys();
        ret.putAll(indexKeys);
        return ret;
    }
}
