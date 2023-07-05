package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import dk.dbc.search.solrdocstore.logic.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v2.DocumentRetrieveBeanV2;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;

import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createBibliographicBean;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createDocumentRetrieveBean;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createHoldingsToBibliographicBean;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.COMMON_AGENCY;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.makeOpenAgencyEntity;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createHoldingsItemBeanV1;

public class DocumentRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final IndexKeysList DECOMMISSIONED = indexKeys("[]");
    private static final IndexKeysList ON_SHELF = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
    private static final IndexKeys EXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"true\"]}");
    private static final IndexKeys NOTEXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"false\"]}");
    private static final IndexKeys NOEXCLUDE = indexKeysB("{}");
    private static final IndexKeys EMPTY = indexKeysB("{}");
    private static final String ID = "ABC";

    @Before
    public void setupBean() {
        jpa(em -> {
            BibliographicBeanV2 bibl = createBibliographicBean(em, null);
            bibl.addBibliographicKeys(new BibliographicEntity(COMMON_AGENCY, "basis", ID, "r:0", "work:0", "unit:0", false, EMPTY, "t0"), false);
        });
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {
        jpa(em -> {
            em.merge(new BibliographicEntity(300000, "clazzifier", "12345678", "id#1", "work:0", "unit:0", false, new IndexKeys(), "T1"));
            em.merge(new HoldingsItemEntity(300101, "12345678", new IndexKeysList(), null, "T2"));
            em.merge(new HoldingsItemEntity(300102, "12345678", new IndexKeysList(), null, "T3"));
            em.merge(new HoldingsToBibliographicEntity(300101, "12345678", 300000, false));
            em.merge(new HoldingsToBibliographicEntity(300102, "12345678", 300000, false));
        });
        jpa(em -> {
            DocumentRetrieveBeanV2 bean = createDocumentRetrieveBean(em);
            BibliographicBeanV2 bibl = createBibliographicBean(em, null);
            HoldingsItemBeanV1 hold = createHoldingsItemBeanV1(em);
            DocumentRetrieveResponse doc = bean.getDocumentWithHoldingsitems(300000, "clazzifier", "12345678");

            assertThat(doc.bibliographicRecord.getAgencyId(), is(300000));
            assertThat(doc.bibliographicRecord.getBibliographicRecordId(), is("12345678"));
            assertThat(doc.holdingsItemRecords.size(), is(2));
        });
    }

    @Test
    public void getPartOfDanbibCommon() throws Exception {
        System.out.println("getPartOfDanbibCommon");
        jpa(em -> {
            DocumentRetrieveBeanV2 bean = createDocumentRetrieveBean(em);

            build(em, 300055).holdings(ON_SHELF);
            build(em, 800055).holdings(ON_SHELF);
            build(em, 710001, "CBA").holdings(ON_SHELF); // No supersedes any more
            build(em, 710002, "CBA").holdings(DECOMMISSIONED);

            build(em, 700011).holdings(ON_SHELF);
            build(em, 700015).holdings(ON_SHELF);
            build(em, 700051).holdings(ON_SHELF);
            build(em, 700055).holdings(ON_SHELF);

            build(em, 700211).record(NOEXCLUDE).holdings(ON_SHELF);
            build(em, 700215).record(NOEXCLUDE).holdings(ON_SHELF);
            build(em, 700251).record(NOEXCLUDE).holdings(ON_SHELF);
            build(em, 700255).record(NOEXCLUDE).holdings(ON_SHELF);

            build(em, 700311).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(em, 700315).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(em, 700351).record(NOTEXCLUDE).holdings(ON_SHELF);
            build(em, 700355).record(NOTEXCLUDE).holdings(ON_SHELF);

            build(em, 700411).record(EXCLUDE).holdings(ON_SHELF);
            build(em, 700415).record(EXCLUDE).holdings(ON_SHELF);
            build(em, 700451).record(EXCLUDE).holdings(ON_SHELF);
            build(em, 700455).record(EXCLUDE).holdings(ON_SHELF);

            List<Integer> agencies = bean.getPartOfDanbibCommon(ID);
            System.out.println("agencies = " + agencies);
            assertThat(agencies, Matchers.containsInAnyOrder(700011, 700015, 700051,
                                                             700211, 700215, 700251,
                                                             700311, 700315, 700351));
        });
    }

    @Test
    public void getDocumentWithHoldings() throws Exception {
        System.out.println("getDocumentWithHoldings");
        jpa(em -> {
            DocumentRetrieveBeanV2 bean = createDocumentRetrieveBean(em);

            build(em, 300055).holdings(ON_SHELF);
            build(em, 800055).holdings(ON_SHELF);
            DocumentRetrieveResponse resp = bean.getDocumentWithHoldingsitems(COMMON_AGENCY, "basis", ID);
            System.out.println("resp = " + resp);
            Set<String> holdings = resp.holdingsItemRecords.stream()
                    .map(h -> h.getAgencyId() + "-" + h.getBibliographicRecordId())
                    .collect(Collectors.toSet());
            assertThat(holdings, Matchers.containsInAnyOrder("300055-ABC"));
        });
    }

    @Test
    public void getWorkWithHoldings() throws Exception {
        System.out.println("getWorkWithHoldings");
        jpa(em -> {
            DocumentRetrieveBeanV2 bean = createDocumentRetrieveBean(em);
            build(em, 300055).holdings(ON_SHELF);
            build(em, 800055).holdings(ON_SHELF);
            List<DocumentRetrieveResponse> resp = bean.getDocumentsForWork("work:0", true);
            assertThat(resp, is(not(empty())));
            DocumentRetrieveResponse r = resp.get(0);
            Set<String> holdings = r.holdingsItemRecords.stream()
                    .map(h -> h.getAgencyId() + "-" + h.getBibliographicRecordId())
                    .collect(Collectors.toSet());
            assertThat(holdings, Matchers.containsInAnyOrder("300055-ABC"));
        });
    }

    @Test
    public void getUnitWithHoldings() throws Exception {
        System.out.println("getUnitWithHoldings");
        jpa(em -> {
            DocumentRetrieveBeanV2 bean = createDocumentRetrieveBean(em);
            build(em, 300055).holdings(ON_SHELF);
            build(em, 800055).holdings(ON_SHELF);
            List<DocumentRetrieveResponse> resp = bean.getDocumentsForUnit("unit:0", true);
            assertThat(resp, is(not(empty())));
            DocumentRetrieveResponse r = resp.get(0);
            Set<String> holdings = r.holdingsItemRecords.stream()
                    .map(h -> h.getAgencyId() + "-" + h.getBibliographicRecordId())
                    .collect(Collectors.toSet());
            assertThat(holdings, Matchers.containsInAnyOrder("300055-ABC"));
        });
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

    private Build build(EntityManager em, int holdingsAgencyId) {
        return new Build(em, holdingsAgencyId, ID);
    }

    private Build build(EntityManager em, int holdingsAgencyId, String id) {
        return new Build(em, holdingsAgencyId, id);
    }

    private class Build {

        private final int holdingsAgencyId;
        private final String holdingsId;

        private final BibliographicBeanV2 bibl;
        private final HoldingsItemBeanV1 hold;
        private final HoldingsToBibliographicBean h2b;

        private Build(EntityManager em, int holdingsAgencyId, String holdingsId) {
            this.holdingsAgencyId = holdingsAgencyId;
            this.holdingsId = holdingsId;
            em.persist(makeOpenAgencyEntity(holdingsAgencyId));

            bibl = createBibliographicBean(em, null);
            hold = createHoldingsItemBeanV1(em);
            h2b = createHoldingsToBibliographicBean(em);

        }

        private Build holdings(IndexKeysList content) throws SQLException {
            hold.putIndexKeys(holdingsAgencyId, holdingsId, content, "t1");
            h2b.tryToAttachToBibliographicRecord(holdingsAgencyId, holdingsId, EnqueueCollector.VOID, QueueType.HOLDING);
            return this;
        }

        private Build record(IndexKeys content) throws SQLException {
            bibl.addBibliographicKeys(new BibliographicEntity(holdingsAgencyId, "katalog", holdingsId, "r:*", "work:1", "unit:1", false, content, "t0"), false);
            return this;
        }
    }
}
