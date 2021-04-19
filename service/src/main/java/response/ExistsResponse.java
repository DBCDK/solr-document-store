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
package response;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@Schema(name = ExistsResponse.NAME)
@SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class ExistsResponse {
    public static final String NAME = "existance-response";

    @Schema(description = "If an item exists and can be fetched")
    public boolean exists;
}
