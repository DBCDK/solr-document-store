package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;
import dk.dbc.search.solrdocstore.LibraryType;
import dk.dbc.search.solrdocstore.monitor.Timed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.Serializable;

@Stateless
public class LibraryRulesProxy implements Serializable {

    @Inject
    OpenAgencyClient oaclient;

    private static String SCHOOLLIBRARY = "Skolebibliotek";

    @Timed
    public LibraryType fetchLibraryTypeFor(int agency) {

        LibraryRules libraryRules = oaclient.fetchLibraryRuleFor(agency);
        if (libraryRules.canUseEnrichments) {
            if (SCHOOLLIBRARY.equals(libraryRules.agencyType)) {
                return LibraryType.FBSSchool;
            } else {
                return LibraryType.FBS;
            }
        } else {
            return LibraryType.NonFBS;
        }
    }

    public void setOaclient(OpenAgencyClient oaclient) {
        this.oaclient = oaclient;
    }
}
