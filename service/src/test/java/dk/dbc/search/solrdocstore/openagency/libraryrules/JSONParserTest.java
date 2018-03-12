package dk.dbc.search.solrdocstore.openagency.libraryrules;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Assert;
import org.junit.Test;

public class JSONParserTest {

    @Test
    public void testHelper(){
        String input = "{ \"element\": \"value\", \"another\": \"anotherValue\" } ";
        JsonNode jsonNode = JSONParser.parseJSON(input);
        try {
            JSONParser.getNodeFailIfNull(jsonNode,"wrongElement");
            Assert.fail("Must fail on wrong element");
        } catch (Exception e){  }
    }

    @Test
    public void testFailsOnParseError(){
        try {
            JsonNode jsonNode = JSONParser.parseJSON("not JSON");
            Assert.fail("Should fail on non-JSON input");
        } catch (Exception ignored){
            if (!(ignored instanceof LibraryRuleException)){
                Assert.fail("Does not throw the correct exception");
            }
        }
    }

    @Test
    public void testParseRealInput(){
        LibraryRules result = JSONParser.getLibraryRules(correctInput);
        Assert.assertNotNull(result);
        Assert.assertEquals("Skolebibliotek",result.agencyType);
        Assert.assertNotNull(result.canUseEnrichments);
        Assert.assertTrue(result.canUseEnrichments);
    }

    @Test
    public void testParseRealInputWithoutAgencyType(){
        LibraryRules result = JSONParser.getLibraryRules(correctInputWithoutAgencyType);
        Assert.assertNotNull(result);
        Assert.assertEquals("",result.agencyType);
        Assert.assertNotNull(result.canUseEnrichments);
        Assert.assertTrue(result.canUseEnrichments);
    }

    @Test
    public void testParseTrucatedInput() {
        try {
            LibraryRules result = JSONParser.getLibraryRules(truncatedInput);
            Assert.fail("Should throw exception if incomplete.");
        } catch (LibraryRuleException ignored){}

    }

    String correctInput =
            "{" +
                    "    \"libraryRulesResponse\": {" +
                    "        \"libraryRules\": [" +
                    "            {" +
                    "                \"agencyId\": {" +
                    "                    \"$\": \"133020\"," +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"agencyType\": {" +
                    "                    \"$\": \"Skolebibliotek\"," +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"libraryRule\": [" +
                    "                    {" +
                    "                        \"name\": {" +
                    "                            \"$\": \"create_enrichments\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"bool\": {" +
                    "                            \"$\": \"1\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"@\": \"oa\"" +
                    "                    }," +
                    "                    {" +
                    "                        \"name\": {" +
                    "                            \"$\": \"use_enrichments\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"bool\": {" +
                    "                            \"$\": \"1\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"@\": \"oa\"" +
                    "                    }" +
                    "                ]," +
                    "                \"@\": \"oa\"" +
                    "            }" +
                    "        ]," +
                    "        \"@\": \"oa\"" +
                    "    }," +
                    "    \"@namespaces\": {" +
                    "        \"oa\": \"http://oss.dbc.dk/ns/openagency\"" +
                    "    }" +
                    "}";

    String correctInputWithoutAgencyType =
            "{" +
                    "    \"libraryRulesResponse\": {" +
                    "        \"libraryRules\": [" +
                    "            {" +
                    "                \"agencyId\": {" +
                    "                    \"$\": \"133020\"," +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"agencyType\": {" +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"libraryRule\": [" +
                    "                    {" +
                    "                        \"name\": {" +
                    "                            \"$\": \"create_enrichments\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"bool\": {" +
                    "                            \"$\": \"1\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"@\": \"oa\"" +
                    "                    }," +
                    "                    {" +
                    "                        \"name\": {" +
                    "                            \"$\": \"use_enrichments\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"bool\": {" +
                    "                            \"$\": \"1\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"@\": \"oa\"" +
                    "                    }" +
                    "                ]," +
                    "                \"@\": \"oa\"" +
                    "            }" +
                    "        ]," +
                    "        \"@\": \"oa\"" +
                    "    }," +
                    "    \"@namespaces\": {" +
                    "        \"oa\": \"http://oss.dbc.dk/ns/openagency\"" +
                    "    }" +
                    "}";

    String truncatedInput =
            "{" +
                    "    \"libraryRulesResponse\": {" +
                    "        \"libraryRules\": [" +
                    "            {" +
                    "                \"agencyId\": {" +
                    "                    \"$\": \"133020\"," +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"agencyType\": {" +
                    "                    \"$\": \"Skolebibliotek\"," +
                    "                    \"@\": \"oa\"" +
                    "                }," +
                    "                \"libraryRule\": [" +
                    "                    {" +
                    "                        \"name\": {" +
                    "                            \"$\": \"create_enrichments\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"bool\": {" +
                    "                            \"$\": \"1\"," +
                    "                            \"@\": \"oa\"" +
                    "                        }," +
                    "                        \"@\": \"oa\"" +
                    "                    }," +
                    "                ]," +
                    "                \"@\": \"oa\"" +
                    "            }" +
                    "        ]," +
                    "        \"@\": \"oa\"" +
                    "    }," +
                    "    \"@namespaces\": {" +
                    "        \"oa\": \"http://oss.dbc.dk/ns/openagency\"" +
                    "    }" +
                    "}";

}
