use( "DkcclPhraseIndex" );
use( "UnitTest" );
use( "Marc" );
use( "MarcUtility" );
use( "Index" );
use( "IndexNormalizer" );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclBcmFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "085", "00" );
    field.append( "a", "MME" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.bcm",
        value: "MME"
    } ];

    Assert.equalValue( "Create dkccl bcm fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclBcmFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclDbkFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "079", "00" );
    field.append( "a", "14" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.dbk",
        value: "14"
    } ];

    Assert.equalValue( "Create dkccl dbk fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclDbkFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclDdcFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "082", "00" );
    field.append( "a", "823" );
    field.append( "b", ".912" );
    field.append( "d", "F" );
    field.append( "c", "19" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.ddc",
        value: "823 .912 F"
    } ];

    Assert.equalValue( "Create dkccl ddc fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclDdcFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLacFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "662", "00" );
    field.append( "a", "Procaryotes" );
    field.append( "b", "Encyclopedia" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lac",
        value: "Procaryotes"
    }, {
        name: "dkcclphrase.lac",
        value: "Encyclopedia"
    } ];

    Assert.equalValue( "Create dkccl lac fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLacFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLagFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "610", "00" );
    field.append( "a", "Aalborg Portland" );
    field.append( "e", "firma" );
    field.append( "2", "NAL" );
    record.append( field );
    field = new Field( "634", "00" );
    field.append( "c", "1950" );
    field.append( "d", "1959" );
    field.append( "v", "noget" );
    field.append( "2", "NAL" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lag",
        value: "Aalborg Portland firma"
    }, {
        name: "dkcclphrase.lag",
        value: "1950 1959 noget"
    } ];

    Assert.equalValue( "Create dkccl lag fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLagFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLauFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subField = new Subfield( "A", "lelionnais" );
    field.append( subField );
    subField = new Subfield( "a", "Le Lionnais" );
    field.append( subField );
    subField = new Subfield( "h", "Francois" );
    field.append( subField );
    record.append( field );
    field = new Field( "654", "00" );
    subField = new Subfield( "b", "delfelt b" );
    field.append( subField );
    record.append( field );
    field = new Field( "654", "00" );
    subField = new Subfield( "t", "delfelt t" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lau",
        value: "lelionnais Francois"
    }, {
        name: "dkcclphrase.lau",
        value: "Le Lionnais Francois"
    }, {
        name: "dkcclphrase.lau",
        value: "delfelt b"
    }, {
        name: "dkcclphrase.lau",
        value: "delfelt t"
    }, {
        name: "dkcclphrase.lau",
        value: "delfelt t"
    } ];

    Assert.equalValue( "Create dkccl lau fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLauFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLbrFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "021", "00" );
    var subField = new Subfield( "b", "Brugsretskategori: A" );
    field.append( subField );
    subField = new Subfield( "b", "for private" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lbr",
        value: "Brugsretskategori: A for private"
    } ];

    Assert.equalValue( "Create dkccl lbr fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLbrFields, index, record ), indexOut );


} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLccFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "050", "00" );
    var subField = new Subfield( "a", "QC861.2" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lcc",
        value: "QC861.2"
    } ];

    Assert.equalValue( "Create dkccl lcc fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLccFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLclFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subField = new Subfield( "a", "42787388" );
    field.append( subField );
    subField = new Subfield( "b", "870970" );
    field.append( subField );
    record.append( field );
    field = new Field( "652", "00" );
    subField = new Subfield( "m", "72" );
    field.append( subField );
    subField = new Subfield( "a", "Blixen" );
    field.append( subField );
    subField = new Subfield( "h", "Karen" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lcl",
        value: "72"
    } ];

    Assert.equalValue( "Create dkccl lcl fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLclFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLcpFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "690", "00" );
    var subField = new Subfield( "b", "Great Britain" );
    field.append( subField );
    subField = new Subfield( "d", "History, 1837-1901" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lcp",
        value: "Great Britain History, 1837-1901"
    } ];

    Assert.equalValue( "Create dkccl lcp fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLcpFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLdbFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    var subField = new Subfield( "f", "aztekerne" );
    field.append( subField );
    subField = new Subfield( "e", "Mexiko" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.ldb",
        value: "aztekerne"
    }, {
        name: "dkcclphrase.ldb",
        value: "Mexiko"
    } ];

    Assert.equalValue( "Create dkccl ldb fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLdbFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLdfFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    var subField = new Subfield( "f", "aztekerne" );
    field.append( subField );
    subField = new Subfield( "e", "Mexiko" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.ldf",
        value: "aztekerne"
    }, {
        name: "dkcclphrase.ldf",
        value: "Mexiko"
    } ];

    Assert.equalValue( "Create dkccl ldf fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLdfFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLdkFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subField = new Subfield( "p", "78.9064" );
    field.append( subField );
    subField = new Subfield( "v", "5" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.ldk",
        value: "5"
    }, {
        name: "dkcclphrase.ldk",
        value: "78.9064 5"
    }, {
        name: "dkcclphrase.ldk",
        value: "5"
    }, {
        name: "dkcclphrase.ldk",
        value: "5"
    }, {
        name: "dkcclphrase.ldk",
        value: "78.9064"
    }, {
        name: "dkcclphrase.ldk",
        value: "5"
    }, {
        name: "dkcclphrase.ldk",
        value: "5"
    } ];

    Assert.equalValue( "Create dkccl ldk fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLdkFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLdsFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    var subField = new Subfield( "s", "historiske romaner" );
    field.append( subField );
    subField = new Subfield( "q", "Norge" );
    field.append( subField );
    subField = new Subfield( "q", "Koebenhavn" );
    field.append( subField );
    subField = new Subfield( "i", "1860-1869" );
    field.append( subField );
    subField = new Subfield( "s", "maend" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lds",
        value: "historiske romaner"
    }, {
        name: "dkcclphrase.lds",
        value: "Norge"
    }, {
        name: "dkcclphrase.lds",
        value: "Koebenhavn"
    }, {
        name: "dkcclphrase.lds",
        value: "maend"
    } ];

    Assert.equalValue( "Create dkccl lds fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLdsFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLedFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "661", "00" );
    var subField = new Subfield( "c", "Livslang integreret undervisning" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.led",
        value: "Livslang integreret undervisning"
    } ];

    Assert.equalValue( "Create dkccl led fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLedFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLefFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "630", "00" );
    var subField = new Subfield( "f", "rockmusikere" );
    field.append( subField );
    subField = new Subfield( "f", "amerikanske rockmusikere" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lef",
        value: "rockmusikere"
    }, {
        name: "dkcclphrase.lef",
        value: "amerikanske rockmusikere"
    } ];

    Assert.equalValue( "Create dkccl lef fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLefFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLekFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "610", "00" );
    var subField = new Subfield( "a", "Aalborg Portland" );
    field.append( subField );
    subField = new Subfield( "e", "firma" );
    field.append( subField );
    subField = new Subfield( "2", "NAL" );
    field.append( subField );
    record.append( field );
    field = new Field( "910", "00" );
    subField = new Subfield( "a", "Kunstbiblioteket" );
    field.append( subField );
    subField = new Subfield( "e", "Gentofte Kommunebibliotek" );
    field.append( subField );
    subField = new Subfield( "z", "610" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lek",
        value: "Aalborg Portland firma"
    }, {
        name: "dkcclphrase.lek",
        value: "Kunstbiblioteket Gentofte Kommunebibliotek"
    } ];

    Assert.equalValue( "Create dkccl lek fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLekFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLemFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    field.append( "a", "42787388" );
    field.append( "b", "870970" );
    record.append( field );
    field = new Field( "600", "00" );
    field.append( "a", "Blixen" );
    field.append( "h", "Karen" );
    record.append( field );
    field = new Field( "652", "00" );
    field.append( "m", "72" );
    field.append( "a", "Blixen" );
    field.append( "h", "Karen" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "f", "dansk tegnekunst" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "f", "tegnekunst" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "f", "malerkunst" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "o", "billedv\u00E6rker" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "o", "udstillingskataloger" );
    record.append( field );
    field = new Field( "666", "00" );
    field.append( "o", "tegninger" );
    record.append( field );
    field = new Field( "900", "00" );
    field.append( "a", "Asmussen" );
    field.append( "h", "Marianne Wirenfeldt" );
    field.append( "z", "700/1" );
    record.append( field );
    field = new Field( "910", "00" );
    field.append( "a", "Blixen" );
    field.append( "h", "Karen" );
    field.append( "g", "Museet" );
    field.append( "z", "710/1" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lem",
        value: "Blixen Karen"
    }, {
        name: "dkcclphrase.lem",
        value: "Blixen Karen"
    }, {
        name: "dkcclphrase.lem",
        value: "dansk tegnekunst"
    }, {
        name: "dkcclphrase.lem",
        value: "tegnekunst"
    }, {
        name: "dkcclphrase.lem",
        value: "malerkunst"
    }, {
        name: "dkcclphrase.lem",
        value: "billedv\xe6rker"
    }, {
        name: "dkcclphrase.lem",
        value: "udstillingskataloger"
    }, {
        name: "dkcclphrase.lem",
        value: "tegninger"
    } ];

    Assert.equalValue( "Create dkccl lem fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLemFields, index, record, "dkcclphrase.lem" ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLepFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "600", "00" );
    var subField = new Subfield( "a", "Nikolaus" );
    field.append( subField );
    subField = new Subfield( "f", "helgen" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lep",
        value: "Nikolaus helgen"
    } ];

    Assert.equalValue( "Create dkccl lep fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLepFields, index, record ), indexOut );


} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLesFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "630", "00" );
    var subField = new Subfield( "s", "rockere" );
    field.append( subField );
    subField = new Subfield( "t", "ungdomsbander" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.les",
        value: "rockere"
    }, {
        name: "dkcclphrase.les",
        value: "ungdomsbander"
    } ];

    Assert.equalValue( "Create dkccl les fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLesFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLffFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subField = new Subfield( "a", "42787388" );
    field.append( subField );
    subField = new Subfield( "b", "870970" );
    field.append( subField );
    record.append( field );
    field = new Field( "100", "00" );
    subField = new Subfield( "a", "Blixen" );
    field.append( subField );
    subField = new Subfield( "h", "Karen" );
    field.append( subField );
    record.append( field );
    field = new Field( "700", "00" );
    subField = new Subfield( "a", "Wirenfeldt Asmussen" );
    field.append( subField );
    subField = new Subfield( "h", "Marianne" );
    field.append( subField );
    record.append( field );
    field = new Field( "700", "00" );
    subField = new Subfield( "a", "Stenkj\u00E6r" );
    field.append( subField );
    subField = new Subfield( "h", "Sofie" );
    field.append( subField );
    record.append( field );
    field = new Field( "710", "00" );
    subField = new Subfield( "a", "Karen Blixen Museet" );
    field.append( subField );
    record.append( field );
    field = new Field( "710", "00" );
    subField = new Subfield( "a", "Museet for Religi\u00f8s Kunst" );
    field.append( subField );
    record.append( field );
    field = new Field( "900", "00" );
    subField = new Subfield( "a", "Asmussen" );
    field.append( subField );
    subField = new Subfield( "h", "Marianne Wirenfeldt" );
    field.append( subField );
    subField = new Subfield( "z", "700/1" );
    field.append( subField );
    record.append( field );
    field = new Field( "910", "00" );
    subField = new Subfield( "a", "Blixen" );
    field.append( subField );
    subField = new Subfield( "h", "Karen" );
    field.append( subField );
    subField = new Subfield( "g", "Museet" );
    field.append( subField );
    subField = new Subfield( "z", "710/1" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lff",
        value: "Blixen Karen"
    }, {
        name: "dkcclphrase.lff",
        value: "Wirenfeldt Asmussen Marianne"
    }, {
        name: "dkcclphrase.lff",
        value: "Stenkj\xe6r Sofie"
    }, {
        name: "dkcclphrase.lff",
        value: "Karen Blixen Museet"
    }, {
        name: "dkcclphrase.lff",
        value: "Museet for Religi\xf8s Kunst"
    }, {
        name: "dkcclphrase.lff",
        value: "Asmussen Marianne Wirenfeldt"
    }, {
        name: "dkcclphrase.lff",
        value: "Blixen Karen Museet"
    } ];

    Assert.equalValue( "Create dkccl lff fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLffFields, index, record ) ), indexOut );

    index = Index.newIndex();
    record = new Record();
    field = new Field( "910", "00" );
    subField = new Subfield( "A", "lacour" );
    field.append( subField );
    subField = new Subfield( "a", "La Cour" );
    field.append( subField );
    subField = new Subfield( "h", "Poul" );
    field.append( subField );
    subField = new Subfield( "g", "Museet" );
    field.append( subField );
    subField = new Subfield( "z", "710/2" );
    field.append( subField );
    record.append( field );

    indexOut = [ {
        name: "dkcclphrase.lff",
        value: "lacour Poul Museet"
    }, {
        name: "dkcclphrase.lff",
        value: "La Cour Poul Museet"
    } ];

    Assert.equalValue( "Create dkccl lff fields with alternative spelling", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLffFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLfmFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    field.append( "o", "biografier" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lfm",
        value: "biografier"
    } ];

    Assert.equalValue( "Create dkccl lfm fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLfmFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLfoFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    field.append( "a", "42787388" );
    field.append( "b", "870970" );
    record.append( field );
    field = new Field( "100", "00" );
    field.append( "a", "Blixen" );
    field.append( "h", "Karen" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Wirenfeldt Asmussen" );
    field.append( "h", "Marianne" );
    record.append( field );
    field = new Field( "700", "00" );
    field.append( "a", "Stenkj\u00E6r" );
    field.append( "h", "Sofie" );
    record.append( field );
    field = new Field( "710", "00" );
    field.append( "a", "Karen Blixen Museet" );
    record.append( field );
    field = new Field( "710", "00" );
    field.append( "a", "Museet for Religi\u00f8s Kunst" );
    record.append( field );
    field = new Field( "900", "00" );
    field.append( "a", "Asmussen" );
    field.append( "h", "Marianne Wirenfeldt" );
    record.append( field );
    field = new Field( "910", "00" );
    field.append( "a", "Blixen" );
    field.append( "h", "Karen" );
    field.append( "g", "Museet" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lfo",
        value: "Blixen Karen"
    },{
        name: "dkcclphrase.mfo",
        value: "Blixen Karen #100"
    },
        {
        name: "dkcclphrase.lfo",
        value: "Wirenfeldt Asmussen Marianne"
    },{
            name: "dkcclphrase.mfo",
            value: "Wirenfeldt Asmussen Marianne #700"
        },

        {
        name: "dkcclphrase.lfo",
        value: "Stenkj\xe6r Sofie"
    },
        {
            name: "dkcclphrase.mfo",
            value: "Stenkj\xe6r Sofie #700"
        },
        {
        name: "dkcclphrase.lfo",
        value: "Karen Blixen Museet"
    }, {
            name: "dkcclphrase.mfo",
            value: "Karen Blixen Museet #710"
        },
        {
        name: "dkcclphrase.lfo",
        value: "Museet for Religi\xf8s Kunst"
    },
        {
            name: "dkcclphrase.mfo",
            value: "Museet for Religi\xf8s Kunst #710"
        },

        {
        name: "dkcclphrase.lfo",
        value: "Asmussen Marianne Wirenfeldt"
    },
        {
            name: "dkcclphrase.mfo",
            value: "Asmussen Marianne Wirenfeldt #900"
        },{
        name: "dkcclphrase.lfo",
        value: "Blixen Karen Museet"
        },
        {
            name: "dkcclphrase.mfo",
            value: "Blixen Karen Museet #910"
        }];

    Assert.equalValue( "Create dkccl lfo fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLfoFields, index, record ) ), indexOut );


    index = Index.newIndex();
    var inputString = "239 00 *tNapoleons march over Alperne\n";
    record = new Record();
    record.fromString( inputString );
    indexOut = [];
    Assert.equalValue( "Create no dkccl mfo and lfo fields", IndexNormalizer.normalizeValues ( DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLfoFields, index, record)), indexOut );


} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLgdFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "654", "00" );
    field.append( "m", "32.5" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lgd",
        value: "32.5"
    } ];

    Assert.equalValue( "Create dkccl lgd fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLgdFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLhtFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "240", "00" );
    var subField = new Subfield( "a", "Nibelungens ring" );
    field.append( subField );
    subField = new Subfield( "s", "Valkyrien" );
    field.append( subField );
    subField = new Subfield( "m", "Libretto" );
    field.append( subField );
    subField = new Subfield( "r", "Engelsk og tysk" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lht",
        value: "Nibelungens ring Valkyrien"
    } ];

    Assert.equalValue( "Create dkccl lht fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLhtFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLkeFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "634", "00" );
    var subField = new Subfield( "a", "Halvtredserne" );
    field.append( subField );
    subField = new Subfield( "b", "50'erne" );
    field.append( subField );
    subField = new Subfield( "a", "Tredserne" );
    field.append( subField );
    subField = new Subfield( "b", "60'erne" );
    field.append( subField );
    record.append( field );
    field = new Field( "634", "00" );
    subField = new Subfield( "a", "Norman period" );
    field.append( subField );
    subField = new Subfield( "c", "1066" );
    field.append( subField );
    subField = new Subfield( "d", "1154" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lke",
        value: "Halvtredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "Halvtredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "Halvtredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "50'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "50'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "50'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "Tredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "Tredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "Tredserne"
    }, {
        name: "dkcclphrase.lke",
        value: "60'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "60'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "60'erne"
    }, {
        name: "dkcclphrase.lke",
        value: "Norman period"
    }, {
        name: "dkcclphrase.lke",
        value: "Norman period"
    }, {
        name: "dkcclphrase.lke",
        value: "Norman period"
    }, {
        name: "dkcclphrase.lke",
        value: "1066 1154"
    }, {
        name: "dkcclphrase.lke",
        value: "1066 1154"
    }, {
        name: "dkcclphrase.lke",
        value: "1066 1154"
    } ];

    Assert.equalValue( "Create dkccl lke fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLkeFields, index, record ) ), indexOut );

} );


UnitTest.addFixture( "DkcclTermIndex.createDkcclLklFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    record.fromString( "088 00 *a82/89(520) *bSkønlitteratur, Japan\n" );

    var indexOut = [ {
        name: "dkcclterm.lkl",
        value: "82/89(520)"
    } ];

    Assert.equalValue( "Create dkcclterm fields (lkl) for field 088",
        DkcclTermIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLklFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    record.fromString( "088 00 *aXmbea *dnoder musikoptagelser violinkoncerter\n" +
        "088 00 *aX *b/-qa *dnoder musikoptagelser amerikanske musikværker\n" );

    indexOut = [ {
        name: "dkcclterm.lkl",
        value: "Xmbea"
    }, {
        name: "dkcclterm.lkl",
        value: "X"
    }
    ];


    Assert.equalValue( "Create dkcclterm fields (lkl) for several fields 088",
        DkcclTermIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLklFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    record.fromString( "089 00 *a338.45\n" );

    indexOut = [ {
        name: "dkcclterm.lkl",
        value: "338.45"
    }
    ];


    Assert.equalValue( "Create dkcclterm fields (lkl) for 089",
        DkcclTermIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLklFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    record.fromString( "087 00 *a338.45\n" );

    indexOut = [ {
        name: "dkcclterm.lkl",
        value: "338.45"
    }
    ];


    Assert.equalValue( "Create dkcclterm fields (lkl) for 087",
        DkcclTermIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLklFields, index, record ), indexOut );
});

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLknFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "033", "00" );
    var subField = new Subfield( "a", "355" );
    field.append( subField );
    subField = new Subfield( "b", "Holeby Kommune" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lkn",
        value: "355 Holeby Kommune"
    } ];

    Assert.equalValue( "Create dkccl lkn fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLknFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLkoFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "710", "00" );
    var subField = new Subfield( "a", "Nordisk Videnskabeligt Bibliotekarforbund" );
    field.append( subField );
    subField = new Subfield( "c", "Medlemsmoede" );
    field.append( subField );
    subField = new Subfield( "i", "3" );
    field.append( subField );
    subField = new Subfield( "k", "1970" );
    field.append( subField );
    subField = new Subfield( "j", "Umeaa" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lko",
        value: "Nordisk Videnskabeligt Bibliotekarforbund Medlemsmoede 3 1970 Umeaa"
    } ];

    Assert.equalValue( "Create dkccl lko fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLkoFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLmeFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    var subField = new Subfield( "m", "singer/songwriter" );
    field.append( subField );
    subField = new Subfield( "m", "folk" );
    field.append( subField );
    subField = new Subfield( "n", "vokal" );
    field.append( subField );
    subField = new Subfield( "n", "didgeridoo" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lme",
        value: "singer/songwriter"
    }, {
        name: "dkcclphrase.lme",
        value: "folk"
    }, {
        name: "dkcclphrase.lme",
        value: "vokal"
    }, {
        name: "dkcclphrase.lme",
        value: "didgeridoo"
    } ];

    Assert.equalValue( "Create dkccl lme fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLmeFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLmsFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "660", "00" );
    var subField = new Subfield( "a", "Diabetes" );
    field.append( subField );
    subField = new Subfield( "x", "Complications" );
    field.append( subField );
    subField = new Subfield( "z", "Minnesota" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lms",
        value: "Diabetes Complications Minnesota"
    } ];

    Assert.equalValue( "Create dkccl lms fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLmsFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLnbFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "666", "00" );
    var subField = new Subfield( "u", "for gymnasiet" );
    field.append( subField );
    subField = new Subfield( "u", "for hf" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lnb",
        value: "for gymnasiet"
    }, {
        name: "dkcclphrase.lnb",
        value: "for hf"
    } ];

    Assert.equalValue( "Create dkccl lnb fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLnbFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLntFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "210", "00" );
    var subField = new Subfield( "a", "Dan. kommuner" );
    field.append( subField );
    subField = new Subfield( "b", "Kbh., 1980" );
    field.append( subField );
    record.append( field );
    field = new Field( "222", "00" );
    subField = new Subfield( "a", "Danske kommuner" );
    field.append( subField );
    subField = new Subfield( "b", "Koebenhavn. 1980" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lnt",
        value: "Dan. kommuner Kbh., 1980"
    }, {
        name: "dkcclphrase.lnt",
        value: "Danske kommuner Koebenhavn. 1980"
    } ];

    Assert.equalValue( "Create dkccl lnt fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLntFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLokFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    field.append( "m", "34.66" );
    field.append( "b", "Arbejdsmiljoe" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lok",
        value: "34.66"
    } ];

    Assert.equalValue( "Create dkccl lok fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLokFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLpaFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "245", "00" );
    var subField = new Subfield( "a", "Meteorologisk aarbog" );
    field.append( subField );
    subField = new Subfield( "n", "2. del" );
    field.append( subField );
    subField = new Subfield( "o", "Groenland" );
    field.append( subField );
    subField = new Subfield( "p", "Meteorological yearbook" );
    field.append( subField );
    subField = new Subfield( "q", "Part 2" );
    field.append( subField );
    subField = new Subfield( "r", "Greenland" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lpa",
        value: "Meteorological yearbook Part 2 Greenland"
    } ];

    Assert.equalValue( "Create dkccl lpa fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLpaFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLpeFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "700", "00" );
    var subField = new Subfield( "a", "Hansen" );
    field.append( subField );
    subField = new Subfield( "h", "Ole" );
    field.append( subField );
    subField = new Subfield( "c", "1900-01-19" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lpe",
        value: "Hansen Ole 1900-01-19"
    } ];

    Assert.equalValue( "Create dkccl lpe fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLpeFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLpoFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "239", "00" );
    var subField = new Subfield( "a", "Mozart" );
    field.append( subField );
    subField = new Subfield( "h", "Wolfgang Amadeus" );
    field.append( subField );
    subField = new Subfield( "t", "Don Juan" );
    field.append( subField );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lpo",
        value: "Mozart Wolfgang Amadeus"
    } ];

    Assert.equalValue( "Create dkccl lpo fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLpoFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLrtFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "863", "00" );
    field.append( "t", "Samklang" );
    field.append( "c", "klinger" );
    record.append( field );
    field = new Field( "870", "00" );
    field.append( "t", "Museum Tusculanum" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lrt",
        value: "Samklang klinger"
    }, {
        name: "dkcclphrase.lrt",
        value: "Museum Tusculanum"
    } ];

    Assert.equalValue( "Create dkccl lrt fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLrtFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLseFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "440", "00" );
    field.append( "a", "Words" );
    field.append( "c", "their origin, use and spelling" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lse",
        value: "Words their origin, use and spelling"
    } ];

    Assert.equalValue( "Create dkccl lse fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLseFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLsoFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "440", "00" );
    field.append( "a", "Words" );
    field.append( "c", "their origin, use and spelling" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lso",
        value: "Words their origin, use and spelling"
    } ];

    Assert.equalValue( "Create dkccl lso fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLsoFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLstFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "861", "00" );
    field.append( "i", "Fortsaettes delvis som" );
    field.append( "t", "Clinical psychology" );
    field.append( "c", "Oxford" );
    field.append( "z", "0144-5979" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lst",
        value: "Clinical psychology Oxford"
    } ];

    Assert.equalValue( "Create dkccl lst fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLstFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLtiFields", function() {


    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "241", "00" );
    var subField = new Subfield( "a", "De \u00a4ensamma" );
    field.append( subField );
    record.append( field );
    field = new Field( "245", "00" );
    subField = new Subfield( "a", "De \u00a4ensomme" );
    field.append( subField );
    record.append( field );
    field = new Field( "440", "00" );
    subField = new Subfield( "a", "[Barbarotti-serien]" );
    field.append( subField );
    subField = new Subfield( "v", "[4. bind]" );
    field.append( subField );
    record.append( field );
    field = new Field( "945", "00" );
    subField = new Subfield( "a", "Barbarottiserien" );
    field.append( subField );
    subField = new Subfield( "x", "se" );
    field.append( subField );
    subField = new Subfield( "w", "[Barbarotti-serien]" );
    field.append( subField );
    subField = new Subfield( "z", "440(a)" );
    field.append( subField );
    record.append( field );

    var indexOut = [
        {
            name: "dkcclphrase.lti",
            value: "De ensamma"
        },
        {
            name: "dkcclphrase.lti",
            value: "ensamma"
        },
        {
            name: "dkcclphrase.mti",
            value: "De ensamma #241"
        }, {
            name: "dkcclphrase.mti",
            value: "ensamma #241"
        },
        {
            name: "dkcclphrase.lti",
            value: "De ensomme"
        }, {
            name: "dkcclphrase.lti",
            value: "ensomme"
        },
        {
            name: "dkcclphrase.mti",
            value: "De ensomme #245"
        }, {
            name: "dkcclphrase.mti",
            value: "ensomme #245"
        }, {
            name: "dkcclphrase.lti",
            value: "Barbarotti-serien"
        },
        {
            name: "dkcclphrase.mti",
            value: "Barbarotti-serien #440"
        },
        {
            name: "dkcclphrase.lti",
            value: "Barbarottiserien"
        }, {
            name: "dkcclphrase.mti",
            value: "Barbarottiserien #945"
        } ];

    Assert.equalValue( "Create dkccl lti fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ) ), indexOut );

    index = Index.newIndex();
    record = new Record();
    field = new Field( "795", "00" );
    subField = new Subfield( "a", "The best of Beethoven" );
    field.append( subField );
    record.append( field );
    field = new Field( "795", "00" );
    subField = new Subfield( "a", "Moderen" );
    field.append( subField );
    subField = new Subfield( "7", "(" );
    field.append( subField );
    subField = new Subfield( "v", "Taagen letter" );
    field.append( subField );
    subField = new Subfield( "7", ")" );
    field.append( subField );
    record.append( field );
    field = new Field( "795", "00" );
    subField = new Subfield( "a", "Offerte, H 514" );
    field.append( subField );
    record.append( field );
    field = new Field( "795", "00" );
    subField = new Subfield( "a", "Pour un reposoir H 523" );
    field.append( subField );
    subField = new Subfield( "u", "Ouverture des que la procession parait" );
    field.append( subField );
    record.append( field );
    field = new Field( "795", "00" );
    subField = new Subfield( "A", "Delfelt A" );
    field.append( subField );
    subField = new Subfield( "a", "delfelt a" );
    field.append( subField );
    subField = new Subfield( "c", "delfelt c" );
    field.append( subField );
    subField = new Subfield( "a", "delfelt a" );
    field.append( subField );
    record.append( field );

    indexOut = [ {
        name: "dkcclphrase.lti",
        value: "The best of Beethoven"
    }, {
        name: "dkcclphrase.lti", // comes from extra (removing prefix)
        value: "best of Beethoven"
    },
        {
            name: "dkcclphrase.mti",
            value: "The best of Beethoven #795"
        }, {
            name: "dkcclphrase.mti", // comes from extra (removing prefix)
            value: "best of Beethoven #795"
        },
        {
            name: "dkcclphrase.lti",
            value: "Moderen Taagen letter"
        },
        {
            name: "dkcclphrase.mti",
            value: "Moderen Taagen letter #795"
        },
        {
            name: "dkcclphrase.lti",  // comes from second round uv
            value: "Taagen letter"
        },
        {
            name: "dkcclphrase.mti",  // comes from second round uv
            value: "Taagen letter #795"
        },
        {
            name: "dkcclphrase.lti",
            value: "Offerte, H 514"
        },
        {
            name: "dkcclphrase.mti",
            value: "Offerte, H 514 #795"
        }, {
            name: "dkcclphrase.lti",
            value: "Pour un reposoir H 523 Ouverture des que la procession parait"
        },
        {
            name: "dkcclphrase.mti",
            value: "Pour un reposoir H 523 Ouverture des que la procession parait #795"
        },
        {
            name: "dkcclphrase.lti",  // comes from second rount uv
            value: "Ouverture des que la procession parait"
        },

        {
            name: "dkcclphrase.mti",  // comes from second rount uv
            value: "Ouverture des que la procession parait #795"
        },
        {
            name: "dkcclphrase.lti",
            value: "delfelt a delfelt c"
        },
        {
            name: "dkcclphrase.mti",
            value: "delfelt a delfelt c #795"
        },
        {
            name: "dkcclphrase.lti",
            value: "Delfelt A delfelt c"
        },
        {
            name: "dkcclphrase.mti",
            value: "Delfelt A delfelt c #795"
        },
        {
            name: "dkcclphrase.lti",
            value: "delfelt a"
        },
        {
            name: "dkcclphrase.mti",
            value: "delfelt a #795"
        } ];


    Assert.equalValue( "Create dkccl lti fields from 795 field", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    field = new Field( "795", "00" );
    field.append( "\u00e5", "16" );
    field.append( "A", "March Nr 6 Kong Christian" );
    field.append( "a", "March Nr VI Kong Christian" );
    record.append( field );

    indexOut = [ {
        name: "dkcclphrase.lti",
        value: "March Nr VI Kong Christian"
    },
        {
            name: "dkcclphrase.mti",
            value: "March Nr VI Kong Christian #795"
        }, {
            name: "dkcclphrase.lti",
            value: "March Nr 6 Kong Christian"
        },
        {
            name: "dkcclphrase.mti",
            value: "March Nr 6 Kong Christian #795"
        } ];

    Assert.equalValue( "Create dkccl lti and mti fields from 795 field only subfield A and a", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    var inputString = "239 *aSonatine for fløjte og klaver, opus 5\n";
    record.fromString( inputString );
    indexOut = [];
    Assert.equalValue("Do not create dkccl lti and mti fields if no matching subfields in record", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );


    index = Index.newIndex();
    record = new Record();
    inputString = "241 *aDet\n";
    record.fromString( inputString );
    indexOut = [{
        name: "dkcclphrase.lti",
        value: "Det"
    },
        {
            name: "dkcclphrase.mti",
            value: "Det #241"
        }
    ];

    Assert.equalValue(" Create dkccl lti and mti fields for 241 with replacement resulting in empty string", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    inputString = "245 *aUdkast til haandbog for haerens motorfoerere\n" +
        "440 *aLA\n";
    record.fromString( inputString );

    indexOut = [{
        name: "dkcclphrase.lti",
        value: "Udkast til haandbog for haerens motorfoerere"
    },
        {
            name: "dkcclphrase.mti",
            value: "Udkast til haandbog for haerens motorfoerere #245"
        },{
            name: "dkcclphrase.lti",
            value: "LA"
        },
        {
            name: "dkcclphrase.mti",
            value: "LA #440"
        }
    ];

    Assert.equalValue(" Create dkccl lti and mti fields for 440 with replacement resulting in empty string", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    inputString = "245 *aNoir Tango\n"+
            "440 *a[\n";

    record.fromString( inputString );
    indexOut =  [
        {
            name: "dkcclphrase.lti",
            value: "Noir Tango"
        },{
            name:"dkcclphrase.mti",
            value: "Noir Tango #245"
        }, {
            name: "dkcclphrase.lti",
            value: "["
        },{
            name:"dkcclphrase.mti",
            value: "[ #440"
        }
    ];
    //[ is filtered by solr
    Assert.equalValue(" Create dkccl lti and mti fields for 245 and 440", DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLtiFields, index, record ), indexOut );
} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLtsFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "300", "00" );
    field.append( "n", "1 filmstrimmel" );
    field.append( "e", "Viewmaster" );
    field.append( "a", "7 dobbeltbilleder" );
    field.append( "b", "farve" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lts",
        value: "Viewmaster"
    } ];

    Assert.equalValue( "Create dkccl lts fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLtsFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLttFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "860", "00" );
    field.append( "i", "Delvis fortsaettelse af" );
    field.append( "t", "Lovtidende for kongeriget Danmark" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.ltt",
        value: "Lovtidende for kongeriget Danmark"
    } ];

    Assert.equalValue( "Create dkccl ltt fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLttFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLukFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "631", "00" );
    field.append( "f", "kultursammenstoed" );
    field.append( "f", "indianermyter" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.luk",
        value: "kultursammenstoed"
    }, {
        name: "dkcclphrase.luk",
        value: "indianermyter"
    } ];

    Assert.equalValue( "Create dkccl luk fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLukFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLutFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "240", "00" );
    field.append( "a", "Gang Busters" );
    field.append( "j", "Radio program" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lut",
        value: "Gang Busters"
    } ];

    Assert.equalValue( "Create dkccl lut fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLutFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLvpFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "557", "00" );
    field.append( "a", "Meddelelser om forskning i arbejderbevaegelsens historie" );
    field.append( "v", "13 (1979:okt.)" );
    field.append( "k", "S. 5-35" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lvp",
        value: "Meddelelser om forskning i arbejderbevaegelsens historie 13 (1979:okt.)"
    } ];

    Assert.equalValue( "Create dkccl lvp fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLvpFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLvxFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "557", "00" );
    field.append( "a", "Meddelelser om forskning i arbejderbevaegelsens historie" );
    field.append( "v", "13 (1979:okt.)" );
    field.append( "k", "S. 5-35" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.lvx",
        value: "Meddelelser om forskning i arbejderbevaegelsens historie"
    } ];

    Assert.equalValue( "Create dkccl lvx fields", IndexNormalizer.normalizeValues( DkcclPhraseIndex.callIndexMethod(
        DkcclPhraseIndex.createDkcclLvxFields, index, record ) ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclNalFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "070", "00" );
    field.append( "a", "105.2" );
    field.append( "b", "W122" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.nal",
        value: "105.2"
    } ];

    Assert.equalValue( "Create dkccl nal fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclNalFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclNlmFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "060", "00" );
    field.append( "a", "W1" );
    field.append( "b", "Be 357 Bd. 1 1973" );
    field.append( "a", "WW 166 M43K 1973" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.nlm",
        value: "W1 WW 166 M43K 1973"
    } ];

    Assert.equalValue( "Create dkccl nlm fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclNlmFields, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclPhraseIndex.createDkcclUdkFields", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "080", "00" );
    field.append( "a", "4" );
    field.append( "2", "Spanish Ed." );
    record.append( field );
    field = new Field( "080", "00" );
    field.append( "a", "316" );
    field.append( "2", "Spanish Ed." );
    record.append( field );

    var indexOut = [ {
        name: "dkcclphrase.udk",
        value: "4"
    }, {
        name: "dkcclphrase.udk",
        value: "316"
    } ];

    Assert.equalValue( "Create dkccl udk fields", DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclUdkFields, index, record ), indexOut );

} );


UnitTest.addFixture( "DkcclPhraseIndex.createDkcclLmoFields", function() {
    var index = Index.newIndex();
    var record = new Record();
    record.fromString( "039 00 *abef\n" );

    var expectedIndex = [ {
        'name': "dkcclphrase.lmo",
        'value': "Rock"
    } ];

    Assert.equalValue( "Create dkccl lmo fields for rockmusik",
        DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLmoFields, index, record ), expectedIndex );

    index = Index.newIndex();
    record = new Record();
    expectedIndex = [];
    Assert.equalValue( "Create no dkccl lmo fields for empty record",
        DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLmoFields, index, record ), expectedIndex );


    index = Index.newIndex();
    record = new Record();
    record.fromString( "039 00 *anovalidcode\n" );
    expectedIndex = [];
    Assert.equalValue( "Create no dkccl lmo fields for unknown code",
        DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLmoFields, index, record ), expectedIndex );


} );


UnitTest.addFixture( "DkcclPhraseIndex.pushExtraIndexFields", function() {

    var indexOut = [ {
        name: "dkcclphrase.lti",
        value: "the elder scrolls"
    }, {
        name: "dkcclphrase.lti",
        value: "elder scrolls"
    } ];

    Assert.equalValue( "Create extra index fields from stop words",
        DkcclPhraseIndex.pushExtraIndexFields( Index.newIndex(), "dkcclphrase.lti", "the elder scrolls" ), indexOut );

    indexOut = [ {
        name: "dkcclphrase.lti",
        value: "the \u00a4elder scrolls"
    }, {
        name: "dkcclphrase.lti",
        value: "elder scrolls"
    } ];

    Assert.equalValue( "Create extra index fields from currency sign",
        DkcclPhraseIndex.pushExtraIndexFields( Index.newIndex(), "dkcclphrase.lti", "the \u00a4elder scrolls" ), indexOut );

    indexOut = [ {
        name: "dkcclphrase.mti",
        value: "Broederna Lejonhjaerta #241"
    } ];

    Assert.equalValue( "Create extra index mti for field 241",
        DkcclPhraseIndex.pushExtraIndexFields( Index.newIndex(), "dkcclphrase.mti", "Broederna Lejonhjaerta", "241" ), indexOut );



    Assert.equalValue( "Create no extra index for mti missing original field name",
        DkcclPhraseIndex.pushExtraIndexFields( Index.newIndex(), "dkcclphrase.mti", "Broederna Lejonhjaerta" ), [ ] );
} );

UnitTest.addFixture( "DkcclPhraseIndex.pushTitleIndexFields", function() {

    var indexOut = [ {
        name: "dkcclphrase.lti",
        value: "Broederna Lejonhjaerta"
    },{
        name: "dkcclphrase.mti",
        value: "Broederna Lejonhjaerta #241"
    } ];

    Assert.equalValue( "Create title indexes for field 241",
        DkcclPhraseIndex.pushTitleIndexFields( Index.newIndex(), "Broederna Lejonhjaerta", "241" ), indexOut );

    indexOut = [ {
        name: "dkcclphrase.lti",
        value: "Broederna Lejonhjaerta"
    } ];

    Assert.equalValue(" Add title index with original fieldName missing",
        DkcclPhraseIndex.pushTitleIndexFields( Index.newIndex(), "Broederna Lejonhjaerta" ), indexOut );


    Assert.equalValue( "Create no title indices if given value is empty",
        DkcclPhraseIndex.pushTitleIndexFields( Index.newIndex(), " " ), [ ] );
} );


UnitTest.addFixture( "DkcclPhraseIndex.pushCreatorIndexFields", function(){

    var indexOut = [ {
        name: "dkcclphrase.lfo",
        value: "Karen Blixen"
    }, {
        name: "dkcclphrase.mfo",
        value: "Karen Blixen #100"
    } ];

    Assert.equalValue( "Add creator index fields from field 100",
        DkcclPhraseIndex.pushCreatorIndexFields( Index.newIndex(), "Karen Blixen", "100" ), indexOut );


    Assert.equalValue( "Add no creator index from field 239 for empty value",
        DkcclPhraseIndex.pushCreatorIndexFields( Index.newIndex(), " ", "100" ), [ ] );

    Assert.equalValue( "Add no creator index from field 540 for undefined value",
        DkcclPhraseIndex.pushCreatorIndexFields( Index.newIndex( ), undefined, "540" ), [ ] );

} );



