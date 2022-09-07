package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.AgencyItemFieldKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import java.util.Arrays;
import java.util.Collection;
import java.util.Set;
import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ResourceBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final Logger log = LoggerFactory.getLogger(ResourceBeanIT.class);

    @Test(timeout = 2_000L)
    public void testAddResource() throws Exception {
        System.out.println("testAddResource");

        Set<String> queue;

        queueContentAndClear();
        jpa(em -> {
            em.merge(new BibliographicEntity(870970, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new BibliographicEntity(710100, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new OpenAgencyEntity(870970, LibraryType.FBS, false, false, false));
            em.merge(new OpenAgencyEntity(710100, LibraryType.FBS, true, true, true));
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.addResource("{\"agencyId\":870970,\"bibliographicRecordId\":\"25912233\",\"field\":\"hasCoverUrl\",\"value\":true}");
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));
        jpa(em -> {
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, notNullValue());
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.addResource("{\"agencyId\":870970,\"bibliographicRecordId\":\"25912233\",\"field\":\"hasCoverUrl\",\"value\":false}");
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));
        jpa(em -> {
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, nullValue());
        });
    }

    @Test(timeout = 2_000L)
    public void testPutResource() throws Exception {
        System.out.println("testPutResource");
        Set<String> queue;

        queueContentAndClear();
        jpa(em -> {
            em.merge(new BibliographicEntity(870970, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new BibliographicEntity(710100, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new OpenAgencyEntity(870970, LibraryType.FBS, false, false, false));
            em.merge(new OpenAgencyEntity(710100, LibraryType.FBS, true, true, true));
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.putResource("{\"has\":true}", "hasCoverUrl", 870970, "25912233", null);
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));
        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, notNullValue());
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.putResource("{\"has\":false}", "hasCoverUrl", 870970, "25912233", null);
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));
        jpa(em -> {
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, nullValue());
        });
    }

    @Test(timeout = 2_000L)
    public void testDeleteResource() throws Exception {
        System.out.println("testPutResource");
        Set<String> queue;

        queueContentAndClear();
        jpa(em -> {
            em.merge(new BibliographicEntity(870970, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new BibliographicEntity(710100, "clazzifier", "25912233", "id#1", "work:update", "unit:update", false, new IndexKeys(), "track:update"));
            em.merge(new OpenAgencyEntity(870970, LibraryType.FBS, false, false, false));
            em.merge(new OpenAgencyEntity(710100, LibraryType.FBS, true, true, true));
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.putResource("{\"has\":true}", "hasCoverUrl", 870970, "25912233", null);
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));
        jpa(em -> {
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, notNullValue());
        });

        jpa(em -> {
            ResourceBean bean = mockResourceBean(em);
            Response r = bean.deleteResource("hasCoverUrl", 870970, "25912233", null);
            assertThat(r.getStatus(), is(200));
        });
        queue = queueContentAndClear();
        assertThat(queue, containsInAnyOrder("w,work:update",
                                             "u,unit:update",
                                             "m,710100-clazzifier:25912233",
                                             "m,870970-clazzifier:25912233"));

        jpa(em -> {
            BibliographicResourceEntity entity = em.find(BibliographicResourceEntity.class,
                                                         new AgencyItemFieldKey(870970, "25912233", "hasCoverUrl"));
            assertThat(entity, nullValue());
        });
    }

    private ResourceBean mockResourceBean(EntityManager em) {
        ResourceBean bean = createResourceBean(em);
        bean.enqueueSupplier = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(
                        new QueueRuleEntity("m", QueueType.RESOURCE, 0),
                        new QueueRuleEntity("u", QueueType.UNITRESOURCE, 0),
                        new QueueRuleEntity("w", QueueType.WORKRESOURCE, 0)
                );
            }
        };
        bean.enqueueSupplier.entityManager = em;
        return bean;
    }

}
