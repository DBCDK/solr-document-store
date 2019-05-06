package dk.dbc.search.solrdocstore;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.Collections;
import java.util.List;

@SuppressFBWarnings("URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD")
public class FrontendReturnListType<A> {

    public List<A> result;
    public int pages;

    public FrontendReturnListType() {
        result = Collections.emptyList();
        pages = 1;
    }

    public FrontendReturnListType(List<A> res, int pageCount) {
        result = res;
        pages = pageCount;
    }
}
