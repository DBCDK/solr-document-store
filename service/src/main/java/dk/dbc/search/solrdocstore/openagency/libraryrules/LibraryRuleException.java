package dk.dbc.search.solrdocstore.openagency.libraryrules;

public class LibraryRuleException extends RuntimeException {

    public LibraryRuleException(String message, Exception cause) {
        super(message, cause);
    }

    public LibraryRuleException(String message) {
        super(message);
    }

    public LibraryRuleException(Exception cause) {
        super(cause);
    }

}
