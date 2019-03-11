package dk.dbc.search.solrdocstore.updater;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.CloudSolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class SolrApi {

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
            return new HttpSolrClient.Builder(solrUrl)
                    .build();
        }
    }

}
