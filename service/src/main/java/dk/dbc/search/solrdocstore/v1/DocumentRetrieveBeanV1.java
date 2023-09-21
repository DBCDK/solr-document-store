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
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response getDocumentWithHoldingsitems(@PathParam("agencyId") Integer agencyId,
                                                 @PathParam("classifier") String classifier,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                 @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        return proxy.getDocumentWithHoldingsitems(agencyId, classifier, bibliographicRecordId, deleted404);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}-{ classifier : [a-z0-9]+ }:{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems2(@PathParam("agencyId") Integer agencyId,
                                                  @PathParam("classifier") String classifier,
                                                  @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                  @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        return proxy.getDocumentWithHoldingsitems2(agencyId, classifier, bibliographicRecordId, deleted404);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("unit/{ unitid }")
    @Timed
    public Response getUnitDocumentsWithHoldingsItems(@PathParam("unitid") String unitId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        return proxy.getUnitDocumentsWithHoldingsItems(unitId, includeHoldingsItemsIndexKeys);
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workid }")
    @Timed
    public Response getWorkDocumentsWithHoldingsItems(@PathParam("workid") String workId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        return proxy.getWorkDocumentsWithHoldingsItems(workId, includeHoldingsItemsIndexKeys);
    }
}
