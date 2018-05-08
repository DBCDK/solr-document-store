package dk.dbc.search.solrdocstore;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.persistence.EntityManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class EnqueueBeanIT extends JpaSolrDocStoreIntegrationTester {

    EnqueueBean bean;
    EntityManager em;

    @Before
    public void setUp() {
        em = env().getEntityManager();
        bean = BeanFactoryUtil.createEnqueueBean(env());
    }

    @After
    public void tearDown() {
    }

    @Test
    public void enqueueNoSuchRecord() throws Exception {
        System.out.println("enqueueNoSuchRecord");

        Set<String> failed = env().getPersistenceContext().run(() -> {
            Object entity = bean.enqueuePids("foo", "870970-basis:23645564").getEntity();
            if (Boolean.TRUE.equals(entity)) {
                return Collections.EMPTY_MAP;
            }
            return (Map<String, String>) entity;
        }).keySet();

        assertThat(failed, contains("870970-basis:23645564"));
    }

    @Test
    public void enqueueInvalidPid() throws Exception {
        System.out.println("enqueueInvalidPid");

        Set<String> failed = env().getPersistenceContext().run(() -> {
            Object entity = bean.enqueuePids("foo", "870970-basis23645564").getEntity();
            if (Boolean.TRUE.equals(entity)) {
                return Collections.EMPTY_MAP;
            }
            return (Map<String, String>) entity;
        }).keySet();

        assertThat(failed, contains("870970-basis23645564"));
    }

    @Test
    public void enqueueSingle() throws Exception {
        System.out.println("enqueueSingle");

        Set<String> failed = env().getPersistenceContext().run(() -> {
            em.persist(new BibliographicEntity(870970, "basis", "23645564", "repo:1", "w:1", "u:1", "UNKNONW", false, Collections.EMPTY_MAP, "t"));
            Object entity = bean.enqueuePids("foo", "870970-basis:23645564").getEntity();

            if (Boolean.TRUE.equals(entity)) {
                return Collections.EMPTY_MAP;
            }
            return (Map<String, String>) entity;
        }).keySet();

        assertThat(failed, empty());
        assertThat(listEnqueued(), containsInAnyOrder("foo:870970-basis:23645564"));
    }

    @Test
    public void enqueueMultiple() throws Exception {
        System.out.println("enqueueMultiple");

        Set<String> failed = env().getPersistenceContext().run(() -> {
            em.persist(new BibliographicEntity(870970, "basis", "23645564", "repo:1", "w:1", "u:1", "UNKNONW", false, Collections.EMPTY_MAP, "t"));
            em.persist(new BibliographicEntity(870970, "basis", "12236455", "repo:1", "w:1", "u:1", "UNKNONW", false, Collections.EMPTY_MAP, "t"));
            Object entity = bean.enqueuePids("foo", " 870970-basis:23645564 870970-basis:12236455 ").getEntity();

            if (Boolean.TRUE.equals(entity)) {
                return Collections.EMPTY_MAP;
            }
            return (Map<String, String>) entity;
        }).keySet();

        assertThat(failed, empty());
        assertThat(listEnqueued(), containsInAnyOrder("foo:870970-basis:23645564",
                                                      "foo:870970-basis:12236455"));
    }

    @Test
    public void enqueueMultipleToDefaultQueues() throws Exception {
        System.out.println("enqueueMultipleToDefaultQueues");

        env().getPersistenceContext().run(() -> {
            em.persist(new BibliographicEntity(870970, "basis", "23645564", "repo:1", "w:1", "u:1", "UNKNONW", false, Collections.EMPTY_MAP, "t"));
            em.persist(new BibliographicEntity(870970, "basis", "12236455", "repo:1", "w:1", "u:1", "UNKNONW", false, Collections.EMPTY_MAP, "t"));
            em.persist(new QueueRuleEntity("foo"));
            em.persist(new QueueRuleEntity("bar"));
        });

        // "Real" enqueue-supplier
        bean.enqueueSupplier = new EnqueueSupplierBean();
        bean.enqueueSupplier.entityManager = em;
        bean.enqueueSupplier.daemon = new QueueRulesDaemon();
        bean.enqueueSupplier.daemon.dataSource = env().getDatasource();
        bean.enqueueSupplier.daemon.readQueueRules();

        Set<String> failed = env().getPersistenceContext().run(() -> {
            Object entity = bean.enqueuePids(" 870970-basis:23645564 870970-basis:12236455 ").getEntity();

            if (Boolean.TRUE.equals(entity)) {
                return Collections.EMPTY_MAP;
            }
            return (Map<String, String>) entity;
        }).keySet();

        assertThat(failed, empty());
        assertThat(listEnqueued(), containsInAnyOrder("foo:870970-basis:23645564",
                                                      "foo:870970-basis:12236455",
                                                      "bar:870970-basis:23645564",
                                                      "bar:870970-basis:12236455"));
    }

    private Set<String> listEnqueued() throws SQLException {
        HashSet<String> set = new HashSet<>();
        try (Connection conn = env().getDatasource().getConnection() ;
             Statement statement = conn.createStatement() ;
             ResultSet resultSet = statement.executeQuery("SELECT consumer || ':' || agencyid || '-' || classifier || ':' || bibliographicrecordid FROM queue")) {
            while (resultSet.next()) {
                set.add(resultSet.getString(1));
            }
        }
        System.out.println("set = " + set);
        return set;
    }
}
