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

import java.util.Properties;
import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
@Startup
public class Config {

    private static final Logger log = LoggerFactory.getLogger(Config.class);

    private String solrUrl;
    private String solrDocStoreUrl;

    @PostConstruct
    public void method() {
        Properties props = findProperties("solr-doc-store-updater");
        solrUrl = props.getProperty("corepoSolrUrl", System.getenv("COREPO_SOLR_URL"));
        solrDocStoreUrl = props.getProperty("solrDocStoreUrl", System.getenv("SOLR_DOC_STORE_URL"));
    }

    public String getSolrUrl() {
        return solrUrl;
    }

    public String getSolrDocStoreUrl() {
        return solrDocStoreUrl;
    }

    private Properties findProperties(String resourceName) {
        try {
            Object loopup = InitialContext.doLookup(resourceName);
            if (loopup instanceof Properties) {
                return (Properties) loopup;
            } else {
                throw new NamingException("Found " + resourceName + ", but not of type Properties of type: " + loopup.getClass().getTypeName());
            }
        } catch (NamingException ex) {
            log.error("Exception: {}", ex.getMessage());
        }
        return new Properties();
    }

}
