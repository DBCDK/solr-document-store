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

import dk.dbc.solrdocstore.updater.businesslogic.BusinessLogic;
import dk.dbc.solrdocstore.updater.businesslogic.FeatureSwitch;
import dk.dbc.solrdocstore.updater.businesslogic.KnownSolrFields;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.UriBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.Http2SolrClient;
import org.apache.solr.common.cloud.ClusterState;
import org.apache.solr.common.cloud.Replica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

/**
 * Only compare key is address of the solr collection (needed by Set&lt;&gt;) to
 * ensure only one description of a given collection
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class SolrCollection {

    private static final Logger log = LoggerFactory.getLogger(SolrCollection.class);

    private final SolrClient solrClient;
    private final KnownSolrFields solrFields;
    private final FeatureSwitch features;
    private final String collectionAddress;
    private final String name;
    private BusinessLogic businessLogic;

    // Only used in testing
    protected SolrCollection() {
        this.solrClient = null;
        this.solrFields = null;
        this.features = null;
        this.collectionAddress = null;
        this.name = null;
    }

    public static Function<String, SolrCollection> builderWithClient(Client client) {
        return solrUrl -> new SolrCollection(client, solrUrl);
    }

    /**
     * Extracts features from the url, fetches known fields
     *
     * @param client         http-clients for resolving known fields
     * @param solrUrl        url consisting of [collection address]=[featureset]
     * @param fieldsProvider function that given a http-client and a solr-client
     *                       resolves known fields in the solr-collection
     */
    private SolrCollection(Client client, String solrUrl, BiFunction<Client, SolrClient, KnownSolrFields> fieldsProvider) {
        int idx = solrUrl.indexOf('=');
        if (idx > 0) {
            this.collectionAddress = solrUrl.substring(0, idx);
            this.features = new FeatureSwitch(solrUrl.substring(idx + 1));
        } else {
            this.collectionAddress = solrUrl;
            this.features = new FeatureSwitch("all");
        }
        this.name = collectionAddress.substring(collectionAddress.lastIndexOf('/') + 1);
        this.solrClient = makeSolrClient(collectionAddress);
        this.solrFields = fieldsProvider.apply(client, solrClient);
    }

    /**
     *
     * @param client  http-clients for resolving known fields
     * @param solrUrl url consisting of [collection address]=[featureset]
     */
    public SolrCollection(Client client, String solrUrl) {
        this(client, solrUrl, SolrCollection::makeSolrFields);
    }

    public String getName() {
        return name;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public SolrClient getSolrClient() {
        return solrClient;
    }

    public KnownSolrFields getSolrFields() {
        return solrFields;
    }

    public FeatureSwitch getFeatures() {
        return features;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP")
    public BusinessLogic getBusinessLogic() {
        return businessLogic;
    }

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public void setBusinessLogic(BusinessLogic businessLogic) {
        this.businessLogic = businessLogic;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 59 * hash + Objects.hashCode(this.collectionAddress);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        final SolrCollection other = (SolrCollection) obj;
        return Objects.equals(this.collectionAddress, other.collectionAddress);
    }

    @Override
    public String toString() {
        return "SolrCollection{" + "solrClient=" + solrClient + ", solrFields=" + solrFields + ", features=" + features + ", collectionAddress=" + collectionAddress + ", name=" + name + '}';
    }

    /**
     * Find an url for any solr client, that should provide a schema.xml
     *
     * @param client Http or zookeeper client
     * @return url as string
     */
    private static String getHttpUrl(SolrClient client) {
        if (client instanceof Http2SolrClient) {
            return ( (Http2SolrClient) client ).getBaseURL();
        }
        if (client instanceof CloudSolrClient) {
            CloudSolrClient cloud = (CloudSolrClient) client;

            String collectionName = cloud.getDefaultCollection();
            ClusterState state = cloud.getClusterState();
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

    private static KnownSolrFields makeSolrFields(Client client, SolrClient solrClient) {
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
            return new KnownSolrFields(is);
        } catch (IOException | SAXException ex) {
            throw new IllegalStateException("Could not create SolrFields from: " + httpUrl, ex);
        }
    }

    private static final Pattern ZK = Pattern.compile("zk://([^/]*)(/.*)?/([^/]*)");

    public static SolrClient makeSolrClient(String solrUrl) {
        Matcher zkMatcher = ZK.matcher(solrUrl);
        if (zkMatcher.matches()) {
            Optional<String> zkChroot = Optional.empty();
            if (zkMatcher.group(2) != null) {
                zkChroot = Optional.of(zkMatcher.group(2));
            }
            List<String> zkHosts = Arrays.asList(zkMatcher.group(1).split(","));
            CloudSolrClient solrClient = new CloudSolrClient.Builder(zkHosts, zkChroot)
                    .build();

            solrClient.setDefaultCollection(zkMatcher.group(3));

            return solrClient;
        } else {
            return new Http2SolrClient.Builder(solrUrl)
                    .build();
        }
    }

}
