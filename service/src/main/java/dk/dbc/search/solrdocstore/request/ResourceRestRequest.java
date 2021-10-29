package dk.dbc.search.solrdocstore.request;

/**
 * Flag object for resource rest put/delete
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class ResourceRestRequest {

    private boolean has;

    public ResourceRestRequest() {
    }

    public boolean getHas() {
        return has;
    }

    public void setHas(boolean has) {
        this.has = has;
    }

    @Override
    public String toString() {
        return "ResourceRestRequest{" + "has=" + has + '}';
    }
}
