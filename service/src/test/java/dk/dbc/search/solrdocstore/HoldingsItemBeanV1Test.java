package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemBeanV1Test extends BeanTester {

    @Test(timeout = 2_000L)
    public void testEnqueueNewChangeAndDelete() throws Exception {
        System.out.println("testEnqueueNewChangeAndDelete");

        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(710100, LibraryType.FBS, true, false, false),
                Doc.bibliographic("25912233").indexKeys(filler -> filler.add("id", "25912233")),
                new QueueRuleEntity("a", QueueType.HOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNITHOLDING, 0),
                new QueueRuleEntity("c", QueueType.WORKHOLDING, 0));

        queueContentAndClear();

        bean(bf -> {
            String json = Doc.indexKeysRequest(filler -> filler
                    .addHolding(b -> b
                            .itemId("a")
                            .status("Online"))
                    .addHolding(b -> b.itemId("b", "c")
                            .status("OnShelf")));
            bf.holdingsItemBeanV1()
                    .putHoldings(json, 710100, "25912233", "t1");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1"));

        // Change (online -> gone, shelf->loan
        bean(bf -> {
            String json = Doc.indexKeysRequest(filler -> filler
                    .addHolding(b -> b.itemId("b", "c")
                            .status("OnLoan")));
            bf.holdingsItemBeanV1()
                    .putHoldings(json, 710100, "25912233", "t2");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1"));
        // Delete
        bean(bf -> {
            bf.holdingsItemBeanV1()
                    .deleteHoldings(710100, "25912233", "x");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1"));
    }
}
