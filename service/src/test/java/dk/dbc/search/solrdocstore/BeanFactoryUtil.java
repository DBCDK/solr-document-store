package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.jpa.QueueRuleEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.openagency.http.OpenAgencyException;
import dk.dbc.search.solrdocstore.logic.BibliographicResourceRetrieveBean;
import dk.dbc.search.solrdocstore.logic.BibliographicRetrieveBean;
import dk.dbc.search.solrdocstore.logic.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.logic.HoldingsToBibliographicBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyProxyBean;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;
import dk.dbc.search.solrdocstore.v2.DocumentRetrieveBeanV2;
import dk.dbc.search.solrdocstore.v2.ExistenceBeanV2;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import dk.dbc.search.solrdocstore.v2.HoldingsItemBeanV2;
import dk.dbc.search.solrdocstore.v2.OpenAgencyStatusBeanV2;
import dk.dbc.search.solrdocstore.v2.QueueBeanV2;
import dk.dbc.search.solrdocstore.v2.ResourceBeanV2;
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

    public static BibliographicBeanV2 createBibliographicBean(EntityManager em, Config config) {
        BibliographicBeanV2 bean = new BibliographicBeanV2();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.config = config;
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.h2bBean = createHoldingsToBibliographicBean(em);
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static BibliographicRecordAPIBeanV2 createBiliographicRecordAPIBean(EntityManager env) {
        BibliographicRecordAPIBeanV2 bean = new BibliographicRecordAPIBeanV2();
        bean.entityManager = env;
        bean.brBean = createBibliographicRetrieveBean(env);
        return bean;
    }

    public static HoldingsItemBeanV1 createHoldingsItemBeanV1(EntityManager em) {
        HoldingsItemBeanV1 bean = new HoldingsItemBeanV1();
        bean.entityManager = em;
        bean.h2bBean = createHoldingsToBibliographicBean(em);
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static HoldingsItemBeanV2 createHoldingsItemBean(EntityManager em) {
        HoldingsItemBeanV2 bean = new HoldingsItemBeanV2();
        bean.entityManager = em;
        bean.h2bBean = createHoldingsToBibliographicBean(em);
        bean.brBean = createBibliographicRetrieveBean(em);
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.em = em;
        bean.openAgency = createOpenAgencyBean();
        bean.brBean = createBibliographicRetrieveBean(em);
        return bean;
    }

    public static OpenAgencyStatusBeanV2 createOpenAgencyStatusBean(EntityManager em) {
        OpenAgencyStatusBeanV2 bean = new OpenAgencyStatusBeanV2() {
            @Override
            public String hash(int agencyId) throws NoSuchAlgorithmException {
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
                        new QueueRuleEntity("b", QueueType.UNITHOLDING, 0),
                        new QueueRuleEntity("b", QueueType.UNITRESOURCE, 0),
                        new QueueRuleEntity("c", QueueType.WORK, 0),
                        new QueueRuleEntity("c", QueueType.WORKHOLDING, 0),
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

    public static DocumentRetrieveBeanV2 createDocumentRetrieveBean(EntityManager em) {
        DocumentRetrieveBeanV2 bean = new DocumentRetrieveBeanV2();
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

    public static ExistenceBeanV2 createExistenceBean(EntityManager em) {
        ExistenceBeanV2 bean = new ExistenceBeanV2();
        bean.entityManager = em;
        return bean;
    }

    public static HoldingsToBibliographicBean createHoldingsToBibliographicBean(EntityManager em, OpenAgencyBean openAgency, EnqueueSupplierBean queue, BibliographicRetrieveBean brBean) {
        HoldingsToBibliographicBean bean = new HoldingsToBibliographicBean();
        bean.em = em;
        bean.openAgency = openAgency;
        bean.brBean = brBean;
        return bean;
    }

    public static ResourceBeanV2 createResourceBean(EntityManager em) {
        ResourceBeanV2 bean = new ResourceBeanV2();
        OpenAgencyBean openAgency = createOpenAgencyBean();
        bean.entityManager = em;
        bean.openAgency = openAgency;
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }

    public static QueueBeanV2 createQueueBean(EntityManager em) {
        QueueBeanV2 bean = new QueueBeanV2();
        bean.entityManager = em;
        bean.enqueueSupplier = createEnqueueSupplier(em);
        return bean;
    }
}
