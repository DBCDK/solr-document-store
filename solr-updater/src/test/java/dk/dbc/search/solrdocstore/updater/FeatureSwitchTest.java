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
import org.junit.Test;

import static dk.dbc.search.solrdocstore.updater.FeatureSwitch.*;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class FeatureSwitchTest {

    @Test(timeout = 2_000L)
    public void testFeatureSwitchParsing() throws Exception {
        System.out.println("testFeatureSwitchParsing");

        EnumSet<FeatureSwitch> featureSet;
        featureSet = FeatureSwitch.featureSet("all-nested-800000");
        System.out.println("featureSet = " + featureSet);
        assertThat(featureSet,
                   is(EnumSet.of(HOLDINGS_AGENCY, HOLDING_ITEMS_ROLE, PART_OF_DANBIB, ATTACH_RESOURCES, SCAN)));
        featureSet = FeatureSwitch.featureSet("nested+800000");
        System.out.println("featureSet = " + featureSet);
        assertThat(featureSet,
                   is(EnumSet.of(NESTED_HOLDINGS_DOCUMENTS, COLLECTION_IDENTIFIER_800000)));
        featureSet = FeatureSwitch.featureSet("none+nested+800000");
        System.out.println("featureSet = " + featureSet);
        assertThat(featureSet,
                   is(EnumSet.of(NESTED_HOLDINGS_DOCUMENTS, COLLECTION_IDENTIFIER_800000)));
    }
}
