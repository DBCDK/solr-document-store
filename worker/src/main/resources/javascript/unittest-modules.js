// Script to unittest the modules passed on the command line.,
// First argument is name of output file (WriteFile required)

use( "System" );
use( "UnitTest" );
use( "WriteFile" );
use( "Print" );

function usage( scriptname ) {
    print( "Usage: " + scriptname + " <filename> <module> [ <module> ... ]\n\nRun UnitTest in all passed modules, and outputs to filename\n" );
};

function setup( ) {
    // Make sure that tests are performed, even though we load as a module
    UnitTest.doTests = function( ) {
        return true;
    };
    // Make sure that no output happens from consequitive addFixtures (below)
    UnitTest.emitReport = function( ) {
        return false;
    };
    // Make sure that output comes as XML
    UnitTest.outputXml = true;
}

function main( scriptname, argv ) {
    if ( argv.length < 2 ) {
        usage( scriptname );
        return -1;
    }
    var filename = argv[ 0 ];
    setup( );
    for ( var i = 1; i < argv.length; ++i ) {
        use( argv[ i ] );
    }
    System.writeFile( filename, UnitTest.report( ) + "\n" );
    return UnitTest.totalFailed( );
}

// Call main and return the exit code.
main( System.scriptname, System.arguments );
