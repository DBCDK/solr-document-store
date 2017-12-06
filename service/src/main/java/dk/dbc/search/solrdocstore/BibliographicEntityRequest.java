package dk.dbc.search.solrdocstore;

import java.util.List;

public class BibliographicEntityRequest extends BibliographicEntity {

    private static final long serialVersionUID = -2569433415434599872L;

    public List<String> superceds;

    public int commitWithin;
}
