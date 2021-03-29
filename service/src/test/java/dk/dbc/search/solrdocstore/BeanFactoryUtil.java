package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Iterables;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;

import javax.ejb.EJBException;
import javax.persistence.EntityManager;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collection;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.makeOpenAgencyEntity;

public class BeanFactoryUtil {

    private static final ObjectMapper O = new ObjectMapper();

    public static BibliographicBean createBibliographicBean(JpaTestEnvironment env) {
        BibliographicBean bean = new BibliographicBean();
        EntityManager em = env.getEntityManager();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.h2bBean = createHoldingsToBibliographicBean(env);
        bean.brBean = createBibliographicRetrieveBean(env);
        bean.enqueueSupplier = createEnqueueSupplier(env);
        return bean;
    }

    public static BibliographicRecordAPIBean createBiliographicRecordAPIBean(JpaTestEnvironment env) {
        BibliographicRecordAPIBean bean = new BibliographicRecordAPIBean();
        bean.entityManager = env.getEntityManager();
        bean.brBean = createBibliographicRetrieveBean(env);
        bean.holdingsItemBean = createHoldingsItemBean(env);
        return bean;
    }

    public static HoldingsItemBean createHoldingsItemBean(JpaTestEnvironment env) {
        HoldingsItemBean bean = new HoldingsItemBean();
        bean.entityManager = env.getEntityManager();
        bean.h2bBean = createHoldingsToBibliographicBean(env);
        bean.enqueueSupplier = createEnqueueSupplier(env);
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(JpaTestEnvironment env) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = env.getEntityManager();
        bean.openAgency = createOpenAgencyBean();
        bean.brBean = createBibliographicRetrieveBean(env);
        return bean;
    }

    public static OpenAgencyStatusBean createOpenAgencyStatusBean(JpaTestEnvironment env) {
        OpenAgencyStatusBean bean = new OpenAgencyStatusBean() {
            @Override
            String hash(int agencyId) throws NoSuchAlgorithmException {
                return "";
            }
        };
        bean.entityManager = env.getEntityManager();
        bean.proxy = createOpenAgencyProxyBean();
        bean.supplier = createEnqueueSupplier(env);
        return bean;
    }

    public static EnqueueSupplierBean createEnqueueSupplier(JpaTestEnvironment env) {
        EnqueueSupplierBean bean = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(
                        new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                        new QueueRuleEntity("a", QueueType.MANIFESTATION_DELETED, 100_000),
                        new QueueRuleEntity("a", QueueType.HOLDING, 0),
                        new QueueRuleEntity("a", QueueType.RESOURCE, 0));
            }
        };
        EntityManager entityManager = env.getEntityManager();
        bean.entityManager = entityManager;
        return bean;
    }

    public static OpenAgencyBean createOpenAgencyBean() {
        return new OpenAgencyBean() {
            @Override
            public OpenAgencyEntity lookup(int agencyId) {
                return makeOpenAgencyEntity(agencyId);
            }

            @Override
            public RecordType getRecordType(int agencyId) {
                if (agencyId == LibraryType.COMMON_AGENCY) {
                    return RecordType.CommonRecord;
                }
                if (agencyId == LibraryType.SCHOOL_COMMON_AGENCY) {
                    return RecordType.CommonRecord;
                }
                return RecordType.SingleRecord;
            }
        };
    }

    public static OpenAgencyProxyBean createOpenAgencyProxyBean() {
        return new OpenAgencyProxyBean() {
            @Override
            public OpenAgencyEntity loadOpenAgencyEntry(int agencyId) {
                try {
                    String resource = "openagency-" + agencyId + ".json";
                    LibraryRulesResponse libraryRulesResponse =
                            new ObjectMapper().readValue(OpenAgencyProxyBeanTest.class.getClassLoader().getResourceAsStream(resource), LibraryRulesResponse.class);
                    return new OpenAgencyEntity(Iterables.getFirst(libraryRulesResponse.getLibraryRules(), null));
                } catch (Exception ex) {
                    throw new EJBException(ex);
                }
            }
        };
    }

    public static DocumentRetrieveBean createDocumentRetrieveBean(JpaTestEnvironment env) {
        DocumentRetrieveBean bean = new DocumentRetrieveBean();
        bean.entityManager = env.getEntityManager();
        bean.brBean = createBibliographicRetrieveBean(env);
        bean.brrBean = createBibliographicResourceRetrieveBean(env);
        bean.oaBean = createOpenAgencyBean();
        return bean;
    }

    public static BibliographicResourceRetrieveBean createBibliographicResourceRetrieveBean(JpaTestEnvironment env) {
        BibliographicResourceRetrieveBean bean = new BibliographicResourceRetrieveBean();
        bean.entityManager = env.getEntityManager();
        return bean;
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
        return bean;
    }

    public static ResourceBean createResourceBean(JpaTestEnvironment env) {
        ResourceBean bean = new ResourceBean();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = env.getEntityManager();
        bean.openAgency = openAgency;
        bean.enqueueSupplier = createEnqueueSupplier(env);
        return bean;
    }
}
