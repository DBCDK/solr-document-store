package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.function.Consumer;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;

public class BibliographicBeanIT extends JpaSolrDocStoreIntegrationTester {

    private BibliographicBean bean;
    private EntityManager em;

    private final JSONBContext jsonbContext = new JSONBContext();

    @Before
    public void setupBean() throws URISyntaxException {
        bean = new BibliographicBean();
        em = env().getEntityManager();
        bean.entityManager = em;
        bean.libraryConfig = new LibraryConfig() {
            @Override
            public LibraryType getLibraryType(int agencyId) {
                if (agencyId >= 800000) return LibraryType.NonFBS;
                if (agencyId < 400000) return LibraryType.FBSSchool;
                return LibraryType.FBS;
            }
        };
        bean.h2bBean = new HoldingsToBibliographicBean();
        bean.h2bBean.entityManager = em;
        bean.h2bBean.libraryConfig = bean.libraryConfig;
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
                   new HoldingsToBibliographicEntity(700000, "new", 870970),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 870970),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b700000 = makeBibliographicRequestJson(700000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b700000)
                );

        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 870970),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b300100 = makeBibliographicRequestJson(300100);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b300100)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                   new HoldingsToBibliographicEntity(700000, "new", 700000),
                   new HoldingsToBibliographicEntity(700100, "new", 870970),
                   new HoldingsToBibliographicEntity(300100, "new", 300100),
                   new HoldingsToBibliographicEntity(300200, "new", 870970)
           ));

        String b300000 = makeBibliographicRequestJson(300000);

        r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, b300000)
                );
        assertThat(r.getStatus(), is(200));

        l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l, containsInAnyOrder(
                new HoldingsToBibliographicEntity(700000, "new", 700000),
                new HoldingsToBibliographicEntity(700100, "new", 870970),
                new HoldingsToBibliographicEntity(300100, "new", 300100),
                new HoldingsToBibliographicEntity(300200, "new", 300000)
        ));
    }

    @Test
    public void updateExistingBibliographicPost() throws JSONBException {
        BibliographicEntity b = new BibliographicEntity(600100,"properUpdate","work:update","unit:update","prod:update",false,new HashMap<>(),"track:update");
        String updatedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, updatedB)
                );
        assertThat(r.getStatus(), is(200));

        // Ensure update came through
        BibliographicEntity updatedBibEntity = em.find(BibliographicEntity.class, new AgencyItemKey(b.agencyId, b.bibliographicRecordId));
        assertThat(updatedBibEntity,equalTo(b));
        //assertThat(true,equalTo(true));

        // Ensure related holdings are unchanged
        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity h WHERE h.bibliographicRecordId='properUpdate'", HoldingsToBibliographicEntity.class).getResultList();
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(610510,"properUpdate",600100)
        ));
    }

    /**
     * If a bibliographic post (all types) goes from deleted: false -> true, that bibliographic holdings are properly updated
     * @throws JSONBException
     */
    @Test
    public void deleteUpdateHoldings() throws JSONBException {
        // Update common for FBS
        runDeleteUpdate(600200,"onDelete",true);

        // Ensure related holdings are moved to a higher level
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onDelete");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(600200,"onDelete",870970),
                new HoldingsToBibliographicEntity(620520,"onDelete",870970),
                new HoldingsToBibliographicEntity(620521,"onDelete",600521)
        ));
        // Update common FBS School
        runDeleteUpdate(300200,"onDeleteSchool",true);
        l = getRelatedHoldings("onDeleteSchool");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(320520,"onDeleteSchool",870970),
                new HoldingsToBibliographicEntity(320521,"onDeleteSchool",870970)
        ));
        runDeleteUpdate(870970,"onDeleteSchool",true);
        l = getRelatedHoldings("onDeleteSchool");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(320520,"onDeleteSchool",300000),
                new HoldingsToBibliographicEntity(320521,"onDeleteSchool",300000)
        ));

        // Update single record (no ancestor) holdings does not change
        runDeleteUpdate(633333,"onDeleteSingle",true);

        // Ensure related holdings no ancestor does not change
        l = getRelatedHoldings("onDeleteSingle");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(644444,"onDeleteSingle",633333)
        ));

    }

    /**
     * If a bibliographic post (all types) goes from deleted: true -> false, that bibliographic holdings are properly updated
     * @throws JSONBException
     */
    @Test
    public void recreateUpdateHoldings() throws JSONBException {
        // Recreate FBS library
        runDeleteUpdate(600300,"onRecreate",false);

        // Ensure related holdings are moved to a higher level
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onRecreate");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(600300,"onRecreate",600300)
        ));
        // Recreate FBS School
        runDeleteUpdate(300300,"onRecreateSchool",false);

        // Ensure related holdings are moved to a higher level
        l = getRelatedHoldings("onRecreateSchool");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(300300,"onRecreateSchool",300300)
        ));
        // Recreate no descendants
        runDeleteUpdate(655555,"onRecreateSingle",false);

        // Ensure related holdings are moved to a higher level
        l = getRelatedHoldings("onRecreateSingle");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(607000,"onRecreateSingle",655555)
        ));
    }

    @Test
    public void deleteUpdateHoldingsSupersede() throws JSONBException {
        // Delete update FBS
        runDeleteUpdate(600400,"onDeleteSupersedeNew",true);
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onDeleteSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(600400,"onDeleteSupersede",870970,"onDeleteSupersedeNew"),
                new HoldingsToBibliographicEntity(600401,"onDeleteSupersede",870970,"onDeleteSupersedeNew"),
                new HoldingsToBibliographicEntity(600402,"onDeleteSupersede",870970,"onDeleteSupersedeNew")
        ));
        // Delete update FBS School
        runDeleteUpdate(300400,"onDeleteSchoolSupersedeNew",true);
        l = getRelatedHoldings("onDeleteSchoolSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(300400,"onDeleteSchoolSupersede",870970,"onDeleteSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300401,"onDeleteSchoolSupersede",870970,"onDeleteSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300402,"onDeleteSchoolSupersede",870970,"onDeleteSchoolSupersedeNew")
        ));
        runDeleteUpdate(870970,"onDeleteSchoolSupersedeNew",true);
        l = getRelatedHoldings("onDeleteSchoolSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(300400,"onDeleteSchoolSupersede",300000,"onDeleteSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300401,"onDeleteSchoolSupersede",300000,"onDeleteSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300402,"onDeleteSchoolSupersede",300000,"onDeleteSchoolSupersedeNew")
        ));
    }

    @Test
    public void recreateUpdateHoldingsSupersede() throws JSONBException {
        // Re-create FBS
        runDeleteUpdate(600500,"onRecreateSupersedeNew",false);
        List<HoldingsToBibliographicEntity> l = getRelatedHoldings("onRecreateSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(600500,"onRecreateSupersede",600500,"onRecreateSupersedeNew"),
                new HoldingsToBibliographicEntity(600501,"onRecreateSupersede",870970,"onRecreateSupersedeNew"),
                new HoldingsToBibliographicEntity(600502,"onRecreateSupersede",600502,"onRecreateSupersedeNew")
        ));
        // Re-create FBSSchool
        runDeleteUpdate(870970,"onRecreateSchoolSupersedeNew",false);
        l = getRelatedHoldings("onRecreateSchoolSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(300500,"onRecreateSchoolSupersede",870970,"onRecreateSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300501,"onRecreateSchoolSupersede",870970,"onRecreateSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300502,"onRecreateSchoolSupersede",870970,"onRecreateSchoolSupersedeNew")
        ));
        runDeleteUpdate(300500,"onRecreateSchoolSupersedeNew",false);
        l = getRelatedHoldings("onRecreateSchoolSupersedeNew");
        assertThat(l,containsInAnyOrder(
                new HoldingsToBibliographicEntity(300500,"onRecreateSchoolSupersede",300500,"onRecreateSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300501,"onRecreateSchoolSupersede",870970,"onRecreateSchoolSupersedeNew"),
                new HoldingsToBibliographicEntity(300502,"onRecreateSchoolSupersede",870970,"onRecreateSchoolSupersedeNew")
        ));
    }

    /**
     * Ensures field updates that are not deleted will not update holdings in any way,
     * for non fbs libraries
     * @throws JSONBException
     */
    @Test
    public void deleteNoHoldings() throws JSONBException {
        // Assure no exceptions thrown, for any type of library
        runDeleteUpdate(780780,"onDeleteNoHoldings",true);
        runDeleteUpdate(780780,"onDeleteNoHoldings",false);

        runDeleteUpdate(340340,"onDeleteNoHoldings2",true);
        runDeleteUpdate(340340,"onDeleteNoHoldings2",false);

        runDeleteUpdate(870970,"onDeleteNoHoldings3",true);
        runDeleteUpdate(870970,"onDeleteNoHoldings3",false);

        runDeleteUpdate(300000,"onDeleteNoHoldings4",true);
        runDeleteUpdate(300000,"onDeleteNoHoldings4",false);
    }

    @Test
    public void updateNonFbsLibrary() throws JSONBException {
        String json = makeBibliographicRequestJson(800000);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, json)
                );

        assertThat(r.getStatus(), is(200));

        List<HoldingsToBibliographicEntity> l = em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId='new'", HoldingsToBibliographicEntity.class).getResultList();

        assertThat(l, contains(( new HoldingsToBibliographicEntity(800000, "new", 800000) )));
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
               888000,
               e -> {
           e.superceds = Arrays.asList("a", "b");
       });

        Response r = env().getPersistenceContext()
                 .run(() -> bean.addBibliographicKeys(null, json));
        assertThat(r.getStatus(), is(200));
        List<BibliographicToBibliographicEntity> l = em.createQuery("SELECT b2b FROM BibliographicToBibliographicEntity as b2b WHERE b2b.liveBibliographicRecordId='new'", BibliographicToBibliographicEntity.class).getResultList();

        assertThat(l.size(), is(2));
        Assert.assertTrue("One superceded named 'a'", l.stream().anyMatch(b2b -> b2b.deadBibliographicRecordId.equals("a")));
        Assert.assertTrue("One superceded named 'b'", l.stream().anyMatch(b2b -> b2b.deadBibliographicRecordId.equals("b")));
    }

    public void runDeleteUpdate(int agencyId, String bibliographicRecordId, boolean deleted) throws JSONBException {
        BibliographicEntity b = new BibliographicEntity(agencyId,bibliographicRecordId,"work:update","unit:update","prod:update",deleted,new HashMap<>(),"track:update");
        String deletedB = jsonbContext.marshall(b);

        Response r = env().getPersistenceContext()
                .run(() -> bean.addBibliographicKeys(null, deletedB)
                );
        assertThat(r.getStatus(), is(200));
    }

    public List<HoldingsToBibliographicEntity> getRelatedHoldings(String bibId) {
        return em.createQuery("SELECT h FROM HoldingsToBibliographicEntity as h WHERE h.bibliographicRecordId=:bibId",
                HoldingsToBibliographicEntity.class)
                .setParameter("bibId",bibId)
                .getResultList();
    }

    private String makeBibliographicRequestJson(int agency) throws JSONBException {
        return makeBibliographicRequestJson(agency, e -> {
                                    });
    }

    private String makeBibliographicRequestJson(int agency, Consumer<BibliographicEntityRequest> modifier) throws JSONBException {
        BibliographicEntityRequest entity1 = new BibliographicEntityRequest();
        entity1.agencyId = agency;
        entity1.bibliographicRecordId = "new";
        entity1.unit = "u";
        entity1.work = "w";
        entity1.trackingId = "IT";
        BibliographicEntityRequest entity = entity1;
        modifier.accept(entity);
        return jsonbContext.marshall(entity);
    }

}
