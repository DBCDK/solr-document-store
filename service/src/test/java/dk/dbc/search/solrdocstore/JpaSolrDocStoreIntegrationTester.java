package dk.dbc.search.solrdocstore;

import dk.dbc.commons.persistence.JpaIntegrationTest;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import org.junit.Before;
import org.junit.Test;
import org.postgresql.ds.PGSimpleDataSource;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class JpaSolrDocStoreIntegrationTester extends JpaIntegrationTest {

    @Override
    public JpaTestEnvironment setup() {
        final PGSimpleDataSource dataSource = getDataSource();
        migrateDatabase(dataSource);
        return new JpaTestEnvironment(dataSource, "solrDocumentStoreIT_PU");
    }

    @Before
    public void ClearDatabase() throws SQLException {
        try (Connection conn = env().getDatasource().getConnection() ;
             Statement statement = conn.createStatement()) {
            statement.executeUpdate("DELETE FROM holdingsToBibliographic");
            statement.executeUpdate("DELETE FROM holdingsItemssolrkeys");
            statement.executeUpdate("DELETE FROM bibliographicToBibliographic");
            statement.executeUpdate("DELETE FROM bibliographicSolrKeys");
            statement.executeUpdate("DELETE FROM agencylibrarytype");
            statement.executeUpdate("DELETE FROM queuerule");
        }
    }

    private PGSimpleDataSource getDataSource() {
        final PGSimpleDataSource datasource = new PGSimpleDataSource();

        datasource.setServerName("localhost");
        String postgresqlPort = System.getProperty("postgresql.port");
        if (postgresqlPort != null && postgresqlPort.length() > 1) {
            datasource.setDatabaseName("docstore");
            datasource.setPortNumber(Integer.parseInt(System.getProperty("postgresql.port", "5432")));
        } else {
            datasource.setDatabaseName(System.getProperty("user.name"));
            datasource.setPortNumber(5432);

        }
        datasource.setUser(System.getProperty("user.name"));
        datasource.setPassword(System.getProperty("user.name"));
        return datasource;
    }

    private void migrateDatabase(PGSimpleDataSource datasource) {
        final DatabaseMigrator dbMigrator = new DatabaseMigrator(datasource);
        dbMigrator.config = new Config() {
            @Override
            public Boolean getAllowNonEmptySchema() {
                return false;
            }
        };
        dbMigrator.migrate();
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
}
