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

import javax.jms.Destination;
import javax.jms.JMSContext;
import javax.jms.JMSProducer;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.SolrInputField;
import static org.junit.Assert.*;
import org.junit.Test;
import org.mockito.ArgumentMatcher;
import static org.mockito.Matchers.refEq;
import static org.mockito.Matchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptableObject;

public class SolrUpdaterCallbackTest {

    private final String pid = "obj:1";
    private final JMSContext mockContext = mock(JMSContext.class);
    private final Destination mockQueue = mock(Destination.class);

    @Test
    public void testConstructor_OK() {
        new SolrUpdaterCallback(pid, mockContext, mockQueue);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullPid() {
        new SolrUpdaterCallback(null, mockContext, mockQueue);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testConstructor_throwsOnEmptyPid() {
        new SolrUpdaterCallback("", mockContext, mockQueue);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullContext() {
        new SolrUpdaterCallback(pid, null, mockQueue);
    }

    @Test(expected = NullPointerException.class)
    public void testConstructor_throwsOnNullResponseQueue() {
        new SolrUpdaterCallback(pid, mockContext, null);
    }

    @Test(expected = NullPointerException.class)
    public void testAddDocument_throwsOnNullDocument() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.addDocument(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAddDocument_throwsOnIndexIsNotAnArray() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.addDocument(new Object());
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAddDocument_throwsOnArrayContainingNonNativeObjectElement() {
        NativeArray array = new NativeArray(new Object[] {new Object()});
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.addDocument(array);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutNameField() {
        NativeObject field = new NativeObject();
        field.defineProperty( "value", "SomeValue", ScriptableObject.DONTENUM );
        NativeArray array = new NativeArray(new Object[] {field});
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.addDocument(array);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testAddDocument_throwsOnArrayContainingObjectWithoutValueField() {
        NativeObject field = new NativeObject();
        field.defineProperty( "name", "SomeName", ScriptableObject.DONTENUM );
        NativeArray array = new NativeArray(new Object[] {field});
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.addDocument(array);
    }

    @Test
    public void testAddDocument_acceptsIndex() {
        NativeObject field = new NativeObject();
        field.defineProperty( "name", "SomeName", ScriptableObject.DONTENUM );
        field.defineProperty( "value", "SomeValue", ScriptableObject.DONTENUM );
        NativeArray array = new NativeArray(new Object[] {field});

        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);

        JMSProducer mockProducer = mock(JMSProducer.class);
        when(mockContext.createProducer()).thenReturn(mockProducer);

        instance.addDocument(array);

        ArgumentMatcher<SolrInputDocument> documenMatcher = new ArgumentMatcher<SolrInputDocument>() {
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
        verify(mockProducer).send(refEq(mockQueue), argThat(documenMatcher));

        assertEquals(1, instance.getUpdatedDocumentsCount());
        assertEquals(0, instance.getDeletedDocumentsCount());
    }

    @Test(expected = NullPointerException.class)
    public void testDeleteDocument_throwsOnNullId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.deleteDocument(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testDeleteDocument_throwsOnEmptyId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        instance.deleteDocument("");
    }

    @Test
    public void testDeleteDocument_acceptsId() {
        SolrUpdaterCallback instance = new SolrUpdaterCallback(pid, mockContext, mockQueue);
        JMSProducer mockProducer = mock(JMSProducer.class);
        when(mockContext.createProducer()).thenReturn(mockProducer);
        String documentId = "document id";

        instance.deleteDocument(documentId);

        verify(mockProducer).send(mockQueue, documentId);

        assertEquals(0, instance.getUpdatedDocumentsCount());
        assertEquals(1, instance.getDeletedDocumentsCount());
    }


}
