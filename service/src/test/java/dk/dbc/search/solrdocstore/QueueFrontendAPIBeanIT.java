package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.ws.rs.core.Response;
import java.util.List;

public class QueueFrontendAPIBeanIT extends JpaSolrDocStoreIntegrationTester {
    EntityManager em ;
    JSONBContext jsonbContext = new JSONBContext();

    QueueFrontendAPIBean bean;

    @Before
    public void before(){
        // Setup bean
        em = env().getEntityManager();
        bean = new QueueFrontendAPIBean();
        bean.entityManager = em;

        // Setup records
        executeScriptResource("/queueFrontendIT.sql");
    }

    @Test
    public void testGetQueueRules(){
        Response queueRulesReponse = bean.getQueueRules();
        FrontendReturnListType<QueueRuleEntity> queueRules = (FrontendReturnListType<QueueRuleEntity>)
                queueRulesReponse.getEntity();
        List<QueueRuleEntity> queueRuleEntityList = queueRules.result;
        int expected = 4;
        Assert.assertEquals(expected,queueRuleEntityList.size());
    }

    @Test
    public void testCreateQueueRule() throws JSONBException {
        QueueRuleEntity createQueueRule = new QueueRuleEntity("q1");
        String queueJson = jsonbContext.marshall(createQueueRule);
        Response createQueueRuleResponse = env().getPersistenceContext()
                .run(() -> bean.createQueueRule(null,queueJson)
                );
        QueueRuleEntity createdQueueRule = (QueueRuleEntity) createQueueRuleResponse.getEntity();
        Assert.assertEquals(createQueueRule,createdQueueRule);
        Response queueRulesReponse = bean.getQueueRules();
        FrontendReturnListType<QueueRuleEntity> queueRules = (FrontendReturnListType<QueueRuleEntity>)
                queueRulesReponse.getEntity();
        List<QueueRuleEntity> queueRuleEntityList = queueRules.result;
        int expected = 5;
        Assert.assertEquals(expected,queueRuleEntityList.size());
    }

    @Test(expected = RuntimeException.class)
    public void testCreateInvalidQueueRule(){
        String queueJson = "{not:\"proper\"}";
        Response createQueueRuleResponse = env().getPersistenceContext()
                .run(() -> bean.createQueueRule(null,queueJson)
                );
    }

    @Test
    public void testDeleteQueueRule() throws JSONBException {
        QueueRuleEntity deleteQueueRule = new QueueRuleEntity("queue2");
        String queueJson = jsonbContext.marshall(deleteQueueRule);
        Response createQueueRuleResponse = env().getPersistenceContext()
                .run(() -> bean.createQueueRule(null,queueJson)
                );
        QueueRuleEntity createdQueueRule = (QueueRuleEntity) createQueueRuleResponse.getEntity();
        Assert.assertEquals(deleteQueueRule,createdQueueRule);
        Response queueRulesReponse = bean.getQueueRules();
        FrontendReturnListType<QueueRuleEntity> queueRules = (FrontendReturnListType<QueueRuleEntity>)
                queueRulesReponse.getEntity();
        List<QueueRuleEntity> queueRuleEntityList = queueRules.result;
        int expected = 5;
        Assert.assertEquals(expected,queueRuleEntityList.size());

    }

    @Test
    public void testDeleteNonExistingQueueRule(){

    }

    @Test
    public void testDeleteInvalidQueueRule(){

    }
}
