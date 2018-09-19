package dk.dbc.search.solrdocstore;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.commons.jsonb.JSONBContext;
import dk.dbc.commons.jsonb.JSONBException;
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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Stateless
@Path("resource")
public class ResourceBean {

    private static final Logger log = LoggerFactory.getLogger(ResourceBean.class);
    private static final ObjectMapper O = new ObjectMapper();

    private final JSONBContext jsonbContext = new JSONBContext();
    @Inject
    OpenAgencyBean openAgency;

    @Inject
    EnqueueSupplierBean queue;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("add")
    public Response addResource(String jsonContent) throws JSONBException {
        AddResourceRequest request = jsonbContext.unmarshall(jsonContent, AddResourceRequest.class);
        log.debug("Added resource with key: {} - {} - {} having value: {}", request.getAgencyId(),
                  request.getBibliographicRecordId(), request.getField(), request.getValue());
        // Verify agency exists, throws exception if not exist
        try {
            openAgency.lookup(request.getAgencyId());
        } catch (EJBException ex) {
            return Response.ok().entity(new StatusBean.Resp("Unknown agency")).build();
        }
        // Add resource
        BibliographicResourceEntity resource = request.asBibliographicResource();
        entityManager.merge(resource);
        // Enqueue all related bib items
        TypedQuery<BibliographicEntity> query = entityManager.createQuery(
                "SELECT b FROM BibliographicEntity  b WHERE b.agencyId=:agencyId " +
                        "AND b.bibliographicRecordId=:recId", BibliographicEntity.class);
        query.setParameter("agencyId", resource.getAgencyId());
        query.setParameter("recId", resource.getBibliographicRecordId());
        Set<AgencyClassifierItemKey> keySet = query.getResultList().stream()
                .map(BibliographicEntity::asAgencyClassifierItemKey).collect(Collectors.toSet());
        EnqueueAdapter.enqueueAll(queue, keySet, Optional.empty());
        return Response.ok().entity(new StatusBean.Resp()).build();
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
