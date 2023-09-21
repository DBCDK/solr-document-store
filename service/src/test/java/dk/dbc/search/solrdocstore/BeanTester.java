package dk.dbc.search.solrdocstore;

import dk.dbc.commons.testcontainers.postgres.AbstractJpaTestBase;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.commons.testcontainers.postgres.AbstractPgTestBase.PG;
import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class BeanTester extends AbstractJpaTestBase {

    private static final Logger log = LoggerFactory.getLogger(BeanTester.class);

    public static final OpenAgencyEntity OPEN_AGENCY_COMMON_AGNECY = new OpenAgencyEntity(COMMON_AGENCY, LibraryType.FBS, false, false, false);

    @FunctionalInterface
    public static interface BeanScope {

        public void execute(BeanFactory bf) throws Exception;
    }

    @FunctionalInterface
    public static interface SqlScope {

        public void execute(Connection connection) throws Exception;
    }

    @Override
    public void migrate(DataSource datasource) {
        dk.dbc.search.solrdocstore.db.DatabaseMigrator.migrate(datasource);
    }

    @Override
    public String persistenceUnitName() {
        return "solrDocumentStoreIT_PU";
    }

    @Override
    public Collection<String> keepContentOfTables() {
        return List.of("schema_version", "queue_version", "queuesuppliers", "solr_doc_store_queue_version");
    }

    public void persist(Object... objs) {
        for (Object obj : objs) {
            if (obj instanceof Doc.EntityProvider) {
                jpa(em -> em.persist(( (Doc.EntityProvider) obj ).entity()));
            } else {
                jpa(em -> em.persist(obj));
            }
        }
    }

    public void delete(Class clazz, Object key) {
        jpa(em -> {
            Object obj = em.find(clazz, key);
            em.remove(obj);
        });
    }

    public void bean(BeanScope bf) {
        jpa(em -> bf.execute(new BeanFactory(em)));
    }

    public void sql(SqlScope sql) throws Exception {
        try (Connection connection = PG.createConnection()) {
            connection.setAutoCommit(false);
            sql.execute(connection);
            connection.commit();
        }
    }

    public void stdQueueRules() {
        persist(new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                new QueueRuleEntity("a", QueueType.MANIFESTATION_DELETED, 100_000),
                new QueueRuleEntity("a", QueueType.HOLDING, 0),
                new QueueRuleEntity("a", QueueType.RESOURCE, 0),
                new QueueRuleEntity("b", QueueType.UNIT, 0),
                new QueueRuleEntity("b", QueueType.UNITHOLDING, 0),
                new QueueRuleEntity("b", QueueType.UNITRESOURCE, 0),
                new QueueRuleEntity("c", QueueType.WORK, 0),
                new QueueRuleEntity("c", QueueType.WORKHOLDING, 0),
                new QueueRuleEntity("c", QueueType.WORKRESOURCE, 0),
                new QueueRuleEntity("e", QueueType.ENDPOINT, 0),
                new QueueRuleEntity("e", QueueType.WORKENDPOINT, 0));
    }

    protected Set<String> queueContentAndClear() {
        HashSet<String> enqueued = new HashSet<>();
        try (Connection connection = PG.createConnection();
             Statement stmt = connection.createStatement();
             ResultSet resultSet = stmt.executeQuery("DELETE FROM queue RETURNING consumer || ',' || jobid")) {
            while (resultSet.next()) {
                enqueued.add(resultSet.getString(1));
            }
        } catch (SQLException ex) {
            log.error("Cannot exec query: {}", ex.getMessage());
            log.debug("Cannot exec query: ", ex);
        }
        log.debug("enqueued = {}", enqueued);
        return enqueued;
    }

    protected Set<String> queueContentAndClearPostponedOnly() {
        HashSet<String> enqueued = new HashSet<>();
        try (Connection connection = PG.createConnection();
             Statement stmt = connection.createStatement();
             ResultSet resultSet = stmt.executeQuery("DELETE FROM queue WHERE dequeueAfter > NOW() RETURNING consumer || ',' || jobid")) {
            while (resultSet.next()) {
                enqueued.add(resultSet.getString(1));
            }
        } catch (SQLException ex) {
            log.error("Cannot exec query: {}", ex.getMessage());
            log.debug("Cannot exec query: ", ex);
        }
        log.debug("enqueued = {}", enqueued);
        return enqueued;
    }
}
