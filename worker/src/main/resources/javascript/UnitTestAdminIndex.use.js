use( "AdminIndex" );
use( "UnitTest" );
use( "XmlUtil" );
use( "Index" );

UnitTest.addFixture( "AdminIndex.createWorkId", function( ) {

    // Mocking Repository methods hasObject and getSysRelationsOfType for createWorkId test
    Repository.hasObject = function ( id ) {
        // Verify expected parameters
        Assert.equalValue("Expecting to be called for this unit", id, "unit:21839");
        return true;
    };
    Repository.getSysRelationsOfType = function (id, type) {
        // Verify expected parameters
        Assert.equalValue("Expecting to be called for this unit", id, "unit:21839");
        Assert.equalValue("Expecting to be called for this type of relations", type, "info:fedora/isMemberOfWork");

        return [ {
            subject: "unit:21839",
            predicate: "info:fedora/isMemberOfWork",
            object: "work:1"
        } ];
    };

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/870970-basis:29036640">' +
        '<isMemberOfUnit xmlns="info:fedora/">unit:21839</isMemberOfUnit>' +
        '<isPrimaryBibObjectFor xmlns="info:fedora/">unit:21839</isPrimaryBibObjectFor>' +
        '</rdf:Description></rdf:RDF>'
    );
    var indexOut = [ {
        name: "rec.workId",
        value: "work:1"
    } ];

    Assert.equalValue( "Create rec.workId", AdminIndex.createWorkId( xml, index ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/unit:21839">' +
        '<hasMemberOfUnit xmlns="info:fedora/">870970-basis:29036640</hasMemberOfUnit>' +
        '<hasPrimaryBibObject xmlns="info:fedora/">870970-basis:29036640</hasPrimaryBibObject>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    indexOut = [ {
        name: "rec.workId",
        value: "work:1"
    } ];

    Assert.equalValue( "Create rec.workId from unit", AdminIndex.createWorkId( xml, index ), indexOut );
    Repository.getSysRelationsOfType = undefined;
    Repository.hasObject = undefined;
} );

UnitTest.addFixture( "AdminIndex.createUnitId", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/870970-basis:29036640">' +
        '<isMemberOfUnit xmlns="info:fedora/">unit:21839</isMemberOfUnit>' +
        '<isPrimaryBibObjectFor xmlns="info:fedora/">unit:21839</isPrimaryBibObjectFor>' +
        '</rdf:Description></rdf:RDF>'
    );
    var indexOut = [ {
        name: "rec.unitId",
        value: "unit:21839"
    } ];

    Assert.equalValue( "Create rec.unitId", AdminIndex.createUnitId( xml, index ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/unit:21839">' +
        '<hasMemberOfUnit xmlns="info:fedora/">870970-basis:29036640</hasMemberOfUnit>' +
        '<hasPrimaryBibObject xmlns="info:fedora/">870970-basis:29036640</hasPrimaryBibObject>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    indexOut = [ {
        name: "rec.unitId",
        value: "unit:21839"
    } ];

    Assert.equalValue( "Create rec.unitId from unit", AdminIndex.createUnitId( xml, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createUnitPrimaryObject", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/870970-basis:29036640">' +
        '<isMemberOfUnit xmlns="info:fedora/">unit:21839</isMemberOfUnit>' +
        '<isPrimaryBibObjectFor xmlns="info:fedora/">unit:21839</isPrimaryBibObjectFor>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    var indexOut = [ {
        name: "unit.primaryObject",
        value: "870970-basis:29036640"
    } ];

    Assert.equalValue( "Create unit.primaryObject", AdminIndex.createUnitPrimaryObject( xml, index ), indexOut );

    index = Index.newIndex( );
    xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/unit:21839">' +
        '<hasMemberOfUnit xmlns="info:fedora/">870970-basis:29036640</hasMemberOfUnit>' +
        '<hasPrimaryBibObject xmlns="info:fedora/">870970-basis:29036640</hasPrimaryBibObject>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    indexOut = [ {
        name: "unit.primaryObject",
        value: "870970-basis:29036640"
    } ];

    Assert.equalValue( "Create unit.primaryObject from unit", AdminIndex.createUnitPrimaryObject( xml, index ), indexOut );


} );
UnitTest.addFixture( "AdminIndex.createUnitIsPrimaryObject", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/870970-basis:29036640">' +
        '<isMemberOfUnit xmlns="info:fedora/">unit:21839</isMemberOfUnit>' +
        '<isPrimaryBibObjectFor xmlns="info:fedora/">unit:21839</isPrimaryBibObjectFor>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    var indexOut = [ {
        name: "unit.isPrimaryObject",
        value: "true"
    } ];

    Assert.equalValue( "Create unit.isPrimaryObject for primary", AdminIndex.createUnitIsPrimaryObject( xml, index ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
        '<rdf:Description rdf:about="info:fedora/870970-basis:29036640">' +
        '<isMemberOfUnit xmlns="info:fedora/">unit:21839</isMemberOfUnit>' +
        '</rdf:Description>' +
        '</rdf:RDF>'
    );
    indexOut = [ {
        name: "unit.isPrimaryObject",
        value: "false"
    } ];

    Assert.equalValue( "Create unit.isPrimaryObject for non-primary", AdminIndex.createUnitIsPrimaryObject( xml, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createRecCollectionIdentifier", function( ) {

    var index = Index.newIndex();
    var localDataList = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
        '<adminData>' +
        '<creationDate>2008-02-14</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>online</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '<collectionIdentifier>150021-bibliotek</collectionIdentifier>' +
        '<collectionIdentifier>150021-skole</collectionIdentifier>' +
	    '</adminData>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "rec.collectionIdentifier",
        value: "870970-basis"
    }, {
        name: "rec.collectionIdentifier",
        value: "150021-bibliotek"
    }, {
        name: "rec.collectionIdentifier",
        value: "150021-skole"
    } ];

    Assert.equalValue( "Create rec.collectionIdentifier",
        AdminIndex.createRecCollectionIdentifier( localDataList, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createRecId", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '\
        <ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
        xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
        xmlns:ting="http://www.dbc.dk/ting">\
            <dkabm:record>\
                <ac:identifier>28737971|870970</ac:identifier>\
            </dkabm:record>\
            <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
                <marcx:record format="danMARC2" type="Bibliographic">\
                    <marcx:datafield ind1="0" ind2="0" tag="001">\
                        <marcx:subfield code="a">28737971</marcx:subfield>\
                        <marcx:subfield code="b">870970</marcx:subfield>\
                        <marcx:subfield code="c">20110502180936</marcx:subfield>\
                        <marcx:subfield code="d">20110411</marcx:subfield>\
                        <marcx:subfield code="f">a</marcx:subfield>\
                    </marcx:datafield>\
                </marcx:record>\
            </marcx:collection>\
        </ting:container>' );

    var pid = "870970-basis:28737971";
    var solrId = "870970-basis:28737971-775100-katalog";

    var libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) {
            if ( agencyId === "775100" ) {
                return true;
            }
        }
    };

    var indexOut = [ {
        name: "rec.id",
        value: "28737971|870970"
    }, {
        name: "rec.id",
        value: "870970-basis:28737971"
    }, {
        name: "rec.id",
        value: "870970-basis:28737971-775100-katalog"
    }, {
        name: "rec.id",
        value: "775100-katalog:28737971"
    } ];

    Assert.equalValue( "Create rec.id for basis record with local data from library", AdminIndex.createRecId( xml, pid, index, solrId, libraryRuleHandlerMock ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '\
        <ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
        xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
        xmlns:ting="http://www.dbc.dk/ting">\
            <dkabm:record>\
                <ac:identifier>28737971|870970</ac:identifier>\
            </dkabm:record>\
            <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
                <marcx:record format="danMARC2" type="Bibliographic">\
                    <marcx:datafield ind1="0" ind2="0" tag="001">\
                        <marcx:subfield code="a">28737971</marcx:subfield>\
                        <marcx:subfield code="b">870970</marcx:subfield>\
                        <marcx:subfield code="c">20110502180936</marcx:subfield>\
                        <marcx:subfield code="d">20110411</marcx:subfield>\
                        <marcx:subfield code="f">a</marcx:subfield>\
                    </marcx:datafield>\
                </marcx:record>\
            </marcx:collection>\
        </ting:container>' );

    pid = "870970-basis:28737971";
    solrId = "870970-basis:28737971-870970-basis";

    libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) {
            if ( agencyId === "870970" ) {
                return false;
            }
        }
    };

    indexOut = [ {
        name: "rec.id",
        value: "28737971|870970"
    }, {
        name: "rec.id",
        value: "870970-basis:28737971"
    }, {
        name: "rec.id",
        value: "870970-basis:28737971-870970-basis"
    } ];

    Assert.equalValue( "Create rec.id for basis record", AdminIndex.createRecId( xml, pid, index, solrId, libraryRuleHandlerMock ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '\
        <ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
        xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
        xmlns:ting="http://www.dbc.dk/ting">\
            <dkabm:record>\
                <ac:identifier>630-01A2|150046</ac:identifier>\
            </dkabm:record>\
        </ting:container>' );

    pid = "150046-arkibas:630-01A2";
    solrId = "150046-arkibas:630-01A2-150046-arkibas";

    libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) {
            if ( agencyId === "150046" ) {
                return false;
            }
        }
    };

    indexOut = [ {
        name: "rec.id",
        value: "630-01A2|150046"
    }, {
        name: "rec.id",
        value: "150046-arkibas:630-01A2"
    }, {
        name: "rec.id",
        value: "150046-arkibas:630-01A2-150046-arkibas"
    } ];

    Assert.equalValue( "Create rec.id for record with hyphen as part of record identifier",
        AdminIndex.createRecId( xml, pid, index, solrId, libraryRuleHandlerMock ), indexOut );


} );

UnitTest.addFixture( "AdminIndex.createRecBibliographicRecordId", function( ) {

    var pid = "870970-basis:23645564";
    var index = Index.newIndex();

    var indexOut = [ { name: "rec.bibliographicRecordId", value: "23645564"} ];

    Assert.equalValue( "Create rec.bibliographicRecordId",
        AdminIndex.createRecBibliographicRecordId( pid, index ), indexOut );


    pid = "150046-arkibas:630-01A2";
    index = Index.newIndex();

    indexOut = [ { name: "rec.bibliographicRecordId", value: "630-01A2"} ];

    Assert.equalValue( "Create rec.bibliographicRecordId for record with hyphen as part of record identifier",
        AdminIndex.createRecBibliographicRecordId( pid, index ), indexOut );


    pid = "830380-katalog:AAR0182395__12";
    index = Index.newIndex();

    indexOut = [ { name: "rec.bibliographicRecordId", value: "AAR0182395" } ];

    Assert.equalValue( "Create rec.bibliographicRecordId for record with underscores as part of record pid",
        AdminIndex.createRecBibliographicRecordId( pid, index ), indexOut );

} );


UnitTest.addFixture( "AdminIndex.createRecCreatedDate", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
    <marcx:record type="Bibliographic">\
        <marcx:datafield tag="001">\
          <marcx:subfield code="d">20140812</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
</ting:container>\
');

    var indexOut = [ {
        name: "rec.createdDate",
        value: "2014-08-12T00:00:00Z"
    } ];

    Assert.equalValue( "Create rec.createdDate", AdminIndex.createRecCreatedDate( xml, index ), indexOut );


    index = Index.newIndex();

    xml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
    <marcx:record type="Bibliographic">\
        <marcx:datafield tag="001">\
          <marcx:subfield code="d">201</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
</ting:container>\
');

    indexOut = [ ];

    Assert.equalValue( "Create no rec.createdDate", AdminIndex.createRecCreatedDate( xml, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createRecModifiedDate", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
    <marcx:record type="Bibliographic">\
        <marcx:datafield tag="001">\
          <marcx:subfield code="c">20100611153141</marcx:subfield>\
          <marcx:subfield code="c">20141205</marcx:subfield>\
          <marcx:subfield code="d">20140812</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
</ting:container>\
');

    var indexOut = [ {
        name: "rec.modifiedDate",
        value: "2010-06-11T00:00:00Z"
    } ];

    Assert.equalValue( "Create rec.modifiedDate", AdminIndex.createRecModifiedDate( xml, index ), indexOut );

    index = Index.newIndex();

    xml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
    <marcx:record type="Bibliographic">\
        <marcx:datafield tag="001">\
          <marcx:subfield code="c">20100032153141</marcx:subfield>\
          <marcx:subfield code="c">20141205</marcx:subfield>\
          <marcx:subfield code="d">20140812</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
</ting:container>\
');

    indexOut = [ {
        name: "rec.modifiedDate",
        value: "2010-01-01T00:00:00Z"
    } ];

    Assert.equalValue( "Create rec.modifiedDate with corrected date", AdminIndex.createRecModifiedDate( xml, index ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
    <marcx:record type="Bibliographic">\
        <marcx:datafield tag="001">\
          <marcx:subfield code="c">201</marcx:subfield>\
          <marcx:subfield code="d">20140812</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
</ting:container>\
');

    indexOut = [];
    Assert.equalValue( "Create rec.modifiedDate with invalid date", AdminIndex.createRecModifiedDate( xml, index ), indexOut );




} );

UnitTest.addFixture( "AdminIndex.createRecModifiedDate", function( ) {

    var index = Index.newIndex( );

    var xml = XmlUtil.fromString( '<ting:container xmlns:marcx="info:lc/xmlns/marcxchange-v1" \
    xmlns:ting="http://www.dbc.dk/ting">\
<marcx:collection>\
    <marcx:record format="danMARC2" type="Bibliographic">\
        <marcx:leader>00000n    2200000   4500</marcx:leader>\
        <marcx:datafield ind1="0" ind2="0" tag="001">\
            <marcx:subfield code="a">06985319</marcx:subfield>\
            <marcx:subfield code="b">870970</marcx:subfield>\
            <marcx:subfield code="c">20050822090028</marcx:subfield>\
            <marcx:subfield code="d">19900109</marcx:subfield>\
            <marcx:subfield code="f">a</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
    <marcx:record format="danMARC2" type="BibliographicMain">\
        <marcx:leader>00000c    2200000   4500</marcx:leader>\
        <marcx:datafield ind1="0" ind2="0" tag="001">\
            <marcx:subfield code="a">50426254</marcx:subfield>\
            <marcx:subfield code="b">870970</marcx:subfield>\
            <marcx:subfield code="c">20121101151853</marcx:subfield>\
            <marcx:subfield code="d">19900109</marcx:subfield>\
            <marcx:subfield code="f">a</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
    <marcx:record format="danMARC2" type="BibliographicVolume">\
        <marcx:leader>00000n    2200000   4500</marcx:leader>\
        <marcx:datafield ind1="0" ind2="0" tag="001">\
            <marcx:subfield code="a">06985319</marcx:subfield>\
            <marcx:subfield code="b">870970</marcx:subfield>\
            <marcx:subfield code="c">20050822090028</marcx:subfield>\
            <marcx:subfield code="d">19900109</marcx:subfield>\
            <marcx:subfield code="f">a</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record>\
</marcx:collection>\
<adminData>\
    <recordStatus>active</recordStatus>\
    <creationDate>2005-03-01</creationDate>\
    <libraryType>none</libraryType>\
    <indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType>\
    <genre>nonfiktion</genre>\
    <workType>literature</workType>\
    <collectionIdentifier>870970-basis</collectionIdentifier>\
</adminData></ting:container>' );

    var indexOut = [ {
        name: "rec.modifiedDate",
        value: "2005-08-22T00:00:00Z"
    } ];

    Assert.equalValue( "Create rec.modifiedDate from multivolume record", AdminIndex.createRecModifiedDate( xml, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createRecModifiedDate", function( ) {

    var index = Index.newIndex( );

    var xml = XmlUtil.fromString( '\
    <ting:container xmlns:ting="http://www.dbc.dk/ting">\
      <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\\n\
        <marcx:record type="Bibliographic">\
            <marcx:datafield tag="001">\
              <marcx:subfield code="d">20140812</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
      </marcx:collection>\
    </ting:container>\
' );

    var indexOut = [ {
        name: "rec.modifiedDate",
        value: "2014-08-12T00:00:00Z"
    } ];

    Assert.equalValue( "Create rec.modifiedDate no 001c", AdminIndex.createRecModifiedDate( xml, index ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 1", function( ) {

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return false; } };
    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '\
    <ting:container xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:ac="http://biblstandard.dk/ac/namespace/">\
        <dkabm:record>\
            <ac:identifier>50776360|870970</ac:identifier>\
        </dkabm:record>\
        <adminData>\
            <collectionIdentifier>870970-basis</collectionIdentifier>\
            <collectionIdentifier>150021-bibliotek</collectionIdentifier>\
            <collectionIdentifier>150021-fjern</collectionIdentifier>\
        </adminData>\
    </ting:container>\
' );

    var indexOut = [ {
        name: "rec.childDocId",
        value: "870970-basis:50776360"
    }, {
        name: "rec.childDocId",
        value: "150021-bibliotek"
    }, {
        name: "rec.childDocId",
        value: "150021-fjern"
    } ];

    Assert.equalValue( "Create childDocId from BASIS (870970) record",
        AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 2", function( ) {

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return false; } };
    var index = Index.newIndex( );

    var xml = XmlUtil.fromString( '\
    <ting:container xmlns:ting="http://www.dbc.dk/ting">\
      <adminData>\
        <collectionIdentifier>150014-album</collectionIdentifier>\
      </adminData>\
      <dkabm:record xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
      xmlns:ac="http://biblstandard.dk/ac/namespace/" >\
        <ac:identifier>00000000007|150014</ac:identifier>\
      </dkabm:record>\
    </ting:container>\
' );

    var indexOut = [ {
        name: "rec.childDocId",
        value: "150014-album"
    } ];
    Assert.equalValue( "Create childDocId from source that is not a library",
        AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 3", function( ) {

    var libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) {
            if ( agencyId === "723000" ) {
                return true;
            }
        }
    };
    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '\
    <ting:container xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:ac="http://biblstandard.dk/ac/namespace/">\
        <dkabm:record>\
            <ac:identifier>50776360|723000</ac:identifier>\
        </dkabm:record>\
        <adminData>\
            <collectionIdentifier>723000-katalog</collectionIdentifier>\
        </adminData>\
    </ting:container>\
' );

    var indexOut = [ {
        name: "rec.childDocId",
        value: "723000-katalog:50776360"
    } ];
    Assert.equalValue( "Create childDocId from public library",
        AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 4", function( ) {
    
    var libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) { 
            if( agencyId === "300580" ) {
                return true;
            } 
        } 
    };
    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '\
    <ting:container \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:ac="http://biblstandard.dk/ac/namespace/">\
        <dkabm:record>\
            <ac:identifier>50776360|300580</ac:identifier>\
        </dkabm:record>\
        <adminData>\
            <collectionIdentifier>300580-katalog</collectionIdentifier>\
            <collectionIdentifier>870970-skole</collectionIdentifier>\
        </adminData>\
    </ting:container>\
');

    var indexOut = [ {
        name: "rec.childDocId",
        value: "300580-katalog:50776360"
    }, {
        name: "rec.childDocId",
        value: "870970-skole:50776360"
    } ];
    Assert.equalValue( "Create childDocId from school library",
        AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 5", function( ) {

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return false; } };
    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '\
    <ting:container xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:ac="http://biblstandard.dk/ac/namespace/">\
        <dkabm:record>\
            <ac:identifier>50776360|860980</ac:identifier>\
        </dkabm:record>\
        <adminData>\
            <collectionIdentifier>860980-katalog</collectionIdentifier>\
            <collectionIdentifier>870970-forsk</collectionIdentifier>\
        </adminData>\
    </ting:container>\
' );
    var indexOut = [ {
        name: "rec.childDocId",
        value: "860980-katalog"
    }, {
        name: "rec.childDocId",
        value: "870970-forsk"
    } ];
    Assert.equalValue( "Create childDocId from research library",
        AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.createChildDocId 6", function() {

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return false; } };
    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '\
<ting:container xmlns:marcx="info:lc/xmlns/marcxchange-v1" \
xmlns:ting="http://www.dbc.dk/ting" \
xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:ac="http://biblstandard.dk/ac/namespace/">\
    <dkabm:record>\
        <ac:identifier>50776360|870970</ac:identifier>\
    </dkabm:record>\
    <marcx:collection>\
        <marcx:record format="danMARC2" type="Bibliographic">\
            <marcx:datafield ind1="0" ind2="0" tag="002">\
                <marcx:subfield code="a">09234039</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
    </marcx:collection>\
    <adminData>\
        <collectionIdentifier>870970-basis</collectionIdentifier>\
        <collectionIdentifier>150021-bibliotek</collectionIdentifier>\
        <collectionIdentifier>150021-fjern</collectionIdentifier>\
    </adminData>\
</ting:container>\
' );

    var indexOut = [ {
        name: "rec.childDocId",
        value: "870970-basis:50776360"
    }, {
        name: "rec.childDocId",
        value: "870970-basis:09234039"
    }, {
        name: "rec.childDocId",
        value: "150021-bibliotek"
    }, {
        name: "rec.childDocId",
        value: "150021-fjern"
    } ];
    Assert.equalValue( "Create childDocId from 002a", AdminIndex.createChildDocId( xml, index, libraryRuleHandlerMock ), indexOut );

} );

UnitTest.addFixture( "AdminIndex.__makeDate", function(){
    Log.debug("UnitTest makeDate");
    var input = "2016";
    var output = "2016-01-01T00:00:00Z";

    Assert.equalValue("makeDate with only year given", AdminIndex.__makeDate( input ), output );

    input = "20";
    output = "";

    Assert.equalValue("return empty string if no date given", AdminIndex.__makeDate( input ), output );


    input = "20160131";
    output = "2016-01-31T00:00:00Z";

    Assert.equalValue("makeDate with valid date", AdminIndex.__makeDate( input ), output );

    input = "20150229";
    output = "2015-03-01T00:00:00Z";

    Assert.equalValue("makeDate with invalid date", AdminIndex.__makeDate( input ), output );

    input = "20100611153141";
    output = "2010-06-11T00:00:00Z";
    Assert.equalValue("makeDate with input date specified down to seconds", AdminIndex.__makeDate( input ), output );








});

