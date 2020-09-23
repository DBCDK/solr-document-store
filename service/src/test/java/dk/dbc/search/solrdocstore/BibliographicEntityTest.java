package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BibliographicEntityTest {

    private final JSONBContext context = new JSONBContext();

    @Test
    public void SimpleEncode() throws Exception {
        Map<String, List<String>> indexKeys = new HashMap<>();
        indexKeys.put("title", Arrays.asList("unix bogen", "title2"));
        indexKeys.put("id", Collections.singletonList("argle"));

        BibliographicEntity be = new BibliographicEntity(200, "clazzifier", "1234", "id#1", "work:1", "unit:2", "1234", false, indexKeys, "");
        String s = context.marshall(be);
        assertThat(s, is("{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"producerVersion\":\"1234\",\"deleted\":false,\"indexKeys\":{\"id\":[\"argle\"],\"title\":[\"unix bogen\",\"title2\"]},\"trackingId\":\"\"}"));
    }

    @Test
    public void SimpleDecode() throws Exception {
        String jsonContent = "{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"producerVersion\":\"1234\",\"deleted\":false,\"indexKeys\":{\"title\": [\"unix bogen\", \"title2\"], \"id\": [\"argle\"] },\"trackingId\":\"\"}";

        BibliographicEntity be = context.unmarshall(jsonContent, BibliographicEntity.class);
        assertThat(be.getAgencyId(), is(200));
        assertThat(be.getClassifier(), is("clazzifier"));
        assertThat(be.getBibliographicRecordId(), is("1234"));
        assertThat(be.getRepositoryId(), is("id#1"));
        assertThat(be.getWork(), is("work:1"));
        assertThat(be.getUnit(), is("unit:2"));
        assertThat(be.getProducerVersion(), is("1234"));
        assertThat(be.isDeleted(), is(false));
        assertThat(be.getTrackingId(), is(""));

        Map<String, List<String>> expected = new HashMap<>();
        expected.put("title", Arrays.asList("unix bogen", "title2"));
        expected.put("id", Collections.singletonList("argle"));
        assertThat(be.getIndexKeys(), is(expected));

    }
}
