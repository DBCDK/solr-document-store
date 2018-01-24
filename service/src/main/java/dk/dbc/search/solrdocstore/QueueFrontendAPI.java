package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Stateless
@Path("")
public class QueueFrontendAPI {
    private static final Logger log = LoggerFactory.getLogger(BiliographicRecordAPIBean.class);

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
}
