package dk.dbc.search.solrdocstore;

import dk.dbc.log.LogWith;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static dk.dbc.log.LogWith.track;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Stateless
@Path("retrieve")
public class DocumentRetrieveBean {

    private static final Logger log = LoggerFactory.getLogger(DocumentRetrieveBean.class);

    private static final String SELECT_HOLDINGS_ITEMS_JPA =
            "SELECT h FROM HoldingsToBibliographicEntity h2b" +
            " INNER JOIN HoldingsItemEntity h" +
            " WHERE h2b.bibliographicRecordId = :bibliographicRecordId" +
            " AND h2b.bibliographicAgencyId = :agencyId" +
            " AND h2b.holdingsBibliographicRecordId = h.bibliographicRecordId" +
            " AND h2b.holdingsAgencyId = h.agencyId";

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @Inject
    BibliographicRetrieveBean brBean;

    @Inject
    BibliographicResourceRetrieveBean brrBean;

    @Inject
    OpenAgencyBean oaBean;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}/{ classifier }/{ bibliographicRecordId : .*}")
    @Timed(reusable = true)
    public Response getDocumentWithHoldingsitems(@Context UriInfo uriInfo,
                                                 @PathParam("agencyId") Integer agencyId,
                                                 @PathParam("classifier") String classifier,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId) throws Exception {
        try (LogWith logWith = track(null)) {
            DocumentRetrieveResponse response = getDocumentWithHoldingsitems(agencyId, classifier, bibliographicRecordId);
            if (response == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Record not found").build();
            }
            return Response.ok(response).build();
        } catch (Exception ex) {
            log.error("Error retrieving document {}-{}:{}: {}", agencyId, classifier, bibliographicRecordId, ex.getMessage());
            log.debug("Error retrieving document {}-{}:{}: ", agencyId, classifier, bibliographicRecordId, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error retrieving document").build();
        }
    }

    public DocumentRetrieveResponse getDocumentWithHoldingsitems(int agencyId, String classifier, String bibliographicRecordId) throws Exception {

        BibliographicEntity biblEntity = entityManager.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, classifier, bibliographicRecordId));
        if (biblEntity == null) {
            return null;
        }

        List<HoldingsItemEntity> holdingsItemRecords = Collections.EMPTY_LIST;
        List<Integer> partOfDanbib = Collections.EMPTY_LIST;
        Map<String, Map<Integer, Boolean>> attachedResources = Collections.EMPTY_MAP;

        if (!biblEntity.isDeleted()) {
            TypedQuery<HoldingsItemEntity> query = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_JPA, HoldingsItemEntity.class);
            query.setParameter("bibliographicRecordId", bibliographicRecordId);
            query.setParameter("agencyId", agencyId);
            holdingsItemRecords = query.getResultList();

            if (LibraryType.COMMON_AGENCY == agencyId) {
                partOfDanbib = getPartOfDanbibCommon(bibliographicRecordId);
            }

            OpenAgencyEntity oaEntity = oaBean.lookup(agencyId);
            LibraryType libraryType = oaEntity.getLibraryType();

            List<BibliographicResourceEntity> resources;
            if (LibraryType.COMMON_AGENCY == agencyId ||
                LibraryType.SCHOOL_COMMON_AGENCY == agencyId ||
                libraryType == LibraryType.FBS || libraryType == LibraryType.FBSSchool) {
                resources = brrBean.getResourcesForCommon(bibliographicRecordId);
            } else {
                resources = brrBean.getResourcesFor(agencyId, bibliographicRecordId);
            }
            attachedResources = mapResources(resources);
        }
        DocumentRetrieveResponse response = new DocumentRetrieveResponse(biblEntity, holdingsItemRecords, partOfDanbib, attachedResources);
        return response;
    }

    public List<Integer> getPartOfDanbibCommon(String bibliographicRecordId) {
        return entityManager.createNativeQuery(
                "SELECT CAST(h2b.holdingsAgencyId AS INTEGER) FROM HoldingsToBibliographic h2b" +
                " WHERE" +
                "  h2b.isCommonDerived = TRUE" +
                "  AND h2b.bibliographicRecordId = ?" +
                "  AND EXISTS (SELECT 1 FROM OpenAgencyCache oa WHERE oa.agencyId = h2b.holdingsAgencyId" +
                "   AND oa.libraryType = 'FBS'" +
                "   AND (oa.partOfDanbib = TRUE OR oa.authCreateCommonRecord = TRUE))" +
                "  AND EXISTS (SELECT 1 FROM HoldingsItemsSolrKeys h WHERE h.agencyId = h2b.holdingsAgencyId" +
                "   AND h.bibliographicRecordId = h2b.holdingsBibliographicRecordId" +
                "   AND h.hasLiveHoldings = TRUE)" +
                "  AND NOT EXISTS (SELECT 1 FROM BibliographicSolrKeys b WHERE b.agencyId = h2b.holdingsAgencyId" +
                "   AND b.bibliographicRecordId = h2b.bibliographicRecordId" +
                "   AND 'true' = jsonb_extract_path_text(b.indexKeys, 'rec.excludeFromUnionCatalogue', '0'))")
                .setParameter(1, bibliographicRecordId)
                .getResultList();
    }

    public Map<String, Map<Integer, Boolean>> mapResources(List<BibliographicResourceEntity> resources) {
        Map<String, Map<Integer, Boolean>> map = new HashMap<>();
        for (BibliographicResourceEntity resource : resources) {
            Map<Integer, Boolean> agencyResources = map.computeIfAbsent(resource.getField(), a -> new HashMap<>());
            agencyResources.put(resource.getAgencyId(), resource.getValue());
        }
        return map;
    }

}
