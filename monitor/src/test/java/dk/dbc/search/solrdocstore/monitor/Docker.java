package dk.dbc.search.solrdocstore.monitor;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.utility.DockerImageName;

public class Docker {

    public static final String IMAGE = "docker-de.artifacts.dbccloud.dk/solr-doc-store-monitor-2.0";

    private Docker() {
    }

    public static String build() {
        Docker.dockerPull(Docker.getDockerBaseImage());
        String dockerImageName = new ImageFromDockerfile(Docker.IMAGE + ":" + Docker.getDockerImageTag(), false)
                .withFileFromPath(".", Path.of("."))
                .withFileFromPath("Dockerfile", Path.of("target/docker/Dockerfile"))
                .get();
        try {
            Files.writeString(Path.of("docker.out"), dockerImageName + "\n");
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
        return dockerImageName;
    }

    public static String getDockerImageTag() {
        String tag = "devel";
        final String build_number = System.getenv("BUILD_NUMBER");
        if (build_number != null && !build_number.isBlank()) {
            // in CI environment
            final String branch_name = System.getenv("BRANCH_NAME");
            if ("main".equals(branch_name)) {
                tag = build_number;
            } else {
                tag = branch_name + "-" + build_number;
            }
        }
        return tag;
    }

    public static String getDockerBaseImage() {
        try (FileInputStream fis = new FileInputStream("target/docker/Dockerfile")) {
            String content = new String(fis.readAllBytes(), StandardCharsets.UTF_8);
            Matcher matcher = Pattern.compile("^FROM\\s+(\\S+)\\s*$", Pattern.MULTILINE).matcher(content);
            if (!matcher.find())
                throw new IllegalArgumentException("Cannot find FROM line in dockerfile");
            return matcher.group(1);
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    public static void dockerPull(String image) {
        try {
            DockerImageName from = DockerImageName.parse(image);
            if (!DockerClientFactory.instance().client().pullImageCmd(from.getUnversionedPart()).withTag(from.getVersionPart()).start().awaitCompletion(30, TimeUnit.SECONDS)) {
                throw new IllegalStateException("Could not pull docker image: " + image);
            }
        } catch (InterruptedException ex) {
            throw new IllegalStateException("Could not pull docker image: " + image, ex);
        }
    }
}
