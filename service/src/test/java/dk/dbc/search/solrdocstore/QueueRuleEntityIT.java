package dk.dbc.search.solrdocstore;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Test;

import javax.persistence.EntityManager;

public class QueueRuleEntityIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void StoreEntity() {
        EntityManager em = env().getEntityManager();
        env().getPersistenceContext().run(() -> {
            QueueRuleEntity qr = new QueueRuleEntity();
            qr.queue = "foo";
            em.persist(qr);
        });

        QueueRuleEntity qr = env().getPersistenceContext()
                .run(() -> em.find(QueueRuleEntity.class, "foo"));

        assertThat(qr.queue, is("foo"));
    }

    @Test
    public void LoadEntity() {
        executeScriptResource("/queueEntityTestData.sql");
        EntityManager em = env().getEntityManager();

        QueueRuleEntity qr = env().getPersistenceContext()
                .run(() -> em.find(QueueRuleEntity.class, "bar"));

        assertThat(qr.queue, is("bar"));
    }
}
