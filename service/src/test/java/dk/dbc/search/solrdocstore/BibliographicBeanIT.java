package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.net.URISyntaxException;
import java.sql.*;
import java.util.*;
import java.util.Date;
import java.util.function.Consumer;

import static dk.dbc.search.solrdocstore.BeanFactoryUtil.*;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class BibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private BibliographicBean bean;
    private EntityManager em;

    private final JSONBContext jsonbContext = new JSONBContext();

    @Before
    public void setupBean() throws URISyntaxException {
        em = env().getEntityManager();
        bean = createBibliographicBean(env());
        executeScriptResource("/bibliographicUpdate.sql");
    }

    @Test
    public void newCommonRecordWithExistingHoldings() throws Exception {

        String b870970 = makeBibliographicRequestJson(870970);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b870970)
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
                .run(() -> bean.addBibliographicKeys(null, b700000)
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
                .run(() -> bean.addBibliographicKeys(null, b300100)
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
                .run(() -> bean.addBibliographicKeys(null, b300000)
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
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#1", "work:update", "unit:update", "prod:update", false, new HashMap<>(), "track:update");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, updatedB)
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
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", "work:update", "unit:update", "prod:update", false, new HashMap<>(), "track:update");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, updatedB)
                );
        assertThat(r.getStatus(), is(200));

        BibliographicEntity d = new BibliographicEntity(600100, "clazzifier", "properUpdate", "id#2", null, null, "prod:update", true, new HashMap<>(), "track:update");
        String updatedD = jsonbContext.marshall(d);

        Response rd = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, updatedD)
                );
        assertThat(rd.getStatus(), is(200));
    }

    @Test
    public void updateExistingBibliographicPostToDeletedIsDelayed() throws JSONBException, SQLException {
        BibliographicEntity b = new BibliographicEntity(600100, "clazzifier", "delay", "id#2", "work:delay", "unit:delay", "prod:delay", true, new HashMap<>(), "track:delay");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, updatedB)
                );
        assertThat(r.getStatus(), is(200));
        // TODO
        try (Connection conn = env().getDatasource().getConnection();
             Statement statement = conn.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT dequeueafter FROM queue")) {
            while (resultSet.next()) {
                Timestamp dequeueAfter = resultSet.getTimestamp(1);
                Date now = new Date();
                assertThat(dequeueAfter.after(now), is(true));
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
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, contains(( new HoldingsToBibliographicEntity(800000, "new", 800000, false) )));
    }

    @Test
    public void updateNonFbsLibraryWithNoHolding() throws JSONBException {
        String json = makeBibliographicRequestJson(888000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(0));
    }

    @Test
    public void supercedsAdd() throws Exception {

        String json = makeBibliographicRequestJson(
                870970,
                e -> {
            e.setSuperceds(Arrays.asList("a", "b"));
        });

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json));
        assertThat(r.getStatus(), is(200));
        List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b WHERE b2b.liveBibliographicRecordId='new'", BibliographicToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(2));
        Assert.assertTrue("One superceded named 'a'", l.stream().anyMatch(b2b -> b2b.getDeadBibliographicRecordId().equals("a")));
        Assert.assertTrue("One superceded named 'b'", l.stream().anyMatch(b2b -> b2b.getDeadBibliographicRecordId().equals("b")));
    }

    @Test
    public void newRecordWhereSuperceedsIsAlreadySet() throws Exception {

        Response r;
        String a870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setBibliographicRecordId("a");
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, a870970));
        assertThat(r.getStatus(), is(200));

        // Setup holding pointint to 870970:a
        env().getPersistenceContext()
                .run(() -> {
                    em.persist(new HoldingsItemEntity(700000, "a", "V1", Collections.EMPTY_LIST, "T#1"));
                });
        env().getPersistenceContext()
                .run(() -> {
                    em.persist(new HoldingsToBibliographicEntity(700000, "a", 870970, true));
                });

        String b870970 = makeBibliographicRequestJson(
                870970, e -> {
            e.setBibliographicRecordId("b");
            e.setSuperceds(Arrays.asList("a"));
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b870970));
        assertThat(r.getStatus(), is(200));

        // Not really nessecary
        String a870970d = makeBibliographicRequestJson(
                870970, e -> {
            e.setDeleted(true);
            e.setBibliographicRecordId("a");
        });
        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, a870970d));
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
                .run(() -> bean.addBibliographicKeys(null, b70000));
        assertThat(r.getStatus(), is(200));

        HoldingsToBibliographicEntity h2bAfter = env().getPersistenceContext()
                .run(() -> {
                    return em.find(HoldingsToBibliographicEntity.class,
                                   new HoldingsToBibliographicKey(700000, "a"));
                });

        Assert.assertEquals(new HoldingsToBibliographicEntity(700000, "a", 700000, "b", true), h2bAfter);
    }

    public void runDeleteUpdate(int agencyId, String bibliographicRecordId, boolean deleted) throws JSONBException {
        BibliographicEntity b = new BibliographicEntity(agencyId, "clazzifier", bibliographicRecordId, "id#3", "work:update", "unit:update", "prod:update", deleted, new HashMap<>(), "track:update");
        String deletedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, deletedB)
                );
        assertThat(r.getStatus(), is(200));
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
        BibliographicEntityRequest entity = new BibliographicEntityRequest(agency, "clazzifier", "new", "id#0", "w", "u", "v0.1", false, Collections.EMPTY_MAP, "IT", null, null);
        modifier.accept(entity);
        return jsonbContext.marshall(entity);
    }

}
