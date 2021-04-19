package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.request.AddResourceRequest;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
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
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class BibliographicResourceIT extends JpaSolrDocStoreIntegrationTester {

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
        System.out.println("testAddResource");
        AddResourceRequest request = new AddResourceRequest(870970, "23556455", "hasCoverUrl", true);
        bean.addResource(jsonbContext.marshall(request));
        TypedQuery<BibliographicResourceEntity> query = em.createQuery(
                "SELECT r FROM BibliographicResourceEntity r WHERE r.agencyId=:agencyId AND " +
                "r.bibliographicRecordId=:bibId AND r.field=:field", BibliographicResourceEntity.class);
        query.setParameter("agencyId", request.getAgencyId());
        query.setParameter("bibId", request.getBibliographicRecordId());
        query.setParameter("field", request.getField());
        assertEquals(query.getSingleResult(), request.asBibliographicResource());
    }

    @Test(timeout = 2_000L)
    public void testAddResourceOntoDeleted() throws Exception {
        System.out.println("testAddResourceOntoDeleted");
        AddResourceRequest request = new AddResourceRequest(890890, "45454545", "hasCoverUrl", true);
        jpa(em -> {
            em.merge(new OpenAgencyEntity(890890, LibraryType.NonFBS, false, false, false));
            em.merge(new BibliographicEntity(890890, "classifier1", "45454545", "repo", null, null, true, null, "track:1"));
            bean.addResource(jsonbContext.marshall(request));
        });
        assertThat(queueContentAndClear(), empty());
    }

    @Test
    public void testAddNonFBSdResourceEnqueue() {
        System.out.println("testAddNonFBSdResourceEnqueue");
        AddResourceRequest request = new AddResourceRequest(890890, "45454545", "hasCoverUrl", true);
        jpa(em -> {
            em.merge(new OpenAgencyEntity(890890, LibraryType.NonFBS, false, false, false));
            em.merge(new BibliographicEntity(890890, "classifier1", "45454545", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicEntity(890890, "classifier2", "45454545", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicEntity(890890, "classifier3", "45454545", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicResourceEntity(890890, "45454545", "hasCoverUrl", true));
            bean.addResource(jsonbContext.marshall(request));
        });
        // Only enqueues its own items
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(890890, "classifier1", "45454545"),
                   queueItem(890890, "classifier2", "45454545"),
                   queueItem(890890, "classifier3", "45454545"),
                   queueItem("work:1")));
    }

    @Test
    public void testAddCommonResourceEnqueue() {
        System.out.println("testAddCommonResourceEnqueue");
        AddResourceRequest request = new AddResourceRequest(870970, "12121212", "hasCoverUrl", true);
        runCommonEnqueueTest(request);
    }

    @Test
    public void testAddSchoolCommonResourceEnqueue() {
        System.out.println("testAddSchoolCommonResourceEnqueue");
        AddResourceRequest request = new AddResourceRequest(300000, "12121212", "hasCoverUrl", true);
        runCommonEnqueueTest(request);
    }

    @Test
    public void testAddFBSResourceEnqueue() {
        System.out.println("testAddFBSResourceEnqueue");
        AddResourceRequest request = new AddResourceRequest(610610, "12121212", "hasCoverUrl", true);
        runCommonEnqueueTest(request);
    }

    @Test
    public void testAddFBSSchoolResourceEnqueue() {
        System.out.println("testAddFBSSchoolResourceEnqueue");
        AddResourceRequest request = new AddResourceRequest(312000, "12121212", "hasCoverUrl", true);
        runCommonEnqueueTest(request);
    }

    private void runCommonEnqueueTest(AddResourceRequest request) {
        jpa(em -> {
            // Setup
            em.merge(new OpenAgencyEntity(890890, LibraryType.NonFBS, false, false, false));
            em.merge(new OpenAgencyEntity(870970, LibraryType.NonFBS, false, false, false));
            em.merge(new OpenAgencyEntity(300000, LibraryType.NonFBS, false, false, false));
            em.merge(new OpenAgencyEntity(610610, LibraryType.FBS, false, false, false));
            em.merge(new OpenAgencyEntity(312000, LibraryType.FBSSchool, false, false, false));
            em.merge(new BibliographicEntity(870970, "classifier1", "12121212", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicEntity(300000, "classifier1", "12121212", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicEntity(610610, "classifier2", "12121212", "repo", "work:1", "unit:1", false, null, "track:1"));
            em.merge(new BibliographicEntity(312000, "classifier3", "12121212", "repo", "work:1", "unit:1", false, null, "track:1"));
            // Elements that should not be enqueued
            em.merge(new BibliographicEntity(312000, "classifier3", "21212121", "repo", "work:1", "unit:1", false, null, "track:1")); // Non-matching bibliographicRecordId
            em.merge(new BibliographicEntity(890890, "classifier3", "12121212", "repo", "work:1", "unit:1", false, null, "track:1")); // NonFBS should not be enqueued
            // Resource
            em.merge(new BibliographicResourceEntity(300000, "12121212", "hasCoverUrl", true));
            bean.addResource(jsonbContext.marshall(request));
        });
        // Enqueues all posts with the recordId, since they might inherit this value from common
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   queueItem(870970, "classifier1", "12121212"),
                   queueItem(300000, "classifier1", "12121212"),
                   queueItem(610610, "classifier2", "12121212"),
                   queueItem(312000, "classifier3", "12121212"),
                   queueItem("work:1")
           ));
    }

    @Test
    public void testGetResourcesByBibItem() {
        System.out.println("testGetResourcesByBibItem");
        Response response = bean.getResourcesByBibItem(870970, "11111111");
        List<BibliographicResourceEntity> result = (List<BibliographicResourceEntity>) response.getEntity();
        assertThat(result, containsInAnyOrder(new BibliographicResourceEntity(870970, "11111111", "hasCoverUrl", true),
                                              new BibliographicResourceEntity(870970, "11111111", "hasBackCoverUrl", false),
                                              new BibliographicResourceEntity(870970, "11111111", "includesCD", true))
        );
    }

    private String queueItem(int agency, String classifier, String bibliographicRecordId) {
        return "a," + agency + "-" + classifier + ":" + bibliographicRecordId;
    }

    private String queueItem(String work) {
        return "b," + work;
    }
}
