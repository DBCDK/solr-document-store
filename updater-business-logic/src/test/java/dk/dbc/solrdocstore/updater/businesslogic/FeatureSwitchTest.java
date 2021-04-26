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

import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class FeatureSwitchTest {

    @Test(timeout = 2_000L)
    public void testNoFeaturesDefined() throws Exception {
        System.out.println("testNoFeaturesDefined");

        FeatureSwitch featureSwitch1 = new FeatureSwitch(null);
        assertThat(featureSwitch1.shound(FeatureSwitch.Feature.SCAN), is(true));

        FeatureSwitch featureSwitch2 = new FeatureSwitch("");
        assertThat(featureSwitch2.shound(FeatureSwitch.Feature.SCAN), is(true));
    }

    @Test(timeout = 2_000L)
    public void testOnlyAdd() throws Exception {
        System.out.println("testOnlyAdd");

        FeatureSwitch featureSwitch = new FeatureSwitch("role+800000");
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.SCAN), is(false));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.HOLDING_ITEMS_ROLE), is(true));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.COLLECTION_IDENTIFIER_800000), is(true));
    }

    @Test(timeout = 2_000L)
    public void testOnlyAddExplicit() throws Exception {
        System.out.println("testOnlyAddExplicit");

        FeatureSwitch featureSwitch = new FeatureSwitch("+role+800000");
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.SCAN), is(false));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.HOLDING_ITEMS_ROLE), is(true));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.COLLECTION_IDENTIFIER_800000), is(true));
    }

    @Test(timeout = 2_000L)
    public void testRemove() throws Exception {
        System.out.println("testRemove");

        FeatureSwitch featureSwitch = new FeatureSwitch("-role-800000");
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.SCAN), is(true));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.HOLDING_ITEMS_ROLE), is(false));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.COLLECTION_IDENTIFIER_800000), is(false));
    }

    @Test(timeout = 2_000L)
    public void testNone() throws Exception {
        System.out.println("testNone");

        FeatureSwitch featureSwitch = new FeatureSwitch("none");
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.SCAN), is(false));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.HOLDING_ITEMS_ROLE), is(false));
        assertThat(featureSwitch.shound(FeatureSwitch.Feature.COLLECTION_IDENTIFIER_800000), is(false));
    }
}
