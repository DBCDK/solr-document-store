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
package dk.dbc.search.solrdocstore.response;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@SuppressFBWarnings(value = "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
@Schema(name = StatusResponse.NAME)
public class StatusResponse {

    private static final Logger log = LoggerFactory.getLogger(StatusResponse.class);

    public static final String NAME = "status";

    @Schema(description = "If the request was a success")
    public boolean ok;

    @Schema(description = "If the lack of success was intermittent")
    public Boolean intermittent;

    @Schema(description = "Descriptive message of the ok status")
    public String text;

    public StatusResponse() {
        this.ok = true;
        this.text = "Success";
    }

    public StatusResponse(String diag) {
        this.ok = false;
        this.text = diag;
        log.error("Answering with diag: {}", diag);
    }

    public StatusResponse(String diag, boolean intermittent) {
        this.ok = false;
        this.intermittent = intermittent;
        this.text = diag;
        log.error("Answering with diag: {}", diag);
    }
}
