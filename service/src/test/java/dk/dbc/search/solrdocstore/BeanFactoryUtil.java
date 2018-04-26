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
        OpenAgencyBean config = createOpenAgencyBean();
        bean.entityManager = em;
        bean.openAgency = config;
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
        bean.openAgency = createOpenAgencyBean();
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

    public static OpenAgencyBean createOpenAgencyBean() {
        return new OpenAgencyBean() {
            @Override
            public OpenAgencyEntity lookup(int agencyId) {
                if (agencyId >= 800000) {
                    return new OpenAgencyEntity(agencyId, LibraryType.NonFBS, agencyId % 100000 < 50000);
                }
                if (agencyId < 400000) {
                    return new OpenAgencyEntity(agencyId, LibraryType.FBSSchool, false);
                }
                return new OpenAgencyEntity(agencyId, LibraryType.FBS, agencyId % 100000 < 50000);
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
    }

    public static BibliographicRetrieveBean createBibliographicRetrieveBean(JpaTestEnvironment env) {
        BibliographicRetrieveBean bean = new BibliographicRetrieveBean();
        bean.entityManager = env.getEntityManager();
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em, OpenAgencyBean openAgency, EnqueueSupplierBean queue, BibliographicRetrieveBean brBean) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
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
