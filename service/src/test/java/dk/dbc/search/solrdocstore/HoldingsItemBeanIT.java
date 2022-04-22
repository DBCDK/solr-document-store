/*
 * Copyright (C) 2020 DBC A/S (http://dbc.dk/)
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

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import javax.persistence.EntityManager;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void enqueueWhenHoldingsItemSet() throws Exception {
        System.out.println("enqueueWhenHoldingsItemSet");
        JpaTestEnvironment env = env();

        BibliographicBean bib = createBibliographicBean(env, null);
        HoldingsItemBean holWithoutDelay = holdingsItemBeanWithRules(
                env,
                new QueueRuleEntity("a", QueueType.HOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNIT, 0),
                new QueueRuleEntity("c", QueueType.WORK, 0));
        HoldingsItemBean holWithDelay = holdingsItemBeanWithRules(
                env,
                new QueueRuleEntity("a", QueueType.HOLDING, 100_000),
                new QueueRuleEntity("b", QueueType.UNIT, 0),
                new QueueRuleEntity("c", QueueType.WORK, 0));

        env().getPersistenceContext().run(() -> {
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });
        assertThat(queueRemovePostponed(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", // Not postponed
                   "b,unit:1",
                   "c,work:1"));

        env().getPersistenceContext().run(() -> {
            holWithoutDelay.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueRemovePostponed(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", // Not postponed
                   "b,unit:1",
                   "c,work:1"));

        env().getPersistenceContext().run(() -> {
            holWithDelay.setHoldingsKeys(jsonRequestHold("710100-25912233-b"));
        });
        assertThat(queueRemovePostponed(), containsInAnyOrder(
                   "a,870970-basis:25912233")); // Postponed
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "b,unit:1", // Not postponed
                   "c,work:1"));
    }

    @Test(timeout = 2_000L)
    public void testFirstLast() throws Exception {
        System.out.println("testFirstLast");

        JpaTestEnvironment env = env();
        EntityManager em = env.getEntityManager();

        BibliographicBean bib = createBibliographicBean(env, null);
        HoldingsItemBean hol = holdingsItemBeanWithRules(
                env,
                new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));

        env().getPersistenceContext().run(() -> {
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to live holdings
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233",
                   "b,unit:1",
                   "c,work:1"));

        HoldingsToBibliographicEntity htobA = env().getPersistenceContext().run(() -> {
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");
            return em.find(HoldingsToBibliographicEntity.class, key);
        });
        assertThat(htobA, notNullValue());

        // From live holdings to live holdings
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueContentAndClear(), empty());

        // From live holdings to no holdings
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233",
                   "b,unit:1",
                   "c,work:1"));

        // Check that no h2b relation exists when no live holdings are present
        HoldingsToBibliographicEntity htobD = env().getPersistenceContext().run(() -> {
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");
            return em.find(HoldingsToBibliographicEntity.class, key);
        });
        assertThat(htobD, nullValue());

        HoldingsItemEntity hi = env().getPersistenceContext().run(() -> {
            AgencyItemKey key = new AgencyItemKey(710100, "25912233");
            return em.find(HoldingsItemEntity.class, key);
        });
        assertThat(hi, nullValue());
    }

    @Test(timeout = 2_000L)
    public void testFirstLastNoneToNone() throws Exception {
        System.out.println("testFirstLastNoneToNone");

        JpaTestEnvironment env = env();
        EntityManager em = env.getEntityManager();

        BibliographicBean bib = createBibliographicBean(env, null);
        HoldingsItemBean hol = holdingsItemBeanWithRules(
                env,
                new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));

        env().getPersistenceContext().run(() -> {
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to no holdings
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), empty());

        // Check that no h2b relation exists when no live holdings are present
        HoldingsToBibliographicEntity htob = env().getPersistenceContext().run(() -> {
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");
            return em.find(HoldingsToBibliographicEntity.class, key);
        });
        assertThat(htob, nullValue());
        // and no holdings
        HoldingsItemEntity hi = env().getPersistenceContext().run(() -> {
            AgencyItemKey key = new AgencyItemKey(710100, "25912233");
            return em.find(HoldingsItemEntity.class, key);
        });
        assertThat(hi, nullValue());

        // From no holdings to no holdings
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), empty());
    }

    @Test(timeout = 2_000L)
    public void testMajorHoldingsChange() throws Exception {
        System.out.println("testMajorHoldingsChange");

        JpaTestEnvironment env = env();

        BibliographicBean bib = createBibliographicBean(env, null);
        HoldingsItemBean hol = holdingsItemBeanWithRules(
                env,
                new QueueRuleEntity("fm", QueueType.FIRSTLASTHOLDING, 0),
                new QueueRuleEntity("fu", QueueType.UNITFIRSTLASTHOLDING, 0),
                new QueueRuleEntity("fw", QueueType.WORKFIRSTLASTHOLDING, 0),
                new QueueRuleEntity("mm", QueueType.MAJORHOLDING, 0),
                new QueueRuleEntity("mu", QueueType.UNITMAJORHOLDING, 0),
                new QueueRuleEntity("mw", QueueType.WORKMAJORHOLDING, 0));

        env().getPersistenceContext().run(() -> {
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to OnShelf
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "fm,870970-basis:25912233",
                   "fu,unit:1",
                   "fw,work:1",
                   "mm,870970-basis:25912233",
                   "mu,unit:1",
                   "mw,work:1"));

        // From OnShelf to OnLoan
        env().getPersistenceContext().run(() -> {
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-b"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "mm,870970-basis:25912233",
                   "mu,unit:1",
                   "mw,work:1"));
    }

    private static HoldingsItemBean holdingsItemBeanWithRules(JpaTestEnvironment env, QueueRuleEntity... rules) {
        HoldingsItemBean hol = createHoldingsItemBean(env);
        hol.enqueueSupplier = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(rules);
            }
        };
        hol.enqueueSupplier.entityManager = env.getEntityManager();
        hol.brBean = createBibliographicRetrieveBean(env);
        return hol;
    }
}
