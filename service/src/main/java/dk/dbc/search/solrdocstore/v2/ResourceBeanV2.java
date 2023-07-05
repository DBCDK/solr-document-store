package dk.dbc.search.solrdocstore.v2;

import dk.dbc.search.solrdocstore.response.BibliographicResourceSchemaAnnotated;
import com.fasterxml.jackson.core.JsonProcessingException;
import dk.dbc.search.solrdocstore.response.StatusResponse;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.request.AddResourceRequest;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.logic.EnqueueSupplierBean;
import dk.dbc.search.solrdocstore.logic.Marshaller;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import dk.dbc.search.solrdocstore.jpa.AgencyItemFieldKey;
import dk.dbc.search.solrdocstore.request.ResourceRestRequest;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.EJBException;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("v2/resource")
public class ResourceBeanV2 {

    private static final Logger log = LoggerFactory.getLogger(ResourceBeanV2.class);

    private static final Marshaller MARSHALLER = new Marshaller();

    @Inject
    public OpenAgencyBean openAgency;

    @Inject
    public EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("add")
    @Operation(
            operationId = "add-resource",
            summary = "Adds a resource to an item",
            description = "This operation sets the resource and connect" +
                          " it to a number of manifestations item, if possible.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response addResource(String jsonContent) throws JsonProcessingException {
        try (LogWith logWith = track(UUID.randomUUID().toString())) {
            AddResourceRequest request = MARSHALLER.unmarshall(jsonContent, AddResourceRequest.class);
            // Add resource
            BibliographicResourceEntity resource = request.asBibliographicResource();
            log.debug("POST resource: {}", resource);
            return storeResource(resource);
        }
    }

    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("{fieldName}/{agencyId}:{bibliographicRecordId}")
    @Operation(
            operationId = "add/update-resource",
            summary = "Adds/updates/removes a resource to/from an item",
            description = "This operation sets/removes the resource and connected" +
                          " manifestations item, are queued.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response putResource(String jsonContent,
                                @PathParam("fieldName") String fieldName,
                                @PathParam("agencyId") Integer agencyId,
                                @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                @QueryParam("trackingId") String trackingId) throws JsonProcessingException {
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = track(trackingId)) {
            ResourceRestRequest request = MARSHALLER.unmarshall(jsonContent, ResourceRestRequest.class);
            BibliographicResourceEntity resource = new BibliographicResourceEntity(agencyId, bibliographicRecordId, fieldName, request.getHas());
            log.debug("PUT resource: {}", resource);
            return storeResource(resource);
        }
    }

    @DELETE
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("{fieldName}/{agencyId}:{bibliographicRecordId}")
    @Operation(
            operationId = "delete-resource",
            summary = "Removes a resource to an item",
            description = "This operation removed the resource and queues old connected" +
                          " manifestations item, if any.")
    @APIResponses({
        @APIResponse(name = "Success",
                     responseCode = "200",
                     description = "Resource has been added",
                     ref = StatusResponse.NAME)})
    @RequestBody(ref = BibliographicResourceSchemaAnnotated.NAME)
    public Response deleteResource(@PathParam("fieldName") String fieldName,
                                   @PathParam("agencyId") Integer agencyId,
                                   @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                   @QueryParam("trackingId") String trackingId) {
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = track(trackingId)) {
            BibliographicResourceEntity resource = new BibliographicResourceEntity(agencyId, bibliographicRecordId, fieldName, false);
            log.debug("DELETE resource: {}", resource);
            return storeResource(resource);
        }
    }

    private Response storeResource(BibliographicResourceEntity resource) {
        // Verify agency exists, throws exception if not exist
        LibraryType libraryType;
        try {
            OpenAgencyEntity oaEntity = openAgency.lookup(resource.getAgencyId());
            libraryType = oaEntity.getLibraryType();
        } catch (EJBException ex) {
            return Response.ok().entity(new StatusResponse("Unknown agency")).build();
        }

        if (resource.getValue()) {
            entityManager.merge(resource);
        } else {
            BibliographicResourceEntity entity = entityManager.find(BibliographicResourceEntity.class, new AgencyItemFieldKey(resource.getAgencyId(), resource.getBibliographicRecordId(), resource.getField()));
            if (entity != null)
                entityManager.remove(entity);
        }
        // Enqueue all related bib items
        List<BibliographicEntity> bibliographicEntities;
        if (LibraryType.COMMON_AGENCY == resource.getAgencyId() ||
            LibraryType.SCHOOL_COMMON_AGENCY == resource.getAgencyId() ||
            libraryType == LibraryType.FBS || libraryType == LibraryType.FBSSchool) {
            bibliographicEntities = commonRelatedBibEntities(resource);
        } else {
            bibliographicEntities = nonFBSBibEntries(resource);
        }
        try {
            EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();
            bibliographicEntities.forEach(e -> {
                if (!e.isDeleted()) {
                    enqueue.add(e, QueueType.RESOURCE, QueueType.UNITRESOURCE, QueueType.WORKRESOURCE);
                }
            });
            enqueue.commit();
        } catch (SQLException ex) {
            log.error("Unable to commit queue entries: {}", ex.getMessage());
            log.debug("Unable to commit queue entries: ", ex);
            return Response.status(Response.Status.BAD_REQUEST).entity(new StatusResponse("Unable to commit queue entries")).build();
        }
        return Response.ok().entity(new StatusResponse()).build();
    }

    private List<BibliographicEntity> commonRelatedBibEntities(BibliographicResourceEntity resource) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery(
                "SELECT b FROM BibliographicEntity  b " +
                " JOIN OpenAgencyEntity AS oa" +
                " ON b.agencyId = oa.agencyId " +
                "WHERE (b.agencyId=:commonAgency1 " +
                "OR b.agencyId=:commonAgency2 " +
                "OR oa.libraryType IN :types) " +
                "AND b.bibliographicRecordId=:recId", BibliographicEntity.class);
        query.setParameter("commonAgency1", LibraryType.COMMON_AGENCY);
        query.setParameter("commonAgency2", LibraryType.SCHOOL_COMMON_AGENCY);
        query.setParameter("recId", resource.getBibliographicRecordId());
        query.setParameter("types", LibraryType.FBS_LIBS);
        return query.getResultList();
    }

    private List<BibliographicEntity> nonFBSBibEntries(BibliographicResourceEntity resource) {
        TypedQuery<BibliographicEntity> query = entityManager.createQuery(
                "SELECT b FROM BibliographicEntity  b " +
                "WHERE b.agencyId=:agencyId " +
                "AND b.bibliographicRecordId=:recId", BibliographicEntity.class);
        query.setParameter("agencyId", resource.getAgencyId());
        query.setParameter("recId", resource.getBibliographicRecordId());
        return query.getResultList();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("resources-by-bib-item/{agencyId}/{recId}")
    public Response getResourcesByBibItem(@PathParam("agencyId") int agencyId,
                                          @PathParam("recId") String recId) {
        log.debug("Retrieving resources relating to bib item: {} - {}", agencyId, recId);
        return Response.ok(getResourcesByAgencyAndRecId(agencyId, recId)).build();
    }

    public List<BibliographicResourceEntity> getResourcesByAgencyAndRecId(int agencyId, String recId) {
        TypedQuery<BibliographicResourceEntity> query = entityManager.createQuery(
                "SELECT br FROM BibliographicResourceEntity br " +
                "WHERE br.agencyId = :agencyId AND br.bibliographicRecordId = :recId",
                BibliographicResourceEntity.class);
        query.setParameter("agencyId", agencyId);
        query.setParameter("recId", recId);
        return query.getResultList();
    }
}
