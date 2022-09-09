package dk.dbc.search.solrdocstore.postgresql;

import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import dk.dbc.search.solrdocstore.db.DatabaseMigrator;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import org.junit.ClassRule;
import org.junit.Test;

public class CreatePgDumpTest {

    @ClassRule
    public static DBCPostgreSQLContainer pg = new DBCPostgreSQLContainer();

    @Test
    public void makePgDump() throws Exception {
        DatabaseMigrator.migrate(pg.datasource());

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
    }
}
