package dk.dbc.search.solrdocstore;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("open-agency")
public class OpenAgencyStatusBean {

    private static final Logger log = LoggerFactory.getLogger(OpenAgencyStatusBean.class);

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    OpenAgencyProxyBean proxy;

    @Inject
    EnqueueSupplierBean supplier;

    @GET
    @Path("status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStatus() {
        OpenAgencyStatusResponse resp = new OpenAgencyStatusResponse();
        List<OpenAgencyEntity> entries = entityManager.createQuery("SELECT oa FROM OpenAgencyEntity oa WHERE oa.valid <> True", OpenAgencyEntity.class)
                .getResultList();
        for (OpenAgencyEntity solrDocStore : entries) {
            OpenAgencyEntity openAgency = proxy.loadOpenAgencyEntry(solrDocStore.getAgencyId());
            resp.states.put(solrDocStore.getAgencyId(), new OpenAgencyStatusResponse.Diag(solrDocStore, openAgency));
        }
        resp.ok = resp.states.isEmpty();
        return Response.ok(resp)
                .header("Access-Control-Allow-Origin", "*")
                .build();
    }

    @GET
    @Path("purge/{agencyId : \\d+}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response purgeAgency(@PathParam("agencyId") Integer agencyId,
                                @QueryParam("hash") String reqUuid) {
        try {
            String hash = hash(agencyId);
            if (hash.equals(reqUuid)) {
                ArrayList<String> resp = purgeAgency(agencyId);
                if (resp.isEmpty()) {
                    resp.add("SUCCESS");
                }
                return Response.ok(resp).build();
            } else {
                return Response.ok().type(MediaType.TEXT_PLAIN_TYPE).entity("add: ?hash=" + hash + " to path").build();
            }
        } catch (NoSuchAlgorithmException ex) {
            log.error("No SHA-256 ?: {}", ex.getMessage());
            log.debug("No SHA-256 ?: ", ex);
            return Response.serverError().type(MediaType.TEXT_PLAIN_TYPE).entity("No SHA256 in javax").build();
        }
    }

    /**
     * This could be done with a stateful bean, but current payara-micro
     * requires hazelcast, for @Stateful to work.
     *
     * @param agencyId number
     * @return hash of number
     * @throws NoSuchAlgorithmException if sha-256 is unknown
     */
    String hash(int agencyId) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        digest.update(( "a79befdb3d4d08625066afa9d106f970" + agencyId ).getBytes());
        return Base64.getEncoder().encodeToString(digest.digest())
                .replaceAll("[+/=]", "-"); //uri safe
    }

    ArrayList<String> purgeAgency(int agencyId) {
        ArrayList<String> resp = new ArrayList<>();
        EnqueueService<AgencyClassifierItemKey> enqueueService = supplier.getManifestationEnqueueService();
        // Queue related records
        entityManager.createQuery(
                "SELECT b FROM BibliographicEntity b" +
                " JOIN HoldingsToBibliographicEntity h2b" +
                " JOIN HoldingsItemEntity hi" +
                " ON b.agencyId = h2b.bibliographicAgencyId AND b.bibliographicRecordId = h2b.bibliographicRecordId" +
                " AND hi.agencyId = h2b.holdingsAgencyId AND hi.bibliographicRecordId = h2b.holdingsBibliographicRecordId" +
                " WHERE h2b.holdingsAgencyId = :agencyId AND hi.hasLiveHoldings = TRUE", BibliographicEntity.class)
                .setParameter("agencyId", agencyId)
                .getResultList()
                .stream()
                .map(BibliographicEntity::asAgencyClassifierItemKey)
                .forEach(key -> {
                    try {
                        enqueueService.enqueue(key);
                    } catch (SQLException ex) {
                        resp.add(key + " - " + ex.getClass().getSimpleName() + ": " + ex.getMessage());
                    }
                });
        // Purge holdings if no error occured
        if (resp.isEmpty()) {
            // Purge h2b
            entityManager.createQuery(
                    "SELECT hi FROM HoldingsItemEntity hi JOIN HoldingsToBibliographicEntity h2b" +
                    " ON hi.agencyId = h2b.holdingsAgencyId AND hi.bibliographicRecordId = h2b.holdingsBibliographicRecordId" +
                    " WHERE h2b.holdingsAgencyId = :agencyId", HoldingsItemEntity.class)
                    .setParameter("agencyId", agencyId)
                    .getResultList()
                    .stream()
                    .forEach(entityManager::remove);
            // Purge h
            entityManager.createQuery(
                    "SELECT h2b FROM HoldingsToBibliographicEntity h2b" +
                    " WHERE h2b.holdingsAgencyId = :agencyId", HoldingsToBibliographicEntity.class)
                    .setParameter("agencyId", agencyId)
                    .getResultList()
                    .stream()
                    .forEach(entityManager::remove);
            // Purge oac
            OpenAgencyEntity oa = entityManager.find(OpenAgencyEntity.class, agencyId);
            if (oa != null) {
                entityManager.remove(oa);
            }
        }
        return resp;
    }
}
