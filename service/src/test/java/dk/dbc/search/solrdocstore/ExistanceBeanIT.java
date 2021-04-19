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
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import java.util.Arrays;
import java.util.Collections;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import response.ExistsResponse;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createExistanceBean;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ExistanceBeanIT extends JpaSolrDocStoreIntegrationTester {

    private EntityManager em;
    private ExistanceBean bean;

    @Before
    public void before() {
        em = env().getEntityManager();
        bean = createExistanceBean(jpaTestEnvironment);
    }

    @Test(timeout = 2_000L)
    public void testBibliographicNonExisting() throws Exception {
        System.out.println("testBibliographicNonExisting");
        ExistsResponse existence = jpa(em -> {
            return bean.bibliographicExists(870970, "clazzifier", "12345678");
        });
        assertThat(existence.exists, is(false));
    }

    @Test(timeout = 2_000L)
    public void testBibliographicExisting() throws Exception {
        System.out.println("testBibliographicExisting");
        ExistsResponse existence = jpa(em -> {
            em.merge(new BibliographicEntity(870970, "clazzifier", "12345678", "repo", "work:1", "unit:1", false, null, "track:1"));
            return bean.bibliographicExists(870970, "clazzifier", "12345678");
        });
        assertThat(existence.exists, is(true));
    }

    @Test(timeout = 2_000L)
    public void testBibliographicDeleted() throws Exception {
        System.out.println("testBibliographicDeleted");
        ExistsResponse existence = jpa(em -> {
            em.merge(new BibliographicEntity(870970, "clazzifier", "12345678", "repo", null, null, true, null, "track:1"));
            return bean.bibliographicExists(870970, "clazzifier", "12345678");
        });
        assertThat(existence.exists, is(false));
    }

    @Test(timeout = 2_000L)
    public void testHoldingsNonExisting() throws Exception {
        System.out.println("testHoldingsNonExisting");
        ExistsResponse existence = jpa(em -> {
            return bean.holdingExists(777777, "12345678");
        });
        assertThat(existence.exists, is(false));
    }

    @Test(timeout = 2_000L)
    public void testHoldingsExisting() throws Exception {
        System.out.println("testHoldingsExisting");
        ExistsResponse existence = jpa(em -> {
            em.merge(new HoldingsItemEntity(777777, "12345678", Arrays.asList(Collections.EMPTY_MAP), "track:1"));
            return bean.holdingExists(777777, "12345678");
        });
        assertThat(existence.exists, is(true));
    }

    @Test(timeout = 2_000L)
    public void testHoldingsNoneAlive() throws Exception {
        System.out.println("testHoldingsNoneAlive");
        ExistsResponse existence = jpa(em -> {
            em.merge(new HoldingsItemEntity(777777, "12345678", Collections.EMPTY_LIST, "track:1"));
            return bean.holdingExists(777777, "12345678");
        });

        assertThat(existence.exists, is(false));
    }
}
