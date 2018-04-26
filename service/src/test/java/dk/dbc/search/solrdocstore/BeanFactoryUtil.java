package dk.dbc.search.solrdocstore;

import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.util.Arrays;
import java.util.Collection;
import javax.persistence.EntityManager;

import static dk.dbc.search.solrdocstore.QueueTestUtil.clearQueue;

public class BeanFactoryUtil {

    public static BibliographicBean createBibliographicBean(JpaTestEnvironment env) {
        BibliographicBean bean = new BibliographicBean();
        EntityManager em = env.getEntityManager();
        LibraryConfig config = createLibraryConfig();
        bean.entityManager = em;
        bean.libraryConfig = config;
        bean.queue = createEnqueueSupplier(env);
        bean.h2bBean = createHoldingsToBibliographicBean(env);
        bean.brBean = createBibliographicRetrieveBean(env);
        return bean;
    }

    public static BiliographicRecordAPIBean createBiliographicRecordAPIBean(JpaTestEnvironment env) {
        BiliographicRecordAPIBean bean = new BiliographicRecordAPIBean();
        bean.entityManager = env.getEntityManager();
        bean.brBean = createBibliographicRetrieveBean(env);
        bean.holdingsItemBean = createHoldingsItemBean(env);
        return bean;
    }

    public static HoldingsItemBean createHoldingsItemBean(JpaTestEnvironment env) {
        HoldingsItemBean bean = new HoldingsItemBean();
        bean.entityManager = env.getEntityManager();
        bean.h2bBean = createHoldingsToBibliographicBean(env);
        bean.queue = createEnqueueSupplier(env);
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(JpaTestEnvironment env) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = env.getEntityManager();
        bean.libraryConfig = createLibraryConfig();
        bean.brBean = createBibliographicRetrieveBean(env);
        return bean;
    }

    public static EnqueueSupplierBean createEnqueueSupplier(JpaTestEnvironment env) {
        EnqueueSupplierBean bean = new EnqueueSupplierBean();
        bean.daemon = new QueueRulesDaemon() {
            @Override
            public Collection<String> getManifestationQueues() {
                return Arrays.asList("a");
            }
        };
        EntityManager entityManager = env.getEntityManager();
        bean.entityManager = entityManager;
        env.getPersistenceContext().run(() -> {
            clearQueue(entityManager);
        });
        return bean;
    }

    public static LibraryConfig createLibraryConfig() {
        LibraryConfig config = new LibraryConfig() {
            @Override
            public LibraryType getLibraryType(int agencyId) {
                if (agencyId >= 800000) {
                    return LibraryType.NonFBS;
                }
                if (agencyId < 400000) {
                    return LibraryType.FBSSchool;
                }
                return LibraryType.FBS;
            }

            @Override
            public RecordType getRecordType(int agencyId) {
                if (agencyId == 870970) {
                    return RecordType.CommonRecord;
                }
                if (agencyId == 300000) {
                    return RecordType.CommonRecord;
                }
                return RecordType.SingleRecord;
            }

        };
        return config;
    }

    public static BibliographicRetrieveBean createBibliographicRetrieveBean(JpaTestEnvironment env) {
        BibliographicRetrieveBean bean = new BibliographicRetrieveBean();
        bean.entityManager = env.getEntityManager();
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em, LibraryConfig config, EnqueueSupplierBean queue, BibliographicRetrieveBean brBean) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.libraryConfig = config;
        bean.brBean = brBean;
        return bean;
    }

    public static HoldingsItemBean createHoldingsItemBean(EntityManager em, EnqueueSupplierBean queue, HoldingsToBibliographicBean h2bBean) {
        HoldingsItemBean bean = new HoldingsItemBean();
        bean.entityManager = em;
        bean.h2bBean = h2bBean;
        bean.queue = queue;
        return bean;
    }
}
