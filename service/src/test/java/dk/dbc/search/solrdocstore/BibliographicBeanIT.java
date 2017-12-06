package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.util.List;

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
            LibraryType getLibraryType(int agencyId) {
                if (agencyId >= 800000) return LibraryType.NonFBS;
                if (agencyId < 400000) return LibraryType.FBSSchool;
                return LibraryType.FBS;
            }
        };


        executeScriptResource("/bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        String b870970 = getBibliographicRequestJson(870970);

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

        String b700000 = getBibliographicRequestJson(700000);

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


        String b300100 = getBibliographicRequestJson(300100);

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


        String b300000 = getBibliographicRequestJson(300000);

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
        String json = getBibliographicRequestJson(800000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(1));
        assertThat(l.get(0), is(new HoldingsToBibliographicEntity(800000, "new", 800000)));

    }


    private String getBibliographicRequestJson(int agency) throws JSONBException {
        BibliographicEntity entity = new BibliographicEntity();
        entity.agencyId = agency;
        entity.bibliographicRecordId = "new";
        entity.unit = "u";
        entity.work = "w";
        entity.trackingId = "IT";
        return jsonbContext.marshall(entity);
    }

}
