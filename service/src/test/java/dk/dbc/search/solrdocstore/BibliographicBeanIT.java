package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import org.junit.Before;
import org.junit.Test;

import jakarta.persistence.EntityManager;
import jakarta.ws.rs.core.Response;
import java.net.URISyntaxException;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.SolrIndexKeys.*;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;

public class BibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final Marshaller MARSHALLER = new Marshaller();

    @Before
    public void setupBean() throws URISyntaxException {
        executeSqlScript("bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        String b870970 = makeBibliographicRequestJson(870970);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, b870970);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, "new", 870970, true),
                       new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                       new HoldingsToBibliographicEntity(300100, "new", 870970, false),
                       new HoldingsToBibliographicEntity(300200, "new", 870970, false)
               ));
        });

        String b700000 = makeBibliographicRequestJson(700000);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });

            Response r = bean.addBibliographicKeys(false, b700000);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                       new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                       new HoldingsToBibliographicEntity(300100, "new", 870970, false),
                       new HoldingsToBibliographicEntity(300200, "new", 870970, false)
               ));
        });

        String b300100 = makeBibliographicRequestJson(300100);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });

            Response r = bean.addBibliographicKeys(false, b300100);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                       new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                       new HoldingsToBibliographicEntity(300100, "new", 300100, false),
                       new HoldingsToBibliographicEntity(300200, "new", 870970, false)
               ));
        });

        String b300000 = makeBibliographicRequestJson(300000);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });

            Response r = bean.addBibliographicKeys(false, b300000);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                       new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                       new HoldingsToBibliographicEntity(300100, "new", 300100, false),
                       new HoldingsToBibliographicEntity(300200, "new", 300000, false)
               ));
        });
    }

    @Test
    public void updateExistingBibliographicPost() throws JsonProcessingException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#1", "work:update", "unit:update", false, makeIndexKeys(), "track:update");
        String updatedB = MARSHALLER.marshall(b);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, updatedB);
            assertThat(r.getStatus(), is(200));
        });

        // Ensure update came through
        jpa(em -> {
            BibliographicEntity updatedBibEntity = em.find(BibliographicEntity.class, b.asAgencyClassifierItemKey());
            assertThat(updatedBibEntity, equalTo(b));
            //assertThat(true,equalTo(true));
        });

        // Ensure related holdings are unchanged
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity h WHERE h.bibliographicRecordId='properUpdate'", HoldingsToBibliographicEntity.class).getResultList();
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(610510, "properUpdate", 600100, false)
               ));
        });
    }

    @Test
    public void updateExistingBibliographicPostToDeleted() throws JsonProcessingException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", "work:update", "unit:update", false, makeIndexKeys(), "track:update");
        String updatedB = MARSHALLER.marshall(b);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, updatedB);
            assertThat(r.getStatus(), is(200));
        });

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", null, null, true, makeIndexKeys(), "track:update");
        String updatedD = MARSHALLER.marshall(d);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response rd1 = bean.addBibliographicKeys(false, updatedD);
            assertThat(rd1.getStatus(), is(200));
        });

        // resend deleted record:
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response rd2 = bean.addBibliographicKeys(false, updatedD);
            assertThat(rd2.getStatus(), is(200));
        });
    }

    @Test(timeout = 2_000L)
    public void reviveDeletedRecordFail() throws Exception {
        System.out.println("reviveDeletedRecordFail");

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "id", "id#1", null, null, true, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now()), "track:deleted");
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response deleted = bean.addBibliographicKeys(false, MARSHALLER.marshall(d));
            assertThat(deleted.getStatus(), is(200));
        });

        BibliographicEntity r = new BibliographicEntity(600100, "clazzifier", "id", "id#2", "work:1", "unit:1", false, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("10d"))), "track:not-revive");
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response revive = bean.addBibliographicKeys(false, MARSHALLER.marshall(r));
            assertThat(revive.getStatus(), not(is(200)));
        });
    }

    @Test(timeout = 2_000L)
    public void reviveDeletedRecordSuccess() throws Exception {
        System.out.println("reviveDeletedRecordSuccess");

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "id", "id#1", null, null, true, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("1d"))), "track:deleted");
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response deleted = bean.addBibliographicKeys(false, MARSHALLER.marshall(d));
            assertThat(deleted.getStatus(), is(200));
        });

        BibliographicEntity r = new BibliographicEntity(600100, "clazzifier", "id", "id#2", "work:1", "unit:1", false, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("10d"))), "track:revive");
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response revive = bean.addBibliographicKeys(false, MARSHALLER.marshall(r));
            assertThat(revive.getStatus(), is(200));
        });
    }

    @Test
    public void updateExistingBibliographicPostToDeletedIsDelayed() throws JsonProcessingException, SQLException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "delay", "id#2", "work:delay", "unit:delay", true, makeIndexKeys(), "track:delay");
        String updatedB = MARSHALLER.marshall(b);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, updatedB);
            assertThat(r.getStatus(), is(200));
        });
        // Record what time the bib entity was queued
        try (Connection conn = PG.createConnection() ;
             Statement statement = conn.createStatement() ;
             ResultSet resultSet = statement.executeQuery("SELECT consumer, dequeueafter > now() FROM queue")) {
            while (resultSet.next()) {
                String consumer = resultSet.getString(1);
                boolean postponed = resultSet.getBoolean(2);
                switch (consumer) {
                    case "a": // Manifestation based (postponed)
                        assertThat(postponed, is(true));
                        break;
                    case "b": // unit based (not postponed)
                        assertThat(postponed, is(false));
                        break;
                    case "c": // work based (not postponed)
                        assertThat(postponed, is(false));
                        break;
                    default:
                        fail("Unknown consumer: " + consumer);
                        break;
                }
            }
        }
    }

    /**
     * If a bibliographic post (all types) goes from deleted: false -> true,
     * that bibliographic holdings are properly updated
     *
     * @throws JsonProcessingException
     */
    @Test
    public void deleteUpdateHoldings() throws JsonProcessingException {
        // Before common FBS update
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDelete");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(600200, "onDelete", 600200, true),
                       new HoldingsToBibliographicEntity(620520, "onDelete", 600200, true),
                       new HoldingsToBibliographicEntity(620521, "onDelete", 600521, true)
               ));
        });
        // Update common for FBS
        runDeleteUpdate(600200, "onDelete", true);

        // Ensure related holdings are moved to a higher level
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDelete");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(600200, "onDelete", 870970, true),
                       new HoldingsToBibliographicEntity(620520, "onDelete", 870970, true),
                       new HoldingsToBibliographicEntity(620521, "onDelete", 600521, true)
               ));
        });
        // Before common FBS School update
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDeleteSchool");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 300200, false),
                       new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 300000, false)
               ));
        });
        // Update common FBS School, moved one level up
        runDeleteUpdate(300200, "onDeleteSchool", true);
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDeleteSchool");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 300000, false),
                       new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 300000, false)
               ));
        });
        // Update common FBS School, moved up yet again
        runDeleteUpdate(300000, "onDeleteSchool", true);
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDeleteSchool");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 870970, false),
                       new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 870970, false)
               ));
        });

        // Update single record (no ancestor) holdings does not change
        runDeleteUpdate(633333, "onDeleteSingle", true);

        // Ensure related holdings no ancestor does not change
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onDeleteSingle");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(644444, "onDeleteSingle", 633333, false)
               ));
        });
    }

    /**
     * If a bibliographic post (all types) goes from deleted: true -> false,
     * that bibliographic holdings are properly updated
     *
     * @throws JsonProcessingException
     */
    @Test
    public void recreateUpdateHoldings() throws JsonProcessingException {
        // Before update
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onRecreate");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(600300, "onRecreate", 870970, true)
               ));
        });
        // Recreate FBS library
        runDeleteUpdate(600300, "onRecreate", false);

        // Ensure related holdings are moved back to their lower level
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onRecreate");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(600300, "onRecreate", 600300, true)
               ));
        });
        // Before update of FBS School
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onRecreateSchool");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(300300, "onRecreateSchool", 300000, false)
               ));
        });
        // Recreate FBS School
        runDeleteUpdate(300300, "onRecreateSchool", false);

        // Ensure related holdings are moved to a higher level
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onRecreateSchool");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(300300, "onRecreateSchool", 300300, false)
               ));
        });
        // Recreate no holdings on lower level, nothing is moved
        runDeleteUpdate(655555, "onRecreateSingle", false);
        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = getRelatedHoldings(em, "onRecreateSingle");
            assertThat(l, containsInAnyOrder(
                       new HoldingsToBibliographicEntity(607000, "onRecreateSingle", 655555, false)
               ));
        });
    }

    /**
     * Ensures field updates that are not deleted will not update holdings in
     * any way,
     * for non fbs libraries
     *
     * @throws JsonProcessingException
     */
    @Test
    public void deleteNoHoldings() throws JsonProcessingException {
        // Assure no exceptions thrown, for any type of library
        runDeleteUpdate(780780, "onDeleteNoHoldings", true);
        runDeleteUpdate(780780, "onDeleteNoHoldings", false);

        runDeleteUpdate(340340, "onDeleteNoHoldings2", true);
        runDeleteUpdate(340340, "onDeleteNoHoldings2", false);

        runDeleteUpdate(870970, "onDeleteNoHoldings3", true);
        runDeleteUpdate(870970, "onDeleteNoHoldings3", false);

        runDeleteUpdate(300000, "onDeleteNoHoldings4", true);
        runDeleteUpdate(300000, "onDeleteNoHoldings4", false);
    }

    @Test
    public void updateNonFbsLibrary() throws JsonProcessingException {
        String json = makeBibliographicRequestJson(800000);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, json);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

            assertThat(l, contains(( new HoldingsToBibliographicEntity(800000, "new", 800000, false) )));
        });
    }

    @Test
    public void updateNonFbsLibraryWithNoHolding() throws JsonProcessingException {
        String json = makeBibliographicRequestJson(888000);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, json);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

            assertThat(l.size(), is(0));
        });
    }

    @Test(timeout = 2_000L)
    public void inconsistentDeletedStatus() throws Exception {
        System.out.println("inconsistentDeletedStatus");
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(false);
            e.setIndexKeys(null);
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, a870970);
            assertThat(r.getStatus(), not(is(200)));
        });
    }

    @Test(timeout = 2_000L)
    public void resurrectRecord() throws Exception {
        System.out.println("resurrectRecord");

        assertThat(queueContentAndClear(), empty());

        String a870970d = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(true);
        });
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(false);
        });
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, a870970d);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), empty()); // From non-existing -> deleted

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, a870970);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,unit:0",
                   "c,work:0"));
    }

    @Test(timeout = 2_000L)
    public void resurrectRecordWithHoldings() throws Exception {
        System.out.println("resurrectRecordWithHoldings");

        jpa(em -> {
            HoldingsItemBeanV1 hb = createHoldingsItemBean(em);
            hb.putIndexKeys(800010, "12345678", ON_SHELF, "h-1");
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
            assertThat(h2b, nullValue());
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            bean.addBibliographicKeys(new BibliographicEntity(800010, "katalog", "12345678",
                                                              "800010-katalog:12345678", "work:1", "unit:1",
                                                              false, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-1"), true);
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
            assertThat(h2b, notNullValue());
        });

        // Delete
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsItemBeanV1 hb = createHoldingsItemBean(em);
            bean.addBibliographicKeys(new BibliographicEntity(800010, "katalog", "12345678",
                                                              "800010-katalog:12345678", "work:1", "unit:1",
                                                              true, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-2"), true);
            hb.deleteHoldings(800010, "12345678", "h-2");
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
            assertThat(h2b, nullValue());
        });

        // Resurrect
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsItemBeanV1 hb = createHoldingsItemBean(em);
            hb.putIndexKeys(800010, "12345678", ON_SHELF, "h-2");
            bean.addBibliographicKeys(new BibliographicEntity(800010, "katalog", "12345678",
                                                              "800010-katalog:12345678", "work:1", "unit:1",
                                                              false, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-1"), true);
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity h2b = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
            assertThat(h2b, notNullValue());
        });

    }

    @Test(timeout = 20_000L)
    public void skipQueueParameter() throws Exception {
        System.out.println("skipQueueParameter");

        assertThat(queueContentAndClear(), empty());

        // live holdings
        jpa(em -> {
            em.merge(new HoldingsItemEntity(700000, "new",
                                            SolrIndexKeys.ON_SHELF, null, "test"));
        });

        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
        });
        String a870970d = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(true);
        });
        String a700000 = makeBibliographicRequestJson(
                700000, e -> {
        });
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(true, a870970);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,unit:0",
                   "c,work:0"));

        // No changes in structire - nothing queued
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(true, a870970);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), empty());

        // Change in structure
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(true, a700000);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,700000-clazzifier:new",
                   "a,870970-clazzifier:new",
                   "b,unit:0",
                   "c,work:0"));

        // Delete - change in structure
        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(true, a870970d);
            assertThat(r.getStatus(), is(200));
        });

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,unit:0",
                   "c,work:0"));
    }

    @Test(timeout = 2_000L)
    public void testHoldingsUponCommonStaysIfDeletedManifestationIsCreated() throws Exception {
        System.out.println("testHoldingsUponCommonStaysIfDeletedManifestationIsCreated");

        String a870970 = MARSHALLER.marshall(new BibliographicEntity(870970, "clazzifier", "25912233", "id#0", "work:0", "unit:0", false, new IndexKeys(), "IT"));
        String d710100 = MARSHALLER.marshall(new BibliographicEntity(710100, "clazzifier", "25912233", "id#0", "work:0", "unit:0", true, new IndexKeys(), "IT"));
        String h710100 = jsonRequestHold("710100-25912233-a");

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });

            Response r = bean.addBibliographicKeys(true, a870970);
            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            HoldingsItemBeanV1 hol = createHoldingsItemBean(em);

            hol.putHoldings(h710100, 710100, "25912233", "track");
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity htob = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(710100, "25912233"));
            System.out.println("htob = " + htob);
            assertThat(htob, notNullValue());
            assertThat(htob.getBibliographicAgencyId(), is(870970));
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(true, d710100);

            assertThat(r.getStatus(), is(200));
        });

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            HoldingsToBibliographicEntity htob = em.find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(710100, "25912233"));
            System.out.println("htob = " + htob);
            assertThat(htob, notNullValue());
            assertThat(htob.getBibliographicAgencyId(), is(870970));
        });
    }

    public void runDeleteUpdate(int agencyId, String bibliographicRecordId, boolean deleted) throws JsonProcessingException {

        BibliographicEntity b = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#3", "work:update", "unit:update", deleted, makeIndexKeys(), "track:update");
        String deletedB = MARSHALLER.marshall(b);

        jpa(em -> {
            BibliographicBeanV2 bean = createBibliographicBean(em, new Config() {
                                                         @Override
                                                         public long getReviveOlderWhenDeletedForAtleast() {
                                                             return TimeUnit.HOURS.toMillis(8);
                                                         }
                                                     });
            Response r = bean.addBibliographicKeys(false, deletedB);
            assertThat(r.getStatus(), is(200));
        });
    }

    private static IndexKeys makeIndexKeys(String... keys) {
        return IndexKeys.from(
                Arrays.stream(keys)
                        .map(s -> s.split("=", 2))
                        .collect(Collectors.groupingBy(
                                a -> a[0],
                                Collectors.mapping(
                                        a -> a[1],
                                        Collectors.toList()))));
    }

    public List<HoldingsToBibliographicEntity> getRelatedHoldings(EntityManager em, String bibId) {
        return em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId=:bibId",
                              HoldingsToBibliographicEntity.class)
                .setParameter("bibId", bibId)
                .getResultList();
    }

    private String makeBibliographicRequestJson(int agency) throws JsonProcessingException {
        return makeBibliographicRequestJson(agency, e -> {
                                    });
    }

    private String makeBibliographicRequestJson(int agency, Consumer<BibliographicEntity> modifier) throws JsonProcessingException {
        BibliographicEntity entity = new BibliographicEntity(agency, "clazzifier", "new", "id#0", "work:0", "unit:0", false, new IndexKeys(), "IT");
        modifier.accept(entity);
        return MARSHALLER.marshall(entity);
    }
}
