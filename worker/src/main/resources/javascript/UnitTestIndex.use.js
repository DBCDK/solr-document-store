use( "Index" );
use( "UnitTest" );

UnitTest.addFixture( "Index.pushField", function ( ) {

    var index = Index.newIndex();
    index.pushField( "name1", "value1" );
    index.pushField( "name2", "value2" );

    var indexOut = [ {
        name: "name1",
        value: "value1"
    }, {
        name: "name2",
        value: "value2"
    } ];

    Assert.equalValue( "Creating new index and adding two fields", index, indexOut );

} );

UnitTest.addFixture( "Index.pushField", function ( ) {

    var index = Index.newIndex();
    index.pushField( null, "value1" );
    index.pushField( undefined, "value2" );
    index.pushField( "", "value2" );

    //Assert.equal("pushField ignores field with missing name", 'index.pushField(null, "value1"); index.pushField(undefined, "value2"); index.pushField("", "value2"); index.length;', 0);
    Assert.equalValue( "pushField allows field with missing name", index.length, 3 );

    index = Index.newIndex();
    index.pushField( "name1", null );
    index.pushField( "name2", undefined );

    //Assert.equal("pushField ignores field with missing value", 'index.pushField("name1", null); index.pushField("name2", undefined); index.length;', 0);
    Assert.equalValue( "pushField allows field with missing value", index.length, 2 );

    index = Index.newIndex();
    index.pushField( "name1", "" );

    Assert.equalValue( "pushField allows empty value", index.length, 1 );

} );
