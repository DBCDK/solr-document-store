package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;

@Stateless
public class LibraryRulesProxy implements Serializable{

    @Inject
    OpenAgencyClient oaclient;

    private static String SCHOOLLIBRARY="Skolebibliotek";

    public LibraryConfig.LibraryType fetchLibraryTypeFor(int agency){

        LibraryRules libraryRules = oaclient.fetchLibraryRuleFor(agency);
        if (libraryRules.canUseEnrichments){
            if (SCHOOLLIBRARY.equals(libraryRules.agencyType)){
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
