package dk.dbc.search.solrdocstore;

import org.junit.Test;

import javax.persistence.EntityManager;
import javax.swing.text.html.parser.Entity;
import java.sql.Connection;

public class DatabaseMigratorIT extends JpaSolrDocStoreIntegrationTester {
    @Test
    public void onStartup() throws Exception {
        try (Connection conn = env().getDatasource().getConnection() ) {
             conn.createStatement().execute("select * from bibliographicSolrKeys");
        }
    }


}