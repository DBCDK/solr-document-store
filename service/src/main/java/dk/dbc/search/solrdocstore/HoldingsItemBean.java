package dk.dbc.search.solrdocstore;

import dk.dbc.commons.jsonb.JSONBContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static dk.dbc.search.solrdocstore.LibraryConfig.*;

@Stateless
@Path("holdings")
public class HoldingsItemBean {

    private static final Logger log = LoggerFactory.getLogger(HoldingsItemBean.class);

    private final JSONBContext jsonbContext = new JSONBContext();

    @Inject
    LibraryConfig libraryConfig;

    @PersistenceContext(unitName = "solrDocumentStore_PU")
    EntityManager entityManager;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addHoldingsKeys(@Context UriInfo uriInfo, String jsonContent) throws Exception {

        HoldingsItemEntity hi = jsonbContext.unmarshall(jsonContent, HoldingsItemEntity.class);

        log.info("Updating holdings for {}:{}", hi.agencyId, hi.bibliographicRecordId);

        entityManager.merge(hi);

        AgencyItemKey holdingsId = new AgencyItemKey(hi.agencyId, hi.bibliographicRecordId);
        tryToAttachToBibliographicRecord(holdingsId);

        return Response.ok().entity("{ \"ok\": true }").build();
    }

    private void tryToAttachToBibliographicRecord(AgencyItemKey holdingsId) {
        boolean attached;
        LibraryType libraryType = libraryConfig.getLibraryType(holdingsId.agencyId);

        switch (libraryType) {

            case NonFBS:
                attachToBibliographicRecord(holdingsId, holdingsId.agencyId);
                break;

            case FBS:

                attachToBibliographicRecord(holdingsId, holdingsId.agencyId,COMMON_AGENCY);
                break;

            case FBSSchool:
                attachToBibliographicRecord(holdingsId,holdingsId.agencyId,COMMON_AGENCY,SCHOOL_COMMON_AGENCY);
                break;
        }
    }

    private void attachToBibliographicRecord(AgencyItemKey holdingsId, int ... agencyPriority) {
        boolean attached = false;

        for (int i=0; i<agencyPriority.length;i++) {
            attached = attachIfExists(agencyPriority[i],holdingsId);
            if (attached) return;
        }
    }


    private boolean attachIfExists(int agencyId, AgencyItemKey holdingsId) {
        if (bibliographicEntityExists(agencyId,holdingsId.bibliographicRecordId)){
            attachToAgency(agencyId, holdingsId);
            return true;
        }
        return false;
    }

    private boolean bibliographicEntityExists(int agencyId, String bibliographicRecordId) {
        AgencyItemKey k = new AgencyItemKey(agencyId, bibliographicRecordId);
        BibliographicEntity e = entityManager.find(BibliographicEntity.class, k);
        return (e!=null);
    }

    private void attachToAgency(int attachToAgency, AgencyItemKey itemKey) {
        if (alreadyAttachedToAgency(attachToAgency, itemKey)) return;
        persist(attachToAgency, itemKey);
    }

    private boolean alreadyAttachedToAgency(int attachToAgency, AgencyItemKey itemKey) {
        HoldingsToBibliographicEntity foundEntity = entityManager.find(HoldingsToBibliographicEntity.class, itemKey);
        if (foundEntity!=null){
            if (foundEntity.bibliographicAgencyId==attachToAgency) {
                return true;
            } else {
                entityManager.remove(foundEntity);
                addAttachEventQueue(foundEntity.bibliographicAgencyId, foundEntity.bibliographicRecordId);
            }
        }
        return false;
    }

    private void persist(int attachToAgency, AgencyItemKey itemKey) {
        HoldingsToBibliographicEntity newEntity = new HoldingsToBibliographicEntity();
        newEntity.agencyId = itemKey.agencyId;
        newEntity.bibliographicRecordId = itemKey.bibliographicRecordId;
        newEntity.bibliographicAgencyId = attachToAgency;
        entityManager.merge(newEntity);
        addAttachEventQueue(attachToAgency,itemKey.bibliographicRecordId);
    }


    private void addAttachEventQueue(int bibliographicAgencyId, String bibliographicRecordId) {
        //TODO: Implement
    }

}
