package dk.dbc.search.solrdocstore;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;
import java.util.*;


public class FrontendAPIBeanIT  extends JpaSolrDocStoreIntegrationTester {
    int commonAgency = LibraryConfig.COMMON_AGENCY;
    int[] holdingAgencies = { 133, 134, 135};

    EntityManager em ;

    FrontendAPIBean bean;

    @Before
    public void before(){
        // Setup bean
        em = env().getEntityManager();
        bean = new FrontendAPIBean();
        bean.entityManager = em;

        // Setup records
        env().getPersistenceContext().run( () -> {
            createBib(commonAgency, "ABC", holdingAgencies);
            createBib(commonAgency,"XYZ",holdingAgencies);

        });

    }

    @Test
    public void testGetRelatedHoldings(){
        String bibliographicRecordId = "ABC";
        List<HoldingsItemEntity> abcHoldings = bean.getRelatedHoldings(bibliographicRecordId, commonAgency);
        int expected = 3;
        Assert.assertEquals(expected,abcHoldings.size());
    }

    @Test
    public void testGetBibliographicKeys(){

    }

    private BibliographicEntity createBib(
            int agencyId,
            String bibliographicRecordId,
            @NotNull int ... agencies){
        BibliographicEntity b = createBibliographicEntity(agencyId, bibliographicRecordId);
        for(int i=0; i<agencies.length;i++){
            createHoldingsItem(agencies[i],bibliographicRecordId);
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity(
                    agencies[i], bibliographicRecordId, agencyId
            );
            em.persist(h2b);
        }
        return b;
    }

    private BibliographicEntity createBibliographicEntity(int agencyId, String bibliographicRecordId) {
        String dummy = "qw";
        BibliographicEntity b = new BibliographicEntity();
        b.agencyId = agencyId;
        b.bibliographicRecordId = bibliographicRecordId;
        b.work = dummy;
        b.unit = dummy;
        b.deleted = false;
        b.trackingId = dummy;
        em.persist(b);
        return b;
    }

    private HoldingsItemEntity createHoldingsItem(int agencyId, String bibliographicRecordId){
        List<Map<String, List<String>>> indexKeys = new ArrayList<>();
        List<String> keys = Arrays.asList(new String[]{"bla", "bla2"});
        Map<String,List<String>> keyMap = new HashMap<>();
        keyMap.put("def",keys);
        indexKeys.add(keyMap);
        String producerVersion = "1";
        String trackingId = "1234";
        HoldingsItemEntity e = new HoldingsItemEntity(agencyId, bibliographicRecordId, producerVersion, indexKeys, trackingId);
        em.persist(e);
        return e;
    }

}
