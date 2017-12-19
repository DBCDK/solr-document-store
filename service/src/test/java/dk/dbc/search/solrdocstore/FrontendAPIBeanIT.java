package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.validation.constraints.NotNull;
import javax.ws.rs.core.Response;
import java.util.*;


public class FrontendAPIBeanIT  extends JpaSolrDocStoreIntegrationTester {
    int commonAgency = LibraryConfig.COMMON_AGENCY;
    int[] holdingAgencies = { 133, 134, 135};

    EntityManager em ;
    JSONBContext jsonbContext = new JSONBContext();

    FrontendAPIBean bean;

    @Before
    public void before(){
        // Setup bean
        em = env().getEntityManager();
        bean = new FrontendAPIBean();
        bean.entityManager = em;

        bean.bibliographicBean = new BibliographicBean();
        bean.bibliographicBean.entityManager = em;

        bean.holdingsItemBean = new HoldingsItemBean();
        bean.holdingsItemBean.entityManager = em;
        bean.holdingsItemBean.h2bBean = new HoldingsToBibliographicBean();
        bean.holdingsItemBean.h2bBean.entityManager = em;


        // Setup records
        env().getPersistenceContext().run( () -> {
            createBibAndHoldings(commonAgency, "ABC", holdingAgencies);
            createBibAndHoldings(commonAgency,"XYZ",holdingAgencies);
            createBibliographicEntity(4711,"XYZ");
        });

    }

    @Test
    public void testGetRelatedHoldings(){
        String bibliographicRecordId = "ABC";

        Response relatedHoldings = bean.getRelatedHoldings(bibliographicRecordId, commonAgency);
        FrontendReturnListType<HoldingsItemEntity> abcHoldings2 = (FrontendReturnListType<HoldingsItemEntity>) relatedHoldings.getEntity();
        List<HoldingsItemEntity> abcHoldings = abcHoldings2.result;
        int expected = 3;
        Assert.assertEquals(expected,abcHoldings.size());
    }

    @Test
    public void testGetBibliographicKeys(){
        String bibliographicRecordId = "XYZ";
        Response json = bean.getBibliographicKeys(bibliographicRecordId);
        FrontendReturnListType<BibliographicEntity> frontendReturnListType =
                (FrontendReturnListType<BibliographicEntity>) json.getEntity();
        Assert.assertEquals(2, frontendReturnListType.result.size());


        return;
    }

    private BibliographicEntity createBibAndHoldings(
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
