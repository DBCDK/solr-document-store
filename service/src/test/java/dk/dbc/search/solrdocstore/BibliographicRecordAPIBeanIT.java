package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.response.FrontendReturnListType;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import jakarta.persistence.EntityManager;
import jakarta.ws.rs.core.Response;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;

public class BibliographicRecordAPIBeanIT extends JpaSolrDocStoreIntegrationTester {

    int commonAgency = LibraryType.COMMON_AGENCY;
    int[] holdingAgencies = {133, 134, 135};

    @Before
    public void before() {
        // Setup records
        jpa(em -> {
            createBibAndHoldings(em, commonAgency, "ABC", holdingAgencies);
            createBibAndHoldings(em, commonAgency, "XYZ", holdingAgencies);
            em.persist(new BibliographicEntity(4711, "clazzifier", "XYZ", "id#1", "w", "u", false, new IndexKeys(), "IT"));
        });
        executeSqlScript("frontendIT.sql");
    }

    @Test
    public void testGetRelatedHoldings() {
        String bibliographicRecordId = "ABC";

        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            Response relatedHoldings = bean.getRelatedHoldings(bibliographicRecordId, commonAgency);
            FrontendReturnListType<HoldingsItemEntity> abcHoldings2 = (FrontendReturnListType<HoldingsItemEntity>) relatedHoldings.getEntity();
            List<HoldingsItemEntity> abcHoldings = abcHoldings2.result;
            int expected = 3;
            Assert.assertEquals(expected, abcHoldings.size());
        });
    }

    @Test
    public void testGetBibliographicKeys() {
        String bibliographicRecordId = "XYZ";
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            Response json = bean.getBibliographicKeys(bibliographicRecordId, 1, 10, "agencyId", true);
            FrontendReturnListType<BibliographicEntity> frontendReturnListType =
                    (FrontendReturnListType<BibliographicEntity>) json.getEntity();
            Assert.assertEquals(2, frontendReturnListType.result.size());
        });
    }

    @Test
    public void testPagingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Should have 8 results, which with a pagesize of 5 is 2 pages
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            Response json = bean.getBibliographicKeys(bibliographicRecordId, 1, 2, "agencyId", false);
            FrontendReturnListType<BibliographicEntity> frontendReturnListType =
                    (FrontendReturnListType<BibliographicEntity>) json.getEntity();
            Assert.assertEquals(4, frontendReturnListType.pages);
        });
    }

    @Test
    public void testGetBibliographicRecord() {
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            Response result = bean.getBibliographicRecord("page-order", 103862);
            BibliographicEntity res = (BibliographicEntity) result.getEntity();
            IndexKeys map = new IndexKeys();
            map.put("rec.repositoryId", Collections.singletonList("p-o"));
            BibliographicEntity b = new BibliographicEntity(103862, "clazzifier", "page-order", "p-o", "work:2", "unit:6", false, map, "track:8");
            Assert.assertEquals(res, b);
        });
    }

    @Test
    public void testPagingRepositoryId() throws JsonProcessingException {
        String bibliographicRecordId = "p-o";
        // Should have 8 results, which with a pagesize of 5 is 2 pages
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            Response json = bean.getBibliographicKeysByRepositoryId(bibliographicRecordId, 1, 2, "agencyId", false);
            FrontendReturnListType<BibliographicEntity> frontendReturnListType =
                    (FrontendReturnListType<BibliographicEntity>) json.getEntity();
            Assert.assertEquals(4, frontendReturnListType.pages);
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

    public <A> List<A> getColumnOfBib(String bibliographicRecordId, String columnName, boolean desc, Function<BibliographicEntity, A> fun, BibliographicRecordAPIBeanV2 bean) {
        return getColumn(getFrontendResultBibIdWithOrder(bean, bibliographicRecordId, columnName, desc), fun);
    }

    public <A> List<A> getColumnOfRepo(BibliographicRecordAPIBeanV2 bean, String repositoryId, String columnName, boolean desc, Function<BibliographicEntity, A> fun) throws JsonProcessingException {
        return getColumn(getFrontendResultRepoIdWithOrder(bean, repositoryId, columnName, desc), fun);
    }

    @Test
    public void testAgencyIdOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Sort by agencyId in descending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Integer> result = getColumnOfBib(bibliographicRecordId, "agencyId", false, bibItem -> bibItem.getAgencyId(), bean);
            assertEquals(result, Arrays.asList(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        });
        // Sort by agencyId in ascending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Integer> result = getColumnOfBib(bibliographicRecordId, "agencyId", true, bibItem -> bibItem.getAgencyId(), bean);
            assertEquals(result, Arrays.asList(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
        });
    }

    @Test
    public void testTrackingIdBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Sort by agencyId in descending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<String> result = getColumnOfBib(bibliographicRecordId, "trackingId", false, bibItem -> bibItem.getTrackingId(), bean);
            assertEquals(result, Arrays.asList("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        });
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<String> result = getColumnOfBib(bibliographicRecordId, "trackingId", true, bibItem -> bibItem.getTrackingId(), bean);
            assertEquals(result, Arrays.asList("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
        });
    }

    @Test
    public void testDeletedOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Boolean> result = getColumnOfBib(bibliographicRecordId, "deleted", false, bibItem -> bibItem.isDeleted(), bean);
            assertEquals(result, Arrays.asList(false, false, false, false, false, true, true, true));
        });
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Boolean> result = getColumnOfBib(bibliographicRecordId, "deleted", true, bibItem -> bibItem.isDeleted(), bean);
            assertEquals(result, Arrays.asList(true, true, true, false, false, false, false, false));
        });
    }

    @Test
    public void testAgencyIdOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        // Sort by bibliographicRecordId in descending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Integer> result = getColumnOfRepo(bean, repositoryId, "agencyId", false, bibItem -> bibItem.getAgencyId());
            assertEquals(result, Arrays.asList(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        });
        // Sort by bibliographicRecordId in ascending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Integer> result = getColumnOfRepo(bean, repositoryId, "agencyId", true, bibItem -> bibItem.getAgencyId());
            assertEquals(result, Arrays.asList(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
        });
    }

    @Test
    public void testTrackingIdOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        // Sort by agencyId in descending order
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<String> result = getColumnOfRepo(bean, repositoryId, "trackingId", false, bibItem -> bibItem.getTrackingId());
            assertEquals(result, Arrays.asList("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        });
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<String> result = getColumnOfRepo(bean, repositoryId, "trackingId", true, bibItem -> bibItem.getTrackingId());
            assertEquals(result, Arrays.asList("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
        });
    }

    @Test
    public void testDeletedOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Boolean> result = getColumnOfRepo(bean, repositoryId, "deleted", false, bibItem -> bibItem.isDeleted());
            assertEquals(result, Arrays.asList(false, false, false, false, false, true, true, true));
        });
        jpa(em -> {
            BibliographicRecordAPIBeanV2 bean = createBiliographicRecordAPIBean(em);
            List<Boolean> result = getColumnOfRepo(bean, repositoryId, "deleted", true, bibItem -> bibItem.isDeleted());
            assertEquals(result, Arrays.asList(true, true, true, false, false, false, false, false));
        });
    }

    private void createBibAndHoldings(EntityManager em, int agencyId, String bibliographicRecordId, int... agencies) {
        em.persist(new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#1", "w", "u", false, new IndexKeys(), "IT"));
        for (int i = 0 ; i < agencies.length ; i++) {
            em.persist(new HoldingsItemEntity(agencies[i], bibliographicRecordId, SolrIndexKeys.ON_SHELF, null, "track"));
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                    agencies[i], agencyId, bibliographicRecordId, false
            );
            em.persist(h2b);
        }
    }
}
