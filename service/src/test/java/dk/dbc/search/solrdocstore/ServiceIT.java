package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import jakarta.ws.rs.core.Response;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ServiceIT extends ServiceTester {

    @Test
    public void testBibliographicAndHoldings() throws Exception {
        System.out.println("testBibliographicAndHoldings");

        post(apiV2("bibliographic"))
                .send(Doc.bibliographic("25912233")
                        .indexKeys("{" +
                                   "'id':'870970-25912233'," +
                                   "'rec.collectionIdentifier':['870970-basis','710100-katalog']" +
                                   "}")
                        .json())
                .statusIs(Response.Status.OK);

        put(apiV2("holdings", "710100-25912233"))
                .send(Doc.holdingsItem(710100, "25912233")
                        .addHolding(filler -> filler.status("OnLoan").itemId("a1", "a2", "a3"))
                        .json())
                .statusIs(Response.Status.OK);

        DocumentRetrieveResponse withHoldings = get(apiV2("retrieve", "combined", "870970-basis:25912233"))
                .as(DocumentRetrieveResponse.class);
        assertThat(withHoldings.bibliographicRecord.getRepositoryId(), is("870970-basis:25912233"));
        assertThat(withHoldings.holdingsItemRecords, notNullValue());
        assertThat(withHoldings.holdingsItemRecords.size(), is(1));

        delete(apiV2("holdings", "710100-25912233"))
                .statusIs(Response.Status.OK);

        DocumentRetrieveResponse withoutHoldings = get(apiV2("retrieve", "combined", "870970-basis:25912233"))
                .as(DocumentRetrieveResponse.class);
        assertThat(withoutHoldings.bibliographicRecord.getRepositoryId(), is("870970-basis:25912233"));
        assertThat(withoutHoldings.holdingsItemRecords, empty());
    }

    @Test
    public void testResources() throws Exception {
        System.out.println("testResources");

        post(apiV2("bibliographic"))
                .send(Doc.bibliographic("38622617")
                        .indexKeys("{" +
                                   "'id':'870970-38622617'," +
                                   "'rec.collectionIdentifier':['870970-basis']" +
                                   "}")
                        .json())
                .statusIs(Response.Status.OK);

        // Test api/v2/resource/hasFBICoverUrl/870970%3A38622617 with and witout escaping
        // @Path("{fieldName}/{agencyId}{separator: :|%3A|%3a}{bibliographicRecordId}")
        put(apiV2("resource", "hasFBICoverUrl", "870970:38622617") ).send("{\"has\":true}").statusIs(Response.Status.OK);
        delete(apiV2("resource", "hasFBICoverUrl", "870970:38622617") ).statusIs(Response.Status.OK);

        put(apiV2("resource", "hasFBICoverUrl", "870970%3A38622617") ).send("{\"has\":true}").statusIs(Response.Status.OK);
        delete(apiV2("resource", "hasFBICoverUrl", "870970%3A38622617") ).statusIs(Response.Status.OK);

        put(apiV2("resource", "hasFBICoverUrl", "870970%3a38622617") ).send("{\"has\":true}").statusIs(Response.Status.OK);
        delete(apiV2("resource", "hasFBICoverUrl", "870970%3a38622617") ).statusIs(Response.Status.OK);
    }
}
