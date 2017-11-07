package dk.dbc.search.solrdocstore;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import org.junit.Test;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HoldingsItemEntityIT extends JpaSolrDocstoreIntegrationTester {

    @Test
     public void StoreEntity() {
         EntityManager em=env().getEntityManager();
         env().getPersistenceContext().run( () -> {
             HoldingsItemEntity be=new HoldingsItemEntity();
             
             be.agencyId = 200;
             be.bibliographicRecordId = "1234";
             be.producerVersion = "1234";
             be.indexKeys = new ArrayList<>();
             Map<String, List<String>> doc1=new HashMap<>();
             doc1.put("titel", Collections.singletonList("unix bogen"));
             doc1.put("id", Collections.singletonList("argle"));
             be.indexKeys.add( doc1 );

             Map<String, List<String>> doc2=new HashMap<>();
             doc2.put("titel", Collections.singletonList("unix bogen"));
             doc2.put("id", Collections.singletonList("argle"));
             doc2.put("dyr", Collections.singletonList("hest"));
             be.indexKeys.add( doc2 );

             be.commitWithin = 1000;
             be.trackingId = "";
             em.persist(be);
         });

         Object key=new AgencyItemKey().withAgencyId(200).withBibliographicRecordId("1234");
         HoldingsItemEntity be2=em.find(HoldingsItemEntity.class, key );

         assertThat( be2.agencyId, is(200));
         assertThat( be2.bibliographicRecordId, is("1234"));
     }

     @Test
     public void LoadEntity() throws Exception {

         executeScriptResource("/entityTestData.sql");
         EntityManager em=env().getEntityManager();

         AgencyItemKey key=new AgencyItemKey().withAgencyId(300).withBibliographicRecordId("4321");
         HoldingsItemEntity be=env().getPersistenceContext().run( () -> em.find(HoldingsItemEntity.class, key));

         assertThat( be.agencyId, is(300));
         assertThat( be.bibliographicRecordId, is("4321"));

         assertThat(be.producerVersion , is( "revision" ));
         ArrayList<Map<String,List<String>>> expected = new ArrayList<>();

         Map<String, List<String>> doc1=new HashMap<>();
         doc1.put("title", Collections.singletonList("unix bogen"));
         doc1.put("id", Collections.singletonList("argle"));
         expected.add( doc1 );

         Map<String, List<String>> doc2=new HashMap<>();
         doc2.put("title", Collections.singletonList("unix bogen"));
         doc2.put("id", Collections.singletonList("argle"));
         doc2.put("dyr", Collections.singletonList("hest"));
         expected.add( doc2 );
         
         assertThat(be.indexKeys, is( expected ));

         assertThat(be.commitWithin , is( 4444 ));
         assertThat(be.trackingId , is( "track" ));
     }

}