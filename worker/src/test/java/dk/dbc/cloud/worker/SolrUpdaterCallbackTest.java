/*
 * Copyright (C) 2014 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-cloud-indexer
 *
 * Solr-cloud-indexer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Solr-cloud-indexer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package dk.dbc.cloud.worker;

import dk.dbc.jslib.Environment;
import dk.dbc.solr.indexer.cloud.shared.DeleteMessage;
import java.util.ArrayList;
import javax.jms.JMSException;
import org.apache.solr.common.SolrInputDocument;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

public class SolrUpdaterCallbackTest {

    private final String pid = "obj:1";
    private final String trackingId = "Tracking ID";
    private Environment environment;

    @Before
    public void before() throws Exception {
        environment = new Environment();
    }

    @Test
    public void testConstructor_OK() {
        new SolrUpdaterCallback(environment, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullPid() {
        new SolrUpdaterCallback(environment, trackingId);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructor_throwsOnEmptyPid() {
        new SolrUpdaterCallback(environment, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnNullDocument() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.addDocument(null);
    }

    @Test(expected = ClassCastException.class)
    public void testAddDocument_throwsOnIndexIsNotAnArray() throws Exception {
        Object obj = environment.eval( "'foo'" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = IllegalStateException.class)
    public void testAddDocument_throwsOnArrayContainingNonNativeObjectElement() throws Exception {
        Object obj = environment.eval( "[ '' ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutNameField() throws Exception {
        Object obj = environment.eval( "[ { value: 'SomeValue' } ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutValueField() throws Exception {
        Object obj = environment.eval( "[ { name: 'SomeName' } ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.addDocument(obj);
    }

    @Test
    public void testAddDocument_acceptsIndex() throws Exception {
        Object obj = environment.eval( "[ { name: 'SomeName', value: 'SomeValue' }, { name: 'rec.bibliographicRecordId', value: 'someBibId' }, { name: 'id', value: 'someId' } ];" );

        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);

        instance.addDocument(obj);

        assertEquals(1, instance.getUpdatedDocumentsCount());
        assertEquals(0, instance.getDeletedDocumentsCount());
        ArrayList<SolrInputDocument> updatedDocuments = instance.getUpdatedDocuments();
        assertEquals(1, updatedDocuments.size());
        assertEquals("SomeValue", updatedDocuments.get(0).getField("SomeName").getValue());

    }

    @Test(expected = NullPointerException.class)
    public void testDeleteDocument_throwsOnNullId() throws JMSException {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.deleteDocument(null, null, "bibrecid");
    }

    @Test(expected = NullPointerException.class)
    public void testDeleteDocument_throwsOnNullStreamDate() throws JMSException {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.deleteDocument("pid", null, "bibrecid");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDeleteDocument_throwsOnEmptyId() throws JMSException {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.deleteDocument("", "2001", "bibrecid");
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDeleteDocument_throwsOnEmptyStreamDate() throws JMSException {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(environment, trackingId);
        instance.deleteDocument("pid", "", "bibrecid");
    }

    @Test
    public void testDeleteDocument_acceptsId() throws JMSException {
        SolrUpdaterCallback instance = new SolrUpdaterCallback( environment, trackingId );
        String documentId = "document id";
        String streamDate = "2001-01-02T12:34:56.789Z";
        String bibrecid = "bibrecid";

        instance.deleteDocument(documentId, streamDate, bibrecid);

        ArrayList<DeleteMessage> list = new ArrayList<>();
        list.add(new DeleteMessage( SolrUpdaterCallback.getShardedSolrId(bibrecid, documentId), streamDate));

        assertEquals( 0, instance.getUpdatedDocumentsCount() );
        assertEquals( 1, instance.getDeletedDocumentsCount() );
        assertEquals(list, instance.getDeletedDocuments());
    }
    
    @Test
    public void testGetShardedSolrId(){
        assertEquals( "bibid/32!solr-doc-id", SolrUpdaterCallback.getShardedSolrId("bibid", "solr-doc-id") );
    }
}
