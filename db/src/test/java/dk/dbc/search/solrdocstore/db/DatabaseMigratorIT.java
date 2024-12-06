package dk.dbc.search.solrdocstore.db;

import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import javax.sql.DataSource;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.images.builder.ImageFromDockerfile;

import static org.junit.Assert.*;

public class DatabaseMigratorIT {

    public static DBCPostgreSQLContainer pg = new DBCPostgreSQLContainer();

    @BeforeAll
    public static void startPg() {
        pg.start();
    }

    @AfterAll
    public static void stopPg() {
        pg.stop();
    }

    @Test
    public void onStartup() throws Exception {
        DataSource datasource = pg.datasource();
        int version = -1;

        HashSet<String> migrated = DatabaseMigrator.migrate(datasource);
        System.out.println("migrated = " + migrated);

        try (Connection connection = datasource.getConnection();
             Statement stmt = connection.createStatement();
             ResultSet resultSet = stmt.executeQuery("SELECT version FROM schema_version ORDER BY installed_rank DESC LIMIT 1")) {
            if (resultSet.next()) {
                version = resultSet.getInt(1);
                System.out.println("version = " + version);
            }
        }
        assertEquals(34, version);

        URL resource = getClass().getClassLoader().getResource(".");
        System.out.println("resource = " + resource);
        File file = Path.of(resource.toURI()).toAbsolutePath().toFile();
        while (!file.getParentFile().equals(file) && !file.getName().equals("target")) {
            file = file.getParentFile();
        }
        file = file.toPath().resolve("solrdocstore.sql").toFile();
        System.out.println("Dumping to: " + file);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(pg.pgdump(true).getBytes(StandardCharsets.UTF_8));
        }

        Docker.build();
    }
}
