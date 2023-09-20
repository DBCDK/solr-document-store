package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import org.junit.Test;
import jakarta.ws.rs.core.Response;
import java.util.List;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ResourceBeanTest extends BeanTester {

    private static final String BIB_ID = "23556455";

    @Test
    public void testAddResource() throws Exception {
        System.out.println("testAddResource");

        persist(openAgencyEntityCommonAgency);
        Doc.AddResourceRequestBuilder builder = Doc.resource(LibraryType.COMMON_AGENCY, BIB_ID).field("hasCoverUrl");
        BibliographicResourceEntity entity = builder.entity();
        String request = builder.json();
        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(request);
            assertThat(resp.getStatus(), is(200));
        });
        jpa(em -> {
            BibliographicResourceEntity dbEntity = em.find(BibliographicResourceEntity.class, entity.asKey());
            assertThat(dbEntity, is(entity));
        });
    }

    @Test(timeout = 2_000L)
    public void testAddResourceOntoDeleted() throws Exception {
        System.out.println("testAddResourceOntoDeleted");

        persist(new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).deleted());
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(Doc.resource(800000, BIB_ID).field("hasCoverUrl").json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), empty());
    }

    @Test
    public void testAddNonFBSdResourceEnqueue() {
        System.out.println("testAddNonFBSdResourceEnqueue");

        persist(new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).classifier("classifier1").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).classifier("classifier2").indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).classifier("classifier3").indexKeys(filler -> filler.add("id", BIB_ID)));
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(Doc.resource(800000, BIB_ID).field("hasCoverUrl").json());
            assertThat(resp.getStatus(), is(200));
        });

        // Only enqueues its own items
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,800000-classifier1:23556455",
                   "a,800000-classifier2:23556455",
                   "a,800000-classifier3:23556455",
                   "b,unit:1",
                   "c,work:1"));
    }

    @Test
    public void testAddCommonSharedResourceEnqueue() {
        System.out.println("testAddCommonSharedResourceEnqueue");
        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, "x").indexKeys(filler -> filler.add("id", "x")),
                Doc.bibliographic(800000, "x").indexKeys(filler -> filler.add("id", "x")));
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(Doc.resource(COMMON_AGENCY, BIB_ID).field("hasCoverUrl").json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:23556455",
                   "a,700000-katalog:23556455",
                   "b,unit:1",
                   "c,work:1"));
    }

    @Test
    public void testAddFBSSharedResourceEnqueue() {
        System.out.println("testAddFBSSharedResourceEnqueue");
        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, "x").indexKeys(filler -> filler.add("id", "x")),
                Doc.bibliographic(800000, "x").indexKeys(filler -> filler.add("id", "x")));
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(Doc.resource(700000, BIB_ID).field("hasCoverUrl").json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-basis:23556455",
                   "a,700000-katalog:23556455",
                   "b,unit:1",
                   "c,work:1"));
    }

    @Test
    public void testAddNonFBSSharedResourceEnqueue() {
        System.out.println("testAddNonFBSSharedResourceEnqueue");
        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, "x").indexKeys(filler -> filler.add("id", "x")),
                Doc.bibliographic(800000, "x").indexKeys(filler -> filler.add("id", "x")));
        stdQueueRules();

        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .addResource(Doc.resource(800000, BIB_ID).field("hasCoverUrl").json());
            assertThat(resp.getStatus(), is(200));
        });
        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,800000-katalog:23556455",
                   "b,unit:1",
                   "c,work:1"));
    }

    @Test
    public void testGetResourcesByBibItem() {
        System.out.println("testGetResourcesByBibItem");
        persist(openAgencyEntityCommonAgency,
                new OpenAgencyEntity(700000, LibraryType.FBS, true, false, false),
                new OpenAgencyEntity(800000, LibraryType.NonFBS, false, false, false),
                Doc.bibliographic(BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(800000, BIB_ID).indexKeys(filler -> filler.add("id", BIB_ID)),
                Doc.bibliographic(700000, "x").indexKeys(filler -> filler.add("id", "x")),
                Doc.bibliographic(800000, "x").indexKeys(filler -> filler.add("id", "x")),
                new BibliographicResourceEntity(870970, BIB_ID, "hasCoverUrl", true),
                new BibliographicResourceEntity(870970, BIB_ID, "hasBackCoverUrl", false),
                new BibliographicResourceEntity(870970, BIB_ID, "includesCD", true));
        bean(bf -> {
            Response resp = bf.resourceBeanV2()
                    .getResourcesByBibItem(870970, BIB_ID);
            assertThat(resp.getStatus(), is(200));
            List<BibliographicResourceEntity> result = (List<BibliographicResourceEntity>) resp.getEntity();
            assertThat(result, containsInAnyOrder(new BibliographicResourceEntity(870970, BIB_ID, "hasCoverUrl", true),
                                                  new BibliographicResourceEntity(870970, BIB_ID, "hasBackCoverUrl", false),
                                                  new BibliographicResourceEntity(870970, BIB_ID, "includesCD", true)));
        });
    }
}
