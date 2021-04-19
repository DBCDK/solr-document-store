package dk.dbc.search.solrdocstore.request;

import dk.dbc.search.solrdocstore.jpa.BibliographicResourceEntity;

public class AddResourceRequest extends BibliographicResourceEntity {

    public AddResourceRequest() {
    }

    public AddResourceRequest(int agencyId, String bibliographicRecordId, String field, boolean value) {
        super(agencyId, bibliographicRecordId, field, value);
    }

    public BibliographicResourceEntity asBibliographicResource() {
        return new BibliographicResourceEntity(this.getAgencyId(),
                                               this.getBibliographicRecordId(), this.getField(), this.getValue());
    }
}
