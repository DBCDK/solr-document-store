package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.TimeUnit;

@Stateless
@Singleton
public class LibraryRulesProxy {

    private static String SCHOOLLIBRARY="Skolebibliotek";

    public LibraryConfig.LibraryType fetchLibraryTypeFor(int agency){
        RetryPolicy retryPolicy = new RetryPolicy()
                .withDelay(100, TimeUnit.MILLISECONDS)
                .retryOn(Exception.class)
                .withMaxRetries(4);

        String json = Failsafe.with(retryPolicy).get(() -> fetchJSON(agency));

        LibraryRules libraryRules = JSONParser.getLibraryRules(json);
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


    private String fetchJSON(int agency){

        Client client=null;

        try {
            String URI = "http://openagency.addi.dk/next_2.32/?action=libraryRules&outputType=json&agencyId=";
            client = ClientBuilder.newClient();
            WebTarget target = client.target(URI + agency);
            return target.request(MediaType.APPLICATION_JSON).get(String.class);
        } catch(Exception e){
            throw new LibraryRuleException("Failed to connect to openagency.addi.dk",e);
        } finally {
            if (client!=null) {
                client.close();
            }
        }
    }

}
