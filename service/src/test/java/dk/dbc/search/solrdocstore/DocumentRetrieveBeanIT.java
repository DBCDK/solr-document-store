package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import org.hamcrest.Matchers;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class DocumentRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final ObjectMapper O = new ObjectMapper();

    private static final List<Map<String, List<String>>> DECOMMISSIONED = indexKeys("[{\"holdingsitem.status\":[\"Decommissioned\"]}]");
    private static final List<Map<String, List<String>>> ON_SHELF = indexKeys("[{\"holdingsitem.status\":[\"OnShelf\"]}]");
    private static final Map<String, List<String>> EXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"true\"]}");
    private static final Map<String, List<String>> NOTEXCLUDE = indexKeysB("{\"rec.excludeFromUnionCatalogue\":[\"false\"]}");
    private static final Map<String, List<String>> NOEXCLUDE = indexKeysB("{}");
    private static final Map<String, List<String>> EMPTY = indexKeysB("{}");
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
            bibl.addBibliographicKeys(new BibliographicEntity(COMMON_AGENCY, "basis", ID, "r:0", "w:0", "u:0", "v0", false, EMPTY, "t0"), Arrays.asList("CBA"), Optional.empty(), true);
        });
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

    private static List<Map<String, List<String>>> indexKeys(String json) {
        try {
            return O.readValue(json, new TypeReference<List<Map<String, List<String>>>>() {
                       });
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static Map<String, List<String>> indexKeysB(String json) {
        try {
            return O.readValue(json, new TypeReference<Map<String, List<String>>>() {
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

    private static final Optional<Integer> NOW = Optional.ofNullable(null);

    private class Build {

        private final int holdingsAgencyId;
        private final String holdingsId;

        private Build(int holdingsAgencyId, String holdingsId) {
            this.holdingsAgencyId = holdingsAgencyId;
            this.holdingsId = holdingsId;
            em.persist(makeOpenAgencyEntity(holdingsAgencyId));
        }

        private Build holdings(List<Map<String, List<String>>> content) {
            hold.setHoldingsKeys(new HoldingsItemEntity(holdingsAgencyId, holdingsId, "v0", content, "t1"), NOW);
            h2b.tryToAttachToBibliographicRecord(holdingsAgencyId, holdingsId);
            return this;
        }

        private Build record(Map<String, List<String>> content) {
            bibl.addBibliographicKeys(new BibliographicEntity(holdingsAgencyId, "katalog", holdingsId, "r:*", "w:*", "u:*", "v0", false, content, "t0"), Collections.EMPTY_LIST, Optional.empty(), true);
            return this;
        }
    }

}
