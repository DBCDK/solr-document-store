package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;

public class DocumentRetrieveBeanTest extends BeanTester {

    private static final String BIB_ID = "12345678";

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void newCommonRecordWithExistingHoldings() throws Exception {
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(300101, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(300102, LibraryType.FBS, true, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "a")),
                Doc.holdingsItem(300101, BIB_ID),
                Doc.holdingsItem(300102, BIB_ID),
                new HoldingsToBibliographicEntity(300101, COMMON_AGENCY, BIB_ID, true),
                new HoldingsToBibliographicEntity(300102, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            DocumentRetrieveResponse doc = bf.documentRetrieveBeanV2()
                    .getDocumentWithHoldingsitems(COMMON_AGENCY, "basis", BIB_ID);
            assertThat(doc.bibliographicRecord.getAgencyId(), is(870970));
            assertThat(doc.bibliographicRecord.getBibliographicRecordId(), is(BIB_ID));
            assertThat(doc.holdingsItemRecords.size(), is(2));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getPartOfDanbibCommon() throws Exception {
        System.out.println("getPartOfDanbibCommon");
        /*
         * 7001* holdings on common
         * 7002* no excludeFromUnionCatalogue
         * 7003* excludeFromUnionCatalogue=false
         * 7004* excludeFromUnionCatalogue=true
         * 700?1? authCreateCommonRecord
         * 700??1 partOfDanbib
         */
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700111, LibraryType.FBS, true, false, true),
                new OpenAgencyEntity(700115, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700151, LibraryType.FBS, false, false, true),
                new OpenAgencyEntity(700155, LibraryType.FBS, false, false, false),
                new OpenAgencyEntity(700211, LibraryType.FBS, true, false, true),
                new OpenAgencyEntity(700215, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700251, LibraryType.FBS, false, false, true),
                new OpenAgencyEntity(700255, LibraryType.FBS, false, false, false),
                new OpenAgencyEntity(700311, LibraryType.FBS, true, false, true),
                new OpenAgencyEntity(700315, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700351, LibraryType.FBS, false, false, true),
                new OpenAgencyEntity(700355, LibraryType.FBS, false, false, false),
                new OpenAgencyEntity(700411, LibraryType.FBS, true, false, true),
                new OpenAgencyEntity(700415, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(700451, LibraryType.FBS, false, false, true),
                new OpenAgencyEntity(700455, LibraryType.FBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "a")),
                Doc.bibliographic(700211, BIB_ID).indexKeys(noExcludeFromUnionCatalogue()),
                Doc.bibliographic(700215, BIB_ID).indexKeys(noExcludeFromUnionCatalogue()),
                Doc.bibliographic(700251, BIB_ID).indexKeys(noExcludeFromUnionCatalogue()),
                Doc.bibliographic(700255, BIB_ID).indexKeys(noExcludeFromUnionCatalogue()),
                Doc.bibliographic(700311, BIB_ID).indexKeys(excludeFromUnionCatalogue(false)),
                Doc.bibliographic(700315, BIB_ID).indexKeys(excludeFromUnionCatalogue(false)),
                Doc.bibliographic(700351, BIB_ID).indexKeys(excludeFromUnionCatalogue(false)),
                Doc.bibliographic(700355, BIB_ID).indexKeys(excludeFromUnionCatalogue(false)),
                Doc.bibliographic(700411, BIB_ID).indexKeys(excludeFromUnionCatalogue(true)),
                Doc.bibliographic(700415, BIB_ID).indexKeys(excludeFromUnionCatalogue(true)),
                Doc.bibliographic(700451, BIB_ID).indexKeys(excludeFromUnionCatalogue(true)),
                Doc.bibliographic(700455, BIB_ID).indexKeys(excludeFromUnionCatalogue(true)),
                Doc.holdingsItem(700111, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700115, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700151, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700155, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700211, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700215, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700251, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700255, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700311, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700315, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700351, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700355, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700411, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700415, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700451, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(700455, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                new HoldingsToBibliographicEntity(700111, COMMON_AGENCY, BIB_ID, true),
                new HoldingsToBibliographicEntity(700115, COMMON_AGENCY, BIB_ID, true),
                new HoldingsToBibliographicEntity(700151, COMMON_AGENCY, BIB_ID, true),
                new HoldingsToBibliographicEntity(700155, COMMON_AGENCY, BIB_ID, true),
                new HoldingsToBibliographicEntity(700211, 700211, BIB_ID, true),
                new HoldingsToBibliographicEntity(700215, 700215, BIB_ID, true),
                new HoldingsToBibliographicEntity(700251, 700251, BIB_ID, true),
                new HoldingsToBibliographicEntity(700255, 700255, BIB_ID, true),
                new HoldingsToBibliographicEntity(700311, 700311, BIB_ID, true),
                new HoldingsToBibliographicEntity(700315, 700315, BIB_ID, true),
                new HoldingsToBibliographicEntity(700351, 700351, BIB_ID, true),
                new HoldingsToBibliographicEntity(700355, 700355, BIB_ID, true),
                new HoldingsToBibliographicEntity(700411, 700411, BIB_ID, true),
                new HoldingsToBibliographicEntity(700415, 700415, BIB_ID, true),
                new HoldingsToBibliographicEntity(700451, 700451, BIB_ID, true),
                new HoldingsToBibliographicEntity(700455, 700455, BIB_ID, true));

        bean(bf -> {
            List<Integer> agencies = bf.documentRetrieveBeanV2()
                    .getPartOfDanbibCommon(BIB_ID);
            System.out.println("agencies = " + agencies);
            assertThat(agencies, containsInAnyOrder(700111, 700115, 700151,
                                                    700211, 700215, 700251,
                                                    700311, 700315, 700351));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getDocumentWithHoldings() throws Exception {
        System.out.println("getDocumentWithHoldings");
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700055, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800055, LibraryType.NonFBS, true, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "a")),
                Doc.holdingsItem(700055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(800055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                new HoldingsToBibliographicEntity(700055, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            DocumentRetrieveResponse doc = bf.documentRetrieveBeanV2()
                    .getDocumentWithHoldingsitems(COMMON_AGENCY, "basis", BIB_ID);
            List<HoldingsItemEntity> holdingsItemRecords = doc.holdingsItemRecords;
            assertThat(holdingsItemRecords.size(), is(1));
            assertThat(holdingsItemRecords.get(0).getAgencyId(), is(700055));
            assertThat(holdingsItemRecords.get(0).getBibliographicRecordId(), is(BIB_ID));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getWorkWithHoldings() throws Exception {
        System.out.println("getWorkWithHoldings");
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700055, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800055, LibraryType.NonFBS, true, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "a")),
                Doc.holdingsItem(700055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(800055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                new HoldingsToBibliographicEntity(700055, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            List<DocumentRetrieveResponse> docs = bf.documentRetrieveBeanV2()
                    .getDocumentsForWork("work:1", true);
            assertThat(docs.size(), is(1));
            List<HoldingsItemEntity> holdingsItemRecords = docs.get(0).holdingsItemRecords;
            assertThat(holdingsItemRecords.size(), is(1));
            assertThat(holdingsItemRecords.get(0).getAgencyId(), is(700055));
            assertThat(holdingsItemRecords.get(0).getBibliographicRecordId(), is(BIB_ID));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void getUnitWithHoldings() throws Exception {
        System.out.println("getUnitWithHoldings");
        persist(OPEN_AGENCY_COMMON_AGNECY,
                new OpenAgencyEntity(700055, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800055, LibraryType.NonFBS, true, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", "a")),
                Doc.holdingsItem(700055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                Doc.holdingsItem(800055, BIB_ID).addHolding(holdingsStatus("OnShelf")),
                new HoldingsToBibliographicEntity(700055, COMMON_AGENCY, BIB_ID, true));

        bean(bf -> {
            List<DocumentRetrieveResponse> docs = bf.documentRetrieveBeanV2()
                    .getDocumentsForUnit("unit:1", true);
            assertThat(docs.size(), is(1));
            List<HoldingsItemEntity> holdingsItemRecords = docs.get(0).holdingsItemRecords;
            assertThat(holdingsItemRecords.size(), is(1));
            assertThat(holdingsItemRecords.get(0).getAgencyId(), is(700055));
            assertThat(holdingsItemRecords.get(0).getBibliographicRecordId(), is(BIB_ID));
        });
    }

    private Consumer<Doc.IndexKeysBuilder> noExcludeFromUnionCatalogue() {
        return filler -> {
        };
    }

    private Consumer<Doc.IndexKeysBuilder> excludeFromUnionCatalogue(boolean value) {
        return filler -> filler.add("rec.excludeFromUnionCatalogue", String.valueOf(value));
    }

    private Consumer<Doc.HoldingsItemsIndexKeys> holdingsStatus(String value) {
        return filler -> filler.status(value);
    }
}
