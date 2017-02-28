use( "Alias" );
use( "UnitTest" );
use( "XmlUtil" );

UnitTest.addFixture( "Alias.getAlias", function( ) {

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
            '<adminData>' +
                '<libraryType>research</libraryType>' +
                '<indexingAlias>danmarcxchange</indexingAlias>' +
                '<accessType>physical</accessType>' +
            '</adminData>' +
        '</ting:container>'
    );
    var alias = "danmarcxchange";

    Assert.equalValue( "Get valid indexing alias", Alias.getAlias( xml ), alias );

} );

UnitTest.addFixture( "Alias.getAlias", function( ) {

    var xml = XmlUtil.fromString(
        '<ting:container xmlns:ting="http://www.dbc.dk/ting">' +
            '<adminData>' +
                '<libraryType>research</libraryType>' +
                '<indexingAlias>ubf</indexingAlias>' +
                '<accessType>physical</accessType>' +
            '</adminData>' +
        '</ting:container>'
    );

    var error = "Alias: 'ubf' is not valid";

    Assert.exception( "Get indexing alias (invalid)", function( ) {
        Alias.getAlias( xml ) }, error );

} );
