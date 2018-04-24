package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;
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
    public LibraryConfig.LibraryType fetchLibraryTypeFor(int agency) {

        LibraryRules libraryRules = oaclient.fetchLibraryRuleFor(agency);
        if (libraryRules.canUseEnrichments) {
            if (SCHOOLLIBRARY.equals(libraryRules.agencyType)) {
                return LibraryConfig.LibraryType.FBSSchool;
            } else {
                return LibraryConfig.LibraryType.FBS;
            }
        } else {
            return LibraryConfig.LibraryType.NonFBS;
        }
    }

    public void setOaclient(OpenAgencyClient oaclient) {
        this.oaclient = oaclient;
    }
}
