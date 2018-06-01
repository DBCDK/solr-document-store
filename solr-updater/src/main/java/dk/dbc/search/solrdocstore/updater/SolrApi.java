package dk.dbc.search.solrdocstore.updater;

import java.util.Arrays;
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
            CloudSolrClient.Builder builder = new CloudSolrClient.Builder()
                    .withZkHost(Arrays.asList(zkMatcher.group(1).split(",")));
            if (zkMatcher.group(2) != null) {
                builder.withZkChroot(zkMatcher.group(2));
            }
            CloudSolrClient solrClient = builder.build();

            solrClient.setDefaultCollection(zkMatcher.group(3));

            return solrClient;
        } else {
            return new HttpSolrClient.Builder(solrUrl)
                    .build();
        }
    }

}
