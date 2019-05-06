package dk.dbc.search.solrdocstore;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("enqueue")
public class EnqueueBean {

    private static final Logger log = LoggerFactory.getLogger(EnqueueBean.class);

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @POST
    @Path("pid/{queue}")
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    public Response enqueuePids(@PathParam("queue") String queue, String content) {
        log.info("enqueue to {}", queue);
        HashMap<String, String> failed = enqueue(content, queueSupplierFor(queue));
        return response(failed);
    }

    @POST
    @Path("pid/ALL")
    @Consumes(MediaType.WILDCARD)
    @Produces(MediaType.APPLICATION_JSON)
    public Response enqueuePids(String content) {
        log.info("enqueue to ALL");
        HashMap<String, String> failed = enqueue(content, enqueueSupplier.getManifestationEnqueueService());
        return response(failed);
    }

    private Response response(HashMap<String, String> failed) {
        boolean success = failed.isEmpty();
        failed.put("_success_", String.valueOf(success));
        return Response.status(success ? Status.OK : Status.BAD_REQUEST).entity(failed).build();
    }

    @POST
    @Path("pid/{queue}/{pid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response enqueueSinglePid(@PathParam("queue") String queue, @PathParam("pid") String content) {
        return enqueuePids(queue, content);
    }

    @POST
    @Path("pid/ALL/{pid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response enqueueSinglePid(@PathParam("pid") String content) {
        return enqueuePids(content);
    }

    private HashMap<String, String> enqueue(String content, EnqueueService<AgencyClassifierItemKey> enqueue) {
        HashMap<String, String> failed = new HashMap<>();
        for (String pid : content.split("[^-_:0-9a-zA-Z]+")) {
            if (pid.isEmpty()) {
                continue;
            }
            try {
                String[] agencyClassId = pid.split(":", 2);
                String[] agencyClass = agencyClassId[0].split("-", 2);

                if (agencyClassId.length != 2 && agencyClass.length != 2) {
                    throw new IllegalArgumentException("Invalid pid syntax");
                }
                int agencyId = Integer.parseInt(agencyClass[0]);
                AgencyClassifierItemKey key = new AgencyClassifierItemKey(agencyId, agencyClass[1], agencyClassId[1]);
                log.debug("key = {}", key);
                if (entityManager.find(BibliographicEntity.class, key) == null) {
                    throw new IllegalStateException("Record doesn't exist");
                }
                enqueue.enqueue(key);
            } catch (SQLException | RuntimeException ex) {
                failed.put(pid, ex.getClass().getSimpleName() + ": " + ex.getMessage());
            }
        }
        return failed;
    }

    private EnqueueService<AgencyClassifierItemKey> queueSupplierFor(String queue) {
        Connection connection = entityManager.unwrap(Connection.class);
        return new EnqueueService<>(connection, Collections.singleton(queue),
                                    (key, commitWithin) -> key.toQueueJob(commitWithin));
    }

}
