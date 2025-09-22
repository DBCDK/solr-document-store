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
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.junit.jupiter.api.Test;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.utility.DockerImageName;
import org.w3c.dom.DOMException;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

public class DockerImageIT {

    public static final String IMAGE_NAME = "docker-de.artifacts.dbccloud.dk";

    @Test
    public void buildDockerImage() throws Exception {
        String containerName = dockerBuild("target/docker/Dockerfile").getDockerImageName();
        System.out.println("Docker image built as " + containerName);
    }

    public static GenericContainer dockerBuild(String dockerfile) {
        return dockerBuild(getImageNameFromPomXml(IMAGE_NAME), dockerfile);
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

    private static String getImageNameFromPomXml(String repository) {
        try {
            Element doc = DocumentBuilderFactory.newDefaultNSInstance()
                    .newDocumentBuilder()
                    .parse("pom.xml")
                    .getDocumentElement();
            String artifactId = null;
            String version = null;
            for (Node toplevel = doc.getFirstChild() ; toplevel != null ; toplevel = toplevel.getNextSibling()) {
                if (toplevel.getNodeType() == Node.ELEMENT_NODE && "artifactId".equals(toplevel.getNodeName())) {
                    for (Node artifactIdNode = toplevel.getFirstChild() ; artifactIdNode != null ; artifactIdNode = artifactIdNode.getNextSibling()) {
                        if (artifactIdNode.getNodeType() == Node.TEXT_NODE) {
                            artifactId = artifactIdNode.getNodeValue();
                        }
                    }
                }
                if (toplevel.getNodeType() == Node.ELEMENT_NODE && "version".equals(toplevel.getNodeName())) {
                    for (Node versionNode = toplevel.getFirstChild() ; versionNode != null ; versionNode = versionNode.getNextSibling()) {
                        if (versionNode.getNodeType() == Node.TEXT_NODE) {
                            version = versionNode.getNodeValue();
                        }
                    }
                }
            }
            if (artifactId == null || artifactId.isBlank() ||
                version == null || version.isBlank())
                throw new IllegalStateException("Could not find 'artifactId' or 'version' in pom.xml");
            return repository + "/" + artifactId + "-" + version.replace("-SNAPSHOT", "") + ":" + getDockerImageTag();
        } catch (IOException | ParserConfigurationException | DOMException | SAXException ex) {
            throw new IllegalStateException("Could not parse pom.xml", ex);
        }
    }

    public static String getDockerImageTag() {
        String tag = "latest";
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
