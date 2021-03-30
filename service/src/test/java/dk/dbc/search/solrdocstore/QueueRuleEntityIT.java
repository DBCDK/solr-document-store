package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.QueueRuleKey;
import java.util.EnumSet;
import org.junit.Test;

import javax.persistence.EntityManager;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class QueueRuleEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void storeAndLoadEntity() {
        System.out.println("storeAndLoadEntity");
        EntityManager em = env().getEntityManager();
        EnumSet.allOf(QueueType.class).forEach(type -> {
            System.out.println(" - testing: " + type);

            env().getPersistenceContext().run(() -> {
                em.persist(new QueueRuleEntity("foo", type, -456));
            });

            env().clearEntityManagerCache();

            QueueRuleEntity qr = env().getPersistenceContext()
                    .run(() -> em.find(QueueRuleEntity.class, new QueueRuleKey("foo", type)));

            assertThat(qr.getQueue(), is("foo"));
            assertThat(qr.getSupplier(), is(type));
            assertThat(qr.getPostpone(), is(-456));

            env().getPersistenceContext()
                    .run(() -> em.remove(em.find(QueueRuleEntity.class, new QueueRuleKey("foo", type))));
        });
    }
}
