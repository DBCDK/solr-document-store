package dk.dbc.search.solrdocstore;

public class AddResourceRequest extends BibliographicResourceEntity {

    public AddResourceRequest(){}

    public AddResourceRequest(int agencyId, String field, String bibliographicRecordId, boolean value){
        super(agencyId, field, bibliographicRecordId, value);
    }

    BibliographicResourceEntity asBibliographicResource() {
        return new BibliographicResourceEntity(this.getAgencyId(), this.getField(),
                this.getBibliographicRecordId(), this.getValue());
    }
}
