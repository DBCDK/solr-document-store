/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DocumentRetrieveResponse {

    public DocumentRetrieveResponse() {
    }

    public BibliographicEntity bibliographicRecord;

    public List<HoldingsItemEntity> holdingsItemRecords;

    public DocumentRetrieveResponse(BibliographicEntity bibliographicRecord, List<HoldingsItemEntity> holdingsItemRecords) {
        this.bibliographicRecord = bibliographicRecord;
        this.holdingsItemRecords = holdingsItemRecords;
    }

}
