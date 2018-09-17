package dk.dbc.search.solrdocstore;

public class AddResourceRequest extends BibliographicResource {

    public AddResourceRequest(){}

    public AddResourceRequest(int agencyId, String field, String bibliographicRecordId, boolean value){
        super(agencyId, field, bibliographicRecordId, value);
    }

    BibliographicResource asBibliographicResource() {
        return new BibliographicResource(this.getAgencyId(), this.getField(),
                this.getBibliographicRecordId(), this.getValue());
    }
}
