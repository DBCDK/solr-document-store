package dk.dbc.search.solrdocstore;

import javax.ejb.Stateless;
import javax.inject.Inject;

@Stateless
public class LibraryConfig {

    @Inject
    AgencyLibraryTypeBean agencyLibraryTypeBean;

    public LibraryType getLibraryType(int agency) {
        return agencyLibraryTypeBean.fetchAndCacheLibraryType(agency);
    }

    public RecordType getRecordType(int agency) {
        switch (agency) {
            case LibraryType.COMMON_AGENCY:  // Common Record Agency For School Libraries
            case LibraryType.SCHOOL_COMMON_AGENCY:  // Common Record Agency For All Libraries
                return RecordType.CommonRecord;
            default:
                return RecordType.SingleRecord;
        }
    }

}
