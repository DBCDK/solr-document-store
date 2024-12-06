package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.ExistsResponse;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ExistenceBeanTest extends BeanTester {

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testBibliographicNonExisting() throws Exception {
        System.out.println("testBibliographicNonExisting");
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .bibliographicExists(870970, "clazzifier", "12345678");
            assertThat(existence.exists, is(false));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
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

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
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

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testHoldingsNonExisting() throws Exception {
        System.out.println("testHoldingsNonExisting");
        bean(bf -> {
            ExistsResponse existence = bf.existenceBeanV2()
                    .holdingExists(777777, "12345678");
            assertThat(existence.exists, is(false));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
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
