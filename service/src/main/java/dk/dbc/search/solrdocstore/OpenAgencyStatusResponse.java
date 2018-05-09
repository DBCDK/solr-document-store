package dk.dbc.search.solrdocstore;

import java.util.HashMap;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyStatusResponse {

    public static class Diag {

        public OpenAgencyReportResponse solrDocStore;
        public OpenAgencyReportResponse openAgency;

        public Diag() {
        }

        public Diag(OpenAgencyEntity solrDocStore, OpenAgencyEntity openAgency) {
            this.solrDocStore = new OpenAgencyReportResponse(solrDocStore);
            this.openAgency = new OpenAgencyReportResponse(openAgency);
        }
    }

    public static class OpenAgencyReportResponse {

        public int agencyId;

        public LibraryType libraryType;

        public boolean partOfDanbib;

        public String fetched;

        public OpenAgencyReportResponse() {
        }

        public OpenAgencyReportResponse(OpenAgencyEntity oa) {
            this.agencyId = oa.getAgencyId();
            this.libraryType = oa.getLibraryType();
            this.partOfDanbib = oa.getPartOfDanbib();
            this.fetched = oa.getFetched().toInstant().toString();
        }

    }

    public boolean ok;
    public HashMap<Integer, Diag> states;

    public OpenAgencyStatusResponse() {
        states = new HashMap<>();
    }

}
