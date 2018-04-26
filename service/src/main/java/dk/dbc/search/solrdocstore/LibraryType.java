package dk.dbc.search.solrdocstore;

/**
 * FBS and FBSSchool is allowed to hookup holdings to CommonRecords ( 870970
 * / 300000 )
 */
public enum LibraryType {

    NonFBS, FBS, FBSSchool;

    public static final int COMMON_AGENCY = 870970;
    public static final int SCHOOL_COMMON_AGENCY = 300000;
}
