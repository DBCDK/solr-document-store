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
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
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
        // bibliographicRecordId could contain special characters, frontend encodes them
        String cleanedId;
        try {
            cleanedId = URLDecoder.decode(bibliographicRecordId,"UTF-8");
        } catch (UnsupportedEncodingException|IllegalArgumentException e) {
            log.error(e.getMessage());
            return Response.status(400).entity("{\"result\":[]}").build();
        }

        log.info("Requesting bibliographic record id: {}", cleanedId);

        TypedQuery<BibliographicEntity> query = entityManager.createQuery("SELECT b FROM BibliographicEntity b " +
                "WHERE b.bibliographicRecordId = :bibId",BibliographicEntity.class);
        List<BibliographicEntity> res = query.setParameter("bibId",cleanedId).getResultList();
        return Response.ok(new FrontendReturnType(res),MediaType.APPLICATION_JSON).build();
    }

}
