package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class BibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private BibliographicBean bean;
    private EntityManager em;

    private final JSONBContext jsonbContext = new JSONBContext();

    @Before
    public void setupBean() {
        bean = new BibliographicBean();
        em = env().getEntityManager();
        bean.entityManager = em;
        bean.libraryConfig = new LibraryConfig() {
            @Override
            public LibraryType getLibraryType(int agencyId) {
                if (agencyId >= 800000) return LibraryType.NonFBS;
                if (agencyId < 400000) return LibraryType.FBSSchool;
                return LibraryType.FBS;
            }
        };
        bean.h2bBean = new HoldingsToBibliographicBean();
        bean.h2bBean.entityManager = em;
        bean.h2bBean.libraryConfig = bean.libraryConfig;
        executeScriptResource("/bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        String b870970 = makeBibliographicRequestJson(870970);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b870970)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 870970),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 870970),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b700000 = makeBibliographicRequestJson(700000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b700000)
                );

        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 870970),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b300100 = makeBibliographicRequestJson(300100);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b300100)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 300100),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b300000 = makeBibliographicRequestJson(300000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b300000)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 300100),
                   new HoldingsToBibliographicEntity(300200, "new", 300000)
           ));
    }

    @Test
    public void updateNonFbsLibrary() throws JSONBException {
        String json = makeBibliographicRequestJson(800000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, contains(( new HoldingsToBibliographicEntity(800000, "new", 800000) )));
    }

    @Test
    public void updateNonFbsLibraryWithNoHolding() throws JSONBException {
        String json = makeBibliographicRequestJson(888000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(0));
    }

    @Test
    public void supercedsAdd() throws Exception {

        String json = makeBibliographicRequestJson(
               888000,
               e -> {
           e.superceds = Arrays.asList("a", "b");
       });

        Response r = env().getPersistenceContext()
                 .run(() -> bean.addBibliographicKeys(null, json));
        assertThat(r.getStatus(), is(200));
        List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b WHERE b2b.currentRecordId='new'", BibliographicToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(2));
        Assert.assertTrue("One superceded named 'a'", l.stream().anyMatch(b2b -> b2b.decommissionedRecordId.equals("a")));
        Assert.assertTrue("One superceded named 'b'", l.stream().anyMatch(b2b -> b2b.decommissionedRecordId.equals("b")));
    }

    private String makeBibliographicRequestJson(int agency) throws JSONBException {
        return makeBibliographicRequestJson(agency, e -> {
                                    });
    }

    private String makeBibliographicRequestJson(int agency, Consumer<BibliographicEntityRequest> modifier) throws JSONBException {
        BibliographicEntityRequest entity1 = new BibliographicEntityRequest();
        entity1.agencyId = agency;
        entity1.bibliographicRecordId = "new";
        entity1.unit = "u";
        entity1.work = "w";
        entity1.trackingId = "IT";
        BibliographicEntityRequest entity = entity1;
        modifier.accept(entity);
        return jsonbContext.marshall(entity);
    }

}
