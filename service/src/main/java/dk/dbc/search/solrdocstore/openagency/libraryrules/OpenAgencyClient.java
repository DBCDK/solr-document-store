package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.Config;
import net.jodah.failsafe.Failsafe;
import net.jodah.failsafe.RetryPolicy;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;

@Stateless
public class OpenAgencyClient implements Serializable {

    @Inject
    Config config;

    private RetryPolicy retryPolicy = new RetryPolicy()
            .withDelay(100, TimeUnit.MILLISECONDS)
            .retryOn(Exception.class)
            .withMaxRetries(4);

    public LibraryRules fetchLibraryRuleFor(int agency) {
        String json = Failsafe.with(retryPolicy).get(() -> fetchJSON(agency));

        return JSONParser.getLibraryRules(json);

    }

    private String fetchJSON(int agency) {

        Client client = null;

        try {
            String URI = config.getOaURL() + "/?action=libraryRules&outputType=json&agencyId=";
            client = ClientBuilder.newClient();
            WebTarget target = client.target(URI + agency);
            return target.request(MediaType.APPLICATION_JSON).get(String.class);
        } catch (Exception e) {
            throw new LibraryRuleException("Failed to connect to Open Agency", e);
        } finally {
            if (client != null) {
                client.close();
            }
        }
    }

    public void setConfig(Config config) {
        this.config = config;
    }
}
