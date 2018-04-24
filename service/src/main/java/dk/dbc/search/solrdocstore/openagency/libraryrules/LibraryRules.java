package dk.dbc.search.solrdocstore.openagency.libraryrules;

public class LibraryRules {

    String agencyType = null;
    Boolean canUseEnrichments = null;

    public LibraryRules() {
    }

    public LibraryRules(String agencyType, boolean canUseEnrichments) {
        this.agencyType = agencyType;
        this.canUseEnrichments = canUseEnrichments;
    }
}
