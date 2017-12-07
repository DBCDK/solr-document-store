package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;

import javax.ejb.Singleton;
import javax.ejb.Stateless;

@Stateless
@Singleton
public class LibraryRulesProxy {


    public LibraryConfig.LibraryType fetchLibraryTypeFor(int agency){
        return LibraryConfig.LibraryType.FBS;
    }

}
