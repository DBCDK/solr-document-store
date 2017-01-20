use( "ScanIndex" );
use( "UnitTest" );
use( "Index" );
use( "MarcUtility" );

UnitTest.addFixture( "ScanIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '</dkabm:record>' +
        '</ting:container>' );
    var indexOut = [ {
        name: "scanterm.creator",
        value: "Anders Morgenthaler"
    }, {
        name: "scanphrase.creator",
        value: "Anders Morgenthaler"
    } ];

    Assert.equalValue( "Create scanterm.creator and scanphrase.creator", ScanIndex.createCreator( index, xml ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createMainCreator", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:marcx="info:lc/xmlns/marcxchange-v1" xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><marcx:collection><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="100"><marcx:subfield code="a">Tarantino</marcx:subfield><marcx:subfield code="h">Quentin</marcx:subfield><marcx:subfield code="c">f. 1963</marcx:subfield></marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">From dusk till dawn</marcx:subfield><marcx:subfield code="e">screenplay by Quentin Tarantino</marcx:subfield><marcx:subfield code="e">story by Robert Kurtzman</marcx:subfield></marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">London</marcx:subfield><marcx:subfield code="b">Faber and Faber</marcx:subfield><marcx:subfield code="c">1996</marcx:subfield></marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Kurtzman</marcx:subfield><marcx:subfield code="h">Robert</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );
    var indexOut = [ {
        name: "scanterm.mainCreator",
        value: "Quentin Tarantino"
    }, {
        name: "scanphrase.mainCreator",
        value: "Quentin Tarantino (f. 1963)"
    } ];

    Assert.equalValue( "Create scanterm.mainCreator and scanphrase.mainCreator",
        ScanIndex.createMainCreator( index, xml,MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createContributor", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>29392358|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Princess</dc:title><dc:title xsi:type="dkdcplus:full">Princess</dc:title><dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator><dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator><dc:contributor>Anders Morgenthaler</dc:contributor><dc:contributor>Mette Heeno</dc:contributor><dc:contributor>Kasper Tuxen Andersen</dc:contributor></dkabm:record></ting:container>' );
    var indexOut = [ {
        name: "scanterm.contributor",
        value: "Anders Morgenthaler"
    }, {
        name: "scanphrase.contributor",
        value: "Anders Morgenthaler"
    }, {
        name: "scanterm.contributor",
        value: "Mette Heeno"
    }, {
        name: "scanphrase.contributor",
        value: "Mette Heeno"
    }, {
        name: "scanterm.contributor",
        value: "Kasper Tuxen Andersen"
    }, {
        name: "scanphrase.contributor",
        value: "Kasper Tuxen Andersen"
    }, {
        name: "scanterm.contributor",
        value: "Anders Morgenthaler"
    }, {
        name: "scanphrase.contributor",
        value: "Anders Morgenthaler"
    } ];

    Assert.equalValue( "Create scanterm.contributor and scanphrase.contributor", ScanIndex.createContributor( index, xml ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ting="http://www.dbc.dk/ting" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:ac="http://biblstandard.dk/ac/namespace/"><dkabm:record><ac:identifier>25884493|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56</dc:title><dc:title xsi:type="dkdcplus:full">Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56 (Aimard)</dc:title><dcterms:alternative>Triple concerto, op. 56</dcterms:alternative><dcterms:alternative>Tripelkoncert</dcterms:alternative></dkabm:record></ting:container>' );
    var indexOut = [ {
        name: "scanterm.title",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56"
     }, {
        name: "scanphrase.title",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56"
     }, {
        name: "scanterm.title",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56 (Aimard)"
     }, {
        name: "scanphrase.title",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56 (Aimard)"
     }, {
        name: "scanterm.title",
        value: "Triple concerto, op. 56"
     }, {
        name: "scanphrase.title",
        value: "Triple concerto, op. 56"
     }, {
        name: "scanterm.title",
        value: "Tripelkoncert"
     }, {
        name: "scanphrase.title",
        value: "Tripelkoncert"
     } ];

    Assert.equalValue( "Create scanterm.title and scanphrase.title", ScanIndex.createTitle( index, xml ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createMainTitle", function( ) {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ting="http://www.dbc.dk/ting" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:ac="http://biblstandard.dk/ac/namespace/"><dkabm:record><ac:identifier>25884493|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56</dc:title><dc:title xsi:type="dkdcplus:full">Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56 (Aimard)</dc:title><dcterms:alternative>Triple concerto, op. 56</dcterms:alternative><dcterms:alternative>Tripelkoncert</dcterms:alternative></dkabm:record></ting:container>' );
    var indexOut = [ {
        name: "scanterm.mainTitle",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56"
     }, {
        name: "scanphrase.mainTitle",
        value: "Koncert for klaver, violin, violoncel og orkester, C-dur, opus 56"
     } ];

    Assert.equalValue( "Create scanterm.mainTitle and scanphrase.mainTitle", ScanIndex.createMainTitle( index, xml ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createPartOf", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><dcterms:isPartOf>Berlingske tidende, 2003-01-26</dcterms:isPartOf><dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf></dkabm:record></ting:container>' );
    var indexOut = [ {
        name: "scanterm.partOf",
        value: "Berlingske tidende"
     }, {
        name: "scanphrase.partOf",
        value: "Berlingske tidende"
     } ];

    Assert.equalValue( "Create scanterm.createPartOf and scanphrase.createPartOf",
        ScanIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createPartOf", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><dcterms:isPartOf>Rapports et procès-verbaux des réunions, vol. 173</dcterms:isPartOf><dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:datafield ind1="0" ind2="0" tag="557"><marcx:subfield code="a">Rapports et procès-verbaux des réunions</marcx:subfield><marcx:subfield code="æ">Conseil International pour l&apos;Exploration de la Mer</marcx:subfield><marcx:subfield code="v">vol. 173</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );
    var indexOut = [ {
        name: "scanterm.partOf",
        value: "Rapports et procès-verbaux des réunions. Conseil International pour l'Exploration de la Mer"
     }, {
        name: "scanphrase.partOf",
        value: "Rapports et procès-verbaux des réunions. Conseil International pour l'Exploration de la Mer"
     } ];

    Assert.equalValue( "Create scanterm.createPartOf and scanphrase.createPartOf with addition",
        ScanIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createPartOf", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><dcterms:isPartOf>Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune, 1995</dcterms:isPartOf><dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:datafield ind1="0" ind2="0" tag="557"><marcx:subfield code="a">Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune</marcx:subfield><marcx:subfield code="j">1995</marcx:subfield><marcx:subfield code="z">0907-7154</marcx:subfield><marcx:subfield code="V">1995</marcx:subfield><marcx:subfield code="v">1995</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );
    var indexOut = [ {
        name: "scanterm.partOf",
        value: "Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune"
     }, {
        name: "scanphrase.partOf",
        value: "Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune"
     } ];

    Assert.equalValue( "Create scanterm.createPartOf and scanphrase.createPartOf special case (comma)",
        ScanIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createPartOf", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ting="http://www.dbc.dk/ting" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ac="http://biblstandard.dk/ac/namespace/"><dkabm:record><ac:identifier>0000000016734896|150014</ac:identifier><ac:source>Bibzoom (track)</ac:source><dcterms:isPartOf xsi:type="dkdcplus:albumId">0000000016734835</dcterms:isPartOf><dcterms:isPartOf xsi:type="dkdcplus:albumTitle">Francoeur : Symphonies - Philidor : Marches</dcterms:isPartOf></dkabm:record></ting:container>' );
    var indexOut = [ {
        name: "scanterm.partOf",
        value: "Francoeur : Symphonies - Philidor : Marches"
     }, {
        name: "scanphrase.partOf",
        value: "Francoeur : Symphonies - Philidor : Marches"
     } ];

    Assert.equalValue( "Create scanterm.createPartOf and scanphrase.createPartOf album",
        ScanIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "ScanIndex.createSubject", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>29392358|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject><dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject><dcterms:spatial>Rusland</dcterms:spatial></dkabm:record><dcterms:temporal xsi:type="dkdcplus:DBCM">1980-1989</dcterms:temporal></ting:container>' );
    var indexOut = [ {
        name: "scanterm.subject",
        value: "fiktion"
    }, {
        name: "scanphrase.subject",
        value: "fiktion"
    }, {
        name: "scanterm.subject",
        value: "pornografi"
    }, {
        name: "scanphrase.subject",
        value: "pornografi"
    }, {
        name: "scanterm.subject",
        value: "Rusland"
    }, {
        name: "scanphrase.subject",
        value: "Rusland"
    } ];

    Assert.equalValue( "Create scanterm.subject and scanphrase.subject", ScanIndex.createSubject( index, xml ), indexOut );

} );

