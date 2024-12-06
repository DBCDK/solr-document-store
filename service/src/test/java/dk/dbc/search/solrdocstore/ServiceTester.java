package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.jakarta.xmlbind.JakartaXmlBindAnnotationModule;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import dk.dbc.commons.testcontainers.postgres.AbstractJpaAndRestTestBase;
import dk.dbc.commons.testcontainers.postgres.DBCPostgreSQLContainer;
import dk.dbc.wiremock.test.WireMockFromDirectory;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.ServerSocket;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import javax.sql.DataSource;
import org.junit.AfterClass;
import org.junit.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;

import static dk.dbc.commons.testcontainers.postgres.AbstractPgTestBase.PG;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ServiceTester extends AbstractJpaAndRestTestBase {

    private static final Logger log = LoggerFactory.getLogger(ServiceTester.class);

    private static final Client CLIENT = clientBuilderWithObjectMapper(new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .registerModule(new JakartaXmlBindAnnotationModule())
            .registerModule(new JavaTimeModule())).build();

    public static final int WIREMOCK_PORT = getWiremockPort();
    public static final WireMockFromDirectory WIREMOCK = makeWireMock(WIREMOCK_PORT);
    private static final URI WIREMOCK_URL = getWiremockUrl(WIREMOCK_PORT);

    private static final GenericContainer SERVICE = makeService(WIREMOCK_URL, PG);
    public static final URI SERVICE_URL = makeContainerUrl(SERVICE, 8080);

    @Override
    public void migrate(DataSource datasource) {
        dk.dbc.search.solrdocstore.db.DatabaseMigrator.migrate(datasource);
    }

    @Override
    public String persistenceUnitName() {
        return "solrDocumentStoreIT_PU";
    }

    @Override
    public Collection<String> keepContentOfTables() {
        return List.of("schema_version", "queue_version", "queuesuppliers", "solr_doc_store_queue_version", "openagencycache");
    }

    @Override
    public Client getClient() {
        return CLIENT;
    }

    public static URI apiV2(String... paths) {
        UriBuilder uriBuilder = UriBuilder.fromUri(SERVICE_URL).path("api").path("v2");
        for (String path : paths) {
            uriBuilder = uriBuilder.path(path);
        }
        return uriBuilder.build();
    }

    public static UriBuilder serviceBase() {
        return UriBuilder.fromUri(SERVICE_URL);
    }

    @Before
    public void evictAll() {
        get(UriBuilder.fromUri(SERVICE_URL)
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

    private static GenericContainer makeService(URI wiremockUrl, DBCPostgreSQLContainer pg) {
        String dockerImageName = Docker.build();
        GenericContainer container = new GenericContainer(dockerImageName)
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
                .withEnv("HAZELCAST_CLUSTER", "")
                .withEnv("VIPCORE_ENDPOINT", UriBuilder.fromUri(wiremockUrl).path("vipcore/").build().toString())
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
