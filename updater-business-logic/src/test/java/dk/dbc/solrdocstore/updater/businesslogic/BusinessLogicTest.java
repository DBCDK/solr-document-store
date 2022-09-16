/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater-business-logic
 *
 * solr-doc-store-updater-business-logic is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater-business-logic is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.solrdocstore.updater.businesslogic;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.difflib.text.DiffRow;
import com.github.difflib.text.DiffRowGenerator;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collection;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.solr.common.SolrInputDocument;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
@RunWith(Parameterized.class)
public class BusinessLogicTest {

    private static final ObjectMapper O = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT)
            .enable(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS);

    private static final KnownSolrFields ALL_SOLR_FIELDS = new KnownSolrFields() {
        @Override
        public boolean isKnownField(String name) {
            return true;
        }
    };

    private final String name;
    private final Path directory;

    public BusinessLogicTest(String name, Path directory) {
        this.name = name;
        this.directory = directory;
    }

    @Test
    public void testProcess() throws Exception {
        System.out.println("process - " + name + " (in: " + directory + ")");

        FeatureSwitch features = readFeatures();
        JsonNode source = readJson("source.json");

        /*
         * Build document without any features
         */
        BusinessLogic businessLogicNull =
                BusinessLogic.builder(new FeatureSwitch("none"), ALL_SOLR_FIELDS)
                        .build();
        SolrDocStoreResponse solrDocStoreResponse = SolrDocStoreResponse.from(source);
        SolrInputDocument beforeSolrInputDocument = businessLogicNull.process(solrDocStoreResponse.deepCopy());

        try (OutputStream os = new FileOutputStream(directory.resolve("before.json").toFile())) {
            os.write(O.writeValueAsString(SolrInputDocumentToJson(beforeSolrInputDocument)).getBytes(UTF_8));
        }

        /*
         * Build document with the enabled features
         */
        BusinessLogic businessLogic =
                BusinessLogic.builder(features, ALL_SOLR_FIELDS)
                        .enable800000AndRole(new LibraryRuleProviderMock())
                        .enableScan(new ProfileProviderMock(),
                                    "scan.lti,scan.lfo",
                                    "102030-magic,102030-self,123456-basic,876543-self")
                        .build();

        SolrInputDocument afterSolrInputDocument = businessLogic.process(solrDocStoreResponse.deepCopy());

        try (OutputStream os = new FileOutputStream(directory.resolve("after.json").toFile())) {
            os.write(O.writeValueAsString(SolrInputDocumentToJson(afterSolrInputDocument)).getBytes(UTF_8));
        }

        /*
         * Create a diff of the with and without document
         */
        String actual = computeDiff();
        try (OutputStream os = new FileOutputStream(directory.resolve("actual.txt").toFile())) {
            os.write(actual.getBytes(UTF_8));
        }

        /*
         * Compare the diff to the expected result
         */
        String expected = readExpected();
        boolean equals = expected.equals(actual);
        if (!equals) {
            System.out.println("Expected:");
            System.out.print(expected);
            System.out.println("Actual:");
            System.out.print(actual);
        }
        assertThat("expected.txt == actual.txt", equals, is(true));
    }

    private ObjectNode SolrInputDocumentToJson(SolrInputDocument afterSolrInputDocument) {
        ObjectNode root = O.createObjectNode();
        addSolrInputDocumentToObjectNode(afterSolrInputDocument, root);
        if (afterSolrInputDocument.hasChildDocuments()) {
            ArrayNode nested = root.putArray("_childDocuments_");
            for (SolrInputDocument childDocument : afterSolrInputDocument.getChildDocuments()) {
                addSolrInputDocumentToObjectNode(childDocument, nested.addObject());
            }
        }
        return root;
    }

    private void addSolrInputDocumentToObjectNode(SolrInputDocument SolrInputDocument, ObjectNode root) {
        SolrInputDocument.getFieldNames().stream()
                .sorted()
                .forEach(fieldName -> {
                    ArrayNode array = root.putArray(fieldName);
                    SolrInputDocument.getFieldValues(fieldName).stream()
                            .sorted()
                            .forEach(fieldValue -> {
                                array.addPOJO(fieldValue);
                            });
                });
    }

    private FeatureSwitch readFeatures() throws IOException {
        File featureFile = directory.resolve("features").toFile();
        if (!featureFile.exists())
            throw new IllegalArgumentException("No such featureFile: " + featureFile);
        byte[] readAllBytes = Files.readAllBytes(featureFile.toPath());
        String featureString = new String(readAllBytes, UTF_8).trim();
        return new FeatureSwitch(featureString);
    }

    private String readExpected() throws IOException {
        File expectedFile = directory.resolve("expected.txt").toFile();
        if (!expectedFile.exists())
            throw new IllegalArgumentException("No such expectedFile: " + expectedFile);
        byte[] readAllBytes = Files.readAllBytes(expectedFile.toPath());
        return new String(readAllBytes, UTF_8);
    }

    private JsonNode readJson(String fileName) throws IOException {
        File jsonFile = directory.resolve(fileName).toFile();
        if (!jsonFile.exists())
            throw new IllegalArgumentException("No such jsonFile: " + jsonFile);
        try (InputStream is = new FileInputStream(jsonFile)) {
            return O.readTree(is);
        }
    }

    private String computeDiff() throws IOException {
        List<String> original = Files.readAllLines(directory.resolve("before.json"));
        List<String> changed = Files.readAllLines(directory.resolve("after.json"));
        DiffRowGenerator generator = DiffRowGenerator.create()
                .showInlineDiffs(true)
                .mergeOriginalRevised(true)
                .inlineDiffByWord(true)
                .ignoreWhiteSpaces(true)
                .oldTag(f -> f ? "--> " : " <--")
                .newTag(f -> f ? "++> " : " <++")
                .build();

        List<DiffRow> diff = generator.generateDiffRows(original, changed);
        boolean same = diff.stream().map(DiffRow::getTag)
                .allMatch(t -> t == DiffRow.Tag.EQUAL);
        if (same)
            return "";

        try (ByteArrayOutputStream bos = new ByteArrayOutputStream() ;
             PrintStream printStream = new PrintStream(bos, true, UTF_8.name())) {

            Deque<String> queue = new LinkedList<>();
            int extra = 0;
            for (DiffRow diffRow : diff) {
                if (diffRow.getTag() != DiffRow.Tag.EQUAL) {
                    queue.forEach(printStream::println);
                    printStream.println(diffRow.getOldLine());
                    extra = 5;
                    queue.clear();
                } else if (extra > 0) {
                    extra--;
                    printStream.println(diffRow.getOldLine());
                } else {
                    queue.add(diffRow.getOldLine());
                    if (queue.size() > 5)
                        queue.remove();
                }
            }
            return bos.toString(UTF_8.name());
        }
    }

    @Parameterized.Parameters(name = "{0}")
    public static Collection<Object[]> test() throws Exception {
        File path = new File(BusinessLogicTest.class.getResource("/test-cases").toURI())
                .toPath()
                .toAbsolutePath()
                .toFile();
        return Arrays.stream(path.listFiles(File::isDirectory))
                .map(TestCase::new)
                .sorted()
                .map(TestCase::asArguments)
                .collect(Collectors.toList());
    }

    static class TestCase implements Comparable<TestCase> {

        private final String name;
        private final Path directory;

        public TestCase(File f) {
            this.name = f.getName();
            this.directory = f.toPath();
        }

        @Override
        public int compareTo(TestCase other) {
            return name.compareTo(other.name);
        }

        public Object[] asArguments() {
            return new Object[] {name, directory};
        }
    }

}
