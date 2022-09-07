package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.QueueRuleKey;
import java.util.EnumSet;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class QueueRuleEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeAndLoadEntity() {
        System.out.println("storeAndLoadEntity");
        EnumSet.allOf(QueueType.class).forEach(type -> {
            System.out.println(" - testing: " + type);

            jpa(em -> {
                em.persist(new QueueRuleEntity("foo", type, -456));
            });

            jpa(em -> {
                QueueRuleEntity qr = em.find(QueueRuleEntity.class, new QueueRuleKey("foo", type));

                assertThat(qr.getQueue(), is("foo"));
                assertThat(qr.getSupplier(), is(type));
                assertThat(qr.getPostpone(), is(-456));
            });

            jpa(em -> {
                em.remove(em.find(QueueRuleEntity.class, new QueueRuleKey("foo", type)));
            });
        });
    }
}
