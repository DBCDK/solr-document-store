package dk.dbc.search.solrdocstore;

import java.util.Collections;
import java.util.List;

public class FrontendReturnListType<A> {
    public List<A> result;

    public FrontendReturnListType(){
        result = Collections.emptyList();
    }
    public FrontendReturnListType(List<A> res){
        result = res;
    }
}
