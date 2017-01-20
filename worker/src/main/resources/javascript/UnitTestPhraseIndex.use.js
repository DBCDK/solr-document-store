use( "PhraseIndex" );
use( "UnitTest" );
use( "Marc" );
use( "Index" );
use( "MarcUtility" );
use( "XmlUtil" );

UnitTest.addFixture( "PhraseIndex.createCreator", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" \
xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
<dkabm:record>\
<ac:identifier>06525822|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Loeven, heksen og garderobeskabet</dc:title>\
<dc:title xsi:type="dkdcplus:full">Loeven, heksen og garderobeskabet</dc:title>\
<dc:title xsi:type="dkdcplus:series">Narnia-serien ; 2</dc:title>\
<dc:creator xsi:type="dkdcplus:aut">C. S. Lewis</dc:creator>\
<dc:creator xsi:type="oss:sort">Lewis, C. S.</dc:creator>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Skoenlitteratur</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">det gode</dc:subject>\
<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">tro</dc:subject>\
<dcterms:abstract>Gennem et garderobeskab kommer boernene Peter, Susan, Edmund og Lucy til det fortryllede Narnia</dcterms:abstract>\
<dcterms:audience xsi:type="dkdcplus:age">Fra 10 aar</dcterms:audience>\
<dcterms:audience>boernematerialer</dcterms:audience>\
<dkdcplus:version>2. udgave, 20. oplag</dkdcplus:version>\
<dc:publisher>Borgen</dc:publisher>\
<dc:date>1987</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dc:identifier xsi:type="dkdcplus:ISBN">9788741881140</dc:identifier>\
<dc:source>The lion, the witch and the wardrobe</dc:source>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>000000000000000000000000</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">06525822</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">20100208005127</marcx:subfield><marcx:subfield code="d">19870429</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">r</marcx:subfield>\
<marcx:subfield code="a">1987</marcx:subfield><marcx:subfield code="z">2008</marcx:subfield>\
<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>\
<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="o">b</marcx:subfield>\
<marcx:subfield code="v">0</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041">\
<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">eng</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="042">\
<marcx:subfield code="a">29</marcx:subfield><marcx:subfield code="b">Ml 16,0 + Lo 12,5</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100">\
<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Lewis</marcx:subfield>\
<marcx:subfield code="h">C. S.</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241">\
<marcx:subfield code="a">The lion, the witch and the wardrobe</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Loeven, heksen og garderobeskabet</marcx:subfield>\
<marcx:subfield code="e">C.S. Lewis</marcx:subfield>\
<marcx:subfield code="e">oversat af \Niels Sondergaard\</marcx:subfield>\
<marcx:subfield code="f">illustreret af Pauline Baynes</marcx:subfield\
><marcx:subfield code="&#248;">Ved Niels S&#248;ndergaard</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="250">\
<marcx:subfield code="a">2. udgave</marcx:subfield><marcx:subfield code="x">20. oplag</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="a">Valby</marcx:subfield><marcx:subfield code="b">Borgen</marcx:subfield>\
<marcx:subfield code="k">Narayana Press, Gylling</marcx:subfield><marcx:subfield code="c">2008</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">171 sider</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="440">\
<marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Narnia</marcx:subfield>\
<marcx:subfield code="v">2</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="517">\
<marcx:subfield code="a">Fra 10 aar</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520">\
<marcx:subfield code="a">Originaludgave: 1950</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
</ting:container>' );
    //values from dkcclLfoFields are copied using schema.xml in solr
    var indexOut = [ {
        name: "phrase.creator",
        value: "C. S. Lewis"
    }, {
        name: "phrase.creator",
        value: "Lewis, C. S."
    }
    ];

    Assert.equalValue( "Create phrase.creator", PhraseIndex.createCreator( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );


UnitTest.addFixture( "PhraseIndex.createOriginalTitle", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
    <dkabm:record>\
        <ac:identifier>06525822|870970</ac:identifier>\
        <ac:source>Bibliotekskatalog</ac:source>\
        <dc:title>Loeven, heksen og garderobeskabet</dc:title>\
        <dc:title xsi:type="dkdcplus:full">Loeven, heksen og garderobeskabet</dc:title>\
        <dc:title xsi:type="dkdcplus:series">Narnia-serien ; 2</dc:title>\
        <dc:creator>C. S. Lewis</dc:creator>\
        <dc:creator xsi:type="oss:sort">Lewis, C. S.</dc:creator>\
    </dkabm:record>\
    <marcx:collection><marcx:record>\
        <marcx:datafield ind1="0" ind2="0" tag="241">\
            <marcx:subfield code="a">The lion, the witch and the wardrobe</marcx:subfield>\
        </marcx:datafield>\
    </marcx:record></marcx:collection>\
</ting:container>' );

    var record = new Record();
    record.fromString(
        '001 00*a06525822*b870970\n' +
        '241 00*aThe lion, the witch and the wardrobe\n' +
        '245 00*aLoeven, heksen og garderobeskabet\n'
    );

    var indexOut = [ {
        name: "phrase.originalTitle",
        value: "The lion, the witch and the wardrobe"
    } ];

    Assert.equalValue( "Create phrase.originalTitle",
        PhraseIndex.createOriginalTitle( index, xml, record ), indexOut );


    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
    <ac:identifier>870970|820010</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Les transsibériennes</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Les transsibériennes : roman</dc:title>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Robert Laffont</dc:publisher>\
    <dc:contributor>Jacques Lanzmann</dc:contributor>\
    <dc:date>1978</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
    <dcterms:extent>249 s.</dcterms:extent>\
    <dc:language xsi:type="dcterms:ISO639-2">fre</dc:language>\
    <dc:language>Fransk</dc:language>\
    </dkabm:record>\
    <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
    <marcx:record format="danMARC2" type="Bibliographic">\
    <marcx:datafield ind1="0" ind2="0" tag="001">\
    <marcx:subfield code="a">870970</marcx:subfield><marcx:subfield code="b">820010</marcx:subfield>\
    <marcx:subfield code="c">200912171210</marcx:subfield><marcx:subfield code="d">20010817</marcx:subfield>\
    <marcx:subfield code="f">a</marcx:subfield>\
    </marcx:datafield>\
    <marcx:datafield ind1="0" ind2="0" tag="245">\
    <marcx:subfield code="a">Les ¤transsibériennes</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>\
    <marcx:subfield code="e">Jacques Lanzmann</marcx:subfield>\
    </marcx:datafield>\
    <marcx:datafield ind1="0" ind2="0" tag="260">\
    <marcx:subfield code="a">Paris</marcx:subfield><marcx:subfield code="b">Robert Laffont</marcx:subfield>\
    <marcx:subfield code="c">1978</marcx:subfield>\
    </marcx:datafield>\
    </marcx:record>\
    </marcx:collection>\
    </ting:container>' );

    indexOut = [ {
        name: "phrase.originalTitle",
        value: "Les transsib\u00E9riennes"
    } ];

    Assert.equalValue( "Create phrase.title",
        PhraseIndex.createOriginalTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createShelf", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
        <ac:identifier>27766714|870970</ac:identifier>\
        <ac:source>Bibliotekskatalog</ac:source>\
        <dc:title>Das musikalische Opfer, BWV 1079</dc:title>\
        <dc:title xsi:type="dkdcplus:full">Das musikalische Opfer, BWV 1079 (Koopman)</dc:title>\
        <dcterms:alternative>Musikalisches Opfer BWV 1079</dcterms:alternative>\
        <dc:creator>Johann Sebastian Bach</dc:creator>\
        <dc:creator xsi:type="oss:sort">Bach, Johann Sebastian</dc:creator>\
        <dc:subject xsi:type="dkdcplus:DK5">78.42</dc:subject>\
        <dc:subject xsi:type="dkdcplus:DK5-Text">Kammermusik for 3 eller flere soloinstrumenter</dc:subject>\
        <dc:subject xsi:type="dkdcplus:DBCM">barok</dc:subject>\
        <dc:subject xsi:type="dkdcplus:DBCM">kammermusik</dc:subject>\
        <dc:subject xsi:type="dkdcplus:genre">kammermusik</dc:subject>\
        <dc:subject xsi:type="dkdcplus:DBCM">violin</dc:subject>\
        <dkdcplus:shelf xsi:type="oss:musicshelf">Kammermusik</dkdcplus:shelf>\
        <dc:description>Indspillet i Waalse Kerk, Amsterdam 2008</dc:description>\
        <dc:publisher>Challenge Classics</dc:publisher>\
        <dc:date>2009</dc:date>\
        <dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>\
        <dc:format>1 cd</dc:format>\
        <dc:identifier>Challenge Classics CC 72309</dc:identifier>\
        <dcterms:spatial xsi:type="dkdcplus:DBCM">Tyskland</dcterms:spatial>\
        <dcterms:temporal xsi:type="dkdcplus:DBCM">1740-1749</dcterms:temporal>\
    </dkabm:record>\
</ting:container>' );

    var indexOut = [ {
        name: "phrase.shelf",
        value: "Kammermusik"
    } ];

    Assert.equalValue( "Create phrase.shelf", PhraseIndex.createShelf( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>28854560|870970</ac:identifier>\
<ac:source>basis</ac:source>\
<dc:title>Himlen over Berlin</dc:title>\
<dc:title xsi:type="dkdcplus:full">Himlen over Berlin</dc:title>\
<dc:title xsi:type="dkdcplus:series">The Wim Wenders collection ; 1</dc:title>\
<dcterms:alternative>Der Himmel ueber Berlin</dcterms:alternative>\
<dcterms:alternative>Wings of desire</dcterms:alternative>\
<dc:creator xsi:type="dkdcplus:drt">Win Wenders</dc:creator>\
<dc:creator xsi:type="oss:sort">Wenders, Win</dc:creator>\
<dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject>\
<dc:subject xsi:type="dkdcplus:genre">drama</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">engle</dc:subject>\
<dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject>\
<dcterms:abstract>Damiel er en af englene, der bevaeger sig rundt blandt menneskene i Berlin og lytter til deres fortvivlede tanker</dcterms:abstract>\
<dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</dc:description>\
<dcterms:audience xsi:type="dkdcplus:medieraad">Maerkning: Tilladt for boern over 15 aar</dcterms:audience>\
<dcterms:audience>voksenmaterialer</dcterms:audience>\
<dc:publisher>Sandrew Metronome</dc:publisher>\
<dc:contributor>Wim Wenders </dc:contributor>\
<dc:contributor>Henri Alekan </dc:contributor>\
<dc:contributor>Peter Handke </dc:contributor>\
<dc:contributor xsi:type="dkdcplus:act">Bruno Ganz</dc:contributor>\
<dc:contributor xsi:type="dkdcplus:act">Solveig Dommartin</dc:contributor>\
<dc:contributor xsi:type="dkdcplus:act">Otto Sander</dc:contributor>\
<dc:contributor xsi:type="dkdcplus:act">Curt Bois</dc:contributor>\
<dc:contributor xsi:type="dkdcplus:act">Peter Falk</dc:contributor>\
<dc:date>2009</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type>\
<dc:format>1 dvd-video, sort-hvid og farve</dc:format>\
<dcterms:extent>ca. 2 t., 2 min.</dcterms:extent>\
<dc:language xsi:type="dcterms:ISO639-2">mul</dc:language>\
<dc:language>Flere sprog</dc:language>\
<dc:language xsi:type="dcterms:ISO639-2">eng</dc:language>\
<dc:language>Engelsk</dc:language>\
<dc:language xsi:type="dcterms:ISO639-2">ger</dc:language>\
<dc:language>Tysk</dc:language>\
<dc:language xsi:type="dkdcplus:subtitles">dan</dc:language>\
<dc:language xsi:type="dkdcplus:subtitles">nor</dc:language>\
<dc:language xsi:type="dkdcplus:subtitles">fin</dc:language>\
<dc:language xsi:type="dkdcplus:subtitles">swe</dc:language>\
<dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial>\
<dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
<marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>000000000000000000000000</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001"><marcx:subfield code="a">28854560</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20110815180554</marcx:subfield><marcx:subfield code="d">20110629</marcx:subfield><marcx:subfield code="f">a</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="006"><marcx:subfield code="d">15</marcx:subfield><marcx:subfield code="2">b</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008"><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">2009</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="l">mul</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009"><marcx:subfield code="a">m</marcx:subfield><marcx:subfield code="g">th</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="b">Brugsretskategori: C+</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="023"><marcx:subfield code="a">5704897046305</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="023"><marcx:subfield code="a">5704898046304</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="x">ACC201126</marcx:subfield><marcx:subfield code="a">DBI201133</marcx:subfield><marcx:subfield code="x">BKM201133</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041"><marcx:subfield code="a">eng</marcx:subfield><marcx:subfield code="a">ger</marcx:subfield><marcx:subfield code="u">dan</marcx:subfield><marcx:subfield code="u">nor</marcx:subfield><marcx:subfield code="u">fin</marcx:subfield><marcx:subfield code="u">swe</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">Himlen over Berlin</marcx:subfield><marcx:subfield code="p">Wings of desire</marcx:subfield><marcx:subfield code="e">a film by Win Wenders</marcx:subfield><marcx:subfield code="e">director of photography Henri Alekan</marcx:subfield><marcx:subfield code="e">written by Wim Wenders together with Peter Handke</marcx:subfield><marcx:subfield code="f">produced by Wiim Wenderrs and Anatole Dauman</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">[Kbh.]</marcx:subfield><marcx:subfield code="b">Sandrew Metronome</marcx:subfield><marcx:subfield code="c">2009</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="n">1 dvd-video</marcx:subfield><marcx:subfield code="l">ca. 2 t., 2 min.</marcx:subfield><marcx:subfield code="b">sort-hvid og farve</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="440"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">The ¤Wim Wenders collection</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504"><marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Damiel er en af englene, der bevæger sig rundt blandt menneskene i Berlin og lytter til deres fortvivlede tanker og forsøger at støtte dem. Hans længsel efter at leve og dø som menneske bliver indfriet efter at han forelsker sig i cirkus-artisten Marion</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="508"><marcx:subfield code="a">Tysk og engelsk tale</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="508"><marcx:subfield code="a">Undertekster på dansk, norsk, finsk og svensk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">I kolofonen: Originaltitel</marcx:subfield><marcx:subfield code="t">Der ¤Himmel über Berlin</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Medvirkende</marcx:subfield><marcx:subfield code="e">Bruno Ganz, Solveig Dommartin, Otto Sander, Curt Bois, Peter Falk ... et al.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="a">Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="517"><marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Mærkning: Tilladt for børn over 15 år</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="538"><marcx:subfield code="a">DDVDR DDVDS F 4630</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="m">77.7</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="s">drama</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="s">engle</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="q">Berlin</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="q">Tyskland</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Wenders</marcx:subfield><marcx:subfield code="h">Wim</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Alekan</marcx:subfield><marcx:subfield code="h">Henri</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Handke</marcx:subfield><marcx:subfield code="h">Peter</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="990"><marcx:subfield code="o">201133</marcx:subfield><marcx:subfield code="b">n</marcx:subfield><marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="991"><marcx:subfield code="o">Agenturholder: Universal</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
</ting:container>' );

    var indexOut = [ {
        name: "phrase.subject",
        value: "77.7"
    }, {
        name: "phrase.subject",
        value: "Spillefilm"
    }, {
        name: "phrase.subject",
        value: "drama"
    }, {
        name: "phrase.subject",
        value: "drama"
    }, {
        name: "phrase.subject",
        value: "engle"
    }, {
        name: "phrase.subject",
        value: "fiktion"
    } ];

    Assert.equalValue( "Create phrase.subject",
        PhraseIndex.createSubject( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createSubject", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( '\
<ting:container xmlns:ting="http://www.dbc.dk/ting">\
    <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
        <marcx:record format="danMARC2" type="Bibliographic">\
        <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="m">99.4</marcx:subfield><marcx:subfield code="a">Eco</marcx:subfield>\
        <marcx:subfield code="h">Umberto</marcx:subfield>\
        </marcx:datafield>\
        </marcx:record>\
    </marcx:collection>\
</ting:container>' );

    var indexOut = [ {
        name: "phrase.subject",
        value: "Umberto Eco"
    }
    ];

    Assert.equalValue( "Create phrase.subject with DK5 name",
        PhraseIndex.createSubject( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createSubject", function() {

    var index = Index.newIndex();

    var xml = XmlUtil.fromString( ' <ting:container xmlns:ting="http://www.dbc.dk/ting">\
    <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
        <marcx:record format="danMARC2" type="Bibliographic">\
            <marcx:datafield ind1="0" ind2="0" tag="652">\
            <marcx:subfield code="m">99.4</marcx:subfield><marcx:subfield code="a">Margrethe</marcx:subfield>\
            <marcx:subfield code="E">2</marcx:subfield><marcx:subfield code="e">II</marcx:subfield>\
            <marcx:subfield code="f">dronning af Danmark</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
    </marcx:collection>\
</ting:container>' );

    var indexOut = [ {
        name: "phrase.subject",
        value: "Margrethe II dronning af Danmark"
    } ];

    Assert.equalValue( "Create phrase.subject with DK5 name and extras",
        PhraseIndex.createSubject( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createGenre", function() {

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
        '<genre>fiktion</genre>' +
        '</adminData>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.genre",
        value: "horror"
    }, {
        name: "phrase.genre",
        value: "fiktion"
    }
    ];

    Assert.equalValue( "Create phrase.genre", PhraseIndex.createGenre( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createTitle", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:ting="http://www.dbc.dk/ting" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
    <dkabm:record>\
        <ac:identifier>23962527|870970</ac:identifier>\
        <ac:source>basis</ac:source>\
        <dc:title>Praeludium for klaver, bind 1 (uddrag)</dc:title>\
        <dc:title xsi:type="dkdcplus:full">Praeludium for klaver, bind 1 (uddrag)(Storstroms Kammerensemble)</dc:title>\
        <dcterms:alternative>14 preludes pour piano</dcterms:alternative>\
        <dc:language xsi:type="dkdcplus:subtitles">swe</dc:language>\
        <dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial>\
        <dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial>\
    </dkabm:record>\
</ting:container>' );

    var indexOut = [ {
        name: "phrase.title",
        value: "Praeludium for klaver, bind 1 (uddrag)"
    }, {
        name: "phrase.title",
        value: "Praeludium for klaver, bind 1 (uddrag)(Storstroms Kammerensemble)"
    }, {
        name: "phrase.title",
        value: "14 preludes pour piano"
    } ];

    Assert.equalValue( "Create phrase.title",
        PhraseIndex.createTitle( index, xml, MarcUtility.createRecordObjectFromIndexingData( xml ) ), indexOut );

} );


UnitTest.addFixture( "PhraseIndex.createTitleSeries", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>06525822|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>L�ven, heksen og garderobeskabet</dc:title><dc:title xsi:type="dkdcplus:full">L�ven, heksen og garderobeskabet</dc:title><dc:title xsi:type="dkdcplus:series">Narnia-serien ; 2</dc:title><dc:creator xsi:type="dkdcplus:aut">C. S. Lewis</dc:creator><dc:creator xsi:type="oss:sort">Lewis, C. S.</dc:creator><dc:subject xsi:type="dkdcplus:DK5-Text">Sk�nlitteratur</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">det gode</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">det onde</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">fantastiske fort�llinger</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">kristendom</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">parallelle verdener</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">religi�se b�ger</dc:subject><dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">tro</dc:subject><dcterms:abstract>Gennem et garderobeskab kommer b�rnene Peter, Susan, Edmund og Lucy til det fortryllede Narnia, hvor heksedronningen Jadis str�ber dem efter livet. Heldigvis er l�ven Aslan, det godes hersker, p� deres side</dcterms:abstract><dcterms:audience xsi:type="dkdcplus:age">Fra 10 �r</dcterms:audience><dcterms:audience>b�rnematerialer</dcterms:audience><dcterms:audience>voksenmaterialer</dcterms:audience><dkdcplus:version>2. udgave, 20. oplag</dkdcplus:version><dc:publisher>Borgen</dc:publisher><dc:date>1987</dc:date><dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type><dc:format>illustreret</dc:format><dcterms:extent>171 sider</dcterms:extent><dc:identifier xsi:type="dkdcplus:ISBN">9788741881140</dc:identifier><dc:source>The lion, the witch and the wardrobe</dc:source><dc:language xsi:type="dcterms:ISO639-2">dan</dc:language><dc:language>Dansk</dc:language></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001"><marcx:subfield code="a">06525822</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20100208005127</marcx:subfield><marcx:subfield code="d">19870429</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008"><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">r</marcx:subfield><marcx:subfield code="a">1987</marcx:subfield><marcx:subfield code="z">2008</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="o">b</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009"><marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="017"><marcx:subfield code="a">0 574 918 2</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="e">9788741881140</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield><marcx:subfield code="d">kr. 89,95</marcx:subfield><marcx:subfield code="x">87-418-8114-1</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="a">DBF200902</marcx:subfield><marcx:subfield code="x">BKM200902</marcx:subfield><marcx:subfield code="x">DAT200544</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041"><marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">eng</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="042"><marcx:subfield code="a">29</marcx:subfield><marcx:subfield code="b">Ml 16,0 + Lo 12,5</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Lewis</marcx:subfield><marcx:subfield code="h">C. S.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241"><marcx:subfield code="a">The �lion, the witch and the wardrobe</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">L�ven, heksen og garderobeskabet</marcx:subfield><marcx:subfield code="e">C.S. Lewis</marcx:subfield><marcx:subfield code="e">oversat af \Niels S�nderg@�rd\</marcx:subfield><marcx:subfield code="f">illustreret af Pauline Baynes</marcx:subfield><marcx:subfield code="�">Ved Niels S�nderg@�rd</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="250"><marcx:subfield code="a">2. udgave</marcx:subfield><marcx:subfield code="x">20. oplag</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">Valby</marcx:subfield><marcx:subfield code="b">Borgen</marcx:subfield><marcx:subfield code="k">Narayana Press, Gylling</marcx:subfield><marcx:subfield code="c">2008</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="a">171 sider</marcx:subfield><marcx:subfield code="b">ill.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="440"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Narnia</marcx:subfield><marcx:subfield code="v">2</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504"><marcx:subfield code="a">Gennem et garderobeskab kommer b�rnene Peter, Susan, Edmund og Lucy til det fortryllede Narnia, hvor heksedronningen Jadis str�ber dem efter livet. Heldigvis er l�ven Aslan, det godes hersker, p� deres side</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="517"><marcx:subfield code="a">Fra 10 �r</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Tidligere: 2. udgave. 1987. (1.-15. oplag med serietitel: Narnia-serien. 1.-18. oplag: 172 sider). - 1. udgave. 1982</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Originaludgave: 1950</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">4. oplag</marcx:subfield><marcx:subfield code="c">1995</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">5. oplag</marcx:subfield><marcx:subfield code="c">1997</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">6. oplag</marcx:subfield><marcx:subfield code="c">1998</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">7. oplag</marcx:subfield><marcx:subfield code="c">1998</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">8. oplag</marcx:subfield><marcx:subfield code="c">1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">9. oplag</marcx:subfield><marcx:subfield code="c">2000</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">10. oplag</marcx:subfield><marcx:subfield code="c">2001</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">11. oplag</marcx:subfield><marcx:subfield code="c">2001</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">12. oplag</marcx:subfield><marcx:subfield code="c">2002</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">13. oplag</marcx:subfield><marcx:subfield code="c">2003</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">14. oplag</marcx:subfield><marcx:subfield code="c">2004</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">15. oplag</marcx:subfield><marcx:subfield code="c">2005</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">16. oplag</marcx:subfield><marcx:subfield code="c">2005</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">17. oplag</marcx:subfield><marcx:subfield code="c">2005</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">18. oplag</marcx:subfield><marcx:subfield code="c">2005</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="a">19. oplag</marcx:subfield><marcx:subfield code="c">2006</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521"><marcx:subfield code="b">20. oplag</marcx:subfield><marcx:subfield code="c">2008</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="n">83</marcx:subfield><marcx:subfield code="z">296</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="o">sk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">fantastiske fort�llinger</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">det �gode</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">det �onde</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">tro</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">kristendom</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">religi�se b�ger</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">parallelle verdener</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="840"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Narnia-serien</marcx:subfield><marcx:subfield code="v">2</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="945"><marcx:subfield code="a">Narnia-fort�llingerne</marcx:subfield><marcx:subfield code="x">se</marcx:subfield><marcx:subfield code="w">Narnia</marcx:subfield><marcx:subfield code="z">440(a)</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="990"><marcx:subfield code="o">200902</marcx:subfield><marcx:subfield code="b">b</marcx:subfield><marcx:subfield code="b">s</marcx:subfield><marcx:subfield code="c">a</marcx:subfield><marcx:subfield code="u">op</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );

    var indexOut = [ {
        name: "phrase.titleSeries",
        value: "Narnia-serien"
    }
    ];

    Assert.equalValue( "Create phrase.titleSeries", PhraseIndex.createTitleSeries( index, xml ), indexOut );

    index = Index.newIndex();
    xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>23240769|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Harry Potter og fangen fra Azkaban</dc:title><dc:title xsi:type="dkdcplus:full">Harry Potter og fangen fra Azkaban</dc:title><dc:creator xsi:type="dkdcplus:aut">Joanne K. Rowling</dc:creator><dc:creator xsi:type="oss:sort">Rowling, Joanne K.</dc:creator><dc:subject xsi:type="dkdcplus:DK5-Text">Sk�nlitteratur</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">eventyrlige fort�llinger</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">magi</dc:subject><dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">troldm�nd</dc:subject><dcterms:abstract>Harry Potter er elev p� trolddomsskolen p� tredje �r. Han f�r at vide, at hans for�ldres morder er flygtet fra Azkabanf�ngslet og nu ogs� vil dr�be ham</dcterms:abstract><dc:description>Oversat af Hanne L�tzen</dc:description><dc:description>Indl�st i 2000</dc:description><dc:description xsi:type="dkdcplus:series">3. del af: Harry Potter og De Vises Sten</dc:description><dcterms:audience>voksenmaterialer</dcterms:audience><dc:publisher>Danmarks Blindebibliotek</dc:publisher><dc:contributor>Thomas Gulstad</dc:contributor><dc:contributor xsi:type="dkdcplus:dkind">Thomas Gulstad</dc:contributor><dc:date>2000</dc:date><dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (b�nd)</dc:type><dc:format>9 kassetteb�nd i 2 bokse</dc:format><dcterms:extent>13 t., 6 min.</dcterms:extent><dc:source>Harry Potter and the prisoner of Azkaban</dc:source><dc:language xsi:type="dcterms:ISO639-2">dan</dc:language><dc:language>Dansk</dc:language></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001"><marcx:subfield code="a">23240769</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20050607205908</marcx:subfield><marcx:subfield code="d">20001123</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="005"><marcx:subfield code="z">q</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008"><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">u</marcx:subfield><marcx:subfield code="a">2000</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009"><marcx:subfield code="a">r</marcx:subfield><marcx:subfield code="g">xh</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="017"><marcx:subfield code="a">2 322 793 2</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="d">Gratis</marcx:subfield><marcx:subfield code="b">v�r opm�rksom p� DBB&apos;s vilk�r for brug</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="a">DLF200049</marcx:subfield><marcx:subfield code="x">STB200049</marcx:subfield><marcx:subfield code="x">DAT200512</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041"><marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">eng</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Rowling</marcx:subfield><marcx:subfield code="h">Joanne K.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241"><marcx:subfield code="a">Harry Potter and the prisoner of Azkaban</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">Harry Potter og fangen fra Azkaban</marcx:subfield><marcx:subfield code="e">J.K. Rowling</marcx:subfield><marcx:subfield code="�">Ved Thomas Gulstad</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Danmarks Blindebibliotek</marcx:subfield><marcx:subfield code="c">[2000]</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="n">9 kassetteb�nd i 2 bokse</marcx:subfield><marcx:subfield code="l">13 t., 6 min.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504"><marcx:subfield code="a">Harry Potter er elev p� trolddomsskolen p� tredje �r. Han f�r at vide, at hans for�ldres morder er flygtet fra Azkabanf�ngslet og nu ogs� vil dr�be ham</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Oversat af</marcx:subfield><marcx:subfield code="e">Hanne L�tzen</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Indl�ser</marcx:subfield><marcx:subfield code="e">\Thomas Gulstad\</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="a">Indl�st i 2000</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Gengivelse af bogen</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Indl�st efter udgaven: Kbh. : Gyldendal, 1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Bogens originaludgave: 1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="526"><marcx:subfield code="i">3. del af</marcx:subfield><marcx:subfield code="t">Harry Potter og De Vises Sten</marcx:subfield><marcx:subfield code="b">. Seriens indhold se denne</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="538"><marcx:subfield code="i">Best.nr.</marcx:subfield><marcx:subfield code="a">13322</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="n">83</marcx:subfield><marcx:subfield code="z">296</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="o">sk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">eventyrlige fort�llinger</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">troldm�nd</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">magi</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Gulstad</marcx:subfield><marcx:subfield code="h">Thomas</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );

    indexOut = [ {
        name: "phrase.titleSeries",
        value: "Harry Potter og De Vises Sten"
    }
    ];

    Assert.equalValue( "Create phrase.titleSeries", PhraseIndex.createTitleSeries( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createTitleFromSeries", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>23240769|870970</ac:identifier><ac:source>Bibliotekskatalog</ac:source><dc:title>Harry Potter og fangen fra Azkaban</dc:title><dc:title xsi:type="dkdcplus:full">Harry Potter og fangen fra Azkaban</dc:title><dc:creator xsi:type="dkdcplus:aut">Joanne K. Rowling</dc:creator><dc:creator xsi:type="oss:sort">Rowling, Joanne K.</dc:creator><dc:subject xsi:type="dkdcplus:DK5-Text">Sk�nlitteratur</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">eventyrlige fort�llinger</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">magi</dc:subject><dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">troldm�nd</dc:subject><dcterms:abstract>Harry Potter er elev p� trolddomsskolen p� tredje �r. Han f�r at vide, at hans for�ldres morder er flygtet fra Azkabanf�ngslet og nu ogs� vil dr�be ham</dcterms:abstract><dc:description>Oversat af Hanne L�tzen</dc:description><dc:description>Indl�st i 2000</dc:description><dc:description xsi:type="dkdcplus:series">3. del af: Harry Potter og De Vises Sten</dc:description><dcterms:audience>voksenmaterialer</dcterms:audience><dc:publisher>Danmarks Blindebibliotek</dc:publisher><dc:contributor>Thomas Gulstad</dc:contributor><dc:contributor xsi:type="dkdcplus:dkind">Thomas Gulstad</dc:contributor><dc:date>2000</dc:date><dc:type xsi:type="dkdcplus:BibDK-Type">Lydbog (b�nd)</dc:type><dc:format>9 kassetteb�nd i 2 bokse</dc:format><dcterms:extent>13 t., 6 min.</dcterms:extent><dc:source>Harry Potter and the prisoner of Azkaban</dc:source><dc:language xsi:type="dcterms:ISO639-2">dan</dc:language><dc:language>Dansk</dc:language></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001"><marcx:subfield code="a">23240769</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20050607205908</marcx:subfield><marcx:subfield code="d">20001123</marcx:subfield><marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="t">FAUST</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="005"><marcx:subfield code="z">q</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008"><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">u</marcx:subfield><marcx:subfield code="a">2000</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009"><marcx:subfield code="a">r</marcx:subfield><marcx:subfield code="g">xh</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="017"><marcx:subfield code="a">2 322 793 2</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="d">Gratis</marcx:subfield><marcx:subfield code="b">v�r opm�rksom p� DBB&apos;s vilk�r for brug</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="a">DLF200049</marcx:subfield><marcx:subfield code="x">STB200049</marcx:subfield><marcx:subfield code="x">DAT200512</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041"><marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">eng</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Rowling</marcx:subfield><marcx:subfield code="h">Joanne K.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241"><marcx:subfield code="a">Harry Potter and the prisoner of Azkaban</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">Harry Potter og fangen fra Azkaban</marcx:subfield><marcx:subfield code="e">J.K. Rowling</marcx:subfield><marcx:subfield code="�">Ved Thomas Gulstad</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Danmarks Blindebibliotek</marcx:subfield><marcx:subfield code="c">[2000]</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="n">9 kassetteb�nd i 2 bokse</marcx:subfield><marcx:subfield code="l">13 t., 6 min.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504"><marcx:subfield code="a">Harry Potter er elev p� trolddomsskolen p� tredje �r. Han f�r at vide, at hans for�ldres morder er flygtet fra Azkabanf�ngslet og nu ogs� vil dr�be ham</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Oversat af</marcx:subfield><marcx:subfield code="e">Hanne L�tzen</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Indl�ser</marcx:subfield><marcx:subfield code="e">\Thomas Gulstad\</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="a">Indl�st i 2000</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Gengivelse af bogen</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Indl�st efter udgaven: Kbh. : Gyldendal, 1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="520"><marcx:subfield code="a">Bogens originaludgave: 1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="526"><marcx:subfield code="i">3. del af</marcx:subfield><marcx:subfield code="t">Harry Potter og De Vises Sten</marcx:subfield><marcx:subfield code="b">. Seriens indhold se denne</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="538"><marcx:subfield code="i">Best.nr.</marcx:subfield><marcx:subfield code="a">13322</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="n">83</marcx:subfield><marcx:subfield code="z">296</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="o">sk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">eventyrlige fort�llinger</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">troldm�nd</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="s">magi</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">Gulstad</marcx:subfield><marcx:subfield code="h">Thomas</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );
    var indexOut = [ {
        name: "phrase.titleFromSeries",
        value: "Harry Potter og fangen fra Azkaban Harry Potter og De Vises Sten"
    }
    ];

    Assert.equalValue( "Create phrase.titleFromSeries", PhraseIndex.createTitleFromSeries( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createType", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oso="http://oss.dbc.dk/ns/opensearchobjects" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dkabm:record><ac:identifier>28854560|870970</ac:identifier><ac:source>basis</ac:source><dc:title>Himlen over Berlin</dc:title><dc:title xsi:type="dkdcplus:full">Himlen over Berlin</dc:title><dc:title xsi:type="dkdcplus:series">The Wim Wenders collection</dc:title><dcterms:alternative>Der Himmel über Berlin</dcterms:alternative><dcterms:alternative>Wings of desire</dcterms:alternative><dc:creator xsi:type="dkdcplus:drt">Win Wenders</dc:creator><dc:creator xsi:type="oss:sort">Wenders, Win</dc:creator><dc:subject xsi:type="dkdcplus:DK5">77.7</dc:subject><dc:subject xsi:type="dkdcplus:DK5-Text">Spillefilm</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">drama</dc:subject><dc:subject xsi:type="dkdcplus:genre">drama</dc:subject><dc:subject xsi:type="dkdcplus:DBCS">engle</dc:subject><dc:subject xsi:type="dkdcplus:genre">fiktion</dc:subject><dcterms:abstract>Damiel er en af englene, der bevæger sig rundt blandt menneskene i Berlin og lytter til deres fortvivlede tanker og forsøger at støtte dem. Hans længsel efter at leve og dø som menneske bliver indfriet efter at han forelsker sig i cirkus-artisten Marion</dcterms:abstract><dc:description>Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</dc:description><dcterms:audience xsi:type="dkdcplus:medieraad">Mærkning: Tilladt for børn over 15 år</dcterms:audience><dcterms:audience>voksenmaterialer</dcterms:audience><dc:publisher>Sandrew Metronome</dc:publisher><dc:contributor>Wim Wenders </dc:contributor><dc:contributor>Henri Alekan </dc:contributor><dc:contributor>Peter Handke </dc:contributor><dc:contributor xsi:type="dkdcplus:act">Bruno Ganz</dc:contributor><dc:contributor xsi:type="dkdcplus:act">Solveig Dommartin</dc:contributor><dc:contributor xsi:type="dkdcplus:act">Otto Sander</dc:contributor><dc:contributor xsi:type="dkdcplus:act">Curt Bois</dc:contributor><dc:contributor xsi:type="dkdcplus:act">Peter Falk</dc:contributor><dc:date>2009</dc:date><dc:type xsi:type="dkdcplus:BibDK-Type">Dvd</dc:type><dc:format>1 dvd-video, sort-hvid og farve</dc:format><dcterms:extent>ca. 2 t., 2 min.</dcterms:extent><dc:language xsi:type="dcterms:ISO639-2">mul</dc:language><dc:language>Flere sprog</dc:language><dc:language xsi:type="dcterms:ISO639-2">eng</dc:language><dc:language>Engelsk</dc:language><dc:language xsi:type="dcterms:ISO639-2">ger</dc:language><dc:language>Tysk</dc:language><dc:language xsi:type="dkdcplus:subtitles">dan</dc:language><dc:language xsi:type="dkdcplus:subtitles">nor</dc:language><dc:language xsi:type="dkdcplus:subtitles">fin</dc:language><dc:language xsi:type="dkdcplus:subtitles">swe</dc:language><dcterms:spatial xsi:type="dkdcplus:DBCS">Berlin</dcterms:spatial><dcterms:spatial xsi:type="dkdcplus:DBCS">Tyskland</dcterms:spatial></dkabm:record><marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic"><marcx:leader>000000000000000000000000</marcx:leader><marcx:datafield ind1="0" ind2="0" tag="001"><marcx:subfield code="a">28854560</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><marcx:subfield code="c">20110815180554</marcx:subfield><marcx:subfield code="d">20110629</marcx:subfield><marcx:subfield code="f">a</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="006"><marcx:subfield code="d">15</marcx:subfield><marcx:subfield code="2">b</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008"><marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">2009</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="l">mul</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009"><marcx:subfield code="a">m</marcx:subfield><marcx:subfield code="g">th</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021"><marcx:subfield code="b">Brugsretskategori: C+</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="023"><marcx:subfield code="a">5704897046305</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="023"><marcx:subfield code="a">5704898046304</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032"><marcx:subfield code="x">ACC201126</marcx:subfield><marcx:subfield code="a">DBI201133</marcx:subfield><marcx:subfield code="x">BKM201133</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041"><marcx:subfield code="a">eng</marcx:subfield><marcx:subfield code="a">ger</marcx:subfield><marcx:subfield code="u">dan</marcx:subfield><marcx:subfield code="u">nor</marcx:subfield><marcx:subfield code="u">fin</marcx:subfield><marcx:subfield code="u">swe</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245"><marcx:subfield code="a">Himlen over Berlin</marcx:subfield><marcx:subfield code="p">Wings of desire</marcx:subfield><marcx:subfield code="e">a film by Win Wenders</marcx:subfield><marcx:subfield code="e">director of photography Henri Alekan</marcx:subfield><marcx:subfield code="e">written by Wim Wenders together with Peter Handke</marcx:subfield><marcx:subfield code="f">produced by Wiim Wenderrs and Anatole Dauman</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260"><marcx:subfield code="a">[Kbh.]</marcx:subfield><marcx:subfield code="b">Sandrew Metronome</marcx:subfield><marcx:subfield code="c">2009</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300"><marcx:subfield code="n">1 dvd-video</marcx:subfield><marcx:subfield code="l">ca. 2 t., 2 min.</marcx:subfield><marcx:subfield code="b">sort-hvid og farve</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="440"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="a">The ¤Wim Wenders collection</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504"><marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Damiel er en af englene, der bevæger sig rundt blandt menneskene i Berlin og lytter til deres fortvivlede tanker og forsøger at støtte dem. Hans længsel efter at leve og dø som menneske bliver indfriet efter at han forelsker sig i cirkus-artisten Marion</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="508"><marcx:subfield code="a">Tysk og engelsk tale</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="508"><marcx:subfield code="a">Undertekster på dansk, norsk, finsk og svensk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">I kolofonen: Originaltitel</marcx:subfield><marcx:subfield code="t">Der ¤Himmel über Berlin</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="i">Medvirkende</marcx:subfield><marcx:subfield code="e">Bruno Ganz, Solveig Dommartin, Otto Sander, Curt Bois, Peter Falk ... et al.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512"><marcx:subfield code="a">Originalfilmen: Tyskland : Road Movies Filmproduktion ; Frankrig : Argos Films, 1987</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="517"><marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Mærkning: Tilladt for børn over 15 år</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="538"><marcx:subfield code="a">DDVDR DDVDS F 4630</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652"><marcx:subfield code="m">77.7</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="s">drama</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="s">engle</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="q">Berlin</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666"><marcx:subfield code="0"></marcx:subfield><marcx:subfield code="q">Tyskland</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Wenders</marcx:subfield><marcx:subfield code="h">Wim</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Alekan</marcx:subfield><marcx:subfield code="h">Henri</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="700"><marcx:subfield code="a">Handke</marcx:subfield><marcx:subfield code="h">Peter</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="990"><marcx:subfield code="o">201133</marcx:subfield><marcx:subfield code="b">n</marcx:subfield><marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="991"><marcx:subfield code="o">Agenturholder: Universal</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996"><marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield></marcx:record></marcx:collection></ting:container>' );

    var indexOut = [ {
        name: "phrase.type",
        value: "Dvd"
    }
    ];

    Assert.equalValue( "Create phrase.type", PhraseIndex.createType( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewFields", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcPhrases="http://purl.org/dc/Phrases/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
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
        '<dcPhrases:abstract>' +
        'Foerst forsvinder Toru Okadas kat, dernaest hans kone Kumiko. Hans soegen efter begge bliver en mystisk, magisk rejse i det japanske samfund og sindets afkroge' +
        '</dcPhrases:abstract>' +
        '<dcPhrases:audience>voksenmaterialer</dcPhrases:audience>' +
        '<dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dcPhrases:extent>635 sider</dcPhrases:extent>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '<dc:source>Nejimaki-dori kuronikure</dc:source>' +
        '<dc:language xsi:type="dcPhrases:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcPhrases:spatial xsi:type="dkdcplus:DBCS">Japan</dcPhrases:spatial>' +
        '<dcPhrases:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcPhrases:temporal>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var xmlReview = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dcPhrases="http://purl.org/dc/Phrases/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>86304155|870971</ac:identifier>' +
        '<ac:source>Anmeldelser</ac:source>' +
        '<dc:title>Anmeldelse</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anmeldelse</dc:title>' +
        '<dc:creator>Jon Helt Haarder</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Haarder, Jon Helt</dc:creator>' +
        '<dcPhrases:audience>voksenmaterialer</dcPhrases:audience>' +
        '<dc:date>2001</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dcPhrases:extent>Sektion 1, s. 10</dcPhrases:extent>' +
        '<dc:language xsi:type="dcPhrases:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '<dcPhrases:isPartOf>Jyllands-posten, 2001-06-22</dcPhrases:isPartOf>' +
        '<dcPhrases:isPartOf xsi:type="dkdcplus:ISSN">0109-1182</dcPhrases:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedCreator",
        value: "Haruki Murakami"
    }, {
        name: "phrase.reviewedCreator",
        value: "Murakami, Haruki"
    }, {
        name: "phrase.reviewedTitle",
        value: "Traekopfuglens kroenike"
    }, {
        name: "phrase.reviewedPublisher",
        value: "Klim"
    }, {
        name: "phrase.reviewedIdentifier",
        value: "87-7724-857-0"
    }, {
        name: "phrase.subject",
        value: "Traekopfuglens kroenike"
    }, {
        name: "phrase.reviewer",
        value: "Jon Helt Haarder"
    }, {
        name: "phrase.reviewer",
        value: "Haarder, Jon Helt"
    }
    ];

    Assert.equalValue( "Create Phrase index fields for review", PhraseIndex.createReviewFields( index, xmlReview, xml ), indexOut );

} );


UnitTest.addFixture("PhraseIndex.createReviewFieldsDkabm", function(){

    var index = Index.newIndex();

    var reviewXml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" '+
    'xmlns:dcterms="http://purl.org/dc/terms/" '+
    'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" '+
    'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" '+
    'xmlns:oss="http://oss.dbc.dk/ns/osstypes" '+
    'xmlns:ting="http://www.dbc.dk/ting" '+
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
    '<dkabm:record>'+
    '<ac:identifier>96744|150005</ac:identifier>'+
    '<ac:source>Litteratursiden</ac:source>'+
    '<dc:title>Anmeldelse af: Himlen er over os alle</dc:title>'+
    '<dc:title xsi:type="dkdcplus:full">Anmeldelse af: Himlen er over os alle</dc:title>'+
    '<dc:creator xsi:type="dkdcplus:aut">Jan Faerk</dc:creator>'+
    '<dc:creator xsi:type="oss:sort">Faerk, Jan</dc:creator>'+
    '<dc:subject>Paul Bowles</dc:subject>'+
    '<dc:subject>Under himlens daekke</dc:subject>'+
    '<dcterms:abstract>' +
    'Oerkenens uendelige toerre sandstraekninger og vekslen mellem ekstrem varme og kulde er et centralt symbolsk tema for forholdet mellem mennesker i Paul Bowles roman &quot;' +
    'Under himlens daekke&quot;.</dcterms:abstract>'+
    '<dcterms:audience>voksenmaterialer</dcterms:audience>'+
    '<dc:publisher>Litteratursiden</dc:publisher>'+
    '<dc:date>2012</dc:date>'+
    '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>'+
    '<dc:identifier xsi:type="dcterms:URI">http://www.litteratursiden.dk/?q=node/96744</dc:identifier>'+
    '<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>'+
    '<dc:language>Dansk</dc:language>'+
    '<dcterms:references xsi:type="dkdcplus:ISBN">9788700837263</dcterms:references>'+
    '</dkabm:record>'+
    '</ting:container>'
    );

    var indexOut = [ {
        name: "phrase.reviewedCreator",
        value: "Paul Bowles"
    }, {
        name: "phrase.reviewedTitle",
        value: "Under himlens daekke"
    }, {
        name: "phrase.reviewedIdentifier",
        value: "9788700837263"
    }, {
        name: "phrase.subject",
        value: "Under himlens daekke"
    }, {
        name: "phrase.reviewer",
        value: "Jan Faerk"
    }, {
        name: "phrase.reviewer",
        value: "Faerk, Jan"
    }
    ];

    Assert.equalValue( "Create Phrase Index fields for review when the reviewed work is not available",
        PhraseIndex.createReviewFieldsDkabm( index, reviewXml), indexOut )

});

UnitTest.addFixture( "PhraseIndex.createReviewedCreator", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
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
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedCreator",
        value: "Haruki Murakami"
    }, {
        name: "phrase.reviewedCreator",
        value: "Murakami, Haruki"
    }
    ];

    Assert.equalValue( "Create phrase.reviewedCreator", PhraseIndex.createReviewedCreator( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewedCreatorDkabm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
        '<dkabm:record>' +
        '<dc:creator>Kent Skov</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Skov, Kent</dc:creator>' +
        '<dc:subject>Haakan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedCreator",
        value: "Haakan Nesser"
    }
    ];

    Assert.equalValue( "Create phrase.reviewedCreator from DKABM", PhraseIndex.createReviewedCreatorDkabm( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewedTitle", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
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
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedTitle",
        value: "Traekopfuglens kroenike"
    }
    ];

    Assert.equalValue( "Create phrase.reviewedTitle", PhraseIndex.createReviewedTitle( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewedTitleDkabm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
        '<dkabm:record>' +
        '<dc:title>Lektørudtalelse</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Lektørudtalelse</dc:title>' +
        '<dc:subject>Håkan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedTitle",
        value: "Skyggerne og regnen"
    }
    ];

    Assert.equalValue( "Create phrase.reviewedTitle from DKABM", PhraseIndex.createReviewedTitleDkabm( index, xml ), indexOut );


} );

UnitTest.addFixture( "PhraseIndex.createReviewedPublisher", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcPhrases="http://purl.org/dc/Phrases/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>23645564|870970</ac:identifier>' +
        '<ac:source>Bibliotekets materialer</ac:source>' +
        '<dc:title>Traekopfuglens kroenike</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Traekopfuglens kroenike</dc:title>' +
        '<dc:creator xsi:type="dkdcplus:aut">Haruki Murakami</dc:creator>' +
        '<dcPhrases:audience>voksenmaterialer</dcPhrases:audience><dkdcplus:version>1. udgave, 2. oplag</dkdcplus:version>' +
        '<dc:publisher>Klim</dc:publisher>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedPublisher",
        value: "Klim"
    } ];

    Assert.equalValue( "Create phrase.reviewedPublisher", PhraseIndex.createReviewedPublisher( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewedIdentifier", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
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
        '<dc:publisher>Klim</dc:publisher>' +
        '<dc:date>2003</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>' +
        '<dc:identifier xsi:type="dkdcplus:ISBN">87-7724-857-0</dc:identifier>' +
        '<dc:source>Nejimaki-dori kuronikure</dc:source>' +
        '<dc:language xsi:type="dcPhrases:ISO639-2">dan</dc:language>' +
        '<dc:language>Dansk</dc:language>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedIdentifier",
        value: "87-7724-857-0"
    } ];

    Assert.equalValue( "Create phrase.reviewedIdenfier", PhraseIndex.createReviewedIdentifier( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewedIdentifierDkabm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container ' +
        'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<dcterms:references xsi:type="dkdcplus:ISBN">9788773949740</dcterms:references>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewedIdentifier",
        value: "9788773949740"
    } ];

    Assert.equalValue( "Create phrase.reviewedIdentifier from DKABM", PhraseIndex.createReviewedIdentifierDkabm( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewSubject", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
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
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.subject",
        value: "Traekopfuglens kroenike"
    } ];

    Assert.equalValue( "Create phrase.subject (review)", PhraseIndex.createReviewSubject( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewSubjectDkabm", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" ' +
        'xmlns:ting="http://www.dbc.dk/ting">' +
        '<dkabm:record>' +
        '<dc:subject>Håkan Nesser</dc:subject>' +
        '<dc:subject>Skyggerne og regnen</dc:subject>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.subject",
        value: "Skyggerne og regnen"
    } ];

    Assert.equalValue( "Create phrase.subject from DKABM", PhraseIndex.createReviewSubjectDkabm( index, xml ), indexOut );

} );

UnitTest.addFixture( "PhraseIndex.createReviewer", function() {

    var index = Index.newIndex();
    var xml = XmlUtil.fromString( '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcPhrases="http://purl.org/dc/Phrases/" ' +
        'xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" ' +
        'xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dkabm:record>' +
        '<ac:identifier>86304155|870971</ac:identifier>' +
        '<ac:source>Anmeldelser</ac:source>' +
        '<dc:title>Anmeldelse</dc:title>' +
        '<dc:title xsi:type="dkdcplus:full">Anmeldelse</dc:title>' +
        '<dc:creator>Jon Helt Haarder</dc:creator>' +
        '<dc:creator xsi:type="oss:sort">Haarder, Jon Helt</dc:creator>' +
        '<dcPhrases:audience>voksenmaterialer</dcPhrases:audience>' +
        '<dc:date>2001</dc:date>' +
        '<dc:type xsi:type="dkdcplus:BibDK-Type">Anmeldelse</dc:type>' +
        '<dcPhrases:extent>Sektion 1, s. 10</dcPhrases:extent>' +
        '<dc:language xsi:type="dcPhrases:ISO639-2">dan</dc:language><dc:language>Dansk</dc:language>' +
        '<dcPhrases:isPartOf>Jyllands-posten, 2001-06-22</dcPhrases:isPartOf>' +
        '<dcPhrases:isPartOf xsi:type="dkdcplus:ISSN">0109-1182</dcPhrases:isPartOf>' +
        '</dkabm:record>' +
        '</ting:container>' );

    var indexOut = [ {
        name: "phrase.reviewer",
        value: "Jon Helt Haarder"
    }, {
        name: "phrase.reviewer",
        value: "Haarder, Jon Helt"
    } ];

    Assert.equalValue( "Create phrase.reviewer", PhraseIndex.createReviewer( index, xml ), indexOut );

} );
