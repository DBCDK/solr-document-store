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

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import java.util.Map;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class DocumentRetrieveResponse {

    public DocumentRetrieveResponse() {
    }

    public BibliographicEntity bibliographicRecord;

    public List<HoldingsItemEntity> holdingsItemRecords;

    public List<Integer> partOfDanbib;

    public Map<String, Map<Integer, Boolean>> attachedResources;

    public DocumentRetrieveResponse(BibliographicEntity bibliographicRecord, List<HoldingsItemEntity> holdingsItemRecords, List<Integer> partOfDanbib, Map<String, Map<Integer, Boolean>> attachedResources) {
        this.bibliographicRecord = bibliographicRecord;
        this.holdingsItemRecords = holdingsItemRecords;
        this.partOfDanbib = partOfDanbib;
        this.attachedResources = attachedResources;
    }

}
