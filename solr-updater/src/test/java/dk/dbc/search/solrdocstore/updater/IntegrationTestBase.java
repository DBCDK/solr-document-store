package dk.dbc.search.solrdocstore.updater;

import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import dk.dbc.commons.testcontainers.postgres.AbstractJpaAndRestTestBase;
import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import dk.dbc.wiremock.test.WireMockFromDirectory;
import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import javax.sql.DataSource;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import org.junit.AfterClass;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.images.builder.Transferable;

import static dk.dbc.commons.testcontainers.postgres.AbstractJpaTestBase.PG;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class IntegrationTestBase extends AbstractJpaAndRestTestBase {

    private static final String DOCKER_POSTFIX = System.getProperty("docker.image.postfix", "-current:latest");

    public static final int WIREMOCK_PORT = getWiremockPort();
    public static final WireMockFromDirectory WIREMOCK = makeWireMock(WIREMOCK_PORT);
    private static final URI WIREMOCK_URL = getWiremockUrl(WIREMOCK_PORT);

    private static final GenericContainer SOLR = makeSolr();
    private static final URI SOLR_URL = makeContainerUrl(SOLR, 8983);
    private static final URI ZK_URL = URI.create("zk://" + containerIp(SOLR) + ":9983/");

    private static final GenericContainer SERVICE = makeService(WIREMOCK_URL, PG);
    public static final URI SERVICE_URL = makeContainerUrl(SERVICE, 8080);

    public static UriBuilder wireMockBase() {
        return UriBuilder.fromUri(WIREMOCK_URL);
    }

    public static UriBuilder solrBase() {
        return UriBuilder.fromUri(SOLR_URL).path("solr");
    }

    public static URI zookeeperUrl() {
        return ZK_URL;
    }

    public static UriBuilder serviceBase() {
        return UriBuilder.fromUri(SERVICE_URL);
    }

    @Override
    public void migrate(DataSource dataSource) {
        DatabaseMigrator.migrate(dataSource);
    }

    @Override
    public String persistenceUnitName() {
        return "solrDocumentStoreIT_PU";
    }

    @Override
    public Collection<String> keepContentOfTables() {
        return List.of("schema_version", "queue_version", "queuesuppliers", "solr_doc_store_queue_version");
    }

    public void executeSqlScript(String resourcePath) {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            String content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            try (Connection connection = PG.createConnection() ;
                 Statement stmt = connection.createStatement()) {
                stmt.execute(content);
            }
        } catch (SQLException | IOException ex) {
            throw new IllegalStateException(ex);
        }
    }

    public void evictAll() {
        get(serviceBase()
                .path("api").path("evict-all")
                .build())
                .statusIs(Response.Status.OK);
    }

    @AfterClass
    public static void stopWiremock() throws Exception {
        WIREMOCK.close();
    }

    private static WireMockFromDirectory makeWireMock(int port) {
        return new WireMockFromDirectory("src/test/resources/wiremock",
                                         new WireMockConfiguration()
                                                 .bindAddress("0.0.0.0")
                                                 .port(port)
                                                 .stubCorsEnabled(true)
                                                 .gzipDisabled(true));
    }

    private static int getWiremockPort() {
        try (ServerSocket s = new ServerSocket(0)) {
            s.setReuseAddress(true);
            return s.getLocalPort();
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot get wiremock port", ex);
        }
    }

    private static URI getWiremockUrl(int port) {
        return URI.create("http://" + PG.getContainerInfo().getNetworkSettings().getNetworks().values().stream().findFirst().orElseThrow().getGateway() + ":" + port);
    }

    private static GenericContainer makeSolr() {

        ImageFromDockerfile image = new ImageFromDockerfile()
                .withFileFromPath("target/solr/corepo-config", Path.of("target/solr/corepo-config").toAbsolutePath())
                .withFileFromString("target/solr/corepo-1/core.properties", "name=corepo-1")
                .withFileFromString("target/solr/corepo-2/core.properties", "name=corepo-2")
                .withDockerfileFromBuilder(dockerfile ->
                        dockerfile.from("docker-de.artifacts.dbccloud.dk/dbc-solr8-replica-searcher:latest")
                                .add("target/solr/corepo-config/", "/opt/solr/server/solr/corepo-1/conf/")
                                .add("target/solr/corepo-1/core.properties", "/opt/solr/server/solr/corepo-1/core.properties")
                                .add("target/solr/corepo-config/", "/opt/solr/server/solr/corepo-2/conf/")
                                .add("target/solr/corepo-2/core.properties", "/opt/solr/server/solr/corepo-2/core.properties")
                                .user("root")
                                .run("chown -R $SOLR_USER:$SOLR_USER /opt/solr//server/solr")
                                .user("$SOLR_USER")
                                .build());
        GenericContainer solr = new GenericContainer(image)
                .withLogConsumer(new Slf4jLogConsumer(LoggerFactory.getLogger("dk.dbc.SOLR")))
                .withEnv("ZKSTRING", "localhost")
                .withExposedPorts(8983)
                .waitingFor(Wait.forHttp("/solr/corepo-1/select?q=*:*"))
                .withStartupTimeout(Duration.ofMinutes(1))
                .withCopyToContainer(Transferable.of("name=corepo-1"), "/opt/solr/server/solr/corepo-1/core.properties");
        solr.start();
        return solr;
    }

    private static GenericContainer makeService(URI wiremockUrl, DBCPostgreSQLContainer pg) {
        GenericContainer container = new GenericContainer("solr-doc-store-service" + DOCKER_POSTFIX)
                .withLogConsumer(new Slf4jLogConsumer(LoggerFactory.getLogger("dk.dbc.SERVICE")))
                .withEnv("SYSTEM_NAME", "devel")
                .withEnv("DEVELOPER_MODE", "true")
                .withEnv("JAVA_MAX_HEAP_SIZE", "1G")
                .withEnv("LOG_FORMAT", "text")
                .withEnv("LOG__com_hazelcast_spi_discovery_integration_DiscoveryService", "ERROR")
                .withEnv("LOG__dk_dbc", "DEBUG")
                .withEnv("MAX_POOL_SIZE", "24")
                .withEnv("DOCSTORE_POSTGRES_URL", pg.getPayaraDockerJdbcUrl())
                .withEnv("REVIVE_OLDER_WHEN_DELETED_FOR_ATLEAST", "1d")
                .withEnv("VIPCORE_ENDPOINT", UriBuilder.fromUri(wiremockUrl).path("vipcore").build().toString())
                .withExposedPorts(8080)
                .waitingFor(Wait.forHttp("/api/status"))
                .withStartupTimeout(Duration.ofMinutes(1));
        container.start();
        return container;
    }

    private static URI makeContainerUrl(GenericContainer container, int port) {
        String ip = containerIp(container);
        return URI.create("http://" + ip + ":" + port);
    }

    private static String containerIp(GenericContainer container) {
        return container.getContainerInfo().getNetworkSettings().getNetworks().values().stream().findFirst().orElseThrow().getIpAddress();
    }
}
