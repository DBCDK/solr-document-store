package dk.dbc.search.solrdocstore;

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;

public class DocumentRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private DocumentRetrieveBean bean;
    private EntityManager em;

    @Before
    public void setupBean() {
        bean = new DocumentRetrieveBean();
        em = env().getEntityManager();
        bean.entityManager = em;
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        em.merge(new BibliographicEntity(300000, "12345678", "w", "u", "v1", false, Collections.EMPTY_MAP, "T1"));
        em.merge(new HoldingsItemEntity(300101, "12345678", "v2", Collections.EMPTY_LIST, "T2"));
        em.merge(new HoldingsItemEntity(300102, "12345678", "v2", Collections.EMPTY_LIST, "T3"));
        em.merge(new HoldingsToBibliographicEntity(300101, "12345678", 300000));
        em.merge(new HoldingsToBibliographicEntity(300102, "12345678", 300000));
        DocumentRetrieveResponse doc = env().getPersistenceContext()
                .run(() -> bean.getDocumentWithHoldingsitems(300000, "12345678")
                );

        assertThat(doc.bibliographicRecord.agencyId, is(300000));
        assertThat(doc.bibliographicRecord.bibliographicRecordId, is("12345678"));
        assertThat(doc.holdingsItemRecords.size(), is(2));
    }
}
