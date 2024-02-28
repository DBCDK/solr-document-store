package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.testcontainers.postgres.AbstractJpaTestBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class JpaSolrDocStoreIntegrationTester extends AbstractJpaTestBase {

    private static final Logger log = LoggerFactory.getLogger(JpaSolrDocStoreIntegrationTester.class);

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

    protected static final ObjectMapper O = new ObjectMapper();

    public void executeSqlScript(String resourcePath) {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            try (Connection connection = PG.createConnection();
                 Statement stmt = connection.createStatement()) {
                stmt.execute(content);
            }
        } catch (SQLException | IOException ex) {
            throw new IllegalStateException(ex);
        }
    }

    /**
     * Read a file from requests/bibl-%s.json and update rec.fedoraStreamDate
     *
     * @param id               part of filename
     * @param fedoraStreamDate date so set (null is unset)
     * @return string content
     * @throws IOException if file doesn't exist or is invalid xml
     */
    protected String jsonRequestBibl(String id, Instant fedoraStreamDate) throws IOException {
        String file = "requests/bibl-" + id + ".json";
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(file)) {
            if (is == null)
                throw new FileNotFoundException(file);
            JsonNode tree = O.readTree(is);
            if (fedoraStreamDate != null) {
                tree.withObject("indexKeys").withArray("rec.fedoraStreamDate")
                        .removeAll()
                        .add(fedoraStreamDate.toString());
            }
            return O.writeValueAsString(tree);
        }
    }

    /**
     * Read a file from requests/hold-%s.json
     *
     * @param id part of filename
     * @return string content
     * @throws IOException if file doesn't exist or is invalid xml
     */
    protected String jsonRequestHold(String id) throws IOException {
        String file = "requests/hold-" + id + ".json";
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(file)) {
            if (is == null)
                throw new FileNotFoundException(file);
            JsonNode tree = O.readTree(is);
            return O.writeValueAsString(tree);
        }
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

    protected Set<String> queueRemovePostponed() {
        HashSet<String> enqueued = new HashSet<>();
        try (Connection connection = PG.createConnection();
             Statement stmt = connection.createStatement();
             ResultSet resultSet = stmt.executeQuery("DELETE FROM queue WHERE dequeueafter > NOW() RETURNING consumer || ',' || jobid")) {
            while (resultSet.next()) {
                enqueued.add(resultSet.getString(1));
            }
        } catch (SQLException ex) {
            log.error("Cannot exec query: {}", ex.getMessage());
            log.debug("Cannot exec query: ", ex);
        }
        log.debug("enqueued (postponed) = {}", enqueued);
        return enqueued;
    }
}
