package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createBibliographicBean;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createDocumentRetrieveBean;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createHoldingsItemBean;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createHoldingsToBibliographicBean;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.COMMON_AGENCY;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.makeOpenAgencyEntity;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

public class DocumentRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final IndexKeysList DECOMMISSIONED = indexKeys("[]");
    private static final IndexKeysList ON_SHELF = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
    private static final IndexKeys EXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"true\"]}");
    private static final IndexKeys NOTEXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"false\"]}");
    private static final IndexKeys NOEXCLUDE = indexKeysB("{}");
    private static final IndexKeys EMPTY = indexKeysB("{}");
    private static final String ID = "ABC";

    private DocumentRetrieveBean bean;
    private EntityManager em;
    private BibliographicBean bibl;
    private HoldingsItemBean hold;
    private HoldingsToBibliographicBean h2b;

    @Before
    public void setupBean() {
        bean = createDocumentRetrieveBean(env());
        JpaTestEnvironment env = env();
        em = env.getEntityManager();
        bibl = createBibliographicBean(env);
        hold = createHoldingsItemBean(env);
        h2b = createHoldingsToBibliographicBean(env);
        env().getPersistenceContext().run(() -> {
            bibl.addBibliographicKeys(new BibliographicEntity(COMMON_AGENCY, "basis", ID, "r:0", "work:0", "unit:0", false, EMPTY, "t0"), Arrays.asList("CBA"), false);
        });
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {
        em.merge(new BibliographicEntity(300000, "clazzifier", "12345678", "id#1", "work:0", "unit:0", false, new IndexKeys(), "T1"));
        em.merge(new HoldingsItemEntity(300101, "12345678", new IndexKeysList(), "T2"));
        em.merge(new HoldingsItemEntity(300102, "12345678", new IndexKeysList(), "T3"));
        em.merge(new HoldingsToBibliographicEntity(300101, "12345678", 300000, false));
        em.merge(new HoldingsToBibliographicEntity(300102, "12345678", 300000, false));
        DocumentRetrieveResponse doc = env().getPersistenceContext()
                .run(() -> bean.getDocumentWithHoldingsitems(300000, "clazzifier", "12345678"));

        assertThat(doc.bibliographicRecord.getAgencyId(), is(300000));
        assertThat(doc.bibliographicRecord.getBibliographicRecordId(), is("12345678"));
        assertThat(doc.holdingsItemRecords.size(), is(2));
    }

    @Test
    public void getPartOfDanbibCommon() throws Exception {
        System.out.println("getPartOfDanbibCommon");
        List<Integer> agencies = env().getPersistenceContext().run(() -> {

            build(300055).holdings(ON_SHELF);
            build(800055).holdings(ON_SHELF);
            build(710001, "CBA").holdings(ON_SHELF);
            build(710002, "CBA").holdings(DECOMMISSIONED);

            build(700011).holdings(ON_SHELF);
            build(700015).holdings(ON_SHELF);
            build(700051).holdings(ON_SHELF);
            build(700055).holdings(ON_SHELF);

            build(700211).record(NOEXCLUDE).holdings(ON_SHELF);
            build(700215).record(NOEXCLUDE).holdings(ON_SHELF);
            build(700251).record(NOEXCLUDE).holdings(ON_SHELF);
            build(700255).record(NOEXCLUDE).holdings(ON_SHELF);

            build(700311).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(700315).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(700351).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(700355).record(NOTEXCLUDE).holdings(ON_SHELF);

            build(700411).record(EXCLUDE).holdings(ON_SHELF);
            build(700415).record(EXCLUDE).holdings(ON_SHELF);
            build(700451).record(EXCLUDE).holdings(ON_SHELF);
            build(700455).record(EXCLUDE).holdings(ON_SHELF);

            return bean.getPartOfDanbibCommon(ID);
        });
        System.out.println("agencies = " + agencies);
        assertThat(agencies, Matchers.containsInAnyOrder(710001,
                                                         700011, 700015, 700051,
                                                         700211, 700215, 700251,
                                                         700311, 700315, 700351));
    }

    @Test
    public void getDocumentWithHoldings() throws Exception {
        System.out.println("getDocumentWithHoldings");
        DocumentRetrieveResponse resp = env().getPersistenceContext().run(() -> {
            build(300055).holdings(ON_SHELF);
            build(800055).holdings(ON_SHELF);
            build(710001, "CBA").holdings(ON_SHELF);
            return bean.getDocumentWithHoldingsitems(COMMON_AGENCY, "basis", ID);
        });
        System.out.println("resp = " + resp);
        Set<String> holdings = resp.holdingsItemRecords.stream()
                .map(h -> h.getAgencyId() + "-" + h.getBibliographicRecordId())
                .collect(Collectors.toSet());
        assertThat(holdings, Matchers.containsInAnyOrder("300055-ABC", "710001-CBA"));
    }

    @Test
    public void getWorkWithHoldings() throws Exception {
        System.out.println("getWorkWithHoldings");
        List<DocumentRetrieveResponse> resp = env().getPersistenceContext().run(() -> {
            build(300055).holdings(ON_SHELF);
            build(800055).holdings(ON_SHELF);
            build(710001, "CBA").holdings(ON_SHELF);
            return bean.getDocumentsForWork("work:0", true);
        });
        assertThat(resp, is(not(empty())));
        DocumentRetrieveResponse r = resp.get(0);
        Set<String> holdings = r.holdingsItemRecords.stream()
                .map(h -> h.getAgencyId() + "-" + h.getBibliographicRecordId())
                .collect(Collectors.toSet());
        assertThat(holdings, Matchers.containsInAnyOrder("300055-ABC", "710001-CBA"));
    }

    private static IndexKeysList indexKeys(String json) {
        try {
            return O.readValue(json, new TypeReference<IndexKeysList>() {
                       });
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static IndexKeys indexKeysB(String json) {
        try {
            return O.readValue(json, new TypeReference<IndexKeys>() {
                       });
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private Build build(int holdingsAgencyId) {
        return new Build(holdingsAgencyId, ID);
    }

    private Build build(int holdingsAgencyId, String id) {
        return new Build(holdingsAgencyId, id);
    }

    private class Build {

        private final int holdingsAgencyId;
        private final String holdingsId;

        private Build(int holdingsAgencyId, String holdingsId) {
            this.holdingsAgencyId = holdingsAgencyId;
            this.holdingsId = holdingsId;
            em.persist(makeOpenAgencyEntity(holdingsAgencyId));
        }

        private Build holdings(IndexKeysList content) throws SQLException {
            hold.setHoldingsKeys(new HoldingsItemEntity(holdingsAgencyId, holdingsId, content, "t1"));
            h2b.tryToAttachToBibliographicRecord(holdingsAgencyId, holdingsId, EnqueueCollector.VOID, QueueType.HOLDING);
            return this;
        }

        private Build record(IndexKeys content) throws SQLException {
            bibl.addBibliographicKeys(new BibliographicEntity(holdingsAgencyId, "katalog", holdingsId, "r:*", "work:1", "unit:1", false, content, "t0"), Collections.EMPTY_LIST, false);
            return this;
        }
    }
}
