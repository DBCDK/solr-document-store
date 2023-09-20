package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.v2.QueueBeanV2;
import java.util.Set;
import jakarta.ws.rs.core.Response;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class QueueBeanTest extends BeanTester {

    @Test(timeout = 2_000L)
    public void testQueueManifestation() throws Exception {
        System.out.println("testQueueManifestation");

        persist(Doc.bibliographic(777777, "12345678").unit("unit:8").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "23456789").unit("unit:12").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "87654321").deleted());
        stdQueueRules();

        bean(bf -> {
            QueueBeanV2 bean = bf.queueBeanV2();
            Response resp = bean.queueManifestation(777777, "katalog", "12345678", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-katalog:12345678",
                   "e,work:4"));
    }

    @Test(timeout = 2_000L)
    public void testQueueDeletedManifestation() throws Exception {
        System.out.println("testQueueDeletedManifestation");

        persist(Doc.bibliographic(777777, "12345678").unit("unit:8").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "23456789").unit("unit:12").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "87654321").deleted());
        stdQueueRules();

        bean(bf -> {
            QueueBeanV2 bean = bf.queueBeanV2();
            Response resp = bean.queueManifestation(777777, "katalog", "87654321", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-katalog:87654321"));
    }

    @Test(timeout = 2_000L)
    public void testQueueUnknownManifestation() throws Exception {
        System.out.println("testQueueUnknownManifestation");

        persist(Doc.bibliographic(777777, "12345678").unit("unit:8").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "23456789").unit("unit:12").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "87654321").deleted());
        stdQueueRules();

        bean(bf -> {
            QueueBeanV2 bean = bf.queueBeanV2();
            Response resp = bean.queueManifestation(777777, "katalog", "not-found", null);
            assertThat(resp.getStatus(), is(404));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, empty());
    }

    @Test(timeout = 2_000L)
    public void testQueueWork() throws Exception {
        System.out.println("testQueueWork");

        persist(Doc.bibliographic(777777, "12345678").unit("unit:8").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "23456789").unit("unit:12").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "87654321").deleted());
        stdQueueRules();

        bean(bf -> {
            QueueBeanV2 bean = bf.queueBeanV2();
            Response resp =
                    bean.queueWork("work:4", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-katalog:12345678",
                   "e,777777-katalog:23456789",
                   "e,work:4"));
    }

    @Test(timeout = 2_000L)
    public void testQueueUnknownWork() throws Exception {
        System.out.println("testQueueUnknownWork");

        persist(Doc.bibliographic(777777, "12345678").unit("unit:8").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "23456789").unit("unit:12").work("work:4").indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(777777, "87654321").deleted());
        stdQueueRules();

        bean(bf -> {
            QueueBeanV2 bean = bf.queueBeanV2();
            Response resp = bean.queueWork("not-found", null);
            assertThat(resp.getStatus(), is(404));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, empty());
    }
}
