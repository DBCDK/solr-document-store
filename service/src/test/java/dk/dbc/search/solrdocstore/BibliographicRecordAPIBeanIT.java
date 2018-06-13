package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.commons.jsonb.JSONBContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.Response;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;

public class BibliographicRecordAPIBeanIT extends JpaSolrDocStoreIntegrationTester {

    int commonAgency = LibraryType.COMMON_AGENCY;
    int[] holdingAgencies = {133, 134, 135};

    EntityManager em;
    JSONBContext jsonbContext = new JSONBContext();

    BibliographicRecordAPIBean bean;

    @Before
    public void before() {
        // Setup bean
        em = env().getEntityManager();
        bean = createBiliographicRecordAPIBean(jpaTestEnvironment);

        // Setup records
        env().getPersistenceContext().run(() -> {
            createBibAndHoldings(commonAgency, "ABC", holdingAgencies);
            createBibAndHoldings(commonAgency, "XYZ", holdingAgencies);
            createBibliographicEntity(4711, "XYZ");
        });
        executeScriptResource("/frontendIT.sql");
    }

    @Test
    public void testGetRelatedHoldings() {
        String bibliographicRecordId = "ABC";

        Response relatedHoldings = bean.getRelatedHoldings(bibliographicRecordId, commonAgency);
        FrontendReturnListType<HoldingsItemEntity> abcHoldings2 = (FrontendReturnListType<HoldingsItemEntity>) relatedHoldings.getEntity();
        List<HoldingsItemEntity> abcHoldings = abcHoldings2.result;
        int expected = 3;
        Assert.assertEquals(expected, abcHoldings.size());
    }

    @Test
    public void testGetBibliographicKeys() {
        String bibliographicRecordId = "XYZ";
        Response json = bean.getBibliographicKeysWithSupersedeId(bibliographicRecordId, 1, 10, "agencyId", true);
        FrontendReturnListType<BibliographicFrontendEntity> frontendReturnListType =
                (FrontendReturnListType<BibliographicFrontendEntity>) json.getEntity();
        Assert.assertEquals(2, frontendReturnListType.result.size());

        return;
    }

    @Test
    public void testPagingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Should have 8 results, which with a pagesize of 5 is 2 pages
        Response json = bean.getBibliographicKeysWithSupersedeId(bibliographicRecordId, 1, 2, "agencyId", false);
        FrontendReturnListType<BibliographicFrontendEntity> frontendReturnListType =
                (FrontendReturnListType<BibliographicFrontendEntity>) json.getEntity();
        Assert.assertEquals(4, frontendReturnListType.pages);
    }

    @Test
    public void testGetBibliographicRecord() {
        Response result = bean.getBibliographicRecord("page-order", 103862);
        BibliographicFrontendEntity res = (BibliographicFrontendEntity) result.getEntity();
        Map<String, List<String>> map = new HashMap<>();
        map.put("rec.repositoryId", Collections.singletonList("p-o"));
        BibliographicEntity b = new BibliographicEntity(103862, "clazzifier", "page-order", "p-o", "work:2", "unit:6", "producer:3", false, map, "track:8");
        Assert.assertEquals(res, new BibliographicFrontendEntity(b, "0639423"));
    }

    @Test
    public void testPagingRepositoryId() throws JsonProcessingException {
        String bibliographicRecordId = "p-o";
        // Should have 8 results, which with a pagesize of 5 is 2 pages
        Response json = bean.getBibliographicKeysByRepositoryIdWithSupersedeId(bibliographicRecordId, 1, 2, "agencyId", false);
        FrontendReturnListType<BibliographicEntity> frontendReturnListType =
                (FrontendReturnListType<BibliographicEntity>) json.getEntity();
        Assert.assertEquals(4, frontendReturnListType.pages);
    }

    public List<BibliographicFrontendEntity> getFrontendResultBibIdWithOrder(String bibliographicRecordId, String order, boolean desc) {
        Response json = bean.getBibliographicKeysWithSupersedeId(bibliographicRecordId, 1, 10, order, desc);
        return ( (FrontendReturnListType<BibliographicFrontendEntity>) json.getEntity() ).result;
    }

    public List<BibliographicFrontendEntity> getFrontendResultRepoIdWithOrder(String repositoryId, String order, boolean desc) throws JsonProcessingException {
        Response json = bean.getBibliographicKeysByRepositoryIdWithSupersedeId(repositoryId, 1, 10, order, desc);
        return ( (FrontendReturnListType<BibliographicFrontendEntity>) json.getEntity() ).result;
    }

    public <A> List<A> getColumn(List<BibliographicFrontendEntity> of, Function<BibliographicFrontendEntity, A> fun) {
        return of.stream().map(fun).collect(Collectors.toList());
    }

    public <A> List<A> getColumnOfBib(String bibliographicRecordId, String columnName, boolean desc, Function<BibliographicFrontendEntity, A> fun) {
        return getColumn(getFrontendResultBibIdWithOrder(bibliographicRecordId, columnName, desc), fun);
    }

    public <A> List<A> getColumnOfRepo(String repositoryId, String columnName, boolean desc, Function<BibliographicFrontendEntity, A> fun) throws JsonProcessingException {
        return getColumn(getFrontendResultRepoIdWithOrder(repositoryId, columnName, desc), fun);
    }

    @Test
    public void testAgencyIdOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Sort by producerVersion in descending order
        List<Integer> result = getColumnOfBib(bibliographicRecordId, "agencyId", false, bibItem -> bibItem.getAgencyId());
        assertEquals(result, Arrays.asList(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        // Sort by producerVersion in ascending order
        result = getColumnOfBib(bibliographicRecordId, "agencyId", true, bibItem -> bibItem.getAgencyId());
        assertEquals(result, Arrays.asList(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
    }

    @Test
    public void testProducerVersionOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Sort by agencyId in descending order
        List<String> result = getColumnOfBib(bibliographicRecordId, "producerVersion", false, bibItem -> bibItem.getProducerVersion());
        assertEquals(result, Arrays.asList("producer:1", "producer:2", "producer:3", "producer:4", "producer:5", "producer:6", "producer:7", "producer:8"));
        // Sort by agencyId in ascending order
        result = getColumnOfBib(bibliographicRecordId, "producerVersion", true, bibItem -> bibItem.getProducerVersion());
        assertEquals(result, Arrays.asList("producer:8", "producer:7", "producer:6", "producer:5", "producer:4", "producer:3", "producer:2", "producer:1"));
    }

    @Test
    public void testTrackingIdBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        // Sort by agencyId in descending order
        List<String> result = getColumnOfBib(bibliographicRecordId, "trackingId", false, bibItem -> bibItem.getTrackingId());
        assertEquals(result, Arrays.asList("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        result = getColumnOfBib(bibliographicRecordId, "trackingId", true, bibItem -> bibItem.getTrackingId());
        assertEquals(result, Arrays.asList("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
    }

    @Test
    public void testDeletedOrderingBibliographicRecordId() {
        String bibliographicRecordId = "page-order";
        List<Boolean> result = getColumnOfBib(bibliographicRecordId, "deleted", false, bibItem -> bibItem.isDeleted());
        assertEquals(result, Arrays.asList(false, false, false, false, false, true, true, true));
        result = getColumnOfBib(bibliographicRecordId, "deleted", true, bibItem -> bibItem.isDeleted());
        assertEquals(result, Arrays.asList(true, true, true, false, false, false, false, false));
    }

    @Test
    public void testAgencyIdOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        // Sort by producerVersion in descending order
        List<Integer> result = getColumnOfRepo(repositoryId, "agencyId", false, bibItem -> bibItem.getAgencyId());
        assertEquals(result, Arrays.asList(103862, 207130, 305421, 401685, 504758, 602306, 706244, 808077));
        // Sort by producerVersion in ascending order
        result = getColumnOfRepo(repositoryId, "agencyId", true, bibItem -> bibItem.getAgencyId());
        assertEquals(result, Arrays.asList(808077, 706244, 602306, 504758, 401685, 305421, 207130, 103862));
    }

    @Test
    public void testProducerVersionOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        // Sort by agencyId in descending order
        List<String> result = getColumnOfRepo(repositoryId, "producerVersion", false, bibItem -> bibItem.getProducerVersion());
        assertEquals(result, Arrays.asList("producer:1", "producer:2", "producer:3", "producer:4", "producer:5", "producer:6", "producer:7", "producer:8"));
        // Sort by agencyId in ascending order
        result = getColumnOfRepo(repositoryId, "producerVersion", true, bibItem -> bibItem.getProducerVersion());
        assertEquals(result, Arrays.asList("producer:8", "producer:7", "producer:6", "producer:5", "producer:4", "producer:3", "producer:2", "producer:1"));
    }

    @Test
    public void testTrackingIdOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        // Sort by agencyId in descending order
        List<String> result = getColumnOfRepo(repositoryId, "trackingId", false, bibItem -> bibItem.getTrackingId());
        assertEquals(result, Arrays.asList("track:1", "track:2", "track:3", "track:4", "track:5", "track:6", "track:7", "track:8"));
        result = getColumnOfRepo(repositoryId, "trackingId", true, bibItem -> bibItem.getTrackingId());
        assertEquals(result, Arrays.asList("track:8", "track:7", "track:6", "track:5", "track:4", "track:3", "track:2", "track:1"));
    }

    @Test
    public void testDeletedOrderingRepositoryId() throws JsonProcessingException {
        String repositoryId = "p-o";
        List<Boolean> result = getColumnOfRepo(repositoryId, "deleted", false, bibItem -> bibItem.isDeleted());
        assertEquals(result, Arrays.asList(false, false, false, false, false, true, true, true));
        result = getColumnOfRepo(repositoryId, "deleted", true, bibItem -> bibItem.isDeleted());
        assertEquals(result, Arrays.asList(true, true, true, false, false, false, false, false));
    }

    @Test
    public void testSupersedeIdIncluded() throws JsonProcessingException {
        String bibliographicRecordId = "page-order";
        Response json = bean.getBibliographicKeysWithSupersedeId(bibliographicRecordId, 1, 10, "agencyId", false);
        FrontendReturnListType<BibliographicFrontendEntity> frontendReturnListType =
                (FrontendReturnListType<BibliographicFrontendEntity>) json.getEntity();
        List<String> supersedeIds = frontendReturnListType.result.stream().map(b -> b.getSupersedeId()).collect(Collectors.toList());
        Assert.assertEquals(supersedeIds, Arrays.asList("0639423", "0639423", "0639423", "0639423", "0639423", "0639423", "0639423", "0639423"));
        String repositoryId = "p-o";
        Response jsonRepo = bean.getBibliographicKeysByRepositoryIdWithSupersedeId(repositoryId, 1, 10, "agencyId", false);
        FrontendReturnListType<BibliographicFrontendEntity> frontendReturnListTypeRepo =
                (FrontendReturnListType<BibliographicFrontendEntity>) jsonRepo.getEntity();
        List<String> supersedeIdsRepo = frontendReturnListTypeRepo.result.stream().map(b -> b.getSupersedeId()).collect(Collectors.toList());
        Assert.assertEquals(supersedeIdsRepo, Arrays.asList("0639423", "0639423", "0639423", "0639423", "0639423", "0639423", "0639423", "0639423"));
    }

    private BibliographicEntity createBibAndHoldings(
            int agencyId,
            String bibliographicRecordId,
            @NotNull int... agencies) {
        BibliographicEntity b = createBibliographicEntity(agencyId, bibliographicRecordId);
//        boolean isCommonDerived = Arrays.stream(agencies)
//                .anyMatch(i -> i == commonAgency);
        for (int i = 0 ; i < agencies.length ; i++) {
            createHoldingsItem(agencies[i], bibliographicRecordId);
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                    agencies[i], bibliographicRecordId, agencyId, false
            );
            em.persist(h2b);
        }
        return b;
    }

    private BibliographicEntity createBibliographicEntity(int agencyId, String bibliographicRecordId) {
        BibliographicEntity b = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#1", "w", "u", "v0.1", false, Collections.EMPTY_MAP, "IT");
        em.persist(b);
        return b;
    }

    private HoldingsItemEntity createHoldingsItem(int agencyId, String bibliographicRecordId) {
        List<Map<String, List<String>>> indexKeys = new ArrayList<>();
        List<String> keys = Arrays.asList(new String[] {"bla", "bla2"});
        Map<String, List<String>> keyMap = new HashMap<>();
        keyMap.put("def", keys);
        indexKeys.add(keyMap);
        String producerVersion = "1";
        String trackingId = "1234";
        HoldingsItemEntity e = new HoldingsItemEntity(agencyId, bibliographicRecordId, producerVersion, indexKeys, trackingId);
        em.persist(e);
        return e;
    }

}
