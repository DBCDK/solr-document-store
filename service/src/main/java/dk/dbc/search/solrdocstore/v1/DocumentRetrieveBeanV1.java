package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.v2.*;
import org.eclipse.microprofile.metrics.annotation.Timed;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("retrieve")
public class DocumentRetrieveBeanV1 {

    @Inject
    public DocumentRetrieveBeanV2 proxy;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}/{ classifier }/{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems(@Context UriInfo uriInfo,
                                                 @PathParam("agencyId") Integer agencyId,
                                                 @PathParam("classifier") String classifier,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                 @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        return proxy.getDocumentWithHoldingsitems(uriInfo, agencyId, classifier, bibliographicRecordId, deleted404);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}-{ classifier : [a-z0-9]+ }:{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems2(@Context UriInfo uriInfo,
                                                  @PathParam("agencyId") Integer agencyId,
                                                  @PathParam("classifier") String classifier,
                                                  @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                  @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        return proxy.getDocumentWithHoldingsitems2(uriInfo, agencyId, classifier, bibliographicRecordId, deleted404);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("unit/{ unitid }")
    @Timed
    public Response getUnitDocumentsWithHoldingsItems(@Context UriInfo uriInfo,
                                                      @PathParam("unitid") String unitId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        return proxy.getUnitDocumentsWithHoldingsItems(uriInfo, unitId, includeHoldingsItemsIndexKeys);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workid }")
    @Timed
    public Response getWorkDocumentsWithHoldingsItems(@Context UriInfo uriInfo,
                                                      @PathParam("workid") String workId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        return proxy.getWorkDocumentsWithHoldingsItems(uriInfo, workId, includeHoldingsItemsIndexKeys);
    }
}
