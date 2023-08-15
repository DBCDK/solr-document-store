/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.logic.BibliographicResourceRetrieveBean;
import java.util.List;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class BibliographicResourceRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    @Test(timeout = 2_000L)
    public void testCase() throws Exception {
        System.out.println("testCase");

        jpa(em -> {
            em.merge(new OpenAgencyEntity(888888, LibraryType.NonFBS, true, true, true));
            em.merge(new OpenAgencyEntity(710100, LibraryType.FBS, true, true, true));
            em.merge(new OpenAgencyEntity(310100, LibraryType.FBS, true, true, true));

            em.merge(new BibliographicResourceEntity(888888, "a", "foo", true));
            em.merge(new BibliographicResourceEntity(710100, "a", "foo", true));
            em.merge(new BibliographicResourceEntity(710100, "a", "bar", false));
            em.merge(new BibliographicResourceEntity(710100, "no", "bar", false));
            em.merge(new BibliographicResourceEntity(310100, "a", "foo", false));
        });
        jpa(em -> {
            BibliographicResourceRetrieveBean bean = createBibliographicResourceRetrieveBean(em);
            List<BibliographicResourceEntity> resourcesFor = bean.getResourcesFor(710100, "a");
            System.out.println("resourcesFor = " + resourcesFor);

            assertThat(resourcesFor, containsInAnyOrder(
                       new BibliographicResourceEntity(710100, "a", "foo", true),
                       new BibliographicResourceEntity(710100, "a", "bar", false)
               ));
        });
        jpa(em -> {
            BibliographicResourceRetrieveBean bean = createBibliographicResourceRetrieveBean(em);
            List<BibliographicResourceEntity> resourcesForCommon = bean.getResourcesForCommon("a");
            System.out.println("resourcesForCommon = " + resourcesForCommon);
            assertThat(resourcesForCommon, containsInAnyOrder(
                       new BibliographicResourceEntity(710100, "a", "foo", true),
                       new BibliographicResourceEntity(710100, "a", "bar", false),
                       new BibliographicResourceEntity(310100, "a", "foo", false)
               ));
        });
    }
}
