package dk.dbc.search.solrdocstore;

import java.util.EnumSet;

/**
 * FBS and FBSSchool is allowed to hookup holdings to CommonRecords ( 870970
 * / 300000 )
 */
public enum LibraryType {
    NonFBS, FBS, FBSSchool, Missing;

    public static final int COMMON_AGENCY = 870970;
    public static final int SCHOOL_COMMON_AGENCY = 300000;

    public static final EnumSet<LibraryType> FBS_LIBS = EnumSet.of(FBS, FBSSchool);

}

