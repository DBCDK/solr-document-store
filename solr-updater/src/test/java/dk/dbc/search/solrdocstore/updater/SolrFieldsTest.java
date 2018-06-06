/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import java.io.InputStream;
import java.net.URI;
import javax.ejb.EJBException;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class SolrFieldsTest {

    public SolrFieldsTest() {
    }

    @Test
    public void testIsKnownField() throws Exception {
        System.out.println("isKnownField");

        SolrFields solrFields = newSolrFields("schema.xml", "http://some.crazy.host/with/a/strange/path");

        assertTrue("field", solrFields.isKnownField("_version_"));
        assertTrue("dynamicField", solrFields.isKnownField("facet.fool"));
        assertFalse("Unknown field", solrFields.isKnownField("foo"));
    }

    public static SolrFields newSolrFields(String schemaXmlLocation, String url) {
        SolrFields solrFields = new SolrFields() {
            @Override
            InputStream getSchemaXml(URI uri) throws EJBException {
                return SolrFieldsTest.class.getClassLoader().getResourceAsStream(schemaXmlLocation);
            }
        };
        solrFields.config = new Config("queues=NONE",
                                       "solrDocStoreUrl=NONE",
                                       "solrUrl=" + url,
                                       "openAgencyUrl=Not-Relevant");

        solrFields.init();

        return solrFields;
    }

    /**
     * Run by hand with a known zk://
     * <p>
     * Setting up a solr cloud for integration testing is overkill
     */
    @Test
    @Ignore
    public void testZkUrl() {
        String solrUrl = "zk://[hosts]/[chroot]/[collection]";

        SolrFields solrFields = new SolrFields();
        solrFields.config = new Config("solrUrl=" + solrUrl);

        solrFields.init();

        System.out.println("OK");
        fail("OK");
    }
}
