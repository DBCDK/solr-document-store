package dk.dbc.search.solrdocstore.monitor;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.utility.DockerImageName;

public class DockerImageIT {

    public static final String IMAGE = "docker-de.artifacts.dbccloud.dk/solr-doc-store-monitor:" + getDockerImageTag();

    @Test
    public void buildDockerImage() {
        String containerName = dockerBuild("target/docker/Dockerfile").getDockerImageName();
        System.out.println("Docker image built as " + containerName);
    }

    public static GenericContainer dockerBuild(String dockerfile) {
        return dockerBuild(IMAGE, dockerfile);
    }

    public static GenericContainer dockerBuild(String image, String dockerfile) {
        dockerPull(getDockerBaseImage(dockerfile));
        GenericContainer container = new GenericContainer(
                new ImageFromDockerfile(image, false)
                        .withFileFromPath(".", Path.of("."))
                        .withFileFromPath("Dockerfile", Path.of(dockerfile)));
        try (FileOutputStream fos = new FileOutputStream("docker.out")) {
            fos.write(( container.getDockerImageName() + "\n" ).getBytes(StandardCharsets.UTF_8));
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
        return container;
    }

    public static String getDockerImageTag() {
        String tag = "devel";
        final String build_number = System.getenv("BUILD_NUMBER");
        if (build_number != null && !build_number.isBlank()) {
            // in CI environment
            final String branch_name = System.getenv("BRANCH_NAME");
            if ("master".equals(branch_name)) {
                tag = build_number;
            } else {
                tag = branch_name.toLowerCase(Locale.ROOT) + "-" + build_number;
            }
        }
        return tag;
    }

    private static String getDockerBaseImage(String dockerfile) {
        try (FileInputStream fis = new FileInputStream(dockerfile)) {
            String content = new String(fis.readAllBytes(), StandardCharsets.UTF_8);
            Matcher matcher = Pattern.compile("^FROM\\s+(\\S+)\\s*$", Pattern.MULTILINE).matcher(content);
            if (!matcher.find())
                throw new IllegalArgumentException("Cannot find FROM line in dockerfile");
            return matcher.group(1);
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    private static void dockerPull(String image) {
        if (image.endsWith(":devel"))
            return;
        try {
            DockerImageName from = DockerImageName.parse(image);
            if (!DockerClientFactory.instance().client()
                    .pullImageCmd(from.getUnversionedPart())
                    .withTag(from.getVersionPart())
                    .start()
                    .awaitCompletion(300, TimeUnit.SECONDS)) {
                throw new IllegalStateException("Could not pull docker image: " + image);
            }
        } catch (InterruptedException ex) {
            throw new IllegalStateException("Could not pull docker image: " + image, ex);
        }
    }
}
