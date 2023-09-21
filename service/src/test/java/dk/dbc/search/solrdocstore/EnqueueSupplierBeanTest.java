package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueSupplierBeanTest extends BeanTester {

    @Test(timeout = 2_000L)
    public void testEnqueueAddsTotTables() throws Exception {
        System.out.println("testEnqueueAddsTotTables");

        persist(new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                new QueueRuleEntity("b", QueueType.MANIFESTATION, 5),
                new QueueRuleEntity("c", QueueType.HOLDING, 0),
                new QueueRuleEntity("d", QueueType.HOLDING, 20),
                new QueueRuleEntity("g", QueueType.WORK, 0),
                new QueueRuleEntity("h", QueueType.WORK, 100),
                new QueueRuleEntity("k", QueueType.UNIT, 0),
                new QueueRuleEntity("l", QueueType.UNIT, 100));

        bean(bf -> {
            try (EnqueueCollector collector = bf.enqueueSupplierBean().getEnqueueCollector()) {
                collector.add(Doc.bibliographic(123456, "87654321").work("work:2").unit("unit:0").indexKeys(filler -> filler.add("id", "87654321")).build(),
                              QueueType.WORK, QueueType.UNIT, QueueType.MANIFESTATION);
            }
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,123456-katalog:87654321",
                   "b,123456-katalog:87654321",
                   "g,work:2",
                   "h,work:2",
                   "k,unit:0",
                   "l,unit:0"));
    }
}
