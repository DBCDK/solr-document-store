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

package dk.dbc.cloud.indexer;

import dk.dbc.opensearch.commons.fcrepo.FCRepoRestClientProvider;
import dk.dbc.opensearch.commons.fcrepo.RepositoryFactory;
import dk.dbc.opensearch.commons.fcrepo.rest.FCRepoRestClient;
import dk.dbc.opensearch.commons.repository.IRepositoryDAO;
import dk.dbc.opensearch.commons.repository.IRepositoryIdentifier;
import dk.dbc.opensearch.commons.repository.RepositoryException;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import javax.ejb.EJBException;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.jms.JMSContext;
import javax.transaction.TransactionSynchronizationRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class SolrIndexer {

    private static final Logger log = LoggerFactory.getLogger(SolrIndexer.class);

    private static final String REST_CLIENT_KEY = "restClient";

    @Resource
    TransactionSynchronizationRegistry transactionRegistry;

    @PostConstruct
    public void init() {
        FCRepoRestClientProvider fcRepoRestClientProvider = new FCRepoRestClientProvider() {
            @Override
            public FCRepoRestClient get() {
                // Lookup the actual rest client to use in the transaction registry
                FCRepoRestClient restClient = (FCRepoRestClient)transactionRegistry.getResource(REST_CLIENT_KEY);
                return restClient;
            }
        };
        RepositoryFactory.initializeFactory("CloudIndexer", fcRepoRestClientProvider);
    }

    @PreDestroy
    public void shutdown() {
        RepositoryFactory.getRepositoryDAO().shutdown();
    }

    @Lock(LockType.READ)
    public void buildDocuments(String pid, SolrIndexerJS jsWrapper, FCRepoRestClient restClient, String targetQueue, JMSContext responseContext) {
        // Make sure rest client is put in registry, so repository callback can access it
        transactionRegistry.putResource(REST_CLIENT_KEY, restClient);
        try {
            if (jsWrapper.isIndexableIdentifier(pid)) {
                String data = getObjectData(pid);
                SolrUpdaterCallback callback = new SolrUpdaterCallback(pid, responseContext, responseContext.createQueue(targetQueue));
                jsWrapper.createIndexData(pid, data, callback);
            } else {
                log.debug("object {} filtered", pid);
            }
        }
        catch (Exception ex) {
            String error = String.format("Error calling indexing logic for '%s'", pid);
            log.error(error);
            throw new EJBException(error, ex);
        }
        finally {
            transactionRegistry.putResource("restClient", null);
        }
    }

    private String getObjectData(String pid) throws IllegalStateException, RepositoryException {
        IRepositoryDAO repositoryDAO = RepositoryFactory.getRepositoryDAO();
        IRepositoryIdentifier identifier = repositoryDAO.createIdentifier(pid);
        String data = repositoryDAO.exportObject(identifier);
        return data;
    }
}
