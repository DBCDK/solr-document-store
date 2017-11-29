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
                switch (agencyId) {
                    case 800000:
                        return LibraryType.NonFBS;
                    case 300100:
                        return LibraryType.FBSSchool;
                    default:
                        return LibraryType.FBS;
                }
            }
        };


        executeScriptResource("/bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        BibliographicEntity entity = getBibliographicEntity(870970);

        String json = jsonbContext.marshall(entity);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(new HoldingsToBibliographicEntity(700000, "new", 870970)));
    }


    @Test
    public void updateNonFbsLibrary() throws JSONBException {
        BibliographicEntity entity = getBibliographicEntity(800000);

        String json = jsonbContext.marshall(entity);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(1));
        assertThat(l.get(0), is(new HoldingsToBibliographicEntity(800000, "new", 800000)));

    }


    private BibliographicEntity getBibliographicEntity(int agency) {
        BibliographicEntity entity = new BibliographicEntity();
        entity.agencyId = agency;
        entity.bibliographicRecordId = "new";
        entity.unit = "u";
        entity.work = "w";
        entity.commitWithin = 1000;
        entity.trackingId = "IT";
        return entity;
    }

}
