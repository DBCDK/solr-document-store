package dk.dbc.search.solrdocstore;

import static dk.dbc.search.solrdocstore.LibraryType.libraryTypeFromAgency;

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
            return makeOpenAgencyEntity(LibraryType.COMMON_AGENCY, true, false, true);
        }
        if(agencyId == LibraryType.SCHOOL_COMMON_AGENCY) {
            return makeOpenAgencyEntity(LibraryType.SCHOOL_COMMON_AGENCY, false, false, false);
        }
        boolean partOfDanbib = ( agencyId / 1 ) % 10 < 5;
        boolean authCreateCommonRecord = ( agencyId / 10 ) % 10 < 5;
        return makeOpenAgencyEntity(agencyId, authCreateCommonRecord, partOfDanbib, partOfDanbib);
    }

    public static OpenAgencyEntity makeOpenAgencyEntity(int agencyId, boolean authCreateCommonRecord, boolean partOfBibDk, boolean partOfDanbib) {
        return new OpenAgencyEntity(agencyId, libraryTypeFromAgency(agencyId), authCreateCommonRecord, partOfBibDk, partOfDanbib);
    }

}
