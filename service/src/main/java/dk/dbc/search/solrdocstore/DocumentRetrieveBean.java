/*
 * Copyright (C) 2017 DBC A/S (http://dbc.dk/)
 *
 * This is part of dbc-solr-doc-store-service
 *
 * dbc-solr-doc-store-service is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * dbc-solr-doc-store-service is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.monitor.Timed;
import java.util.List;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}/{ bibliographicRecordId : .*}")
    @Timed
    //! TODO Remove Deprecated
    public Response getDocumentWithHoldingsitems(@Context UriInfo uriInfo,
                                                 @PathParam("agencyId") Integer agencyId,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId) throws Exception {
        log.warn("Deprecated: missing classifier in retrieve/combined");
        DocumentRetrieveResponse response = getDocumentWithHoldingsitems(agencyId, bibliographicRecordId);
        if (response == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Record not found").build();
        }
        return Response.ok(response).build();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("combined/{ agencyId : \\d+}/{ classifier }/{ bibliographicRecordId : .*}")
    @Timed
    public Response getDocumentWithHoldingsitems(@Context UriInfo uriInfo,
                                                 @PathParam("agencyId") Integer agencyId,
                                                 @PathParam("classifier") String classifier,
                                                 @PathParam("bibliographicRecordId") String bibliographicRecordId) throws Exception {
        DocumentRetrieveResponse response = getDocumentWithHoldingsitems(agencyId, classifier, bibliographicRecordId);
        if (response == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Record not found").build();
        }
        return Response.ok(response).build();
    }

    //! TODO Remove Deprecated
    public DocumentRetrieveResponse getDocumentWithHoldingsitems(Integer agencyId, String bibliographicRecordId) throws Exception {

        BibliographicEntity biblEntity = brBean.getBibliographicEntity(agencyId, bibliographicRecordId);
        if (biblEntity == null) {
            return null;
        }

        DocumentRetrieveResponse response = new DocumentRetrieveResponse(biblEntity, null, null);

        if (!biblEntity.isDeleted()) {
            TypedQuery<HoldingsItemEntity> query = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_JPA, HoldingsItemEntity.class);
            query.setParameter("bibliographicRecordId", bibliographicRecordId);
            query.setParameter("agencyId", agencyId);
            response.holdingsItemRecords = query.getResultList();

            if(LibraryType.COMMON_AGENCY == agencyId) {
                response.partOfDanbib = getPartOfDanbibCommon(bibliographicRecordId);
            } else {
                response.partOfDanbib = getPartOfDanbib(agencyId, bibliographicRecordId);
            }
        }
        return response;
    }

    public DocumentRetrieveResponse getDocumentWithHoldingsitems(Integer agencyId, String classifier, String bibliographicRecordId) throws Exception {

        BibliographicEntity biblEntity = entityManager.find(BibliographicEntity.class, new AgencyClassifierItemKey(agencyId, classifier, bibliographicRecordId));
        if (biblEntity == null) {
            return null;
        }

        DocumentRetrieveResponse response = new DocumentRetrieveResponse(biblEntity, null, null);

        if (!biblEntity.isDeleted()) {
            TypedQuery<HoldingsItemEntity> query = entityManager.createQuery(SELECT_HOLDINGS_ITEMS_JPA, HoldingsItemEntity.class);
            query.setParameter("bibliographicRecordId", bibliographicRecordId);
            query.setParameter("agencyId", agencyId);
            response.holdingsItemRecords = query.getResultList();

            if(LibraryType.COMMON_AGENCY == agencyId) {
                response.partOfDanbib = getPartOfDanbibCommon(bibliographicRecordId);
            } else {
                response.partOfDanbib = getPartOfDanbib(agencyId, bibliographicRecordId);
            }
        }
        return response;
    }

    public List<Integer> getPartOfDanbibCommon(String bibliographicRecordId) {
        return entityManager.createQuery(
                "SELECT h2b.holdingsAgencyId FROM HoldingsToBibliographicEntity h2b" +
                " JOIN OpenAgencyEntity oa ON oa.agencyId = h2b.holdingsAgencyId" +
                " JOIN HoldingsItemEntity h ON (h.agencyId = h2b.holdingsAgencyId" +
                "  AND h.bibliographicRecordId = h2b.holdingsBibliographicRecordId)" +
                " WHERE" +
                "  h2b.isCommonDerived = TRUE" +
                "  AND h2b.bibliographicRecordId = :bibliographicRecordId" +
                "  AND oa.libraryType = :fbs" +
                "  AND oa.partOfDanbib = TRUE" +
                "  AND h.hasLiveHoldings = TRUE", Integer.class)
                .setParameter("bibliographicRecordId", bibliographicRecordId)
                .setParameter("fbs", LibraryType.FBS)
                .getResultList();
    }

    public List<Integer> getPartOfDanbib(int agencyId, String bibliographicRecordId) {
        return entityManager.createQuery(
                "SELECT h2b.holdingsAgencyId FROM HoldingsToBibliographicEntity h2b" +
                " JOIN OpenAgencyEntity oa ON oa.agencyId = h2b.holdingsAgencyId" +
                " JOIN HoldingsItemEntity h ON (h.agencyId = h2b.holdingsAgencyId" +
                "  AND h.bibliographicRecordId = h2b.holdingsBibliographicRecordId)" +
                " WHERE" +
                "  h2b.isCommonDerived = TRUE" +
                "  AND h2b.bibliographicRecordId = :bibliographicRecordId" +
                "  AND h2b.bibliographicAgencyId = :agencyId" +
                "  AND oa.libraryType = :fbs" +
                "  AND oa.partOfDanbib = TRUE" +
                "  AND h.hasLiveHoldings = TRUE", Integer.class)
                .setParameter("bibliographicRecordId", bibliographicRecordId)
                .setParameter("agencyId", agencyId)
                .setParameter("fbs", LibraryType.FBS)
                .getResultList();
    }
}
