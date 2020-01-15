/*
 * Copyright (C) 2020 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.ejb.EJBException;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.cloud.ClusterState;
import org.apache.solr.common.cloud.Replica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * Only compare key is solrUrl (needed by Set&lt;&gt;)
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class SolrCollection {

    private static final Logger log = LoggerFactory.getLogger(SolrCollection.class);

    private static final DocumentBuilder DOCUMENT_BUILDER = newDocumentBuilder();

    private final SolrClient solrClient;
    private final SolrFields solrFields;
    private final EnumSet<FeatureSwitch> features;
    private final String solrUrl;
    private final String name;

    SolrCollection() {
        this.solrClient = null;
        this.solrFields = null;
        this.features = null;
        this.solrUrl = null;
        this.name = null;
    }

    public static Function<String, SolrCollection> builderWithClient(Client client) {
        return solrUrl -> new SolrCollection(client, solrUrl);
    }

    public SolrCollection(Client client, String solrUrl, BiFunction<Client, SolrClient, SolrFields> fieldsProvider) {
        int idx = solrUrl.indexOf('=');
        if (idx > 0) {
            this.features = FeatureSwitch.featureSet(solrUrl.substring(idx));
            solrUrl = solrUrl.substring(0, idx - 1);
        } else {
            this.features = FeatureSwitch.featureSet("all");
        }
        this.solrUrl = solrUrl;
        this.name = solrUrl.substring(solrUrl.lastIndexOf('/') + 1);
        this.solrClient = SolrApi.makeSolrClient(solrUrl);
        this.solrFields = fieldsProvider.apply(client, solrClient);
    }

    public SolrCollection(Client client, String solrUrl) {
        this(client, solrUrl, SolrCollection::makeSolrFields);
    }

    public String getName() {
        return name;
    }

    public SolrClient getSolrClient() {
        return solrClient;
    }

    public SolrFields getSolrFields() {
        return solrFields;
    }

    public String getSolrUrl() {
        return solrUrl;
    }

    public boolean hasFeature(FeatureSwitch feature) {
        return features.contains(feature);
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 59 * hash + Objects.hashCode(this.solrUrl);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final SolrCollection other = (SolrCollection) obj;
        return Objects.equals(this.solrUrl, other.solrUrl);
    }

    @Override
    public String toString() {
        return "SolrCollection{" + "solrClient=" + solrClient + ", solrFields=" + solrFields + ", features=" + features + ", solrUrl=" + solrUrl + ", name=" + name + '}';
    }

    /**
     * Find an url for any solr client, that should provide a schema.xml
     *
     * @param client Http or zookeeper client
     * @return url as string
     */
    private static String getHttpUrl(SolrClient client) {
        if (client instanceof HttpSolrClient) {
            return ( (HttpSolrClient) client ).getBaseURL();
        }
        if (client instanceof CloudSolrClient) {
            CloudSolrClient cloud = (CloudSolrClient) client;

            String collectionName = cloud.getDefaultCollection();
            ClusterState state = cloud.getZkStateReader().getClusterState();
            Set<String> nodes = state.getLiveNodes();
            if (nodes.isEmpty()) {
                throw new IllegalArgumentException("Zookeeper don't know about live nodes");
            }

            List<Replica> liveReplicas = state.getCollection(collectionName)
                    .getReplicas()
                    .stream()
                    .filter(r -> nodes.contains(r.getNodeName()))
                    .collect(Collectors.toList());
            if (liveReplicas.isEmpty()) {
                throw new IllegalArgumentException("Zookeeper don't know any live replicas");
            }

            Replica replica = liveReplicas.get((int) Math.floor(Math.random() * liveReplicas.size()));
            return replica.getBaseUrl() + "/" + collectionName;
        }
        throw new IllegalStateException("Don't know about this solr client type: " + client.getClass().getSimpleName());
    }

    private static SolrFields makeSolrFields(Client client, SolrClient solrClient) {
        String httpUrl = getHttpUrl(solrClient);
        URI uri = UriBuilder.fromPath(httpUrl)
                .path("admin/file")
                .queryParam("file", "schema.xml")
                .build();
        log.debug("fetching file: {}", uri);
        try (InputStream is = client
                .target(uri)
                .request(MediaType.APPLICATION_XML_TYPE)
                .get(InputStream.class)) {
            Document doc = docFromStream(is);
            return new SolrFields(doc);
        } catch (IOException | SAXException ex) {
            throw new IllegalStateException("Could not create SolrFields from: " + httpUrl, ex);
        }
    }

    static Document docFromStream(InputStream is) throws IOException, SAXException {
        return DOCUMENT_BUILDER.parse(is);
    }

    /**
     * Construct an xml parser
     *
     * @return new document builder
     */
    private static DocumentBuilder newDocumentBuilder() {
        try {
            synchronized (DocumentBuilderFactory.class) {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                factory.setIgnoringComments(true);
                factory.setNamespaceAware(true);
                factory.setCoalescing(true);
                factory.setIgnoringElementContentWhitespace(true);
                factory.setValidating(false);
                factory.setXIncludeAware(false);
                return factory.newDocumentBuilder();
            }
        } catch (ParserConfigurationException ex) {
            throw new EJBException("Error making a XML parser", ex);
        }
    }

}
