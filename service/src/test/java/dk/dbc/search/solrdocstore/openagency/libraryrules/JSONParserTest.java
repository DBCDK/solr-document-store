package dk.dbc.search.solrdocstore.openagency.libraryrules;

import org.junit.Before;
import org.junit.Test;

public class JSONParserTest {

    JSONParser theParser;


    @Before
    public void init(){
        theParser = new JSONParser();
    }


    @Test
    public void testParse(){
        //String input = {"libraryRulesResponse":{"libraryRules":[{"agencyId":{"$":"133020","@":"oa"},"agencyType":{"$":"Skolebibliotek","@":"oa"},"libraryRule":[{"name":{"$":"create_enrichments","@":"oa"},"bool":{"$":"1","@":"oa"},"@":"oa"},{"name":{"$":"use_enrichments","@":"oa"},"bool":{"$":"1","@":"oa"},"@":"oa"},{"name":{"$":"auth_root","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_common_subjects","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_common_notes","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_dbc_records","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_public_lib_common_record","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_ret_record","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_agency_common_record","@":"oa"},"bool":{"$":"1","@":"oa"},"@":"oa"},{"name":{"$":"auth_export_holdings","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"use_localdata_stream","@":"oa"},"bool":{"$":"1","@":"oa"},"@":"oa"},{"name":{"$":"use_holdings_item","@":"oa"},"bool":{"$":"1","@":"oa"},"@":"oa"},{"name":{"$":"part_of_bibliotek_dk","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_create_common_record","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"ims_library","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"cataloging_template_set","@":"oa"},"string":{"$":"fbs","@":"oa"},"@":"oa"},{"name":{"$":"worldcat_synchronize","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"worldcat_resource_sharing","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"part_of_danbib","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"},{"name":{"$":"auth_add_dk5_to_phd","@":"oa"},"bool":{"$":"0","@":"oa"},"@":"oa"}],"@":"oa"}],"@":"oa"},"@namespaces":{"oa":"http:\/\/oss.dbc.dk\/ns\/openagency"}}
    }
}
