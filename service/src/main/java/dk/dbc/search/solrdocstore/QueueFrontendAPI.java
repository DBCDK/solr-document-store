package dk.dbc.search.solrdocstore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;

@Stateless
@Path("")
public class QueueFrontendAPI {
    private static final Logger log = LoggerFactory.getLogger(BiliographicRecordAPIBean.class);

    @Inject
    EnqueueSupplierBean enqueueSupplierBean;
}
