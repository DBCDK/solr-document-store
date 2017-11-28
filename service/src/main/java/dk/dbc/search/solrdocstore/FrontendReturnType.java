package dk.dbc.search.solrdocstore;

import java.util.Collections;
import java.util.List;

public class FrontendReturnType {
    public List<BibliographicEntity> result;

    public FrontendReturnType(){
        result = Collections.emptyList();
    }
    public FrontendReturnType(List<BibliographicEntity> res){
        result = res;
    }
}
