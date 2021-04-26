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

import java.util.EnumSet;
import java.util.Locale;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class FeatureSwitch {

    private final EnumSet<Feature> featureSet;

    public enum Feature {
        /**
         * Add 800000-danbib/800000-bibdk to rec.collectionIdentifier, if is
         * part of those collections based upon libraryrules and holdings
         */
        COLLECTION_IDENTIFIER_800000("800000"),
        HOLDINGS_AGENCY("holdingsAgency"),
        HOLDINGS_STATS("holdingsStats"),
        NESTED_HOLDINGS_DOCUMENTS("nested"),
        HOLDING_ITEMS_ROLE("role"),
        PART_OF_DANBIB("partOfDanbib"),
        ATTACH_RESOURCES("resources"),
        SCAN("scan"),
        PERSISTENT_WORK_ID("persistentWorkId");

        private final String name;

        Feature(String name) {
            this.name = name;
        }

        private static final Map<String, Feature> LOOKUP = EnumSet.allOf(Feature.class)
                .stream()
                .collect(toMap(f -> f.name.toLowerCase(Locale.ROOT), f -> f));

        public static Feature of(String name) {
            Feature feature = LOOKUP.get(name.toLowerCase(Locale.ROOT));
            if (feature == null)
                throw new IllegalArgumentException("Don't know feature switch: " + name);
            return feature;
        }
    }

    public FeatureSwitch(String features) {
        if (features == null || features.trim().isEmpty()) {
            this.featureSet = EnumSet.allOf(Feature.class);
        } else {
            if (features.startsWith("-")) {
                this.featureSet = EnumSet.allOf(Feature.class);
            } else {
                this.featureSet = EnumSet.noneOf(Feature.class);
            }
            for (String feature : features.split("(?=[-+][^-+])")) {
                if (feature.startsWith("-")) {
                    this.featureSet.removeAll(featureSetOf(feature.substring(1)));
                } else if (feature.startsWith("+")) {
                    this.featureSet.addAll(featureSetOf(feature.substring(1)));
                } else { // This should only be for the first (ie: "a" in "a+b")
                    this.featureSet.addAll(featureSetOf(feature));
                }
            }
        }
    }

    public boolean shound(Feature feature) {
        return featureSet.contains(feature);
    }

    @Override
    public String toString() {
        return "{FeatureSwitch(" + featureSet + ")}";
    }

    private static EnumSet<Feature> featureSetOf(String name) {
        switch (name.toLowerCase(Locale.ROOT)) {
            case "all":
                return EnumSet.allOf(Feature.class);
            case "none":
                return EnumSet.noneOf(Feature.class);
            default:
                return EnumSet.of(Feature.of(name));
        }
    }

}
