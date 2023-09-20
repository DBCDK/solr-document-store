package dk.dbc.search.solrdocstore;

import dk.dbc.holdingsitemsdocuments.bindings.HoldingsItemsDocuments;
import dk.dbc.search.solrdocstore.jpa.AgencyItemKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import jakarta.ws.rs.NotFoundException;
import java.time.Instant;
import org.junit.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThrows;

public class HoldingsItemBeanTest extends BeanTester {

    @Test(timeout = 2_000L)
    public void testCase() {

        persist(new OpenAgencyEntity(LibraryType.COMMON_AGENCY, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false));
        stdQueueRules();

        bean(bf -> {
            assertThrows(NotFoundException.class, () -> {
                     bf.holdingsItemBeanV2().getHoldings(700000, "25912233");
                 });
        }
        );
        assertThat(queueContentAndClear(), empty());

        bean(bf -> {
            bf.bibliographicBeanV2()
                    .addBibliographicKeys(
                            Doc.bibliographic("25912233")
                                    .indexKeys(filler -> filler.add("id", "i-d"))
                                    .build(),
                            false);
        });
        assertThat(queueContentAndClear(), not(empty()));

        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("x").status("OnShelf"))
                            .modified(Instant.parse("2020-01-01T12:34:56Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        // Same data nothing queued
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("x").status("OnShelf"))
                            .modified(Instant.parse("2020-01-01T12:34:56Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Updated data from same time stamp
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("x", "y").status("OnShelf", "OnLoan"))
                            .modified(Instant.parse("2020-01-01T12:34:56Z"))
                            .build(),
                    700000, "25912233");
        });

        assertThat(queueContentAndClear(), not(empty()));

        // Older nothing queued
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("y").status("OnLoan"))
                            .modified(Instant.parse("2020-01-01T00:00:00Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Younger with new data is queued
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("z").status("OnOrder"))
                            .modified(Instant.parse("2022-12-12T12:12:12Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        // Even younger with same content nothing is queued
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("z").status("OnOrder"))
                            .modified(Instant.parse("2022-12-31T23:59:59Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), empty());

        // Removed holdings
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .modified(Instant.parse("2023-01-01T00:00:00Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        jpa(em -> {
            assertThat(em.find(HoldingsItemEntity.class, new AgencyItemKey(700000, "25912233")), nullValue());
        });

        // Resurrected holdings
        bean(bf -> {
            bf.holdingsItemBeanV2().putHoldings(
                    Doc.holdingsItem(700000, "25912233")
                            .addHolding(filler -> filler.itemId("z").status("Discarded"))
                            .modified(Instant.parse("2023-01-02T00:00:00Z"))
                            .build(),
                    700000, "25912233");
        });
        assertThat(queueContentAndClear(), not(empty()));

        bean(bf -> {
            HoldingsItemsDocuments doc = bf.holdingsItemBeanV2().getHoldings(700000, "25912233");
            assertThat(doc, notNullValue());
        });
    }
}
