package dk.dbc.search.solrdocstore;

import org.junit.Test;
import dk.dbc.search.solrdocstore.response.ExistsResponse;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ExistenceBeanTest extends BeanTester {

    @Test(timeout = 2_000L)
    public void testBibliographicNonExisting() throws Exception {
        System.out.println("testBibliographicNonExisting");
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .bibliographicExists(870970, "clazzifier", "12345678");
            assertThat(existence.exists, is(false));
        });
    }

    @Test(timeout = 2_000L)
    public void testBibliographicExisting() throws Exception {
        System.out.println("testBibliographicExisting");
        persist(Doc.bibliographic("12345678")
                .indexKeys(filler -> filler.add("id", "1"))
                .build());
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .bibliographicExists(870970, "basis", "12345678");
            assertThat(existence.exists, is(true));
        });
    }

    @Test(timeout = 2_000L)
    public void testBibliographicDeleted() throws Exception {
        System.out.println("testBibliographicDeleted");
        persist(Doc.bibliographic("12345678")
                .deleted()
                .build());
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .bibliographicExists(870970, "basis", "12345678");
            assertThat(existence.exists, is(false));
        });
    }

    @Test(timeout = 2_000L)
    public void testHoldingsNonExisting() throws Exception {
        System.out.println("testHoldingsNonExisting");
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .holdingExists(777777, "12345678");
            assertThat(existence.exists, is(false));
        });
    }

    @Test(timeout = 2_000L)
    public void testHoldingsExisting() throws Exception {
        System.out.println("testHoldingsExisting");
        persist(Doc.holdingsItem(777777, "12345678")
                .addHolding(filler -> filler
                        .itemId("x")
                        .status("OnShelf"))
                .entity());

        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .holdingExists(777777, "12345678");
            assertThat(existence.exists, is(true));
        });
    }
}
