use( "RankIndex" );
use( "UnitTest" );
use( "Index" );
use( "XmlUtil" );

UnitTest.addFixture( "RankIndex.createCreator", function( ) {

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>29392358|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Princess</dc:title><dc:title xsi:type="dkdcplus:full">Princess</dc:title><dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator><dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator></dkabm:record></ting:container>' );
    indexOut = [ {
            name: "rankterm.creator",
            value: "Anders Morgenthaler"
        }, {
            name: "rankphrase.creator",
            value: "Anders Morgenthaler"
        }, {
            name: "rankterm.creator",
            value: "Morgenthaler, Anders"
        }, {
            name: "rankphrase.creator",
            value: "Morgenthaler, Anders"
        }
    ];

    Assert.equal( "Create rankterm.creator and rankphrase.creator", 'RankIndex.createCreator( index, xml );', indexOut );

    delete this.xml;
    delete this.index;
    delete this.indexOut;

} );

UnitTest.addFixture( "RankIndex.createTitle", function( ) {

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>29392358|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Princess</dc:title><dc:title xsi:type="dkdcplus:full">Princess</dc:title><dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator><dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator></dkabm:record></ting:container>' );
    indexOut = [ {
            name: "rankterm.title",
            value: "Princess"
        }, {
            name: "rankphrase.title",
            value: "Princess"
        }, {
            name: "rankterm.title",
            value: "Princess"
        }, {
            name: "rankphrase.title",
            value: "Princess"
        }
    ];

    Assert.equal( "Create rankterm.title and rankphrase.title", 'RankIndex.createTitle( index, xml );', indexOut );

    delete this.xml;
    delete this.index;
    delete this.indexOut;

} );

UnitTest.addFixture( "RankIndex.createSubject", function( ) {

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>29392358|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject><dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject><dcterms:spatial>Rusland</dcterms:spatial></dkabm:record><dcterms:temporal xsi:type="dkdcplus:DBCM">1980-1989</dcterms:temporal></ting:container>' );
    indexOut = [ {
            name: "rankterm.subject",
            value: "77.7"
        }, {
            name: "rankphrase.subject",
            value: "77.7"
        }, {
            name: "rankterm.subject",
            value: "Spillefilm"
        }, {
            name: "rankphrase.subject",
            value: "Spillefilm"
        }, {
            name: "rankterm.subject",
            value: "fiktion"
        }, {
            name: "rankphrase.subject",
            value: "fiktion"
        }, {
            name: "rankterm.subject",
            value: "pornografi"
        }, {
            name: "rankphrase.subject",
            value: "pornografi"
        }, {
            name: "rankterm.subject",
            value: "Rusland"
        }, {
            name: "rankphrase.subject",
            value: "Rusland"
        }
    ];

    Assert.equal( "Create rankterm.subject and rankphrase.subject", 'RankIndex.createSubject( index, xml );', indexOut );

    delete this.xml;
    delete this.index;
    delete this.indexOut;

} );
