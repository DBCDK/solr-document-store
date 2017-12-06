package dk.dbc.search.solrdocstore.openagency.libraryrules;

public class LibraryRulesProxy {

    private static LibraryRulesProxy _instance=null;

    public static LibraryRulesProxy getInstance(){
        if (_instance!=null){
            synchronized (_instance){
                if (_instance != null){
                    _instance = new LibraryRulesProxy();
                }
            }
        }
        return _instance;
    }

    private LibraryRulesProxy(){
        super();
    }
}
