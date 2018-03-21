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

import java.net.URISyntaxException;
import java.util.Collections;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class BibliographicRetrieveBeanIT extends JpaSolrDocStoreIntegrationTester {

    private EntityManager em;
    private BibliographicRetrieveBean bean;

    public BibliographicRetrieveBeanIT() {
    }

    @Before
    public void setupBean() throws URISyntaxException {
        em = env().getEntityManager();
        bean = createBibliographicRetrieveBean(env());
    }

    @Test
    public void migrateBibliographicEntityToClassifier() throws Exception {
        System.out.println("migrateBibliographicEntityToClassifier");

        env().getPersistenceContext().run(() -> {
            BibliographicEntity bibliographicEntity = new BibliographicEntity(777777, "UNKNOWN", "a", "w:1", "u:1", "V0", false, Collections.EMPTY_MAP, "T#1");
            em.persist(bibliographicEntity);
        });
        BibliographicEntity entity = env().getPersistenceContext().run(() -> {
            bean.migrateBibliographicEntityToClassifier(777777, "a", "clz");
            return em.find(BibliographicEntity.class, new AgencyClassifierItemKey(777777, "UNKNOWN", "a"));
        });
        System.out.println("entity = " + entity);
        assertNull(entity);
        BibliographicEntity newEntity = env().getPersistenceContext().run(() -> {
            bean.migrateBibliographicEntityToClassifier(777777, "a", "clz");
            return em.find(BibliographicEntity.class, new AgencyClassifierItemKey(777777, "clz", "a"));
        });
        System.out.println("newEntity = " + newEntity);
        assertNotNull(newEntity);
    }

}
