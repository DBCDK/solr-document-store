/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-worker
 *
 * dbc-solr-doc-store-worker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-worker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.cloud.worker;

import java.io.StringReader;
import java.util.HashSet;
import java.util.Iterator;
import javax.ejb.Stateless;
import javax.xml.namespace.NamespaceContext;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.DOMException;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
public class OtherRecordIds {

    private static final Logger log = LoggerFactory.getLogger(OtherRecordIds.class);

    /**
     * Hardcoded namespace context for known namespaces in corepo
     */
    private static final NamespaceContext NAMESPACE_CONTEXT = new NamespaceContext() {
        @Override
        public String getNamespaceURI(String prefix) {
            switch (prefix) {
                case "foxml":
                    return "info:fedora/fedora-system:def/foxml#";
                case "marcx":
                    return "info:lc/xmlns/marcxchange-v1";
                case "ting":
                    return "http://www.dbc.dk/ting";
                case "ac":
                    return "http://biblstandard.dk/ac/namespace/";
                case "dc":
                    return "http://purl.org/dc/elements/1.1/";
                case "dcterms":
                    return "http://purl.org/dc/terms/";
                case "dkabm":
                    return "http://biblstandard.dk/abm/namespace/dkabm/";
                case "dkdcplus":
                    return "http://biblstandard.dk/abm/namespace/dkdcplus/";
                case "docbook":
                    return "http://docbook.org/ns/docbook";
                case "oss":
                    return "http://oss.dbc.dk/ns/osstypes";
                default:
                    return null;
            }
        }

        @Override
        public String getPrefix(String namespaceURI) {
            throw new UnsupportedOperationException("Not supported yet.");
        }

        @Override
        public Iterator getPrefixes(String namespaceURI) {
            throw new UnsupportedOperationException("Not supported yet.");
        }

    };

    private static final String XPATH_marc002a
                                = "/*" +
                                  "/foxml:datastream[@ID='commonData' and @STATE='A']" +
                                  "/foxml:datastreamVersion" +
                                  "/foxml:xmlContent" +
                                  "/ting:container" +
                                  "/marcx:collection" +
                                  "/marcx:record[@type='Bibliographic']" +
                                  "/marcx:datafield[@tag='002']" +
                                  "/marcx:subfield[@code='a']" +
                                  "/text()";

    private static final XPathFactory X_PATH_FACTORY = makeXPathFactory();

    /**
     * List all marc 002 a field values from an FoXML document
     *
     * @param foXml (fedora object xml)
     * @return list of 002a values (superceded by)
     * @throws DOMException in case of xml errors
     */
    public HashSet<String> fromFoXML(String foXml) throws DOMException {
        HashSet<String> marc002a = new HashSet<>();
        try {
            XPath xpath = X_PATH_FACTORY.newXPath();
            xpath.setNamespaceContext(NAMESPACE_CONTEXT);
            try (StringReader reader = new StringReader(foXml)) {
                NodeList nodes = (NodeList) xpath.evaluate(XPATH_marc002a,
                                                           new InputSource(reader),
                                                           XPathConstants.NODESET);
                for (int i = 0 ; i < nodes.getLength() ; i++) {
                    Node item = nodes.item(i);
                    String nodeValue = item.getNodeValue();
                    marc002a.add(nodeValue);
                }
            }
        } catch (XPathExpressionException ex) {
            log.error("Error parsing foXml: {}", ex.getMessage());
            log.debug("Error parsing foXml:", ex);
        }
        return marc002a;
    }

    private static XPathFactory makeXPathFactory() {
        synchronized (XPathFactory.class) {
            XPathFactory instance = XPathFactory.newInstance();
            return instance;
        }

    }
}
