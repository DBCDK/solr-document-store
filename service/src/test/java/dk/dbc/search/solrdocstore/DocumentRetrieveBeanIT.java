package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import org.hamcrest.Matchers;

public class DocumentRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final ObjectMapper O = new ObjectMapper();
    private DocumentRetrieveBean bean;
    private EntityManager em;

    @Before
    public void setupBean() {
        bean = new DocumentRetrieveBean();
        JpaTestEnvironment env = env();
        em = env.getEntityManager();
        bean.entityManager = em;
        bean.brBean = BeanFactoryUtil.createBibliographicRetrieveBean(env);
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        em.merge(new BibliographicEntity(300000, "clazzifier", "12345678", "id#1", "w", "u", "v1", false, Collections.EMPTY_MAP, "T1"));
        em.merge(new HoldingsItemEntity(300101, "12345678", "v2", Collections.EMPTY_LIST, "T2"));
        em.merge(new HoldingsItemEntity(300102, "12345678", "v2", Collections.EMPTY_LIST, "T3"));
        em.merge(new HoldingsToBibliographicEntity(300101, "12345678", 300000, false));
        em.merge(new HoldingsToBibliographicEntity(300102, "12345678", 300000, false));
        DocumentRetrieveResponse doc = env().getPersistenceContext()
                .run(() -> bean.getDocumentWithHoldingsitems(300000, "clazzifier", "12345678"));

        assertThat(doc.bibliographicRecord.getAgencyId(), is(300000));
        assertThat(doc.bibliographicRecord.getBibliographicRecordId(), is("12345678"));
        assertThat(doc.holdingsItemRecords.size(), is(2));
    }

    @Test
    public void getPartOfDanbib() throws Exception {
        List<Map<String, List<String>>> decommissioned = indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]}]");
        List<Map<String, List<String>>> onShelf = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
        List<Integer> agencies = env().getPersistenceContext().run(() -> {

            // School part of danbib derived from common
            em.persist(new OpenAgencyEntity(311111, LibraryType.FBSSchool, false));
            em.persist(new HoldingsItemEntity(311111, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(311111, "a", 870970, "a", true));

            // Fbs part of danbib from common (*)
            em.persist(new OpenAgencyEntity(711111, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(711111, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(711111, "a", 870970, "a", true));

            // Fbs part of danbib from common - no live holdings
            em.persist(new OpenAgencyEntity(771111, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(771111, "a", "", decommissioned, ""));
            em.persist(new HoldingsToBibliographicEntity(771111, "a", 870970, "a", true));

            // Fbs part of danbib from common - superceeded (*)
            em.persist(new OpenAgencyEntity(777111, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(777111, "b", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(777111, "b", 870970, "a", true));

            // Fbs part of danbib from common - own datastream (*)
            em.persist(new OpenAgencyEntity(777711, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(777711, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(777711, "a", 777711, "a", true));

            // Fbs part of danbib own record (invalid id)
            em.persist(new OpenAgencyEntity(777771, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(777771, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(777771, "a", 777771, "a", false));

            // Fbs from common
            em.persist(new OpenAgencyEntity(811111, LibraryType.FBS, false));
            em.persist(new HoldingsItemEntity(811111, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(811111, "a", 870970, "a", true));

            // Fbs part of danbib own record
            em.persist(new OpenAgencyEntity(881111, LibraryType.FBS, true));
            em.persist(new HoldingsItemEntity(881111, "a", "", onShelf, ""));
            em.persist(new HoldingsToBibliographicEntity(881111, "a", 881111, "a", false));

            return bean.getPartOfDanbib("a");

        });
        Collections.sort(agencies);
        System.out.println("agencies = " + agencies);
        assertThat(agencies, Matchers.is(Arrays.asList(711111, 777111, 777711)));
    }

    private static List<Map<String, List<String>>> indexKeys(String json) throws Exception {
        return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>() {
                   });
    }

}
