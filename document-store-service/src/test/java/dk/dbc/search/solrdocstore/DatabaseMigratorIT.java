package dk.dbc.search.solrdocstore;

import dk.dbc.commons.persistence.JpaIntegrationTest;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import org.junit.Test;
import org.postgresql.ds.PGSimpleDataSource;

import java.sql.Connection;

public class DatabaseMigratorIT extends JpaSolrDocstoreIntegrationTest {
    @Test
    public void onStartup() throws Exception {
        try (Connection conn = env().getDatasource().getConnection() ) {
            conn.createStatement().execute("select * from bibliographicSolrKeys");
        }
    }


}