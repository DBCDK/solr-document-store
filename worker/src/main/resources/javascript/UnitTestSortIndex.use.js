use( "Index" );
use( "SortIndex" );
use( "UnitTest" );
use( "MarcUtility" );
use( "XmlUtil" );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>25211626|870970</ac:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Pc-spil (net)</dc:type>' +
        '<dc:date>2012</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Pc-spil net  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort.complexKey",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>25211626|870970</ac:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Pc-spil (net)</dc:type>' +
        '<dc:date>19911999</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Pc-spil net  a  9999  2009  a"
    } ];

    Assert.equalValue( "Create sort.complexKey date 8 digits",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>25211626|870970</ac:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Pc-spil (net)</dc:type>' +
        '<dc:date>????</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Pc-spil net  a  9999  4000  a"
    } ];

    Assert.equalValue( "Create sort.complexKey date all ????",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>25211626|870970</ac:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Pc-spil (net)</dc:type>' +
        '<dc:date>180</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Pc-spil net  a  9999  2200  a"
    } ];

    Assert.equalValue( "Create sort.complexKey date 3 digits",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );


} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

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
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 5. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield>' +
        '<marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">2012</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018"><marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield>' +
        '<marcx:subfield code="h">Karl Ove</marcx:subfield><marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">5. bog</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield><' +
        '/marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">5. bog</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0a5  a  9999  1988  a"
    } ];
    Assert.equalValue( "Create sort complex key volume description",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 15. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">15. bog</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300"' +
        '><marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">15. bog</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260"' +
        '><marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0b15  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key description (2-digits)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. Bd. 1-2</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield>' +
        '<marcx:subfield code="d">20120127</marcx:subfield><marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield>' +
        '<marcx:subfield code="h">Karl Ove</marcx:subfield><marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">Bd. 1-2</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield>' +
        '<marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">Bd. 1-2</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>' );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0a1-2  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key description (digits with hyphen, Bd. 1-2)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. Bd. 20-24</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008"' +
        '><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">Bd. 20-24</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014"><marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="g">Bd. 20-24</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre' +
        '><collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>' );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0b20-24  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key description (digits with hyphen, to digtigts, Bd. 20-24)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. Aargang 1991-92</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">Aargang 1990-91</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet5</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">Aargang 1990-91</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield>' +
        '<marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind Aargang 1990-91  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key description (digits with hyphen, Aargang 1990-91)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );


UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29957339|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Morgenthalers alfabet</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Morgenthalers alfabet : 4 dyrefabler om bogstaverne A, B, C, D</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Skonlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alfabetet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">bogstaver</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">dyrefortaellinger</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">fabler</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">for 10 aar</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">for 8 aar</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">for 9 aar</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCN">let at laese</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">sjove boeger</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Vi hoerer om skildpadden Arne, kaenguruen Bent, kamaeleonen Chris og dovendyret Dennis</dcterms:abstract>' +
        '<dcterms:audience>boernematerialer</dcterms:audience>' +
        '<dc:publisher>Carlsen</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:drm">Anders Morgenthaler</dc:contributor>' +
        '<dc:date>2013</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:format>illustreret (nogle i farver)</dc:format>' +
        '<dcterms:extent>29 sider</dcterms:extent>' +
        '<dcterms:extent>7 bind</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29957339</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130617110059</marcx:subfield><marcx:subfield code="d">20130506</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2013</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">j</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="o">b</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">29981949</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201319</marcx:subfield><marcx:subfield code="a">DBF201324</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201324</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Morgenthaler</marcx:subfield><marcx:subfield code="h">Anders</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield><marcx:subfield code="4">drm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Morgenthalers alfabet</marcx:subfield>' +
        '<marcx:subfield code="c">4 dyrefabler om bogstaverne A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Carlsen</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">29 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">7 bind</marcx:subfield><marcx:subfield code="b">ill. (nogle i farver)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Vi hoerer om skildpadden Arne, kaenguruen Bent, kamaeleonen Chris og dovendyret Dennis</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">86</marcx:subfield><marcx:subfield code="z">096</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">fabler</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">dyrefortaellinger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alfabetet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">bogstaver</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">sjove boeger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">let at laese</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 8 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 9 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 10 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201324</marcx:subfield><marcx:subfield code="b">l</marcx:subfield>' +
        '<marcx:subfield code="b">b</marcx:subfield><marcx:subfield code="b">s</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29981949</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130529155613</marcx:subfield><marcx:subfield code="d">20130523</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">j</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="o">b</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711389249</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">bind 1-7 saelges samlet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Morgenthaler</marcx:subfield><marcx:subfield code="h">Anders</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield><marcx:subfield code="4">drm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Morgenthalers alfabet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Carlsen</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">7 bind</marcx:subfield><marcx:subfield code="b">ill. (nogle i farver)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">86</marcx:subfield><marcx:subfield code="z">096</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">fabler</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">dyrefortaellinger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alfabetet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">bogstaver</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">sjove boeger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">let at laese</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 8 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 9 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="u">for 10 aar</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29957339</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130617110059</marcx:subfield><marcx:subfield code="d">20130506</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield>' +
        '<marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2013</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">29981949</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201319</marcx:subfield>' +
        '<marcx:subfield code="a">DBF201324</marcx:subfield><marcx:subfield code="x">BKM201324</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">4 dyrefabler om bogstaverne A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">29 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Vi hoerer om skildpadden Arne, kaenguruen Bent, kamaeleonen Chris og dovendyret Dennis</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2013</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">skildpadder</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">kaenguruer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">kamaeleoner</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">dovendyr</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="745">' +
        '<marcx:subfield code="a">A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201324</marcx:subfield><marcx:subfield code="b">l</marcx:subfield>' +
        '<marcx:subfield code="b">b</marcx:subfield><marcx:subfield code="b">s</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2013-05-06</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>' );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  4 dyrefabler om bogstaverne A, B, C, D  a  9999  1987  a"
    } ];

    Assert.equalValue( "Create sort complex key description (no 245g, uses 245a1)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>28381026|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Dyrk dansk</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Dyrk dansk. Ordklasser</dc:title>' +
        '<dc:subject xsi:type="dkdcplus:DK5">89.69</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Laeseboeger og andre materialer til laeseundervisning af blandet indhold</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Alfabeta</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:aut">Anne Weile</dc:contributor>' +
        '<dc:contributor xsi:type="dkdcplus:aut">Susanne M???rbjerg</dc:contributor>' +
        '<dc:date>2010</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>31 sider</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788763602679</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28381026</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20111019104500</marcx:subfield><marcx:subfield code="d">20100811</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">r</marcx:subfield>' +
        '<marcx:subfield code="a">2010</marcx:subfield><marcx:subfield code="z">2011</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">aa</marcx:subfield>' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="o">s</marcx:subfield><marcx:subfield code="x">04</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="011">' +
        '<marcx:subfield code="a">2 754 985 3</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788763602679</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 103,75</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF201143</marcx:subfield><marcx:subfield code="x">ACC201032</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Dyrk dansk</marcx:subfield>' +
        '<marcx:subfield code="e">Anne Weile, Susanne M???rbjerg</marcx:subfield>' +
        '<marcx:subfield code="f">billedredaktion: Signe Kock Polano</marcx:subfield>' +
        '<marcx:subfield code="y">Ordklasser</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Alfabeta</marcx:subfield><marcx:subfield code="c">2010</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">31 sider</marcx:subfield><marcx:subfield code="c">30 cm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">1. oplag</marcx:subfield><marcx:subfield code="c">2010</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">2. oplag</marcx:subfield><marcx:subfield code="c">2011</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">89.69</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Weile</marcx:subfield><marcx:subfield code="h">Anne</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">M???rbjerg</marcx:subfield><marcx:subfield code="h">Susanne</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2010-08-11</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  zzzzOrdklasser  a  9999  1990  a"
    } ];

    Assert.equalValue( "Create sort complex key description (with 245y)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>24156281|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Danmarks kirker</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Danmarks kirker : Tamdrup. 9. bind, 52. hefte</dc:title>' +
        '<dc:subject xsi:type="dkdcplus:DK5">71.86</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Kirkers og andre kultbygningers arkitektur og kunst. Danmark</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Nationalmuseet</dc:publisher>' +
        '<dc:publisher>Poul Kristensen Grafisk Virksomhed</dc:publisher>' +
        '<dc:publisher>Nationalmuseet</dc:publisher>' +
        '<dc:contributor>Ebbe Nyborg</dc:contributor>' +
        '<dc:contributor>Niels J??rgen Poulsen (f. 1947)</dc:contributor>' +
        '<dc:contributor>Nationalmuseet</dc:contributor><dc:date>2002</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>Side 5044-5176</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7468-622-4</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">24156281</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20020724232904</marcx:subfield><marcx:subfield code="d">20020704</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2002</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">50326292</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">50074773</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-7468-622-4</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 115,00</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF200230</marcx:subfield><marcx:subfield code="x">SFD200230</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Danmarks kirker</marcx:subfield><marcx:subfield code="c">[Tamdrup]</marcx:subfield>' +
        '<marcx:subfield code="g">9. bind, 52. hefte</marcx:subfield>' +
        '<marcx:subfield code="e">ved Ebbe Nyborg og Niels J??rgen Poulsen</marcx:subfield>' +
        '<marcx:subfield code="n">[Bind] 16</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Nationalmuseet</marcx:subfield><marcx:subfield code="a">Herning</marcx:subfield>' +
        '<marcx:subfield code="b">Poul Kristensen Grafisk Virksomhed</marcx:subfield>' +
        '<marcx:subfield code="c">2002</marcx:subfield>' +
        '<marcx:subfield code="k">Poul Kristensen Grafisk Virksomhed, Herning</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Nationalmuseet</marcx:subfield><marcx:subfield code="c">1933-</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">Side 5044-5176</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Med resum?? p?? engelsk og parallelle billtedtekster p?? dansk og engelsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">71.86</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Nyborg</marcx:subfield><marcx:subfield code="h">Ebbe</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Poulsen</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="c">f. 1947</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">Nationalmuseet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="a">SFD</marcx:subfield><marcx:subfield code="o">200230</marcx:subfield>' +
        '<marcx:subfield code="c">H</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">50074773</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20110124153343</marcx:subfield><marcx:subfield code="d">19770217</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield>' +
        '<marcx:subfield code="x">06</marcx:subfield><marcx:subfield code="x">04</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">Danmarks kirker</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Nationalmuseet</marcx:subfield><marcx:subfield code="c">1933-</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">71.86</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">Nationalmuseet</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicSection"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">50326292</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20080822083832</marcx:subfield><marcx:subfield code="d">19870121</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">s</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">50074773</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="n">[Bind] 16</marcx:subfield><marcx:subfield code="a">??rhus Amt</marcx:subfield>' +
        '<marcx:subfield code="e">ved Kjeld de Fine Licht, Vibeke Michelsen, Niels J??rgen Poulsen</marcx:subfield>' +
        '<marcx:subfield code="f">with summaries in English</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">bind</marcx:subfield><marcx:subfield code="b">ill. (nogle i farver)</marcx:subfield>' +
        '<marcx:subfield code="c">28 cm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">1.-2. og 6.-8. bind / ved Vibeke Michelsen og Kjeld de Fine Licht, ' +
        '3. bind / ved Vibeke Michelsen og Kjeld de Fine Licht ; under medvirken af Ulla H???strup, 9.-10. bind / ' +
        'ved Kjeld de Fine Licht og Vibeke Michelsen ; under medvirken af Birgitte B??ggild Johannsen ... et al., ' +
        '11. bind ved Hugo Johannsen ... [et al.]</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">24156281</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20020724232904</marcx:subfield><marcx:subfield code="d">20020704</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2002</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014"><marcx:subfield code="a">50326292</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-7468-622-4</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 115,00</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF200230</marcx:subfield><marcx:subfield code="x">SFD200230</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="d">eng</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">9. bind, 52. hefte</marcx:subfield><marcx:subfield code="a">[Tamdrup]</marcx:subfield>' +
        '<marcx:subfield code="e">ved Ebbe Nyborg og Niels J??rgen Poulsen</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Nationalmuseet</marcx:subfield><marcx:subfield code="a">Herning</marcx:subfield>' +
        '<marcx:subfield code="b">Poul Kristensen Grafisk Virksomhed</marcx:subfield>' +
        '<marcx:subfield code="c">2002</marcx:subfield>' +
        '<marcx:subfield code="k">Poul Kristensen Grafisk Virksomhed, Herning</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">Side 5044-5176</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="508">' +
        '<marcx:subfield code="a">Med resum?? p?? engelsk og parallelle billtedtekster p?? dansk og engelsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Nyborg</marcx:subfield><marcx:subfield code="h">Ebbe</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Poulsen</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="c">f. 1947</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="a">SFD</marcx:subfield><marcx:subfield code="o">200230</marcx:subfield>' +
        '<marcx:subfield code="c">H</marcx:subfield></marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2005-03-01</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0b16  a  9999  1998  a"
    } ];

    Assert.equalValue( "Create sort complex key with section description (Danmarks Kirker)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

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
        '<ac:identifier>21891355|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>S??ren Kierkeg???rds skrifter</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">S??ren Kierkeg???rds skrifter : Af en endnu Levendes Papirer : Om Begrebet Ironi. Bind K1</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">S??ren Kierkeg???rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Kierkeg???rd, S??ren</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">04.6</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Danske forfatteres v??rker af blandet indhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">filosofiske skrifter</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>S??ren Kierkeg???rd Forskningscenteret</dc:publisher>' +
        '<dc:publisher>Gad</dc:publisher>' +
        '<dc:contributor>N. J. Cappel??rn</dc:contributor>' +
        '<dc:contributor>S??ren Kierkeg???rd Forskningscenteret</dc:contributor>' +
        '<dc:date>1997</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:format>illustreret</dc:format>' +
        '<dcterms:extent>387 sider</dcterms:extent>' +
        '<dcterms:extent>bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-12-03179-8</dc:identifier>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-12-03191-7</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCF">Danmark</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1800-1899</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891355</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130604100306</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">1997</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">21891592</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03179-8</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 900,00 (Bind 1-3 og Kommentarbind, K1-K2/3)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03191-7</marcx:subfield><marcx:subfield code="c">levering som bogblok</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF199747</marcx:subfield><marcx:subfield code="x">SFD199747</marcx:subfield>' +
        '<marcx:subfield code="x">DAT200539</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Kierkeg???rd</marcx:subfield><marcx:subfield code="h">S??ren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rds skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels J??rgen Cappel??rn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="c">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="c">Om Begrebet Ironi</marcx:subfield><marcx:subfield code="g">[Bind] K1</marcx:subfield>' +
        '<marcx:subfield code="f">overs??ttere fra hebraisk Bodil Ejrn??s, fra latin Fritz S???by Pedersen, fra gr??sk Sophia Scopet??a, fra tysk Per ??hrg???rd</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield>' +
        '<marcx:subfield code="k">N??rhaven, Viborg</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="b">Gad</marcx:subfield><marcx:subfield code="g">[eksp. NBC]</marcx:subfield>' +
        '<marcx:subfield code="c">1997???</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">387 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">bind</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">04.6</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1800-1899</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="e">Danmark</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="o">filosofiske skrifter</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield>' +
        '<marcx:subfield code="h">N. J.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">K??benhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="z">710</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891592</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130405095403</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield>' +
        '<marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield>' +
        '<marcx:subfield code="x">06</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="011">' +
        '<marcx:subfield code="a">2 189 070 7</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Kierkeg???rd</marcx:subfield><marcx:subfield code="h">S??ren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rds skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels J??rgen Cappel??rn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="y">Kommentarbind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="b">Gad</marcx:subfield><marcx:subfield code="g">[eksp. NBC]</marcx:subfield>' +
        '<marcx:subfield code="c">1997???</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">bind</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">04.6</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1800-1899</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"/><marcx:subfield code="e">Danmark</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="o">filosofiske skrifter</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Cappel??rn</marcx:subfield>' +
        '<marcx:subfield code="h">N. J.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">K??benhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield><marcx:subfield code="z">710</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891355</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130604100306</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">1997</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014"><marcx:subfield code="a">21891592</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03179-8</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 900,00 (Bind 1-3 og Kommentarbind, K1-K2/3)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03191-7</marcx:subfield><marcx:subfield code="c">levering som bogblok</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF199747</marcx:subfield><marcx:subfield code="x">SFD199747</marcx:subfield>' +
        '<marcx:subfield code="x">DAT200539</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="&amp;">b</marcx:subfield><marcx:subfield code="g">[Bind] K1</marcx:subfield>' +
        '<marcx:subfield code="a">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="a">Om Begrebet Ironi</marcx:subfield>' +
        '<marcx:subfield code="f">overs??ttere fra hebraisk Bodil Ejrn??s, fra latin Fritz S???by Pedersen, fra gr??sk Sophia Scopet??a, fra tysk Per ??hrg???rd</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield>' +
        '<marcx:subfield code="k">N??rhaven, Viborg</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">387 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2005-03-01</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  zzzzKommentarbind bind Bind K0a1  a  9999  2003  a"
    } ];

    Assert.equal( "Create sort complex key with dependent title description (combine 245y and g/a)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );


} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/"' +
        ' xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>21891355|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>S??ren Kierkeg???rds skrifter</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">S??ren Kierkeg???rds skrifter : Af en endnu Levendes Papirer : Om Begrebet Ironi. Bind K1</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">S??ren Kierkeg???rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Kierkeg???rd, S??ren</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">04.6</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Danske forfatteres v??rker af blandet indhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">filosofiske skrifter</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>S??ren Kierkeg???rd Forskningscenteret</dc:publisher><dc:publisher>Gad</dc:publisher>' +
        '<dc:contributor>N. J. Cappel??rn</dc:contributor>' +
        '<dc:contributor>S??ren Kierkeg???rd Forskningscenteret</dc:contributor>' +
        '<dc:date>1997</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:format>illustreret</dc:format>' +
        '<dcterms:extent>387 sider</dcterms:extent>' +
        '<dcterms:extent>bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-12-03179-8</dc:identifier>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-12-03191-7</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCF">Danmark</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1800-1899</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891355</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130604100306</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">1997</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">21891592</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03179-8</marcx:subfield>' +
        '<marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 900,00 (Bind 1-3 og Kommentarbind, K1-K2/3)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03191-7</marcx:subfield>' +
        '<marcx:subfield code="c">levering som bogblok</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF199747</marcx:subfield><marcx:subfield code="x">SFD199747</marcx:subfield>' +
        '<marcx:subfield code="x">DAT200539</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Kierkeg???rd</marcx:subfield><marcx:subfield code="h">S??ren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rds skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels J??rgen Cappel??rn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="c">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="c">Om Begrebet Ironi</marcx:subfield><marcx:subfield code="g">[Bind] K1</marcx:subfield>' +
        '<marcx:subfield code="f">overs??ttere fra hebraisk Bodil Ejrn??s, fra latin Fritz S???by Pedersen, fra gr??sk Sophia Scopet??a, fra tysk Per ??hrg???rd</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield>' +
        '<marcx:subfield code="k">N??rhaven, Viborg</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="b">Gad</marcx:subfield>' +
        '<marcx:subfield code="g">[eksp. NBC]</marcx:subfield><marcx:subfield code="c">1997???</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">387 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">bind</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">04.6</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1800-1899</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"/><marcx:subfield code="e">Danmark</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="o">filosofiske skrifter</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">N. J.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">K??benhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="z">710</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield></marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891592</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130405095403</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">y</marcx:subfield>' +
        '<marcx:subfield code="x">06</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="011">' +
        '<marcx:subfield code="a">2 189 070 7</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Kierkeg???rd</marcx:subfield><marcx:subfield code="h">S??ren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rds skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels J??rgen Cappel??rn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="y">Kommentarbind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="b">Gad</marcx:subfield><marcx:subfield code="g">[eksp. NBC]</marcx:subfield>' +
        '<marcx:subfield code="c">1997???</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">bind</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="532">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Litteraturhenvisninger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">04.6</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1800-1899</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="e">Danmark</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="o">filosofiske skrifter</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">N. J.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Cappel??rn</marcx:subfield><marcx:subfield code="h">Niels J??rgen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">K??benhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">S??ren Kierkeg???rd Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="z">710</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">21891355</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130604100306</marcx:subfield><marcx:subfield code="d">19971028</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">1997</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">21891592</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03179-8</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">kr. 900,00 (Bind 1-3 og Kommentarbind, K1-K2/3)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="a">87-12-03191-7</marcx:subfield>' +
        '<marcx:subfield code="c">levering som bogblok</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="a">DBF199747</marcx:subfield><marcx:subfield code="x">SFD199747</marcx:subfield>' +
        '<marcx:subfield code="x">DAT200539</marcx:subfield' +
        '></marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="&amp;">b</marcx:subfield><marcx:subfield code="g">[Bind] K13</marcx:subfield>' +
        '<marcx:subfield code="a">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="a">Om Begrebet Ironi</marcx:subfield' +
        '><marcx:subfield code="f">overs??ttere fra hebraisk Bodil Ejrn??s, fra latin Fritz S???by Pedersen, fra gr??sk Sophia Scopet??a, fra tysk Per ??hrg???rd</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield>' +
        '<marcx:subfield code="k">N??rhaven, Viborg</marcx:subfield>' +
        '</marcx:datafield' +
        '><marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">387 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2005-03-01</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  zzzzKommentarbind bind Bind K0b13  a  9999  2003  a"
    } ];

    Assert.equalValue( "Create sort complex key with dependent title description (combine 245y and g/a) volumenumber 2 digits",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

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
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 15. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018"><marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">vol. 15</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet5</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '<marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20121112092831</marcx:subfield>' +
        '<marcx:subfield code="d">20100624</marcx:subfield><marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666"' +
        '><marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield>' +
        '<marcx:subfield code="d">20120127</marcx:subfield><marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014"><marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="e">9788711408667</marcx:subfield>' +
        '<marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">vol. 15</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250"><marcx:subfield code="a">1. udgave</marcx:subfield>' +
        '<marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991"' +
        '><marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0b15  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key description (vol)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

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
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 15. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language' +
        '><dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield>' +
        '<marcx:subfield code="d">20120127</marcx:subfield><marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">1. [bog]</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield>' +
        '<marcx:subfield code="h">Karl Ove</marcx:subfield><marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">1. [bog]</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="&amp;">REX</marcx:subfield>' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType><genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>' );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  bind 0a1  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key (with [])",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortComplexKey", function() {

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
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 15. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausg\u00E5rd</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausg\u00E5rd, Karl Ove</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Sk\u00F8nlitteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">b\u00F8rn</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">d\u00F8den</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">far-s\u00F8n forholdet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">for\u00E6ldre</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>' +
        '<dcterms:abstract>Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet.</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>' +
        '<dc:date>2012</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>699 sider</dcterms:extent>' +
        '<dcterms:extent>6 bind</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>' +
        '<dc:source>Min kamp</dc:source>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '<marcx:subfield code="g">Mappe 4 (kassette 25-26)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="041">' +
        '<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Knausg\u00E5rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="241">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">6 bind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">far-s\u00F8n forholdet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">d\u00F8den</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">for\u00E6ldre</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">b\u00F8rn</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="720">' +
        '<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield' +
        '><marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">28330405</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="g">Mappe 4 (kassette 25-26)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">÷</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="c">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="a">699 sider</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="504">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Karl Ove flytter til Bergen for at g\u00E5 p\u00E5 Skrivekunstakademiet.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield>' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield>' +
        '<marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2012-01-27</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "sort.complexKey",
        value: "Bog  mappe 0a4  a  9999  1988  a"
    } ];

    Assert.equalValue( "Create sort complex key (mappe 4)",
        SortIndex.createSortComplexKey( index, xml, dcxml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortAcquisitionDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<adminData>' +
        '<creationDate>2012-11-20</creationDate>' +
        '</adminData>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "sort.acquisitionDate",
        value: "20121120"
    } ];

    Assert.equalValue( "Create sort.acquisitionDate", SortIndex.createSortAcquisitionDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortAcquisitionDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<adminData></adminData>' +
        '</ting:container>' );

    var indexOut = [];

    Assert.equalValue( "Create no sort.acquisitionDate", SortIndex.createSortAcquisitionDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortLocalAcquisitionDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="096">' +
        '<marcx:subfield code="t">20131015</marcx:subfield><marcx:subfield code="z">870970</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="096">' +
        '<marcx:subfield code="z">870970</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record></marcx:collection>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "sort.localAcquisitionDate",
        value: "20131015"
    } ];

    Assert.equalValue( "Create sort.localAcquisitionDate", SortIndex.createSortLocalAcquisitionDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortCreator", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29957339|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Morgenthalers alfabet</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Morgenthalers alfabet : 4 dyrefabler om bogstaverne A, B, C, D</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Anders Morgenthaler</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Morgenthaler, Anders</dc:creator>' +
        '<dcterms:audience>boernematerialer</dcterms:audience>' +
        '<dc:publisher>Carlsen</dc:publisher>' +
        '<dc:contributor xsi:type="dkdcplus:drm">Anders Morgenthaler</dc:contributor>' +
        '<dc:date>2013</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:format>illustreret (nogle i farver)</dc:format>' +
        '<dcterms:extent>29 sider</dcterms:extent>' +
        '<dcterms:extent>7 bind</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29957339</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130617110059</marcx:subfield><marcx:subfield code="d">20130506</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2013</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">j</marcx:subfield>' +
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="o">b</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="018"><marcx:subfield code="a">29981949</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="x">ACC201319</marcx:subfield>' +
        '<marcx:subfield code="a">DBF201324</marcx:subfield><marcx:subfield code="x">BKM201324</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Morgenthaler</marcx:subfield><marcx:subfield code="h">Anders</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield><marcx:subfield code="4">drm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Morgenthalers alfabet</marcx:subfield>' +
        '<marcx:subfield code="c">4 dyrefabler om bogstaverne A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Carlsen</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2013</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">86</marcx:subfield><marcx:subfield code="z">096</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29981949</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130529155613</marcx:subfield><marcx:subfield code="d">20130523</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>' +
        '<marcx:subfield code="j">j</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="o">b</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="e">9788711389249</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
        '<marcx:subfield code="d">bind 1-7 saelges samlet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="a">Morgenthaler</marcx:subfield><marcx:subfield code="h">Anders</marcx:subfield>' +
        '<marcx:subfield code="4">aut</marcx:subfield><marcx:subfield code="4">drm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Morgenthalers alfabet</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield>' +
        '<marcx:subfield code="b">Carlsen</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="n">86</marcx:subfield><marcx:subfield code="z">096</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="o">sk</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">29957339</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20130617110059</marcx:subfield><marcx:subfield code="d">20130506</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2013</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">29981949</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">ACC201319</marcx:subfield><marcx:subfield code="a">DBF201324</marcx:subfield>' +
        '<marcx:subfield code="x">BKM201324</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">4 dyrefabler om bogstaverne A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="&amp;">REX</marcx:subfield>' +
        '<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2013</marcx:subfield>' +
        '<marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="745">' +
        '<marcx:subfield code="a">A, B, C, D</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2013-05-06</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<genre>fiktion</genre><collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var dcxml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.creator",
        value: "Morgenthaler, Anders"
    } ];

    Assert.equalValue( "Create sort creator", SortIndex.createSortCreator( index, xml, dcxml ), indexOut );

} );


UnitTest.addFixture( "SortIndex.createSortWorkType", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<oai_dc:dc ' +
        'xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">' +
        '<dc:type>Grammofonplade</dc:type>' +
        '<dc:type>WORK:music</dc:type>' +
        '</oai_dc:dc>'
    );

    var indexOut = [ {
        name: "sort.workType",
        value: "fmusic"
    } ];

    Assert.equalValue( "Create sort.workType", SortIndex.createSortWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createWorkType", function() {

    Assert.equalValue( "Create work type", SortIndex.createWorkType( "game" ), "ggame" );

} );

UnitTest.addFixture( "SortIndex.createSortRecordOwner", function() {

    var index = Index.newIndex();
    var pid = "870970-basis:1234568";

    var indexOut = [ {
        name: "sort.recordOwner",
        value: "a870970"
    } ];

    Assert.equalValue( "Create sort.recordOwner", SortIndex.createSortRecordOwner( index, pid ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortArticleDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="557">' +
        '<marcx:subfield code="a">Jyllands-posten</marcx:subfield><marcx:subfield code="j">2012</marcx:subfield>' +
        '<marcx:subfield code="z">0109-1182</marcx:subfield><marcx:subfield code="V">2012-07-14</marcx:subfield>' +
        '<marcx:subfield code="v">2012-07-14</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record></marcx:collection></ting:container>' );

    var indexOut = [ {
        name: "sort.articleDate",
        value: "20120714"
    } ];

    Assert.equalValue( "Create sort.articleDate",
        SortIndex.createSortArticleDate( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortArticleDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="557">' +
        '<marcx:subfield code="a">Jyllands-posten</marcx:subfield><marcx:subfield code="j">2012</marcx:subfield>' +
        '<marcx:subfield code="z">0109-1182</marcx:subfield><marcx:subfield code="V">2012</marcx:subfield>' +
        '<marcx:subfield code="v">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record></marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [];

    Assert.equalValue( "Create no sort.articleDate",
        SortIndex.createSortArticleDate( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createSortTitle", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Titel fra a</marcx:subfield><marcx:subfield code="j">2012</marcx:subfield>' +
        '<marcx:subfield code="z">0109-1182</marcx:subfield><marcx:subfield code="V">2012</marcx:subfield>' +
        '<marcx:subfield code="v">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record></marcx:collection></ting:container>' );

    var indexOut = [ {
        name: "sort.title",
        value: "Titel fra a"
    } ];

    Assert.equalValue( "Create sort.title",
        SortIndex.createSortTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="A">Titel fra stort A</marcx:subfield><marcx:subfield code="a">Titel fra a</marcx:subfield>' +
        '<marcx:subfield code="j">2012</marcx:subfield><marcx:subfield code="z">0109-1182</marcx:subfield>' +
        '<marcx:subfield code="V">2012</marcx:subfield><marcx:subfield code="v">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "sort.title",
        value: "Titel fra stort A"
    } ];

    Assert.equalValue( "Create sort.title with sortfield",
        SortIndex.createSortTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Title from 245a1</marcx:subfield>' +
        '<marcx:subfield code="a">Title from 245a2</marcx:subfield>' +
        '<marcx:subfield code="j">2012</marcx:subfield><marcx:subfield code="z">0109-1182</marcx:subfield>' +
        '<marcx:subfield code="V">2012</marcx:subfield><marcx:subfield code="v">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    indexOut = [ {
        name: "sort.title",
        value: "Title from 245a1"
    } ];

    Assert.equalValue( "Create sort.title from 245 with several a subfields",
        SortIndex.createSortTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="239">' +
        '<marcx:subfield code="t">Titel fra 239</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="239">' +
        '<marcx:subfield code="a">Titel fra a</marcx:subfield><marcx:subfield code="j">2012</marcx:subfield>' +
        '<marcx:subfield code="z">0109-1182</marcx:subfield><marcx:subfield code="V">2012</marcx:subfield>' +
        '<marcx:subfield code="v">2012</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection></ting:container>' );
    indexOut = [ {
        name: "sort.title",
        value: "Titel fra 239"
    } ];

    Assert.equalValue( "Create sort.title from field 239",
        SortIndex.createSortTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );


UnitTest.addFixture( "SortIndex.__fourDigitDate", function() {

    Assert.equalValue( "make four digit date (valid year)", SortIndex.__fourDigitDate( "1987" ), "1987" );
    Assert.equalValue( "make four digit date (starts with ?)", SortIndex.__fourDigitDate( "????" ), "0000" );
    Assert.equalValue( "make four digit date (date has only one digit outside year range)", SortIndex.__fourDigitDate( "6" ), "0000" );
    Assert.equalValue( "make four digit date (date has only one digit within year range)", SortIndex.__fourDigitDate( "2" ), "0000" );
    Assert.equalValue( "make four digit date (date has only two digits within year range)", SortIndex.__fourDigitDate( "20" ), "0000" );
    Assert.equalValue( "make four digit date (date has only three digits within year range)", SortIndex.__fourDigitDate( "200" ), "2000" );
    Assert.equalValue( "make four digit date (date has only three digits outside year range)", SortIndex.__fourDigitDate( "600" ), "0000" );
    Assert.equalValue( "make four digit date (? changed to 0)", SortIndex.__fourDigitDate( "198?" ), "1980" );
    Assert.equalValue( "make four digit date (?? changed to 00)", SortIndex.__fourDigitDate( "18??" ), "1800" );
    Assert.equalValue( "make four digit date (invalid future year, i.e. after 2099)", SortIndex.__fourDigitDate( "2198" ), "0000" );
    Assert.equalValue( "make four digit date (abbreviate year that is too long 1)", SortIndex.__fourDigitDate( "198706" ), "1987" );
    Assert.equalValue( "make four digit date (abbreviate year that is too long 2)", SortIndex.__fourDigitDate( "19991991" ), "1999" );
    Assert.equalValue( "make four digit date (abbreviate date YYYY-MM-DD to only year)", SortIndex.__fourDigitDate( "1999-12-04" ), "1999" );
    Assert.equalValue( "make four digit date (abbreviate date DD-MM-YYYY to only year)", SortIndex.__fourDigitDate( "12-04-1999" ), "1999" );
    Assert.equalValue( "make four digit date (abbreviate date DD.MM.YYYY to only year)", SortIndex.__fourDigitDate( "12.04.1999" ), "1999" );
    Assert.equalValue( "make four digit date (abbreviate date DD/MM/YYYY to only year)", SortIndex.__fourDigitDate( "12/04/1999" ), "1999" );

} );

UnitTest.addFixture( "SortIndex.createSortDate", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>>' +
        '<dc:date>2012</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "sort.date",
        value: "2012"
    } ];

    Assert.equalValue( "Create sort.date normal", SortIndex.createSortDate( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record><ac:identifier>29189129|870970</ac:identifier>' +
        '<dc:date>2012-13</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "sort.date",
        value: "2012"
    } ];

    Assert.equalValue( "Create sort.date hyphen", SortIndex.createSortDate( index, xml ), indexOut );

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
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<dc:date>20??</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "sort.date",
        value: "2000"
    } ];

    Assert.equalValue( "Create sort.date from date with ??", SortIndex.createSortDate( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.checkSpecialVersions", function() {

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="239">' +
        '<marcx:subfield code="t">Titel fra 239</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">2. udgave (S&#x00e6;rudgave)</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    var output = "b";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion saerudgave",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="239">' +
        '<marcx:subfield code="t">Titel fra 239</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="250">' +
        '<marcx:subfield code="a">2. udgave</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    output = "a";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion negativ",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="b">Bogklub</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    output = "b";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion bogklub",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="b">Specialudgave</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    output = "b";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion specialudgave",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (net)</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="b">Danmarks Blindebibliotek</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    output = "b";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion NOTA 1",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );

    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (net)</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="100">' +
        '<marcx:subfield code="b">874310</marcx:subfield>' +
        '</marcx:datafield></marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>' );

    output = "b";

    Assert.equalValue( "Test SortIndex.checkSpecialVersion NOTA 2",
        SortIndex.checkSpecialVersions( xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), output );


} );

UnitTest.addFixture( "SortIndex.createSortDk5", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
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
        '<dc:subject xsi:type="dkdcplus:DK5">99.4 Gershwin, George</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5">38.7</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "sort.dk5",
        value: "99.4 Gershwin, George"
    } ];

    Assert.equalValue( "Test SortIndex.createSortDk5 with 2 dk5 fields", SortIndex.createSortDk5( index, xml ), indexOut );

} );

UnitTest.addFixture( "SortIndex.createGenreCategory", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:marcx="info:lc/xmlns/marcxchange-v1" ' +
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
        name: "sort.genreCategory",
        value: "nonfiktion"
    } ];

    Assert.equalValue( "Create sort.genreCategory", SortIndex.createGenreCategory( index, xml ), indexOut );

} );


UnitTest.addFixture( "SortIndex.createNumberInSeries", function() {
    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title xsi:type="dkdcplus:full">Skammerens datter</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Skammerens datter ; 1</dc:title>' +
        '<dc:description xsi:type="dkdcplus:series">Samh\u00f8rende: Skammerens datter ; Skammertegnet ; Slangens gave ; Skammerkrigen</dc:description>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: 'sort.numberInSeries',
        value: '1'
    } ];


    Assert.equalValue( "Create sort.numberInSeries 1 from title", SortIndex.createSortNumberInSeries( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title xsi:type="dkdcplus:full">L\u00f8n som forskyldt</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Lademann bestsellers ; nr. 211</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '211'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 1 from title test 2", SortIndex.createSortNumberInSeries( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title xsi:type="dkdcplus:full">Game of thrones</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">A song of ice and fire ; Book 1</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '1'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 1 from title test 3", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title xsi:type="dkdcplus:full">Game of thrones</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Les hunger games ; livre 1</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">PKJ ; j2775</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '1'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 1 from title test 4", SortIndex.createSortNumberInSeries( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Twilight - tusm\u00f8rke</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Twilight - tusm\u00f8rke</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Tusm\u00f8rke-serien ; 2. bind</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '2'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 2 from title with 2. bind", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter og hemmelighedernes kammer</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter og hemmelighedernes kammer</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">The complete game and movie collection</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Harry Potter complete 8-film collection</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [];

    Assert.equalValue( "Do not Create sort.numberInSeries 1 from title", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter og fangen fra Azkaban</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter og fangen fra Azkaban</dc:title>' +
        '<dc:description xsi:type="dkdcplus:series">3. del af: Harry Potter og De Vises Sten</dc:description>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '3'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 3 from description", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter og hemmelighedernes kammer</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter og hemmelighedernes kammer</dc:title>' +
        '<dc:description xsi:type="dkdcplus:series">Samh\u00f8rende: Harry Potter og De Vises Sten ; ' +
        'Harry Potter og Hemmelighedernes Kammer ; Harry Potter og fangen fra Azkaban ; Harry Potter og Flammernes Pokal ;' +
        ' Harry Potter og F\u00f8nixordenen ; Harry Potter og halvblodsprinsen ; Harry Potter og d\u00f8dsregalierne</dc:description>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '2'
    } ];


    Assert.equalValue( "Create sort.numberInSeries 2 from description with samhoerende", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>My brilliant career</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">My brilliant career (Ved Carmen Callil)</dc:title>' +
        '<dc:description xsi:type="dkdcplus:series">Samh\u00f8rende. My brilliant career ; The end of my career</dc:description>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '1'
    } ];


    Assert.equalValue( "Create sort.numberInSeries 2 from description with samhoerende test2", SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter i darovi smrti</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter i darovi smrti</dc:title>' +
        '<dcterms:alternative>Harry Potter og d\u00f8dsregalierne</dcterms:alternative>' +
        '<dc:description xsi:type="dkdcplus:series">Samh\u00f8rende: Harry Potter og De Vises Sten ; ' +
        'Harry Potter og Hemmelighedernes Kammer ; Harry Potter og fangen fra Azkaban ; Harry Potter og Flammernes Pokal ;' +
        ' Harry Potter og F\u00f8nixordenen ; Harry Potter og halvblodsprinsen ; Harry Potter og d\u00f8dsregalierne</dc:description>' +
        '</dkabm:record>' +
        '</ting:container>' );


    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '7'
    } ];

    Assert.equalValue( "Create sort.numberInSeries 7 from description with samhoerende and dcterms:alternative",
        SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Traekopfuglens kroenik</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenik</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [];
    Assert.equalValue( "Create no sort.numberInSeries as no title or description with dkdcplus:series available",
        SortIndex.createSortNumberInSeries( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
    'xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
    'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
    'xmlns:ting="http://www.dbc.dk/ting" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '<dkabm:record>' +
        '<dc:title xsi:type="dkdcplus:full">Jeg er nummer fire</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">Arven fra Lorien ; #1</dc:title>'+
    '</dkabm:record>'+
    '</ting:container>');

    indexOut = [ {
        name: 'sort.numberInSeries',
        value: '1'
    } ];

    Assert.equalValue( "Create sort.numberInSeries for series title with #", SortIndex.createSortNumberInSeries( index, xml ), indexOut );

} );


UnitTest.addFixture( "SortIndex.createSortDateFirstEdition", function() {
    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Fra den moerke side</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Fra den moerke side</dc:title>' +
        '<dkdcplus:version>1. udgave</dkdcplus:version>' +
        '<dc:date>2012</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2012'
    } ];

    Assert.equalValue( "Create SortDateFirstEdition for record with 1. udgave in dkdcplus:version",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>En rejse gennem nætterne</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">En rejse gennem nætterne : Carmarde fortæller</dc:title>' +
        '<dkdcplus:version>1. udgave, 1. oplag (2010)</dkdcplus:version>' +
        '<dc:date>2010</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2010'
    } ];

    Assert.equalValue( "Create SortDateFirstEdition for record with 1. udgave in dkdcplus:version test2",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );



    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>En rejse gennem nætterne</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">En rejse gennem nætterne : Carmarde fortæller</dc:title>' +
        '<dkdcplus:version>1. udgave, 1. oplag (2010)</dkdcplus:version>' +
        '<dc:date>996?</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [  ];

    Assert.equalValue( "Create no SortDateFirstEdition for record with 1. udgave but invalid dc:date value",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter and the deathly hallows</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter and the deathly hallows</dc:title>' +
        '<dkdcplus:version>1. edition adult</dkdcplus:version>' +
        '<dc:date>2007</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2007'
    } ];

    Assert.equalValue( "Create SortDateFirstEdition for record with 1. edition in dkdcplus:version",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Te Deum et Jubilate</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Te Deum et Jubilate</dc:title>' +
        '<dkdcplus:version>The second edition</dkdcplus:version>' +
        '<dc:date>1725</dc:date>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    indexOut = [];
    Assert.equalValue( "Create no SortDateFirstEdition for record with second edition in dkdcplus:version",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );



    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Himmelherren</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Himmelherren</dc:title>' +
        '<dc:date>2004</dc:date>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Originaludgave: 2004</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2004'
    } ];


    Assert.equalValue( "Create SortDateFirstEdition for record without dkdcplus:version",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Harry Potter og Flammernes Pokal</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Harry Potter og Flammernes Pokal</dc:title>' +
        '<dc:date>2001</dc:date>' +
        '<dkdcplus:version>1. bogklubudgave, 7. oplag (2003)</dkdcplus:version>'+
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">Tidligere: 1. bogklubudgave. 2001</marcx:subfield>' +
            '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">1. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2001</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">3. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2001</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">4. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2001</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">5. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2002</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="a">6. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2002</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="b">7. oplag</marcx:subfield>' +
        '<marcx:subfield code="c">2003</marcx:subfield>'+
        '</marcx:datafield>' +
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ ];


    Assert.equalValue( "Create no SortDateFirstEdition for record dkdcplus:version 1. bogklubudgave and 13 oplag",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );


    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Slaget i Caissa</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Slaget i Caissa</dc:title>' +
        '<dc:date>2001</dc:date>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="&amp;">b</marcx:subfield>' +
        '<marcx:subfield code="i">Samlet udgave af hans</marcx:subfield>' +
        '<marcx:subfield code="t">Åbningen</marcx:subfield>' +
        '<marcx:subfield code="t">Tågemandens død</marcx:subfield>' +
        '<marcx:subfield code="t">Skakmat</marcx:subfield>' +
        '</marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Originaludgaver: 2000</marcx:subfield>' +
        '</marcx:datafield>'+
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2000'
    } ];


    Assert.equalValue( "Create SortDateFirstEdition for record without dkdcplus:version and with two 520 fields",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );



    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>Kenneth Bøgh Andersens Antboy - Tissemyrens bid</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Kenneth Bøgh Andersens Antboy - Tissemyrens bid</dc:title>' +
        '<dkdcplus:version>2. udgave</dkdcplus:version>'+
        '<dc:date>2011</dc:date>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">'+
        '<marcx:subfield code="a">Tidligere: 1. udgave. 2007</marcx:subfield>' +
        '<marcx:subfield code="n">26588707</marcx:subfield>' +
        '<marcx:subfield code="r">9788763805551</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2007'
    } ];


    Assert.equalValue( "Create SortDateFirstEdition for second edition record and with tidligere in 520",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );


    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>The treasure hunt</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">The treasure hunt: QR bog</dc:title>' +
        '<dkdcplus:version>2. udgave</dkdcplus:version>'+
        '<dc:date>2011</dc:date>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">'+
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">Originaludgave: 2014</marcx:subfield>' +
        '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="520">'+
        '<marcx:subfield code="a">Tidligere: 1. udgave. 2014</marcx:subfield>' +
        '<marcx:subfield code="n">51058801</marcx:subfield>' +
        '<marcx:subfield code="r">9788793183551</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '2014'
    } ];


    Assert.equalValue( "Create SortDateFirstEdition for second edition record and with Originaludgave in 520",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );


    index = Index.newIndex();


    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dc:title>The treasure hunt</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">The treasure hunt: QR bog</dc:title>' +
        '<dkdcplus:version>2. udgave</dkdcplus:version>'+
        '<dc:date>2011</dc:date>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '</marcx:record>'+
        '</marcx:collection>' +
        '</ting:container>'
    );

    indexOut = [ ];


    Assert.equalValue( "Create no SortDateFirstEdition if second edition record and with no field 520",
        SortIndex.createSortDateFirstEdition( index, xml ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
            '<dkdcplus:version>Revised version</dkdcplus:version>'+
            '<dc:title>Risø-M</dc:title>'+
            '<dc:date>1988</dc:date>'+
            '</dkabm:record>'+
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
            '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">Tidligere: 1. udgave med bindnummer: 2657. 1987</marcx:subfield>' +
        '</marcx:datafield>'+
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">' +
        'Til og med Risø-M-1845 udgivet af Danish Atomic Energy Commission, Research Establishment Risø ; Risø-M-1846 - 1941 udgivet af Research Establishment Risø</marcx:subfield>' +
        '</marcx:datafield>'+
            '</marcx:record>'+
            '</marcx:collection>'+
            '</ting:container>'
    );


    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '1987'
    } ];

    Assert.equalValue( "Create sortDateFirstEdition match the year", SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
    'xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
    'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
    'xmlns:ting="http://www.dbc.dk/ting" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '<dkabm:record>' +
        '<dc:title>46219 vej- og stednavne - Sjælland, Lolland-Falster</dc:title>'+
        '<dkdcplus:version>3. udgave, 1. oplag</dkdcplus:version>'+
        '<dc:date>1994</dc:date>'+
    '</dkabm:record>'+
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
            '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">' +
        'Tidligere: 2. udgave med titel: 42888 vej- og stednavne i 77 kommuner. 1993. - 1. udgave med titel: 42100 vej- og stednavne i 77 kommuner. 1993. (Ikke registrerede i: Dansk bogfortegnelse)' +
        '</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield>' +
        '<marcx:subfield code="a">' +
        'Tidligere: 2. udgave med titel: 42888 vej- og stednavne i 77 kommuner. 1993. - 1. udgave med titel: 42100 vej- og stednavne i 77 kommuner. 1993' +
        '</marcx:subfield>' +
        '</marcx:datafield>'+
            '</marcx:record>'+
            '</marcx:collection>'+
    '</ting:container>');

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '1993'
    } ];

    Assert.equalValue( "Create sortDateFirstEdition match the year 2", SortIndex.createSortDateFirstEdition( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString('<ting:container ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
    'xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
    'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
    'xmlns:ting="http://www.dbc.dk/ting" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '<dkabm:record>' +
        '<dc:title>Exercise Physiology</dc:title>'+
            '<dkdcplus:version>4th ed.</dkdcplus:version>'+
        '<dc:date>2014</dc:date>'+
    '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">' +
        'Tidligere: 3. udgave med titel: Exercise Physiology: for Health, Fitness, and Performance (ISBN: 0781779766 / ISBN-13: 9780781779760). 2010' +
        '</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">' +
        'Tidligere: 2. udgave med titel: Exercise Physiology: for Health, Fitness, and Performance (ISBN: 078179207X / ISBN-13: 9780781792073). 2007' +
        '</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="520">' +
        '<marcx:subfield code="a">' +
        'Tidligere: 1. udgave med titel: Exercise Physiology: For Health, Fitness and Performance (ISBN: 0205162029 / ISBN-13: 9780205162024). 1996' +
        '</marcx:subfield>' +
        '</marcx:datafield>'+
        '</marcx:record>'+
            '</marcx:collection>'+
    '</ting:container>');

    indexOut = [ {
        'name': 'sort.dateFirstEdition',
        'value': '1996'
    } ];

    Assert.equalValue( "Create sortDateFirstEdition match the year 3", SortIndex.createSortDateFirstEdition( index, xml ), indexOut );




} );