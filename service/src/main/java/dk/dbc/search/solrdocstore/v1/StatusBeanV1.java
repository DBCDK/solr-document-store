package dk.dbc.search.solrdocstore.v1;

import dk.dbc.search.solrdocstore.v2.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.eclipse.microprofile.metrics.annotation.Timed;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Stateless
@Path("status")
public class StatusBeanV1 {

    @Inject
    public StatusBeanV2 proxy;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Timed
    @SuppressFBWarnings("RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE")
    public Response getStatus() {
        return proxy.getStatus();
    }

    @GET
    @Path("system")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getSystemName() throws JsonProcessingException {
        return proxy.getSystemName();
    }
}
