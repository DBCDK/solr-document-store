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

import com.codahale.metrics.Counter;
import com.codahale.metrics.MetricRegistry;
import dk.dbc.corepo.access.ee.CORepoProviderEE;
import dk.dbc.log.DBCTrackedLogContext;
import dk.dbc.openagency.client.LibraryRuleHandler;
import dk.dbc.openagency.client.OpenAgencyServiceFromURL;
import dk.dbc.opensearch.commons.repository.IRepositoryDAO;
import dk.dbc.opensearch.commons.repository.IRepositoryIdentifier;
import dk.dbc.opensearch.commons.repository.ISysRelationsStream;
import dk.dbc.opensearch.commons.repository.RepositoryException;
import dk.dbc.opensearch.commons.repository.RepositoryProvider;
import dk.dbc.solr.indexer.cloud.shared.LogAppender;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.sql.SQLException;
import java.util.function.BiConsumer;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.naming.NamingException;

import static net.logstash.logback.marker.Markers.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Startup
@Singleton
public class SolrIndexer {

    private static final Logger log = LoggerFactory.getLogger(SolrIndexer.class);

    @Inject
    @EEConfig.Name("resourceBase")
    private String resourceBase;

    @Inject
    @EEConfig.Name("jmxDomain")
    private String jmxDomain;

    @Inject
    @EEConfig.Name("openAgencyUrl")
    private String openAgencyUrl;

    private RepositoryProvider daoProvider;

    @EJB
    MetricsRegistry registry;

    LibraryRuleHandler libraryRuleHandler;

    Counter documentsUpdated;
    Counter documentsDeleted;

    @PostConstruct
    public void init() {
        documentsUpdated = registry.getRegistry().counter(MetricRegistry.name(SolrIndexer.class, "documentsUpdated"));
        documentsDeleted = registry.getRegistry().counter(MetricRegistry.name(SolrIndexer.class, "documentsDeleted"));
        libraryRuleHandler = OpenAgencyServiceFromURL.builder().connectTimeout(30000).requestTimeout(30000)
                .build(openAgencyUrl).libraryRules();

        if (resourceBase != null) {
            try {
                daoProvider = new CORepoProviderEE(jmxDomain, resourceBase);
            } catch (NamingException | SQLException ex) {
                throw new EJBException("Failed to initialize repository provider " + resourceBase, ex);
            }
        }
    }

    @PreDestroy
    public void shutdown() {
        log.info("Shutting down SolrIndexer");
        if (daoProvider != null) {
            daoProvider.shutdown();
        }
    }

    @Lock(LockType.READ)
    @SuppressFBWarnings(value = "ICAST_IDIV_CAST_TO_DOUBLE", justification = "trimming of number of digits for LogStash.Marker#append()")
    public void buildDocuments(String pid, SolrIndexerJS jsWrapper, BiConsumer<String, SolrUpdaterCallback> function) throws Exception {
        try (IRepositoryDAO dao = daoProvider.getRepository()) {
            if (jsWrapper.isIndexableIdentifier(pid)) {
                long starttime = System.nanoTime();
                String trackingId = getTrackingId(dao, pid);
                DBCTrackedLogContext.setTrackingId(trackingId);

                String data = getObjectData(dao, pid);
                SolrUpdaterCallback callback = new SolrUpdaterCallback(jsWrapper.getEnvironment(), trackingId, pid);
                jsWrapper.createIndexData(dao, pid, data, callback, libraryRuleHandler);
                documentsDeleted.inc(callback.getDeletedDocumentsCount());
                documentsUpdated.inc(callback.getUpdatedDocumentsCount());

                if (callback.getDeletedDocumentsCount() > 0 || callback.getUpdatedDocumentsCount() > 0) {
                    function.accept(data, callback);
                } else {
                    log.info("Indexing {} skipped by javascript", pid);
                }
                long endtime = System.nanoTime();
                log.info(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.SUCCEDED).and(
                        append("duration", ( ( endtime - starttime ) / 10000L ) / 100.0)).and(
                        append("updates", callback.getUpdatedDocumentsCount())).and(
                        append("deletes", callback.getDeletedDocumentsCount())),
                         "Documents successfully build");
            } else {
                log.debug("object {} filtered", pid);
            }
        } catch (Exception ex) {
            String error = String.format("Error calling indexing logic for '%s'", pid);
            log.error(LogAppender.getMarker(App.APP_NAME, pid, LogAppender.FAILED), error);
            throw ex;
        } finally {
            DBCTrackedLogContext.remove();
        }
    }

    @Lock(LockType.READ)
    public String unitFor(String pid) throws RepositoryException {
        try (IRepositoryDAO dao = daoProvider.getRepository()) {
            ISysRelationsStream relations = dao.getSysRelationsStream(dao.createIdentifier(pid));
            IRepositoryIdentifier unit = relations.getUnitFor();
            return unit.toString();
        }
    }

    @Lock(LockType.READ)
    public String workFor(String unit) throws RepositoryException {
        try (IRepositoryDAO dao = daoProvider.getRepository()) {
            ISysRelationsStream relations = dao.getSysRelationsStream(dao.createIdentifier(unit));
            IRepositoryIdentifier work = relations.getWorkFor();
            return work.toString();
        }
    }

    private String getObjectData(IRepositoryDAO repositoryDAO, String pid) throws IllegalStateException, RepositoryException {
        IRepositoryIdentifier identifier = repositoryDAO.createIdentifier(pid);
        String data = repositoryDAO.exportObject(identifier);
        return data;
    }

    private String getTrackingId(IRepositoryDAO repositoryDAO, String pid) throws IllegalStateException, RepositoryException {
        IRepositoryIdentifier identifier = repositoryDAO.createIdentifier(pid);
        String label = repositoryDAO.getObjectLabel(identifier);
        return "SolrWorker:" + pid + "<" + label;
    }
}
