package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class DocumentRetrieveResponseTest {

    private static final ObjectMapper O = new ObjectMapper();

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testCase() throws Exception {
        System.out.println("testCase");

        List<HoldingsItemEntity> holdingsItemRecords = List.of(
                Doc.holdingsItem(0, "a")
                        .addHolding(filler -> filler.status("online"))
                        .addHolding(filler -> filler.status("onshelf").itemId("a1", "a2", "a3"))
                        .entity(),
                Doc.holdingsItem(0, "b")
                        .addHolding(filler -> filler.status("onshelf").itemId("b1", "b2"))
                        .addHolding(filler -> filler.status("onshelf").itemId("c1", "c2"))
                        .addHolding(filler -> filler.status("onloan").itemId("d1"))
                        .entity()
        );

        DocumentRetrieveResponse resp = new DocumentRetrieveResponse(null, holdingsItemRecords, null, null);
        System.out.println("resp.totalStatusCount = " + resp.totalStatusCount);

        assertThat(resp.totalStatusCount, is(Map.of("onshelf", 7,
                                                    "online", 1,
                                                    "onloan", 1)));
    }
}
