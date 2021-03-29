package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
import dk.dbc.log.LogWith;
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
    public Response addResource(String jsonContent) throws JSONBException {
        try (LogWith logWith = track(UUID.randomUUID().toString())) {
            AddResourceRequest request = jsonbContext.unmarshall(jsonContent, AddResourceRequest.class);
            log.debug("Added resource with key: {} - {} - {} having value: {}", request.getAgencyId(),
                      request.getBibliographicRecordId(), request.getField(), request.getValue());
            // Verify agency exists, throws exception if not exist
            LibraryType libraryType;
            try {
                OpenAgencyEntity oaEntity = openAgency.lookup(request.getAgencyId());
                libraryType = oaEntity.getLibraryType();
            } catch (EJBException ex) {
                return Response.ok().entity(new StatusBean.Resp("Unknown agency")).build();
            }

            // Add resource
            BibliographicResourceEntity resource = request.asBibliographicResource();
            entityManager.merge(resource);
            // Enqueue all related bib items
            List<BibliographicEntity> bibliographicEntities;
            if (LibraryType.COMMON_AGENCY == request.getAgencyId() ||
                LibraryType.SCHOOL_COMMON_AGENCY == request.getAgencyId() ||
                libraryType == LibraryType.FBS || libraryType == LibraryType.FBSSchool) {
                bibliographicEntities = commonRelatedBibEntities(resource);
            } else {
                bibliographicEntities = nonFBSBibEntries(resource);
            }
            try {
                EnqueueCollector enqueue = enqueueSupplier.getEnqueueCollector();
                bibliographicEntities.forEach(e -> enqueue.add(e, QueueType.RESOURCE));
                enqueue.commit();
            } catch (SQLException ex) {
                log.error("Unable to commit queue entries: {}", ex.getMessage());
                log.debug("Unable to commit queue entries: ", ex);
                return Response.status(Response.Status.BAD_REQUEST).entity(new StatusBean.Resp("Unable to commit queue entries")).build();
            }
            return Response.ok().entity(new StatusBean.Resp()).build();
        }
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
