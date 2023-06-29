package dk.dbc.search.solrdocstore;

import dk.dbc.holdingsitemsdocuments.bindings.HoldingsItemsDocuments;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v2.HoldingsItemBeanV2;
import jakarta.ws.rs.NotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThrows;

public class HoldingsItemBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void testCase() throws Exception {
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            assertThrows(NotFoundException.class, () -> {
                     bean.getHoldings(700000, "25912233");
                 });
        });
        assertThat(queueContentAndClear(), empty());

        jpa(em -> {
            BibliographicBeanV2 bean = BeanFactoryUtil.createBibliographicBean(em, new Config());
            bean.addBibliographicKeys(
                    new BibliographicEntity(870970, "basis", "25912233",
                                            "870970-basis:25912233", "work:1", "unit:1",
                                            false, IndexKeys.from(Map.of("id", List.of("i-d"))),
                                            "track"), false);
        });
        assertThat(queueContentAndClear(), not(empty()));

        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2020-01-01T12:34:56Z"))
                    .withDocuments(List.of(Map.of("v", List.of("1")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        // Same nothing queued
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2020-01-01T12:34:56Z"))
                    .withDocuments(List.of(Map.of("v", List.of("1")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Older nothing queued
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2020-01-01T00:00:00Z"))
                    .withDocuments(List.of(Map.of("v", List.of("2")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Younger queued
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2022-12-12T12:12:12Z"))
                    .withDocuments(List.of(Map.of("v", List.of("2")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        // Even younger with same content nothing is queued (this wont happen when modified is part of the documents
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2022-12-31T23:59:59Z"))
                    .withDocuments(List.of(Map.of("v", List.of("2")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Removed holdings
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2023-01-01T00:00:00Z"))
                    .withDocuments(List.of()),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        // Resurrected holdings
        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            bean.putHoldings(new HoldingsItemsDocuments()
                    .withAgencyId(700000)
                    .withBibliographicRecordId("25912233")
                    .withModified(Instant.parse("2023-01-02T00:00:00Z"))
                    .withDocuments(List.of(Map.of("v", List.of("3")))),
                             700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        jpa(em -> {
            HoldingsItemBeanV2 bean = BeanFactoryUtil.createHoldingsItemBean(em);
            assertThat(bean.getHoldings(700000, "25912233"), notNullValue());
        });
    }
}
