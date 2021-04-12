package dk.dbc.search.solrdocstore;

import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            " INNER JOIN HoldingsItemEntity h " +
                    "ON h2b.holdingsBibliographicRecordId = h.bibliographicRecordId AND h2b.holdingsAgencyId = h.agencyId" +
            " WHERE h2b.bibliographicRecordId = :bibliographicRecordId" +
            " AND h2b.bibliographicAgencyId = :agencyId";

    private static final String SELECT_MANIFESTATIONS_FOR_WORK_JPA =
            "SELECT be FROM BibliographicEntity be" +
            " WHERE be.work = :workId";

    private static final String SELECT_HOLDINGS_ITEMS_FOR_WORK_JPA =
            "SELECT new dk.dbc.search.solrdocstore.DocumentRetrieveBean.HoldingsInfo(h, h2b) FROM HoldingsToBibliographicEntity h2b" +
                    " INNER JOIN HoldingsItemEntity h" +
                    " ON h2b.holdingsBibliographicRecordId = h.bibliographicRecordId AND h2b.holdingsAgencyId = h.agencyId" +
                    " INNER JOIN BibliographicEntity be" +
                    " ON h2b.bibliographicRecordId = be.bibliographicRecordId AND h2b.bibliographicAgencyId = be.agencyId " +
                    " WHERE be.work = :workId";

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
            holdingsItemRecords = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_JPA, HoldingsItemEntity.class)
                    .setParameter("bibliographicRecordId", bibliographicRecordId)
                    .setParameter("agencyId", agencyId)
                    .getResultList();
            if (LibraryType.COMMON_AGENCY == agencyId) {
                partOfDanbib = getPartOfDanbibCommon(bibliographicRecordId);
            }
            OpenAgencyEntity oaEntity = oaBean.lookup(agencyId);
            LibraryType libraryType = oaEntity.getLibraryType();

            List<BibliographicResourceEntity> resources = agencyLibTypeCommon(agencyId, libraryType)
                    ? brrBean.getResourcesForCommon(bibliographicRecordId)
                    : brrBean.getResourcesFor(agencyId, bibliographicRecordId);
            attachedResources = mapResources(resources);
        }
        DocumentRetrieveResponse response = new DocumentRetrieveResponse(biblEntity, holdingsItemRecords, partOfDanbib, attachedResources);
        return response;
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workid }")
    @Timed(reusable = true)
    public Response getWorkDocumentsWithHoldingsItems(@Context UriInfo uriInfo,
                                                      @PathParam("workid") String workId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys
                                                    ) throws Exception {
        log.debug("Fetching manifestations for work {}, includeHIIK: {}", workId, includeHoldingsItemsIndexKeys);
        try(LogWith logWith = track(null)) {
            List<DocumentRetrieveResponse> responses = getDocumentsForWork(workId, includeHoldingsItemsIndexKeys);
            if (responses == null || responses.size() == 0) {
                return Response.status(Response.Status.NOT_FOUND).entity("Work not found").build();
            }
            final WorkRetrieveResponse res = new WorkRetrieveResponse(workId, responses);
            return Response.ok(res).build();
        } catch (Exception ex) {
            log.error("Error retrieving documents for work {}: {}", workId, ex.getMessage());
            log.debug("Error retrieving documents for work {}: {}", workId, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error retrieving documents for work").build();
        }
    }


    public List<DocumentRetrieveResponse> getDocumentsForWork(String workId, boolean includeHoldingsItemsIndexKeys)  throws Exception {
        List<DocumentRetrieveResponse> res = new ArrayList<>();
        List<BibliographicEntity> bibliographicEntities = entityManager.createQuery(SELECT_MANIFESTATIONS_FOR_WORK_JPA, BibliographicEntity.class)
                .setParameter("workId", workId)
                .getResultList();
        List<HoldingsInfo> holdingsObjs = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_FOR_WORK_JPA, HoldingsInfo.class)
                .setParameter("workId", workId)
                .getResultList();
        for (BibliographicEntity b : bibliographicEntities) {
            List<HoldingsItemEntity> holdingsItemEntityList = holdingsObjs.stream()
                    .filter(ho -> ho.holdingsToBibliographicEntity.getBibliographicAgencyId() == b.getAgencyId()
                            && ho.holdingsToBibliographicEntity.getBibliographicRecordId().equals(b.getBibliographicRecordId()))
                    .map(h -> h.holdingsItemEntity)
                    .map(h -> includeHoldingsItemsIndexKeys ? h : h.copyForLightweightPresentation())
                    .collect(Collectors.toList());
            List<Integer> partOfDanbib = b.getAgencyId() == LibraryType.COMMON_AGENCY
                    ? getPartOfDanbibCommon(b.getBibliographicRecordId())
                    : Collections.EMPTY_LIST;
            LibraryType lt = oaBean.lookup(b.getAgencyId()).getLibraryType();
            List<BibliographicResourceEntity> resources = agencyLibTypeCommon(b.getAgencyId(), lt)
                    ? brrBean.getResourcesForCommon(b.getBibliographicRecordId())
                    : brrBean.getResourcesFor(b.getAgencyId(), b.getBibliographicRecordId());
            Map<String, Map<Integer, Boolean>> attachedResources = mapResources(resources);

            DocumentRetrieveResponse r = new DocumentRetrieveResponse(b, holdingsItemEntityList, partOfDanbib, attachedResources);
            res.add(r);
        }
        return res;
    }

    public List<Integer> getPartOfDanbibCommon(String bibliographicRecordId) {
        return entityManager.createNativeQuery(
                "SELECT CAST(h2b.holdingsAgencyId AS INTEGER) FROM HoldingsToBibliographic h2b" +
                " JOIN OpenAgencyCache oa " +
                        "ON oa.agencyId = h2b.holdingsAgencyId AND oa.libraryType = 'FBS' AND (oa.partOfDanbib = TRUE OR oa.authCreateCommonRecord = TRUE)" +
                " JOIN HoldingsItemsSolrKeys h " +
                        "ON h.agencyId = h2b.holdingsAgencyId AND h.bibliographicRecordId = h2b.holdingsBibliographicRecordId AND h.hasLiveHoldings = TRUE" +
                " WHERE" +
                "  h2b.isCommonDerived = TRUE" +
                "  AND h2b.bibliographicRecordId = ?" +
                "  AND NOT EXISTS (SELECT (1) FROM BibliographicSolrKeys b " +
                        "WHERE b.agencyId = h2b.holdingsAgencyId AND b.bibliographicRecordId = h2b.bibliographicRecordId " +
                        "AND 'true' = jsonb_extract_path_text(b.indexKeys, 'rec.excludeFromUnionCatalogue', '0'))"
        ).setParameter(1, bibliographicRecordId)
                .getResultList();
    }

    public static Map<String, Map<Integer, Boolean>> mapResources(List<BibliographicResourceEntity> resources) {
        Map<String, Map<Integer, Boolean>> map = new HashMap<>();
        for (BibliographicResourceEntity resource : resources) {
            Map<Integer, Boolean> agencyResources = map.computeIfAbsent(resource.getField(), a -> new HashMap<>());
            agencyResources.put(resource.getAgencyId(), resource.getValue());
        }
        return map;
    }

    private static boolean agencyLibTypeCommon(int agencyId, LibraryType lt) {
       return LibraryType.COMMON_AGENCY == agencyId ||
               LibraryType.SCHOOL_COMMON_AGENCY == agencyId ||
               lt == LibraryType.FBS || lt == LibraryType.FBSSchool;
    }

    /**
     * Class for fetching HoldingsItemEntity and HoldingsToBibliographicEntity objects in
     * the same query (in a human-readable way).
     */
    public static class HoldingsInfo {
        public HoldingsItemEntity holdingsItemEntity;
        public HoldingsToBibliographicEntity holdingsToBibliographicEntity;

        public HoldingsInfo(HoldingsItemEntity hie, HoldingsToBibliographicEntity hbe) {
            holdingsItemEntity = hie;
            holdingsToBibliographicEntity = hbe;
        }

    }
}
