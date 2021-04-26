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
public class LibraryRuleProviderTest {

    @Test(timeout = 2_000L)
    public void testMockLibraryRuleProvider() throws Exception {
        System.out.println("testMockLibraryRuleProvider");
        
        LibraryRuleProviderMock libraryRuleProvider = new LibraryRuleProviderMock();
        VipCoreLibraryRule libraryRule = libraryRuleProvider.libraryRulesFor("700000");
        assertThat(libraryRule.isPartOfBibdk(), is(false));
        assertThat(libraryRule.isPartOfDanbib(), is(false));
        assertThat(libraryRule.useEnrichments(), is(true));
        assertThat(libraryRule.isFbsLibrary(), is(true));
        assertThat(libraryRule.isResearchLibrary(), is(false));
    }
}
