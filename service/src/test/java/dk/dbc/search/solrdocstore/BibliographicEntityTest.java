package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BibliographicEntityTest {

    private final JSONBContext context = new JSONBContext();

    @Test
    public void simpleEncode() throws Exception {
        IndexKeys indexKeys = new IndexKeys();
        indexKeys.put("title", Arrays.asList("unix bogen", "title2"));
        indexKeys.put("id", Collections.singletonList("argle"));

        BibliographicEntity be = new BibliographicEntity(200, "clazzifier", "1234", "id#1", "work:1", "unit:2", false, indexKeys, "");
        String s = context.marshall(be);
        assertThat(s, is("{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"deleted\":false,\"indexKeys\":{\"id\":[\"argle\"],\"title\":[\"unix bogen\",\"title2\"]},\"trackingId\":\"\"}"));
    }

    @Test
    public void simpleDecode() throws Exception {
        String jsonContent = "{\"agencyId\":200,\"classifier\":\"clazzifier\",\"bibliographicRecordId\":\"1234\",\"repositoryId\":\"id#1\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"deleted\":false,\"indexKeys\":{\"title\": [\"unix bogen\", \"title2\"], \"id\": [\"argle\"] },\"trackingId\":\"\"}";

        BibliographicEntity be = context.unmarshall(jsonContent, BibliographicEntity.class);
        assertThat(be.getAgencyId(), is(200));
        assertThat(be.getClassifier(), is("clazzifier"));
        assertThat(be.getBibliographicRecordId(), is("1234"));
        assertThat(be.getRepositoryId(), is("id#1"));
        assertThat(be.getWork(), is("work:1"));
        assertThat(be.getUnit(), is("unit:2"));
        assertThat(be.isDeleted(), is(false));
        assertThat(be.getTrackingId(), is(""));

        IndexKeys expected = new IndexKeys();
        expected.put("title", Arrays.asList("unix bogen", "title2"));
        expected.put("id", Collections.singletonList("argle"));
        assertThat(be.getIndexKeys(), is(expected));
    }
}
