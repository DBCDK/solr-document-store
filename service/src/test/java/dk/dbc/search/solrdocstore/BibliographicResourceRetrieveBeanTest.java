package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import java.util.List;
import org.junit.Test;

import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class BibliographicResourceRetrieveBeanTest extends BeanTester {

    @Test(timeout = 2_000L)
    public void testCase() throws Exception {
        System.out.println("testCase");

        persist(new OpenAgencyEntity(888888, LibraryType.NonFBS, true, true, true),
                new OpenAgencyEntity(710100, LibraryType.FBS, true, true, true),
                new OpenAgencyEntity(310100, LibraryType.FBS, true, true, true),
                new BibliographicResourceEntity(888888, "a", "foo", true),
                new BibliographicResourceEntity(710100, "a", "foo", true),
                new BibliographicResourceEntity(710100, "a", "bar", false),
                new BibliographicResourceEntity(710100, "no", "bar", false),
                new BibliographicResourceEntity(310100, "a", "foo", false));

        bean(bf -> {
            List<BibliographicResourceEntity> resources = bf.bibliographicResourceRetrieveBean()
                    .getResourcesFor(710100, "a");

            assertThat(resources, containsInAnyOrder(
                       new BibliographicResourceEntity(710100, "a", "foo", true),
                       new BibliographicResourceEntity(710100, "a", "bar", false)));
        });

        bean(bf -> {
            List<BibliographicResourceEntity> resources = bf.bibliographicResourceRetrieveBean()
                    .getResourcesForCommon("a");

            assertThat(resources, containsInAnyOrder(
                       new BibliographicResourceEntity(710100, "a", "foo", true),
                       new BibliographicResourceEntity(710100, "a", "bar", false),
                       new BibliographicResourceEntity(310100, "a", "foo", false)));
        });
    }
}
