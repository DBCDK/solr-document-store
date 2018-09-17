package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.persistence.JpaTestEnvironment;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collection;
import javax.persistence.EntityManager;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.*;

public class BeanFactoryUtil {

    private static final ObjectMapper O = new ObjectMapper();

    public static BibliographicBean createBibliographicBean(JpaTestEnvironment env) {
        BibliographicBean bean = new BibliographicBean();
        EntityManager em = env.getEntityManager();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.queue = createEnqueueSupplier(env);
        bean.h2bBean = createHoldingsToBibliographicBean(env);
        bean.brBean = createBibliographicRetrieveBean(env);
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

    public static EnqueueBean createEnqueueBean(JpaTestEnvironment env) {
        EnqueueBean bean = new EnqueueBean();
        bean.entityManager = env.getEntityManager();
        bean.enqueueSupplier = createEnqueueSupplier(env);
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
        EnqueueSupplierBean bean = new EnqueueSupplierBean();
        bean.daemon = new QueueRulesDaemon() {
            @Override
            public Collection<String> getManifestationQueues() {
                return Arrays.asList("a");
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
                if (agencyId ==  LibraryType.SCHOOL_COMMON_AGENCY) {
                    return RecordType.CommonRecord;
                }
                return RecordType.SingleRecord;
            }
        };
    }

    public static OpenAgencyProxyBean createOpenAgencyProxyBean() {
        return new OpenAgencyProxyBean() {
            @Override
            public JsonNode loadOpenAgencyJson(int agencyId) {
                try {
                    String resource = "openagency-" + agencyId + ".json";
                    return O.readTree(OpenAgencyProxyBeanTest.class.getClassLoader().getResourceAsStream(resource));
                } catch (IOException ex) {
                    return null;
                }
            }
        };
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
        bean.queue = queue;
        return bean;
    }

    public static ResourceBean createResourceBean(JpaTestEnvironment env){
        ResourceBean bean = new ResourceBean();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = env.getEntityManager();
        bean.openAgency = openAgency;
        return bean;
    }
}
