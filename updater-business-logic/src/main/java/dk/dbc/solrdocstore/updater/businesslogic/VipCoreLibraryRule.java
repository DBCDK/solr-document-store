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

import dk.dbc.vipcore.marshallers.LibraryRule;
import dk.dbc.vipcore.marshallers.LibraryRules;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import dk.dbc.vipcore.marshallers.LibraryType;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class VipCoreLibraryRule {

    public static final String AUTH_CREATE_COMMON_RECORD = "auth_create_common_record";
    public static final String PART_OF_BIBLIOTEK_DK = "part_of_bibliotek_dk";
    public static final String PART_OF_DANBIB = "part_of_danbib";
    public static final String USE_HOLDINGS_ITEM = "use_holdings_item";
    public static final String USE_LOCALDATA_STREAM = "use_localdata_stream";

    private final Map<String, Boolean> booleans;
    private final LibraryType libraryType;

    protected VipCoreLibraryRule() {
        this.booleans = null;
        this.libraryType = null;
    }

    public VipCoreLibraryRule(LibraryRulesResponse libraryRulesResponse) {
        this(rulesFromResponse(libraryRulesResponse));
    }

    public VipCoreLibraryRule(LibraryRules libraryRules) {
        List<LibraryRule> libraryRule = libraryRules.getLibraryRule();
        if (libraryRule == null || libraryRule.isEmpty())
            throw new IllegalArgumentException("LibraryRules from vipcore is empty");
        this.booleans = libraryRule.stream()
                .filter(r -> r.getBool() != null)
                .collect(toMap(LibraryRule::getName, LibraryRule::getBool));
        this.libraryType = LibraryType.fromValue(libraryRules.getAgencyType());
    }

    public boolean authCreateComonRecord() {
        return booleans.getOrDefault("auth_create_common_record", false);
    }

    public boolean usesEnrichments() {
        return booleans.getOrDefault("use_enrichments", false);
    }

    public boolean usesHoldingsItem() {
        return booleans.getOrDefault("use_holdings_item", false);
    }

    public boolean isPartOfBibdk() {
        return booleans.getOrDefault("part_of_bibliotek_dk", false);
    }

    public boolean isPartOfDanbib() {
        return booleans.getOrDefault("part_of_danbib", false);
    }

    public boolean isResearchLibrary() {
        return libraryType == LibraryType.FORSKNINGSBIBLIOTEK;
    }

    public boolean isFbsLibrary() {
        return libraryType == LibraryType.FOLKEBIBLIOTEK ||
               libraryType == LibraryType.SKOLEBIBLIOTEK;
    }

    private static LibraryRules rulesFromResponse(LibraryRulesResponse libraryRulesResponse) {
        if (libraryRulesResponse.getError() != null)
            throw new IllegalArgumentException("LibraryRulesResponse had an error: " + libraryRulesResponse.getError().value());
        List<LibraryRules> libraryRules = libraryRulesResponse.getLibraryRules();
        if (libraryRules == null || libraryRules.isEmpty())
            throw new IllegalArgumentException("LibraryRulesResponse from vipcore is empty");
        if (libraryRules.size() > 1)
            throw new IllegalArgumentException("LibraryRulesResponse from vipcore has too many answers");
        return libraryRules.get(0);
    }
}
