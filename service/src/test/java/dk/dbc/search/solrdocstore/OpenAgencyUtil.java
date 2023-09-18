package dk.dbc.search.solrdocstore;

import dk.dbc.search.solrdocstore.jpa.LibraryType;
import dk.dbc.search.solrdocstore.jpa.OpenAgencyEntity;

import static dk.dbc.search.solrdocstore.jpa.LibraryType.COMMON_AGENCY;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
public class OpenAgencyUtil {

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
        if (agencyId == COMMON_AGENCY) {
            return makeOpenAgencyEntity(COMMON_AGENCY, true, false, true);
        }
        boolean partOfDanbib = ( agencyId / 1 ) % 10 < 5;
        boolean authCreateCommonRecord = ( agencyId / 10 ) % 10 < 5;
        return makeOpenAgencyEntity(agencyId, authCreateCommonRecord, partOfDanbib, partOfDanbib);
    }

    public static OpenAgencyEntity makeOpenAgencyEntity(int agencyId, boolean authCreateCommonRecord, boolean partOfBibDk, boolean partOfDanbib) {
        LibraryType type = LibraryType.FBS;
        if (agencyId >= 800000) {
            type = LibraryType.NonFBS;
        }
        if (agencyId >= 900000) {
            type = LibraryType.Missing;
        }
        return new OpenAgencyEntity(agencyId, type, authCreateCommonRecord, partOfBibDk, partOfDanbib);
    }

}
