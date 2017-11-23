package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Stateless
@Path("status")
public class StatusBean {

    private static final Logger log = LoggerFactory.getLogger(StatusBean.class);

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStatus() {
        log.info("getStatus called ");
        return Response.ok().entity("{ \"ok\": true }").build();
    }

}
