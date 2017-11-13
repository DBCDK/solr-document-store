package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BibliographicEntityTest {
    private final JSONBContext context=new JSONBContext();

    @Test
    public void SimpleEncode() throws Exception {
        BibliographicEntity be=new BibliographicEntity();
        be.id = "Id:1";
        be.agencyId = 200;
        be.bibliographicRecordId = "1234";
        be.work = "work:1";
        be.unit = "unit:2";
        be.producerVersion = "1234";
        be.deleted = false;
        be.indexKeys =  new HashMap<>();
        be.indexKeys.put("title", Arrays.asList("unix bogen", "title2"));
        be.indexKeys.put("id", Collections.singletonList("argle"));

        be.commitWithin = 1000;
        be.trackingId = "";

        String s=context.marshall( be);
        assertThat(s, is("{\"id\":\"Id:1\",\"agencyId\":200,\"bibliographicRecordId\":\"1234\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"producerVersion\":\"1234\",\"deleted\":false,\"indexKeys\":{\"id\":[\"argle\"],\"title\":[\"unix bogen\",\"title2\"]},\"commitWithin\":1000,\"trackingId\":\"\"}"));
    }

    @Test
    public void SimpleDecode() throws Exception {
        String jsonContent="{\"id\":\"Id:1\",\"agencyId\":200,\"bibliographicRecordId\":\"1234\",\"work\":\"work:1\",\"unit\":\"unit:2\",\"producerVersion\":\"1234\",\"deleted\":false,\"indexKeys\":{\"title\": [\"unix bogen\", \"title2\"], \"id\": [\"argle\"] },\"commitWithin\":1000,\"trackingId\":\"\"}";

        BibliographicEntity be=context.unmarshall(jsonContent, BibliographicEntity.class);
        assertThat(be.id, is("Id:1"));
        assertThat(be.agencyId ,is( 200));
        assertThat(be.bibliographicRecordId ,is( "1234"));
        assertThat(be.work ,is( "work:1"));
        assertThat(be.unit ,is( "unit:2"));
        assertThat(be.producerVersion ,is( "1234"));
        assertThat(be.deleted ,is( false));
        assertThat(be.commitWithin ,is( 1000));
        assertThat(be.trackingId ,is( ""));

        Map<String,List<String>> expected= new HashMap<>();
        expected.put("title", Arrays.asList("unix bogen", "title2"));
        expected.put("id", Collections.singletonList("argle"));
        assertThat(be.indexKeys, is( expected ));

    }
}