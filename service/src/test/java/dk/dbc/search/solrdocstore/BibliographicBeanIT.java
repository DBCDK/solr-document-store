package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.request.BibliographicEntityRequest;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicKey;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicToBibliographicEntity;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.search.solrdocstore.jpa.IndexKeys;
import dk.dbc.search.solrdocstore.jpa.IndexKeysList;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.net.URISyntaxException;
import java.sql.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static dk.dbc.search.solrdocstore.SolrIndexKeys.*;
import static java.util.Collections.EMPTY_LIST;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;

public class BibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBeanIT.class);

    private BibliographicBean bean;
    private EntityManager em;

    private final JSONBContext jsonbContext = new JSONBContext();

    @Before
    public void setupBean() throws URISyntaxException {
        em = env().getEntityManager();
        bean = createBibliographicBean(env(), new Config() {
                                   @Override
                                   public long getReviveOlderWhenDeletedForAtleast() {
                                       return TimeUnit.HOURS.toMillis(8);
                                   }
                               });
        executeScriptResource("/bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        String b870970 = makeBibliographicRequestJson(870970);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b870970)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 870970, true),
                   new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                   new HoldingsToBibliographicEntity(300100, "new", 870970, false),
                   new HoldingsToBibliographicEntity(300200, "new", 870970, false)
           ));

        String b700000 = makeBibliographicRequestJson(700000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b700000)
                );

        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                   new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                   new HoldingsToBibliographicEntity(300100, "new", 870970, false),
                   new HoldingsToBibliographicEntity(300200, "new", 870970, false)
           ));

        String b300100 = makeBibliographicRequestJson(300100);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b300100)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                   new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                   new HoldingsToBibliographicEntity(300100, "new", 300100, false),
                   new HoldingsToBibliographicEntity(300200, "new", 870970, false)
           ));

        String b300000 = makeBibliographicRequestJson(300000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b300000)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000, true),
                   new HoldingsToBibliographicEntity(700100, "new", 870970, true),
                   new HoldingsToBibliographicEntity(300100, "new", 300100, false),
                   new HoldingsToBibliographicEntity(300200, "new", 300000, false)
           ));
    }

    @Test
    public void updateExistingBibliographicPost() throws JSONBException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#1", "work:update", "unit:update", false, makeIndexKeys(), "track:update");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, updatedB)
                );
        assertThat(r.getStatus(), is(200));

        // Ensure update came through
        BibliographicEntity updatedBibEntity = em.find(BibliographicEntity.class, b.asAgencyClassifierItemKey());
        assertThat(updatedBibEntity, equalTo(b));
        //assertThat(true,equalTo(true));

        // Ensure related holdings are unchanged
        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity h WHERE h.bibliographicRecordId='properUpdate'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(610510, "properUpdate", 600100, false)
           ));
    }

    @Test
    public void updateExistingBibliographicPostToDeleted() throws JSONBException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", "work:update", "unit:update", false, makeIndexKeys(), "track:update");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, updatedB)
                );
        assertThat(r.getStatus(), is(200));

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", null, null, true, makeIndexKeys(), "track:update");
        String updatedD = jsonbContext.marshall(d);

        Response rd1 = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, updatedD)
                );
        assertThat(rd1.getStatus(), is(200));

        // resend deleted record:
        Response rd2 = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, updatedD)
                );
        assertThat(rd2.getStatus(), is(200));
    }

    @Test(timeout = 2_000L)
    public void reviveDeletedRecordFail() throws Exception {
        System.out.println("reviveDeletedRecordFail");

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "id", "id#1", null, null, true, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now()), "track:deleted");
        Response deleted = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, jsonbContext.marshall(d))
                );
        assertThat(deleted.getStatus(), is(200));

        BibliographicEntity r = new BibliographicEntity(600100, "clazzifier", "id", "id#2", "work:1", "unit:1", false, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("10d"))), "track:not-revive");
        Response revive = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, jsonbContext.marshall(r))
                );
        assertThat(revive.getStatus(), not(is(200)));
    }

    @Test(timeout = 2_000L)
    public void reviveDeletedRecordSuccess() throws Exception {
        System.out.println("reviveDeletedRecordSuccess");

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "id", "id#1", null, null, true, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("1d"))), "track:deleted");
        Response deleted = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, jsonbContext.marshall(d))
                );
        assertThat(deleted.getStatus(), is(200));

        BibliographicEntity r = new BibliographicEntity(600100, "clazzifier", "id", "id#2", "work:1", "unit:1", false, makeIndexKeys("rec.fedoraStreamDate=" + Instant.now().minusMillis(Config.ms("10d"))), "track:revive");
        Response revive = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, jsonbContext.marshall(r))
                );
        assertThat(revive.getStatus(), is(200));
    }

    @Test
    public void updateExistingBibliographicPostToDeletedIsDelayed() throws JSONBException, SQLException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "delay", "id#2", "work:delay", "unit:delay", true, makeIndexKeys(), "track:delay");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, updatedB)
                );
        assertThat(r.getStatus(), is(200));
        // Record what time the bib entity was queued
        try (Connection conn = env().getDatasource().getConnection() ;
             Statement statement = conn.createStatement() ;
             ResultSet resultSet = statement.executeQuery("SELECT consumer, dequeueafter > now() FROM queue")) {
            while (resultSet.next()) {
                String consumer = resultSet.getString(1);
                boolean postponed = resultSet.getBoolean(2);
                switch (consumer) {
                    case "a": // Manifestation based (postponed)
                        assertThat(postponed, is(true));
                        break;
                    case "b": // work based (not postponed)
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
     * @throws JSONBException
     */
    @Test
    public void deleteUpdateHoldings() throws JSONBException {
        // Before common FBS update
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onDelete");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600200, "onDelete", 600200, true),
                   new HoldingsToBibliographicEntity(620520, "onDelete", 600200, true),
                   new HoldingsToBibliographicEntity(620521, "onDelete", 600521, true)
           ));
        // Update common for FBS
        runDeleteUpdate(600200, "onDelete", true);

        // Ensure related holdings are moved to a higher level
        l = getRelatedHoldings("onDelete");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600200, "onDelete", 870970, true),
                   new HoldingsToBibliographicEntity(620520, "onDelete", 870970, true),
                   new HoldingsToBibliographicEntity(620521, "onDelete", 600521, true)
           ));
        // Before common FBS School update
        l = getRelatedHoldings("onDeleteSchool");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 300200, false),
                   new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 300000, false)
           ));
        // Update common FBS School, moved one level up
        runDeleteUpdate(300200, "onDeleteSchool", true);
        l = getRelatedHoldings("onDeleteSchool");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 300000, false),
                   new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 300000, false)
           ));
        // Update common FBS School, moved up yet again
        runDeleteUpdate(300000, "onDeleteSchool", true);
        l = getRelatedHoldings("onDeleteSchool");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(320520, "onDeleteSchool", 870970, false),
                   new HoldingsToBibliographicEntity(320521, "onDeleteSchool", 870970, false)
           ));

        // Update single record (no ancestor) holdings does not change
        runDeleteUpdate(633333, "onDeleteSingle", true);

        // Ensure related holdings no ancestor does not change
        l = getRelatedHoldings("onDeleteSingle");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(644444, "onDeleteSingle", 633333, false)
           ));

    }

    /**
     * If a bibliographic post (all types) goes from deleted: true -> false,
     * that bibliographic holdings are properly updated
     *
     * @throws JSONBException
     */
    @Test
    public void recreateUpdateHoldings() throws JSONBException {
        // Before update
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onRecreate");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600300, "onRecreate", 870970, true)
           ));
        // Recreate FBS library
        runDeleteUpdate(600300, "onRecreate", false);

        // Ensure related holdings are moved back to their lower level
        l = getRelatedHoldings("onRecreate");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600300, "onRecreate", 600300, true)
           ));
        // Before update of FBS School
        l = getRelatedHoldings("onRecreateSchool");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300300, "onRecreateSchool", 300000, false)
           ));
        // Recreate FBS School
        runDeleteUpdate(300300, "onRecreateSchool", false);

        // Ensure related holdings are moved to a higher level
        l = getRelatedHoldings("onRecreateSchool");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300300, "onRecreateSchool", 300300, false)
           ));
        // Recreate no holdings on lower level, nothing is moved
        runDeleteUpdate(655555, "onRecreateSingle", false);
        l = getRelatedHoldings("onRecreateSingle");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(607000, "onRecreateSingle", 655555, false)
           ));
    }

    @Test
    public void deleteUpdateHoldingsSupersede() throws JSONBException {
        // Before supersede update FBS
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onDeleteSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600400, "onDeleteSupersede", 600400, "onDeleteSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600401, "onDeleteSupersede", 600400, "onDeleteSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600402, "onDeleteSupersede", 600400, "onDeleteSupersedeNew", true)
           ));
        // Delete update FBS, records moved to higher level
        runDeleteUpdate(600400, "onDeleteSupersedeNew", true);
        l = getRelatedHoldings("onDeleteSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600400, "onDeleteSupersede", 870970, "onDeleteSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600401, "onDeleteSupersede", 870970, "onDeleteSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600402, "onDeleteSupersede", 870970, "onDeleteSupersedeNew", true)
           ));
        // Before supersede update FBS School
        l = getRelatedHoldings("onDeleteSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300400, "onDeleteSchoolSupersede", 300400, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300401, "onDeleteSchoolSupersede", 300400, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300402, "onDeleteSchoolSupersede", 300400, "onDeleteSchoolSupersedeNew", false)
           ));
        // Delete update FBS School, moved to higher level
        runDeleteUpdate(300400, "onDeleteSchoolSupersedeNew", true);
        l = getRelatedHoldings("onDeleteSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300400, "onDeleteSchoolSupersede", 300000, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300401, "onDeleteSchoolSupersede", 300000, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300402, "onDeleteSchoolSupersede", 300000, "onDeleteSchoolSupersedeNew", false)
           ));
        runDeleteUpdate(300000, "onDeleteSchoolSupersedeNew", true);
        l = getRelatedHoldings("onDeleteSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300400, "onDeleteSchoolSupersede", 870970, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300401, "onDeleteSchoolSupersede", 870970, "onDeleteSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300402, "onDeleteSchoolSupersede", 870970, "onDeleteSchoolSupersedeNew", false)
           ));
    }

    @Test
    public void recreateUpdateHoldingsSupersede() throws JSONBException {
        // Before FBS re-create
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onRecreateSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600500, "onRecreateSupersede", 870970, "onRecreateSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600501, "onRecreateSupersede", 870970, "onRecreateSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600502, "onRecreateSupersede", 600502, "onRecreateSupersedeNew", true)
           ));
        // Re-create FBS
        runDeleteUpdate(600500, "onRecreateSupersedeNew", false);
        l = getRelatedHoldings("onRecreateSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(600500, "onRecreateSupersede", 600500, "onRecreateSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600501, "onRecreateSupersede", 870970, "onRecreateSupersedeNew", true),
                   new HoldingsToBibliographicEntity(600502, "onRecreateSupersede", 600502, "onRecreateSupersedeNew", true)
           ));
        // Before FBS School re-create
        l = getRelatedHoldings("onRecreateSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300500, "onRecreateSchoolSupersede", 870970, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300501, "onRecreateSchoolSupersede", 870970, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300502, "onRecreateSchoolSupersede", 870970, "onRecreateSchoolSupersedeNew", false)
           ));
        // Re-create FBSSchool
        runDeleteUpdate(300000, "onRecreateSchoolSupersedeNew", false);
        l = getRelatedHoldings("onRecreateSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300500, "onRecreateSchoolSupersede", 300000, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300501, "onRecreateSchoolSupersede", 300000, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300502, "onRecreateSchoolSupersede", 300000, "onRecreateSchoolSupersedeNew", false)
           ));
        runDeleteUpdate(300500, "onRecreateSchoolSupersedeNew", false);
        l = getRelatedHoldings("onRecreateSchoolSupersedeNew");
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(300500, "onRecreateSchoolSupersede", 300500, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300501, "onRecreateSchoolSupersede", 300000, "onRecreateSchoolSupersedeNew", false),
                   new HoldingsToBibliographicEntity(300502, "onRecreateSchoolSupersede", 300000, "onRecreateSchoolSupersedeNew", false)
           ));
    }

    /**
     * Ensures field updates that are not deleted will not update holdings in
     * any way,
     * for non fbs libraries
     *
     * @throws JSONBException
     */
    @Test
    public void deleteNoHoldings() throws JSONBException {
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
    public void updateNonFbsLibrary() throws JSONBException {
        String json = makeBibliographicRequestJson(800000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, contains(( new HoldingsToBibliographicEntity(800000, "new", 800000, false) )));
    }

    @Test
    public void updateNonFbsLibraryWithNoHolding() throws JSONBException {
        String json = makeBibliographicRequestJson(888000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(0));
    }

    @Test
    public void supersedesAdd() throws Exception {

        String json = makeBibliographicRequestJson(
                870970,
                e -> {
            e.setSupersedes(Arrays.asList("a", "b"));
        });

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, json));
        assertThat(r.getStatus(), is(200));
        List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b WHERE b2b.liveBibliographicRecordId='new'", BibliographicToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(2));
        Assert.assertTrue("One superseded named 'a'", l.stream().anyMatch(b2b -> b2b.getDeadBibliographicRecordId().equals("a")));
        Assert.assertTrue("One superseded named 'b'", l.stream().anyMatch(b2b -> b2b.getDeadBibliographicRecordId().equals("b")));
    }

    @Test(timeout = 2_000L)
    public void supersedesReverted() throws Exception {
        System.out.println("supersedesReverted");

        try (Connection conn = env().getDatasource().getConnection() ;
             Statement statement = conn.createStatement()) {
            statement.executeUpdate("TRUNCATE bibliographicToBibliographic");
        }

        { // a dead  b live

            String json = makeBibliographicRequestJson(
                    870970,
                    e -> {
                e.setBibliographicRecordId("b");
                e.setSupersedes(Arrays.asList("a"));
            });

            Response r = env().getPersistenceContext()
                    .run(() -> bean.addBibliographicKeys(false, json));
            assertThat(r.getStatus(), is(200));

            List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b", BibliographicToBibliographicEntity.class).getResultList();
            System.out.println("l = " + l);
            assertThat(l, containsInAnyOrder(new BibliographicToBibliographicEntity("a", "b")));
        }
        { // a live, b dead & b deleted

            String json1 = makeBibliographicRequestJson(
                    870970,
                    e -> {
                e.setBibliographicRecordId("a");
                e.setSupersedes(Arrays.asList("b"));
            });

            Response r1 = env().getPersistenceContext()
                    .run(() -> bean.addBibliographicKeys(false, json1));
            assertThat(r1.getStatus(), is(200));
            String json2 = makeBibliographicRequestJson(
                    870970,
                    e -> {
                e.setBibliographicRecordId("b");
                e.setDeleted(true);
                e.setSupersedes(Arrays.asList("a"));
            });

            Response r2 = env().getPersistenceContext()
                    .run(() -> bean.addBibliographicKeys(false, json2));
            assertThat(r2.getStatus(), is(200));

            List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b", BibliographicToBibliographicEntity.class).getResultList();
            System.out.println("l = " + l);
            assertThat(l, containsInAnyOrder(new BibliographicToBibliographicEntity("b", "a")));
        }
    }

    @Test
    public void newRecordWhereSupersedesIsAlreadySet() throws Exception {

        Response r;
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setBibliographicRecordId("a");
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, a870970));
        assertThat(r.getStatus(), is(200));

        // Setup holding pointint to 870970:a
        env().getPersistenceContext()
                .run(() -> {
                    em.persist(new HoldingsItemEntity(700000, "a", new IndexKeysList(), "T#1"));
                });
        env().getPersistenceContext()
                .run(() -> {
                    em.persist(new HoldingsToBibliographicEntity(700000, "a", 870970, true));
                });

        String b870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setBibliographicRecordId("b");
            e.setSupersedes(Arrays.asList("a"));
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b870970));
        assertThat(r.getStatus(), is(200));

        // Not really nessecary
        String a870970d = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(true);
            e.setBibliographicRecordId("a");
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, a870970d));
        assertThat(r.getStatus(), is(200));

        HoldingsToBibliographicEntity h2bBefore = env().getPersistenceContext()
                .run(() -> {
                    return em.find(HoldingsToBibliographicEntity.class,
                                   new HoldingsToBibliographicKey(700000, "a"));
                });

        Assert.assertEquals(new HoldingsToBibliographicEntity(700000, "a", 870970, "b", true), h2bBefore);

        String b70000 = makeBibliographicRequestJson(
                700000, e -> {
            e.setBibliographicRecordId("b");
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, b70000));
        assertThat(r.getStatus(), is(200));

        HoldingsToBibliographicEntity h2bAfter = env().getPersistenceContext()
                .run(() -> {
                    return em.find(HoldingsToBibliographicEntity.class,
                                   new HoldingsToBibliographicKey(700000, "a"));
                });

        Assert.assertEquals(new HoldingsToBibliographicEntity(700000, "a", 700000, "b", true), h2bAfter);
    }

    @Test(timeout = 2_000L)
    public void inconsistentDeletedStatus() throws Exception {
        System.out.println("inconsistentDeletedStatus");
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(false);
            e.setIndexKeys(null);
        });

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, a870970));
        assertThat(r.getStatus(), not(is(200)));
    }

    @Test(timeout = 2_000L)
    public void resurrectRecord() throws Exception {
        System.out.println("resurrectRecord");

        evictAll();

        assertThat(queueContentAndClear(), empty());

        Response r;
        String a870970d = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(true);
        });
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(false);
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, a870970d));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), empty()); // From non-existing -> deleted

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, a870970));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,work:0"));
    }

    @Test(timeout = 2_000L)
    public void resurrectRecordWithHoldings() throws Exception {
        System.out.println("resurrectRecordWithHoldings");

        HoldingsItemBean hb = createHoldingsItemBean(env());
        HoldingsToBibliographicEntity h2b;

        env().getPersistenceContext()
                .run(() -> {
                    hb.setHoldingsKeys(new HoldingsItemEntity(800010, "12345678", ON_SHELF, "h-1"));
                });

        h2b = env().getPersistenceContext()
                .run(() -> {
                    return env().getEntityManager()
                            .find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
                });
        assertThat(h2b, nullValue());

        env().getPersistenceContext()
                .run(() -> {
                    bean.addBibliographicKeys(
                            new BibliographicEntity(800010, "katalog", "12345678",
                                                    "800010-katalog:12345678", "work:1", "unit:1",
                                                    false, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-1"), EMPTY_LIST, true);
                });

        h2b = env().getPersistenceContext()
                .run(() -> {
                    return env().getEntityManager()
                            .find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
                });
        assertThat(h2b, notNullValue());

        // Delete
        env().getPersistenceContext()
                .run(() -> {
                    bean.addBibliographicKeys(
                            new BibliographicEntity(800010, "katalog", "12345678",
                                                    "800010-katalog:12345678", "work:1", "unit:1",
                                                    true, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-2"), EMPTY_LIST, true);
                    hb.setHoldingsKeys(new HoldingsItemEntity(800010, "12345678", NO_HOLDINGS, "h-2"));
                });

        h2b = env().getPersistenceContext()
                .run(() -> {
                    return env().getEntityManager()
                            .find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
                });
        assertThat(h2b, nullValue());

        // Resurrect
        env().getPersistenceContext()
                .run(() -> {
                    hb.setHoldingsKeys(new HoldingsItemEntity(800010, "12345678", ON_SHELF, "h-2"));
                    bean.addBibliographicKeys(
                            new BibliographicEntity(800010, "katalog", "12345678",
                                                    "800010-katalog:12345678", "work:1", "unit:1",
                                                    false, biblIndexKeys("{'rec.fedoraStreamDate': ['" + Instant.now() + "']}"), "b-1"), EMPTY_LIST, true);
                });

        h2b = env().getPersistenceContext()
                .run(() -> {
                    return env().getEntityManager()
                            .find(HoldingsToBibliographicEntity.class, new HoldingsToBibliographicKey(800010, "12345678"));
                });
        assertThat(h2b, notNullValue());

    }

    @Test(timeout = 20_000L)
    public void skipQueueParameter() throws Exception {
        System.out.println("skipQueueParameter");

        Response r;

        assertThat(queueContentAndClear(), empty());

        // live holdings
        env().getPersistenceContext()
                .run(() -> env().getEntityManager().merge(
                        new HoldingsItemEntity(700000, "new",
                                               SolrIndexKeys.ON_SHELF,
                                               "test")));

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
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(true, a870970));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,work:0"));

        // No changes in structire - nothing queued
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(true, a870970));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), empty());

        // Change in structure
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(true, a700000));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,700000-clazzifier:new",
                   "a,870970-clazzifier:new",
                   "b,work:0"));

        // Delete - change in structure
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(true, a870970d));
        assertThat(r.getStatus(), is(200));

        assertThat(queueContentAndClear(), containsInAnyOrder(
                   "a,870970-clazzifier:new",
                   "b,work:0"));
    }

    private void evictAll() throws SQLException {
        try (Connection connection = env().getDatasource().getConnection() ;
             Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("TRUNCATE bibliographictobibliographic CASCADE");
            stmt.executeUpdate("TRUNCATE bibliographicsolrkeys CASCADE");
            stmt.executeUpdate("TRUNCATE holdingstobibliographic CASCADE");
            stmt.executeUpdate("TRUNCATE holdingsitemssolrkeys CASCADE");
        }
        em.getEntityManagerFactory().getCache().evictAll();
    }

    public void runDeleteUpdate(int agencyId, String bibliographicRecordId, boolean deleted) throws JSONBException {

        BibliographicEntity b = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#3", "work:update", "unit:update", deleted, makeIndexKeys(), "track:update");
        String deletedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(false, deletedB)
                );
        assertThat(r.getStatus(), is(200));
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

    public List<HoldingsToBibliographicEntity> getRelatedHoldings(String bibId) {
        return em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId=:bibId",
                              HoldingsToBibliographicEntity.class)
                .setParameter("bibId", bibId)
                .getResultList();
    }

    private String makeBibliographicRequestJson(int agency) throws JSONBException {
        return makeBibliographicRequestJson(agency, e -> {
                                    });
    }

    private String makeBibliographicRequestJson(int agency, Consumer<BibliographicEntityRequest> modifier) throws JSONBException {
        BibliographicEntityRequest entity = new BibliographicEntityRequest(agency, "clazzifier", "new", "id#0", "work:0", "unit:0", false, new IndexKeys(), "IT", null);
        modifier.accept(entity);
        return jsonbContext.marshall(entity);
    }
}
