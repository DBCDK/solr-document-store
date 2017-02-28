use( "IndexCreator" );
use( "UnitTest" );

// Mock Repository function required for AdminIndex.createWorkId
Repository.hasObject = function ( id ) {
    return false;
};

UnitTest.addFixture( "IndexCreator.prepareData 1", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function (doc) { documents.push( doc ); },
        deleteDocument: function (doc) { deleteDoc.push( doc ); }
    };
    
    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return true; } };

    var foXml = '<foxml:digitalObject VERSION="1.1" PID="870970-basis:27681794" \
    xmlns:foxml="info:fedora/fedora-system:def/foxml#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
    xsi:schemaLocation="info:fedora/fedora-system:def/foxml# http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Active"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-02-14T10:05:07.144Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2014-02-14T10:08:35.788Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="commonData" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="commonData.0" LABEL="" CREATED="2014-02-14T10:05:07.184Z" MIMETYPE="text/xml" SIZE="18608">\
<foxml:xmlContent>\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" \
xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
  <dkabm:record>\
    <ac:identifier>27681794|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Lieder</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Lieder</dc:title>\
    <dc:creator>Johan Reuter</dc:creator>\
    <dc:creator xsi:type="oss:sort">Reuter, Johan</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">78.611</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Antologier af vokalmusik for 1 solostemme</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">baryton</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">lied</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">nationalromantik</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">sange</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">senromantik</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">solosang</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">vokal</dc:subject>\
    <dkdcplus:shelf xsi:type="oss:musicshelf">Vokalmusik. Antologier</dkdcplus:shelf>\
    <dc:description>Indspillet i Berlin 29.-30. september 2008</dc:description>\
    <dc:description>Tekster pÃ¥ omslag</dc:description>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Michael Storrs Music</dc:publisher>\
    <dc:contributor>Wilhelm Henzen</dc:contributor>\
    <dc:contributor>J. P. Jacobsen (f. 1847)</dc:contributor>\
    <dc:contributor>Tove LÃ¸nskov</dc:contributor>\
    <dc:contributor>Richard Strauss</dc:contributor>\
    <dc:contributor>Carl Nielsen (f. 1865)</dc:contributor>\
    <dc:contributor>Hakon BÃ¸rresen</dc:contributor>\
    <dc:date>2008</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>\
    <dc:format>1 cd</dc:format>\
    <dc:identifier>MSM 0011</dc:identifier>\
    <dc:language xsi:type="dcterms:ISO639-2">ger</dc:language>\
    <dc:language>Tysk</dc:language>\
    <dcterms:hasPart xsi:type="dkdcplus:track">Marine</dcterms:hasPart>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Tyskland</dcterms:spatial>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Danmark</dcterms:spatial>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Danmark</dcterms:spatial>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1880-1889</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1890-1899</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1890-1899</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1900-1909</dcterms:temporal>\
  </dkabm:record>\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
    <marcx:record format="danMARC2" type="Bibliographic">\
      <marcx:leader>00000n    2200000   4500</marcx:leader>\
      <marcx:datafield ind1="0" ind2="0" tag="001">\
        <marcx:subfield code="a">27681794</marcx:subfield>\
        <marcx:subfield code="b">870970</marcx:subfield>\
        <marcx:subfield code="c">20090511180353</marcx:subfield>\
        <marcx:subfield code="d">20090324</marcx:subfield>\
        <marcx:subfield code="f">a</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="004">\
        <marcx:subfield code="r">n</marcx:subfield>\
        <marcx:subfield code="a">e</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="005">\
        <marcx:subfield code="h">e</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="008">\
        <marcx:subfield code="t">s</marcx:subfield>\
        <marcx:subfield code="u">f</marcx:subfield>\
        <marcx:subfield code="a">2008</marcx:subfield>\
        <marcx:subfield code="b">de</marcx:subfield>\
        <marcx:subfield code="l">ger</marcx:subfield>\
        <marcx:subfield code="v">0</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="009">\
        <marcx:subfield code="a">s</marcx:subfield>\
        <marcx:subfield code="g">xc</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="020">\
        <marcx:subfield code="a">dk</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="021">\
        <marcx:subfield code="d">Kr. 136,00</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="023">\
        <marcx:subfield code="a">0879524001127</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="032">\
        <marcx:subfield code="a">DMO200920</marcx:subfield>\
        <marcx:subfield code="x">BKM200920</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="039">\
        <marcx:subfield code="a">voa</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="100">\
        <marcx:subfield code="a">Reuter</marcx:subfield>\
        <marcx:subfield code="h">Johan</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="245">\
        <marcx:subfield code="a">Lieder</marcx:subfield>\
        <marcx:subfield code="e">Johan Reuter, baryton</marcx:subfield>\
        <marcx:subfield code="e">Tove LÃ¸nskov, klaver</marcx:subfield>\
        <marcx:subfield code="i">produced by: Desmond Chewyn</marcx:subfield>\
        <marcx:subfield code="i">sound engineering executive/mixer: Markus Mittermeyer</marcx:subfield>\
        <marcx:subfield code="i">sound editor: Holger Kirchhoff</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="260">\
        <marcx:subfield code="a">London</marcx:subfield>\
        <marcx:subfield code="b">Michael Storrs Music</marcx:subfield>\
        <marcx:subfield code="c">2008</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="300">\
        <marcx:subfield code="n">1 cd</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="512">\
        <marcx:subfield code="a">Indspillet i Berlin 29.-30. september 2008</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="512">\
        <marcx:subfield code="a">Tekster pÃ¥ omslag</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="531">\
        <marcx:subfield code="a">Indhold:</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="538">\
        <marcx:subfield code="f">MSM</marcx:subfield>\
        <marcx:subfield code="g">0011</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="m">78.611</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">11</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">12</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">13</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">11</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="m">lied</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1880-1889</marcx:subfield>\
        <marcx:subfield code="p">1890-1899</marcx:subfield>\
        <marcx:subfield code="l">Tyskland</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">12</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">nationalromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1890-1899</marcx:subfield>\
        <marcx:subfield code="l">Danmark</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">13</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">nationalromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1900-1909</marcx:subfield>\
        <marcx:subfield code="l">Danmark</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="990">\
        <marcx:subfield code="o">200920</marcx:subfield>\
        <marcx:subfield code="b">v</marcx:subfield>\
        <marcx:subfield code="u">nt</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="996">\
        <marcx:subfield code="a">DBC</marcx:subfield>\
      </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
  <adminData>\
    <recordStatus>active</recordStatus>\
    <creationDate>2009-03-24</creationDate>\
    <libraryType>none</libraryType>\
    <indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType>\
    <workType>music</workType>\
    <collectionIdentifier>870970-basis</collectionIdentifier>\
  </adminData>\
</ting:container>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="localData.870970-basis" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.870970-basis.0" LABEL="" CREATED="2014-02-14T10:05:07.185Z" MIMETYPE="text/xml" SIZE="1550">\
<foxml:xmlContent>\
<ting:localData xmlns:ting="http://www.dbc.dk/ting">\
<marcx:record xmlns:marcx="info:lc/xmlns/marcxchange-v1" format="danMARC2" type="BibliographicLocal">\
<marcx:datafield ind1="0" ind2="0" tag="d08">\
        <marcx:subfield code="a">100: JR fremhÃ¦vet pÃ¥ omslag og etiket</marcx:subfield>\
        <marcx:subfield code="o">lhp</marcx:subfield>\
        <marcx:subfield code="k">hlt</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="d09">\
        <marcx:subfield code="z">SFG200920</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="f06">\
        <marcx:subfield code="b">v</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="n51">\
        <marcx:subfield code="a">20090511</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="n55">\
        <marcx:subfield code="a">20090324</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="s12">\
        <marcx:subfield code="t">TeamMUS200919</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="z99">\
        <marcx:subfield code="a">hlt</marcx:subfield>\
      </marcx:datafield></marcx:record><adminData>\
    <recordStatus>active</recordStatus>\
    <creationDate>2009-03-24</creationDate>\
    <libraryType>none</libraryType>\
    <indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType>\
    <workType>music</workType>\
    <collectionIdentifier>870970-basis</collectionIdentifier>\
  </adminData></ting:localData>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.1" LABEL="" CREATED="2014-02-14T10:05:07.338Z" MIMETYPE="application/rdf+xml" SIZE="296">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description \
rdf:about="info:fedora/870970-basis:27681794"><isMemberOfUnit xmlns="info:fedora/">unit:202</isMemberOfUnit>\
<isPrimaryBibObjectFor xmlns="info:fedora/">unit:202</isPrimaryBibObjectFor></rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.1" LABEL="" CREATED="2014-02-14T10:08:35.788Z" MIMETYPE="text/xml" SIZE="1670">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ \
http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>lieder</dc:title>\
<dc:title>MATCH:lieder</dc:title>\
<dc:creator>johan reuter</dc:creator>\
<dc:creator>NOBIRTH:johan reuter</dc:creator>\
<dc:creator>MATCHSTRING:reuterj</dc:creator>\
<dc:subject>baryton</dc:subject>\
<dc:subject>lied</dc:subject>\
<dc:subject>nationalromantik</dc:subject>\
<dc:subject>sange</dc:subject><dc:subject>senromantik</dc:subject>\
<dc:subject>vokal</dc:subject><dc:subject>Tyskland</dc:subject><dc:subject>Danmark</dc:subject>\
<dc:subject>Danmark</dc:subject><dc:subject>1880-1889</dc:subject>\
<dc:subject>1890-1899</dc:subject><dc:subject>1890-1899</dc:subject><dc:subject>1900-1909</dc:subject>\
<dc:publisher>michael storrs music</dc:publisher>\
<dc:publisher>MATCHSTRING:michael</dc:publisher>\
<dc:contributor>MATCHSTRING:henzenw</dc:contributor><dc:contributor>MATCHSTRING:jacobsenj</dc:contributor>\
<dc:contributor>MATCHSTRING:lÃ¸nskovt</dc:contributor><dc:contributor>wilhelm henzen</dc:contributor>\
<dc:contributor>j p jacobsen f 1847</dc:contributor><dc:contributor>tove lÃ¸nskov</dc:contributor>\
<dc:contributor>richard strauss</dc:contributor><dc:contributor>carl nielsen f 1865</dc:contributor>\
<dc:contributor>hakon bÃ¸rresen</dc:contributor><dc:date>2008</dc:date>\
<dc:type>Cd (musik)</dc:type><dc:type>WORK:music</dc:type>\
<dc:identifier>870970-basis:27681794</dc:identifier>\
<dc:identifier>NUMBER:MSM0011</dc:identifier><dc:language>Tysk</dc:language>\
</oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "870970-basis:27681794";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    Assert.equalValue( "1 document added", documents.length, 1 );


} );

UnitTest.addFixture( "IndexCreator.prepareData 2", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function ( doc ) { documents.push( doc ); },
        deleteDocument: function ( doc ) { deleteDoc.push( doc ); }
    };
    
    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return true; } };

    var foXml = '<foxml:digitalObject VERSION="1.1" PID="870970-basis:29189129" xmlns:foxml="info:fedora/fedora-system:def/foxml#" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="info:fedora/fedora-system:def/foxml# http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Active"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-02-14T10:05:07.144Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2014-02-14T10:08:35.788Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="commonData" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="commonData.0" LABEL="" CREATED="2014-02-14T10:05:07.184Z" MIMETYPE="text/xml" SIZE="18608">\
<foxml:xmlContent>\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" \
xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>29189129|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Min kamp</dc:title>\
<dc:title xsi:type="dkdcplus:full">Min kamp : roman. 5. bog</dc:title>\
<dc:creator xsi:type="dkdcplus:aut">Karl Ove KnausgÃ¥rd</dc:creator>\
<dc:creator xsi:type="oss:sort">KnausgÃ¥rd, Karl Ove</dc:creator>\
<dc:subject xsi:type="dkdcplus:DK5-Text">SkÃ¸nlitteratur</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">alkoholmisbrug</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">barndom</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">barndomserindringer</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">bÃ¸rn</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">dÃ¸den</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">erindringer</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">familien</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">far-sÃ¸n forholdet</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">forfattere</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">forÃ¦ldre</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">identitet</dc:subject>\
<dc:subject xsi:type="dkdcplus:DBCS">parforhold</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5">sk</dc:subject>\
<dcterms:abstract>Karl Ove flytter til Bergen for at gÃ¥ pÃ¥ Skrivekunstakademiet. Det bliver en gedigen skuffelse.</dcterms:abstract>\
<dcterms:audience>voksenmaterialer</dcterms:audience>\
<dkdcplus:version>1. udgave</dkdcplus:version>\
<dc:publisher>Lindhardt og Ringhof</dc:publisher>\
<dc:contributor xsi:type="dkdcplus:trl">Sara Koch</dc:contributor>\
<dc:date>2012</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dcterms:extent>699 sider</dcterms:extent>\
<dcterms:extent>6 bind</dcterms:extent>\
<dc:identifier xsi:type="dkdcplus:ISBN">9788711408667</dc:identifier>\
<dc:source>Min kamp</dc:source>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
<dcterms:spatial xsi:type="dkdcplus:DBCS">Norge</dcterms:spatial>\
<dcterms:spatial xsi:type="dkdcplus:DBCS">Sverige</dcterms:spatial>\
<dcterms:temporal xsi:type="dkdcplus:DBCP">1980-1989</dcterms:temporal>\
<dcterms:temporal xsi:type="dkdcplus:DBCP">1990-1999</dcterms:temporal>\
<dcterms:temporal xsi:type="dkdcplus:DBCP">2000-2009</dcterms:temporal>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>\
<marcx:subfield code="a">2012</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>\
<marcx:subfield code="d">x</marcx:subfield><marcx:subfield code="j">f</marcx:subfield>\
<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="018">\
<marcx:subfield code="a">28330405</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021">\
<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032">\
<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>\
<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041">\
<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100">\
<marcx:subfield code="a">KnausgÃ¥rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield><marcx:subfield code="4">aut</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241">\
<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield><marcx:subfield code="g">5. bog</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="250">\
<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">Ã·</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="c">2012</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">699 sider</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">6 bind</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504">\
<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Karl Ove flytter til Bergen for at gÃ¥ pÃ¥ Skrivekunstakademiet. Det bliver en gedigen skuffelse.</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521">\
<marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield><marcx:subfield code="k">tr. i udl.</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="o">sk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">far-sÃ¸n forholdet</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">dÃ¸den</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">forÃ¦ldre</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">bÃ¸rn</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="720">\
<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="990">\
<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="991">\
<marcx:subfield code="o">Ekspres 201206</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996">\
<marcx:subfield code="a">DBC</marcx:subfield></marcx:datafield>\
</marcx:record>\
<marcx:record format="danMARC2" type="BibliographicMain">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">28330405</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">20121112092831</marcx:subfield><marcx:subfield code="d">20100624</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004"><\
marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">h</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="d">x</marcx:subfield>\
<marcx:subfield code="j">f</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="041">\
<marcx:subfield code="a">dan</marcx:subfield><marcx:subfield code="c">nor</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="100">\
<marcx:subfield code="a">KnausgÃ¥rd</marcx:subfield><marcx:subfield code="h">Karl Ove</marcx:subfield><marcx:subfield code="4">aut</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="241">\
<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="r">norsk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Lindhardt og Ringhof</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">6 bind</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="n">85</marcx:subfield><marcx:subfield code="z">26</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="o">sk</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">far-sÃ¸n forholdet</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">dÃ¸den</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">alkoholmisbrug</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">forfattere</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">familien</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">parforhold</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">forÃ¦ldre</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">bÃ¸rn</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">barndom</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">identitet</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">barndomserindringer</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="s">erindringer</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">1980-1989</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">1990-1999</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="i">2000-2009</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="q">Norge</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="666">\
<marcx:subfield code="0"/><marcx:subfield code="q">Sverige</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="720">\
<marcx:subfield code="o">Sara Koch</marcx:subfield><marcx:subfield code="4">trl</marcx:subfield></marcx:datafield>\
</marcx:record>\
<marcx:record format="danMARC2" type="BibliographicVolume">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">29189129</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">20120220144911</marcx:subfield><marcx:subfield code="d">20120127</marcx:subfield><marcx:subfield code="f">a</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">b</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">2012</marcx:subfield>\
<marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="014">\
<marcx:subfield code="a">28330405</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="021">\
<marcx:subfield code="e">9788711408667</marcx:subfield><marcx:subfield code="c">hf.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="032">\
<marcx:subfield code="x">ACC201204</marcx:subfield><marcx:subfield code="a">DBF201207</marcx:subfield>\
<marcx:subfield code="x">BKM201207</marcx:subfield><marcx:subfield code="x">DAT201206</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="g">5. bog</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="250">\
<marcx:subfield code="a">1. udgave</marcx:subfield><marcx:subfield code="b">Ã·</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="c">2012</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">699 sider</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="504">\
<marcx:subfield code="&amp;">1</marcx:subfield><marcx:subfield code="a">Karl Ove flytter til Bergen for at gÃ¥ pÃ¥ Skrivekunstakademiet. Det bliver en gedigen skuffelse; han vil sÃ¥ meget, ved sÃ¥ lidt og fÃ¥r ingenting med. Med et tilsyneladende grundlÃ¸st gÃ¥-pÃ¥ mod fortsÃ¦tter han alligevel med at skrive og lÃ¦se. Gradvist Ã¦ndrer skrivningen sig. Forholdet til verden rundt om ham Ã¦ndrer sig ogsÃ¥</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="521">\
<marcx:subfield code="&amp;">REX</marcx:subfield><marcx:subfield code="b">1. oplag</marcx:subfield><marcx:subfield code="c">2012</marcx:subfield>\
<marcx:subfield code="k">tr. i udl.</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="990">\
<marcx:subfield code="o">201207</marcx:subfield><marcx:subfield code="b">v</marcx:subfield><marcx:subfield code="u">nt</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="991">\
<marcx:subfield code="o">Ekspres 201206</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
<adminData>\
<recordStatus>active</recordStatus>\
<creationDate>2012-01-27</creationDate>\
<libraryType>none</libraryType>\
<indexingAlias>danmarcxchange</indexingAlias>\
<accessType>physical</accessType>\
<genre>fiktion</genre>\
<collectionIdentifier>870970-basis</collectionIdentifier>\
</adminData>\
</ting:container>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="localData.870970-basis" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.870970-basis.0" LABEL="" CREATED="2014-02-14T10:05:07.185Z" MIMETYPE="text/xml" SIZE="1550">\
<foxml:xmlContent>\
<ting:localData xmlns:ting="http://www.dbc.dk/ting">\
<marcx:record xmlns:marcx="info:lc/xmlns/marcxchange-v1" format="danMARC2" type="BibliographicLocal">\
<marcx:datafield ind1="0" ind2="0" tag="d08"><marcx:subfield code="a">100: JR fremhÃ¦vet pÃ¥ omslag og etiket</marcx:subfield>\
        <marcx:subfield code="o">lhp</marcx:subfield>\
        <marcx:subfield code="k">hlt</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="d09">\
        <marcx:subfield code="z">SFG200920</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="f06">\
        <marcx:subfield code="b">v</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="n51">\
        <marcx:subfield code="a">20090511</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="n55">\
        <marcx:subfield code="a">20090324</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="s12">\
        <marcx:subfield code="t">TeamMUS200919</marcx:subfield>\
      </marcx:datafield><marcx:datafield ind1="0" ind2="0" tag="z99">\
        <marcx:subfield code="a">hlt</marcx:subfield>\
      </marcx:datafield></marcx:record><adminData>\
    <recordStatus>active</recordStatus>\
    <creationDate>2009-03-24</creationDate>\
    <libraryType>none</libraryType>\
    <indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType>\
    <workType>music</workType>\
    <collectionIdentifier>870970-basis</collectionIdentifier>\
  </adminData></ting:localData>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.1" LABEL="" CREATED="2014-02-14T10:05:07.338Z" MIMETYPE="application/rdf+xml" SIZE="296">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="info:fedora/870970-basis:27681794">\
<isMemberOfUnit xmlns="info:fedora/">unit:202</isMemberOfUnit><isPrimaryBibObjectFor xmlns="info:fedora/">unit:202</isPrimaryBibObjectFor>\
</rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.1" LABEL="" CREATED="2014-02-14T10:08:35.788Z" MIMETYPE="text/xml" SIZE="1670">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ \
http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>lieder</dc:title><dc:title>MATCH:lieder</dc:title>\
<dc:creator>johan reuter</dc:creator><dc:creator>NOBIRTH:johan reuter</dc:creator><dc:creator>MATCHSTRING:reuterj</dc:creator>\
<dc:subject>baryton</dc:subject><dc:subject>lied</dc:subject><dc:subject>nationalromantik</dc:subject>\
<dc:subject>sange</dc:subject><dc:subject>senromantik</dc:subject><dc:subject>vokal</dc:subject>\
<dc:subject>Tyskland</dc:subject><dc:subject>Danmark</dc:subject><dc:subject>Danmark</dc:subject>\
<dc:subject>1880-1889</dc:subject><dc:subject>1890-1899</dc:subject><dc:subject>1890-1899</dc:subject>\
<dc:subject>1900-1909</dc:subject>\
<dc:publisher>michael storrs music</dc:publisher><dc:publisher>MATCHSTRING:michael</dc:publisher>\
<dc:contributor>MATCHSTRING:henzenw</dc:contributor>\
<dc:contributor>MATCHSTRING:jacobsenj</dc:contributor><dc:contributor>MATCHSTRING:lÃ¸nskovt</dc:contributor>\
<dc:contributor>wilhelm henzen</dc:contributor>\
<dc:contributor>j p jacobsen f 1847</dc:contributor><dc:contributor>tove lÃ¸nskov</dc:contributor>\
<dc:contributor>richard strauss</dc:contributor><dc:contributor>carl nielsen f 1865</dc:contributor><dc:contributor>hakon bÃ¸rresen</dc:contributor>\
<dc:date>2008</dc:date>\
<dc:type>Cd (musik)</dc:type><dc:type>WORK:music</dc:type>\
<dc:identifier>870970-basis:27681794</dc:identifier><dc:identifier>NUMBER:MSM0011</dc:identifier>\
<dc:language>Tysk</dc:language>\
</oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "870970-basis:29189129";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    Assert.equalValue( "1 document added", documents.length, 1 );

} );


UnitTest.addFixture( "IndexCreator.prepareData 3", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function ( doc ) { documents.push( doc ); },
        deleteDocument: function ( doc ) { deleteDoc.push( doc ); }
    };

    var libraryRuleHandlerMock = {
        isAllowed: function( agencyId, rule ) { 
            if( agencyId === "710100" ) {
                return true;
            } else if ( agencyId === "870970" ) {
				return false;
			}
        } 
    };

    var foXml = '<foxml:digitalObject VERSION="1.1" PID="870970-basis:41013176" xmlns:foxml="info:fedora/fedora-system:def/foxml#" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="info:fedora/fedora-system:def/foxml# \
    http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Active"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-10-05T08:45:20.272Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2015-08-27T08:39:38.965Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.1" LABEL="" CREATED="2014-10-05T08:45:20.306Z" MIMETYPE="application/rdf+xml" SIZE="304">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="info:fedora/870970-basis:41013176">\
<isMemberOfUnit xmlns="info:fedora/">unit:1075796</isMemberOfUnit><isPrimaryBibObjectFor xmlns="info:fedora/">unit:1075796</isPrimaryBibObjectFor>\
</rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.2" LABEL="" CREATED="2015-07-03T22:28:14.841Z" MIMETYPE="text/xml" SIZE="722">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ \
http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>lærebog i den evangelisk-christelige religion</dc:title>\
<dc:title>MATCHSTRING:laerebogidenevangeliskchristeligereligionskeskoler</dc:title>\
<dc:title>MATCH:laereb</dc:title>\
<dc:publisher>schulz</dc:publisher>\
<dc:publisher>MATCHSTRING:schulz</dc:publisher>\
<dc:date>1840</dc:date><dc:type>Bog</dc:type>\
<dc:type>WORK:literature</dc:type>\
<dc:identifier>870970-basis:41013176</dc:identifier><dc:language>Dansk</dc:language></oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="commonData" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="commonData.1" LABEL="" CREATED="2015-07-03T22:28:14.852Z" MIMETYPE="text/xml" SIZE="4502">\
<foxml:xmlContent>\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" \
xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>41013176|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Lærebog i den Evangelisk-christelige Religion</dc:title>\
<dc:title xsi:type="dkdcplus:full">Lærebog i den Evangelisk-christelige Religion : indrettet til Brug i de danske Skoler</dc:title>\
<dc:subject xsi:type="dkdcplus:DK5">23</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Dogmatik</dc:subject>\
<dc:description>Trykt med gotisk skrift</dc:description>\
<dcterms:audience>voksenmaterialer</dcterms:audience>\
<dc:publisher>Schulz</dc:publisher>\
<dc:date>1840</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dcterms:extent>120 sider</dcterms:extent>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">41013176</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">19950927</marcx:subfield><marcx:subfield code="d">19950927</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield>\
<marcx:subfield code="o">c</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="002">\
<marcx:subfield code="b">710100</marcx:subfield><marcx:subfield code="c">90291319</marcx:subfield>\
<marcx:subfield code="x">71010090291319</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield><marcx:subfield code="a">1840</marcx:subfield>\
<marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Lærebog i den Evangelisk-christelige Religion</marcx:subfield>\
<marcx:subfield code="c">indrettet til Brug i de danske Skoler</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Schulz</marcx:subfield><marcx:subfield code="c">1840</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">120 sider</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512">\
<marcx:subfield code="a">Trykt med gotisk skrift</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="m">23</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996">\
<marcx:subfield code="a">710100</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
<ln:links xmlns:ln="http://oss.dbc.dk/ns/links">\
<ln:link><ln:access>remote</ln:access><ln:accessType></ln:accessType><ln:linkTo>resolver</ln:linkTo>\
<ln:relationType>dbcaddi:hasOpenUrl</ln:relationType>\
<ln:url>_BASEURL_url_ctx_fmt=info:ofi/fmt:kev:mtx:ctx&amp;ctx_ver=Z39.88-2004&amp;rft_val_fmt=info:ofi/fmt:kev:mtx:book&amp;rft.btitle=Lærebog+i+den+Evangelisk-christelige+Religion&amp;rft.date=1840&amp;rft.pub=Schulz&amp;rft.genre=book</ln:url>\
<ln:collectionIdentifier>870970-basis</ln:collectionIdentifier><ln:collectionIdentifier>870970-bibdk</ln:collectionIdentifier></ln:link>\
</ln:links>\
<adminData>\
<recordStatus>active</recordStatus><creationDate>2005-03-01</creationDate><libraryType>none</libraryType>\
<indexingAlias>danmarcxchange</indexingAlias>\
<accessType>physical</accessType><genre>nonfiktion</genre><workType>literature</workType>\
<collectionIdentifier>870970-basis</collectionIdentifier><collectionIdentifier>870970-bibdk</collectionIdentifier>\
</adminData>\
</ting:container>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="localData.870970-basis" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.870970-basis.1" LABEL="" CREATED="2015-07-03T22:28:14.862Z" MIMETYPE="text/xml" SIZE="17">\
<foxml:xmlContent>\
<EMPTY></EMPTY>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="localData.710100-katalog" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.710100-katalog.1" LABEL="" CREATED="2015-08-27T08:39:38.965Z" MIMETYPE="text/xml" SIZE="3980">\
<foxml:xmlContent>\
<ting:localData xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" \
xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>41013176|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Balles Lærebog</dc:title>\
<dc:title xsi:type="dkdcplus:full">Balles Lærebog</dc:title>\
<dc:subject xsi:type="dkdcplus:DK5">23.7</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Symbolik (Konfessionslære)</dc:subject>\
<dc:description>Trykt med gotisk skrift</dc:description>\
<dcterms:audience>voksenmaterialer</dcterms:audience>\
<dc:publisher>Schulz</dc:publisher>\
<dc:date>1840</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
<marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>00000d    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="a">41013176</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield><\
/marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="002">\
<marcx:subfield code="b">710100</marcx:subfield><marcx:subfield code="c">90291319</marcx:subfield><marcx:subfield code="x">710190291319</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="a">e</marcx:subfield><marcx:subfield code="r">d</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="v">0</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>\
<marcx:subfield code="a">1840</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield><marcx:subfield code="l">dan</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Balles Lærebog</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Schulz</marcx:subfield><marcx:subfield code="c">1840</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">120 sider</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512">\
<marcx:subfield code="a">Trykt med gotisk skrift</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="p">23</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="m">23.7</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
<ln:links xmlns:ln="http://oss.dbc.dk/ns/links">\
<ln:link><ln:access>remote</ln:access><ln:accessType></ln:accessType><ln:linkTo>resolver</ln:linkTo>\
<ln:relationType>dbcaddi:hasOpenUrl</ln:relationType>\
<ln:url>_BASEURL_url_ctx_fmt=info:ofi/fmt:kev:mtx:ctx&amp;ctx_ver=Z39.88-2004&amp;rft_val_fmt=info:ofi/fmt:kev:mtx:book&amp;rft.btitle=Balles+Lærebog&amp;rft.date=1840&amp;rft.pub=Schulz&amp;rft.genre=book</ln:url>\
<ln:collectionIdentifier>710100-katalog</ln:collectionIdentifier></ln:link>\
</ln:links>\
<adminData>\
<recordStatus>active</recordStatus><libraryType>public</libraryType>\
<indexingAlias>danmarcxchange</indexingAlias>\
<accessType>physical</accessType><genre>nonfiktion</genre><workType>literature</workType>\
<collectionIdentifier>710100-katalog</collectionIdentifier>\
</adminData>\
</ting:localData>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "870970-basis:41013176";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    Assert.equalValue( "2 documents added", documents.length, 2 );

} );


UnitTest.addFixture( "IndexCreator.prepareData 4", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function (doc) { documents.push( doc ); },
        deleteDocument: function (doc) { deleteDoc.push( doc ); }
    };
    
    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return true; } };

    var foXml = '<foxml:digitalObject VERSION="1.1" PID="872530-katalog:27681794" \
    xmlns:foxml="info:fedora/fedora-system:def/foxml#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
    xsi:schemaLocation="info:fedora/fedora-system:def/foxml# http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Active"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-02-14T10:05:07.144Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2014-02-14T10:08:35.788Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="commonData" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="commonData.0" LABEL="" CREATED="2014-02-14T10:05:07.184Z" MIMETYPE="text/xml" SIZE="18608">\
<foxml:xmlContent>\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" xmlns:dc="http://purl.org/dc/elements/1.1/" \
xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" xmlns:docbook="http://docbook.org/ns/docbook" \
xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
  <dkabm:record>\
    <ac:identifier>27681794|870970</ac:identifier>\
    <ac:source>Bibliotekskatalog</ac:source>\
    <dc:title>Lieder</dc:title>\
    <dc:title xsi:type="dkdcplus:full">Lieder</dc:title>\
    <dc:creator>Johan Reuter</dc:creator>\
    <dc:creator xsi:type="oss:sort">Reuter, Johan</dc:creator>\
    <dc:subject xsi:type="dkdcplus:DK5">78.611</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DK5-Text">Antologier af vokalmusik for 1 solostemme</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">baryton</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">lied</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">nationalromantik</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">sange</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">senromantik</dc:subject>\
    <dc:subject xsi:type="dkdcplus:genre">solosang</dc:subject>\
    <dc:subject xsi:type="dkdcplus:DBCM">vokal</dc:subject>\
    <dkdcplus:shelf xsi:type="oss:musicshelf">Vokalmusik. Antologier</dkdcplus:shelf>\
    <dc:description>Indspillet i Berlin 29.-30. september 2008</dc:description>\
    <dc:description>Tekster pÃ¥ omslag</dc:description>\
    <dcterms:audience>voksenmaterialer</dcterms:audience>\
    <dc:publisher>Michael Storrs Music</dc:publisher>\
    <dc:contributor>Wilhelm Henzen</dc:contributor>\
    <dc:contributor>J. P. Jacobsen (f. 1847)</dc:contributor>\
    <dc:contributor>Tove LÃ¸nskov</dc:contributor>\
    <dc:contributor>Richard Strauss</dc:contributor>\
    <dc:contributor>Carl Nielsen (f. 1865)</dc:contributor>\
    <dc:contributor>Hakon BÃ¸rresen</dc:contributor>\
    <dc:date>2008</dc:date>\
    <dc:type xsi:type="dkdcplus:BibDK-Type">Cd (musik)</dc:type>\
    <dc:format>1 cd</dc:format>\
    <dc:identifier>MSM 0011</dc:identifier>\
    <dc:language xsi:type="dcterms:ISO639-2">ger</dc:language>\
    <dc:language>Tysk</dc:language>\
    <dcterms:hasPart xsi:type="dkdcplus:track">Marine</dcterms:hasPart>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Tyskland</dcterms:spatial>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Danmark</dcterms:spatial>\
    <dcterms:spatial xsi:type="dkdcplus:DBCM">Danmark</dcterms:spatial>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1880-1889</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1890-1899</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1890-1899</dcterms:temporal>\
    <dcterms:temporal xsi:type="dkdcplus:DBCM">1900-1909</dcterms:temporal>\
  </dkabm:record>\
  <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
    <marcx:record format="danMARC2" type="Bibliographic">\
      <marcx:leader>00000n    2200000   4500</marcx:leader>\
      <marcx:datafield ind1="0" ind2="0" tag="001">\
        <marcx:subfield code="a">27681794</marcx:subfield>\
        <marcx:subfield code="b">872530</marcx:subfield>\
        <marcx:subfield code="c">20090511180353</marcx:subfield>\
        <marcx:subfield code="d">20090324</marcx:subfield>\
        <marcx:subfield code="f">a</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="004">\
        <marcx:subfield code="r">n</marcx:subfield>\
        <marcx:subfield code="a">e</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="005">\
        <marcx:subfield code="h">e</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="008">\
        <marcx:subfield code="t">s</marcx:subfield>\
        <marcx:subfield code="u">f</marcx:subfield>\
        <marcx:subfield code="a">2008</marcx:subfield>\
        <marcx:subfield code="b">de</marcx:subfield>\
        <marcx:subfield code="l">ger</marcx:subfield>\
        <marcx:subfield code="v">0</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="009">\
        <marcx:subfield code="a">s</marcx:subfield>\
        <marcx:subfield code="g">xc</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="020">\
        <marcx:subfield code="a">dk</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="021">\
        <marcx:subfield code="d">Kr. 136,00</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="023">\
        <marcx:subfield code="a">0879524001127</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="032">\
        <marcx:subfield code="a">DMO200920</marcx:subfield>\
        <marcx:subfield code="x">BKM200920</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="039">\
        <marcx:subfield code="a">voa</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="100">\
        <marcx:subfield code="a">Reuter</marcx:subfield>\
        <marcx:subfield code="h">Johan</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="245">\
        <marcx:subfield code="a">Lieder</marcx:subfield>\
        <marcx:subfield code="e">Johan Reuter, baryton</marcx:subfield>\
        <marcx:subfield code="e">Tove LÃ¸nskov, klaver</marcx:subfield>\
        <marcx:subfield code="i">produced by: Desmond Chewyn</marcx:subfield>\
        <marcx:subfield code="i">sound engineering executive/mixer: Markus Mittermeyer</marcx:subfield>\
        <marcx:subfield code="i">sound editor: Holger Kirchhoff</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="260">\
        <marcx:subfield code="a">London</marcx:subfield>\
        <marcx:subfield code="b">Michael Storrs Music</marcx:subfield>\
        <marcx:subfield code="c">2008</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="300">\
        <marcx:subfield code="n">1 cd</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="512">\
        <marcx:subfield code="a">Indspillet i Berlin 29.-30. september 2008</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="512">\
        <marcx:subfield code="a">Tekster pÃ¥ omslag</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="531">\
        <marcx:subfield code="a">Indhold:</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="538">\
        <marcx:subfield code="f">MSM</marcx:subfield>\
        <marcx:subfield code="g">0011</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="m">78.611</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">11</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">12</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="652">\
        <marcx:subfield code="Ã¥">13</marcx:subfield>\
        <marcx:subfield code="i">78.61</marcx:subfield>\
        <marcx:subfield code="v">3</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">11</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="m">lied</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1880-1889</marcx:subfield>\
        <marcx:subfield code="p">1890-1899</marcx:subfield>\
        <marcx:subfield code="l">Tyskland</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">12</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">nationalromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1890-1899</marcx:subfield>\
        <marcx:subfield code="l">Danmark</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="666">\
        <marcx:subfield code="0"></marcx:subfield>\
        <marcx:subfield code="Ã¥">13</marcx:subfield>\
        <marcx:subfield code="m">senromantik</marcx:subfield>\
        <marcx:subfield code="m">nationalromantik</marcx:subfield>\
        <marcx:subfield code="m">sange</marcx:subfield>\
        <marcx:subfield code="n">vokal</marcx:subfield>\
        <marcx:subfield code="n">baryton</marcx:subfield>\
        <marcx:subfield code="p">1900-1909</marcx:subfield>\
        <marcx:subfield code="l">Danmark</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="990">\
        <marcx:subfield code="o">200920</marcx:subfield>\
        <marcx:subfield code="b">v</marcx:subfield>\
        <marcx:subfield code="u">nt</marcx:subfield>\
      </marcx:datafield>\
      <marcx:datafield ind1="0" ind2="0" tag="996">\
        <marcx:subfield code="a">DBC</marcx:subfield>\
      </marcx:datafield>\
    </marcx:record>\
  </marcx:collection>\
  <adminData>\
    <recordStatus>active</recordStatus>\
    <creationDate>2009-03-24</creationDate>\
    <libraryType>none</libraryType>\
    <indexingAlias>danmarcxchange</indexingAlias>\
    <accessType>physical</accessType>\
    <workType>music</workType>\
    <collectionIdentifier>872530-katalog</collectionIdentifier>\
  </adminData>\
</ting:container>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.1" LABEL="" CREATED="2014-02-14T10:05:07.338Z" MIMETYPE="application/rdf+xml" SIZE="296">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
<rdf:Description rdf:about="info:fedora/872530-katalog:27681794"><isMemberOfUnit xmlns="info:fedora/">unit:202</isMemberOfUnit>\
<isPrimaryBibObjectFor xmlns="info:fedora/">unit:202</isPrimaryBibObjectFor></rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.1" LABEL="" CREATED="2014-02-14T10:08:35.788Z" MIMETYPE="text/xml" SIZE="1670">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>lieder</dc:title><dc:title>MATCH:lieder</dc:title>\
<dc:creator>johan reuter</dc:creator><dc:creator>NOBIRTH:johan reuter</dc:creator>\
<dc:creator>MATCHSTRING:reuterj</dc:creator><dc:subject>baryton</dc:subject><dc:subject>lied</dc:subject>\
<dc:subject>nationalromantik</dc:subject><dc:subject>sange</dc:subject><dc:subject>senromantik</dc:subject>\
<dc:subject>vokal</dc:subject><dc:subject>Tyskland</dc:subject><dc:subject>Danmark</dc:subject><dc:subject>Danmark</dc:subject>\
<dc:subject>1880-1889</dc:subject><dc:subject>1890-1899</dc:subject><dc:subject>1890-1899</dc:subject><dc:subject>1900-1909</dc:subject>\
<dc:publisher>michael storrs music</dc:publisher><dc:publisher>MATCHSTRING:michael</dc:publisher>\
<dc:contributor>MATCHSTRING:henzenw</dc:contributor><dc:contributor>MATCHSTRING:jacobsenj</dc:contributor>\
<dc:contributor>MATCHSTRING:lÃ¸nskovt</dc:contributor><dc:contributor>wilhelm henzen</dc:contributor>\
<dc:contributor>j p jacobsen f 1847</dc:contributor><dc:contributor>tove lÃ¸nskov</dc:contributor>\
<dc:contributor>richard strauss</dc:contributor><dc:contributor>carl nielsen f 1865</dc:contributor>\
<dc:contributor>hakon bÃ¸rresen</dc:contributor><dc:date>2008</dc:date><dc:type>Cd (musik)</dc:type><dc:type>WORK:music</dc:type>\
<dc:identifier>872530-katalog:27681794</dc:identifier><dc:identifier>NUMBER:MSM0011</dc:identifier><dc:language>Tysk</dc:language>\
</oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "872530-katalog:27681794";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    Assert.equalValue( "Prepare Data 4: 1 document added although there is no localData stream", documents.length, 1 );

} );

UnitTest.addFixture( "IndexCreator.prepareData delete from empty local datastream (bug 19735)", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function (doc) { documents.push( doc ); },
        deleteDocument: function (doc) { deleteDoc.push( doc ); }
    };

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return true; } };

    var foXml = '<foxml:digitalObject VERSION="1.1" PID="870970-basis:41013176" xmlns:foxml="info:fedora/fedora-system:def/foxml#" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="info:fedora/fedora-system:def/foxml# http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Active"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-10-05T08:45:20.272Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2015-08-27T08:39:38.965Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.1" LABEL="" CREATED="2014-10-05T08:45:20.306Z" MIMETYPE="application/rdf+xml" SIZE="304">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
<rdf:Description rdf:about="info:fedora/870970-basis:41013176">\
<isMemberOfUnit xmlns="info:fedora/">unit:1075796</isMemberOfUnit><isPrimaryBibObjectFor xmlns="info:fedora/">unit:1075796</isPrimaryBibObjectFor>\
</rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.2" LABEL="" CREATED="2015-07-03T22:28:14.841Z" MIMETYPE="text/xml" SIZE="722">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>lærebog i den evangelisk-christelige religion</dc:title>\
<dc:title>MATCHSTRING:laerebogidenevangeliskchristeligereligionskeskoler</dc:title>\
<dc:title>MATCH:laereb</dc:title>\
<dc:publisher>schulz</dc:publisher>\
<dc:publisher>MATCHSTRING:schulz</dc:publisher>\
<dc:date>1840</dc:date><dc:type>Bog</dc:type>\
<dc:type>WORK:literature</dc:type><dc:identifier>870970-basis:41013176</dc:identifier>\
<dc:language>Dansk</dc:language></oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="commonData" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="commonData.1" LABEL="" CREATED="2015-07-03T22:28:14.852Z" MIMETYPE="text/xml" SIZE="4502">\
<foxml:xmlContent>\
<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" \
xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
xmlns:docbook="http://docbook.org/ns/docbook" xmlns:oss="http://oss.dbc.dk/ns/osstypes" \
xmlns:ting="http://www.dbc.dk/ting" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>41013176|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Lærebog i den Evangelisk-christelige Religion</dc:title>\
<dc:title xsi:type="dkdcplus:full">Lærebog i den Evangelisk-christelige Religion : indrettet til Brug i de danske Skoler</dc:title>\
<dc:subject xsi:type="dkdcplus:DK5">23</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Dogmatik</dc:subject>\
<dc:description>Trykt med gotisk skrift</dc:description>\
<dcterms:audience>voksenmaterialer</dcterms:audience>\
<dc:publisher>Schulz</dc:publisher>\
<dc:date>1840</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dcterms:extent>120 sider</dcterms:extent>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">41013176</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">19950927</marcx:subfield><marcx:subfield code="d">19950927</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield><marcx:subfield code="o">c</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="002">\
<marcx:subfield code="b">710100</marcx:subfield><marcx:subfield code="c">90291319</marcx:subfield>\
<marcx:subfield code="x">71010090291319</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>\
<marcx:subfield code="a">1840</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>\
<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Lærebog i den Evangelisk-christelige Religion</marcx:subfield>\
<marcx:subfield code="c">indrettet til Brug i de danske Skoler</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Schulz</marcx:subfield>\
<marcx:subfield code="c">1840</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">120 sider</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="512">\
<marcx:subfield code="a">Trykt med gotisk skrift</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="m">23</marcx:subfield></marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="996">\
<marcx:subfield code="a">710100</marcx:subfield></marcx:datafield>\
</marcx:record>\
</marcx:collection>\
<ln:links xmlns:ln="http://oss.dbc.dk/ns/links">\
<ln:link><ln:access>remote</ln:access><ln:accessType></ln:accessType><ln:linkTo>resolver</ln:linkTo>\
<ln:relationType>dbcaddi:hasOpenUrl</ln:relationType>\
<ln:url>_BASEURL_url_ctx_fmt=info:ofi/fmt:kev:mtx:ctx&amp;ctx_ver=Z39.88-2004&amp;rft_val_fmt=info:ofi/fmt:kev:mtx:book&amp;rft.btitle=Lærebog+i+den+Evangelisk-christelige+Religion&amp;rft.date=1840&amp;rft.pub=Schulz&amp;rft.genre=book</ln:url>\
<ln:collectionIdentifier>870970-basis</ln:collectionIdentifier><ln:collectionIdentifier>870970-bibdk</ln:collectionIdentifier></ln:link>\
</ln:links>\
<adminData>\
<recordStatus>active</recordStatus><creationDate>2005-03-01</creationDate><libraryType>none</libraryType>\
<indexingAlias>danmarcxchange</indexingAlias><accessType>physical</accessType><genre>nonfiktion</genre>\
<workType>literature</workType>\
<collectionIdentifier>870970-basis</collectionIdentifier><collectionIdentifier>870970-bibdk</collectionIdentifier>\
</adminData>\
</ting:container>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="localData.710100-katalog" STATE="D" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.710100-katalog.1" LABEL="" CREATED="2015-08-27T08:39:38.965Z" MIMETYPE="text/xml" SIZE="3980">\
<foxml:xmlContent>\
<EMPTY></EMPTY>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "870970-basis:41013176";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    Assert.equalValue( "Delete empty datastream. 1 document must be deleted", deleteDoc.length, 1 );
    Assert.equalValue( "Delete empty datastream. Document for localData.710100-katalog in 870970-basis:41013176 must be deleted",
            deleteDoc[0], "870970-basis:41013176-710100-katalog" );


} );

UnitTest.addFixture( "IndexCreator.prepareData delete object with no common datastream", function( ) {

    var documents = [ ];
    var deleteDoc = [ ];

    var callBack = {
        addDocument: function (doc) { documents.push( doc ); },
        deleteDocument: function (doc) { deleteDoc.push( doc ); }
    };

    var libraryRuleHandlerMock = { isAllowed: function( agencyId, rule ){ return true; } };

    var foXml = '<?xml version="1.0" encoding="UTF-8"?>\
<foxml:digitalObject VERSION="1.1" PID="150029-ucviden:482c0cab-bae2-4cf7-abf8-c8dbe7b3de98" \
xmlns:foxml="info:fedora/fedora-system:def/foxml#" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="info:fedora/fedora-system:def/foxml# http://www.fedora.info/definitions/1/0/foxml1-1.xsd">\
<foxml:objectProperties>\
<foxml:property NAME="info:fedora/fedora-system:def/model#state" VALUE="Deleted"/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#label" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#ownerId" VALUE=""/>\
<foxml:property NAME="info:fedora/fedora-system:def/model#createdDate" VALUE="2014-10-21T09:54:20.189Z"/>\
<foxml:property NAME="info:fedora/fedora-system:def/view#lastModifiedDate" VALUE="2014-10-28T13:53:27.281Z"/>\
</foxml:objectProperties>\
<foxml:datastream ID="localData.150029-ucviden" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="localData.150029-ucviden.0" LABEL="" CREATED="2014-10-21T09:54:20.194Z" MIMETYPE="text/xml" SIZE="17">\
<foxml:xmlContent>\
<EMPTY></EMPTY>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="DC" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="DC.56" LABEL="" CREATED="2014-10-21T10:11:34.776Z" MIMETYPE="text/xml" SIZE="775">\
<foxml:xmlContent>\
<oai_dc:dc xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" \
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">\
<dc:title>crowd move</dc:title><dc:title>MATCHSTRING:crowdmovecrowdmove</dc:title><dc:title>MATCH:crowdm</dc:title>\
<dc:creator>istovan horatiu</dc:creator><dc:creator>NOBIRTH:istovan horatiu</dc:creator>\
<dc:publisher>ucn</dc:publisher><dc:publisher>MATCHSTRING:ucn</dc:publisher>\
<dc:date>2014</dc:date><dc:type>Studenterprojekt</dc:type><dc:type>WORK:none</dc:type>\
<dc:identifier>150029-ucviden:482c0cab-bae2-4cf7-abf8-c8dbe7b3de98</dc:identifier><dc:language>Engelsk</dc:language></oai_dc:dc>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
<foxml:datastream ID="RELS-SYS" STATE="A" CONTROL_GROUP="X" VERSIONABLE="false">\
<foxml:datastreamVersion ID="RELS-SYS.112" LABEL="" CREATED="2014-10-28T13:53:21.396Z" MIMETYPE="application/rdf+xml" SIZE="188">\
<foxml:xmlContent>\
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
<rdf:Description rdf:about="info:fedora/150029-ucviden:482c0cab-bae2-4cf7-abf8-c8dbe7b3de98"></rdf:Description></rdf:RDF>\
</foxml:xmlContent>\
</foxml:datastreamVersion>\
</foxml:datastream>\
</foxml:digitalObject>';

    var pid = "150029-ucviden:482c0cab-bae2-4cf7-abf8-c8dbe7b3de98";

    IndexCreator.prepareData( pid, foXml, libraryRuleHandlerMock, callBack );

    var testName = "Delete document with no commonData. 1 local document must be deleted";
    Assert.equalValue( testName, deleteDoc, [ "150029-ucviden:482c0cab-bae2-4cf7-abf8-c8dbe7b3de98-150029-ucviden" ] );
} );


UnitTest.addFixture( "createMarcObjects", function() {

    var indexingData = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" \
    xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
    xmlns:dkdcplus="http://biblstandard.dk/abm/namespace/dkdcplus/" \
    xmlns:oss="http://oss.dbc.dk/ns/osstypes" xmlns:ting="http://www.dbc.dk/ting" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\
<dkabm:record>\
<ac:identifier>41013176|870970</ac:identifier>\
<ac:source>Bibliotekskatalog</ac:source>\
<dc:title>Laerebog i den Evangelisk-christelige Religion</dc:title>\
<dc:subject xsi:type="dkdcplus:DK5">23</dc:subject>\
<dc:subject xsi:type="dkdcplus:DK5-Text">Dogmatik</dc:subject>\
<dc:publisher>Schulz</dc:publisher>\
<dc:date>1840</dc:date>\
<dc:type xsi:type="dkdcplus:BibDK-Type">Bog</dc:type>\
<dcterms:extent>120 sider</dcterms:extent>\
<dc:language xsi:type="dcterms:ISO639-2">dan</dc:language>\
<dc:language>Dansk</dc:language>\
</dkabm:record>\
<marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1"><marcx:record format="danMARC2" type="Bibliographic">\
<marcx:leader>00000n    2200000   4500</marcx:leader>\
<marcx:datafield ind1="0" ind2="0" tag="001">\
<marcx:subfield code="a">41013176</marcx:subfield><marcx:subfield code="b">870970</marcx:subfield>\
<marcx:subfield code="c">19950927</marcx:subfield><marcx:subfield code="d">19950927</marcx:subfield>\
<marcx:subfield code="f">a</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="004">\
<marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="008">\
<marcx:subfield code="t">m</marcx:subfield><marcx:subfield code="u">f</marcx:subfield>\
<marcx:subfield code="a">1840</marcx:subfield><marcx:subfield code="b">dk</marcx:subfield>\
<marcx:subfield code="l">dan</marcx:subfield><marcx:subfield code="v">0</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="009">\
<marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="245">\
<marcx:subfield code="a">Laerebog i den Evangelisk-christelige Religion</marcx:subfield>\
<marcx:subfield code="c">indrettet til Brug i de danske Skoler</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="260">\
<marcx:subfield code="a">Kbh.</marcx:subfield><marcx:subfield code="b">Schulz</marcx:subfield>\
<marcx:subfield code="c">1840</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="300">\
<marcx:subfield code="a">120 sider</marcx:subfield>\
</marcx:datafield>\
<marcx:datafield ind1="0" ind2="0" tag="652">\
<marcx:subfield code="m">23</marcx:subfield>\
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
<collectionIdentifier>870970-bibdk</collectionIdentifier>\
</adminData>\
</ting:container>');

    var singleRecord = new Record( );
    singleRecord.fromString(
        '001 00 *a41013176 *b870970 *c19950927 *d19950927 *fa\n' +
        '004 00 *rn *ae\n' +
        '008 00 *tm *uf *a1840 *bdk *ldan *v0\n' +
        '009 00 *aa *gxx\n' +
        '245 00 *aLaerebog i den Evangelisk-christelige Religion *cindrettet til Brug i de danske Skoler\n' +
        '260 00 *aKbh. *bSchulz *c1840\n' +
        '300 00 *a120 sider\n' +
        '652 00 *m23'
    );

    var expected = {
        "type": "single",
        "single": singleRecord,
        "merged": singleRecord
    };

    var actual = IndexCreator.createMarcObjects( indexingData );

    var testName = "createMarcObjects single objects - checking type";
    Assert.equalValue( testName, actual.type, expected.type );

    testName = "createMarcObjects single objects - checking single record";
    Assert.equalValue( testName, String( actual.single ), String( expected.single ) );


    indexingData = XmlUtil.fromString(
        '<ting:container xmlns:ac="http://biblstandard.dk/ac/namespace/" \
        xmlns:dkabm="http://biblstandard.dk/abm/namespace/dkabm/" \
        xmlns:ting="http://www.dbc.dk/ting">\
        <dkabm:record>\
            <ac:identifier>44741172|870970</ac:identifier>\
        </dkabm:record>\
        <marcx:collection xmlns:marcx="info:lc/xmlns/marcxchange-v1">\
            <marcx:record format="danMARC2" type="Bibliographic">\
            <marcx:leader>00000n    2200000   4500</marcx:leader>\
            <marcx:datafield ind1="0" ind2="0" tag="001">\
                <marcx:subfield code="a">44741172</marcx:subfield>\
                <marcx:subfield code="b">870970</marcx:subfield>\
                <marcx:subfield code="c">20100625111119</marcx:subfield>\
                <marcx:subfield code="d">20100128</marcx:subfield>\
                <marcx:subfield code="f">a</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="004">\
                <marcx:subfield code="r">n</marcx:subfield><marcx:subfield code="a">e</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="008">\
                <marcx:subfield code="t">m</marcx:subfield>\
                <marcx:subfield code="u">r</marcx:subfield>\
                <marcx:subfield code="a">2009</marcx:subfield>\
                <marcx:subfield code="z">2010</marcx:subfield>\
                <marcx:subfield code="b">no</marcx:subfield>\
                <marcx:subfield code="d">x</marcx:subfield>\
                <marcx:subfield code="j">f</marcx:subfield>\
                <marcx:subfield code="l">nor</marcx:subfield>\
                <marcx:subfield code="v">0</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="009">\
                <marcx:subfield code="a">a</marcx:subfield><marcx:subfield code="g">xx</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="245">\
                <marcx:subfield code="a">Min kamp</marcx:subfield>\
                <marcx:subfield code="c">roman</marcx:subfield>\
                <marcx:subfield code="g">Foerste bok</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="260">\
                <marcx:subfield code="c">2010</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="260">\
                <marcx:subfield code="a">Oslo</marcx:subfield>\
                <marcx:subfield code="b">Forlaget Oktober</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
        <marcx:record format="danMARC2" type="BibliographicMain">\
            <marcx:datafield ind1="0" ind2="0" tag="001">\
                <marcx:subfield code="a">44783851</marcx:subfield>\
                <marcx:subfield code="b">870970</marcx:subfield>\
                <marcx:subfield code="c">20111222143228</marcx:subfield>\
                <marcx:subfield code="d">20111222</marcx:subfield>\
                <marcx:subfield code="f">a</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="004">\
                <marcx:subfield code="a">h</marcx:subfield><marcx:subfield code="r">c</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="245">\
                <marcx:subfield code="a">Min kamp</marcx:subfield><marcx:subfield code="c">roman</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="260">\
                <marcx:subfield code="a">Oslo</marcx:subfield><marcx:subfield code="b">Forlaget Oktober</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
        <marcx:record format="danMARC2" type="BibliographicVolume">\
            <marcx:datafield ind1="0" ind2="0" tag="001">\
                <marcx:subfield code="a">44741172</marcx:subfield>\
                <marcx:subfield code="b">870970</marcx:subfield>\
                <marcx:subfield code="c">20100625111119</marcx:subfield>\
                <marcx:subfield code="d">20100128</marcx:subfield>\
                <marcx:subfield code="f">a</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="004">\
                <marcx:subfield code="r">c</marcx:subfield><marcx:subfield code="a">b</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="245">\
                <marcx:subfield code="G">1</marcx:subfield><marcx:subfield code="g">Foerste bok</marcx:subfield>\
            </marcx:datafield>\
            <marcx:datafield ind1="0" ind2="0" tag="260">\
                <marcx:subfield code="c">2010</marcx:subfield>\
            </marcx:datafield>\
        </marcx:record>\
    </marcx:collection>\
</ting:container>');

    var mergedRecord = new Record( );
    mergedRecord.fromString(
        '001 00 *a 44741172 *b 870970 *c 20100625111119 *d 20100128 *f a \n' +
        '004 00 *r n *a e \n' +
        '008 00 *t m *u r *a 2009 *z 2010 *b no *d x *j f *l nor *v 0 \n' +
        '009 00 *a a *g xx \n' +
        '245 00 *a Min kamp *c roman *g Foerste bok \n' +
        '260 00 *c 2010 \n260 00 *a Oslo *b Forlaget Oktober \n'
    );

    var mainRecord =new Record( );
    mainRecord.fromString(
        '001 00 *a 44783851 *b 870970 *c 20111222143228 *d 20111222 *f a \n' +
        '004 00 *a h *r c \n' +
        '245 00 *a Min kamp *c roman \n' +
        '260 00 *a Oslo *b Forlaget Oktober \n'
    );

    var volumeRecord = new Record();
    volumeRecord.fromString(
        '001 00 *a 44741172 *b 870970 *c 20100625111119 *d 20100128 *f a \n' +
        '004 00 *r c *a b \n' +
        '245 00 *G 1 *g Foerste bok \n' +
        '260 00 *c 2010 \n'
    );

    expected = {
        "type": "volume",
        "merged": mergedRecord,
        "main": mainRecord,
        "volume": volumeRecord
    };

    actual = IndexCreator.createMarcObjects( indexingData );

    testName = "createMarcObjects head-volume objects - checking type";
    Assert.equalValue( testName, actual.type, expected.type );

    testName = "createMarcObjects head-volume objects - checking head record";
    Assert.equalValue( testName, String( actual.main ), String( expected.main ) );

    testName = "createMarcObjects head-volume objects - checking volume record";
    Assert.equalValue( testName, String( actual.volume ), String( expected.volume ) );

    testName = "createMarcObjects head-volume objects - checking merged record";
    Assert.equalValue( testName, String( actual.merged ), String( expected.merged ) );

} );


Repository.getSysRelationsOfType = undefined;