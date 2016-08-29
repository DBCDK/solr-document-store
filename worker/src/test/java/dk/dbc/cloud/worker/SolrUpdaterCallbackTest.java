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
import javax.jms.Destination;
import javax.jms.JMSContext;
import javax.jms.JMSProducer;
import javax.jms.ObjectMessage;
import jdk.nashorn.api.scripting.JSObject;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.SolrInputField;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentMatcher;
import static org.mockito.Matchers.refEq;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class SolrUpdaterCallbackTest {

    private final String pid = "obj:1";
    private final String trackingId = "Tracking ID";
    private final JMSContext mockContext = mock(JMSContext.class);
    private final Destination mockQueue = mock(Destination.class);
    private Environment environment;

    @Before
    public void before() throws Exception {
        environment = new Environment();
    }

    @Test
    public void testConstructor_OK() {
        new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullPid() {
        new SolrUpdaterCallback(null, environment, mockContext, mockQueue, trackingId);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructor_throwsOnEmptyPid() {
        new SolrUpdaterCallback("", environment, mockContext, mockQueue, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullContext() {
        new SolrUpdaterCallback(pid, environment, null, mockQueue, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullResponseQueue() {
        new SolrUpdaterCallback(pid, environment, mockContext, null, trackingId);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnNullDocument() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.addDocument(null);
    }

    @Test(expected = ClassCastException.class)
    public void testAddDocument_throwsOnIndexIsNotAnArray() throws Exception {
        Object obj = environment.eval( "'foo'" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = IllegalStateException.class)
    public void testAddDocument_throwsOnArrayContainingNonNativeObjectElement() throws Exception {
        Object obj = environment.eval( "[ '' ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutNameField() throws Exception {
        Object obj = environment.eval( "[ { value: 'SomeValue' } ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.addDocument(obj);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutValueField() throws Exception {
        Object obj = environment.eval( "[ { name: 'SomeName' } ];" );
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.addDocument(obj);
    }

    @Test
    public void testAddDocument_acceptsIndex() throws Exception {
        Object obj = environment.eval( "[ { name: 'SomeName', value: 'SomeValue' } ];" );

        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);

        JMSProducer mockProducer = mock(JMSProducer.class);
        when(mockContext.createProducer()).thenReturn(mockProducer);

        ArgumentMatcher<SolrInputDocument> documentMatcher = new ArgumentMatcher<SolrInputDocument>() {
            public boolean matches(Object argument) {
                if (! (argument instanceof SolrInputDocument)) {
                    return false;
                }
                SolrInputDocument document = (SolrInputDocument) argument;
                SolrInputField field = document.getField("SomeName");
                if (field == null) {
                    return false;
                }
                return field.getValue().equals("SomeValue");
            }
        };
        
        ObjectMessage mockMessage = mock(ObjectMessage.class);
        when(mockContext.createObjectMessage(argThat( documentMatcher ))).thenReturn(mockMessage);

        instance.addDocument(obj);

        verify(mockProducer).send(refEq(mockQueue), refEq(mockMessage));

        assertEquals(1, instance.getUpdatedDocumentsCount());
        assertEquals(0, instance.getDeletedDocumentsCount());
    }

    @Test(expected = NullPointerException.class)
    public void testDeleteDocument_throwsOnNullId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.deleteDocument(null, null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDeleteDocument_throwsOnEmptyId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        instance.deleteDocument("", null);
    }

    @Test
    public void testDeleteDocument_acceptsId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, environment, mockContext, mockQueue, trackingId);
        JMSProducer mockProducer = mock(JMSProducer.class);
        when(mockContext.createProducer()).thenReturn(mockProducer);
        String documentId = "document id";

        instance.deleteDocument(documentId, "2001-01-02T12:34:56.789Z");

        verify(mockProducer).send(mockQueue, documentId);

        assertEquals(0, instance.getUpdatedDocumentsCount());
        assertEquals(1, instance.getDeletedDocumentsCount());
    }


}
