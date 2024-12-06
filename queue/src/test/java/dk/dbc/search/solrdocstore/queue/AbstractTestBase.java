package dk.dbc.search.solrdocstore.queue;

import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;

public abstract class AbstractTestBase {

    public static DBCPostgreSQLContainer PG = new DBCPostgreSQLContainer();

    @BeforeAll
    public static void startPg() {
        PG.start();
    }

    @AfterAll
    public static void stopPg() {
        PG.stop();
    }
}
