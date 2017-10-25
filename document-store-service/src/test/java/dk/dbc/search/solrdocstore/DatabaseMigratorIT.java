package dk.dbc.search.solrdocstore;

import dk.dbc.commons.persistence.JpaIntegrationTest;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import org.junit.Test;
import org.postgresql.ds.PGSimpleDataSource;

public class DatabaseMigratorIT extends JpaIntegrationTest {
    @Test
    public void onStartup() throws Exception {
        
        
    }

    @Override
    public JpaTestEnvironment setup() {
        final PGSimpleDataSource dataSource = getDataSource();
        migrateDatabase(dataSource);
        return new JpaTestEnvironment(dataSource, "solrDocumentStoreIT_PU");
    }



    private PGSimpleDataSource getDataSource() {
        final PGSimpleDataSource datasource = new PGSimpleDataSource();

        datasource.setServerName("localhost");
        String postgresqlPort=System.getProperty("postgresql.port");
        if( postgresqlPort != null && postgresqlPort.length() > 1 ) {
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
        dbMigrator.migrate();
    }


}