use( "MarcUtility" );
use( "FacetIndex" );
use( "UnitTest" );
use( "Index" );
use( "XmlUtil" );

UnitTest.addFixture( "FacetIndex", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">praester</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">selvtaegt</dc:subject>' +
        '<dcterms:abstract>Praesten August beslutter sig for at tage sig af den 5-aarige Mia</dcterms:abstract>' +
        '<dc:description>Beskrivelsen baseret på det fysiske forlaeg</dc:description>' +
        '<dc:description>Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</dc:description>' +
        '<dcterms:audience xsi:type="dkdcplus:medieraad">Mærkning: Tilladt for børn over 15 år</dcterms:audience>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Zentropa on Demand</dc:publisher>' +
        '<dc:contributor>Anders Morgenthaler</dc:contributor>' +
        '<dc:contributor>Mette Heeno</dc:contributor>' +
        '<dc:contributor>Kasper Tuxen Andersen</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>' +
        '<dcterms:extent>80 min.</dcterms:extent>' +
        '<dc:identifier xsi:type="dcterms:URI">http://www.zentropaondemand.dk/Film/Film/3882/Princess</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29392358</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120530084142</marcx:subfield><marcx:subfield code="d">20120523</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="006">' +
        '<marcx:subfield code="d">15</marcx:subfield><marcx:subfield code="2">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="n">b</marcx:subfield>' +
        '<marcx:subfield code="v">5</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">m</marcx:subfield><marcx:subfield code="g">xe</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBI201224</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="u">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Princess</marcx:subfield>' +
        '<marcx:subfield code="f">animations instruktører Mads Juul &amp; Kristjan Møller</marcx:subfield>' +
        '<marcx:subfield code="e">fotograf Kasper Tuxen Andersen</marcx:subfield>' +
        '<marcx:subfield code="e">manuskript af Anders Morgenthaler &amp; Mette Heeno</marcx:subfield>' +
        '<marcx:subfield code="f">producer Sarita Christensen</marcx:subfield>' +
        '<marcx:subfield code="e">instrueret af Anders Morgenthaler</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="b">Zentropa on Demand</marcx:subfield><marcx:subfield code="c">[2012]</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="l">80 min.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="a">Praesten August beslutter sig for at tage sig af den 5-aarige Mia</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="505">' +
        '<marcx:subfield code="a">Tegne- og realfilm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Dansk tale</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Undertekster på engelsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Beskrivelsen baseret på det fysiske forlæg</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="i">Medvirkende, stemmer</marcx:subfield>' +
        '<marcx:subfield code="e">Thure Lindhardt, Stine Fisher Christensen, Tommy Kenter ... et al.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="517">' +
        '<marcx:subfield code="a">Mærkning: Tilladt for børn over 15 år</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">77.7</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">pornografi</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">præster</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="s">selvtægt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Morgenthaler</marcx:subfield>' +
        '<marcx:subfield code="h">Anders</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Heeno</marcx:subfield><marcx:subfield code="h">Mette</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="å">1</marcx:subfield>' +
        '<marcx:subfield code="a">Tuxen Andersen</marcx:subfield><marcx:subfield code="h">Kasper</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="856">' +
        '<marcx:subfield code="z">Adgangsmåde: Internet</marcx:subfield>' +
        '<marcx:subfield code="u">http://www.zentropaondemand.dk/Film/Film/3882/Princess</marcx:subfield>' +
        '<marcx:subfield code="z">Adgang til streaming efter køb</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Andersen</marcx:subfield>' +
        '<marcx:subfield code="h">Kasper Tuxen</marcx:subfield><marcx:subfield code="x">se</marcx:subfield>' +
        '<marcx:subfield code="w">Tuxen Andersen, Kasper</marcx:subfield><marcx:subfield code="z">700/1</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.category",
        value: "voksenmaterialer"
    } ];

    Assert.equalValue( "Create facet.category (voksenmaterialer)", FacetIndex.createCategory( index, xml ), indexOut );

    //Testing facet.creator on the same xml
    indexOut = [ {
        name: "facet.creator",
        value: "Anders Morgenthaler"
    }, {
        name: "facet.creator",
        value: "Anders Morgenthaler"
    }, {
        name: "facet.creator",
        value: "Mette Heeno"
    }, {
        name: "facet.creator",
        value: "Kasper Tuxen Andersen"
    } ];

    index = Index.newIndex();
    Assert.equalValue( "Create facet.creator", FacetIndex.createCreator( index, xml ), indexOut );


    //Testing facet.primaryCreator on the same xml
    indexOut = [ {
        name: "facet.primaryCreator",
        value: "Anders Morgenthaler"
    } ];

    index = Index.newIndex();
    Assert.equalValue( "Create facet.primaryCreator", FacetIndex.createPrimaryCreator( index, xml ), indexOut );

    //Testing facet.date on the same xml
    indexOut = [ {
        name: "facet.date",
        value: "2012"
    } ];

    index = Index.newIndex();
    Assert.equalValue( "Create facet.date", FacetIndex.createDate( index, xml ), indexOut );



} );

UnitTest.addFixture( "FacetIndex.createCreatorFunction", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting"' +
        ' xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/"' +
        ' xmlns:ac="http://biblstandard.dk/ac/namespace/"' +
        ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
        '>' +
        '<dkabm:record>' +
        '<dc:creator xsi:type="dkdcplus:aut">Helle Helle (1940 01 01)</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Helle, Helle</dc:creator>' +
        '<dc:creator xsi:type="dkdcplus:aus">Hella Joof</dc:creator>' +
        '<dc:creator xsi:type="dkdcplus:act">Paprika Steen</dc:creator>' +
        '<dc:creator xsi:type="dkdcplus:dnc">Paprika Steen</dc:creator>' +
        '<dc:contributor xsi:type="dkdcplus:act">Chris Pratt</dc:contributor>' +
        '<dc:contributor>Haruki Murakami</dc:contributor>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "facet.creatorFunction",
        value: "Helle Helle (Forfatter)"
    }, {
        name: "facet.creatorFunction",
        value: "Hella Joof (Manuskriptforfatter)"
    }, {
        name: "facet.creatorFunction",
        value: "Paprika Steen (Skuespiller)"
    }, {
        name: "facet.creatorFunction",
        value: "Paprika Steen"
    }, {
        name: "facet.creatorFunction",
        value: "Chris Pratt (Skuespiller)"
    }, {
        name: "facet.creatorFunction",
        value: "Haruki Murakami"
    } ];

    Assert.equalValue( "Create facet.creatorFunction from dc:creator and dc:contributor",
        FacetIndex.createCreatorFunction( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createLanguage", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source><dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29392358</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120530084142</marcx:subfield><marcx:subfield code="d">20120523</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="n">b</marcx:subfield>' +
        '<marcx:subfield code="v">5</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="u">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );
    var indexOut = [ {
        name: "facet.language",
        value: "Dansk"
    } ];

    Assert.equalValue( "Create facet.language for marc record based on 008*l",
        FacetIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">præster</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">selvtaegt</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Zentropa on Demand</dc:publisher>' +
        '<dc:contributor>Anders Morgenthaler</dc:contributor>' +
        '<dc:contributor>Mette Heeno</dc:contributor>' +
        '<dc:contributor>Kasper Tuxen Andersen</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>' +
        '<dcterms:extent>80 min.</dcterms:extent>' +
        '<dc:identifier xsi:type="dcterms:URI">http://www.zentropaondemand.dk/Film/Film/3882/Princess</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29392358</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120530084142</marcx:subfield><marcx:subfield code="d">20120523</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="006">' +
        '<marcx:subfield code="d">15</marcx:subfield><marcx:subfield code="2">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="n">b</marcx:subfield><marcx:subfield code="v">5</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">m</marcx:subfield><marcx:subfield code="g">xe</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBI201224</marcx:subfield></marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="u">eng</marcx:subfield></marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Princess</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="b">Zentropa on Demand</marcx:subfield><marcx:subfield code="c">[2012]</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="l">80 min.</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );
    indexOut = [];

    Assert.equalValue( "Do not create facet.language index if language code is undefined",
        FacetIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" >' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">mul</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="p">dan</marcx:subfield>' +
        '<marcx:subfield code="p">fao</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [{
        name: "facet.language",
        value: "Dansk"
    }, {
        name: "facet.language",
        value: "F\u00E6r\u00f8sk"
    }];

    Assert.equalValue( "Create facet.language index marc record with multiple language in 41*p",
        FacetIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" >' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">mul</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield>' +
        '<marcx:subfield code="a">swe</marcx:subfield>' +
        '<marcx:subfield code="a">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "facet.language",
        value: "Dansk"
    }, {
        name: "facet.language",
        value: "Svensk"
    }, {
        name: "facet.language",
        value: "Engelsk"
    } ];

    Assert.equalValue( "Create facet.language index marc record with multiple language in 41*a",
        FacetIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );



    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" >' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="l">mul</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [{
        name: "facet.language",
        value: "Blandede sprog"
    }];

    Assert.equalValue( "Create facet.language index marc record with mul in 008l but no 041 a or p",
        FacetIndex.createLanguage( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );


} );

UnitTest.addFixture( "FacetIndex.createLanguage", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
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
        name: "facet.language",
        value: "Dansk"
    } ];

    Assert.equalValue( "Create facet.language index (dkabm)", FacetIndex.createLanguage( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>'+
        '<dc:language>Flere sprog</dc:language>'+
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>'+
        '<dc:language>Dansk</dc:language>'+
        '<dc:language xsi:type="dcterms:ISO639-2">fao</dc:language>'+
        '<dc:language>Færøsk</dc:language>'+
        '</dkabm:record>' +
        '</ting:container>');

    indexOut = [{
        name: "facet.language",
        value: "Dansk"
    }, {
        name: "facet.language",
        value: "F\u00E6r\u00f8sk"
    }];

    Assert.equalValue( "Create facet.language index with multiple languages given",
        FacetIndex.createLanguage( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>'+
        '<dc:language>Flere sprog</dc:language>'+
        '</dkabm:record>' +
        '</ting:container>');

    indexOut = [{
        name: "facet.language",
        value: "Blandede sprog"
    }];

    Assert.equalValue( "Create facet.language index with only mul given",
        FacetIndex.createLanguage( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createGenre", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:genre">horror</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">nonfiktion</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.genre",
        value: "horror"
    } ];

    Assert.equalValue( "Create facet.genre", FacetIndex.createGenre( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createGenreCategory", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:genre">horror</dc:subject>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<creationDate>2005-03-01</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>nonfiktion</genre>' +
        '</adminData>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.genreCategory",
        value: "nonfiktion"
    } ];

    Assert.equalValue( "Create facet.genreCategory", FacetIndex.createGenreCategory( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createAcSource", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<ac:identifier>89110408|870971</ac:identifier>' +
        '<ac:source>Avisartikler</ac:source>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-07-02</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<accessType>online</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870971-avis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );
    var localData = [ "localData.870971-avis" ];
    var indexOut = [ {
        name: "facet.acSource",
        value: "Avisartikler"
    } ];

    Assert.equalValue( "Create facet.acSource (Avisartikler)", FacetIndex.createAcSource( index, xml, localData ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>26827698|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2007-07-05</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>online</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '<collectionIdentifier>150021-bibliotek</collectionIdentifier>' +
        '<collectionIdentifier>150021-skole</collectionIdentifier>' +
        '<collectionIdentifier>150021-fjern</collectionIdentifier>' +
        '</adminData></ting:container>'
    );
    localData = [ "localData.870970-basis" ];
    indexOut = [ {
        name: "facet.acSource",
        value: "Bibliotekskatalog"
    } ];

    Assert.equalValue( "Create facet.acSource (Filmstriben) )", FacetIndex.createAcSource( index, xml, localData ), indexOut );

} );


UnitTest.addFixture( "FacetIndex.createSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>28831900|870970</ac:identifier>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">H. N. Andersen (f. 1852)</dc:subject>' +
        '<dc:subject xsi:type="oss:sort">Andersen, H. N. (f. 1852)</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skønlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">den spanske syge</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">historie</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28831900</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20110711180938</marcx:subfield><marcx:subfield code="d">20110615</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="600">' +
        '<marcx:subfield code="1"/><marcx:subfield code="a">Andersen</marcx:subfield>' +
        '<marcx:subfield code="h">H. N.</marcx:subfield><marcx:subfield code="c">f. 1852</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">86</marcx:subfield><marcx:subfield code="z">06</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">den spanske syge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">historie</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">København</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Danmark</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1910-1919</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );
    var indexOut = [ {
        name: "facet.subject",
        value: "Andersen H. N. f. 1852"
    }, {
        name: "facet.subject",
        value: "den spanske syge"
    }, {
        name: "facet.subject",
        value: "historie"
    }, {
        name: "facet.subject",
        value: "København"
    }, {
        name: "facet.subject",
        value: "Danmark"
    } ];

    Assert.equalValue( "Create facet.subject for data in marc-format",
        FacetIndex.createSubject( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<ac:identifier>59633|150005</ac:identifier>' +
        '<ac:source>Litteratursiden</ac:source>' +
        '<dc:title>Anbefaling af: En fodrejse fra Rostock til Syrakus af Friedrich Christian Delius</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anbefaling af: En fodrejse fra Rostock til Syrakus af Friedrich Christian Delius</dc:title>' +
        '<dc:subject>Friedrich Christian Delius</dc:subject>' +
        '<dc:subject>En fodrejse fra Rostock til Syrakus</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">nonfiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCP">1990-1999</dc:subject>' +
        '<dcterms:abstract>At vaere borger i et land</dcterms:abstract>' +
        '<dc:publisher>Litteratursiden</dc:publisher>' +
        '<dc:date>2002</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dc:identifier xsi:type="dcterms:URI">http://www.litteratursiden.dk/?q=node/59633</dc:identifier>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:references xsi:type="dkdcplus:ISBN">9788777393235</dcterms:references>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    indexOut = [ {
        name: "facet.subject",
        value: "Friedrich Christian Delius"
    }, {
        name: "facet.subject",
        value: "En fodrejse fra Rostock til Syrakus"
    } ];

    Assert.equalValue( "Create facet.subject for data in dkabm-format", FacetIndex.createSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createType", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:contributor>Anders Morgenthaler</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "facet.type",
        value: "Film (net)"
    } ];

    Assert.equalValue( "Create facet.type", FacetIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createAudienceCategory", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">test</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">for laerere</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "facet.audienceCategory",
        value: "test"
    }, {
        name: "facet.audienceCategory",
        value: "for laerere"
    } ];

    Assert.equalValue( "Create facet.audienceCategory", FacetIndex.createAudienceCategory( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createAudience", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29392358|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Princess</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Princess</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">prster</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">selvtgt</dc:subject>' +
        '<dcterms:abstract>Prsten August beslutter sig for at tage sig af den 5-rige Mia</dcterms:abstract>' +
        '<dc:description>Beskrivelsen baseret p det fysiske forlg</dc:description>' +
        '<dcterms:audience xsi:type="dkdcplus:medieraad">M\u00e6rkning: Tilladt for brn over 15 r</dcterms:audience>' +
        '<dcterms:audience xsi:type="dkdcplus:age">Fra 16 /u00e5r</dcterms:audience>' +
        '<dcterms:audience xsi:type="dkdcplus:pegi">PEGI-m\u00e6rkning: 18</dcterms:audience>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Zentropa on Demand</dc:publisher>' +
        '<dc:contributor>Anders Morgenthaler</dc:contributor>' +
        '<dc:contributor>Mette Heeno</dc:contributor>' +
        '<dc:contributor>Kasper Tuxen Andersen</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "facet.audience",
        value: "Fra 16 /u00e5r"
    }, {
        name: "facet.audience",
        value: "PEGI-m\xe6rkning: 18"
    }, {
        name: "facet.audience",
        value: "Tilladt for brn over 15 r"
    } ];

    Assert.equalValue( "Create facet.audience", FacetIndex.createAudience( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createForm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">test</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">vejledninger</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.form",
        value: "test"
    }, {
        name: "facet.form",
        value: "vejledninger"
    } ];

    Assert.equalValue( "Create facet.form", FacetIndex.createForm( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createLiteraryForm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="j">f</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData><genre>fiktion</genre></adminData></ting:container>' );
    var indexOut = [ {
        name: "facet.literaryForm",
        value: "sk\xf8nlitteratur"
    }, {
        name: "facet.literaryForm",
        value: "romaner"
    } ];

    Assert.equalValue( "Create facet.literaryForm",
        FacetIndex.createLiteraryForm( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
        '<adminData><genre>nonfiktion</genre></adminData>' +
        '</ting:container>' );
    indexOut = [ {
        name: "facet.literaryForm",
        value: "faglitteratur"
    } ];

    Assert.equalValue( "Create facet.literaryForm for faglitteratur",
        FacetIndex.createLiteraryForm( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createLevel", function( ) {

    var index = Index.newIndex( );
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
       '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' + 
           '<marcx:record format="danMARC2" type="Bibliographic">' + 
               '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="x">02</marcx:subfield>' +
        '</marcx:datafield>' +
           '</marcx:record>' + 
       '</marcx:collection>' + 
    '</ting:container>' );

    var indexOut = [ {
        name: "facet.level",
        value: "folkeskoleniveau"
    } ];

    Assert.equalValue( "Create facet.level (danMARC2 code, one value)",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex( );
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' + 
       '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' + 
           '<marcx:record format="danMARC2" type="Bibliographic">' + 
               '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="x">f</marcx:subfield>' +
        '</marcx:datafield>' +
           '</marcx:record>' + 
       '</marcx:collection>' + 
    '</ting:container>' );

    indexOut = [ {
        name: "facet.level",
        value: "fagligt niveau"
    }, {
        name: "facet.level",
        value: "forskningsniveau"
    } ];

    Assert.equalValue( "Create facet.level (marc21 codes, two values)",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex( );
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' + 
       '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' + 
           '<marcx:record format="danMARC2" type="Bibliographic">' + 
               '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="x">h</marcx:subfield>' +
        '</marcx:datafield>' +
           '</marcx:record>' + 
       '</marcx:collection>' + 
    '</ting:container>' );

    indexOut = [ ];

    Assert.equalValue( "Create facet.level (value from 008x not in list)",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex( );
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/">'+
     '<dkabm:record>' +
        '<dcterms:audience>gymnasieniveau</dcterms:audience>' +
        '</dkabm:record>' +
        '</ting:container>' );

    indexOut = [{
        name: "facet.level",
        value: "gymnasieniveau"
    }];

    Assert.equalValue( "Create facet.level gymnasieniveau from dkabm",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );


    index = Index.newIndex( );
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/">' +
        '<dkabm:record>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>'+
        '<dcterms:audience xsi:type="dkdcplus:age">Fra 9 år</dcterms:audience>'+
        '</dkabm:record>' +
        '</ting:container>' );

    indexOut = [];

    Assert.equalValue( "Create facet.level from dkabm no correct values ",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );


    index = Index.newIndex( );
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dcterms="http://purl.org/dc/terms/">' +
            '<dkabm:record>' +
            '<dcterms:audience>børnematerialer</dcterms:audience>'+
        '<dcterms:audience>folkeskoleniveau</dcterms:audience>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="x">02</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "facet.level",
        value: "folkeskoleniveau"
    } ];

    Assert.equalValue( "Create facet.level (danMARC2 code and dkabm for same value)",
        FacetIndex.createLevel( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createLet", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
       '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' + 
           '<marcx:record format="danMARC2" type="Bibliographic">' + 
               '<marcx:datafield ind1="0" ind2="0" tag="042">' +
                    '<marcx:subfield code="a">10</marcx:subfield>' +
                    '<marcx:subfield code="b">Ml 7,0 + Lo 3,1</marcx:subfield>' +
                '</marcx:datafield>' +
               '<marcx:datafield ind1="0" ind2="0" tag="042">' +
                    '<marcx:subfield code="c">18</marcx:subfield>' +
                '</marcx:datafield>' +
           '</marcx:record>' + 
      '</marcx:collection>' + 
    '</ting:container>' );

    var indexOut = [ {
        name: "facet.let",
        value: "18"
    } ];

    Assert.equalValue( "Create facet.let",
        FacetIndex.createLet( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createLix", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="a">10</marcx:subfield>' +
        '<marcx:subfield code="b">Ml 7,0 + Lo 3,1</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="c">18</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "facet.lix",
        value: "10"
    } ];

    Assert.equalValue( "Create facet.lix",
        FacetIndex.createLix( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="a">12-15</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "facet.lix",
        value: "12-15"
    } ];

    Assert.equalValue( "Create facet.lix range",
        FacetIndex.createLix( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );



    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="a">05 Ml 5,4 + Lo 0,0</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ ];

    Assert.equalValue( "Create facet.lix no lix-number (cataloging error)",
        FacetIndex.createLix( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

   index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="a">Lix 26</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "facet.lix",
        value: "26"
    }];

    Assert.equalValue( "Create facet.lix remove Lix from number",
        FacetIndex.createLix( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

    index = Index.newIndex();

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="042">' +
        '<marcx:subfield code="a">6 lix</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "facet.lix",
        value: "6"
    }];

    Assert.equalValue( "Create facet.lix  remove lix from number",
        FacetIndex.createLix( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );


} );

UnitTest.addFixture( "FacetIndex.createPartOf", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record><dcterms:isPartOf>Berlingske tidende, 2003-01-26</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.partOf",
        value: "Berlingske tidende"
    } ];

    Assert.equalValue( "Create facet.partOf",
        FacetIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml )  ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createPartOf", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:isPartOf>Rapports et procès-verbaux des réunions, vol. 173</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="557">' +
        '<marcx:subfield code="a">Rapports et procès-verbaux des réunions</marcx:subfield>' +
        '<marcx:subfield code="æ">Conseil International pour l&apos;Exploration de la Mer</marcx:subfield>' +
        '<marcx:subfield code="v">vol. 173</marcx:subfield>' +
        '</marcx:datafield></marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.partOf",
        value: "Rapports et procès-verbaux des réunions. Conseil International pour l'Exploration de la Mer"
    } ];

    Assert.equalValue( "Create facet.partOf with addition",
        FacetIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createPartOf", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:isPartOf>Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune, 1995</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0106-4223</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="557">' +
        '<marcx:subfield code="a">Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune</marcx:subfield>' +
        '<marcx:subfield code="j">1995</marcx:subfield>' +
        '<marcx:subfield code="z">0907-7154</marcx:subfield>' +
        '<marcx:subfield code="V">1995</marcx:subfield>' +
        '<marcx:subfield code="v">1995</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.partOf",
        value: "Arsskrift / Lokalhistorisk Forening, Norre-Alslev Kommune"
    } ];

    Assert.equalValue( "Create facet.partOf special case (comma)",
        FacetIndex.createPartOf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createTitleSeries", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Ernaringsradets arsberetning</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Ernaringsradets arsberetning</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Publikation / Ernaringsradet</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.titleSeries",
        value: "Publikation / Ernaringsradet"
    } ];

    Assert.equalValue( "Create facet.titleSeries", FacetIndex.createTitleSeries( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createGamePlatform", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Playstation 3</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.gamePlatform",
        value: "Playstation 3"
    } ];

    Assert.equalValue( "Create facet.gamePlatform", FacetIndex.createGamePlatform( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createDk5", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">99.4</marcx:subfield>' +
        '<marcx:subfield code="a">Eco</marcx:subfield>' +
        '<marcx:subfield code="h">Umberto</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.dk5",
        value: "99.4 Umberto Eco"
    } ];

    Assert.equalValue( "Create facet.dk5",
        FacetIndex.createDk5( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createAccess", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="n">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="n">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.access",
        value: "Ingen adgang"
    } ];

    Assert.equalValue( "Create facet.access", FacetIndex.createAccess( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="n">d</marcx:subfield>' +
        '</marcx:datafield></marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [];

    Assert.equalValue( "Create no facet.access", FacetIndex.createAccess( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [];

    Assert.equalValue( "Create no facet.access (no 008*n)", FacetIndex.createAccess( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createPeriod", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container \
    xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" \
    xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>29392358|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Princess</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Princess</dc:title>\
    <dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>\
    <dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">praester</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">selvtaegt</dc:subject>\
    <dcterms:abstract>Praesten August beslutter sig for at tage sig af den 5-aarige Mia</dcterms:abstract>\
    <dc:description>Beskrivelsen baseret paa det fysiske forlaeg</dc:description>\
    <dc:description>Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</dc:description>\
    <dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>\
    <dcterms:audience xsi:type="dkdcplus:medieraad">Maerkning: Tilladt for brn over 15 aar</dcterms:audience>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Zentropa on Demand</dc:publisher>\
    <dc:contributor>Anders Morgenthaler</dc:contributor>\
    <dc:contributor>Mette Heeno</dc:contributor>\
    <dc:contributor>Kasper Tuxen Andersen</dc:contributor>\
    <dc:date>2012</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>\
    <dcterms:extent>80 min.</dcterms:extent>\
    <dc:identifier xsi:type="dcterms:URI">http://www.zentropaondemand.dk/Film/Film/3882/Princess</dc:identifier>\
    <dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
    <dc:language>Dansk</dc:language>\
    <dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>\
    </dkabm:record>\
    </ting:container>' );

    var indexOut = [ {
        name: "facet.period",
        value: "1980-1989"
    }, {
        name: "facet.period",
        value: "1990-1999"
    } ];

    Assert.equalValue( "Create facet.period fra dcterms.temporal", FacetIndex.createPeriod( index, xml ), indexOut );

} );


UnitTest.addFixture( "FacetIndex.createGeographic", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container \
    xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" \
    xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>29392358|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Princess</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Princess</dc:title>\
    <dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>\
    <dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">pornografi</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">praester</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">selvtaegt</dc:subject>\
    <dcterms:abstract>Praesten August beslutter sig for at tage sig af den 5-aarige Mia</dcterms:abstract>\
    <dc:description>Beskrivelsen baseret paa det fysiske forlaeg</dc:description>\
    <dc:description>Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</dc:description>\
    <dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>\
    <dcterms:spatial xsi:type="dkdcplus:DBCF">Sydafrika</dcterms:spatial>\
    <dcterms:audience xsi:type="dkdcplus:medieraad">Maerkning: Tilladt for brn over 15 aar</dcterms:audience>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Zentropa on Demand</dc:publisher>\
    <dc:contributor>Anders Morgenthaler</dc:contributor>\
    <dc:contributor>Mette Heeno</dc:contributor>\
    <dc:contributor>Kasper Tuxen Andersen</dc:contributor>\
    <dc:date>2012</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>\
    <dcterms:extent>80 min.</dcterms:extent>\
    <dc:identifier xsi:type="dcterms:URI">http://www.zentropaondemand.dk/Film/Film/3882/Princess</dc:identifier>\
    <dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
    <dc:language>Dansk</dc:language>\
    <dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>\
    </dkabm:record>\
    </ting:container>' );

    var indexOut = [ {
        name: "facet.geographic",
        value: "Sydafrika"
    } ];

    Assert.equalValue( "Create facet.geographic fra dcterms.spatial", FacetIndex.createGeographic( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createFictionSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container \
    xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" \
    xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>29392358|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source><dc:title>Princess</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Princess</dc:title>\
    <dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler</dc:creator>\
    <dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>\
    <dc:description>Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</dc:description>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Skonlitteratur</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">alkohol</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">fiskere</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">fiskeri</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">satire</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCS">slaegtsromaner</dc:subject>\
    <dcterms:audience xsi:type="dkdcplus:medieraad">Mrkning: Tilladt for brn over 15 r</dcterms:audience>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:date>2012</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>\
    <dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
    <dc:language>Dansk</dc:language>\
    <dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>\
    </dkabm:record>\
    </ting:container>' );

    var indexOut = [ {
        name: "facet.fictionSubject",
        value: "alkohol"
    }, {
        name: "facet.fictionSubject",
        value: "fiskere"
    }, {
        name: "facet.fictionSubject",
        value: "fiskeri"
    }, {
        name: "facet.fictionSubject",
        value: "satire"
    }, {
        name: "facet.fictionSubject",
        value: "slaegtsromaner"
    } ];

    Assert.equalValue( "Create facet.fictionSubject from dc.subject with type-attribute dkdcplus:DBCS",
        FacetIndex.createFictionSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createNonFictionSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" \
    xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>29392358|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Princess</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Princess</dc:title>\
    <dc:creator xsi:type="dkdcplus:drt">Anders Morgenthaler </dc:creator>\
    <dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>\
    <dc:description>Originalfilmen: Kbh. : Zentropa Grrrr ; Tyskland : i co-produktion med Shotgun Pictures, 2006</dc:description>\
    <dc:subject xsi:type="dkdcplus:DK5">72 Platen, Cai Ulrich von</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Gengivelser af enkelte kunstneres vaerker</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCF">dansk kunst</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCO">fotografier</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCF">installationskunst</dc:subject>\
    <dcterms:audience xsi:type="dkdcplus:medieraad">Mrkning: Tilladt for brn over 15 r</dcterms:audience>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Zentropa on Demand</dc:publisher>\
    <dc:contributor>Anders Morgenthaler</dc:contributor>\
    <dc:contributor>Mette Heeno</dc:contributor>\
    <dc:contributor>Kasper Tuxen Andersen</dc:contributor>\
    <dc:date>2012</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Film (net)</dc:type>\
    <dcterms:extent>80 min.</dcterms:extent>\
    <dc:identifier xsi:type="dcterms:URI">http://www.zentropaondemand.dk/Film/Film/3882/Princess</dc:identifier>\
    <dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
    <dc:language>Dansk</dc:language>\
    <dc:language xsi:type="dkdcplus:subtitles">eng</dc:language>\
    </dkabm:record>\
    </ting:container>'
    );

    var indexOut = [ {
        name: "facet.nonFictionSubject",
        value: "dansk kunst"
    }, {
        name: "facet.nonFictionSubject",
        value: "installationskunst"
    } ];

    Assert.equalValue( "Create facet.nonFictionSubject from dc.subject with type-attribute dkdcplus:DBCF",
        FacetIndex.createNonFictionSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createMusicSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container \
    xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" \
    xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>12345678|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Titel</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Titel</dc:title>\
    <dc:creator xsi:type="dkdcplus:drt">Pink Floyd</dc:creator>\
    <dc:creator xsi:type="oss:sort">Pink Floyd</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">78.794:5</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Rock (Beat). Moderne folkemusik (Folk)</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">dancehall</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">dancehall</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">reggae</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">reggae</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">vokal</dc:subject>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:date>2012</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>\
    <dcterms:extent>80 min.</dcterms:extent>\
    <dc:language xsi:type="dcterms:ISO639-2">eng</dc:language>\
    <dc:language>Engelsk</dc:language>\
    </dkabm:record>\
    </ting:container>'
    );

    var indexOut = [ {
        name: "facet.musicSubject",
        value: "dancehall"
    }, {
        name: "facet.musicSubject",
        value: "reggae"
    }, {
        name: "facet.musicSubject",
        value: "vokal"
    } ];

    Assert.equalValue( "Create facet.musicSubject from dc.subject with type-attribute dkdcplus:DBCM",
        FacetIndex.createMusicSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createSheetMusic (partitur)", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield>' +
        '<marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="005">' +
        '<marcx:subfield code="i">e</marcx:subfield>' +
        '<marcx:subfield code="j">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "facet.sheetMusic",
        value: "alle partiturer"
    }, {
        name: "facet.sheetMusic",
        value: "klaverpartiturer"
    }, {
        name: "facet.sheetMusic",
        value: "stemmer"
    } ];

    Assert.equalValue( "Create facet.sheetMusic (partitur)",
        FacetIndex.createSheetMusic( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="g">xc</marcx:subfield>' +
        '<marcx:subfield code="a">a</marcx:subfield>' +
        '<marcx:subfield code="g">xe</marcx:subfield>' +
        '<marcx:subfield code="a">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "facet.sheetMusic",
        value: "e-noder"
    } ];

    Assert.equalValue( "Create facet.sheetMusic (E-node)",
        FacetIndex.createSheetMusic( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">t</marcx:subfield>' +
        '<marcx:subfield code="b">m</marcx:subfield>' +
        '<marcx:subfield code="b">r</marcx:subfield>' +
        '<marcx:subfield code="g">xe</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [];

    Assert.equal( "Create facet.sheetMusic (E-node), make sure multiple subfields do not incorrectly result in facet",
        FacetIndex.createSheetMusic( index, xml, MarcUtility.createRecordObjectFromIndexingData(xml) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="005">' +
        '<marcx:subfield code="h">y</marcx:subfield></marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "facet.sheetMusic",
        value: "music-minus-one"
    } ];

    Assert.equalValue( "Create facet.sheetMusic (music-minus-one)",
        FacetIndex.createSheetMusic( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "FacetIndex.createExtraTitles", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="n">c</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume">' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC999999</marcx:subfield>' +
        '<marcx:subfield code="x">ERE999999</marcx:subfield>' +
        '<marcx:subfield code="x">ERA201514</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "facet.extraTitles",
        value: "ekstra titler"
    } ];

    Assert.equalValue( "Create facet.extraTitles",
        FacetIndex.createExtraTitles( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );
