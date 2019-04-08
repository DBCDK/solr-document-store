/*
 * Copyright (C) 2018 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-updater
 *
 * dbc-solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.SolrInputField;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import static org.hamcrest.Matchers.*;

import static org.junit.Assert.*;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@RunWith(Parameterized.class)
public class BusinessLogicTest {

    private static final ObjectMapper O = new ObjectMapper()
            .configure(SerializationFeature.INDENT_OUTPUT, true)
            .configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
    private final String name;
    private final Path testDirectory;
    private final Path openAgency;

    public BusinessLogicTest(String name, Path test, Path openAgency) throws Exception {
        this.name = name;
        this.testDirectory = test;
        this.openAgency = openAgency;
    }

    @Parameterized.Parameters(name = "{0}")
    public static Collection<Object[]> parameters() throws Exception {
        Path path = new File(BusinessLogicTest.class.getResource("/BusinessLogic").toURI())
                .toPath()
                .toAbsolutePath();
        Path openAgency = path.resolve("openagency");
        return Arrays.stream(path.resolve("tests").toFile().listFiles(File::isDirectory))
                .map(f -> new Object[] {f.getName(), f.toPath(), openAgency})
                .sorted((l, r) -> ( (String) l[0] ).compareTo((String) r[0]))
                .collect(Collectors.toList());
    }

    @Test
    public void test() throws Exception {
        System.out.println(name);
        System.out.println("test = " + testDirectory);
        System.out.println("openAgency = " + openAgency);
        BusinessLogic businessLogic = new BusinessLogic() {
        };
        businessLogic.oa = new OpenAgency() {
            @Override
            public OpenAgency.LibraryRule libraryRule(String agencyId) {
                try {
                    JsonNode json = O.readTree(openAgency.resolve(agencyId + ".json").toFile());
                    return buildLibraryRule(agencyId, (ObjectNode) json);
                } catch (IOException ex) {
                    System.err.println("ex = " + ex);
                    throw new RuntimeException(ex);
                }
            }
        };

        DocProducer dp = new DocProducer() {
        };
        businessLogic.solrFields = dp.solrFields = new SolrFields() {
            @Override
            public boolean isKnownField(String name) {
                return true;
            }
        };

        JsonNode json = O.readTree(testDirectory.resolve("source.json").toFile());
        JsonNode expectedJson = O.readTree(testDirectory.resolve("expected.json").toFile());
        String[] expected = StreamSupport.stream(expectedJson.spliterator(), false)
                .map(JsonNode::asText)
                .toArray(String[]::new);

        SolrInputDocument before = dp.solrFields.newDocumentFromIndexKeys(json.get("bibliographicRecord").get("indexKeys"));
        businessLogic.addNestedHoldingsDocuments(before, json, "repoId");
        try {
            Method method = BusinessLogic.class.getMethod(name.split("[^0-9a-zA-Z]", 2)[0], JsonNode.class);
            method.invoke(businessLogic, json);
        } catch (InvocationTargetException ex) {
            throw (Exception) ex.getTargetException();
        }
        SolrInputDocument after = dp.solrFields.newDocumentFromIndexKeys(json.get("bibliographicRecord").get("indexKeys"));
        businessLogic.addNestedHoldingsDocuments(after, json, "repoId");

        List<String> diff = diff(before, after);
        System.out.println("diff = " + diff + "; expected = " + Arrays.asList(expected));

        assertThat(diff, containsInAnyOrder(expected));
    }

    private List<String> diff(SolrInputDocument before, SolrInputDocument after) {
        HashSet<String> beforeKeys = new HashSet<>();
        addDocumentKeysTo("", before, beforeKeys);
        HashSet<String> afterKeys = new HashSet<>();
        addDocumentKeysTo("", after, afterKeys);

        HashSet<String> removed = new HashSet<>(beforeKeys);
        removed.removeAll(afterKeys);
        HashSet<String> added = new HashSet<>(afterKeys);
        added.removeAll(beforeKeys);

        ArrayList<String> ret = new ArrayList<>();
        removed.forEach(s -> ret.add("-" + s));
        added.forEach(s -> ret.add("+" + s));
        return ret;
    }

    private void addDocumentKeysTo(String prefix, SolrInputDocument before, HashSet<String> keys) {
        before.forEach((String field, SolrInputField values) -> {
            values.getValues()
                    .forEach(value -> keys.add(prefix + field + ":" + value));
        });
        if (before.hasChildDocuments()) {
            String nestedPrefix = prefix.isEmpty() ? "_:" : "_" + prefix;
            before.getChildDocuments()
                    .forEach(child -> addDocumentKeysTo(nestedPrefix, child, keys));
        }
    }

}
