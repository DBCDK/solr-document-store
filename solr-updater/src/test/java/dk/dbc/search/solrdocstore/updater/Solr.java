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

import java.io.File;
import java.net.URL;
import java.util.Properties;
import org.apache.commons.io.FileUtils;
import org.apache.solr.client.solrj.embedded.JettyConfig;
import org.apache.solr.client.solrj.embedded.JettySolrRunner;
import org.junit.rules.TemporaryFolder;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class Solr {

    private final File root;

    JettySolrRunner jetty;
    String solrUrl;

    public Solr(String port, URL resource, TemporaryFolder temp) throws Exception {
        root = temp.getRoot();
        File solrHome = new File(resource.toURI());
        FileUtils.deleteDirectory(root);
        FileUtils.copyDirectory(solrHome, root);

        System.setProperty("jetty.testMode", "true");

        JettyConfig jettyConfig = JettyConfig.builder()
                .setContext("/solr")
                .setPort(Integer.parseInt(port))
                .stopAtShutdown(true)
                .build();

        System.out.println("config = " + jettyConfig);
        Properties properties = new Properties();
        properties.setProperty("solr.data.dir", root.toString());

        jetty = new JettySolrRunner(root.toString(), properties, jettyConfig);
        jetty.start(true);
        solrUrl = jetty.getBaseUrl().toString();

    }

    public void stop() throws Exception {
        jetty.stop();
    }
}
