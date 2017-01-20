use( "DkcclTermIndex" );
use( "UnitTest" );
use( "Index" );
use( "Marc" );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsAj", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    field.append( "c", "20110502180936" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.aj",
        value: "20110502180936"
    } ];

    Assert.equalValue( "Create dkcclterm fields (aj)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAj, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsAar", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "008", "00" );
    field.append( "a", "2011" );
    record.append( field );
    field = new Field( "260", "00" );
    field.append( "c", "2011" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "2011"
    }, {
        name: "dkcclterm.\xE5r",
        value: "2011"
    } ];

    Assert.equalValue( "Create dkcclterm fields (aar)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    var inputString = "260 00 *c1987(jan)\n";

    record.fromString( inputString );

    indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "1987"
    }
    ];

    Assert.equalValue( "Create dkcclterm field aar with filtering 1",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );


    index = Index.newIndex();
    record = new Record();
    inputString = "008 00 *a1984\n" +
        "260 00 *cKuratorium für Technik und Bauwesen in der Landwirtschaft\n";

    record.fromString( inputString );

    indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "1984"
    }
    ];


    Assert.equalValue( "Create dkcclterm field aar with filtering 2",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    inputString = "260 00 *cIn the yere of oure lorde god. M.CCCCC.and .ix. 1509 the. xij. daye of the moneth of Iuyn\n";
    record.fromString( inputString );
    indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "1509"
    }
    ];


    Assert.equalValue( "Create dkcclterm field aar with filtering 2",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );


    index = Index.newIndex();
    record = new Record();
    inputString = "008 00 *a1947\n" +
        "260 00 *cc1948\n";

    record.fromString( inputString );
    indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "1947"
    },
        {
            name: "dkcclterm.\xE5r",
            value: "1948"
        }
    ];


    Assert.equalValue( "Create dkcclterm field aar with filtering 3",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    inputString = "008 00 *a1940\n" +
        "260 00 *c1940\n" +
        "260 00 *c1940-1941\n";

    record.fromString( inputString );
    indexOut = [ {
        name: "dkcclterm.\xE5r",
        value: "1940"
    },
        {
            name: "dkcclterm.\xE5r",
            value: "1940"
        },
        {
            name: "dkcclterm.\xE5r",
            value: "1940-1941"
        }
    ];


    Assert.equalValue( "Create dkcclterm field aar with filtering 4",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAar, index, record ), indexOut );



} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsAg", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    field.append( "c", "20110502180936" );
    record.append( field );
    field = new Field( "008", "00" );
    field.append( "a", "2011" );
    record.append( field );
    field = new Field( "260", "00" );
    field.append( "c", "2011" );
    record.append( field );
    field = new Field( "610", "00" );
    field.append( "a", "Maersk Line" );
    field.append( "2", "NAL" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ag",
        value: "Maersk Line"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ag)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsAg, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsBc", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "023", "00" );
    field.append( "b", "5051159324214" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.bc",
        value: "5051159324214"
    } ];

    Assert.equalValue( "Create dkcclterm fields (bc)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsBc, index, record ), indexOut );
} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsBs", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "038", "00" );
    field.append( "a", "te" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.bs",
        value: "te"
    } ];

    Assert.equalValue( "Create dkcclterm fields (bs)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsBs, index, record ), indexOut );

} );


UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsCl", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.cl",
        value: "65.908"
    }, {
        name: "dkcclterm.cl",
        value: "62.8"
    } ];

    Assert.equalValue( "Create dkcclterm fields (cl)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsCl, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsDb", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "historie" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "rederier" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "shipping" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "1900-1999" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "2000-2009" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.db",
        value: "soefart"
    }, {
        name: "dkcclterm.db",
        value: "soefart"
    }, {
        name: "dkcclterm.db",
        value: "historie"
    }, {
        name: "dkcclterm.db",
        value: "rederier"
    }, {
        name: "dkcclterm.db",
        value: "shipping"
    }, {
        name: "dkcclterm.db",
        value: "1900-1999"
    }, {
        name: "dkcclterm.db",
        value: "2000-2009"
    } ];

    Assert.equalValue( "Create dkcclterm fields (db)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsDb, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsDf", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "historie" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "rederier" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "shipping" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "1900-1999" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "2000-2009" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.df",
        value: "soefart"
    }, {
        name: "dkcclterm.df",
        value: "soefart"
    }, {
        name: "dkcclterm.df",
        value: "historie"
    }, {
        name: "dkcclterm.df",
        value: "rederier"
    }, {
        name: "dkcclterm.df",
        value: "shipping"
    } ];

    Assert.equalValue( "Create dkcclterm fields (df)", DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsDf, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsDk", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.dk",
        value: "65.908"
    }, {
        name: "dkcclterm.dk",
        value: "62.8"
    } ];

    Assert.equalValue( "Create dkcclterm fields (dk)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsDk, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsEf", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "630", "00" );
    var subfield = new Subfield( "f", "ansvar" );
    field.append( subfield );
    record.append( field );
    field = new Field( "667", "00" );
    subfield = new Subfield( "f", "erstatningsret" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ef",
        value: "ansvar"
    }, {
        name: "dkcclterm.ef",
        value: "erstatningsret"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ef)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsEf, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsEk", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "610", "00" );
    var subfield = new Subfield( "a", "Maersk Line" );
    field.append( subfield );
    subfield = new Subfield( "c", "910 test" );
    field.append( subfield );
    record.append( field );
    field = new Field( "910", "00" );
    subfield = new Subfield( "z", "610" );
    field.append( subfield );
    record.append( field );
    field = new Field( "996", "00" );
    subfield = new Subfield( "a", "DBC" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ek",
        value: "Maersk Line"
    }, {
        name: "dkcclterm.ek",
        value: "910 test"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ek (910 to 610))",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsEk, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsEj", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "996", "00" );
    field.append( "a", "DBC" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ej",
        value: "DBC"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ej)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsEj, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsFb", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "100", "00" );
    field.append( "a", "Peter" );
    field.append( "h", "Bruce" );
    field.append( "4", "aut" );
    record.append( field );
    field = new Field( "260", "00" );
    field.append( "a", "Frederiksvaerk" );
    field.append( "b", "Nautilus" );
    record.append( field );
    field = new Field( "720", "00" );
    field.append( "o", "Thomas Noergaard Olesen" );
    field.append( "4", "trl" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.fb",
        value: "Thomas Noergaard Olesen"
    }, {
        name: "dkcclterm.fb",
        value: "trl"
    } ];

    Assert.equalValue( "Create dkcclterm fields (fb)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsFb, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsFl", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "260", "00" );
    field.append( "a", "Frederiksvaerk" );
    field.append( "b", "Nautilus" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.fl",
        value: "Nautilus"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (fl)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsFl, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsFo", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "100", "00" );
    field.append( "a", "Peter" );
    field.append( "h", "Bruce" );
    field.append( "4", "aut" );
    record.append( field );
    field = new Field( "260", "00" );
    field.append( "a", "Frederiksvaerk" );
    field.append( "b", "Nautilus" );
    record.append( field );
    field = new Field( "720", "00" );
    field.append( "o", "Thomas Noergaard Olesen" );
    field.append( "4", "trl" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.fo",
        value: "Peter Bruce aut"
    } ];

    Assert.equalValue( "Create dkcclterm fields (fo)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsFo, index, record, "dkcclterm.fo" ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsGd", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "100", "00" );
    field.append( "a", "Peter" );
    field.append( "h", "Bruce" );
    field.append( "4", "aut" );
    record.append( field );

    var indexOut = [];

    Assert.equalValue( "Create dkcclterm fields (gd)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsGd, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsHm", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "009", "00" );
    var subfield = new Subfield( "g", "xx" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.hm",
        value: "xx"
    } ];

    Assert.equalValue( "Create dkcclterm fields (hm)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsHm, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    var inputString = "009 *ar *gxh\n";
    record.fromString( inputString );

    indexOut = [
        {
            name: "dkcclterm.hm",
            value: "xh"
        }, {
            name: "dkcclterm.hm",
            value: "ly"
        } ];

    Assert.equalValue( "Create dkcclterm field (hm) with 009 a and g",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsHm, index, record ), indexOut );


} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsHt", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "245", "00" );
    var subfield = new Subfield( "a", "Dansk linjefart - fra Selandia til Emma Maersk" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ht",
        value: "Dansk linjefart - fra Selandia til Emma Maersk"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ht)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsHt, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    field = new Field( "243", "00" );
    subfield = new Subfield( "a", "Works" );
    field.append( subfield );
    record.append( field );

    indexOut = [ {
        name: "dkcclterm.ht",
        value: "Works"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ht) from 243",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsHt, index, record ), indexOut );


} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsIb", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "021", "00" );
    var subfield = new Subfield( "e", "9788790924102" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ib",
        value: "9788790924102"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ib)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsIb, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsId", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "a", "29036640" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.id",
        value: "29036640"
    } ];

    Assert.equalValue( "Create dkcclterm fields (id)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsId, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsIs", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "021", "00" );
    var subfield = new Subfield( "e", "9788790924102" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.is",
        value: "9788790924102"
    } ];

    Assert.equalValue( "Create dkcclterm fields (is)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsIs, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsKa", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "990", "00" );
    var subfield = new Subfield( "b", "l" );
    field.append( subfield );
    subfield = new Subfield( "b", "v" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ka",
        value: "l"
    }, {
        name: "dkcclterm.ka",
        value: "v"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ka)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsKa, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsKe", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "a", "29036640" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "historie" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "rederier" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "shipping" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "1900-1999" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "2000-2009" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ke",
        value: "soefart"
    }, {
        name: "dkcclterm.ke",
        value: "soefart"
    }, {
        name: "dkcclterm.ke",
        value: "historie"
    }, {
        name: "dkcclterm.ke",
        value: "rederier"
    }, {
        name: "dkcclterm.ke",
        value: "shipping"
    }, {
        name: "dkcclterm.ke",
        value: "1900-1999"
    }, {
        name: "dkcclterm.ke",
        value: "2000-2009"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (ke)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsKe, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsKk", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "032", "00" );
    var subfield = new Subfield( "a", "DBF201150" );
    field.append( subfield );
    subfield = new Subfield( "x", "BKM201150" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.kk",
        value: "DBF201150"
    }, {
        name: "dkcclterm.kk",
        value: "BKM201150"
    } ];

    Assert.equalValue( "Create dkcclterm fields (kk)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsKk, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsLn", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "b", "870970" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ln",
        value: "870970"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ln)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsLn, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsMa", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "008", "00" );
    var subfield = new Subfield( "t", "m" );
    field.append( subfield );
    record.append( field );
    field = new Field( "009", "00" );
    subfield = new Subfield( "a", "a" );
    field.append( subfield );
    subfield = new Subfield( "g", "xx" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ma",
        value: "mo"
    }, {
        name: "dkcclterm.ma",
        value: "b\xe5"
    }, {
        name: "dkcclterm.ma",
        value: "te"
    }, {
        name: "dkcclterm.ma",
        value: "xx"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (ma)",
        DkcclTermIndex.createDkcclFieldsMa( index, record ), indexOut );

    // actual record: 870970:50523861
    index = Index.newIndex();
    record = new Record();
    field = new Field( "008", "00" );
    subfield = new Subfield( "t", "m" );
    field.append( subfield );
    record.append( field );
    field = new Field( "009", "00" );
    subfield = new Subfield( "a", "a" );
    field.append( subfield );
    subfield = new Subfield( "b", "c" );
    field.append( subfield );
    subfield = new Subfield( "g", "xx" );
    field.append( subfield );
    subfield = new Subfield( "a", "s" );
    field.append( subfield );
    subfield = new Subfield( "g", "xc" );
    field.append( subfield );
    subfield = new Subfield( "a", "v" );
    field.append( subfield );

    record.append( field );
    indexOut = [ {
        name: "dkcclterm.ma",
        value: "mo"
    }, {
        name: "dkcclterm.ma",
        value: "b\xe5"
    }, {
        name: "dkcclterm.ma",
        value: "te"
    }, {
        name: "dkcclterm.ma",
        value: "mu"
    }, {
        name: "dkcclterm.ma",
        value: "lm"
    }, {
        name: "dkcclterm.ma",
        value: "sc"
    }, {
        name: "dkcclterm.ma",
        value: "sm"
    }, {
        name: "dkcclterm.ma",
        value: "xx"
    }, {
        name: "dkcclterm.ma",
        value: "xc"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (ma) 1 book + 2 cd's with music ",
        DkcclTermIndex.createDkcclFieldsMa( index, record ), indexOut );

    index = Index.newIndex();
    var inputString = "008 *tm *dx *jf *nb *w1\n" +
        "009 *aa *gxe\n";

    record = new Record();
    record.fromString( inputString );
    indexOut = [ {
        name: "dkcclterm.ma",
        value: "mo"
    }, {
        name: "dkcclterm.ma",
        value: "ro"
    }, {
        name: "dkcclterm.ma",
        value: "od"
    }, {
        name: "dkcclterm.ma",
        value: "te"
    }, {
        name: "dkcclterm.ma",
        value: "xe"
    }, {
        name: "dkcclterm.ma",
        value: "eb"
    }
    ];

    Assert.equalValue( "Create dkcclterm field (ma) ebook", DkcclTermIndex.createDkcclFieldsMa( index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    inputString = "009 *aa *gxe\n" +
        "032 *xBKM201224\n" +
        "512 *aDownloades i EPUB-format\n";

    record.fromString( inputString );
    indexOut = [ {
        name: "dkcclterm.ma",
        value: "te"
    }, {
        name: "dkcclterm.ma",
        value: "xe"
    }, {
        name: "dkcclterm.ma",
        value: "eb"
    } ];
    Assert.equalValue( "Create dkcclterm field (ma) ebook without 008w1 marking", DkcclTermIndex.createDkcclFieldsMa( index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsNo", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "530", "00" );
    var subfield = new Subfield( "a", "Indhold: Skibsdieselmotorens tidlige udvikling ; Udviklingen af dansk linjefart og Selandias betydning ; " +
        "Grundlaeggelsen af Dampskibsselskabet af 1912 ; Foerste Verdenskrig og tiden efter ; A.P. Moeller gaar ind i linjefarten ; " +
        "Efter boerskrakket i 1929 ; Anden Verdenskrig ; Linjenettet genetableres ; Containeriseringen og oeK ; oeK's svanesang ; Containeriseringen af Maersk Line ; " +
        "Post-panamax skibe og globalisering ; Vaekst gennem opkoeb ; De lyseblaa giganter ; Maersk Line nu og i fremtiden" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.no",
        value: "Indhold: Skibsdieselmotorens tidlige udvikling ; Udviklingen af dansk linjefart og Selandias betydning ; " +
        "Grundlaeggelsen af Dampskibsselskabet af 1912 ; Foerste Verdenskrig og tiden efter ; A.P. Moeller gaar ind i linjefarten ; " +
        "Efter boerskrakket i 1929 ; Anden Verdenskrig ; Linjenettet genetableres ; Containeriseringen og oeK ; oeK's svanesang ; Containeriseringen af Maersk Line ; " +
        "Post-panamax skibe og globalisering ; Vaekst gennem opkoeb ; De lyseblaa giganter ; Maersk Line nu og i fremtiden"
    } ];

    Assert.equalValue( "Create dkcclterm fields (no)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsNo, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsNr", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "a", "29036640" );
    field.append( subfield );
    record.append( field );
    field = new Field( "021", "00" );
    subfield = new Subfield( "e", "9788790924102" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.nr",
        value: "29036640"
    }, {
        name: "dkcclterm.nr",
        value: "9788790924102"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (nr)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsNr, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsOk", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "652", "00" );
    var subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ok",
        value: "65.908"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ok)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsOk, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsOp", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "d", "20111027" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.op",
        value: "20111027"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (op)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsOp, index, record ), indexOut );

} );


UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsPe", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "100", "00" );
    var subfield = new Subfield( "a", "Peter" );
    field.append( subfield );
    subfield = new Subfield( "h", "Bruce" );
    field.append( subfield );
    subfield = new Subfield( "4", "aut" );
    field.append( subfield );
    record.append( field );
    field = new Field( "700", "00" );
    subfield = new Subfield( "a", "Thomas" );
    field.append( subfield );
    subfield = new Subfield( "h", "Olsen" );
    field.append( subfield );
    subfield = new Subfield( "4", "trl" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.pe",
        value: "Peter"
    }, {
        name: "dkcclterm.pe",
        value: "Bruce"
    }, {
        name: "dkcclterm.pe",
        value: "aut"
    }, {
        name: "dkcclterm.pe",
        value: "Thomas"
    }, {
        name: "dkcclterm.pe",
        value: "Olsen"
    }, {
        name: "dkcclterm.pe",
        value: "trl"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (pe)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsPe, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsPo", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "100", "00" );
    var subfield = new Subfield( "a", "Peter" );
    field.append( subfield );
    subfield = new Subfield( "h", "Bruce" );
    field.append( subfield );
    subfield = new Subfield( "4", "aut" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.po",
        value: "Peter"
    }, {
        name: "dkcclterm.po",
        value: "Bruce"
    }, {
        name: "dkcclterm.po",
        value: "aut"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (po)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsPo, index, record, "dkcclterm.po" ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsPu", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "260", "00" );
    var subfield = new Subfield( "a", "Frederiksvaerk" );
    field.append( subfield );
    subfield = new Subfield( "b", "Nautilus" );
    field.append( subfield );
    subfield = new Subfield( "c", "2011" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.pu",
        value: "Frederiksvaerk"
    } ];

    Assert.equalValue( "Create dkcclterm fields (pu)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsPu, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsRt", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "009", "00" );
    var subfield = new Subfield( "g", "xx" );
    field.append( subfield );
    record.append( field );

    var indexOut = [];

    Assert.equalValue( "Create dkcclterm fields (rt)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsRt, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsSf", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "990", "00" );
    var subfield = new Subfield( "o", "201150" );
    field.append( subfield );
    subfield = new Subfield( "b", "l" );
    field.append( subfield );
    subfield = new Subfield( "b", "v" );
    field.append( subfield );
    subfield = new Subfield( "u", "nt" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.sf",
        value: "201150"
    }, {
        name: "dkcclterm.sf",
        value: "l"
    }, {
        name: "dkcclterm.sf",
        value: "v"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (sf)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsSf, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsSp", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "008", "00" );
    var subfield = new Subfield( "l", "dan" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.sp",
        value: "dan"
    } ];

    Assert.equalValue( "Create dkcclterm fields (sp)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsSp, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsTi", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "210", "00" );
    field.append( "a", "Good Omens" );
    field.append( "c", "The Nice and Accurate Prophecies of Agnes Nutter, Witch" );
    record.append( field );
    field = new Field( "245", "00" );
    field.append( "a", "Glas kaster skygge" );
    field.append( "c", "om litteraer oversaettelse" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ti",
        value: "Good Omens The Nice and Accurate Prophecies of Agnes Nutter, Witch"
    }, {
        name: "dkcclterm.ti",
        value: "Glas kaster skygge om litteraer oversaettelse"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (ti)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsTi, index, record, "dkcclterm.ti" ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsTi", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "241", "00" );
    field.append( "a", "In the wake of Selandia - danish liner shipping 1912-2012" );
    record.append( field );
    field = new Field( "245", "00" );
    field.append( "a", "Dansk linjefart - fra Selandia til Emma Maersk" );
    record.append( field );
    field = new Field( "945", "00" );
    field.append( "a", "1001 nat" );
    field.append( "z", "740" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ti",
        value: "In the wake of Selandia - danish liner shipping 1912-2012"
    }, {
        name: "dkcclterm.ti",
        value: "Dansk linjefart - fra Selandia til Emma Maersk"
    }, {
        name: "dkcclterm.ti",
        value: "1001 nat"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (ti from 945)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsTi, index, record, "dkcclterm.ti" ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsUl", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "008", "00" );
    var subfield = new Subfield( "b", "dk" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ul",
        value: "dk"
    } ];

    Assert.equalValue( "Create dkcclterm fields (ul)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsUl, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsUu", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "990", "00" );
    var subfield = new Subfield( "o", "201150" );
    field.append( subfield );
    subfield = new Subfield( "b", "l" );
    field.append( subfield );
    subfield = new Subfield( "b", "v" );
    field.append( subfield );
    subfield = new Subfield( "u", "nt" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.uu",
        value: "nt"
    } ];

    Assert.equalValue( "Create dkcclterm fields (uu)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsUu, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsVp", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "008", "00" );
    field.append( "b", "dan" );
    record.append( field );
    field = new Field( "557", "00" );
    field.append( "a", "Vand & miljoe" );
    field.append( "v", "1. aargang, nr. 3 (oktober 1984)" );
    field.append( "j", "1984" );
    record.append( field );
    field = new Field( "558", "00" );
    field.append( "a", "Moderne fransk dramatik" );
    field.append( "h", "Fredensborg" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.vp",
        value: "Vand & miljoe"
    }, {
        name: "dkcclterm.vp",
        value: "1. aargang, nr. 3 (oktober 1984)"
    }, {
        name: "dkcclterm.vp",
        value: "Moderne fransk dramatik"
    }
    ];

    Assert.equalValue( "Create dkcclterm fields (vp)", DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsVp, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsWw", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "856", "00" );
    field.append( "u", "https://www.ebib.dk/" );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.ww",
        value: "https://www.ebib.dk/"
    } ];


    Assert.equalValue( "Create dkcclterm fields (ww)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsWw, index, record ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsEm", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "a", "29036640" );
    field.append( subfield );
    record.append( field );
    field = new Field( "032", "00" );
    subfield = new Subfield( "a", "DBF201150" );
    field.append( subfield );
    subfield = new Subfield( "x", "BKM201150" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "s", "magisk realisme" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "s", "kaerlighed" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "s", "faellesskab" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "s", "Tokyo" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "s", "Japan" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.em",
        value: "magisk realisme"
    }, {
        name: "dkcclterm.em",
        value: "kaerlighed"
    }, {
        name: "dkcclterm.em",
        value: "faellesskab"
    }, {
        name: "dkcclterm.em",
        value: "Tokyo"
    }, {
        name: "dkcclterm.em",
        value: "Japan"
    }
    ];

    Assert.equalValue( "Create dkcclterm.em (1)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsEm, index, record, "dkcclterm.em" ), indexOut );

} );

UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsEm", function() {

    var index = Index.newIndex();
    var record = new Record();
    var field = new Field( "001", "00" );
    var subfield = new Subfield( "a", "29036640" );
    field.append( subfield );
    record.append( field );
    field = new Field( "032", "00" );
    subfield = new Subfield( "a", "DBF201150" );
    field.append( subfield );
    subfield = new Subfield( "x", "BKM201150" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "m", "65.908" );
    field.append( subfield );
    record.append( field );
    field = new Field( "652", "00" );
    subfield = new Subfield( "p", "62.8" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "soefart" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "historie" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "rederier" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "f", "shipping" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "1900-1999" );
    field.append( subfield );
    record.append( field );
    field = new Field( "666", "00" );
    subfield = new Subfield( "i", "2000-2009" );
    field.append( subfield );
    record.append( field );
    field = new Field( "990", "00" );
    subfield = new Subfield( "b", "l" );
    field.append( subfield );
    subfield = new Subfield( "b", "v" );
    field.append( subfield );
    record.append( field );

    var indexOut = [ {
        name: "dkcclterm.em",
        value: "soefart"
    }, {
        name: "dkcclterm.em",
        value: "soefart"
    }, {
        name: "dkcclterm.em",
        value: "historie"
    }, {
        name: "dkcclterm.em",
        value: "rederier"
    }, {
        name: "dkcclterm.em",
        value: "shipping"
    }, {
        name: "dkcclterm.em",
        value: "1900-1999"
    }, {
        name: "dkcclterm.em",
        value: "2000-2009"
    }
    ];

    Assert.equalValue( "Create dkcclterm.em (2)",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsEm, index, record, "dkcclterm.em" ), indexOut );

} );


UnitTest.addFixture( "DkcclTermIndex.createDkcclFieldsBr", function() {

    var index = Index.newIndex();
    var record = new Record();
    record.fromString( "021 00 *bBrugsretskategori: A\n" );

    var indexOut = [ {
        name: "dkcclterm.br",
        value: "a"
    } ];

    Assert.equalValue( "Create dkcclterm fields (br) with value a",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsBr, index, record ), indexOut );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        "021 00 *bsælges sammen med: Anton Bruckner: Symfoni nr. 8, c-mol, og: Anton Bruckner: Symfoni nr. 5, B-dur, og: Franz Schubert: Symfoni nr. 8, h-mol, Deutsch 759 " +
        "*bbrugsretskategori: D\n" );

    indexOut = [ {
        name: "dkcclterm.br",
        value: "d"
    } ];

    Assert.equalValue( "Create dkcclterm fields (br) with value d",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsBr, index, record ), indexOut );

    index = Index.newIndex();
    record = new Record();
    record.fromString( '021 00 *b Biblioteksmediers brugsretskategori: B *b Biblioteksmedier\n' +
        '021 00 *bbrugsretskategori: D *bFlex Medie\n' );

    indexOut = [ {
        name: "dkcclterm.br",
        value: "b"
    },
        {
            name: "dkcclterm.br",
            value: "d"
        }
    ];

    Assert.equalValue( "Create dkcclterm fields (br) with values d and b",
        DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsBr, index, record ), indexOut );


} );

UnitTest.addFixture( "DkcclTermIndex.translateGMBCode", function() {
    var inputCode = 'r';
    var outputCode = 'ly';

    Assert.equalValue( "Translate 1 character general material code r to mnemo-code ly",
        DkcclTermIndex.translateGMBCode( inputCode ), outputCode );

    inputCode = "w";
    outputCode = undefined;

    Assert.equalValue( "Return undefined for unknown gmb code", DkcclTermIndex.translateGMBCode( inputCode ), outputCode );


} );

UnitTest.addFixture( "DkcclTermIndex.isEbook", function() {
    var record = new Record();
    var inputString = "008 *w1\n";
    record.fromString( inputString );
    Assert.that( " Return true if 008 w 1", DkcclTermIndex.isEbook( record ) );

    record = new Record();
    inputString = "009 *aa *gxe\n" +
        "032 *xBKM201224\n" +
        "512 *aDownloades i EPUB-format\n";

    record.fromString( inputString );
    Assert.that( "record is ebook in epub-format", DkcclTermIndex.isEbook( record ) );

    record = new Record();
    inputString = "008 *tm\n" +
        "009 *aa *gxe\n" +
        "856 *uhttp://molly.ruc.dk/login?url=http://site.ebrary.com/lib/rubruc/Doc?id=10539287\n";
    record.fromString( inputString );
    Assert.that( "record is ebook from ebrary", DkcclTermIndex.isEbook( record ) );

    record = new Record();
    inputString = "009 *aa *gxe\n" +
        "512 *aKan downloades i PDF-format\n";

    record.fromString( inputString );
    Assert.not( "record is not ebook as there is no bkm/net", DkcclTermIndex.isEbook( record ) );

    record = new Record();
    inputString = "009 *aa *gxe\n" +
        "512 *aKan downloades i HTML-format\n";

    record.fromString( inputString );
    Assert.not( "record is not ebook as it is in HTML", DkcclTermIndex.isEbook( record ) );


    record = new Record();
    inputString = "009 *aa *gxe\n" +
        "440 *aEarly English books online\n";
    record.fromString( inputString );
    Assert.that( "record is ebook from early english books", DkcclTermIndex.isEbook( record ) );

    record = new Record();
    inputString = "001 *b810010\n" +
        "091 *aBog\n";
    record.fromString( inputString );
    Assert.that( "record is ebook from det kongelige bibliothek", DkcclTermIndex.isEbook( record ) );

} );
