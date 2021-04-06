package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import dk.dbc.commons.persistence.JpaIntegrationTest;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import org.junit.Before;
import org.junit.Test;
import org.postgresql.ds.PGSimpleDataSource;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JpaSolrDocStoreIntegrationTester extends JpaIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(JpaSolrDocStoreIntegrationTester.class);

    protected static final ObjectMapper O = new ObjectMapper();

    @Override
    public JpaTestEnvironment setup() {
        final PGSimpleDataSource dataSource = getDataSource();
        migrateDatabase(dataSource);
        return new JpaTestEnvironment(dataSource, "solrDocumentStoreIT_PU");
    }

    @Before
    public void clearDatabase() throws SQLException {
        try (Connection conn = env().getDatasource().getConnection() ;
             Statement statement = conn.createStatement()) {
            statement.executeUpdate("TRUNCATE holdingsToBibliographic CASCADE");
            statement.executeUpdate("TRUNCATE holdingsItemssolrkeys CASCADE");
            statement.executeUpdate("TRUNCATE bibliographicToBibliographic CASCADE");
            statement.executeUpdate("TRUNCATE bibliographicSolrKeys CASCADE");
            statement.executeUpdate("TRUNCATE openagencycache CASCADE");
            statement.executeUpdate("TRUNCATE queuerule CASCADE");
            statement.executeUpdate("TRUNCATE queue CASCADE");
            statement.executeUpdate("TRUNCATE resource CASCADE");
        }
    }

    private PGSimpleDataSource getDataSource() {
        final PGSimpleDataSource datasource = new PGSimpleDataSource();

        datasource.setServerNames(new String[] {"localhost"});
        String postgresqlPort = System.getProperty("postgresql.port");
        if (postgresqlPort != null && postgresqlPort.length() > 1) {
            datasource.setDatabaseName("docstore");
            datasource.setPortNumbers(new int[] {Integer.parseInt(System.getProperty("postgresql.port", "5432"))});
        } else {
            datasource.setDatabaseName(System.getProperty("user.name"));
            datasource.setPortNumbers(new int[] {5432});
        }
        datasource.setUser(System.getProperty("user.name"));
        datasource.setPassword(System.getProperty("user.name"));
        return datasource;
    }

    private void migrateDatabase(PGSimpleDataSource datasource) {
        dk.dbc.search.solrdocstore.db.DatabaseMigrator.migrate(datasource);
    }

    /**
     * When IDEA tries to run all unit tests in the project - it will fail on
     * this class.
     * Since {@link JpaSolrDocStoreIntegrationTester} has a @Before annotation -
     * it is considered a test class
     * But since it has no methods to execute, then IDEA will fail the class
     * with "No runnable method".
     */
    @Test
    public void noTest() {
    }

    protected <T> T jpa(JpaCodeBlockExecution<T> codeBlock) {
        return env().getPersistenceContext().run(() -> codeBlock.execute(env().getEntityManager()));
    }

    protected void jpa(JpaCodeBlockVoidExecution codeBlock) {
        env().getPersistenceContext().run(() -> codeBlock.execute(env().getEntityManager()));
    }

    /**
     * Represents a code block execution with return value
     *
     * @param <T> return type of the code block execution
     */
    @FunctionalInterface
    public interface JpaCodeBlockExecution<T> {

        T execute(EntityManager em) throws Exception;
    }

    /**
     * Represents a code block execution without return value
     */
    @FunctionalInterface
    public interface JpaCodeBlockVoidExecution {

        void execute(EntityManager em) throws Exception;
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
                ( (ArrayNode) tree.with("indexKeys").withArray("rec.fedoraStreamDate") )
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
        try (Connection connection = env().getDatasource().getConnection() ;
             Statement stmt = connection.createStatement() ;
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

}
