package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.RecordType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.vipcore.marshallers.LibraryRulesResponse;
import java.io.IOException;
import java.io.InputStream;

import jakarta.persistence.EntityManager;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collection;

import static dk.dbc.search.solrdocstore.OpenAgencyUtil.makeOpenAgencyEntity;

public class BeanFactoryUtil {

    private static final ObjectMapper O = new ObjectMapper();

    public static BibliographicBean createBibliographicBean(EntityManager em, Config config) {
        BibliographicBean bean = new BibliographicBean();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.config = config;
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.h2bBean = createHoldingsToBibliographicBean(em);
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static BibliographicRecordAPIBean createBiliographicRecordAPIBean(EntityManager env) {
        BibliographicRecordAPIBean bean = new BibliographicRecordAPIBean();
        bean.entityManager = env;
        bean.brBean = createBibliographicRetrieveBean(env);
        bean.holdingsItemBean = createHoldingsItemBean(env);
        return bean;
    }

    public static HoldingsItemBean createHoldingsItemBean(EntityManager em) {
        HoldingsItemBean bean = new HoldingsItemBean();
        bean.entityManager = em;
        bean.h2bBean = createHoldingsToBibliographicBean(em);
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.openAgency = createOpenAgencyBean();
        bean.brBean = createBibliographicRetrieveBean(em);
        return bean;
    }

    public static OpenAgencyStatusBean createOpenAgencyStatusBean(EntityManager em) {
        OpenAgencyStatusBean bean = new OpenAgencyStatusBean() {
            @Override
            String hash(int agencyId) throws NoSuchAlgorithmException {
                return "";
            }
        };
        bean.entityManager = em;
        bean.proxy = createOpenAgencyProxyBean();
        bean.supplier = createEnqueueSupplier(em);
        return bean;
    }

    public static EnqueueSupplierBean createEnqueueSupplier(EntityManager em) {
        EnqueueSupplierBean bean = new EnqueueSupplierBean() {
            @Override
            protected Collection<QueueRuleEntity> getQueueRules() {
                return Arrays.asList(
                        new QueueRuleEntity("a", QueueType.MANIFESTATION, 0),
                        new QueueRuleEntity("a", QueueType.MANIFESTATION_DELETED, 100_000),
                        new QueueRuleEntity("a", QueueType.HOLDING, 0),
                        new QueueRuleEntity("a", QueueType.RESOURCE, 0),
                        new QueueRuleEntity("b", QueueType.UNIT, 0),
                        new QueueRuleEntity("b", QueueType.UNITRESOURCE, 0),
                        new QueueRuleEntity("c", QueueType.WORK, 0),
                        new QueueRuleEntity("c", QueueType.WORKRESOURCE, 0),
                        new QueueRuleEntity("e", QueueType.ENDPOINT, 0),
                        new QueueRuleEntity("e", QueueType.WORKENDPOINT, 0));
            }
        };
        EntityManager entityManager = em;
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
            protected LibraryRulesResponse getLibraryRuleResponse(int agencyId) throws OpenAgencyException, JsonProcessingException, IOException {
                String resource = "openagency-" + agencyId + ".json";
                try (InputStream is = OpenAgencyProxyBeanTest.class.getClassLoader().getResourceAsStream(resource)) {
                    return O.readValue(is, LibraryRulesResponse.class);
                }
            }
        };
    }

    public static DocumentRetrieveBean createDocumentRetrieveBean(EntityManager em) {
        DocumentRetrieveBean bean = new DocumentRetrieveBean();
        bean.entityManager = em;
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.brrBean = createBibliographicResourceRetrieveBean(em);
        bean.oaBean = createOpenAgencyBean();
        return bean;
    }

    public static BibliographicResourceRetrieveBean createBibliographicResourceRetrieveBean(EntityManager em) {
        BibliographicResourceRetrieveBean bean = new BibliographicResourceRetrieveBean();
        bean.entityManager = em;
        return bean;
    }

    public static BibliographicRetrieveBean createBibliographicRetrieveBean(EntityManager em) {
        BibliographicRetrieveBean bean = new BibliographicRetrieveBean();
        bean.entityManager = em;
        return bean;
    }

    public static ExistenceBean createExistenceBean(EntityManager em) {
        ExistenceBean bean = new ExistenceBean();
        bean.entityManager = em;
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em, OpenAgencyBean openAgency, EnqueueSupplierBean queue, BibliographicRetrieveBean brBean) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.brBean = brBean;
        return bean;
    }

    public static ResourceBean createResourceBean(EntityManager em) {
        ResourceBean bean = new ResourceBean();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static QueueBean createQueueBean(EntityManager em) {
        QueueBean bean = new QueueBean();
        bean.entityManager = em;
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }
}
