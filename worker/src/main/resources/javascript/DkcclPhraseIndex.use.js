use( "Log" );
use( "Marc" );
use( "Tables" );
use( "PhraseValues" );

EXPORTED_SYMBOLS = [ 'DkcclPhraseIndex' ];

/**
 * Module with functions that create ccl phrase indexes from marc record.
 *
 * Contains functions to create ccl phrase indexes for danMARC2 records
 * (as defined in Praksisregler)
 *
 * @type {namespace}
 * @namespace
 * @name DkcclPhraseIndex
 */
var DkcclPhraseIndex = function( ) {

    /**
     * Method that creates ccl phrase index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclPhraseFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {Record} record The record from which to create the index fields
     * @return {Object} Index with added fields
     * @name DkcclPhraseIndex.createDkcclPhraseFields
     * @function
     */
    function createDkcclPhraseFields( index, record ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclPhraseFields" );

        var map = new MatchMap();
        DkcclPhraseIndex.createDkcclBcmFields( index, map );
        DkcclPhraseIndex.createDkcclDbkFields( index, map );
        DkcclPhraseIndex.createDkcclDdcFields( index, map );
        DkcclPhraseIndex.createDkcclLacFields( index, map );
        DkcclPhraseIndex.createDkcclLagFields( index, map );
        DkcclPhraseIndex.createDkcclLauFields( index, map );
        DkcclPhraseIndex.createDkcclLbrFields( index, map );
        DkcclPhraseIndex.createDkcclLccFields( index, map );
        DkcclPhraseIndex.createDkcclLclFields( index, map );
        DkcclPhraseIndex.createDkcclLcpFields( index, map );
        DkcclPhraseIndex.createDkcclLdbFields( index, map );
        DkcclPhraseIndex.createDkcclLdfFields( index, map );
        DkcclPhraseIndex.createDkcclLdkFields( index, map );
        DkcclPhraseIndex.createDkcclLdsFields( index, map );
        DkcclPhraseIndex.createDkcclLedFields( index, map );
        DkcclPhraseIndex.createDkcclLefFields( index, map );
        DkcclPhraseIndex.createDkcclLekFields( index, map );
        DkcclPhraseIndex.createDkcclLemFields( index, map, "dkcclphrase.lem", false );
        DkcclPhraseIndex.createDkcclLepFields( index, map );
        DkcclPhraseIndex.createDkcclLesFields( index, map );
        DkcclPhraseIndex.createDkcclLffFields( index, map );
        DkcclPhraseIndex.createDkcclLfmFields( index, map );
        //creates both dkcclphrase.lfo and dkcclphrase.mfo indices
        DkcclPhraseIndex.createDkcclLfoFields( index, map );
        DkcclPhraseIndex.createDkcclLgdFields( index, map );
        DkcclPhraseIndex.createDkcclLhtFields( index, map );
        DkcclPhraseIndex.createDkcclLkeFields( index, map );
        DkcclPhraseIndex.createDkcclLklFields( index, map );
        DkcclPhraseIndex.createDkcclLknFields( index, map );
        DkcclPhraseIndex.createDkcclLkoFields( index, map );
        DkcclPhraseIndex.createDkcclLmeFields( index, map );
        DkcclPhraseIndex.createDkcclLmoFields( index, map );
        DkcclPhraseIndex.createDkcclLmsFields( index, map );
        DkcclPhraseIndex.createDkcclLnbFields( index, map );
        DkcclPhraseIndex.createDkcclLntFields( index, map );
        DkcclPhraseIndex.createDkcclLokFields( index, map );
        DkcclPhraseIndex.createDkcclLpaFields( index, map );
        DkcclPhraseIndex.createDkcclLpeFields( index, map );
        DkcclPhraseIndex.createDkcclLpoFields( index, map );
        DkcclPhraseIndex.createDkcclLrtFields( index, map );
        DkcclPhraseIndex.createDkcclLseFields( index, map );
        DkcclPhraseIndex.createDkcclLsoFields( index, map );
        DkcclPhraseIndex.createDkcclLstFields( index, map );
        //creates both dkcclphrase.lti and dkcclphrase.mti indices
        DkcclPhraseIndex.createDkcclLtiFields( index, map );
        DkcclPhraseIndex.createDkcclLtsFields( index, map );
        DkcclPhraseIndex.createDkcclLttFields( index, map );
        DkcclPhraseIndex.createDkcclLukFields( index, map );
        DkcclPhraseIndex.createDkcclLutFields( index, map );
        DkcclPhraseIndex.createDkcclLvpFields( index, map );
        DkcclPhraseIndex.createDkcclLvxFields( index, map );
        DkcclPhraseIndex.createDkcclNalFields( index, map );
        DkcclPhraseIndex.createDkcclNlmFields( index, map );
        DkcclPhraseIndex.createDkcclUdkFields( index, map );
        record.eachFieldMap(map);

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclPhraseFields" );
    }

    /**
     * Create a MatchMap, add mapping functions from a specific index method and build the index from a record.
     *
     * To be used from other index modules that need to call specific methods in this module.
     * Also used when unit testing individual index methods.
     * This method bypasses the optimization above to provide only the fields handled by the specified method.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.callIndexMethod( func, index, record, fieldName, restricted )
     * @param {Function} func the index method to call
     * @param {Object} index the index to add fields to
     * @param {Record} record The record from which to create the index fields
     * @param {String|undefined} fieldName Optional fieldname parameter to pass to index method that requires it
     * @param {Object} restricted
     * @return {Object} Index with added fields
     * @name DkcclPhraseIndex.callIndexMethod
     * @function
     */
    function callIndexMethod(func, index, record, fieldName, restricted) {
        Log.debug("CALLINDEX ", restricted);
        var map = new MatchMap();
        func( index, map, fieldName, restricted );
        record.eachFieldMap( map );
        return index;
    }

    /**
     * Method that creates ccl bcm index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclBcmFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclBcmFields
     * @function
     */
    function createDkcclBcmFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclBcmFields" );

        map.put( "085", function( field ) {
            index.pushField( "dkcclphrase.bcm", field.getValue( /a/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclBcmFields" );
    }

    /**
     * Method that creates ccl dbk index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclDbkFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclDbkFields
     * @function
     */
    function createDkcclDbkFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclDbkFields" );

        map.put( "079", function( field ) {
            index.pushField( "dkcclphrase.dbk", field.getValue( /a|c/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclDbkFields" );
    }

    /**
     * Method that creates ccl ddc index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclDdcFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclDdcFields
     * @function
     */
    function createDkcclDdcFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclDdcFields" );

        map.put( "082", function( field ) {
            index.pushField( "dkcclphrase.ddc", field.getValue( /a|b|d/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclDdcFields" );
    }

    /**
     * Method that creates ccl lac index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLacFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLacFields
     * @function
     */
    function createDkcclLacFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLacFields" );

        map.put( "662", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclphrase.lac", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLacFields" );
    }

    /**
     * Method that creates ccl lag index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLagFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLagFields
     * @function
     */
    function createDkcclLagFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLagFields" );
        map.put( "600", function( field ) {
            if ( field.getValue( /2/ ) === "NAL" ) {
                index.pushField( "dkcclphrase.lag", field.getValue( /a|h|e|f|c/, " " ) );
            }
        } );
        map.put( "610", function( field ) {
            if ( field.getValue( /2/ ) === "NAL" ) {
                if ( field.exists( /a/ ) ) {
                    index.pushField( "dkcclphrase.lag", field.getValue( /a|e|c|i|k|j/, " " ) );
                }
                if ( field.exists( /s/ ) ) {
                    index.pushField( "dkcclphrase.lag", field.getValue( /s|e|c|i|k|j/, " " ) );
                }
            }
        } );
        map.put( "634", function( field ) {
            if ( field.getValue( /2/ ) === "NAL" ) {
                field.eachSubField( /c/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lag", subField.value + " " + field.getValue( /d|v|x|y|z/, " " ) );
                } );
            }
        } );
        map.put( "645", function( field ) {
            if ( field.getValue( /2/ ) === "NAL" ) {
                field.eachSubField( /a|c/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lag", subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
                } );
            }
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lag", subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLagFields" );
    }

    /**
     * Method that creates ccl lau index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLauFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLauFields
     * @function
     */
    function createDkcclLauFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLauFields" );

        map.put( "652", "654", "655", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lau", subField.value + " " + field.getValue( /h|e|f|c|t/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lau", subField.value + " " + field.getValue( /h|E|f|c|t/, " " ) );
                }
            } );
            if ( !field.exists( /A|a/ ) ) {
                index.pushField( "dkcclphrase.lau", field.getValue( /h|e|f|c|t/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lau", field.getValue( /h|E|f|c|t/, " " ) );
                }
            }
            field.eachSubField( /b|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.lau", subField.value );
            } );
        } );
        map.put( "952", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lau", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLauFields" );
    }

    /**
     * Method that creates ccl lbr index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLbrFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLbrFields
     * @function
     */
    function createDkcclLbrFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLbrFields" );

        map.put( "021", function( field ) {
            if ( field.getValue( /b/ ).match( /brugsretskategori/i ) ) {
                index.pushField( "dkcclphrase.lbr", field.getValue( /b/, " " ) );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLbrFields" );
    }

    /**
     * Method that creates ccl lcc index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLccFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLccFields
     * @function
     */
    function createDkcclLccFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLccFields" );

        map.put( "050", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcc", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLccFields" );
    }

    /**
     * Method that creates ccl lcl index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLclFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLclFields
     * @function
     */
    function createDkcclLclFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLclFields" );

        map.put( "050", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcl", subField.value );
            } );
        } );
        map.put( "060", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcl", subField.value );
            } );
        } );
        map.put( "070", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcl", subField.value );
            } );
        } );
        map.put( "079", function( field ) {
            index.pushField( "dkcclphrase.lcl", field.getValue( /a|c/, " " ) );
        } );
        map.put( "080", function( field ) {
            index.pushField( "dkcclphrase.lcl", field.getValue( /a|x/, " " ) );
        } );
        map.put( "082", function( field ) {
            index.pushField( "dkcclphrase.lcl", field.getValue( /a|b|d/, " " ) );
        } );
        map.put( "085", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcl", subField.value );
            } );
        } );
        /**
         * values from dkcclterm.kl er copied over in solr-indexer-config/config/schema.xml
         * i.e. fields 087 a 088 a and 089 a
         */
        map.put( "652", "654", function( field ) {
            index.pushField( "dkcclphrase.lcl", field.getValue( /i|v/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /m|v/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /n|v|z/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /o|v|z/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /p|v/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /p|v|z/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /r|v/, " " ) );
        } );
        map.put( "655", function( field ) {
            index.pushField( "dkcclphrase.lcl", field.getValue( /i|v/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /m|v/, " " ) );
            index.pushField( "dkcclphrase.lcl", field.getValue( /p|v/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLclFields" );
    }

    /**
     * Method that creates ccl lcp index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLcpFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLcpFields
     * @function
     */
    function createDkcclLcpFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLcpFields" );

        map.put( "690", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lcp", subField.value + " " + field.getValue( /d/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLcpFields" );
    }

    /**
     * Method that creates ccl ldb index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLdbFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLdbFields
     * @function
     */
    function createDkcclLdbFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLdbFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /e|f|i|q|r|s|m|n|p|l|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.ldb", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLdbFields" );
    }

    /**
     * Method that creates ccl ldf index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLdfFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLdfFields
     * @function
     */
    function createDkcclLdfFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLdfFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /e|f|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.ldf", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLdfFields" );
    }

    /**
     * Method that creates ccl ldk index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLdkFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLdkFields
     * @function
     */
    function createDkcclLdkFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLdkFields" );

        map.put( "652", function( field ) {
            index.pushField( "dkcclphrase.ldk", field.getValue( /m|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /p|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /i|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /i|z/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /n|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /n|z/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /o/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /p|z/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /q|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /q|z/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /r|v/, " " ) );
        } );
        map.put( "655", function( field ) {
            index.pushField( "dkcclphrase.ldk", field.getValue( /m|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /p|v/, " " ) );
            index.pushField( "dkcclphrase.ldk", field.getValue( /i|v/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLdkFields" );
    }

    /**
     * Method that creates ccl lds index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLdsFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLdsFields
     * @function
     */
    function createDkcclLdsFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLdsFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /s|r|q/, function( field, subField ) {
                index.pushField( "dkcclphrase.lds", subField.value );
            } );
        } );
        map.put( "668", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lds", subField.value + " " + field.getValue( /b|c/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLdsFields" );
    }

    /**
     * Method that creates ccl led index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLedFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLedFields
     * @function
     */
    function createDkcclLedFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLedFields" );

        map.put( "661", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( "dkcclphrase.led", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLedFields" );
    }

    /**
     * Method that creates ccl lef index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLefFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLefFields
     * @function
     */
    function createDkcclLefFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLefFields" );

        map.put( "630", function( field ) {
            field.eachSubField( /f|g/, function( field, subField ) {
                index.pushField( "dkcclphrase.lef", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /e|f|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.lef", subField.value );
            } );
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /f/, function( field, subField ) {
                index.pushField( "dkcclphrase.lef", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLefFields" );
    }

    /**
     * Method that creates ccl lek index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLekFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLekFields
     * @function
     */
    function createDkcclLekFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLekFields" );

        map.put( "610", function( field ) {
            field.eachSubField( /a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lek", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
            } );
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( /z/ ).match( /610/ ) ) {
                field.eachSubField( /a/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lek", subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " ) );
                } );
                field.eachSubField( /s/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lek", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                } );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLekFields" );
    }

    /**
     * Method that creates ccl lem index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLemFields( index, map, indexName, restricted )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {Object} indexName a string with the name of the index to add fields to
     * @param {Object} restricted a boolean true or false (decides whether some fields are skipped)
     * @name DkcclPhraseIndex.createDkcclLemFields
     * @function
     */
    function createDkcclLemFields( index, map, indexName, restricted ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLemFields" );

        Log.debug("RESTRICTED: ", restricted);

        map.put( "600", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( indexName, subField.value + " " + field.getValue( /h|E|f|c/, " " ) );
                }
            } );
            if ( !field.exists( /A|a/ ) ) {
                index.pushField( indexName, field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( indexName, field.getValue( /h|E|f|c/, " " ) );
                }
            }
        } );
        map.put( "610", function( field ) {
            field.eachSubField( /a|s/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
            } );
        } );
        map.put( "620", function( field ) {
            index.pushField( indexName, field.getValue( /a|b|c/, " " ) );
        } );
        map.put( "621", function( field ) {
            index.pushField( indexName, field.getValue( /a|b|e|f|j/, " " ) );
        } );
        map.put( "630", function( field ) {
            field.eachSubField( /a|b|f|g|s|t/, function( field, subField ) {
                index.pushField( indexName, subField.value );
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "631", function( field ) {
            field.eachSubField( /a|b|f|g|s|t/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "633", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value );
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "634", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( indexName, subField.value );
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
                index.pushField( indexName, subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
            } );
            field.eachSubField( /c/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /d/ ) );
                index.pushField( indexName, subField.value + " " + field.getValue( /d|u/, " " ) );
                index.pushField( indexName, subField.value + " " + field.getValue( /d|v|x|y|z/, " " ) );
            } );
            field.eachSubField( /u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "645", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
                index.pushField( indexName, subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
            } );
        } );
        map.put( "650", function( field ) {
            index.pushField( indexName, field.getValue( /a|b|c|d|e|v|x|y|z/, " " ) );
        } );
        map.put( "651", function( field ) {
            index.pushField( indexName, field.getValue( /a|e|v|x|y|z/, " " ) );
        } );
        map.put( "652", "654", "655", function( field )  {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( indexName, subField.value + " " + field.getValue( /h|E|f|c/, " " ) );
                }
            } );
            if ( !field.exists( /A|a/ ) ) {
                index.pushField( indexName, field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( indexName, field.getValue( /h|E|f|c/, " " ) );
                }
            }
            field.eachSubField( /b|t/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "660", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "661", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "662", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        if (restricted === true) {
            Log.debug("ISRESTRICTED");
            map.put( "666", "667", function( field ) {
                field.eachSubField( /e|f|l|m|n|o|p|q|r|s|t/, function( field, subField ) {
                    index.pushField( indexName, subField.value );
                } );
            } );
        } else {
            map.put( "666", "667", function( field ) {
                field.eachSubField( /e|f|i|l|m|n|o|p|q|r|s|t|u/, function( field, subField ) {
                    index.pushField( indexName, subField.value );
                } );
            } );
        }
        map.put( "668", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /b|c/, " " ) );
            } );
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "690", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /d/, " " ) );
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( /z/ ).match( /600/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|f|h/, " " ) );
            }
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( /z/ ).match( /610/ ) ) {
                field.eachSubField( /a/, function( field, subField ) {
                    index.pushField( indexName, subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " ) );
                } );
                field.eachSubField( /s/, function( field, subField ) {
                    index.pushField( indexName, subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                } );
            }
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /a|f|s/, function( field, subField ) {
                index.pushField( indexName, subField.value );

                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "933", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value );
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "934", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( indexName, subField.value );
                index.pushField( indexName, subField.value + " " + field.getValue( /u/, " " ) );
            } );
            field.eachSubField( /c/, function( field, subField ) {
                index.pushField( indexName, subField.value + " " + field.getValue( /d|u/, " " ) );
                index.pushField( indexName, subField.value + " " + field.getValue( /d/, " " ) );
            } );
        } );
        map.put( "952", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "966", function( field ) {
            field.eachSubField( /e|f|i|l|m|n|o|p|q|r|s|t|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "968", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLemFields" );
    }

    /**
     * Method that creates ccl lep index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLepFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLepFields
     * @function
     */
    function createDkcclLepFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLepFields" );

        map.put( "600", function( field ) {
            index.pushField( "dkcclphrase.lep", field.getValue( /a|h|e|f|c/, " " ) );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( /z/ ).match( /600/ ) ) {
                index.pushField( "dkcclphrase.lep", field.getValue( /a|h|e|f|c/, " " ) );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLepFields" );
    }

    /**
     * Method that creates ccl les index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLesFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLesFields
     * @function
     */
    function createDkcclLesFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLesFields" );

        map.put( "630", function( field ) {
            field.eachSubField( /s|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.les", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /s/, function( field, subField ) {
                index.pushField( "dkcclphrase.les", subField.value );
                index.pushField( "dkcclphrase.les", subField.value + " " + field.getValue( /u/, " " ) );
            } );
            field.eachSubField( /r/, function( field, subField ) {
                index.pushField( "dkcclphrase.les", subField.value );
            } );
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /s/, function( field, subField ) {
                index.pushField( "dkcclphrase.les", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLesFields" );
    }

    /**
     * Method that creates ccl lff index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLffFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLffFields
     * @function
     */
    function createDkcclLffFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLffFields" );
        map.put( "100", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|e|f|c|4/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|E|f|c|4/, " " ) );
                }
            } );
        } );
        map.put( "110", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /e|c|i|k|j|4/, " " ) );
            } );
        } );
        map.put( "239", function( field ) {
            index.pushField( "dkcclphrase.lff", field.getValue( /a|h|e|f|c|4/, " " ) );
        } );
        map.put( "540", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value );
            } );
        } );
        map.put( "700", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|e|f|c|4/, " " ) );
                if ( field.exists( "E" ) ) {
                    index.pushField( "dkcclphrase.lff", field.getValue( /a|h|E|f|c|4/, " " ) );
                }
            } );
        } );
        map.put( "710", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /e|c|i|k|j|4/, " " ) );
                if ( field.exists( /C/ ) ) {
                    index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /e|C|i|k|j|4/, " " ) );
                }
            } );
        } );
        map.put( "720", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|4/, " " ) );
            } );
            field.eachSubField( /k/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /4/, " " ) );
            } );
        } );
        map.put( "739", function( field ) {
            index.pushField( "dkcclphrase.lff", field.getValue( /a|h|e|f|c|4/, " " ) );
        } );
        map.put( "770", function( field ) {
            index.pushField( "dkcclphrase.lff", field.getValue( /a|h|e|f|c|4/, " " ) );
            if ( field.exists( /A/ ) ) {
                index.pushField( "dkcclphrase.lff", field.getValue( /A|h|e|f|c|4/, " " ) );
            }
        } );
        map.put( "780", function( field ) {
            field.eachSubField( /a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /e|c|i|k|j|4/, " " ) );
            } );
        } );
        map.put( "900", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                field.eachSubField( /a|A/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                    if ( field.exists( /H/ ) ) {
                        index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /H|e|f|c/, " " ) );
                    }
                    if ( field.exists( /E/ ) ) {
                        index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|E|f|c/, " " ) );
                    }
                } );
            }
        } );
        map.put( "910", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                field.eachSubField( /A|a/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " ) );
                    if ( field.exists( /E/ ) ) {
                        index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /h|g|E|c|i|k|j/, " " ) );
                    }
                } );
                field.eachSubField( /S|s/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                    if ( field.exists( /E/ ) ) {
                        index.pushField( "dkcclphrase.lff", subField.value + " " + field.getValue( /E|c|i|k|j/, " " ) );
                    }
                } );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLffFields" );
    }

    /**
     * Method that creates ccl lfm index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLfmFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLfmFields
     * @function
     */
    function createDkcclLfmFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLfmFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /o/, function( field, subField ) {
                index.pushField( "dkcclphrase.lfm", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLfmFields" );
    }

    /**
     * Method that creates creator index fields: dkcclphrase.lfo and dkcclphrase.mfo
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLfoFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLfoFields
     * @function
     */
    function createDkcclLfoFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLfoFields" );

        var fieldValue;
        map.put( "100", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                fieldValue = subField.value + " " + field.getValue( /h|e|f|c/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                if ( field.exists( /E/ ) ) {
                    fieldValue =  subField.value + " " + field.getValue( /h|E|f|c/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                }
            } );
        } );
        map.put( "110", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                fieldValue = subField.value + " " + field.getValue( /e|c|i|k|j/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

            } );
        } );
        map.put( "239", function( field ) {
            fieldValue = field.getValue( /a|h|e|f|c/, " " );
            DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

        } );
        map.put( "540", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                DkcclPhraseIndex.pushCreatorIndexFields( index, subField.value , field.name );

            } );
        } );
        map.put( "700", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                fieldValue =  subField.value + " " + field.getValue( /h|e|f|c/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                if ( field.exists( /E/ ) ) {
                    fieldValue =  field.getValue( /a|h|E|f|c/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                }
            } );
        } );
        map.put( "710", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                fieldValue = subField.value + " " + field.getValue( /e|c|i|k|j/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                if ( field.exists( /C/ ) ) {
                    fieldValue =  subField.value + " " + field.getValue( /e|C|i|k|j/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                }
            } );
        } );
        map.put( "720", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                fieldValue = subField.value + " " + field.getValue( /h/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields(index, fieldValue , field.name );

            } );
            field.eachSubField( /k/, function( field, subField ) {
                fieldValue =  subField.value;
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

            } );
        } );
        map.put( "739", function( field ) {
            fieldValue =  field.getValue( /a|h|e|f|c/, " " );
            DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

        } );
        map.put( "770", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                fieldValue = subField.value + " " + field.getValue( /h|e|f|c/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

            } );
        } );
        map.put( "780", function( field ) {
            field.eachSubField( /a|s/, function( field, subField ) {
                fieldValue =  subField.value + " " + field.getValue( /e|c|i|k|j/, " " );
                DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
            } );
        } );
        map.put( "900", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                field.eachSubField( /A|a/, function( field, subField ) {
                    fieldValue =  subField.value + " " + field.getValue( /h|e|f|c/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

                    if ( field.exists( /E/ ) ) {
                        fieldValue = field.getValue( /a|h|E|f|c/, " " );
                        DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

                    }
                } );
            }
        } );
        map.put( "910", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                field.eachSubField( /A|a/, function( field, subField ) {
                    fieldValue = subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );
                } );
                field.eachSubField( /S|s/, function( field, subField ) {
                    fieldValue =  subField.value + " " + field.getValue( /e|c|i|k|j/, " " );
                    DkcclPhraseIndex.pushCreatorIndexFields( index, fieldValue , field.name );

                } );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLfoFields" );
    }

    /**
     * Method that creates ccl lgd index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLgdFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLgdFields
     * @function
     */
    function createDkcclLgdFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLgdFields" );

        map.put( "654", function( field ) {
            index.pushField( "dkcclphrase.lgd", field.getValue( /m|v/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /p|v/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /i|v/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /i|z/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /n|v|z/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /o/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /p|v|z/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /q|v|z/, " " ) );
            index.pushField( "dkcclphrase.lgd", field.getValue( /r|v/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLgdFields" );
    }

    /**
     * Method that creates ccl lht index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLhtFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLhtFields
     * @function
     */
    function createDkcclLhtFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLhtFields" );

        map.put( "239", function( field ) {
            index.pushField( "dkcclphrase.lht", field.getValue( /t|u|v/, " " ) );
        } );
        map.put( "240", function( field ) {
            index.pushField( "dkcclphrase.lht", field.getValue( /a|d|e|f|g|h|n|\u00f8|s/, " " ) );
        } );
        map.put( "243", function( field ) {
            index.pushField( "dkcclphrase.lht", field.getValue( /a|d|h|n|s/, " " ) );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lht", subField.value + " " + field.getValue( /n|o|y|\u00E6|\u00f8|p|q|r|x|u/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLhtFields" );
    }

    /**
     * Method that creates ccl lke index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLkeFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLkeFields
     * @function
     */
    function createDkcclLkeFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLkeFields" );

        map.put( "600", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lke", field.getValue( /a|h|E|f|c/, " " ) );
                }
            } );
            if ( !field.exists( /A|a/ ) ) {
                index.pushField( "dkcclphrase.lke", field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lke", field.getValue( /h|E|f|c/, " " ) );
                }
            }
        } );
        map.put( "610", function( field ) {
            if ( field.exists( /a/ ) ) {
                index.pushField( "dkcclphrase.lke", field.getValue( /a|e|c|i|k|j/, " " ) );
            }
            if ( field.exists( /s/ ) ) {
                index.pushField( "dkcclphrase.lke", field.getValue( /s|e|c|i|k|j/, " " ) );
            }
        } );
        map.put( "620", function( field ) {
            index.pushField( "dkcclphrase.lke", field.getValue( /a|b|c/, " " ) );
        } );
        map.put( "621", function( field ) {
            index.pushField( "dkcclphrase.lke", field.getValue( /a|b|e|f|j/, " " ) );
        } );
        map.put( "630", function( field ) {
            field.eachSubField( /a|b|f|g|s|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "633", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "634", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
            } );
            field.eachSubField( /c/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d/ ) );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d|u/, " " ) );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d|v|x|y|z/, " " ) );
            } );
            field.eachSubField( /u/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
            } );
        } );
        map.put( "645", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
            } );
        } );
        map.put( "650", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "651", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "660", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "661", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
            } );
        } );
        map.put( "662", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
            } );
        } );
        map.put( "666", "667", function( field ) {
            field.eachSubField( /e|f|i|l|m|n|p|q|r|s|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
            } );
        } );
        map.put( "668", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /b|c/, " " ) );
            } );
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );
        map.put( "690", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d/, " " ) );
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( /z/ ).match( /600/ ) ) {
                index.pushField( "dkcclphrase.lke", field.getValue( /a|c|e|f|h/, " " ) );
            }
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( /z/ ).match( /610/ ) ) {
                field.eachSubField( /a/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " ) );
                } );
                field.eachSubField( /s/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                } );
            }
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /a|f|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "933", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
            } );
        } );
        map.put( "934", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /u/, " " ) );
            } );
            field.eachSubField( /c/, function( field, subField ) {
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d|u/, " " ) );
                index.pushField( "dkcclphrase.lke", subField.value + " " + field.getValue( /d/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLkeFields" );
    }

    /**
     * Method that creates ccl lkl index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLklFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLklFields
     * @function
     */
    function createDkcclLklFields( index, map ){

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLklFields" );

        map.put( "087", "088", "089", function( field ){
            field.eachSubField( "a", function( field, subField ){
                index.pushField( "dkcclphrase.lkl", subField.value );
            })
        });

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLklFields" );

    }

    /**
     * Method that creates ccl lkn index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLknFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLknFields
     * @function
     */
    function createDkcclLknFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLknFields" );

        map.put( "033", function( field ) {
            index.pushField( "dkcclphrase.lkn", field.getValue( /a|b/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLknFields" );
    }

    /**
     * Method that creates ccl lko index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLkoFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLkoFields
     * @function
     */
    function createDkcclLkoFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLkoFields" );
        map.put( "110", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
            } );
        } );
        map.put( "710", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                if ( field.exists( /C/ ) ) {
                    index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /e|C|i|k|j/, " " ) );
                }
            } );
        } );
        map.put( "720", function( field ) {
            index.pushField( "dkcclphrase.lko", field.getValue( /k/, " " ) );
        } );
        map.put( "780", function( field ) {
            field.eachSubField( /a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
            } );
        } );
        map.put( "910", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                field.eachSubField( /A|a/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /h|g|e|c|i|k|j/, " " ) );
                    if ( field.exists( /E/ ) ) {
                        index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /h|g|E|c|i|k|j/, " " ) );
                    }
                } );
                field.eachSubField( /S|s/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
                    if ( field.exists( /E/ ) ) {
                        index.pushField( "dkcclphrase.lko", subField.value + " " + field.getValue( /E|c|i|k|j/, " " ) );
                    }
                } );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLkoFields" );
    }

    /**
     * Method that creates ccl lme index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLmeFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLmeFields
     * @function
     */
    function createDkcclLmeFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLmeFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /m|n|p|l/, function( field, subField ) {
                index.pushField( "dkcclphrase.lme", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLmeFields" );
    }


    /**
     * Method that creates cll lmo index fields
     *
     * @type {function}
     * @syntax Dkcclphrase.createDkcclLmoFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register hanlder methods in
     * @name DkcclPhraseIndex.createDkcclLmoFields
     */
    function createDkcclLmoFields( index, map ) {

        Log.trace( 'Entering DkcclPhraseIndex.createDkcclLmoFields' );

        map.put( "039", function( field ) {
            field.eachSubField( "a", function( field, subfield ) {
                var musicCode = subfield.value;
                var musicText = Tables.musicGenre( musicCode );
                if ( undefined !== musicText ) {
                    index.pushField( "dkcclphrase.lmo", musicText );
                }
            } );
        } );

        Log.trace( 'Leaving DkcclPhraseIndex.createDkcclLmoFields' );
    }

    /**
     * Method that creates ccl lms index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLmsFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLmsFields
     * @function
     */
    function createDkcclLmsFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLmsFields" );
        map.put( "600", function( field ) {
            if ( field.getValue( /2/ ) === "MeSH" ) {
                index.pushField( "dkcclphrase.lms", field.getValue( /a|h|e|f|c/, " " ) );
            }
        } );
        map.put( "610", function( field ) {
            if ( field.getValue( /2/ ) === "MeSH" ) {
                if ( field.exists( /a/ ) ) {
                    index.pushField( "dkcclphrase.lms", field.getValue( /a|e|c|i|k|j/, " " ) );
                }
                if ( field.exists( /s/ ) ) {
                    index.pushField( "dkcclphrase.lms", field.getValue( /s|e|c|i|k|j/, " " ) );
                }
            }
        } );
        map.put( "634", function( field ) {
            if ( field.getValue( /2/ ) === "MeSH" ) {
                field.eachSubField( /c/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lms", subField.value + " " + field.getValue( /d|v|x|y|z/, " " ) );
                } );
            }
        } );
        map.put( "645", function( field ) {
            if ( field.getValue( /2/ ) === "MeSH" ) {
                field.eachSubField( /a|c/, function( field, subField ) {
                    index.pushField( "dkcclphrase.lms", subField.value + " " + field.getValue( /v|x|y|z/, " " ) );
                } );
            }
        } );
        map.put( "660", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lms", subField.value + " " + field.getValue( /b|c|d|e|v|x|y|z/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLmsFields" );
    }

    /**
     * Method that creates ccl lnb index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLnbFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLnbFields
     * @function
     */
    function createDkcclLnbFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLnbFields" );

        map.put( "666", function( field ) {
            field.eachSubField( /u/, function( field, subField ) {
                index.pushField( "dkcclphrase.lnb", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLnbFields" );
    }

    /**
     * Method that creates ccl lnt index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLntFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLntFields
     * @function
     */
    function createDkcclLntFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLntFields" );

        map.put( "210", function( field ) {
            index.pushField( "dkcclphrase.lnt", field.getValue( /a|b|c/, " " ) );
        } );
        map.put( "222", function( field ) {
            index.pushField( "dkcclphrase.lnt", field.getValue( /a|b/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLntFields" );
    }

    /**
     * Method that creates ccl lok index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLokFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLokFields
     * @function
     */
    function createDkcclLokFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLokFields" );

        map.put( "652", function( field ) {
            field.eachSubField( /m|o/, function( field, subField ) {
                index.pushField( "dkcclphrase.lok", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLokFields" );
    }

    /**
     * Method that creates ccl lpa index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLpaFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLpaFields
     * @function
     */
    function createDkcclLpaFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLpaFields" );

        map.put( "245", function( field ) {
            field.eachSubField( "p", function( field, subField ) {
                index.pushField( "dkcclphrase.lpa", subField.value + " " + field.getValue( /q|r|s/, " " ) );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( "p", function( field, subField ) {
                index.pushField( "dkcclphrase.lpa", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLpaFields" );
    }

    /**
     * Method that creates ccl lpe index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLpeFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLpeFields
     * @function
     */
    function createDkcclLpeFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLpeFields" );

        map.put( "100", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h|E|f|c/, " " ) );
                }
            } );
        } );
        map.put( "700", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
                if ( field.exists( /E/ ) ) {
                    index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h|E|f|c/, " " ) );
                }
            } );
        } );
        map.put( "720", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h/, " " ) );
            } );
        } );
        map.put( "770", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lpe", subField.value + " " + field.getValue( /h|e|f|c/, " " ) );
            } );
        } );
        map.put( "900", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                index.pushField( "dkcclphrase.lpe", field.getValue( /a|h|e|f|c/, " " ) );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLpeFields" );
    }

    /**
     * Method that creates ccl lpo index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLpoFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLpoFields
     * @function
     */
    function createDkcclLpoFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLpoFields" );

        map.put( "100", function( field ) {
            index.pushField( "dkcclphrase.lpo", field.getValue( /a|h|e|f|c/, " " ) );
        } );
        map.put( "110", function( field ) {
            field.eachSubField( /A|a|s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lpo", subField.value + " " + field.getValue( /e|c|i|k|j/, " " ) );
            } );
        } );
        map.put( "239", function( field ) {
            index.pushField( "dkcclphrase.lpo", field.getValue( /a|h|e|f|c/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLpoFields" );
    }

    /**
     * Method that creates ccl lrt index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLrtFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLrtFields
     * @function
     */
    function createDkcclLrtFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLrtFields" );

        //map.put( /8[67][0-9]/, function( field ) {
        var func = function( field ) {
            index.pushField( "dkcclphrase.lrt", field.getValue( /t|c/, " " ) );
        };
        for ( var i = 860 ; i <= 879 ; i++) {
            map.put(String(i), func);
        }

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLrtFields" );
    }

    /**
     * Method that creates ccl lse index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLseFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLseFields
     * @function
     */
    function createDkcclLseFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLseFields" );

        map.put( "247", function( field ) {
            field.eachSubField( /s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /v|o|n/, " " ) );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /c|v|o|n|\u00f8|\u00E6/, " " ) );
                if ( field.exists( /V/ ) ) {
                    index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /c|V|o|n|\u00f8|\u00E6/, " " ) );
                }
            } );
            field.eachSubField( /p/, function( field, subField ) {
                index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /s|r|q|v|\u00f8|\u00E6/, " " ) );
                if ( field.exists( /V/ ) ) {
                    index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /s|r|q|V|\u00f8|\u00E6/, " " ) );
                }
            } );
        } );
        map.put( "558", function( field ) {
            index.pushField( "dkcclphrase.lse", field.getValue( /s|v/, " " ) );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /v|o|n|\u00f8|\u00E6/, " " ) );
                if ( field.exists( /V/ ) ) {
                    index.pushField( "dkcclphrase.lse", subField.value + " " + field.getValue( /V|o|n|\u00f8|\u00E6/, " " ) );
                }
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLseFields" );

    }

    /**
     * Method that creates ccl lso index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLsoFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLsoFields
     * @function
     */
    function createDkcclLsoFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLsoFields" );

        map.put( "247", function( field ) {
            field.eachSubField( /s/, function( field, subField ) {
                index.pushField( "dkcclphrase.lso", subField.value + " " + field.getValue( /o|n/, " " ) );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lso", subField.value + " " + field.getValue( /c|n|o|p|q|r|s|\u00f8|\u00E6/, " " ) );
            } );
            field.eachSubField( /p/, function( field, subField ) {
                index.pushField( "dkcclphrase.lso", subField.value + " " + field.getValue( /s|r|q|\u00f8|\u00E6/, " " ) );
            } );
        } );
        map.put( "558", function( field ) {
            index.pushField( "dkcclphrase.lso", field.getValue( /s/, " " ) );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lso", subField.value + " " + field.getValue( /o|n|\u00f8|\u00E6/, " " ) );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLsoFields" );
    }

    /**
     * Method that creates ccl lst index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLstFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLstFields
     * @function
     */
    function createDkcclLstFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLstFields" );

        map.put( "861", function( field ) {
            index.pushField( "dkcclphrase.lst", field.getValue( /t|c/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLstFields" );
    }

    /**
     * Method that creates title index fields. (i.e. dkcclphrase.mti and dkcclphrase.lti)
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLtiFields( index, map )
     * @param {Index} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLtiFields
     * @function
     */
    function createDkcclLtiFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLtiFields" );

        var titleValue;

        map.put( "210", function( field ) {
            titleValue =  field.getValue( /a|b|c/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "222", function( field ) {
            titleValue = field.getValue( /a|b/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "239", function( field ) {
            titleValue = field.getValue( /t|u|v|b|\u00f8/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            titleValue = field.getValue( /u|\u00f8/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            titleValue =  field.getValue( /v|\u00f8/, " " )  ;
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "240", function( field ) {
            titleValue = field.getValue(  /a|d|e|f|g|h|n|o|s|\u00f8/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            field.eachSubField( /s/, function( field, subField ) {
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "241", function( field ) {
            titleValue = field.getValue( /a|\u00f8|o|n/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "242", function( field ) {
            titleValue =  field.getValue( /a|c|n|o/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "243", function( field ) {
            titleValue =  field.getValue( /a|d|h|n|j|s/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            titleValue =  field.getValue( /s/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /b|\u00E6|\u00f8|c|n|o|y/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );

            field.eachSubField( /P|p/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /q|r|s/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /U|u/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /x/, function( field, subField ) {
                titleValue =  subField.value + " " + field.getValue( /b|c/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /c/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /p/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /s/, function( field, subField ) {
                titleValue =  subField.value + " " + field.getValue( /o|n/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /x/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /c|o|n|\u00f8|\u00E6/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /p/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /s|r|q|\u00f8|\u00E6/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "512", "520", "526", "530", "534", function( field ) {
            field.eachSubField( /t|x/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
       map.put( "700", function( field ) {
            field.eachSubField( /t|j|d|p|l|n|o/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
                titleValue = field.getValue('o',' ');
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "710", function( field ) {
            field.eachSubField( /t|f|d|p|l|n|o/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
                titleValue = field.getValue('o',' ');
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "739", function( field ) {
            titleValue = field.getValue( /t|u|v|b|\u00f8/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            field.eachSubField( /u|v/, function( field, subField ) {
                titleValue =  field.getValue( '\u00f8', " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "740", function( field ) {
            titleValue =  field.getValue( /a|f|g|\u00f8|s|d|e|h|n|o/, " "  );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            field.eachSubField( /s/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "745", function( field ) {
            field.eachSubField( /A|a/, function( field, subField ) {
                titleValue = subField.value + " " + field.getValue( /b|o|n|\u00f8/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "795", function( field ) {
            DkcclPhraseIndex.collectBySequence( index, field, /[Aabc\u00E6\u00f8uv]/, /[aA]/ );
            field.eachSubField( /u|v/, function( field, subField ) {
                titleValue = subField.value;
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
            field.eachSubField( /p/, function( field, subField ) {
                titleValue =  subField.value + " " + field.getValue( /q|r|s/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            } );
        } );
        map.put( "840", function( field ) {
            titleValue = field.getValue( /a|o|n|\u00f8|\u00E6/, " " );
            DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );

        } );
        map.put( "945", function( field ) {
            if ( !field.getValue( /z/ ).match( /^6/ ) ) {
                titleValue =  field.getValue( /a|o|n/, " " );
                DkcclPhraseIndex.pushTitleIndexFields( index, titleValue, field.name );
            }
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLtiFields" );
    }

    /**
     * Method that creates ccl lts index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLtsFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLtsFields
     * @function
     */
    function createDkcclLtsFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLtsFields" );

        map.put( "300", function( field ) {
            field.eachSubField( /e/, function( field, subField ) {
                index.pushField( "dkcclphrase.lts", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLtsFields" );
    }

    /**
     * Method that creates ccl ltt index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLttFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLttFields
     * @function
     */
    function createDkcclLttFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLttFields" );

        map.put( "860", function( field ) {
            index.pushField( "dkcclphrase.ltt", field.getValue( /t|c/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLttFields" );
    }

    /**
     * Method that creates ccl luk index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLukFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLukFields
     * @function
     */
    function createDkcclLukFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLukFields" );

        map.put( "631", function( field ) {
            field.eachSubField( /a|b|f|g|s|t/, function( field, subField ) {
                index.pushField( "dkcclphrase.luk", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLukFields" );
    }

    /**
     * Method that creates ccl lut index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLutFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLutFields
     * @function
     */
    function createDkcclLutFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLutFields" );

        map.put( "239", function( field ) {
            index.pushField( "dkcclphrase.lut", field.getValue( /t|u|v|b/, " " ) );
        } );
        map.put( "240", function( field ) {
            index.pushField( "dkcclphrase.lut", field.getValue( /a|d|e|f|g|h|n|o|s|\u00f8/, " " ) );
        } );
        map.put( "243", function( field ) {
            DkcclPhraseIndex.pushExtraIndexFields( index, "dkcclphrase.lut", field.getValue( /a|d|h|n|j|s/, " " ) );
        } );
        map.put( "739", function( field ) {
            index.pushField( "dkcclphrase.lut", field.getValue( /t|u|v|b/, " " ) );
        } );
        map.put( "740", function( field ) {
            index.pushField( "dkcclphrase.lut", field.getValue( /a|d|e|f|g|h|n|o|q|r|s|\u00f8/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLutFields" );
    }

    /**
     * Method that creates ccl lvp index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLvpFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLvpFields
     * @function
     */
    function createDkcclLvpFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLvpFields" );

        map.put( "557", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lvp", subField.value + " " + field.getValue( /v|\u00E6|\u00f8|j/, " " ) );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lvp", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLvpFields" );
    }

    /**
     * Method that creates ccl lvx index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclLvxFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclLvxFields
     * @function
     */
    function createDkcclLvxFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclLvxFields" );

        map.put( "557", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclphrase.lvx", subField.value + " " + field.getValue( /\u00E6|\u00f8/, " " ) );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /a/, function( field, subField ) {
                index.pushField( "dkcclphrase.lvx", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclLvxFields" );
    }

    /**
     * Method that creates ccl nal index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclNalFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclNalFields
     * @function
     */
    function createDkcclNalFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclNalFields" );

        map.put( "070", function( field ) {
            index.pushField( "dkcclphrase.nal", field.getValue( /a/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclNalFields" );
    }

    /**
     * Method that creates ccl nlm index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclNlmFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclNlmFields
     * @function
     */
    function createDkcclNlmFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclNlmFields" );

        map.put( "060", function( field ) {
            index.pushField( "dkcclphrase.nlm", field.getValue( "a", " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclNlmFields" );
    }

    /**
     * Method that creates ccl udk index fields.
     *
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.createDkcclUdkFields( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclPhraseIndex.createDkcclUdkFields
     * @function
     */
    function createDkcclUdkFields( index, map ) {

        Log.trace( "Entering DkcclPhraseIndex.createDkcclUdkFields" );

        map.put( "080", function( field ) {
            index.pushField( "dkcclphrase.udk", field.getValue( /a|x/, " " ) );
        } );

        Log.trace( "Leaving DkcclPhraseIndex.createDkcclUdkFields" );
    }

    /**
     * Method that creates new indexFields without stopwords.
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.pushExtraIndexFields( index, fieldName, value, [origin] )
     * @param {Object} index Array of index objects with a name and a value
     * @param {String} fieldName a string with the name of the index that is added
     * @param {String} value of input marc field
     * @param {String} [origin] the field name (obligatory for creating field dkcclphrase.mti)
     * @return {Object} Modified index
     * @name DkcclPhraseIndex.pushExtraIndexFields
     * @function
     */
    function pushExtraIndexFields( index, fieldName, value, origin ) {

        Log.trace( "Entering DkcclPhraseIndex.pushExtraIndexFields" );

        var __pushExtraIndex = function( value ){
            value = value.trim();
            if( "" !== value ) {
                if ( fieldName === "dkcclphrase.mti" ) {
                    if ( origin === undefined ) {
                        Log.error( "Undefined original marc field, not possible to create dkcclphrase.mti" );
                        return index;
                    } else {
                        value = value + " #" + origin;
                    }
                }
                index.pushField( fieldName, value );
            }
        };

       if ( value === undefined ) {
           Log.error( "Undefined value found in field: ", fieldName );
           return index;
       }
        __pushExtraIndex( value );
       if ( value.match( /\u00a4/ ) ) {
            __pushExtraIndex( value.replace( /.* ?\u00a4 ?/, "" ));
        } else if ( value.match( /^de |^den |^det |^en |^et |^the |^a |^an |^le |^la |^les |^las |^l'|^der |^die |^das /i ) ) {
            __pushExtraIndex( value.replace( /^den |^det |^de |^en |^et |^the |^a |^an |^le |^la |^les |^las |^l'|^der |^die |^das /i, "" ));
        }

        Log.trace( "Leaving DkcclPhraseIndex.pushExtraIndexFields" );

        return index;
    }

    /**
     * Method that creates new indexFields dkcclphrase.lti and dkcclphrase.mti for title
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.pushTitleIndexFields( index, value, origin )
     * @param {Index} index Array of index objects with a name and a value
     * @param {String} value the field value
     * @param {String} [origin] the field name (obligatory for creating field dkcclphrase.mti)
     * @return {Index} Modified index
     * @name DkcclPhraseIndex.pushTitleIndexFields
     * @function
     */
    function pushTitleIndexFields( index, value, origin ) {

        Log.trace( "Entering DkcclPhraseIndex.pushTitleIndexFields" );

        if ( undefined === value ) {
            Log.error( "Field value given to DkcclPhraseIndex.pushCreatorIndexFields was undefined. Could not create lti/mti index fields" );
            return index;
        }
        Log.debug( "value.pushTitleIndexFields", value + " " );

        if ( "" !== value.trim( ) ) {
            DkcclPhraseIndex.pushExtraIndexFields( index, "dkcclphrase.lti", value );
            DkcclPhraseIndex.pushExtraIndexFields( index, "dkcclphrase.mti", value, origin );
        }

        Log.trace( "Leaving DkcclPhraseIndex.pushTitleIndexFields" );

        return index;
    }

    /**
     * Method that adds index fields dkcclphrase.mfo and dkcclphrase.lfo with creators
     *
     * @type { method }
     * @syntax DkcclPhraseIndex.pushCreatorIndexFields( index, value, marcFieldName )
     * @param {Index} index object that is to be updated with the new fields
     * @param {String} value with creator informationcd ..
     * @param {String} marcFieldName
     * @return {Index} index object that is updated with the new fields
     * @name DkcclPhraseIndex.pushCreatorIndexFields
     * @function
     */
    function pushCreatorIndexFields( index, value, marcFieldName ) {

        Log.trace( "Entering DkcclPhraseIndex.pushCreatorIndexFields" );

        if ( undefined === value ) {
            Log.error( "Field value given to DkcclPhraseIndex.pushCreatorIndexFields was undefined. Could not create lfo/mfo index fields" );
            return index;
        }

        if ( "" !== value.trim() ) {
            index.pushField( "dkcclphrase.lfo", value );

            if ( marcFieldName === undefined ) {
                Log.warn( "Undefined marcFieldName, not possible to create dkcclphrase.mfo" );
            } else {
                index.pushField( "dkcclphrase.mfo", value.trim() + " #" + marcFieldName );
            }
        }

        Log.trace( "Leaving DkcclPhraseIndex.pushCreatorIndexFields" );

        return index;

    }

    /**
    * Method that checks if an item is contained in an array.
    *
    * @function
    * @syntax DkcclPhraseIndex.inArr( arr, obj )
    * @param {Array} arr Array to check
    * @param {Object} obj Object to look for
    * @return {Number} returns -1 if none is found, or the index of item matching your criteria
    * @example ( arr, obj )
    * @name DkcclPhraseIndex.inArr( [ 'a', 'A', 'c'], 'A' )
    */

    function inArr( arr, obj ) {
        return ( arr.indexOf( obj ) );
    }

    /**
     * Method that collects a sequence of subfields starting a new sequence on specified subfields.
     * If the start subfield also can be an upper case letter then the sequence is output both with
     * the lower case subfield and the upper case subfield.
     *
     * @type {function}
     * @syntax DkcclPhraseIndex.collectBySequence( index, field, regExSubFields, newSequenceSubFields )
     * @param {Object[]} index Array of index objects with a name and a value
     * @param {Field} field of marc object type
     * @param {RegExp} regExSubFields regular expression defining the subfields to collect in one sequence
     * @param {RegExp} regExNewSequence regular expression defining the sequence to match
     * @return {Object[]} modified index
     * @name DkcclPhraseIndex.collectBySequence
     * @example DkcclPhraseIndex.collectBySequence( index, field, /[Aabcuv]/, /[aA]/ );
     * @function
     */
    function collectBySequence( index, field, regExSubFields, regExNewSequence ) {

        var collectedValue= "";
        var dataFromSubfieldLower = "";
        var dataFromSubfieldUpper = "";
        var regExLower = /[0-9&a-z\u00e6\u00f8\u00e5]/;

        var __emitToIndex = function () {
            if ( "" !== dataFromSubfieldLower ) {
                DkcclPhraseIndex.pushTitleIndexFields( index, dataFromSubfieldLower + collectedValue, field.name );
            }
            if ( "" !== dataFromSubfieldUpper ) {
                DkcclPhraseIndex.pushTitleIndexFields( index, dataFromSubfieldUpper + collectedValue, field.name );
            }
        };

        // if recExNewSequence is /[aA]/ stop on each "a" or "A" and output the sequence
        // stop before next a or A
        field.eachSubField( regExSubFields, function( field, subField ) {
            if ( ( subField.name.match( regExNewSequence ) ) && ( collectedValue !== "" || dataFromSubfieldLower !== "" )) {
                // emit pending data
                __emitToIndex( );
                // start new sequence
                collectedValue = "";
                dataFromSubfieldLower = "";
                dataFromSubfieldUpper = "";

                if ( subField.name.match( regExNewSequence ) ) {
                    if ( subField.name.match( regExLower ) ) {
                        dataFromSubfieldLower = subField.value;
                    } else {
                        dataFromSubfieldUpper = subField.value;
                    }
                }
            } else {
                // this will happen if the previous subfield was A
                // and the first time

                if ( subField.name.match( regExNewSequence ) ) {
                    if ( subField.name.match( regExLower ) ) {
                        dataFromSubfieldLower = subField.value;
                    } else {
                        dataFromSubfieldUpper = subField.value;
                    }
                } else {
                    // collect all other data from subfield, allways leading space because it is added to a-subfields data and A-subfields data
                    collectedValue += " " + subField.value;
                }
            }
        } );
        // any pending data?
        __emitToIndex( );
        return index;
    }

    //return that;

    return {
        createDkcclPhraseFields: createDkcclPhraseFields,
        callIndexMethod: callIndexMethod,
        createDkcclBcmFields: createDkcclBcmFields,
        createDkcclDbkFields: createDkcclDbkFields,
        createDkcclDdcFields: createDkcclDdcFields,
        createDkcclLacFields: createDkcclLacFields,
        createDkcclLagFields: createDkcclLagFields,
        createDkcclLauFields: createDkcclLauFields,
        createDkcclLbrFields: createDkcclLbrFields,
        createDkcclLccFields: createDkcclLccFields,
        createDkcclLclFields: createDkcclLclFields,
        createDkcclLcpFields: createDkcclLcpFields,
        createDkcclLdbFields: createDkcclLdbFields,
        createDkcclLdfFields: createDkcclLdfFields,
        createDkcclLdkFields: createDkcclLdkFields,
        createDkcclLdsFields: createDkcclLdsFields,
        createDkcclLedFields: createDkcclLedFields,
        createDkcclLefFields: createDkcclLefFields,
        createDkcclLekFields: createDkcclLekFields,
        createDkcclLemFields: createDkcclLemFields,
        createDkcclLepFields: createDkcclLepFields,
        createDkcclLesFields: createDkcclLesFields,
        createDkcclLffFields: createDkcclLffFields,
        createDkcclLfmFields: createDkcclLfmFields,
        createDkcclLfoFields: createDkcclLfoFields,
        createDkcclLgdFields: createDkcclLgdFields,
        createDkcclLhtFields: createDkcclLhtFields,
        createDkcclLkeFields: createDkcclLkeFields,
        createDkcclLklFields: createDkcclLklFields,
        createDkcclLknFields: createDkcclLknFields,
        createDkcclLkoFields: createDkcclLkoFields,
        createDkcclLmeFields: createDkcclLmeFields,
        createDkcclLmoFields: createDkcclLmoFields,
        createDkcclLmsFields: createDkcclLmsFields,
        createDkcclLnbFields: createDkcclLnbFields,
        createDkcclLntFields: createDkcclLntFields,
        createDkcclLokFields: createDkcclLokFields,
        createDkcclLpaFields: createDkcclLpaFields,
        createDkcclLpeFields: createDkcclLpeFields,
        createDkcclLpoFields: createDkcclLpoFields,
        createDkcclLrtFields: createDkcclLrtFields,
        createDkcclLseFields: createDkcclLseFields,
        createDkcclLsoFields: createDkcclLsoFields,
        createDkcclLstFields: createDkcclLstFields,
        createDkcclLtiFields: createDkcclLtiFields,
        createDkcclLtsFields: createDkcclLtsFields,
        createDkcclLttFields: createDkcclLttFields,
        createDkcclLukFields: createDkcclLukFields,
        createDkcclLutFields: createDkcclLutFields,
        createDkcclLvpFields: createDkcclLvpFields,
        createDkcclLvxFields: createDkcclLvxFields,
        createDkcclNalFields: createDkcclNalFields,
        createDkcclNlmFields: createDkcclNlmFields,
        createDkcclUdkFields: createDkcclUdkFields,
        pushExtraIndexFields: pushExtraIndexFields,
        pushTitleIndexFields: pushTitleIndexFields,
        pushCreatorIndexFields: pushCreatorIndexFields,
        inArr: inArr,
        collectBySequence: collectBySequence
    };

}( );

