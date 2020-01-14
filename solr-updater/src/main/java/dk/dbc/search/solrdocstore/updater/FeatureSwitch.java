/*
 * Copyright (C) 2020 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import java.util.EnumSet;
import java.util.stream.Stream;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public enum FeatureSwitch {
    COLLECTION_IDENTIFIER_800000("800000"),
    HOLDINGS_AGENCY("holdingsAgency"),
    NESTED_HOLDINGS_DOCUMENTS("nested"),
    HOLDING_ITEMS_ROLE("role"),
    PART_OF_DANBIB("partOfDanbib"),
    ATTACH_RESOURCES("resources"),
    SCAN("scan");

    private final String name;

    FeatureSwitch(String name) {
        this.name = name;
    }

    public static FeatureSwitch of(String name) {
        for (FeatureSwitch value : values()) {
            if (value.name.equalsIgnoreCase(name))
                return value;
        }
        throw new IllegalArgumentException("Don't know feature switch: " + name);
    }

    public static EnumSet<FeatureSwitch> featureSet(String features) {
        if (features == null || features.trim().isEmpty())
            features = "all";
        EnumSet<FeatureSwitch> set = EnumSet.noneOf(FeatureSwitch.class);
        Stream.of(features.split("(?=[-+][^-+])"))
                .map(s -> s.replaceAll("\\s+", ""))
                .filter(s -> !s.isEmpty())
                .forEach(s -> {
                    if (s.startsWith("-")) {
                        s = s.substring(1);
                        set.removeAll(featureSetOfOneName(s));
                    } else {
                        if (s.startsWith("+"))
                            s = s.substring(1);
                        set.addAll(featureSetOfOneName(s));
                    }
                });
        return set;
    }

    private static EnumSet<FeatureSwitch> featureSetOfOneName(String desc) {
        switch (desc.toLowerCase()) {
            case "all":
                return EnumSet.allOf(FeatureSwitch.class);
            case "none":
                return EnumSet.noneOf(FeatureSwitch.class);
            default:
                return EnumSet.of(FeatureSwitch.of(desc));
        }
    }
}
