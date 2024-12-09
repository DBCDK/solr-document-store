package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.FrontendReturnListType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;

import jakarta.ws.rs.core.Response;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.is;

public class BibliographicRecordAPIBeanTest extends BeanTester {

    private static final String BIB_ID = "page-order";
    private static final String REPO_ID = "870970-basis:" + BIB_ID;

    @BeforeEach
    public void before() {
        persist(Doc.bibliographic(103862, BIB_ID).commonRepositoryId().unit("unit:6").work("work:2").trackingId("track:8").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(207130, BIB_ID).commonRepositoryId().unit("unit:3").work("work:0").trackingId("track:5").deleted(),
                Doc.bibliographic(305421, BIB_ID).commonRepositoryId().unit("unit:2").work("work:1").trackingId("track:4").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(401685, BIB_ID).commonRepositoryId().unit("unit:8").work("work:5").trackingId("track:6").deleted(),
                Doc.bibliographic(504758, BIB_ID).commonRepositoryId().unit("unit:5").work("work:8").trackingId("track:7").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(602306, BIB_ID).commonRepositoryId().unit("unit:0").work("work:6").trackingId("track:3").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(706244, BIB_ID).commonRepositoryId().unit("unit:4").work("work:4").trackingId("track:2").deleted(),
                Doc.bibliographic(808077, BIB_ID).commonRepositoryId().unit("unit:7").work("work:7").trackingId("track:1").indexKeys(filler -> filler.add("id", BIB_ID)));
        persist(Doc.bibliographic("ABC").indexKeys(filler -> filler.add("id", "ABC")),
                Doc.holdingsItem(700133, "ABC").addHolding(filler -> filler.status("OnShelf")),
                Doc.holdingsItem(700134, "ABC").addHolding(filler -> filler.status("OnShelf")),
                Doc.holdingsItem(700135, "ABC").addHolding(filler -> filler.status("OnShelf")),
                new HoldingsToBibliographicEntity(700133, COMMON_AGENCY, "ABC", true),
                new HoldingsToBibliographicEntity(700134, COMMON_AGENCY, "ABC", true),
                new HoldingsToBibliographicEntity(700135, COMMON_AGENCY, "ABC", true),
                Doc.bibliographic("XYZ").indexKeys(filler -> filler.add("id", "XYZ")),
                Doc.holdingsItem(700133, "XYZ").addHolding(filler -> filler.status("OnShelf")),
                Doc.holdingsItem(700134, "XYZ").addHolding(filler -> filler.status("OnShelf")),
                Doc.holdingsItem(700135, "XYZ").addHolding(filler -> filler.status("OnShelf")),
                new HoldingsToBibliographicEntity(700133, COMMON_AGENCY, "XYZ", true),
                new HoldingsToBibliographicEntity(700134, COMMON_AGENCY, "XYZ", true),
                new HoldingsToBibliographicEntity(700135, COMMON_AGENCY, "XYZ", true),
                Doc.bibliographic(770000, "XYZ").indexKeys(filler -> filler.add("id", "XYZ")));
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testGetRelatedHoldings() {
        bean(bf -> {
            Response resp = bf.bibliographicRecordAPIBeanV2()
                    .getRelatedHoldings("ABC", COMMON_AGENCY);
            assertThat(resp.getStatus(), is(200));
            FrontendReturnListType<HoldingsItemEntity> holdings = (FrontendReturnListType<HoldingsItemEntity>) resp.getEntity();
            assertThat(holdings.result.size(), is(3));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testGetBibliographicKeys() {
        bean(bf -> {
            Response resp = bf.bibliographicRecordAPIBeanV2()
                    .getBibliographicKeys("XYZ", 1, 10, "agencyId", true);
            assertThat(resp.getStatus(), is(200));
            FrontendReturnListType<BibliographicEntity> frontendReturnListType = (FrontendReturnListType<BibliographicEntity>) resp.getEntity();
            assertThat(frontendReturnListType.result.size(), is(2));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testPagingBibliographicRecordId() {
        // Should have 8 results, which with a pagesize of 5 is 2 pages

        bean(bf -> {
            Response resp = bf.bibliographicRecordAPIBeanV2()
                    .getBibliographicKeys(BIB_ID, 1, 2, "agencyId", false);
            assertThat(resp.getStatus(), is(200));
            FrontendReturnListType<BibliographicEntity> frontendReturnListType = (FrontendReturnListType<BibliographicEntity>) resp.getEntity();
            assertThat(frontendReturnListType.pages, is(4));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testPagingRepositoryId() throws JsonProcessingException {
        // Should have 8 results, which with a pagesize of 5 is 2 pages
        bean(bf -> {
            Response resp = bf.bibliographicRecordAPIBeanV2()
                    .getBibliographicKeysByRepositoryId(REPO_ID, 1, 2, "agencyId", false);
            assertThat(resp.getStatus(), is(200));
            FrontendReturnListType<BibliographicEntity> frontendReturnListType = (FrontendReturnListType<BibliographicEntity>) resp.getEntity();
            assertThat(frontendReturnListType.pages, is(4));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testAgencyIdOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        bean(bf -> {
            List<Integer> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), bibliographicRecordId, "agencyId", false, bibItem -> bibItem.getAgencyId());
            assertThat(result, contains(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        });
        bean(bf -> {
            List<Integer> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), bibliographicRecordId, "agencyId", true, bibItem -> bibItem.getAgencyId());
            assertThat(result, contains(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testTrackingIdBibliographicRecordId() {
        bean(bf -> {
            List<String> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), BIB_ID, "trackingId", false, bibItem -> bibItem.getTrackingId());
            assertThat(result, contains("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        });
        bean(bf -> {
            List<String> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), BIB_ID, "trackingId", true, bibItem -> bibItem.getTrackingId());
            assertThat(result, contains("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testDeletedOrderingBibliographicRecordId() {
        bean(bf -> {
            List<Boolean> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), BIB_ID, "deleted", false, bibItem -> bibItem.isDeleted());
            assertThat(result, contains(false, false, false, false, false, true, true, true));
        });
        bean(bf -> {
            List<Boolean> result = getColumnOfBib(bf.bibliographicRecordAPIBeanV2(), BIB_ID, "deleted", true, bibItem -> bibItem.isDeleted());
            assertThat(result, contains(true, true, true, false, false, false, false, false));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testAgencyIdOrderingRepositoryId() throws JsonProcessingException {
        bean(bf -> {
            List<Integer> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "agencyId", false, bibItem -> bibItem.getAgencyId());
            assertThat(result, contains(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        });
        bean(bf -> {
            List<Integer> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "agencyId", true, bibItem -> bibItem.getAgencyId());
            assertThat(result, contains(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testTrackingIdOrderingRepositoryId() throws JsonProcessingException {
        bean(bf -> {
            List<String> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "trackingId", false, bibItem -> bibItem.getTrackingId());
            assertThat(result, contains("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        });
        bean(bf -> {
            List<String> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "trackingId", true, bibItem -> bibItem.getTrackingId());
            assertThat(result, contains("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
        });
    }

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testDeletedOrderingRepositoryId() throws JsonProcessingException {
        bean(bf -> {
            List<Boolean> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "deleted", false, bibItem -> bibItem.isDeleted());
            assertThat(result, contains(false, false, false, false, false, true, true, true));
        });
        bean(bf -> {
            List<Boolean> result = getColumnOfRepo(bf.bibliographicRecordAPIBeanV2(), REPO_ID, "deleted", true, bibItem -> bibItem.isDeleted());
            assertThat(result, contains(true, true, true, false, false, false, false, false));
        });
    }

    public List<BibliographicEntity> getFrontendResultBibIdWithOrder(BibliographicRecordAPIBeanV2 bean, String bibliographicRecordId, String order, boolean desc) {
        Response json = bean.getBibliographicKeys(bibliographicRecordId, 1, 10, order, desc);
        return ( (FrontendReturnListType<BibliographicEntity>) json.getEntity() ).result;
    }

    public List<BibliographicEntity> getFrontendResultRepoIdWithOrder(BibliographicRecordAPIBeanV2 bean, String repositoryId, String order, boolean desc) throws JsonProcessingException {
        Response json = bean.getBibliographicKeysByRepositoryId(repositoryId, 1, 10, order, desc);
        return ( (FrontendReturnListType<BibliographicEntity>) json.getEntity() ).result;
    }

    public <A> List<A> getColumn(List<BibliographicEntity> of, Function<BibliographicEntity, A> fun) {
        return of.stream().map(fun).collect(Collectors.toList());
    }

    public <A> List<A> getColumnOfBib(BibliographicRecordAPIBeanV2 bean, String bibliographicRecordId, String columnName, boolean desc, Function<BibliographicEntity, A> fun) {
        return getColumn(getFrontendResultBibIdWithOrder(bean, bibliographicRecordId, columnName, desc), fun);
    }

    public <A> List<A> getColumnOfRepo(BibliographicRecordAPIBeanV2 bean, String repositoryId, String columnName, boolean desc, Function<BibliographicEntity, A> fun) throws JsonProcessingException {
        return getColumn(getFrontendResultRepoIdWithOrder(bean, repositoryId, columnName, desc), fun);
    }
}
