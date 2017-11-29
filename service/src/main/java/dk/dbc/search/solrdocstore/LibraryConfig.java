package dk.dbc.search.solrdocstore;

import javax.ejb.Singleton;
import javax.ejb.Stateless;

@Stateless
@Singleton
public class LibraryConfig {

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

    LibraryType getLibraryType(int agency) {
        // Toto lookup Library type from openAgency
        return LibraryType.FBS;
    }

    RecordType getRecordType(int agency) {
        switch (agency) {
            case 300000:
            case 870970:
                return RecordType.CommonRecord;
            default:
                return RecordType.SingleRecord;
        }
    }

}
