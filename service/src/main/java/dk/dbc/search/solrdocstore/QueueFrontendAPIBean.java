package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.search.solrdocstore.asyncjob.AsyncJobSessionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Stateless
@Path("")
public class QueueFrontendAPIBean {
    private static final Logger log = LoggerFactory.getLogger(BiliographicRecordAPIBean.class);
    private final JSONBContext jsonbContext = new JSONBContext();

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    QueueRulesBean queueRulesBean;

    @Inject
    AsyncJobSessionHandler sessionHandler;

    @GET
    @Path("queue-rules")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getQueueRules(){
        log.info("Queue rules listed, probably by queue tool frontend");
        return Response.ok(new FrontendReturnListType<>(queueRulesBean.getAllQueueRules(), 1)).build();
    }

    @POST
    @Path("create-queue-rule")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response createQueueRule(@Context UriInfo uriInfo, String jsonContent) throws JSONBException {
        QueueRuleEntity queueRule = jsonbContext.unmarshall(jsonContent, QueueRuleEntity.class);
        log.info("Creating queue rule: {}",queueRule.getQueue());
        queueRulesBean.setQueueRule(queueRule);
        sessionHandler.addQueueRule(queueRule);
        return Response.ok(queueRule).build();
    }

    @DELETE
    @Path("queue-rule/{queueID}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response deleteQueueRule(@PathParam("queueID") String queueID){
        QueueRuleEntity queue = entityManager.find(QueueRuleEntity.class,queueID);
        log.info("Deleting queue rule: {}",queue.getQueue());
        queueRulesBean.delQueueRule(queue);
        return Response.ok(queue).build();
    }
}
