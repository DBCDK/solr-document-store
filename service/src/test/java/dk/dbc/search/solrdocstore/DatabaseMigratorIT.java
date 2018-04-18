package dk.dbc.search.solrdocstore;

import org.junit.Test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.Assert.*;

public class DatabaseMigratorIT extends JpaSolrDocStoreIntegrationTester {

    @Test
    public void onStartup() throws Exception {
        int version = -1;
        try (Connection connection = env().getDatasource().getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT version FROM schema_version ORDER BY installed_rank DESC LIMIT 1")) {
            if (resultSet.next()) {
                version = resultSet.getInt(1);
                System.out.println("version = " + version);
            }
        }
        assertEquals(10, version);
    }

}
