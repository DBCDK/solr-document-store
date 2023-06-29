package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.v2.*;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
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
@Path("open-agency")
public class OpenAgencyStatusBeanV1 {

    @Inject
    public OpenAgencyStatusBeanV2 proxy;

    @GET
    @Path("status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStatus() {
        return proxy.getStatus();
    }

    @GET
    @Path("purge/{agencyId : \\d+}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response purgeAgency(@PathParam("agencyId") Integer agencyId,
                                @QueryParam("hash") String reqUuid) {
        return proxy.purgeAgency(agencyId, reqUuid);
    }
}
