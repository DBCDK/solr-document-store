package dk.dbc.search.solrdocstore.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.metrics.annotation.Timed;

@Stateless
@Path("")
public class BibliographicRecordAPIBeanV1 {

    @Inject
    public BibliographicRecordAPIBeanV2 proxy;

    @GET
    @Path("bibliographic-records/bibliographic-record-id/{bibliographicRecordId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicKeys(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc) {
        return proxy.getBibliographicKeys(bibliographicRecordId, page, pageSize, orderBy, desc);
    }

    @GET
    @Path("bibliographic-records/repository-id/{repositoryId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicKeysByRepositoryId(
            @PathParam("repositoryId") String repositoryID,
            @DefaultValue("1") @QueryParam("page") int page,
            @DefaultValue("10") @QueryParam("page_size") int pageSize,
            @DefaultValue("agencyId") @QueryParam("order_by") String orderBy,
            @DefaultValue("false") @QueryParam("desc") boolean desc) throws JsonProcessingException {
        return proxy.getBibliographicKeysByRepositoryId(repositoryID, page, pageSize, orderBy, desc);
    }

    @GET
    @Path("bibliographic-record/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getBibliographicRecord(
            @PathParam("bibliographicRecordId") String bibliographicRecordId,
            @PathParam("bibliographicAgencyId") int bibliographicAgencyId) {
        return proxy.getBibliographicRecord(bibliographicRecordId, bibliographicAgencyId);
    }

    /*
     * Returns a json object with a result field, which is a list of json HoldingsItemEntity mapped via the
     * holdingsToBibliographic table.
     */
    @GET
    @Path("related-holdings/{bibliographicRecordId}/{bibliographicAgencyId}")
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    public Response getRelatedHoldings(@PathParam("bibliographicRecordId") String bibliographicRecordId,
                                       @PathParam("bibliographicAgencyId") int bibliographicAgencyId) {
        return proxy.getRelatedHoldings(bibliographicRecordId, bibliographicAgencyId);
    }
}
