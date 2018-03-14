package dk.dbc.search.solrdocstore;

public class BibliographicFrontendEntity extends BibliographicEntity {
    private String supersedeId;

    BibliographicFrontendEntity(BibliographicEntity b,String liveId){
        super(b.getAgencyId(),b.getClassifier(),b.getBibliographicRecordId(),b.getWork(),b.getUnit(),b.getProducerVersion(),b.isDeleted(),b.getIndexKeys(),b.getTrackingId());
        supersedeId = liveId;
    }

    public String getSupersedeId(){
        return supersedeId;
    }

    public void setSupersedeId(String supersedeId){
        this.supersedeId = supersedeId;
    }
}
