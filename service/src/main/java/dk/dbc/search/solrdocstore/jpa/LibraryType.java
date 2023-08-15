package dk.dbc.search.solrdocstore.jpa;

/**
 * FBS is allowed to hookup holdings to CommonRecords ( 870970 )
 */
public enum LibraryType {
    NonFBS, FBS, Missing;

    public static final int COMMON_AGENCY = 870970;

}
