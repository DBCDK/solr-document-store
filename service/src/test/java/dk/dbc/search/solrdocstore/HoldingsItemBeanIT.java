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
import static dk.dbc.search.solrdocstore.HoldingItemIndexKeys.indexKeysList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class HoldingsItemBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void testEnqueueNewChangeAndDelete() throws Exception {
        System.out.println("testEnqueueNewChangeAndDelete");

        jpa(em -> {
            BibliographicBean bib = createBibliographicBean(em, null);
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });
        queueContentAndClear();
        jpa(em -> {
            holdingsItemBeanWithAllRules(em)
                    .putHoldings(indexKeysList(710100, "25912233")
                            .add(b -> b
                                    .itemId("a")
                                    .status("Online"))
                            .add(b -> b.itemId("b", "c")
                                    .status("OnShelf"))
                            .json(), 710100, "25912233", "x");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1",
                   "d,870970-basis:25912233", "e,unit:1", "f,work:1",
                   "g,870970-basis:25912233", "h,unit:1", "i,work:1"));

        // Major change (online -> gone, shelf->loan
        jpa(em -> {
            holdingsItemBeanWithAllRules(em)
                    .putHoldings(indexKeysList(710100, "25912233")
                            .add(b -> b.itemId("b", "c")
                                    .status("OnLoan"))
                            .json(), 710100, "25912233", "x");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1",
                   "d,870970-basis:25912233", "e,unit:1", "f,work:1"));


        // Minor Change (all still on loan)
        jpa(em -> {
            holdingsItemBeanWithAllRules(em)
                    .putHoldings(indexKeysList(710100, "25912233")
                            .add(b -> b.itemId("b")
                                    .status("OnLoan"))
                            .json(), 710100, "25912233", "x");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1"));

        // Major & first/last
        jpa(em -> {
            holdingsItemBeanWithAllRules(em)
                    .deleteHoldings(710100, "25912233", "x");
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", "b,unit:1", "c,work:1",
                   "d,870970-basis:25912233", "e,unit:1", "f,work:1",
                   "g,870970-basis:25912233", "h,unit:1", "i,work:1"));

    }

    @Test(timeout = 2_000L)
    public void enqueueWhenHoldingsItemSet() throws Exception {
        System.out.println("enqueueWhenHoldingsItemSet");
        jpa(em -> {
            BibliographicBean bib = createBibliographicBean(em, null);

            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });
        assertThat(queueRemovePostponed(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", // Not postponed
                   "b,unit:1",
                   "c,work:1"));

        jpa(em -> {
            HoldingsItemBean holWithoutDelay = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.HOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNIT, 0),
                    new QueueRuleEntity("c", QueueType.WORK, 0));
            holWithoutDelay.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueRemovePostponed(), empty());
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233", // Not postponed
                   "b,unit:1",
                   "c,work:1"));

        jpa(em -> {
            HoldingsItemBean holWithDelay = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.HOLDING, 100_000),
                    new QueueRuleEntity("b", QueueType.UNIT, 0),
                    new QueueRuleEntity("c", QueueType.WORK, 0));
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

        jpa(em -> {
            BibliographicBean bib = createBibliographicBean(em, null);

            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to live holdings
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233",
                   "b,unit:1",
                   "c,work:1"));

        jpa(em -> {
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");

            HoldingsToBibliographicEntity entity = em.find(HoldingsToBibliographicEntity.class, key);
            assertThat(entity, notNullValue());
        });

        // From live holdings to live holdings
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-a"));
        });
        assertThat(queueContentAndClear(), empty());

        // From live holdings to no holdings
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:25912233",
                   "b,unit:1",
                   "c,work:1"));

        // Check that no h2b relation exists when no live holdings are present
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");
            HoldingsToBibliographicEntity entity = em.find(HoldingsToBibliographicEntity.class, key);
            assertThat(entity, nullValue());
        });

        jpa(em -> {
            AgencyItemKey key = new AgencyItemKey(710100, "25912233");
            HoldingsItemEntity hi = em.find(HoldingsItemEntity.class, key);
            assertThat(hi, nullValue());
        });
    }

    @Test(timeout = 2_000L)
    public void testFirstLastNoneToNone() throws Exception {
        System.out.println("testFirstLastNoneToNone");

        jpa(em -> {
            BibliographicBean bib = createBibliographicBean(em, null);
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to no holdings
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), empty());

        // Check that no h2b relation exists when no live holdings are present
        jpa(em -> {
            HoldingsToBibliographicKey key = new HoldingsToBibliographicKey(710100, "25912233");
            HoldingsToBibliographicEntity htob = em.find(HoldingsToBibliographicEntity.class, key);
            assertThat(htob, nullValue());
        });

        // and no holdings
        jpa(em -> {
            AgencyItemKey key = new AgencyItemKey(710100, "25912233");
            HoldingsItemEntity hi = em.find(HoldingsItemEntity.class, key);
            assertThat(hi, nullValue());
        });

        // From no holdings to no holdings
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("a", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("b", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("c", QueueType.WORKFIRSTLASTHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-d"));
        });
        assertThat(queueContentAndClear(), empty());
    }

    @Test(timeout = 2_000L)
    public void testMajorHoldingsChange() throws Exception {
        System.out.println("testMajorHoldingsChange");

        jpa(em -> {
            BibliographicBean bib = createBibliographicBean(em, null);
            bib.addBibliographicKeys(true, jsonRequestBibl("870970-25912233", Instant.now()));
        });

        queueContentAndClear();

        // From non existing to OnShelf
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("fm", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("fu", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("fw", QueueType.WORKFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("mm", QueueType.MAJORHOLDING, 0),
                    new QueueRuleEntity("mu", QueueType.UNITMAJORHOLDING, 0),
                    new QueueRuleEntity("mw", QueueType.WORKMAJORHOLDING, 0));
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
        jpa(em -> {
            HoldingsItemBean hol = holdingsItemBeanWithRules(
                    em,
                    new QueueRuleEntity("fm", QueueType.FIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("fu", QueueType.UNITFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("fw", QueueType.WORKFIRSTLASTHOLDING, 0),
                    new QueueRuleEntity("mm", QueueType.MAJORHOLDING, 0),
                    new QueueRuleEntity("mu", QueueType.UNITMAJORHOLDING, 0),
                    new QueueRuleEntity("mw", QueueType.WORKMAJORHOLDING, 0));
            hol.setHoldingsKeys(jsonRequestHold("710100-25912233-b"));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "mm,870970-basis:25912233",
                   "mu,unit:1",
                   "mw,work:1"));
    }

    private static HoldingsItemBean holdingsItemBeanWithRules(EntityManager em, QueueRuleEntity... rules) {
        HoldingsItemBean hol = createHoldingsItemBean(em);
        hol.enqueueSupplier = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(rules);
            }
        };
        hol.enqueueSupplier.entityManager = em;
        hol.brBean = createBibliographicRetrieveBean(em);
        return hol;
    }

    private HoldingsItemBean holdingsItemBeanWithAllRules(EntityManager em) {
        return holdingsItemBeanWithRules(
                em,
                new QueueRuleEntity("a", QueueType.HOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNIT, 0),
                new QueueRuleEntity("c", QueueType.WORK, 0),
                new QueueRuleEntity("d", QueueType.MAJORHOLDING, 0),
                new QueueRuleEntity("e", QueueType.UNITMAJORHOLDING, 0),
                new QueueRuleEntity("f", QueueType.WORKMAJORHOLDING, 0),
                new QueueRuleEntity("g", QueueType.FIRSTLASTHOLDING, 0),
                new QueueRuleEntity("h", QueueType.UNITFIRSTLASTHOLDING, 0),
                new QueueRuleEntity("i", QueueType.WORKFIRSTLASTHOLDING, 0));
    }
}
