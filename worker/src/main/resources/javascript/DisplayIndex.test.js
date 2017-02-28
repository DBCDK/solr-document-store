use( "DisplayIndex" );
use( "Index" );
use( "UnitTest" );
use( "Marc" );
use( "MarcUtility" );

UnitTest.addFixture( "DisplayIndex.createTitleFull", function( ) {

    var marcObjects = {};
    marcObjects.type = "single";

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:title>Dagdriverbanden</dc:title>' +
        '<dc:title>Mus og maend</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Dagdriverbanden : Mus og maend</dc:title>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.titleFull",
        value: "Dagdriverbanden : Mus og maend"
    } ];

    Assert.equalValue( "Create display.titleFull from DKABM", DisplayIndex.createTitleFull( index, xml ), indexOut );

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
        '<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>' +
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

    indexOut = [ {
        name: "display.titleFull",
        value: "Min kamp : roman"
    } ];

    Assert.equalValue( "Create display.titleFull from marc",
        DisplayIndex.createTitleFull( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
    xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  \
    xmlns:marcx="info:lc/xmlns/marcxchange-v1"><dkabm:record>\
    <ac:identifier>29124965|870970</ac:identifier>\
    <ac:source>NJE</ac:source>\
    <dc:title>Koncert for violin og orkester nr. 1</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Koncert for violin og orkester nr. 1 (Herresthal)</dc:title>\
    <dcterms:alternative>Violin concertos nos 1 &amp; 2</dcterms:alternative>\
    <dcterms:alternative>Helle Nacht</dcterms:alternative>\
    <dc:creator>Per Noergaard (f. 1932)</dc:creator>\
    <dc:creator xsi:type="oss:sort">Noergaard, Per (f. 1932)</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">78.412:42</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Orkestermusik med soloinstrumenter</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">instrumental</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">orkester</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">violin</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">violinkoncert</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">violinkoncert</dc:subject>\
    <dc:description>Indspillet i Stavanger Konserthus, Norge august 2010</dc:description>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>BIS</dc:publisher>\
    <dc:contributor>Rolf Gupta</dc:contributor>\
    <dc:contributor>Peter Herresthal</dc:contributor>\
    <dc:contributor>Ida Mo</dc:contributor>\
    <dc:contributor>Per Noergaard (f. 1932)</dc:contributor>\
    <dc:contributor>Stavangers Symfoniorkester</dc:contributor>\
    <dc:date>2011</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>\
    <dc:format>1 cd, 1 kommentarbilag</dc:format>\
    <dc:identifier>BIS CD-1872</dc:identifier>\
    <dcterms:hasPart xsi:type="dkdcplus:track">Koncert for violin og orkester nr. 1</dcterms:hasPart>\
    <dcterms:hasPart xsi:type="dkdcplus:track">Tidsrum</dcterms:hasPart>\
    <dcterms:hasPart xsi:type="dkdcplus:track">Koncert for violin og orkester nr. 2</dcterms:hasPart>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Danmark</dcterms:spatial>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1980-1989</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1990-1999</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">2000-2009</dcterms:temporal>\
  </dkabm:record>\
<marcx:collection>\
    <marcx:record format="danMARC2" type="Bibliographic">\
      <marcx:leader>000000000000000000000000</marcx:leader>\
      <marcx:datafield tag="001" ind1="0" ind2="0">\
        <marcx:subfield code="a">29124965</marcx:subfield>\
        <marcx:subfield code="b">870970</marcx:subfield>\
        <marcx:subfield code="c">20120312180430</marcx:subfield>\
        <marcx:subfield code="d">20111209</marcx:subfield>\
        <marcx:subfield code="f">a</marcx:subfield>\
        <marcx:subfield code="t">FAUST</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="004" ind1="0" ind2="0">\
        <marcx:subfield code="r">n</marcx:subfield>\
        <marcx:subfield code="a">e</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="006" ind1="0" ind2="0">\
        <marcx:subfield code="a">20111205</marcx:subfield>\
        <marcx:subfield code="c">20120405</marcx:subfield>\
        <marcx:subfield code="2">a</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="008" ind1="0" ind2="0">\
        <marcx:subfield code="t">s</marcx:subfield>\
        <marcx:subfield code="u">f</marcx:subfield>\
        <marcx:subfield code="a">2011</marcx:subfield>\
        <marcx:subfield code="b">se</marcx:subfield>\
        <marcx:subfield code="v">0</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="009" ind1="0" ind2="0">\
        <marcx:subfield code="a">s</marcx:subfield>\
        <marcx:subfield code="g">xc</marcx:subfield>\
        <marcx:subfield code="b">a</marcx:subfield>\
        <marcx:subfield code="h">xx</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="023" ind1="0" ind2="0">\
        <marcx:subfield code="a">7318590018729</marcx:subfield>\
      </marcx:datafield>\
 <marcx:datafield tag="032" ind1="0" ind2="0">\
        <marcx:subfield code="a">DMO201211</marcx:subfield>\
        <marcx:subfield code="x">BKM201211</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="039" ind1="0" ind2="0">\
        <marcx:subfield code="a">ork</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="100" ind1="0" ind2="0">\
        <marcx:subfield code="0"/>\
        <marcx:subfield code="a">Noergaard</marcx:subfield>\
        <marcx:subfield code="h">Per</marcx:subfield>\
        <marcx:subfield code="c">f. 1932</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="239" ind1="0" ind2="0">\
        <marcx:subfield code="0"/>\
        <marcx:subfield code="t">Koncert for violin og orkester nr. 1</marcx:subfield>\
        <marcx:subfield code="u">Helle Nacht</marcx:subfield>\
        <marcx:subfield code="oe">Herresthal</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="245" ind1="0" ind2="0">\
        <marcx:subfield code="a">Violin concertos nos 1 &amp; 2</marcx:subfield>\
        <marcx:subfield code="e">Per Noergaard</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="260" ind1="0" ind2="0">\
        <marcx:subfield code="b">BIS</marcx:subfield>\
        <marcx:subfield code="c">p 2011</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield tag="300" ind1="0" ind2="0">\
        <marcx:subfield code="n">1 cd</marcx:subfield>\
        <marcx:subfield code="d">1 kommentarbilag</marcx:subfield>\
      </marcx:datafield>\
 </marcx:record>\
  </marcx:collection>\
    <adminData>\
    <recordStatus>active</recordStatus><creationDate>2012-01-27</creationDate>\
    <libraryType>none</libraryType><indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType><genre>fiktion</genre><collectionIdentifier>870970-basis</collectionIdentifier>\
    </adminData>\
    </ting:container>'
    );

    indexOut = [ {
        name: "display.titleFull",
        value: "Koncert for violin og orkester nr. 1"
    } ];


    Assert.equalValue( "Create display.titleFull from marc 239",
        DisplayIndex.createTitleFull( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ), marcObjects ), indexOut );

    /* unittest for volume with 245a, Langs Jyllands vestkyst -- OBS Danish characters in xml not yet removed!
    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>06646840|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Livet på øerne</dc:title><dc:title xsi:type="dkdcplus:full">Livet på øerne : Langs Jyllands vestkyst</dc:title><dc:creator xsi:type="dkdcplus:aut">Erik Ꜳlbæk Jensen</dc:creator><dc:creator xsi:type="oss:sort">Ꜳlbæk Jensen, Erik</dc:creator><dc:subject xsi:type="dkdcplus:DK5">46</dc:subject><dc:subject xsi:type="dkdcplus:DK5-Text">Danmark</dc:subject><dc:description>Indhold: Havboer ; Hindø ; Tipperne ; Langli ; Fanø ; Mandø ; Rømø ; Jordsand</dc:description><dcterms:audience>voksenmaterialer</dcterms:audience><dc:publisher>Gyldendal</dc:publisher><dc:date>1987</dc:date><dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type><dc:format>illustreret, delvis i farver</dc:format><dcterms:extent>343 sider</dcterms:extent><dcterms:extent>8 bind</dcterms:extent><dc:identifier xsi:type="dkdcplus:ISBN">87-00-73081-5</dc:identifier><dc:language xsi:type="dcterms:ISO639-2">dan</dc:language><dc:language>Dansk</dc:language></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001">' +
'<marcx:subfield code="a">06646840</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">19890602</marcx:subfield><marcx:subfield code="d">19880114</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="o">c</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="004">' +
'<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="008">' +
'<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">1987</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="009">' +
'<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="018">' +
'<marcx:subfield code="a">50350215</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="021">' +
'<marcx:subfield code="a">87-00-73081-5</marcx:subfield><marcx:subfield code="d">kr. 348,00</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="032">' +
'<marcx:subfield code="a">DBF198805</marcx:subfield><marcx:subfield code="x">SFD198805</marcx:subfield><marcx:subfield code="x">NDF190305</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="100">' +
'<marcx:subfield code="a">Ꜳlbæk Jensen</marcx:subfield><marcx:subfield code="h">Erik</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="245">' +
'<marcx:subfield code="a">Livet på øerne</marcx:subfield><marcx:subfield code="e">[af] Erik Ꜳlbæk Jensen</marcx:subfield><marcx:subfield code="c">Langs Jyllands vestkyst</marcx:subfield><marcx:subfield code="f">[korttegninger: Alice Rosenstand</marcx:subfield><marcx:subfield code="f">sort-hvide fotografier: Erik Ꜳlbæk Jensen</marcx:subfield><marcx:subfield code="f">farvefotografier: Austin Grandjean</marcx:subfield><marcx:subfield code="f">fotografier side ...: Palle Uhd Jepsen ... Thorkild Balslev]</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="260">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1987</marcx:subfield><marcx:subfield code="k">Nørhaven,Viborg</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="260">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield><marcx:subfield code="b">Gyldendal</marcx:subfield><marcx:subfield code="c">1981-1987</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="300">' +
'<marcx:subfield code="a">343 sider</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="300">' +
'<marcx:subfield code="a">8 bind</marcx:subfield><marcx:subfield code="b">ill., delvis i farver</marcx:subfield><marcx:subfield code="c">26 cm</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="530">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Indhold: Havboer ; Hindø ; Tipperne ; Langli ; Fanø ; Mandø ; Rømø ; Jordsand</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="652">' +
'<marcx:subfield code="m">46</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="900">' +
'<marcx:subfield code="a">Jensen</marcx:subfield><marcx:subfield code="h">Erik Ꜳlbæk</marcx:subfield><marcx:subfield code="z">100</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="996">' +
'<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield></marcx:record><marcx:record format="danMARC2" type="BibliographicMain"><marcx:leader>00000n    2200000   4500</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001">' +
'<marcx:subfield code="a">50350215</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">19890602</marcx:subfield><marcx:subfield code="d">19811023</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="o">c</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="004">' +
'<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="008">' +
'<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="009">' +
'<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="021">' +
'<marcx:subfield code="a">87-00-04222-6</marcx:subfield><marcx:subfield code="b">kplt 8 bind</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield><marcx:subfield code="d">i subskription pr bind kr 278.00</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="100">' +
'<marcx:subfield code="a">Ꜳlbæk Jensen</marcx:subfield><marcx:subfield code="h">Erik</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="245">' +
'<marcx:subfield code="a">Livet på øerne</marcx:subfield><marcx:subfield code="e">[af] Erik Ꜳlbæk Jensen</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="260">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">[Kbh.]</marcx:subfield><marcx:subfield code="b">Gyldendal</marcx:subfield><marcx:subfield code="c">1981-1987</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="300">' +
'<marcx:subfield code="a">8 bind</marcx:subfield><marcx:subfield code="b">ill., delvis i farver</marcx:subfield><marcx:subfield code="c">26 cm</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="652">' +
'<marcx:subfield code="m">46</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="900">' +
'<marcx:subfield code="a">Jensen</marcx:subfield><marcx:subfield code="h">Erik Ꜳlbæk</marcx:subfield><marcx:subfield code="z">100</marcx:subfield></marcx:datafield></marcx:record><marcx:record format="danMARC2" type="BibliographicVolume"><marcx:leader>00000n    2200000   4500</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001">' +
'<marcx:subfield code="a">06646840</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">19890602</marcx:subfield><marcx:subfield code="d">19880114</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="o">c</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="004">' +
'<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="008">' +
'<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">1987</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="014">' +
'<marcx:subfield code="a">50350215</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="021">' +
'<marcx:subfield code="a">87-00-73081-5</marcx:subfield><marcx:subfield code="d">kr. 348,00</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="032">' +
'<marcx:subfield code="a">DBF198805</marcx:subfield><marcx:subfield code="x">SFD198805</marcx:subfield><marcx:subfield code="x">NDF190305</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="245">' +
'<marcx:subfield code="&amp;">b</marcx:subfield><marcx:subfield code="a">Langs Jyllands vestkyst</marcx:subfield><marcx:subfield code="f">[korttegninger: Alice Rosenstand</marcx:subfield><marcx:subfield code="f">sort-hvide fotografier: Erik Ꜳlbæk Jensen</marcx:subfield><marcx:subfield code="f">farvefotografier: Austin Grandjean</marcx:subfield><marcx:subfield code="f">fotografier side ...: Palle Uhd Jepsen ... Thorkild Balslev]</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="260">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1987</marcx:subfield><marcx:subfield code="k">Nørhaven,Viborg</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="300">' +
'<marcx:subfield code="a">343 sider</marcx:subfield>' +
'</marcx:datafield>' +
'<marcx:datafield ind1="0" ind2="0" tag="530">' +
'<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Indhold: Havboer ; Hindø ; Tipperne ; Langli ; Fanø ; Mandø ; Rømø ; Jordsand</marcx:subfield></marcx:datafield></marcx:record></marcx:collection><adminData><recordStatus>active</recordStatus><creationDate>2005-03-01</creationDate><libraryType>none</libraryType><indexingAlias>danmarcxchange</indexingAlias><accessType>physical</accessType><genre>nonfiktion</genre><workType>literature</workType><collectionIdentifier>870970-basis</collectionIdentifier></adminData></ting:container>');
    indexOut = [ {
            name: "display.titleFull",
            value: "Livet p\xe5 \xf8erne"
        }
    ];

    Assert.equalValue( "Create display.titleFull from multivolume record with 245a and no 245g",
        DisplayIndex.createTitleFull( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ), marcObjects ), indexOut );
    */
} );

UnitTest.addFixture( "DisplayIndex.createDependentTitle", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
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
    var indexOut = [ {
        name: "display.dependentTitle",
        value: "Ordklasser"
    } ];

    Assert.equalValue( "Create Dependent Title from 245y",
        DisplayIndex.createDependentTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );



UnitTest.addFixture( "DisplayIndex.createLanguage", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.language",
        value: "Dansk"
    } ];

    Assert.equalValue( "Create display.language", DisplayIndex.createLanguage( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '<dc:language>Flere sprog</dc:language>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:language xsi:type="dcterms:ISO639-2">nor</dc:language>' +
        '<dc:language>Norsk</dc:language>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );

    indexOut = [ {
        name: "display.language",
        value: "Flere sprog"
    } ];

    Assert.equalValue( "Create display.language", DisplayIndex.createLanguage( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/"  xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );

    indexOut = [ ];

    Assert.equalValue( "Create no display.language as no language is given", DisplayIndex.createLanguage( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createLanguage", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ ];

    Assert.equalValue( "Create no display.language", DisplayIndex.createLanguage( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.type",
        value: "Bog"
    } ];

    Assert.equalValue( "Create display.type (simple) no marcxchange", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (baand)</dc:type>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">undefined</dc:type>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Sammensat materiale</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.type",
        value: "Lydbog (baand)"
    }, {
        name: "display.type",
        value: "Bog"
    }, {
        name: "display.type",
        value: "Sammensat materiale"
    } ];

    Assert.equalValue( "Create display.type (complex)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="BibliographicMain">' +
        '</marcx:record>' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield tag="245" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Game of thrones</marcx:subfield><marcx:subfield code="ø">Sæson 3</marcx:subfield>' +
        '<marcx:subfield code="g">Disc 2, episodes 3 &amp; 4</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<workType>movie</workType>' +
        '</adminData>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "display.type",
        value: "Dvd (Disc 2, episodes 3 & 4)"
    } ];

    Assert.equalValue( "Create display.type tv-series", DisplayIndex.createType( index, xml ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

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
        '<dkdcplus:version>1. udgave</dkdcplus:version><dc:publisher>Lindhardt og Ringhof</dc:publisher>' +
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
        '<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>' +
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
        '<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>' +
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
        '<marcx:record format="danMARC2" type="BibliographicVolume">' +
        '<marcx:leader>00000n    2200000   4500</marcx:leader>' +
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
        '</adminData></ting:container>'
    );

    var volumeObject = {
        mainData: "",
        volumeData: "",
        volumeType: ""
    };

    var valueObject = {
        mainData: "",
        volumeData: "bind 5",
        volumeType: ""
    };

    Assert.equalValue( "Create multi volume description", DisplayIndex.createMultiVolumeDescription( xml, volumeObject ), valueObject );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

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
        '</dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
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
        '<marcx:subfield code="g">15. bog</marcx:subfield>' +
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
        '</ting:container>'
    );

    var volumeObject = {
        mainData: "",
        volumeData: "",
        volumeType: ""
    };

    var valueObject = {
        mainData: "",
        volumeData: "bind 15",
        volumeType: ""
    };

    Assert.equalValue( "Create multi volume description (2-digits)", DisplayIndex.createMultiVolumeDescription( xml, volumeObject ), valueObject );

    var index = Index.newIndex();
    var indexOut = [ {
        name: "display.type",
        value: "Bog (bind 15)"
    } ];
    Assert.equalValue( "Create type with multi volume description (2-digits)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
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
        '<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="o">b</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield>' +
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
        '<marcx:subfield code="a">29957339</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield' +
        '><marcx:subfield code="c">20130617110059</marcx:subfield><marcx:subfield code="d">20130506</marcx:subfield>' +
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
        '</adminData></ting:container>'
    );

    var indexOut = [ {
        name: "display.type",
        value: "Bog (4 dyrefabler om bogstaverne A, B, C, D)"
    } ];

    Assert.equalValue( "Create multi volume description (no 245g, uses 245a1)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

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
        '<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>' +
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

    var indexOut = [ {
        name: "display.type",
        value: "Bog (Ordklasser)"
    } ];

    Assert.equalValue( "Create single volume description (with 245y)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
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
        '<dc:contributor>Nationalmuseet</dc:contributor>' +
        '<dc:date>2002</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcterms:extent>Side 5044-5176</dcterms:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7468-622-4</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language></dkabm:record>' +
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
        '<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>' +
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
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Danmarks kirker</marcx:subfield>' +
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
        '<marcx:subfield code="a">Nationalmuseet</marcx:subfield></marcx:datafield>' +
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
        '<marcx:subfield code="a">bind</marcx:subfield>' +
        '<marcx:subfield code="b">ill. (nogle i farver)</marcx:subfield>' +
        '<marcx:subfield code="c">28 cm</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">1.-2. og 6.-8. bind / ved Vibeke Michelsen og Kjeld de Fine Licht, 3. bind / ' +
        'ved Vibeke Michelsen og Kjeld de Fine Licht ; under medvirken af Ulla H???strup, 9.-10. bind / ' +
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
        '<marcx:datafield ind1="0" ind2="0" tag="014">' +
        '<marcx:subfield code="a">50326292</marcx:subfield>' +
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
        '<marcx:subfield code="g">9. bind, 52. hefte</marcx:subfield>' +
        '<marcx:subfield code="a">[Tamdrup]</marcx:subfield>' +
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

    var indexOut = [ {
        name: "display.type",
        value: "Bog (bind 16)"
    }, {
        name: "display.multiVolumeType",
        value: "section"
    } ];

    Assert.equalValue( "Create multi volume with section description (create MultiVolumeType)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>21891355|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Soeren Kierkegaards skrifter</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Soeren Kierkegaards skrifter : Af en endnu Levendes Papirer : Om Begrebet Ironi. Bind K1</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Soeren Kierkegaard</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Kierkegaard, Soeren</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">04.6</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Danske forfatteres v??rker af blandet indhold</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">filosofiske skrifter</dc:subject>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>Soeren Kierkegaard Forskningscenteret</dc:publisher>' +
        '<dc:publisher>Gad</dc:publisher><dc:contributor>N. J. Cappelarn</dc:contributor>' +
        '<dc:contributor>Soeren Kierkegaard Forskningscenteret</dc:contributor>' +
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
        '<marcx:subfield code="a">87-12-03179-8</marcx:subfield><marcx:subfield code="c">ib.</marcx:subfield>' +
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
        '<marcx:subfield code="a">Kierkegaard</marcx:subfield><marcx:subfield code="h">Soeren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Soeren Kierkegaards skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels Joergen Cappelarn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="c">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="c">Om Begrebet Ironi</marcx:subfield><marcx:subfield code="g">[Bind] K1</marcx:subfield>' +
        '<marcx:subfield code="f">oversaettere fra hebraisk Bodil Ejrnaes</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield>' +
        '<marcx:subfield code="k">Noerhaven, Viborg</marcx:subfield>' +
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
        '<marcx:subfield code="a">Cappelarn</marcx:subfield><marcx:subfield code="h">N. J.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">Soeren Kierkegaard Forskningscenteret</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Cappelarn</marcx:subfield><marcx:subfield code="h">Niels Joergen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">Koebenhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">Soeren Kierkegaard Forskningscenteret</marcx:subfield>' +
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
        '<marcx:subfield code="a">Kierkegaard</marcx:subfield><marcx:subfield code="h">Soeren</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">Soeren Kierkegaards skrifter</marcx:subfield>' +
        '<marcx:subfield code="f">redaktion: Niels Joergen Cappelarn ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="y">Kommentarbind</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield>' +
        '<marcx:subfield code="b">Soeren Kierkegaard Forskningscenteret</marcx:subfield>' +
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
        '<marcx:subfield code="a">Cappelarn</marcx:subfield><marcx:subfield code="h">Niels Joergen</marcx:subfield>' +
        '<marcx:subfield code="z">700</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="910">' +
        '<marcx:subfield code="a">Koebenhavns Universitet</marcx:subfield>' +
        '<marcx:subfield code="c">Soeen Kierkegaard Forskningscenteret</marcx:subfield>' +
        '<marcx:subfield code="z">710</marcx:subfield>' +
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
        '<marcx:subfield code="x">DAT200539</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="&amp;">b</marcx:subfield><marcx:subfield code="g">[Bind] K1</marcx:subfield>' +
        '<marcx:subfield code="a">Af en endnu Levendes Papirer</marcx:subfield>' +
        '<marcx:subfield code="a">Om Begrebet Ironi</marcx:subfield>' +
        '<marcx:subfield code="f">oversaettere fra hebraisk Bodil Ejrnaes</marcx:subfield>' +
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

    var indexOut = [ {
        name: "display.type",
        value: "Bog (Kommentarbind. Bind K1)"
    } ];

    Assert.equalValue( "Create multi volume with dependent title description (combine 245y and g/a)", DisplayIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
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
        '<marcx:subfield code="g">vol. 15</marcx:subfield>' +
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
        '<marcx:subfield code="g">vol. 15</marcx:subfield>' +
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
        '</ting:container>'
    );

    var volumeObject = {
        mainData: "",
        volumeData: "",
        volumeType: ""
    };

    var valueObject = {
        mainData: "",
        volumeData: "bind 15",
        volumeType: ""
    };

    Assert.equalValue( "Create multi volume description (vol)", DisplayIndex.createMultiVolumeDescription( xml, volumeObject ), valueObject );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" ' +
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
        '<marcx:datafield ind1="0" ind2="0" tag="521">' +
        '<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield>' +
        '<marcx:subfield code="u">nt</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="991">' +
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield></marcx:datafield>' +
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

    var volumeObject = {
        mainData: "",
        volumeData: "",
        volumeType: ""
    };

    var valueObject = {
        mainData: "",
        volumeData: "bind 1",
        volumeType: ""
    };

    Assert.equalValue( "Create multi volume description (with [])",
        DisplayIndex.createMultiVolumeDescription( xml, volumeObject ), valueObject );

} );

UnitTest.addFixture( "DisplayIndex.createMultiVolumeDescription", function( ) {

    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record><ac:identifier>29189129|870970</ac:identifier>' +
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
        '<marcx:subfield code="a">DBC</marcx:subfield' +
        '></marcx:datafield>' +
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
        '<collectionIdentifier>870970-basis</collectionIdentifier></adminData>' +
        '</ting:container>'
    );

    var volumeObject = {
        mainData: "",
        volumeData: "",
        volumeType: ""
    };

    var valueObject = {
        mainData: "",
        volumeData: "mappe 4",
        volumeType: ""
    };

    Assert.equalValue( "Create multi volume description (audiobook)",
        DisplayIndex.createMultiVolumeDescription( xml, volumeObject ), valueObject );

} );

UnitTest.addFixture( "DisplayIndex.createWorkType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Emnekasse</dc:type>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Sammensat materiale</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.workType",
        value: "book"
    }, {
        name: "display.workType",
        value: "other"
    }, {
        name: "display.workType",
        value: "other"
    } ];

    Assert.equalValue( "Create display.workType (several other types)", DisplayIndex.createWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createWorkType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.workType",
        value: "book"
    } ];

    Assert.equalValue( "Create display.workType (simple)", DisplayIndex.createWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createWorkType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Periodikum</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.workType",
        value: "periodica"
    } ];

    Assert.equalValue( "Create display.workType (periodica)", DisplayIndex.createWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createWorkType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic">' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
'<marcx:subfield code="a">s</marcx:subfield>' +
'</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "display.workType",
        value: "movie"
    }, {
        name: "display.workType",
        value: "music"
    } ];

    Assert.equalValue( "Create display.workType (music dvd)", DisplayIndex.createWorkType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.getWorkType", function( ) {

    Assert.equalValue( "Create one work type",
        DisplayIndex.getWorkType( "Bog" ), "book" );

    Assert.equalValue( "Create one work type (periodica)",
        DisplayIndex.getWorkType( "Periodikum" ), "periodica" );

} );

UnitTest.addFixture( "DisplayIndex.createAccessType", function( ) {

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
        '<adminData>' +
        '<libraryType>research</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.accessType",
        value: "physical"
    } ];

    Assert.equalValue( "Create display.accessType (one value)", DisplayIndex.createAccessType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createAccessType", function( ) {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<adminData>' +
        '<libraryType>research</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<accessType>online</accessType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.accessType",
        value: "physical"
    }, {
        name: "display.accessType",
        value: "online"
    } ];

    Assert.equalValue( "Create display.accessType (both values)", DisplayIndex.createAccessType( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createPartOf", function( ) {

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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Avisartikel</dc:type>' +
        '<dcterms:isPartOf>Politiken, 1986-05-06</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0907-1814</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var indexOut = [ {
        name: "display.partOf",
        value: "Politiken, 1986-05-06"
    } ];

    Assert.equalValue( "Create display.partOf", DisplayIndex.createPartOf( index, xml ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    marcObjects.type = "single";
    var record = new Record( );
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:title>Titel fra main delfelt a</dc:title>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "display.title",
        value: "Titel fra main delfelt a"
    } ];

    Assert.equalValue( "Create Title from single marcObject (type, Bog)", DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var commonDataXml = XmlUtil.fromString('<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>29189129|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>Min kamp</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 5. bog</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Karl Ove Knausgaard</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Knausgaard, Karl Ove</dc:creator>' +
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
        '<marcx:subfield code="o">Ekspres 201206</marcx:subfield></marcx:datafield>' +
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
        '</adminData></ting:container>'
    );

    var marcObjects = {};

    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "a", "Min kamp" );
    record.append( field );
    marcObjects.type = "main";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "g", "5. bog" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    var indexOut = [ {
        name: "display.title",
        value: "Min kamp"
    } ];

    Assert.equalValue( "Create Title from marcObject with volume (type: Bog) 1",
        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );


    index = Index.newIndex();
    marcObjects = {};

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Min kamp" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "5. bog" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    indexOut = [ {
        name: "display.title",
        value: "Min kamp"
    } ];

    Assert.equal( "Create Title from marcObject with volume (type: Bog) 2",
        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var record = new Record( );

    var field = new Field( "245", "00" );
    field.append( "a", "Titel fra  main delfelt a" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra  volume delfelt a" );
    field.append( "g", "Bindtitel fra volume delfelt g" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra section delfelt a" );
    field.append( "n", "Bindtitel fra section delfelt n" );
    record.append( field );
    marcObjects.type = "section";
    marcObjects.section = record;

    var indexOut = [ {
        name: "display.title",
        value: "Titel fra  main delfelt a. Bindtitel fra section delfelt n. " +
        "Titel fra section delfelt a. Bindtitel fra volume delfelt g. " +
        "Titel fra  volume delfelt a"
    } ];

    Assert.equalValue( "Create Title from section marcObject (type: Serie)",
        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "a", "Titel fra  main delfelt a" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra volume delfelt a" );
    field.append( "g", "Bindtitel fra volume delfelt g" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    var indexOut = [ {
        name: "display.title",
        value: "Titel fra  main delfelt a. Bindtitel fra volume delfelt g. Titel fra volume delfelt a"
    } ];

    Assert.equalValue( "Create Title from volume marcObject (type: Serie)",
        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createTitle", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append(  "a", "Titel fra  main delfelt a" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra volume delfelt a" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    var indexOut = [ {
        name: "display.title",
        value: "Titel fra  main delfelt a. Titel fra volume delfelt a"
    } ];

    Assert.equalValue( "Create Title from volume marcObject, no g subfield in volume (type: Serie)",
        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createTitleFull", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Aarbog</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "a", "Titel fra main delfelt a" );
    field.append( "b", "UnderTitel fra main delfelt b" );
    field.append( "c", "UnderTitel fra main delfelt c" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra volume delfelt a" );
    field.append( "g", "Bindtitel fra volume delfelt g" );
    field.append( "b", "UnderTitel fra volume delfelt b" );
    field.append( "c", "UnderTitel fra volume delfelt c" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    var indexOut = [ {
        name: "display.titleFull",
        value: "Titel fra main delfelt a UnderTitel fra main delfelt b : UnderTitel fra main delfelt c. " +
        "Bindtitel fra volume delfelt g. Titel fra volume delfelt a " +
        "UnderTitel fra volume delfelt b : UnderTitel fra volume delfelt c"
    } ];

    Assert.equalValue( "Create TitleFull from volume marcObject (type: Aarbog)",
        DisplayIndex.createTitleFull( index, commonDataXml, record, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createTitleFull", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Aarbog</dc:type>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "a", "Titel fra main delfelt a" );
    field.append( "c", "UnderTitel fra main delfelt c" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.main = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra volume delfelt a" );
    field.append( "g", "Bindtitel fra volume delfelt g" );
    field.append( "b", "UnderTitel fra volume delfelt b" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra section delfelt a" );
    field.append( "b", "UnderTitel fra section delfelt b" );
    field.append( "n", "Bindtitel fra section delfelt n" );
    record.append( field );
    marcObjects.type = "section";
    marcObjects.section = record;

    var indexOut = [ {
        name: "display.titleFull",
        value: "Titel fra main delfelt a : UnderTitel fra main delfelt c. " +
        "Bindtitel fra section delfelt n. Titel fra section delfelt a " +
        "UnderTitel fra section delfelt b. Bindtitel fra volume delfelt g. " +
        "Titel fra volume delfelt a UnderTitel fra volume delfelt b"
    } ];

    Assert.equalValue( "Create TitleFull from section marcObject, type: Aarbog",
        DisplayIndex.createTitleFull( index, commonDataXml, record, marcObjects ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createTitleFull", function( ) {
    var index = Index.newIndex();
    var marcObjects = {};

    var commonDataXml = XmlUtil.fromString('<ting:container ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<workType>movie</workType>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "a", "Damages" );
    field.append( "\u00f8", "Saeson 2" );
    field.append( "g", "Disc 1" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.merged = record;

    record = new Record( );
    field = new Field( "245", "00" );
    field.append( "a", "Titel fra volume delfelt a" );
    field.append( "g", "Bindtitel fra volume delfelt g" );
    field.append( "\u00f8", "UnderTitel fra volume delfelt \u00f8" );
    record.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record;

    var indexOut = [ {
        name: "display.titleFull",
        value: "Damages. Saeson 2"
    } ];

    Assert.equalValue( "Create TitleFull from section marcObject, tv-show ",
        DisplayIndex.createTitleFull( index, commonDataXml, record, marcObjects ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<genre>fiktion</genre>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );

    var record = new Record( );
    var field = new Field( "100", "00" );
    field.append( "a", "Efternavn" );
    field.append( "h", "Fornavn" );
    field.append( "4", "ill" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.single = record;

    var indexOut = [ {
        name: "display.creator",
        value: "Fornavn Efternavn"
    } ];

    Assert.equalValue( "Create Creator from field 100, fiction",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<genre>nonfiktion</genre>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "100", "00" );
    field.append( "a", "Efternavn" );
    field.append( "h", "Fornavn" );
    field.append( "4", "ill" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.single = record;

    var indexOut = [ {
        name: "display.creator",
        value: "Fornavn Efternavn"
    } ];

    Assert.equalValue( "Create Creator from field 100, non-fiction",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<genre>nonfiktion</genre>' +
        '<workType>literature</workType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "700", "00" );
    field.append( "a", "Efternavn" );
    field.append( "h", "Fornavn" );
    field.append( "4", "ill" );
    record.append( field );
    marcObjects.type = "single";
    marcObjects.single = record;

    var indexOut = [ {
        name: "display.creator",
        value: "Fornavn Efternavn"
    } ];

    Assert.equalValue( "Create Creator from field 700, non-fiction 1 author",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );

UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<genre>fiktion</genre>' +
        '<workType>literature</workType>' +
        '<libraryType>research</libraryType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "700", "00" );
    field.append( "a", "Efternavn" );
    field.append( "h", "Fornavn" );
    field.append( "4", "aut" );
    record.append( field );
    marcObjects.main = record;
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn2" );
    field.append( "h", "Fornavn2" );
    field.append( "4", "duh" );
    record.append( field );
    marcObjects.main = record;
    var record2 = new Record( );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn i volume" );
    record2.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record2;

    var indexOut = [ {
        name: "display.creator",
        value: "Fornavn Efternavn"
    } ];

    Assert.equal( "Create Creator from field 700 - research library fiction with no 100 and no 245e",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:docbook="http://docbook.org/ns/docbook">' +
        '<dkabm:record>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Serie</dc:type>' +
        '</dkabm:record>' +
        '<adminData>' +
        '<genre>fiktion</genre>' +
        '<workType>literature</workType>' +
        '<libraryType>research</libraryType>' +
        '</adminData>' +
        '</ting:container>'
    );
    var record = new Record( );
    var field = new Field( "245", "00" );
    field.append( "e", "245e" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn" );
    field.append( "h", "Fornavn" );
    field.append( "4", "aut" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn2" );
    field.append( "h", "Fornavn2" );
    field.append( "4", "aut" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn3" );
    field.append( "h", "Fornavn3" );
    field.append( "4", "aut" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn4" );
    field.append( "h", "Fornavn4" );
    field.append( "4", "aut" );
    record.append( field );
    marcObjects.main = record;
    var record2 = new Record( );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn i volume" );
    record2.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record2;

    var indexOut = [ {
        name: "display.creator",
        value: "Fornavn Efternavn"
    } ];

    Assert.equal( "Create Creator from field 700 - research library book with no 100 but with 245e and more than 3 700",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var marcObjects = {};
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
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
        '<ac:identifier>34805539|870971</ac:identifier>' +
        '<ac:source>Avisartikler</ac:source>' +
        '<dc:title>I Murakamis verden</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">I Murakamis verden</dc:title>' +
        '<dc:creator>Mette Holm</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Holm, Mette</dc:creator>' +
        '<dc:subject xsi:type="dkdcplus:DK5">99.4 Murakami, Haruki</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Biografier af enkelte personer</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCF">Haruki Murakami</dc:subject>' +
        '<dc:subject xsi:type="oss:sort">Murakami, Haruki</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCF">japansk litteratur</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCF">oversaettelse</dc:subject>' +
        '<dcterms:abstract>Haruki Murakamis danske oversaetter har arbejdet med hans nyeste vaerk</dcterms:abstract>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:date>2011</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Avisartikel</dc:type>' +
        '<dc:format>illustreret</dc:format>' +
        '<dcterms:extent>Sektion 4, s. 8-9</dcterms:extent>' +
        '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcterms:isPartOf>Politiken, 2011-10-01</dcterms:isPartOf>' +
        '<dcterms:isPartOf xsi:type="dkdcplus:ISSN">0907-1814</dcterms:isPartOf>' +
        '</dkabm:record>' +
        '<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield tag="001" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">34805539</marcx:subfield><marcx:subfield code="b">870971</marcx:subfield>' +
        '<marcx:subfield code="c">20111003141531</marcx:subfield><marcx:subfield code="d">20111003</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="004" ind1="0" ind2="0">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">i</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="008" ind1="0" ind2="0">' +
        '<marcx:subfield code="t">a</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2011</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>' +
        '<marcx:subfield code="d">y</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>' +
        '<marcx:subfield code="v">0</marcx:subfield><marcx:subfield code="r">an</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="009" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>' +
        '<marcx:subfield code="g">xe</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="016" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">03243850</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="032" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">ABU201141</marcx:subfield><marcx:subfield code="a">DAR201141</marcx:subfield>' +
        '<marcx:subfield code="x">IDA201141</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="086" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Biografier af enkelte personer</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="245" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">I Murakamis verden</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="300" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Sektion 4, s. 8-9</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="504" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Haruki Murakamis danske oversaetter har arbejdet med hans nyeste vaerk</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="557" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Politiken</marcx:subfield><marcx:subfield code="j">2011</marcx:subfield>' +
        '<marcx:subfield code="z">0907-1814</marcx:subfield><marcx:subfield code="V">2011-10-01</marcx:subfield>' +
        '<marcx:subfield code="v">2011-10-01</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="600" ind1="0" ind2="0">' +
        '<marcx:subfield code="1"></marcx:subfield><marcx:subfield code="a">Murakami</marcx:subfield>' +
        '<marcx:subfield code="h">Haruki</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="652" ind1="0" ind2="0">' +
        '<marcx:subfield code="m">99.4</marcx:subfield><marcx:subfield code="a">Murakami</marcx:subfield>' +
        '<marcx:subfield code="h">Haruki</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="666" ind1="0" ind2="0">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="f">japansk litteratur</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="666" ind1="0" ind2="0">' +
        '<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="f">oversættelse</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="666" ind1="0" ind2="0">' +
        '<marcx:subfield code="0">**oessays</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="700" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">Holm</marcx:subfield><marcx:subfield code="h">Mette</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="996" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">IDX</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="d08" ind1="0" ind2="0">' +
        '<marcx:subfield code="o">sny</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="d09" ind1="0" ind2="0">' +
        '<marcx:subfield code="z">IFM111001</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="n01" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">e2e57585</marcx:subfield><marcx:subfield code="b">000011</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="n55" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">20111003</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="s12" ind1="0" ind2="0">' +
        '<marcx:subfield code="t">TeamBAR201140</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="z02" ind1="0" ind2="0">' +
        '<marcx:subfield code="d">e2e57585</marcx:subfield><marcx:subfield code="t">Infomedia</marcx:subfield>' +
        '<marcx:subfield code="b">000002</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="z43" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">1585</marcx:subfield><marcx:subfield code="b">9423</marcx:subfield>' +
        '<marcx:subfield code="c">1628</marcx:subfield><marcx:subfield code="g">ART</marcx:subfield>' +
        '<marcx:subfield code="s">Boger</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield tag="z99" ind1="0" ind2="0">' +
        '<marcx:subfield code="a">sny</marcx:subfield></marcx:datafield></marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2011-10-03</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<accessType>online</accessType>' +
        '<genre>nonfiktion</genre>' +
        '<workType>article</workType>' +
        '<workType>analysis</workType>' +
        '<collectionIdentifier>870971-avis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var record = new Record( );
    var field = new Field( "700", "00" );
    field.append( "a", "Holm" );
    field.append( "h", "Mette" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Jensen" );
    field.append( "h", "Niels" );
    record.append( field );
    marcObjects.main = record;
    var record2 = new Record( );
    field = new Field( "700", "00" );
    field.append( "a", "Efternavn i volume" );
    record2.append( field );
    marcObjects.type = "volume";
    marcObjects.volume = record2;

    var indexOut = [ {
        name: "display.creator",
        value: "Mette Holm"
    }, {
        name: "display.creator",
        value: "Niels Jensen"
    } ];

    Assert.equalValue( "Create Creator from field 700 - article with 2 worktypes",
        DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/">' +
        '<dkabm:record>' +
        '<dc:title>Raising steam</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Raising steam</dc:title>' +
        '<dc:title xsi:type="dkdcplus:series">A Discworld novel</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Terry Pratchett</dc:creator>' +
        '</dkabm:record>' +
        '</ting:container>'
    );

    var indexOut = [ {
        name: "display.creator",
        value: "Terry Pratchett"
    } ];

    Assert.equalValue( "Create Creator from field dkabm",
        DisplayIndex.createCreator( index, commonDataXml ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCreator", function( ) {

    var index = Index.newIndex();
    var commonDataXml = XmlUtil.fromString('<ting:container ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" ' +
        'xmlns:docbook="http://docbook.org/ns/docbook" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:marcx="info:lc/xmlns/marcxchange-v1">' +
        '<dkabm:record><ac:identifier>24966429|870970</ac:identifier>' +
        '<ac:source>Bibliotekskatalog</ac:source>' +
        '<dc:title>The lord of the rings</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">The lord of the rings</dc:title>' +
        '<dcterms:alternative>The lord of the rings : original motion picture soundtrack</dcterms:alternative>' +
        '<dcterms:alternative>Kongen vender tilbage</dcterms:alternative>' +
        '<dc:subject xsi:type="dkdcplus:DK5">78.81:8</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DK5-Text">Operaer, syngespil, operetter, revyer, skuespilmusik m.v.</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCM">filmmusik</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:genre">filmmusik - soundtracks</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCM">instrumental</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCM">kor</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCM">orkester</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCO">soundtracks</dc:subject>' +
        '<dc:subject xsi:type="dkdcplus:DBCM">vokal</dc:subject>' +
        '<dkdcplus:shelf xsi:type="oss:musicshelf">Filmmusik</dkdcplus:shelf>' +
        '<dc:description>Cd-rom-del: internetlink</dc:description>' +
        '<dc:description>Tekster på omslag</dc:description>' +
        '<dc:description>"Enhanced CD"</dc:description>' +
        '<dcterms:audience>voksenmaterialer</dcterms:audience>' +
        '<dc:publisher>WEA International</dc:publisher>' +
        '<dc:contributor>Viggo Mortensen (f. 1958-10-20)</dc:contributor>' +
        '<dc:contributor>Howard Shore</dc:contributor>' +
        '<dc:contributor>Peter Jackson (f. 1961)</dc:contributor>' +
        '<dc:contributor>Ben Del Maestro</dc:contributor>' +
        '<dc:contributor>Renée Fleming</dc:contributor>' +
        '<dc:contributor>James Galway</dc:contributor>' +
        '<dc:contributor>Annie Lennox</dc:contributor>' +
        '<dc:contributor>London Voices</dc:contributor>' +
        '<dc:contributor>The London Oratory School Schola</dc:contributor>' +
        '<dc:contributor>Londons Filharmoniske Orkester</dc:contributor>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>' +
        '<dc:format>1 cd/cd-rom</dc:format>' +
        '<dc:identifier>WMG Soundtracks Reprise 9362-48521-2</dc:identifier>' +
        '<dc:language xsi:type="dcterms:ISO639-2">eng</dc:language>' +
        '<dc:language>Engelsk</dc:language>' +
        '<dcterms:hasPart xsi:type="dkdcplus:track">Into the West</dcterms:hasPart>' +
        '<dcterms:spatial xsi:type="dkdcplus:DBCM">Canada</dcterms:spatial>' +
        '<dcterms:temporal xsi:type="dkdcplus:DBCM">2000-2009</dcterms:temporal>' +
        '</dkabm:record>' +
        '<marcx:collection>' +
        '<marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>00000n    2200000   4500</marcx:leader>' +
        '<marcx:datafield ind1="0" ind2="0" tag="001">' +
        '<marcx:subfield code="a">24966429</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>' +
        '<marcx:subfield code="c">20051231010749</marcx:subfield><marcx:subfield code="d">20031126</marcx:subfield>' +
        '<marcx:subfield code="f">a</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="004">' +
        '<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="005">' +
        '<marcx:subfield code="h">e</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="008">' +
        '<marcx:subfield code="t">s</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>' +
        '<marcx:subfield code="a">2003</marcx:subfield><marcx:subfield code="b">xx</marcx:subfield>' +
        '<marcx:subfield code="l">eng</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="009">' +
        '<marcx:subfield code="a">s</marcx:subfield><marcx:subfield code="b">t</marcx:subfield>' +
        '<marcx:subfield code="g">xc</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="021">' +
        '<marcx:subfield code="d">kr. 149,00</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="023">' +
        '<marcx:subfield code="a">0093624852124</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="032">' +
        '<marcx:subfield code="x">SFG200350</marcx:subfield><marcx:subfield code="x">DAT200439</marcx:subfield>' +
        '<marcx:subfield code="x">DAT990601</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="039">' +
        '<marcx:subfield code="a">fil</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="239">' +
        '<marcx:subfield code="t">The ¤lord of the rings</marcx:subfield><marcx:subfield code="7"> (</marcx:subfield>' +
        '<marcx:subfield code="v">The ¤return of the king</marcx:subfield><marcx:subfield code="7">)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="245">' +
        '<marcx:subfield code="a">The ¤lord of the rings</marcx:subfield>' +
        '<marcx:subfield code="u">The ¤return of the king</marcx:subfield>' +
        '<marcx:subfield code="c">original motion picture soundtrack</marcx:subfield>' +
        '<marcx:subfield code="e">music composed, orchestrated and conducted by Howard Shore ... [et al.]</marcx:subfield>' +
        '<marcx:subfield code="e">performed by the London Philharmonic Orchestra, the London Voices</marcx:subfield>' +
        '<marcx:subfield code="e">soloists: Annie Lennox, Renée Fleming, Sir James Galway, Ben del Maestro</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="260">' +
        '<marcx:subfield code="a">[S.l.]</marcx:subfield><marcx:subfield code="b">WEA International</marcx:subfield>' +
        '<marcx:subfield code="c">p 2003</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="300">' +
        '<marcx:subfield code="n">1 cd/cd-rom</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Cd-rom-del: internetlink</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">Tekster på omslag</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="512">' +
        '<marcx:subfield code="a">"Enhanced CD"</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="526">' +
        '<marcx:subfield code="i">Af lydsporet til Peter Jacksons film ; dansk titel</marcx:subfield>' +
        '<marcx:subfield code="t">Ringenes herre (Kongen vender tilbage)</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="531">' +
        '<marcx:subfield code="a">Af indholdet:</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="538">' +
        '<marcx:subfield code="f">WMG Soundtracks</marcx:subfield><marcx:subfield code="f">Reprise</marcx:subfield>' +
        '<marcx:subfield code="g">9362-48521-2</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="652">' +
        '<marcx:subfield code="m">78.81</marcx:subfield><marcx:subfield code="v">8</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="m">filmmusik</marcx:subfield>' +
        '<marcx:subfield code="n">instrumental</marcx:subfield><marcx:subfield code="n">orkester</marcx:subfield>' +
        '<marcx:subfield code="n">vokal</marcx:subfield><marcx:subfield code="n">kor</marcx:subfield>' +
        '<marcx:subfield code="p">2000-2009</marcx:subfield><marcx:subfield code="l">Canada</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="666">' +
        '<marcx:subfield code="0"/><marcx:subfield code="o">soundtracks</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Mortensen</marcx:subfield><marcx:subfield code="h">Viggo</marcx:subfield>' +
        '<marcx:subfield code="c">f. 1958-10-20</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Shore</marcx:subfield><marcx:subfield code="h">Howard</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Jackson</marcx:subfield><marcx:subfield code="h">Peter</marcx:subfield>' +
        '<marcx:subfield code="c">f. 1961</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="å">1</marcx:subfield><marcx:subfield code="A">delmaestro</marcx:subfield>' +
        '<marcx:subfield code="a">Del Maestro</marcx:subfield><marcx:subfield code="h">Ben</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Fleming</marcx:subfield><marcx:subfield code="h">Renée</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="700">' +
        '<marcx:subfield code="a">Galway</marcx:subfield><marcx:subfield code="h">James</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">London Voices</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">The ¤London Oratory School Schola</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="710">' +
        '<marcx:subfield code="a">Londons Filharmoniske Orkester</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="745">' +
        '<marcx:subfield code="a">Kongen vender tilbage</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="770">' +
        '<marcx:subfield code="å">11</marcx:subfield><marcx:subfield code="a">Lennox</marcx:subfield>' +
        '<marcx:subfield code="h">Annie</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="795">' +
        '<marcx:subfield code="å">11</marcx:subfield><marcx:subfield code="a">Into the West</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="900">' +
        '<marcx:subfield code="a">Maestro</marcx:subfield><marcx:subfield code="h">Ben del</marcx:subfield>' +
        '<marcx:subfield code="z">700/1</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="990">' +
        '<marcx:subfield code="a">SFG</marcx:subfield><marcx:subfield code="o">200350</marcx:subfield>' +
        '<marcx:subfield code="c">C</marcx:subfield><marcx:subfield code="t">16.01.04</marcx:subfield>' +
        '</marcx:datafield>' +
        '<marcx:datafield ind1="0" ind2="0" tag="996">' +
        '<marcx:subfield code="a">DBC</marcx:subfield>' +
        '</marcx:datafield>' +
        '</marcx:record>' +
        '</marcx:collection>' +
        '<adminData>' +
        '<recordStatus>active</recordStatus>' +
        '<creationDate>2005-03-02</creationDate>' +
        '<libraryType>none</libraryType>' +
        '<indexingAlias>danmarcxchange</indexingAlias>' +
        '<accessType>physical</accessType>' +
        '<workType>music</workType>' +
        '<collectionIdentifier>870970-basis</collectionIdentifier>' +
        '</adminData>' +
        '</ting:container>'
    );

    var marcObjects = {};

     var record = new Record( );
     var field = new Field( "700", "00" );
     field.append( "a", "Efternavn 1" );
     field.append( "h", "Fornavn 1" );
     field.append( "4", "ill" );
     record.append( field );
     field = new Field( "700", "00" );
     field.append( "a", "Efternavn 2" );
     field.append( "h", "Fornavn 2" );
     field.append( "4", "aut" );
     record.append( field );
     marcObjects.type = "single";
     marcObjects.single = record;

    var indexOut = [];

    Assert.equalValue( "Create Creator DBC nonfic no author", DisplayIndex.createCreator( index, commonDataXml, marcObjects ), indexOut );

} );


UnitTest.addFixture( "DisplayIndex.createCoverUrl", function( ) {

    var index = Index.newIndex();

    var commonDataXml = XmlUtil.fromString('\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
  <ln:links xmlns:ln="http://oss.dbc.dk/ns/links">\
    <ln:link>\
      <ln:relationType>dbcaddi:hasOnlineAccess</ln:relationType>\
      <ln:url>http://www.bibzoom.dk/cgi-bin/WebObjects/TShop.woa/wa/PSShop/MusicCollection?sku=0000000000588786</ln:url>\
    </ln:link>\
    <ln:link>\
      <ln:relationType>dbcaddi:hasCover</ln:relationType>\
      <ln:url>http://www.shop2download.com/images/87/86/0000000000588786_256x256_large.jpg</ln:url>\
    </ln:link>\
    <ln:link>\
      <ln:relationType>dbcaddi:hasCover</ln:relationType>\
      <ln:url>http://www.shop2download.com/images/87/86/0000000000588786_128x128_medium.jpg</ln:url>\
    </ln:link>\
    <ln:link>\
      <ln:relationType>dbcaddi:hasCover</ln:relationType>\
      <ln:url>http://www.shop2download.com/images/87/86/0000000000588786_48x48_small.jpg</ln:url>\
    </ln:link>\
  </ln:links>\
</ting:container>');

    var indexOut = [ {
        name: "display.coverUrl",
        value: "http://www.shop2download.com/images/87/86/0000000000588786_256x256_large.jpg"
    }, {
        name: "display.coverUrl",
        value: "http://www.shop2download.com/images/87/86/0000000000588786_128x128_medium.jpg"
    }, {
        name: "display.coverUrl",
        value: "http://www.shop2download.com/images/87/86/0000000000588786_48x48_small.jpg"
    } ];

    Assert.equalValue( "Create cover url from links elements", DisplayIndex.createCoverUrl( index, commonDataXml ), indexOut );

} );
