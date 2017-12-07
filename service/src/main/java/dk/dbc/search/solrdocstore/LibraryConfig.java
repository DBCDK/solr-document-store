package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.openagency.libraryrules.LibraryRulesProxy;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.inject.Inject;

@Stateless
@Singleton
public class LibraryConfig {

    @Inject
    AgencyLibraryTypeBean agencyLibraryTypeBean;

    /**
     * FBS and FBSSchool is allowed to hookup holdings to CommonRecords ( 870970 / 300000 )
     */
    public enum LibraryType {
        NonFBS, FBS, FBSSchool
    }

    /**
     *
     */
    public enum RecordType {
        CommonRecord, SingleRecord
    }

    public LibraryType getLibraryType(int agency) {
        return agencyLibraryTypeBean.fetchAndCacheLibraryType(agency);
    }

    public RecordType getRecordType(int agency) {
        switch (agency) {
            case 300000:  // Common Record Agency For School Libraries
            case 870970:  // Common Record Agency For All Libraries
                return RecordType.CommonRecord;
            default:
                return RecordType.SingleRecord;
        }
    }

}
