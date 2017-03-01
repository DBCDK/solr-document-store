use( "DkcclTermMa" );
use( "Index" );
use( "Marc" );
use( "UnitTest" );


UnitTest.addFixture( "Test DkcclTermMa.createDkcclFieldsMa", function() {

    var index = Index.newIndex( );
    var record = new Record( );
    record.fromString(
        '008 00 *tm\n' +
        '009 00 *aa *gxx'
    );

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
    } ];

    var actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm fields (ma)", actual, indexOut );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        '005 00 *ka *kb *ke *kf\n' +
        '008 00 *ts *uf *a1985 *leng *bgb *v0\n' +
        '009 00 *ac *gxx'
    );

    indexOut = [ {
        name:"dkcclterm.ma",
        value:"tl"
    }, {
        name:"dkcclterm.ma",
        value:"s\u00E6"
    }, {
        name:"dkcclterm.ma",
        value:"mu"
    }, {
        name:"dkcclterm.ma",
        value:"xx"
    } ];

    actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm.ma fields for record with field 005", actual, indexOut );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '001 00 *a84881899 *b870971\n' +
        '008 00 *ta *uf *a1999 *bdk *ldan *rap *v0\n' +
        '009 00 *aa *gxx\n' +
        '014 00 *a84791342 *xFOR'
    );

    indexOut = [ {
        name: "dkcclterm.ma",
        value: "an"
    }, {
        name: "dkcclterm.ma",
        value: "ap"
    }, {
        name: "dkcclterm.ma",
        value: "te"
    }, {
        name: "dkcclterm.ma",
        value: "xx"
    }, {
        name: "dkcclterm.ma",
        value: "FOR"
    } ];

    actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm.ma fields for 870971 record with 014x", actual, indexOut );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '001 00 *a50523861 *b870970\n' +
        '008 00 *tm\n' +
        '009 00 *aa *bc *gxx *as *gxc *av'
    );

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
    } ];

    actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm fields (ma) 1 book + 2 cd's with music ", actual, indexOut );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        "008 00 *tm *dx *jf *nb *w1\n" +
        "009 00 *aa *gxe\n"
    );
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
    } ];

    actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm field (ma) ebook", actual, indexOut );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        "009 00 *aa *gxe\n" +
        "032 00 *xBKM201224\n" +
        "512 00 *aDownloades i EPUB-format\n"
    );

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

    actual = DkcclTermMa.createDkcclFieldsMa( index, record );

    Assert.equalValue( "Create dkcclterm field (ma) ebook without 008w1 marking", actual, indexOut );

} );

UnitTest.addFixture( "Test DkcclTermMa.createDkcclFieldsMaFrom005", function( ) {

    var index = Index.newIndex();
    var record = new Record();
    record.fromString(
        '005 00 *hb *ka *kb'
    );

    var map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom005( index, map );
    record.eachFieldMap( map );

    var expected = [ {
        name: "dkcclterm.ma",
        value: "lw"
    } ];

    var testName = "Create dkcclterm.ma field from 005 h (not k because it does not match criteria)";

    Assert.equalValue( testName, index, expected );

    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '005 00 *ib *ka'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom005( index, map );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "ps"
    } ];

    testName = "Create dkcclterm.ma field from 005 i (not k because it does not match criteria)";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '005 00 *jc'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom005( index, map );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "so"
    } ];

    testName = "Create dkcclterm.ma field from 005 j";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '005 00 *ha *ka *kb *ke *ki'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom005( index, map );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "lv"
    }, {
        name: "dkcclterm.ma",
        value: "tl"
    } ];

    testName = "Create dkcclterm.ma field from 005 h and k";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex();
    record = new Record();
    record.fromString(
        '005 00 *zp'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom005( index, map );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "lb"
    } ];

    testName = "Create dkcclterm.ma field from 005 z";

    Assert.equalValue( testName, index, expected );

} );


UnitTest.addFixture( "Test DkcclTermMa.createDkcclFieldsMaFrom008", function( ) {

    var index = Index.newIndex();
    var record = new Record( );
    record.fromString(
        '008 00 *ts *uf *a2002 *bdk *f1 *leng *v0\n' +
        '009 00 *aa *gxx'
    );

    var map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record );
    record.eachFieldMap( map );

    var expected = [ {
        name: "dkcclterm.ma",
        value: "s\u00E6"
    }, {
        name: "dkcclterm.ma",
        value: "b\u00E5"
    }, {
        name: "dkcclterm.ma",
        value: "kf"
    } ];

    var testName = "Create dkcclterm.ma field from 008 f and t (combined with 009ag)";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        '008 00 *tm *uf *a2007 *bdk *g1 *kb *ldan *v0\n' +
        '009 00 *am *gth'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "mo"
    }, {
        name: "dkcclterm.ma",
        value: "fe"
    } ];

    testName = "Create dkcclterm.ma field from 008 g and t (combined with 009ag)";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        '004 00 *rn *ae\n' +
        '008 00 *tp *ud *a2003 *z20?? *bdk *ca *dy *hd *ia *leng *v0\n' +
        '009 00 *aa *gxe'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "pe"
    }, {
        name: "dkcclterm.ma",
        value: "pf"
    }, {
        name: "dkcclterm.ma",
        value: "pb"
    } ];

    testName = "Create dkcclterm.ma field from 008 h, t, u (combined with 004a)";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        '008 00 *ts *uf *a1975 *bus *leng *m1 *v7\n' +
        '009 00 *ac *gxe'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "s\u00E6"
    }, {
        name: "dkcclterm.ma",
        value: "ss"
    } ];

    testName = "Create dkcclterm.ma field from 008 m and t";

    Assert.equalValue( testName, index, expected );


    index = Index.newIndex( );
    record = new Record( );
    record.fromString(
        '008 00 *do\n'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "ta"
    } ];

    testName = "Create dkcclterm.ma field from 008*d";

    Assert.equalValue( testName, index, expected );


} );

UnitTest.addFixture( "Test DkcclTermMa.createDkcclFieldsMaFrom009", function() {

    var index = Index.newIndex();
    var record = new Record( );
    record.fromString(
        '009 00 *an *gnh'
    );

    var map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom009( index, map, record );
    record.eachFieldMap( map );

    var expected = [ {
        name: "dkcclterm.ma",
        value: "fi"
    }, {
        name: "dkcclterm.ma",
        value: "nh"
    } ];

    Assert.equalValue( "create dkcclterm.ma from 009 ag (g=nh)", index, expected );


    index = Index.newIndex();
    record = new Record( );
    record.fromString(
        '009 00 *am *br *gth'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom009( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "fi"
    }, {
        name: "dkcclterm.ma",
        value: "ly"
    }, {
        name: "dkcclterm.ma",
        value: "th"
    } ];

    Assert.equalValue( "create dkcclterm.ma from 009 abg", index, expected );


    index = Index.newIndex();
    record = new Record( );
    record.fromString(
        '009 00 *at *gtk'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom009( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "el"
    }, {
        name: "dkcclterm.ma",
        value: "tk"
    }];

    Assert.equalValue( "create dkcclterm.ma from 009 ag (g=tk)", index, expected );


    index = Index.newIndex();
    record = new Record( );
    record.fromString(
        '009 00 *as *gxc *hxg'
    );

    map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom009( index, map, record );
    record.eachFieldMap( map );

    expected = [ {
        name: "dkcclterm.ma",
        value: "lm"
    }, {
        name: "dkcclterm.ma",
        value: "sc"
    },{
        name: "dkcclterm.ma",
        value: "xc"
    }, {
        name: "dkcclterm.ma",
        value: "xg"
    }];

    Assert.equalValue( "create dkcclterm.ma from 009 agh", index, expected );

} );

UnitTest.addFixture( "Test DkcclTermMa.createDkcclFieldsMaFrom014", function() {

    var index = Index.newIndex();
    var record = new Record( );
    record.fromString(
        '014 00 *a12345678 *xDEB'
    );

    var map = new MatchMap();
    DkcclTermMa.createDkcclFieldsMaFrom014( index, map );
    record.eachFieldMap( map );

    var expected = [ {
        name: "dkcclterm.ma",
        value: "DEB"
    } ];

    Assert.equalValue( "createDkcclFieldsMaFrom014 subfield x", index, expected );

} );


UnitTest.addFixture( "Test DkcclTermMa.isEbook", function( ) {

    var record = new Record( );
    record.fromString(
        "008 00 *w1\n"
    );
    Assert.that( "Return true if 008 w = 1", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "009 00 *aa *gxe\n" +
        "032 00 *xBKM201224\n" +
        "512 00 *aDownloades i EPUB-format\n"
    );
    Assert.that( "record is ebook in epub-format", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "008 00 *tm\n" +
        "009 00 *aa *gxe\n" +
        "856 00 *uhttp://www.oxfordscholarship.com/oso/public/content/philosophy/9780195110333/toc.html\n"
    );
    Assert.that( "record is ebook from oxfordscholarship", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "008 00 *tm\n" +
        "009 00 *aa *gxe\n" +
        "856 00 *uhttp://molly.ruc.dk/login?url=http://site.ebrary.com/lib/rubruc/Doc?id=10539287\n"
    );
    Assert.that( "record is ebook from ebrary", DkcclTermMa.isEbook( record ) );


    record = new Record( );
    record.fromString(
        "009 00 *aa *gxe\n" +
        "512 00 *aKan downloades i PDF-format\n"
    );
    Assert.not( "record is not ebook as there is no bkm/net", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "009 00 *aa *gxe\n" +
        "512 00 *aKan downloades i HTML-format\n"
    );
    Assert.not( "record is not ebook as it is in HTML", DkcclTermMa.isEbook( record ) );

    record = new Record();
    record.fromString(
        "009 00 *aa *gxe\n" +
        "440 00 *aEarly English books online\n"
    );
    Assert.that( "record is ebook from early english books", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "001 00 *b810010\n" +
        "091 00 *aBog\n"
    );
    Assert.that( "record is ebook from det kongelige bibliotek", DkcclTermMa.isEbook( record ) );

    record = new Record( );
    record.fromString(
        "001 00 *b125010\n" +
        "091 00 *aBog\n"
    );
    Assert.that( "record is ebook from 125010", DkcclTermMa.isEbook( record ) );

} );

UnitTest.addFixture( "Test __addToMaIndexIfValueExists", function() {

    var index = Index.newIndex();
    var value = undefined;

    DkcclTermMa.__addToMaIndexIfValueExists( index, value );

    var expected = [];

    Assert.equalValue( "Do not add field to index when value is undefined", index, expected );


    index = Index.newIndex();
    value = null;

    DkcclTermMa.__addToMaIndexIfValueExists( index, value );

    expected = [];

    Assert.equalValue( "Do not add field to index when value is null", index, expected );


    index = Index.newIndex();
    value = "xx";

    DkcclTermMa.__addToMaIndexIfValueExists( index, value );

    expected = [ {
        name: "dkcclterm.ma",
        value: "xx"
    }];

    Assert.equalValue( "Add field to index when value is a non-empty string", index, expected );

} );

