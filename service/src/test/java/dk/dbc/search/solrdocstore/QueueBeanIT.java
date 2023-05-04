/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-service
 *
 * solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import java.util.Set;
import jakarta.ws.rs.core.Response;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createQueueBean;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class QueueBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Before
    public void setupItems() {
        jpa(em -> {
            em.persist(new BibliographicEntity(777777, "clazzifier", "12345678", "777777-clazzifier:12345678", "work:4", "unit:8", false, new IndexKeys(), "track-me"));
            em.persist(new BibliographicEntity(777777, "clazzifier", "23456789", "777777-clazzifier:23456789", "work:4", "unit:12", false, new IndexKeys(), "track-me"));
            em.persist(new BibliographicEntity(777777, "clazzifier", "87654321", "777777-clazzifier:87654321", null, null, true, new IndexKeys(), "track-me"));
        });
    }

    @Test(timeout = 2_000L)
    public void testQueueManifestation() throws Exception {
        System.out.println("testQueueManifestation");

        jpa(em -> {
            QueueBean bean = createQueueBean(em);
            Response resp = bean.queueManifestation(777777, "clazzifier", "12345678", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-clazzifier:12345678",
                   "e,work:4"));
    }

    @Test(timeout = 2_000L)
    public void testQueueDeletedManifestation() throws Exception {
        System.out.println("testQueueDeletedManifestation");

        jpa(em -> {
            QueueBean bean = createQueueBean(em);
            Response resp = bean.queueManifestation(777777, "clazzifier", "87654321", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-clazzifier:87654321"));
    }

    @Test(timeout = 2_000L)
    public void testQueueUnknownManifestation() throws Exception {
        System.out.println("testQueueUnknownManifestation");

        jpa(em -> {
            QueueBean bean = createQueueBean(em);
            Response resp = bean.queueManifestation(777777, "clazzifier", "not-found", null);
            assertThat(resp.getStatus(), is(404));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, empty());
    }

    @Test(timeout = 2_000L)
    public void testQueueWork() throws Exception {
        System.out.println("testQueueWork");

        jpa(em -> {
            QueueBean bean = createQueueBean(em);
            Response resp =
                    bean.queueWork("work:4", null);
            assertThat(resp.getStatus(), is(200));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, containsInAnyOrder(
                   "e,777777-clazzifier:12345678",
                   "e,777777-clazzifier:23456789",
                   "e,work:4"));
    }

    @Test(timeout = 2_000L)
    public void testQueueUnknownWork() throws Exception {
        System.out.println("testQueueUnknownWork");

        jpa(em -> {
            QueueBean bean = createQueueBean(em);
            Response resp = bean.queueWork("not-found", null);
            assertThat(resp.getStatus(), is(404));
        });

        Set<String> queued = queueContentAndClear();
        assertThat(queued, empty());
    }
}
