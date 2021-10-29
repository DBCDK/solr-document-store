package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.response.StatusResponse;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.QueueType;
import dk.dbc.search.solrdocstore.request.AddResourceRequest;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.enqueue.EnqueueCollector;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.jpa.AgencyItemFieldKey;
import dk.dbc.search.solrdocstore.request.ResourceRestRequest;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.EJBException;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.QueryParam;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

import static dk.dbc.log.LogWith.track;

@Stateless
@Path("resource")
public class ResourceBean {

    private static final Logger log = LoggerFactory.getLogger(ResourceBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();
    @Inject
    OpenAgencyBean openAgency;

    @Inject
    EnqueueSupplierBean enqueueSupplier;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

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
    public Response addResource(String jsonContent) throws JSONBException {
        try (LogWith logWith = track(UUID.randomUUID().toString())) {
            AddResourceRequest request = jsonbContext.unmarshall(jsonContent, AddResourceRequest.class);
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
                                @QueryParam("trackingId") String trackingId) throws JSONBException {
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = LogWith.track(trackingId)) {
            ResourceRestRequest request = jsonbContext.unmarshall(jsonContent, ResourceRestRequest.class);
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
                                   @QueryParam("trackingId") String trackingId) throws JSONBException {
        if (trackingId == null || trackingId.isEmpty())
            trackingId = UUID.randomUUID().toString();
        try (LogWith logWith = LogWith.track(trackingId)) {
            BibliographicResourceEntity resource = new BibliographicResourceEntity(agencyId, bibliographicRecordId, fieldName, false);
            log.debug("PUT resource: {}", resource);
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
                    enqueue.add(e, QueueType.RESOURCE, QueueType.WORKRESOURCE);
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
