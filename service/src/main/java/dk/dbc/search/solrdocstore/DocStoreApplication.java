package dk.dbc.search.solrdocstore;

import dk.dbc.commons.payara.helpers.MDCRequestInfo;
import dk.dbc.commons.payara.helpers.RequestLogLevel;
import dk.dbc.search.solrdocstore.v1.BibliographicBeanV1;
import dk.dbc.search.solrdocstore.v1.BibliographicRecordAPIBeanV1;
import dk.dbc.search.solrdocstore.v1.DocumentRetrieveBeanV1;
import dk.dbc.search.solrdocstore.v1.EvictAllV1;
import dk.dbc.search.solrdocstore.v1.ExistenceBeanV1;
import dk.dbc.search.solrdocstore.v2.BibliographicBeanV2;
import dk.dbc.search.solrdocstore.v2.BibliographicRecordAPIBeanV2;
import dk.dbc.search.solrdocstore.v2.DocumentRetrieveBeanV2;
import dk.dbc.search.solrdocstore.v2.EvictAllV2;
import dk.dbc.search.solrdocstore.v2.ExistenceBeanV2;
import dk.dbc.search.solrdocstore.v1.HoldingsItemBeanV1;
import dk.dbc.search.solrdocstore.v1.OpenAgencyStatusBeanV1;
import dk.dbc.search.solrdocstore.v1.QueueBeanV1;
import dk.dbc.search.solrdocstore.v1.ResourceBeanV1;
import dk.dbc.search.solrdocstore.v1.StatusBeanV1;
import dk.dbc.search.solrdocstore.v2.OpenAgencyStatusBeanV2;
import dk.dbc.search.solrdocstore.v2.QueueBeanV2;
import dk.dbc.search.solrdocstore.v2.ResourceBeanV2;
import dk.dbc.search.solrdocstore.v2.StatusBeanV2;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import java.util.Set;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.microprofileext.openapi.swaggerui.OpenApiUiService;

/**
 * This class defines the other classes that make up this JAX-RS application by
 * having the getClasses method return a specific set of resources.
 */
@ApplicationPath("/api")
public class DocStoreApplication extends Application {

    private static final Set<Class<?>> BEANS = Set.of(
            // V1
            BibliographicBeanV1.class,
            BibliographicRecordAPIBeanV1.class,
            DocumentRetrieveBeanV1.class,
            EvictAllV1.class,
            ExistenceBeanV1.class,
            HoldingsItemBeanV1.class,
            OpenAgencyStatusBeanV1.class,
            QueueBeanV1.class,
            ResourceBeanV1.class,
            StatusBeanV1.class,
            // V2
            BibliographicBeanV2.class,
            BibliographicRecordAPIBeanV2.class,
            DocumentRetrieveBeanV2.class,
            EvictAllV2.class,
            ExistenceBeanV2.class,
            OpenAgencyStatusBeanV2.class,
            QueueBeanV2.class,
            ResourceBeanV2.class,
            StatusBeanV2.class,
            // Tools
            MDCRequestInfo.class,
            RequestLogLevel.class,
            JacksonFeature.class,
            JacksonObjectMapperProvider.class,
            OpenApiUiService.class);

    @Override
    public Set<Class<?>> getClasses() {
        return BEANS;
    }
}
