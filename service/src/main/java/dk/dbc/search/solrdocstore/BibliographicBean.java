package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

@Stateless
@Path("")
public class BibliographicBean {

    private static final Logger log = LoggerFactory.getLogger(BibliographicBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Path("bibliographic")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBibliographicKeys(@Context UriInfo uriInfo, String KeyJsonContent) throws Exception {

        BibliographicEntity be = jsonbContext.unmarshall(KeyJsonContent, BibliographicEntity.class);
        log.info("AddBibliographicKeys called {}:{}", be.agencyId, be.bibliographicRecordId);

        BibliographicEntity dbbe = entityManager.find(BibliographicEntity.class, new AgencyItemKey(be.agencyId, be.bibliographicRecordId), LockModeType.PESSIMISTIC_WRITE);
        if (dbbe == null) {
            entityManager.merge(be);
            updateHoldingsToBibliographic(be.agencyId, be.bibliographicRecordId);
        } else {
            throw new IllegalStateException("Missing implementation");
        }

        return Response.ok().entity("{ \"ok\": True }").build();
    }

    private void updateHoldingsToBibliographic(int agency, String recordId) {
        // For List of FBS biblioteker do
        TypedQuery<Integer> query;

        query = entityManager.createQuery("SELECT h.agencyId FROM HoldingsItemEntity h  WHERE h.bibliographicRecordId = :bibId", Integer.class);

        query.setParameter("bibId", recordId);

        for (Object holdingsAgencyObj : query.getResultList()) {
            Integer holdingsAgency = (Integer) holdingsAgencyObj;
            HoldingsToBibliographicEntity h2b = new HoldingsToBibliographicEntity();
            h2b.bibliographicRecordId = recordId;
            h2b.agencyId = holdingsAgency;
            h2b.bibliographicAgencyId = agency;
            entityManager.merge(h2b);
        }

    }
}
