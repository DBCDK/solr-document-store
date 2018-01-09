package dk.dbc.search.solrdocstore;

import java.util.Collections;
import java.util.List;

public class FrontendReturnListType<A> {
    public List<A> result;
    public int pages;

    public FrontendReturnListType(){
        result = Collections.emptyList();
        pages = 1;
    }
    public FrontendReturnListType(List<A> res,int pageCount){
        result = res;
        pages = pageCount;
    }
}
