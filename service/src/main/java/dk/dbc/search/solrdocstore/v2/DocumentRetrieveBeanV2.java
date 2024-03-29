package dk.dbc.search.solrdocstore.v2;

import dk.dbc.search.solrdocstore.logic.BibliographicRetrieveBean;
import dk.dbc.log.LogWith;
import dk.dbc.search.solrdocstore.logic.BibliographicResourceRetrieveBean;
import dk.dbc.search.solrdocstore.logic.OpenAgencyBean;
import dk.dbc.search.solrdocstore.jpa.AgencyClassifierItemKey;
import dk.dbc.search.solrdocstore.jpa.BibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsItemEntity;
import dk.dbc.search.solrdocstore.jpa.HoldingsToBibliographicEntity;
import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;
import dk.dbc.search.solrdocstore.response.DocumentRetrieveResponse;
import dk.dbc.search.solrdocstore.response.HoldingsInfo;
import dk.dbc.search.solrdocstore.response.UnitRetrieveResponse;
import dk.dbc.search.solrdocstore.response.WorkRetrieveResponse;
import org.eclipse.microprofile.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
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
@Path("v2/retrieve")
public class DocumentRetrieveBeanV2 {

    private static final Logger log = LoggerFactory.getLogger(DocumentRetrieveBeanV2.class);

    private static final String SELECT_HOLDINGS_ITEMS_JPA =
            "SELECT h FROM HoldingsToBibliographicEntity h2b" +
            " INNER JOIN HoldingsItemEntity h " +
            "ON h2b.bibliographicRecordId = h.bibliographicRecordId AND h2b.holdingsAgencyId = h.agencyId" +
            " WHERE h2b.bibliographicRecordId = :bibliographicRecordId" +
            " AND h2b.bibliographicAgencyId = :agencyId";

    private static final String SELECT_HOLDINGS_ITEMS_FOR_UNIT_JPA =
            "SELECT new dk.dbc.search.solrdocstore.response.HoldingsInfo(h, h2b) FROM HoldingsToBibliographicEntity h2b" +
            " INNER JOIN HoldingsItemEntity h" +
            " ON h2b.bibliographicRecordId = h.bibliographicRecordId AND h2b.holdingsAgencyId = h.agencyId" +
            " INNER JOIN BibliographicEntity be" +
            " ON h2b.bibliographicRecordId = be.bibliographicRecordId AND h2b.bibliographicAgencyId = be.agencyId " +
            " WHERE be.unit = :unitId";

    private static final String SELECT_HOLDINGS_ITEMS_FOR_WORK_JPA =
            "SELECT new dk.dbc.search.solrdocstore.response.HoldingsInfo(h, h2b) FROM HoldingsToBibliographicEntity h2b" +
            " INNER JOIN HoldingsItemEntity h" +
            " ON h2b.bibliographicRecordId = h.bibliographicRecordId AND h2b.holdingsAgencyId = h.agencyId" +
            " INNER JOIN BibliographicEntity be" +
            " ON h2b.bibliographicRecordId = be.bibliographicRecordId AND h2b.bibliographicAgencyId = be.agencyId " +
            " WHERE be.work = :workId";

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    public EntityManager entityManager;

    @Inject
    public BibliographicRetrieveBean brBean;

    @Inject
    public BibliographicResourceRetrieveBean brrBean;

    @Inject
    public OpenAgencyBean oaBean;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}/{ classifier }/{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems(@PathParam("agencyId") Integer agencyId,
                                                 @PathParam("classifier") String classifier,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                 @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        try (LogWith logWith = track(null)) {
            log.info("getDocumentWithHoldingsitems");
            DocumentRetrieveResponse response = getDocumentWithHoldingsitems(agencyId, classifier, bibliographicRecordId);
            if (response == null) {
                return Response.status(Response.Status.NOT_FOUND).header("X-DBC-Status", "200").entity("Record not found").build();
            }
            if (deleted404 && response.bibliographicRecord.isDeleted()) {
                return Response.status(Response.Status.NOT_FOUND).header("X-DBC-Status", "200").entity("Record not found").build();
            }
            return Response.ok(response).build();
        } catch (Exception ex) {
            log.error("Error retrieving document {}-{}:{}: {}", agencyId, classifier, bibliographicRecordId, ex.getMessage());
            log.debug("Error retrieving document {}-{}:{}: ", agencyId, classifier, bibliographicRecordId, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error retrieving document").build();
        }
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}-{ classifier : [a-z0-9]+ }:{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems2(@PathParam("agencyId") Integer agencyId,
                                                  @PathParam("classifier") String classifier,
                                                  @PathParam("bibliographicRecordId") String bibliographicRecordId,
                                                  @QueryParam("deleted404") @DefaultValue("false") boolean deleted404) throws Exception {
        return getDocumentWithHoldingsitems(agencyId, classifier, bibliographicRecordId, deleted404);
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

            List<BibliographicResourceEntity> resources = agencyLibTypeCommon(agencyId, libraryType) ?
                                                          brrBean.getResourcesForCommon(bibliographicRecordId) :
                                                          brrBean.getResourcesFor(agencyId, bibliographicRecordId);
            attachedResources = mapResources(resources);
        }
        DocumentRetrieveResponse response = new DocumentRetrieveResponse(biblEntity, holdingsItemRecords, partOfDanbib, attachedResources);
        return response;
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("unit/{ unitid }")
    @Timed
    public Response getUnitDocumentsWithHoldingsItems(@PathParam("unitid") String unitId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        log.info("getUnitDocumentsWithHoldingsItems");
        log.debug("Fetching manifestations for unit {}, includeHIIK: {}", unitId, includeHoldingsItemsIndexKeys);
        try (LogWith logWith = track(null)) {
            List<DocumentRetrieveResponse> responses = getDocumentsForUnit(unitId, includeHoldingsItemsIndexKeys);
            if (responses == null || responses.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND).header("X-DBC-Status", "200").entity("Unit not found").build();
            }
            final UnitRetrieveResponse res = new UnitRetrieveResponse(unitId, responses);
            return Response.ok(res).build();
        } catch (Exception ex) {
            log.error("Error retrieving documents for unit {}: {}", unitId, ex.getMessage());
            log.debug("Error retrieving documents for unit {}: {}", unitId, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error retrieving documents for unit").build();
        }
    }

    public List<DocumentRetrieveResponse> getDocumentsForUnit(String unitId, boolean includeHoldingsItemsIndexKeys) throws Exception {
        List<BibliographicEntity> bibliographicEntities = BibliographicEntity.fetchByUnit(entityManager, unitId);
        List<HoldingsInfo> holdingsObjs = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_FOR_UNIT_JPA, HoldingsInfo.class)
                .setParameter("unitId", unitId)
                .getResultList();
        List<DocumentRetrieveResponse> res = buildDocumentList(bibliographicEntities, holdingsObjs, includeHoldingsItemsIndexKeys);
        return res;
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("work/{ workid }")
    @Timed
    public Response getWorkDocumentsWithHoldingsItems(@PathParam("workid") String workId,
                                                      @DefaultValue("false") @QueryParam("includeHoldingsItemsIndexKeys") boolean includeHoldingsItemsIndexKeys) throws Exception {
        log.info("getWorkDocumentsWithHoldingsItems");
        log.debug("Fetching manifestations for work {}, includeHIIK: {}", workId, includeHoldingsItemsIndexKeys);
        try (LogWith logWith = track(null)) {
            List<DocumentRetrieveResponse> responses = getDocumentsForWork(workId, includeHoldingsItemsIndexKeys);
            if (responses == null || responses.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND).header("X-DBC-Status", "200").entity("Work not found").build();
            }
            final WorkRetrieveResponse res = new WorkRetrieveResponse(workId, responses);
            return Response.ok(res).build();
        } catch (Exception ex) {
            log.error("Error retrieving documents for work {}: {}", workId, ex.getMessage());
            log.debug("Error retrieving documents for work {}: {}", workId, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error retrieving documents for work").build();
        }
    }

    public List<DocumentRetrieveResponse> getDocumentsForWork(String workId, boolean includeHoldingsItemsIndexKeys) throws Exception {
        List<BibliographicEntity> bibliographicEntities = BibliographicEntity.fetchByWork(entityManager, workId);
        List<HoldingsInfo> holdingsObjs = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_FOR_WORK_JPA, HoldingsInfo.class)
                .setParameter("workId", workId)
                .getResultList();
        List<DocumentRetrieveResponse> res = buildDocumentList(bibliographicEntities, holdingsObjs, includeHoldingsItemsIndexKeys);
        return res;
    }

    private List<DocumentRetrieveResponse> buildDocumentList(List<BibliographicEntity> bibliographicEntities, List<HoldingsInfo> holdingsObjs, boolean includeHoldingsItemsIndexKeys) {
        return bibliographicEntities.stream().map(b -> {
            List<HoldingsItemEntity> holdingsItemEntityList = holdingsObjs.stream()
                    .filter(ho -> ho.holdingsToBibliographicEntity.getBibliographicAgencyId() == b.getAgencyId() &&
                                    ho.holdingsToBibliographicEntity.getBibliographicRecordId().equals(b.getBibliographicRecordId()))
                    .map(h -> h.holdingsItemEntity)
                    .map(h -> includeHoldingsItemsIndexKeys ? h : h.copyForLightweightPresentation())
                    .collect(Collectors.toList());
            List<Integer> partOfDanbib = b.getAgencyId() == LibraryType.COMMON_AGENCY ?
                                         getPartOfDanbibCommon(b.getBibliographicRecordId()) :
                                         Collections.EMPTY_LIST;
            LibraryType lt = oaBean.lookup(b.getAgencyId()).getLibraryType();
            List<BibliographicResourceEntity> resources = agencyLibTypeCommon(b.getAgencyId(), lt) ?
                                                          brrBean.getResourcesForCommon(b.getBibliographicRecordId()) :
                                                          brrBean.getResourcesFor(b.getAgencyId(), b.getBibliographicRecordId());
            Map<String, Map<Integer, Boolean>> attachedResources = mapResources(resources);
            DocumentRetrieveResponse r = new DocumentRetrieveResponse(b, holdingsItemEntityList, partOfDanbib, attachedResources);
            return r;
        }).collect(Collectors.toList());
    }

    public List<Integer> getPartOfDanbibCommon(String bibliographicRecordId) {
        return entityManager.createQuery("SELECT h2b  FROM HoldingsToBibliographicEntity h2b" +
                                         " WHERE h2b.isCommonDerived = TRUE" +
                                         "  AND h2b.bibliographicRecordId = :bibliographicRecordId",
                                         HoldingsToBibliographicEntity.class)
                .setParameter("bibliographicRecordId", bibliographicRecordId)
                .getResultStream()
                .filter(h2b -> {
                    OpenAgencyEntity oae = oaBean.lookup(h2b.getHoldingsAgencyId());
                    return oae.getLibraryType() == LibraryType.FBS && ( oae.getAuthCreateCommonRecord() || oae.getPartOfDanbib() );
                })
                .filter(h2b -> !hasExcludeFromUnionCatalogue(h2b.getBibliographicAgencyId(), h2b.getBibliographicRecordId()))
                .map(HoldingsToBibliographicEntity::getHoldingsAgencyId)
                .collect(Collectors.toList());
    }

    private boolean hasExcludeFromUnionCatalogue(int agencyId, String bibliographicRecordId) {
        return entityManager.createQuery("SELECT b FROM BibliographicEntity b" +
                                         " WHERE b.bibliographicRecordId=:bibliographicRecordId" +
                                         "  AND b.agencyId=:agencyId", BibliographicEntity.class)
                .setParameter("bibliographicRecordId", bibliographicRecordId)
                .setParameter("agencyId", agencyId)
                .getResultStream()
                .filter(b -> b.getIndexKeys()
                        .getOrDefault("rec.excludeFromUnionCatalogue", Collections.EMPTY_LIST)
                        .contains("true"))
                .findAny()
                .isPresent();
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
               lt == LibraryType.FBS;
    }
}
