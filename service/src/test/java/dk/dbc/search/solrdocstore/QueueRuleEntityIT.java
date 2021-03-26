package dk.dbc.search.solrdocstore;

import org.junit.Test;

import javax.persistence.EntityManager;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class QueueRuleEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void StoreEntity() {
        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {
            em.persist(new QueueRuleEntity("foo", "cat", -456));
        });

        QueueRuleEntity qr = env().getPersistenceContext()
                .run(() -> em.find(QueueRuleEntity.class, new QueueRuleKey("foo", "cat")));

        assertThat(qr.getQueue(), is("foo"));
        assertThat(qr.getSupplier(), is("cat"));
        assertThat(qr.getPostpone(), is(-456));
    }

    @Test
    public void LoadEntity() {
        executeScriptResource("/queueEntityTestData.sql");
        EntityManager em = env().getEntityManager();

        QueueRuleEntity qr = env().getPersistenceContext()
                .run(() -> em.find(QueueRuleEntity.class, new QueueRuleKey("bar", "horse")));

        assertThat(qr.getQueue(), is("bar"));
        assertThat(qr.getSupplier(), is("horse"));
        assertThat(qr.getPostpone(), is(1));
    }
}
