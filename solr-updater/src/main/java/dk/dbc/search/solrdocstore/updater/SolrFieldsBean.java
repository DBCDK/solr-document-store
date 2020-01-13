package dk.dbc.search.solrdocstore.updater;

import java.io.InputStream;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.cloud.ClusterState;
import org.apache.solr.common.cloud.Replica;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Lock(LockType.READ)
public class SolrFieldsBean {

    private static final Logger log = LoggerFactory.getLogger(SolrFields.class);

    @Inject
    Config config;

    private Map<String, SolrFields> solrFields;

    @PostConstruct
    public void init() {
        log.info("Getting solr fields");
        this.solrFields = new ConcurrentHashMap<>();
        config.getSolrUrls().keySet()
                .forEach(this::getFieldsFor); // Load all known on startup
    }

    public SolrFields getFieldsFor(String solrUrl) {
        return solrFields.computeIfAbsent(solrUrl, s -> new SolrFields(config.getSolrUrls().get(s), this));
    }

    /**
     * Find an url for any solr client, that should provide a schema.xml
     *
     * @param client Http or zookeeper client
     * @return url as string
     */
    private String getHttpUrl(SolrClient client) {
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

    /**
     * Get inputstream of schema xml url
     *
     * @param client Http or zookeeper client
     * @return content stream of schema.xml
     */
    public InputStream getSchemaXml(SolrClient client) {
        String httpUrl = getHttpUrl(client);
        Client httpClient = config.getClient();
        URI uri = UriBuilder.fromPath(httpUrl)
                .path("admin/file")
                .queryParam("file", "schema.xml")
                .queryParam("appId", config.getAppId())
                .build();
        return httpClient
                .target(uri)
                .request(MediaType.APPLICATION_XML_TYPE)
                .get(InputStream.class);
    }

}
