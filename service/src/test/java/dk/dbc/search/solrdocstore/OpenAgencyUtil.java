package dk.dbc.search.solrdocstore;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyUtil {

    public static int COMMON_AGENCY = LibraryType.COMMON_AGENCY;
    public static int SCHOOL_COMMON_AGENCY = LibraryType.SCHOOL_COMMON_AGENCY;

    /**
     *
     * agencyId last digit less than 5 gives part_of_danbib
     * agencyId 2nd last digit less than 5 gives auth_create_common_record
     *
     *
     * @param agencyId
     * @return
     */
    public static OpenAgencyEntity makeOpenAgencyEntity(int agencyId) {
        if(agencyId == LibraryType.COMMON_AGENCY) {
            return makeOpenAgencyEntity(LibraryType.COMMON_AGENCY, true, true);
        }
        if(agencyId == LibraryType.SCHOOL_COMMON_AGENCY) {
            return makeOpenAgencyEntity(LibraryType.SCHOOL_COMMON_AGENCY, false, false);
        }
        boolean partOfDanbib = ( agencyId / 1 ) % 10 < 5;
        boolean authCreateCommonRecord = ( agencyId / 10 ) % 10 < 5;
        return makeOpenAgencyEntity(agencyId, authCreateCommonRecord, partOfDanbib);
    }

    public static OpenAgencyEntity makeOpenAgencyEntity(int agencyId, boolean authCreateCommonRecord, boolean partOfDanbib) {
        LibraryType type = LibraryType.FBS;
        if (agencyId < 400000) {
            type = LibraryType.FBSSchool;
        }
        if (agencyId >= 800000) {
            type = LibraryType.NonFBS;
        }
        if (agencyId >= 900000) {
            type = LibraryType.Missing;
        }
        return new OpenAgencyEntity(agencyId, type, authCreateCommonRecord, partOfDanbib);
    }

}
