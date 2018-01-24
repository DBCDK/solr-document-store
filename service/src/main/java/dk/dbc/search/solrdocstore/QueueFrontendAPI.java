package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Stateless
@Path("")
public class QueueFrontendAPI {
    private static final Logger log = LoggerFactory.getLogger(BiliographicRecordAPIBean.class);
    private final JSONBContext jsonbContext = new JSONBContext();

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    EnqueueSupplierBean enqueueSupplierBean;

    @GET
    @Path("queue-rules")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueRules(){
        log.info("Queue rules listed, probably by queue tool frontend");
        TypedQuery<QueueRuleEntity> query = entityManager.createQuery("SELECT q FROM QueueRuleEntity q",QueueRuleEntity.class);
        return Response.ok(new FrontendReturnListType<>(query.getResultList(), 1)).build();
    }

    @POST
    @Path("create-queue-rule")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response createQueueRule(@Context UriInfo uriInfo, String jsonContent) throws JSONBException {
        QueueRuleEntity queueRule = jsonbContext.unmarshall(jsonContent, QueueRuleEntity.class);
        log.info("Creating queue rule: {}",queueRule.getQueue());
        entityManager.persist(queueRule);
        return Response.ok(queueRule).build();
    }
}