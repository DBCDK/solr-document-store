package dk.dbc.search.solrdocstore.db;

import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import org.junit.Test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import javax.sql.DataSource;
import org.junit.ClassRule;

import static org.junit.Assert.*;

public class DatabaseMigratorIT {

    @ClassRule
    public static DBCPostgreSQLContainer pg = new DBCPostgreSQLContainer();

    @Test
    public void onStartup() throws Exception {
        DataSource datasource = pg.datasource();
        int version = -1;

        HashSet<String> migrated = DatabaseMigrator.migrate(datasource);
        System.out.println("migrated = " + migrated);

        try (Connection connection = datasource.getConnection() ;
             Statement stmt = connection.createStatement() ;
             ResultSet resultSet = stmt.executeQuery("SELECT version FROM schema_version ORDER BY installed_rank DESC LIMIT 1")) {
            if (resultSet.next()) {
                version = resultSet.getInt(1);
                System.out.println("version = " + version);
            }
        }
        assertEquals(29, version);
    }
}
