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

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class VipCoreLibraryRuleTest {

    private static final ObjectMapper O = new ObjectMapper();

    @Test(timeout = 2_000L)
    public void testLibraryRuleFromVip() throws Exception {
        System.out.println("testLibraryRuleFromVip");

        String content = "{'libraryRules':[{'agencyId':'number','agencyType':'Skolebibliotek','libraryRule':[{'name':'create_enrichments','bool':true},{'name':'use_enrichments','bool':true},{'name':'auth_root','bool':false},{'name':'auth_common_subjects','bool':false},{'name':'auth_common_notes','bool':false},{'name':'auth_dbc_records','bool':false},{'name':'auth_public_lib_common_record','bool':false},{'name':'auth_ret_record','bool':false},{'name':'auth_agency_common_record','bool':true},{'name':'auth_export_holdings','bool':false},{'name':'use_localdata_stream','bool':false},{'name':'use_holdings_item','bool':true},{'name':'part_of_bibliotek_dk','bool':false},{'name':'auth_create_common_record','bool':false},{'name':'ims_library','bool':false},{'name':'worldcat_synchronize','bool':true},{'name':'worldcat_resource_sharing','bool':false},{'name':'cataloging_template_set','string':'dbc'},{'name':'part_of_danbib','bool':false},{'name':'auth_add_dk5_to_phd','bool':false},{'name':'auth_metacompass','bool':false},{'name':'view_metacompass','bool':false},{'name':'use_central_faust','bool':true}]}]}";
        LibraryRulesResponse libraryRulesResponse = O.readValue(content.replaceAll("'", "\""), LibraryRulesResponse.class);
        VipCoreLibraryRule libraryRule = new VipCoreLibraryRule(libraryRulesResponse);

        assertThat(libraryRule.isPartOfBibdk(), is(false));
        assertThat(libraryRule.usesHoldingsItem(), is(true));
        assertThat(libraryRule.isFbsLibrary(), is(true));
        assertThat(libraryRule.isResearchLibrary(), is(false));
    }

}
