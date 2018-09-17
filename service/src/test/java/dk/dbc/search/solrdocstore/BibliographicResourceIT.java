package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.junit.Before;
import org.junit.Test;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.ws.rs.core.Response;
import java.util.List;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.createResourceBean;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class BibliographicResourceIT  extends JpaSolrDocStoreIntegrationTester {
    EntityManager em;
    ResourceBean bean;
    JSONBContext jsonbContext = new JSONBContext();

    @Before
    public void before() {
        // Setup bean
        em = env().getEntityManager();
        bean = createResourceBean(jpaTestEnvironment);

        // Setup records
        executeScriptResource("/resource.sql");
    }
    @Test
    public void testAddResource() throws JSONBException {
        AddResourceRequest request = new AddResourceRequest(870970, "hasCoverUrl", "23556455", true);
        bean.addResource(jsonbContext.marshall(request));
        TypedQuery<BibliographicResourceEntity> query = em.createQuery(
                "SELECT r FROM BibliographicResourceEntity r WHERE r.agencyId=:agencyId AND " +
                        "r.bibliographicRecordId=:bibId AND r.field=:field", BibliographicResourceEntity.class);
        query.setParameter("agencyId", request.getAgencyId());
        query.setParameter("bibId", request.getBibliographicRecordId());
        query.setParameter("field", request.getField());
        assertEquals(query.getSingleResult(), request.asBibliographicResource());
    }

    @Test
    public void testGetResourcesByBibItem() {
        Response response = bean.getResourcesByBibItem(870970, "11111111");
        List<BibliographicResourceEntity> result = (List<BibliographicResourceEntity>) response.getEntity();
        assertThat(result, containsInAnyOrder(
                new BibliographicResourceEntity(870970, "hasCoverUrl", "11111111", true),
                new BibliographicResourceEntity(870970, "hasBackCoverUrl", "11111111", false),
                new BibliographicResourceEntity(870970, "includesCD", "11111111", true))
        );
    }
}
