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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class DocProducerTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Test of init method, of class DocProducer.
     */
    @Test
    public void test() throws Exception {
        System.out.println("test");

        DocProducer docProducer = new DocProducer() {
            @Override
            public JsonNode get(int agencyId, String bibliographicRecordId) throws IOException {
                String file = "DocProducerTest/" + agencyId + "-" + bibliographicRecordId + ".json";
                try (InputStream stream = DocProducerTest.class.getClassLoader().getResourceAsStream(file)) {
                    return OBJECT_MAPPER.readTree(stream);
                }
            }
        };
        docProducer.solrFields = SolrFieldsTest.newSolrFields("schema.xml", "http://some.crazy.host/with/a/strange/path");

        JsonNode node = docProducer.get(300101, "23645564");

        assertFalse(docProducer.isDeleted(node));

        SolrInputDocument document = docProducer.inputDocument(node);
        System.out.println("document = " + document);
        String xml = ClientUtils.toXML(document);
        assertTrue(document.containsKey("dkcclterm.po"));
        assertFalse(document.containsKey("unknown.field"));

        assertEquals(3, document.get("rec.holdingsAgencyId").getValues().size());
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300101"));
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300102"));
        assertTrue(document.get("rec.holdingsAgencyId").getValues().contains("300104"));
        assertTrue(document.get("rec.repositoryId").getValues().contains("300101-katalog:23645564"));

        String linkId = document.getField("rec.childDocId").getValue().toString();
        for (SolrInputDocument childDocument : document.getChildDocuments()) {
            assertEquals(linkId, childDocument.getField("parentDocId").getValue().toString());
        }
        System.out.println("OK");
//        fail("OK");
    }

    @Test
    public void trimTexts() throws Exception {
        JsonNode tree = OBJECT_MAPPER.readTree("{'a':['123','1234567890'],'b':['1234567890','567']}".replaceAll("'", "\""));
        DocProducer.trimIndexFieldsLength((ObjectNode) tree, 5);
        String text = OBJECT_MAPPER.writeValueAsString(tree);
        assertEquals("{'a':['123','12345'],'b':['12345','567']}".replaceAll("'", "\""), text);
    }

}
