package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Stateless
@Path("")
public class FrontendAPIBean {
    private static final Logger log = LoggerFactory.getLogger(FrontendAPIBean.class);


    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    /**
     * Returns a json object with a result field, which is a list of json BibliographicEntity that matches
     * bibliographicRecordId with the argument.
     * @param bibliographicRecordId path parameter, expects URI encoding
     * @return Response
     */
    @GET
    @Path("getBibliographicRecord/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBibliographicKeys(@PathParam("bibliographicRecordId") String bibliographicRecordId) {
        log.info("Requesting bibliographic record id: {}", bibliographicRecordId);

        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        List<BibliographicEntity> res = query.setParameter("bibId",bibliographicRecordId).getResultList();
        return Response.ok(new FrontendReturnListType<>(res),MediaType.APPLICATION_JSON).build();
    }

    /**
     * Returns a json object with a result field, which is a list of json HoldingsItemEntity mapped via the
     * holdingsToBibliographic table.
     * @param bibliographicRecordId
     * @param bibliographicAgencyId
     * @return Response
     */
    @GET
    @Path("getRelatedHoldings/{bibliographicRecordId}&{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRelatedHoldings(@PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @PathParam("bibliographicAgencyId") int bibliographicAgencyId){
        log.info("Requesting bibliographic record id: {} and bibliographic agency id: {}",
                bibliographicRecordId,bibliographicAgencyId);
        TypedQuery<HoldingsItemEntity> query = entityManager.createQuery("SELECT h " +
                "FROM HoldingsItemEntity h " +
                "WHERE h.agencyId IN (" +
                "SELECT h2b.agencyId " +
                "FROM HoldingsToBibliographicEntity h2b " +
                "WHERE h2b.bibliographicRecordId = :bibId AND h2b.bibliographicAgencyId = :agId)",
                HoldingsItemEntity.class);
        query.setParameter("bibId",bibliographicRecordId);
        query.setParameter("agId",bibliographicAgencyId);
        List<HoldingsItemEntity> res = query.getResultList();
        return Response.ok(new FrontendReturnListType<>(res),MediaType.APPLICATION_JSON).build();
    }
}
