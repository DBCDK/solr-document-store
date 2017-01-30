use( "TermIndex" );
use( "UnitTest" );
use( "Index" );
use( "XmlNamespaces" );
use( "XmlUtil" );
use( "MarcUtility" );

UnitTest.addFixture( "TermIndex.createReviewFields", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Foerst forsvinder Toru Okadas kat, dernaest hans kone Kumiko</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>635 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '<dc:source>Nejimaki-dori kuronikure</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Japan</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '</dkabm:record>' +
        '</ting:container>');

    var xmlReview = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>86304155|870971</ac:identifier>' +
        '<ac:source>Anmeldelser</ac:source>' +
        '<dc:title>Anmeldelse</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anmeldelse</dc:title>' +
        '<dc:creator>Jon Helt Haarder</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Haarder, Jon Helt</dc:creator>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:date>2001</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dcterms:extent>Sektion 1, s. 10</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:isPartOf>Jyllands-posten, 2001-06-22</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0109-1182</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.reviewedCreator",
        value: "Haruki Murakami"
    }, {
        name: "term.reviewedTitle",
        value: "Traekopfuglens kroenike"
    }, {
        name: "term.reviewedPublisher",
        value: "Klim"
    }, {
        name: "term.reviewedIdentifier",
        value: "87-7724-857-0"
    }, {
        name: "term.subject",
        value: "Traekopfuglens kroenike"
    }, {
        name: "term.reviewer",
        value: "Jon Helt Haarder"
    } ];

    Assert.equalValue( "Create term index fields for review", TermIndex.createReviewFields( index, xmlReview, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewFieldsDkabm", function( ) {

    var index = Index.newIndex( );
    var reviewXml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>96744|150005</ac:identifier>' +
        '<ac:source>Litteratursiden</ac:source>' +
        '<dc:title>Anmeldelse af: Himlen er over os alle</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anmeldelse af: Himlen er over os alle</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Jan Faerk</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Faerk, Jan</dc:creator>' +
        '<dc:subject>Paul Bowles</dc:subject>' +
        '<dc:subject>Under himlens daekke</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Litteratursiden</dc:publisher>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dc:identifier xsi:type="dcterms:URI">http://www.litteratursiden.dk/?q=node/96744</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:references xsi:type="dkdcplus:ISBN">9788700837263</dcterms:references>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.reviewedCreator",
        value: "Paul Bowles"
    }, {
        name: "term.reviewedTitle",
        value: "Under himlens daekke"
    }, {
        name: "term.reviewedIdentifier",
        value: "9788700837263"
    }, {
        name: "term.subject",
        value: "Under himlens daekke"
    }, {
        name: "term.reviewer",
        value: "Jan Faerk"
    }
    ];

    Assert.equalValue( "Create Term Index fields for review when the reviewed work is not available",
        TermIndex.createReviewFieldsDkabm( index, reviewXml ), indexOut )
});


UnitTest.addFixture( "TermIndex.createCreator", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
       '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
       'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
       'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
       'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
       'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
       'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
       '<dkabm:record>' +
       '<dc:creator xsi:type="dkdcplus:drt">Adam Elliot</dc:creator>' +
       '<dc:creator xsi:type="oss:sort">Elliot, Adam</dc:creator>' +
       '<dc:contributor>Adam Elliot</dc:contributor>' +
       '</dkabm:record>' +
       '</ting:container>'
    );

    var expected = [ {
        name: "term.creator",
        value: "Adam Elliot"
    }, {
        name: "term.creator",
        value: "Elliot, Adam"
    }, {
        name: "term.creator",
        value: "Adam Elliot"
    } ];

    var actual = TermIndex.createCreator( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.creator", actual, expected );

} );

UnitTest.addFixture( "TermIndex.createMainCreator", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:creator xsi:type="dkdcplus:drt">Adam Elliot</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Elliot, Adam</dc:creator>' +
        '<dc:contributor>Sam Raimi</dc:contributor>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.mainCreator",
        value: "Adam Elliot"
    }, {
        name: "term.mainCreator",
        value: "Elliot, Adam"
    } ];

    Assert.equalValue( "Create term.mainCreator from DKABM", TermIndex.createMainCreator( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createMainCreator", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:creator xsi:type="dkdcplus:aut">Bruce Peter</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Peter, Bruce</dc:creator>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var record = new Record( );
    record.fromString(
        '100 00 *aPeter *hBruce *4aut\n'
    );

    var indexOut = [ {
        name: "term.mainCreator",
        value: "Peter"
    }, {
        name: "term.mainCreator",
        value: "Bruce"
    }, {
        name: "term.mainCreator",
        value: "aut"
    } ];

    Assert.equalValue( "Create term.mainCreator from MARC", TermIndex.createMainCreator( index, xml, record ), indexOut );

} );

UnitTest.addFixture( "TermIndex.cleanDataForCreator", function( ) {

    var value = "de russiske tekster er skrevet af Elena Filatova";
    var expected = "Elena Filatova";

    Assert.equalValue( "Clean data for creator (Scandinavian)", TermIndex.cleanDataForCreator( value ), expected );

    value = "eingeleitet und fuer die deutsche Ausgabe eingerichtet von Hartmut Mehringer";
    expected = "Hartmut Mehringer";

    Assert.equalValue( "Clean data for creator (German)", TermIndex.cleanDataForCreator( value ), expected );

    value = "produced by Carolyn Pfeiffer and Mike Kaplan";
    expected = "Carolyn Pfeiffer and Mike Kaplan";

    Assert.equalValue( "Clean data for creator (English)", TermIndex.cleanDataForCreator( value ), expected );

    value = "produit par Luc Dery, Kim McCraw... et al.";
    expected = "Luc Dery, Kim McCraw";

    Assert.equalValue( "Clean data for creator (French) 1", TermIndex.cleanDataForCreator( value ), expected );

    value = "chef operateur Luc Dery, Kim McCraw";
    expected = "Luc Dery, Kim McCraw";

    Assert.equalValue( "Clean data for creator (French) 2", TermIndex.cleanDataForCreator( value ), expected );

} );

UnitTest.addFixture( "TermIndex.createCategory", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >' +
        '<dkabm:record>' +
        '<dcterms:audience xsi:type="dkdcplus:medieraad">Maerkning: Tilladt for boern over 15 aar</dcterms:audience>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.category",
        value: "voksenmaterialer"
    } ];

    Assert.equalValue( "Create term.category (voksenmaterialer)", TermIndex.createCategory( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createLiteraryForm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
            '<ac:identifier>29392358|870970</ac:identifier>' +
            '<ac:source>Bibliotekskatalog</ac:source>' +
            '<dc:title>Princess</dc:title>' +
            '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
            '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
            '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
            '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
            '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
            '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
            '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
            '<dc:language>Dansk</dc:language>' +
            '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
            '<adminData>' +
            '<genre>fiktion</genre>' +
            '</adminData>' +
        '</ting:container>' );


    var expected = [ {
        name: "term.literaryForm",
        value: "fiktion"
    } ];

    var actual = TermIndex.createLiteraryForm( index, xml );

    Assert.equalValue( "Create term.literaryForm (fiktion)", actual, expected );

    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="j">p</marcx:subfield>' +
        '</marcx:datafield>'+
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<genre>fiktion</genre>' +
        '</adminData>' +
        '</ting:container>' );

    expected = [ {
        name: "term.literaryForm",
        value: "fiktion"
    }, {
        name: "term.literaryForm",
        value: "digte"
    } ];

    actual = TermIndex.createLiteraryForm( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.literaryForm (digte)", actual, expected );


    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>12345678|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Lucky Luke</dc:title>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Tegneserie</dc:type>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '</marcx:datafield>'+
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<genre>fiktion</genre>' +
        '</adminData>' +
        '</ting:container>' );

    expected = [ {
        name: "term.literaryForm",
        value: "fiktion"
    }, {
        name: "term.literaryForm",
        value: "tegneserier"
    } ];

    actual = TermIndex.createLiteraryForm( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equal( "Create term.literaryForm (tegneserier)", actual, expected );

} );

UnitTest.addFixture( "TermIndex.createNationality", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> ' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="u">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Dansk tale</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Undertekster p engelsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection></ting:container>' );

    var expected = [ {
        name: "term.nationality",
        value: "danske film"
    } ];

    var actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.nationality (dansk) based on 508a", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>28832826|870970</ac:identifier>' +
        '<dc:title>Trof-fruen</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Trof-fruen</dc:title>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">fabrikker</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">komedier</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">komedier</dc:subject>' +
        '<dc:language xsi:type="dcterms:ISO639-2">fre</dc:language>' +
        '<dc:language>Fransk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">nor</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">swe</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">fin</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">fre</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">fre</marcx:subfield>' +
        '<marcx:subfield code="u">dan</marcx:subfield>' +
        '<marcx:subfield code="u">nor</marcx:subfield>' +
        '<marcx:subfield code="u">swe</marcx:subfield>' +
        '<marcx:subfield code="u">fin</marcx:subfield><' +
        '/marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Fransk tale</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Undertekster p dansk, norsk, svensk og finsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="i">Medvirkende</marcx:subfield>' +
        '<marcx:subfield code="e">Catherine Deneuve, Gérard Depardieu, Fabrice Luchini, Karin Viard, Judith Godrèche, Jérémie Rénier ... et al.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Originalfilmen: Frankrig : Mandarin Cinéma : en coproduction avec FOZ ... et al., 2010</marcx:subfield></marcx:datafield>' +
        '</marcx:record></marcx:collection>' +
        '</ting:container>');

    expected = [ {
        name: "term.nationality",
        value: "franske film"
    } ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.nationality (fransk) based on  508 and dc:subject 77.7", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29257108|870970</ac:identifier>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">drama</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">krimi</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">krimi</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">kvinder</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">livvagter</dc:subject>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">rus</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Russisk tale, ingen undertekster</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection></ting:container>');

    expected = [ {
        name: "term.nationality",
        value: "russiske film"
    } ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.nationality (russisk) fra 504", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>28854560|870970</ac:identifier>' +
        '<ac:source>basis</ac:source>' +
        '<dc:title>Himlen over Berlin</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Himlen over Berlin</dc:title>'+
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>'+
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">mul</marcx:subfield>' +
        '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">eng</marcx:subfield><marcx:subfield code="a">ger</marcx:subfield>' +
        '<marcx:subfield code="u">dan</marcx:subfield><marcx:subfield code="u">nor</marcx:subfield>' +
        '<marcx:subfield code="u">fin</marcx:subfield><marcx:subfield code="u">swe</marcx:subfield>' +
        '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="508"><marcx:subfield code="a">Tysk og engelsk tale</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Undertekster p dansk, norsk, finsk og svensk</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record></marcx:collection></ting:container>');

    expected = [ {
        name: "term.nationality",
        value: "tyske film"
    } ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.nationality (tysk) based on 508 and dc:subject DK5 77.7", actual, expected );


    index = Index.newIndex();

    xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record><ac:identifier>51018664|870970</ac:identifier>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">amerikanske film</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>');

    expected = [ {
        name: "term.nationality",
        value: "amerikanske film"
    } ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.nationality (amerikanske film) from DBCO", actual, expected );

    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/"' +
        ' xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/"' +
        ' xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/"' +
        ' xmlns:ting="http://www.dbc.dk/ting"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">spillefilm</dc:subject>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Engelsk tale med undertekster paa dansk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Produktion: Mission from Buddha Productions (USA), 2007</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>'+
        '</ting:container>');


    expected = [ {
        name: "term.nationality",
        value: "amerikanske film"
    } ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ));

    Assert.equalValue( "Do not create term.nationality from dc:subjects DBCO", actual, expected );


    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/"' +
        ' xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/"' +
        ' xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/"' +
        ' xmlns:ting="http://www.dbc.dk/ting"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:DK5">39.1</dc:subject>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>'+
        '</ting:container>');

    expected = [ ];

    actual = TermIndex.createNationality( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ));

    Assert.equalValue( "Do not create term.nationality when dk5 does not match", actual, expected );


} );


UnitTest.addFixture( "TermIndex.createDate", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<ac:source>basis</ac:source><dc:title>Praeludium for klaver, bind 1 (uddrag)</dc:title>' +
        '<dc:source>Original title</dc:source><dcterms:alternative>14 preludes pour piano</dcterms:alternative>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dcterms:abstract>Damiel forelsker sig i cirkus-artisten Marion</dcterms:abstract>' +
        '<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</dc:description>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:contributor>Wim Wenders </dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.date",
        value: "2009"
    } ];

    Assert.equalValue( "Create term.Date from dc.Date", TermIndex.createDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createIdentifier", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<ac:source>basis</ac:source>' +
        '<dc:title>Dummy</dc:title>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-88873-45-5</dc:identifier>' +
        '<dc:identifier>type less identifier</dc:identifier>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">nor</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.identifier",
        value: "8788873455"
    }, {
        name: "term.identifier",
        value: "87-88873-45-5"
    }, {
        name: "term.identifier",
        value: "type less identifier"
    } ];

    Assert.equalValue( "Create term.identifier from dc.identifier", TermIndex.createIdentifier( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>305521|150012</ac:identifier>' +
        '<ac:source>Store Danske</ac:source>' +
        '<dc:title>Finanspagten</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Finanspagten</dc:title>' +
        '<dc:subject>Samfund, jura og politik</dc:subject>' +
        '<dc:subject>EU</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">leksikonartikel</dc:subject>' +
        '<dcterms:abstract>Treaty on Stability, Coordination and Governance</dcterms:abstract>' +
        '<dc:description>Siden opdateret: 2012-03-02</dc:description>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Gyldendal</dc:publisher>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Artikel</dc:type>' +
        '<dc:identifier xsi:type="dcterms:URI">http://www.denstoredanske.dk/Samfund,_jura_og_politik/EU/Finanspagten</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:isPartOf>Den Store Danske - Gyldendals aabne encyklopaedi</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "term.identifier",
        value: "http://www.denstoredanske.dk/Samfund,_jura_og_politik/EU/Finanspagten"
    } ];

    Assert.equalValue( "Create term.identifier from dc.identifier type URI", TermIndex.createIdentifier( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createIsbn", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<dc:title>Dummy</dc:title>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-88873-45-5</dc:identifier>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dcterms:abstract>Damiel forelsker sig i cirkus-artisten Marion</dcterms:abstract>' +
        '<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion</dc:description>' +
        '<dc:contributor>Wim Wenders </dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:format>1 dvd-video, sort-hvid og farve</dc:format><dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language><dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.isbn",
        value: "8788873455"
    }, {
        name: "term.isbn",
        value: "87-88873-45-5"
    } ];

    Assert.equalValue( "Create term.isbn from dc.identifier", TermIndex.createIsbn( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createPublisher", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<dc:title>Himlen over Berlin</dc:title>' +
        '<dcterms:abstract>Damiel forelsker sig i cirkus-artisten Marion</dcterms:abstract>' +
        '<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</dc:description>' +
        '<dc:publisher>Forlag</dc:publisher>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:contributor>Wim Wenders</dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28854560</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20110815180554</marcx:subfield><marcx:subfield code="d">20110629</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2009</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="l">mul</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">m</marcx:subfield><marcx:subfield code="g">th</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Himlen over Berlin</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="i">I kolofonen: Originaltitel</marcx:subfield>' +
        '<marcx:subfield code="t">Der ¤Himmel über Berlin</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var expected = [ {
        name: "term.publisher",
        value: "Forlag"
    }, {
        name: "term.publisher",
        value: "Sandrew Metronome"
    } ];

    var actual = TermIndex.createPublisher( index, xml );

    Assert.equalValue( "Create term.publisher from dc.publisher", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<ac:identifier>DBB0019049|784600</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Guldregn</dc:title>' +
        '<dc:publisher>Nota</dc:publisher>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000c    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">DBB0019049</marcx:subfield>' +
        '<marcx:subfield code="b">784600</marcx:subfield>' +
        '<marcx:subfield code="c">20091019134658</marcx:subfield>' +
        '<marcx:subfield code="d">20091019</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '<marcx:subfield code="o">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var record = MarcUtility.createRecordObjectFromIndexingData( xml );

    expected = [ {
        name: "term.publisher",
        value: "Nota"
    }, {
        name: "term.publisher",
        value: "DBBNOTA"
    } ];

    actual = TermIndex.createPublisher( index, xml, record );

    Assert.equalValue( "Create term.publisher value DBBNOTA from dc.publisher", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<ac:identifier>DBB0019049|874310</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Guldregn</dc:title>' +
        '<dc:publisher>Gyldendal</dc:publisher>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000c    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">DBB0019049</marcx:subfield>' +
        '<marcx:subfield code="b">874310</marcx:subfield>' +
        '<marcx:subfield code="c">20091019134658</marcx:subfield>' +
        '<marcx:subfield code="d">20091019</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '<marcx:subfield code="o">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    record = MarcUtility.createRecordObjectFromIndexingData( xml );

    expected = [ {
        name: "term.publisher",
        value: "Gyldendal"
    }, {
        name: "term.publisher",
        value: "DBBNOTA"
    } ];

    actual = TermIndex.createPublisher( index, xml, record );

    Assert.equalValue( "Create term.publisher value DBBNOTA from submitter", actual, expected );


} );


UnitTest.addFixture( "TermIndex.createAcSource", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Praeludium for klaver, bind 1 (uddrag)</dc:title>' +
        '<dc:source>Original title</dc:source>' +
        '<dcterms:alternative>14 preludes pour piano</dcterms:alternative>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dcterms:abstract>Damiel er en af englene</dcterms:abstract>' +
        '<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</dc:description>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:contributor>Wim Wenders </dc:contributor>' +
        '<dc:contributor>Henri Alekan </dc:contributor>' +
        '<dc:contributor>Peter Handke </dc:contributor>' +
        '<dc:contributor xsi:type="dkdcplus:act">Bruno Ganz</dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type><dc:format>1 dvd-video, sort-hvid og farve</dc:format>' +
        '<dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial></dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.acSource",
        value: "Bibliotekskatalog"
    } ];

    Assert.equalValue( "Create term.acsource from ac.source", TermIndex.createAcSource( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createSource", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Praeludium for klaver, bind 1 (uddrag)</dc:title>' +
        '<dc:source>Original title</dc:source>' +
        '<dcterms:alternative>14 preludes pour piano</dcterms:alternative>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:contributor>Wim Wenders </dc:contributor>' +
        '<dc:contributor>Henri Alekan </dc:contributor>' +
        '<dc:contributor>Peter Handke </dc:contributor>' +
        '<dc:contributor xsi:type="dkdcplus:act">Bruno Ganz</dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:format>1 dvd-video, sort-hvid og farve</dc:format>' +
        '<dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">nor</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial>' +
        '</dkabm:record>' +
        '</ting:container>');

    var expected = [ {
        name: "term.source",
        value: "Original title"
    } ];

    Assert.equalValue( "Create term.source from dc.source", TermIndex.createSource( index, xml ), expected );

} );


UnitTest.addFixture( "TermIndex.createSubject", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dcterms:spatial>Rusland</dcterms:spatial>' +
        '</dkabm:record>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCM">1980-1989</dcterms:temporal>' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">pornografi</marcx:subfield></marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">praester</marcx:subfield></marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">selvtaegt</marcx:subfield></marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>');

    var expected = [ {
        name: "term.subject",
        value: "77.7"
    }, {
        name: "term.subject",
        value: "Spillefilm"
    }, {
        name: "term.subject",
        value: "pornografi"
    } ];

    //index field values from dkcclterm.em are copied by solr (see schema.xml)

    var actual = TermIndex.createSubject( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.subject new", actual, expected );

} );


UnitTest.addFixture( "TermIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23962527|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Praeludium for klaver, bind 1 (uddrag)</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Praeludium for klaver, bind 1 (uddrag)(Storstroms Kammerensemble)</dc:title>' +
        '<dcterms:alternative>14 preludes pour piano</dcterms:alternative>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">drama</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">engle</dc:subject>' +
        '<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion</dc:description>' +
        '<dc:publisher>Sandrew Metronome</dc:publisher>' +
        '<dc:contributor>Wim Wenders </dc:contributor>' +
        '<dc:contributor>Henri Alekan </dc:contributor>' +
        '<dc:contributor>Peter Handke </dc:contributor>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:format>1 dvd-video, sort-hvid og farve</dc:format>' +
        '<dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial>' +
        '</dkabm:record>' +
        '</ting:container>');

    var expected = [ {
        name: "term.title",
        value: "Praeludium for klaver, bind 1 (uddrag)"
    }, {
        name: "term.title",
        value: "Praeludium for klaver, bind 1 (uddrag)(Storstroms Kammerensemble)"
    }, {
        name: "term.title",
        value: "14 preludes pour piano"
    } ];

    var actual = TermIndex.createTitle( index, xml,MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.title", actual, expected );

} );


UnitTest.addFixture( "TermIndex.createMainTitle", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56 (Aimard)</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.mainTitle",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56"
     } ];

    Assert.equalValue( "Create term.mainTitle", TermIndex.createMainTitle( index, xml ), indexOut );

} );


UnitTest.addFixture( "TermIndex.createType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>28854560|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Himlen over Berlin</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Himlen over Berlin</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">The Wim Wenders collection</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Win Wenders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">drama</dc:subject>' +
        '<dc:date>2009</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '<dc:format>1 dvd-video, sort-hvid og farve</dc:format>' +
        '<dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dcterms:ISO639-2">eng</dc:language>' +
        '<dc:language>Engelsk</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>');

    var expected = [ {
        name: "term.type",
        value: "Dvd"
    } ];

    Assert.equalValue( "Create term.typeCategory", TermIndex.createType( index, xml ), expected );

} );

UnitTest.addFixture( "TermIndex.createTypeCategory", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>73128781|870971</ac:identifier>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Avisartikel</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">73128781</marcx:subfield>' +
        '<marcx:subfield code="b">870971</marcx:subfield>' +
        '<marcx:subfield code="c">19890511</marcx:subfield>' +
        '<marcx:subfield code="d">19890511</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '<marcx:subfield code="o">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">a</marcx:subfield>' +
        '<marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">1989</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="r">an</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>');

    var expected = [ {
        name: "term.typeCategory",
        value: "ana"
    } ];

    var actual = TermIndex.createTypeCategory( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.typeCategory ana", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
            '<marcx:subfield code="t">m</marcx:subfield>' +
            '<marcx:subfield code="u">r</marcx:subfield>' +
            '<marcx:subfield code="a">2001</marcx:subfield>' +
            '<marcx:subfield code="z">2003</marcx:subfield>' +
            '<marcx:subfield code="b">dk</marcx:subfield>' +
            '<marcx:subfield code="d">x</marcx:subfield>' +
            '<marcx:subfield code="j">f</marcx:subfield>' +
            '<marcx:subfield code="l">dan</marcx:subfield>' +
            '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>');

    expected = [ {
        name: "term.typeCategory",
        value: "mono"
    } ];

    actual = TermIndex.createTypeCategory( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.typeCategory mono (008t=m)", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<ac:identifier>29418489|870970</ac:identifier>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield>' +
        '<marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">j</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>');

    expected = [ {
        name: "term.typeCategory",
        value: "mono"
    } ];

    actual = TermIndex.createTypeCategory( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.typeCategory mono (008t=s)", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<ac:identifier>03940721|870970</ac:identifier>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (baand)</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">p</marcx:subfield>' +
        '<marcx:subfield code="u">c</marcx:subfield>' +
        '<marcx:subfield code="a">1984</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="c">q</marcx:subfield>' +
        '<marcx:subfield code="h">p</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>');

    expected = [ {
        name: "term.typeCategory",
        value: "peri"
    } ];

    actual = TermIndex.createTypeCategory( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.typeCategory peri (008t=p)", actual, expected );

} );


UnitTest.addFixture( "TermIndex.createTypeCategoryDkabm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>305521|150012</ac:identifier>' +
        '<ac:source>Store Danske</ac:source>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Artikel</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>');

    var expected = [ {
        name: "term.typeCategory",
        value: "mono"
    } ];

    var actual = TermIndex.createTypeCategoryDkabm( index, xml );

    Assert.equalValue( "Create term.typeCategory mono from DKABM", actual, expected );


} );


UnitTest.addFixture( "TermIndex.createAccessType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
            '<adminData>' +
                '<libraryType>none</libraryType>' +
                '<indexingAlias>danmarcxchange</indexingAlias>' +
                '<accessType>physical</accessType>' +
            '</adminData>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.accessType",
        value: "physical"
    } ];

    Assert.equalValue( "Create term.accessType (physical)", TermIndex.createAccessType( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
            '<adminData>' +
                '<libraryType>none</libraryType>' +
                '<indexingAlias>danmarcxchange</indexingAlias>' +
                '<accessType>online</accessType>' +
            '</adminData>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "term.accessType",
        value: "online"
    } ];

    Assert.equalValue( "Create term.accessType (online)", TermIndex.createAccessType( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createWorkType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '<dc:title>fantasi og hjerte</dc:title>' +
        '<dc:publisher>thomas blom av forlag</dc:publisher>' +
        '<dc:publisher>MATCHSTRING:thomas</dc:publisher>' +
        '<dc:contributor>MATCHSTRING:MllehaveH</dc:contributor>' +
        '<dc:contributor>MATCHSTRING:MllehaveJ</dc:contributor>' +
        '<dc:contributor>MATCHSTRING:BlomT</dc:contributor>' +
        '<dc:contributor>Herdis Mllehave</dc:contributor>' +
        '<dc:contributor>Johannes Mllehave</dc:contributor>' +
        '<dc:contributor>Thomas Blom</dc:contributor>' +
        '<dc:contributor>Thomas Blom</dc:contributor>' +
        '<dc:date>1995</dc:date>' +
        '<dc:type>Lydbog (baand)</dc:type>' +
        '<dc:type>WORK:literature</dc:type>' +
        '<dc:identifier>870970-basis:20982861</dc:identifier>' +
        '<dc:language>Dansk</dc:language>' +
        '</oai_dc:dc>');

    var indexOut = [ {
            name: "term.workType",
            value: "literature"
        }
    ];

    Assert.equalValue( "Create term.workType", TermIndex.createWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createPrimaryWorkType", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.createDocument( "container", XmlNamespaces.ting);
    var element = XmlUtil.appendChildElement(xml, "adminData");

    var element2 = XmlUtil.appendChildElement(element, "workType", undefined, "sheetmusic");
    element2 = XmlUtil.appendChildElement(element, "workType", undefined, "movie");
    element2 = XmlUtil.appendChildElement(element, "workType", undefined, "analysis");

    var indexOut = [ {
        name: "term.primaryWorkType",
        value: "analysis,movie,sheetmusic"
    } ];

    Assert.equalValue( "Create term.workType", TermIndex.createPrimaryWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createLanguage", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">fre</marcx:subfield><marcx:subfield code="c">dan</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">r</marcx:subfield>' +
        '<marcx:subfield code="a">1996</marcx:subfield><marcx:subfield code="z">2012</marcx:subfield' +
        '><marcx:subfield code="b">fr</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">j</marcx:subfield><marcx:subfield code="l">fre</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var expected = [ {
        name: "term.language",
        value: "fre"
    }, {
        name: "term.language",
        value: "Fransk"
    }, {
        name: "term.language",
        value: "fre"
    }, {
        name: "term.language",
        value: "Fransk"
    } ];

    var actual = TermIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.language (marc)", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    expected = [ {
        name: "term.language",
        value: "dan"
    }, {
        name: "term.language",
        value: "Dansk"
    } ];

    Assert.equalValue( "Create term.language (dkabm)", TermIndex.createLanguage( index, xml ), expected );

} );

UnitTest.addFixture( "TermIndex.createPrimaryLanguage", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
	'<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
	    '<marcx:leader>000000000000000000000000</marcx:leader>' +
	    '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">fre</marcx:subfield><marcx:subfield code="c">dan</marcx:subfield>' +
        '</marcx:datafield>' +
	    '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">r</marcx:subfield>' +
        '<marcx:subfield code="a">1996</marcx:subfield><marcx:subfield code="z">2012</marcx:subfield>' +
        '<marcx:subfield code="b">fr</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">j</marcx:subfield><marcx:subfield code="l">fre</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
	    '</marcx:record>' +
	'</marcx:collection>' +
	'</ting:container>' );

    var expected = [ {
        name: "term.primaryLanguage",
        value: "fre"
    } ];

    var actual = TermIndex.createPrimaryLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.primaryLanguage (marc)", actual, expected );

} );

UnitTest.addFixture( "TermIndex.createPrimaryLanguage", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.primaryLanguage",
        value: "dan"
    } ];

    Assert.equalValue( "Create term.primaryLanguage (dkabm)", TermIndex.createPrimaryLanguage( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createGenre", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container ' +
	    'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<dkabm:record>' +
		'<dc:subject xsi:type="dkdcplus:genre">horror</dc:subject>' +
		'<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
	'</dkabm:record>' +
	'</ting:container>' );

    var indexOut = [ {
        name: "term.genre",
        value: "horror"
    }, {
        name: "term.genre",
        value: "fiktion"
    } ];

    Assert.equalValue( "Create term.genre", TermIndex.createGenre( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createAudience", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:audience xsi:type="dkdcplus:age">Fra 14 aar</dcterms:audience>' +
        '<dcterms:audience xsi:type="dkdcplus:pegi">PEGI-m\u00E6rkning: 16</dcterms:audience>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.audience",
        value: "Fra 14 aar"
    }, {
        name: "term.audience",
        value: "16 \u00E5r"
    } ];

    Assert.equalValue( "Create term.audience", TermIndex.createAudience( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createAudienceRecommended", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:audience xsi:type="dkdcplus:age">Fra 15 aar</dcterms:audience>' +
        '<dcterms:audience xsi:type="dkdcplus:pegi">PEGI-m\u00E6rkning: 16</dcterms:audience>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexName = "term.audienceRecommended";

    var indexOut = [ {
        name: "term.audienceRecommended",
        value: "Fra 15 aar"
    } ];

    Assert.equalValue( "Create term.audienceRecommended", TermIndex.createAudienceRecommended( index, xml, indexName ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createAudienceRestricted", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
            '<dkabm:record>' +
                '<dcterms:audience xsi:type="dkdcplus:medieraad">Mærkning: Tilladt for boern over 15 aar</dcterms:audience>' +
                '<dcterms:audience xsi:type="dkdcplus:pegi">PEGI-mærkning: 16</dcterms:audience>' +
                '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
            '</dkabm:record>' +
        '</ting:container>'
    );

    var indexName = "term.audienceRestricted";

    var expected = [ {
        name: "term.audienceRestricted",
        value: "Tilladt for boern over 15 aar"
    }, {
        name: "term.audienceRestricted",
        value: "16 \xe5r"
   } ];

    var actual = TermIndex.createAudienceRestricted( index, xml, indexName );

    Assert.equalValue( "Create term.audienceRestricted", actual, expected );

} );

UnitTest.addFixture( "TermIndex.createAcquisitionDate", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="096">' +
        '<marcx:subfield code="t">20131015</marcx:subfield><marcx:subfield code="z">870970</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.acquisitionDate",
        value: "20131015"
    } ];

    Assert.equalValue( "Create term.acquisitionDate", TermIndex.createAcquisitionDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewedCreator", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Foerst forsvinder Toru Okadas kat, dernaest hans kone Kumiko</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>635 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.reviewedCreator",
        value: "Haruki Murakami"
    } ];

    Assert.equalValue( "Create term.reviewedCreator", TermIndex.createReviewedCreator( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewedCreatorDkabm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<dc:subject>Haakan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var expected = [ {
        name: "term.reviewedCreator",
        value: "Haakan Nesser"
    } ];

    var actual = TermIndex.createReviewedCreatorDkabm( index, xml );

    Assert.equalValue( "Create term.reviewedCreator from DKABM", actual, expected );

} );

UnitTest.addFixture( "TermIndex.createReviewedTitle", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/"' +
        ' xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '</dkabm:record></ting:container>');

    var expected = [ {
        name: "term.reviewedTitle",
        value: "Traekopfuglens kroenike"
    } ];

    Assert.equalValue( "Create term.reviewedTitle", TermIndex.createReviewedTitle( index, xml ), expected );

} );

UnitTest.addFixture( "TermIndex.createReviewedTitleDkabm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<dc:subject>Håkan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>');

    var expected = [ {
        name: "term.reviewedTitle",
        value: "Skyggerne og regnen"
    } ];

    Assert.equalValue( "Create term.reviewedTitle from DKABM", TermIndex.createReviewedTitleDkabm( index, xml ), expected );

} );

UnitTest.addFixture( "TermIndex.createReviewedPublisher", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>635 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.reviewedPublisher",
        value: "Klim"
    } ];

    Assert.equalValue( "Create term.reviewedPublisher", TermIndex.createReviewedPublisher( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewedIdentifier", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Foerst forsvinder Toru Okadas kat, dernaest hans kone Kumiko</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>635 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.reviewedIdentifier",
        value: "87-7724-857-0"
    } ];

    Assert.equalValue( "Create term.reviewedIdenfier", TermIndex.createReviewedIdentifier( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewedIdentifierDkabm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:references xsi:type="dkdcplus:ISBN">9788773949740</dcterms:references>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.reviewedIdentifier",
        value: "9788773949740"
    } ];

    Assert.equalValue( "Create term.reviewedIdentifier from DKABM", TermIndex.createReviewedIdentifierDkabm( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewSubject", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Murakami, Haruki</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">magisk realisme</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">maend</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Foerst forsvinder Toru Okadas kat, dernaest hans kone Kumiko.</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>635 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '<dc:source>Nejimaki-dori kuronikure</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Japan</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.subject",
        value: "Traekopfuglens kroenike"
    } ];

    Assert.equalValue( "Create term.subject (review)", TermIndex.createReviewSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewSubjectDkabm", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<dc:subject>Håkan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "term.subject",
        value: "Skyggerne og regnen"
    } ];

    Assert.equalValue( "Create term.subject from DKABM", TermIndex.createReviewSubjectDkabm( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createReviewer", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>86304155|870971</ac:identifier>' +
        '<ac:source>Anmeldelser</ac:source>' +
        '<dc:title>Anmeldelse</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anmeldelse</dc:title>' +
        '<dc:creator>Jon Helt Haarder</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Haarder, Jon Helt</dc:creator>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:date>2001</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dcterms:extent>Sektion 1, s. 10</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:isPartOf>Jyllands-posten, 2001-06-22</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0109-1182</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>');

    var indexOut = [ {
        name: "term.reviewer",
        value: "Jon Helt Haarder"
    } ];

    Assert.equalValue( "Create term.reviewer", TermIndex.createReviewer( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createDescription", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
	'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<dkabm:record>' +
	'<dc:title>Storm</dc:title>' +
	'<dc:subject xsi:type="dkdcplus:DBCS">socialt udsatte</dc:subject>' +
	'<dcterms:abstract>Islaendingen Storm er flyttet til Vollsmose og er bistandsklient</dcterms:abstract>' +
	'<dc:description>Oversat af Kim Lembek</dc:description>' +
	'<dc:description>Indlaest i 2005</dc:description>' + 
	'</dkabm:record>' +
	'</ting:container>' );

    var indexOut = [ {
        name: "term.description",
        value: "Oversat af Kim Lembek"
   },{
        name: "term.description",
        value: "Indlaest i 2005"
    },{
        name: "term.description",
        value: "Islaendingen Storm er flyttet til Vollsmose og er bistandsklient"
   } ];

    Assert.equalValue( "Create term.createDescription", TermIndex.createDescription( index, xml ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createTrackTitle", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
	    'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<dkabm:record>' +
	'<ac:identifier>0000000016403475|150014</ac:identifier>' +
	'<ac:source>Bibzoom (album)</ac:source>' +
	'<dc:title>Trisha sephora</dc:title>' +
	'<dc:title xsi:type="dkdcplus:full">Trisha sephora</dc:title>' +
	'<dc:creator>TRISHA SEPHORA</dc:creator>' +
	'<dc:creator xsi:type="oss:sort">TRISHA SEPHORA</dc:creator>' +
	'<dc:subject xsi:type="dkdcplus:genre">pop</dc:subject>' +
	'<dc:date>2008</dc:date>' +
	'<dc:publisher>VICOR</dc:publisher>' +
	'<dc:contributor xsi:type="dkdcplus:prf">TRISHA SEPHORA</dc:contributor>' +
	'<dc:type xsi:type="dkdcplus:BibDK-Type">Musik (net)</dc:type>' +
	'<dc:rights>(p) 2008 The Orchard</dc:rights>' +
	'<dc:identifier xsi:type="dcterms:URI">http://www.bibzoom.dk/cgi-bin/WebObjects/TShop.woa/wa/PSShop/MusicCollection?sku=0000000016403475</dc:identifier>' +
	'<dc:identifier xsi:type="dkdcplus:UPC">885686497777</dc:identifier>' +
	'<dcterms:extent>35:54</dcterms:extent>' +
	'<dcterms:isPartOf xsi:type="dkdcplus:albumId"/>' +
	'<dcterms:isPartOf xsi:type="dkdcplus:albumTitle"/>' +
	'<dcterms:hasPart xsi:type="dkdcplus:track"><a href="http://www.bibzoom.dk/cgi-bin/WebObjects/TShop.woa/wa/PSShop/Track?sku=0000000016403476">Can\'t Stop Thinking of You</a></dcterms:hasPart>' +
	'<dcterms:hasPart xsi:type="dkdcplus:track"><a href="http://www.bibzoom.dk/cgi-bin/WebObjects/TShop.woa/wa/PSShop/Track?sku=0000000016403477">Kailan mo Sasabihin?</a></dcterms:hasPart>' +
	'</dkabm:record>' +
	'</ting:container>' );

    var indexOut = [ {
        name: "term.trackTitle",
        value: "Can't Stop Thinking of You"
   },{
        name: "term.trackTitle",
        value: "Kailan mo Sasabihin?"
   } ];

    Assert.equalValue( "Create term.createTrackTitle", TermIndex.createTrackTitle( index, xml, "term.trackTitle" ), indexOut );

} );

UnitTest.addFixture( "TermIndex.createPartOf", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
	    'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	'<dkabm:record>' +
	'<ac:identifier>34016259|870971</ac:identifier>' +
	'<ac:source>Tidsskriftsartikler</ac:source>' +
	'<dc:title>Er det OK at vaere hunderacist?</dc:title>' +
	'<dcterms:audience>voksenmaterialer</dcterms:audience>' +
	'<dc:date>2010</dc:date>' +
	'<dc:type xsi:type="dkdcplus:BibDK-Type">Tidsskriftsartikel</dc:type>' +
	'<dcterms:isPartOf>Dyrlaegen, Arg. 3, nr. 1 (2010)</dcterms:isPartOf>' +
	'<dcterms:isPartOf xsi:type="dkdcplus:ISSN">1903-153X</dcterms:isPartOf>' +
	'</dkabm:record>' +
	'</ting:container>');

    var indexOut = [ {
	    name : "term.partOf",
	    value : "Dyrlaegen, Arg. 3, nr. 1 (2010)"
    }, {
	    name : "term.partOf",
	    value : "1903-153X"
    } ];

    Assert.equalValue( "Create term.createPartOf", TermIndex.createPartOf( index, xml ), indexOut );

} );
UnitTest.addFixture( "TermIndex.createOnlineAccess", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" xmlns:ln="http://oss.dbc.dk/ns/links">' +
            '<ln:links>' +
                '<ln:link>' +
                    '<ln:relationType>dbcaddi:hasOnlineAccess</ln:relationType>' +
                    '<ln:access>remote</ln:access>' +
                '</ln:link>' +
            '</ln:links>' +
        '</ting:container>'
    );

    var expected = [ {
	    name : "term.onlineAccess",
	    value : "od restricted"
    } ];

    var actual = TermIndex.createOnlineAccess( index, xml );

    Assert.equalValue( "Create term.createOnlineAccess dkabm", actual, expected );


    index = Index.newIndex();
    xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
            '<marcx:collection>' +
                '<marcx:record format="danMARC2" type="Bibliographic">' +
                '<marcx:leader>000000000000000000000000</marcx:leader>' +
                    '<marcx:datafield ind1="0" ind2="0" tag="008">' +
                        '<marcx:subfield code="n">a</marcx:subfield>' +
                    '</marcx:datafield>' +
                '</marcx:record>' +
            '</marcx:collection>' +
        '</ting:container>'
    );

    expected = [ {
	    name : "term.onlineAccess",
	    value : "ou free"
    } ];

    actual = TermIndex.createOnlineAccess( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) );

    Assert.equalValue( "Create term.createOnlineAccess Marc", actual, expected );

} );