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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Schema(name = IndexKeysList.NAME, type = SchemaType.ARRAY, ref = IndexKeys.NAME, hidden = true)
public class IndexKeysList extends ArrayList<IndexKeys> {

    private static final long serialVersionUID = 0x047574A122149A20L;

    public static final String NAME = "index-keys-list";

    public static IndexKeysList from(IndexKeys... indexKeys) {
        return from(Arrays.asList(indexKeys));
    }

    public static IndexKeysList from(List<IndexKeys> indexKeys) {
        IndexKeysList ret = new IndexKeysList();
        ret.addAll(indexKeys);
        return ret;
    }
}
