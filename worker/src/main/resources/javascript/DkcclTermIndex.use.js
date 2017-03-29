use( "DkcclTermMa" );
use( "Log" );
use( "Marc" );


EXPORTED_SYMBOLS = [ 'DkcclTermIndex' ];

/**
 * Module with functions that create ccl term indexes from marc record object.
 *
 * Contains functions to create ccl term indexes for danMARC2 records (as
 * defined in Praksisregler)
 *
 * @type {namespace}
 * @namespace
 * @name DkcclTermIndex
 */
var DkcclTermIndex = function() {

    var that = {};


    /**
     * Method that creates dkcclterm index fields.
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclTermFields( index, record )
     * @param {Object} index the index to add fields to
     * @param {Record} record The record from which to create the index fields
     * @return {Object} Index with added fields
     * @example DkcclTermIndex.createDkcclTermFields( index, record )
     * @name DkcclTermIndex.createDkcclTermFields
     * @method
     */
    that.createDkcclTermFields = function( index, record ) {

        Log.trace( "Entering: DkcclTermIndex.createDkcclTermFields method" );

        var map = new MatchMap();
        DkcclTermIndex.createDkcclFieldsAc( index, map );
        DkcclTermIndex.createDkcclFieldsAg( index, map );
        DkcclTermIndex.createDkcclFieldsAj( index, map );
        DkcclTermIndex.createDkcclFieldsAr( index, map );
        DkcclTermIndex.createDkcclFieldsAu( index, map );
        DkcclTermIndex.createDkcclFieldsAar( index, map );
        DkcclTermIndex.createDkcclFieldsBc( index, map );
        DkcclTermIndex.createDkcclFieldsBr( index, map );
        DkcclTermIndex.createDkcclFieldsBs( index, map );
        DkcclTermIndex.createDkcclFieldsCl( index, map );
        DkcclTermIndex.createDkcclFieldsCo( index, map );
        DkcclTermIndex.createDkcclFieldsCp( index, map );
        DkcclTermIndex.createDkcclFieldsDb( index, map );
        DkcclTermIndex.createDkcclFieldsDf( index, map );
        DkcclTermIndex.createDkcclFieldsDk( index, map );
        DkcclTermIndex.createDkcclFieldsDs( index, map );
        DkcclTermIndex.createDkcclFieldsEd( index, map );
        DkcclTermIndex.createDkcclFieldsEf( index, map );
        DkcclTermIndex.createDkcclFieldsEj( index, map );
        DkcclTermIndex.createDkcclFieldsEk( index, map );
        DkcclTermIndex.createDkcclFieldsEm( index, map, "dkcclterm.em" );
        DkcclTermIndex.createDkcclFieldsEn( index, map );
        DkcclTermIndex.createDkcclFieldsEp( index, map );
        DkcclTermIndex.createDkcclFieldsEs( index, map );
        DkcclTermIndex.createDkcclFieldsFb( index, map );
        DkcclTermIndex.createDkcclFieldsFg( index, map );
        DkcclTermIndex.createDkcclFieldsFl( index, map );
        DkcclTermIndex.createDkcclFieldsFm( index, map );
        DkcclTermIndex.createDkcclFieldsFo( index, map, "dkcclterm.fo" );
        DkcclTermIndex.createDkcclFieldsFv( index, map );
        DkcclTermIndex.createDkcclFieldsGd( index, map );
        DkcclTermIndex.createDkcclFieldsHm( index, map );
        DkcclTermIndex.createDkcclFieldsHt( index, map );
        DkcclTermIndex.createDkcclFieldsIb( index, map );
        DkcclTermIndex.createDkcclFieldsIc( index, map );
        DkcclTermIndex.createDkcclFieldsId( index, map );
        DkcclTermIndex.createDkcclFieldsIm( index, map );
        DkcclTermIndex.createDkcclFieldsIn( index, map );
        DkcclTermIndex.createDkcclFieldsIp( index, map );
        DkcclTermIndex.createDkcclFieldsIr( index, map );
        DkcclTermIndex.createDkcclFieldsIs( index, map );
        DkcclTermIndex.createDkcclFieldsIx( index, map );
        DkcclTermIndex.createDkcclFieldsKa( index, map );
        DkcclTermIndex.createDkcclFieldsKe( index, map );
        DkcclTermIndex.createDkcclFieldsKg( index, map );
        DkcclTermIndex.createDkcclFieldsKk( index, map );
        DkcclTermIndex.createDkcclFieldsKl( index, map );
        DkcclTermIndex.createDkcclFieldsKm( index, map );
        DkcclTermIndex.createDkcclFieldsKn( index, map );
        DkcclTermIndex.createDkcclFieldsKo( index, map );
        DkcclTermIndex.createDkcclFieldsKr( index, map );
        DkcclTermIndex.createDkcclFieldsKx( index, map );
        DkcclTermIndex.createDkcclFieldsLd( index, map );
        DkcclTermIndex.createDkcclFieldsLi( index, map );
        DkcclTermIndex.createDkcclFieldsLl( index, map );
        DkcclTermIndex.createDkcclFieldsLn( index, map );
        DkcclTermIndex.createDkcclFieldsMe( index, map );
        DkcclTermIndex.createDkcclFieldsMo( index, map );
        DkcclTermIndex.createDkcclFieldsMs( index, map );
        DkcclTermIndex.createDkcclFieldsNb( index, map );
        DkcclTermIndex.createDkcclFieldsNl( index, map );
        DkcclTermIndex.createDkcclFieldsNo( index, map );
        DkcclTermIndex.createDkcclFieldsNr( index, map );
        DkcclTermIndex.createDkcclFieldsNs( index, map );
        DkcclTermIndex.createDkcclFieldsNt( index, map );
        DkcclTermIndex.createDkcclFieldsNv( index, map );
        DkcclTermIndex.createDkcclFieldsOc( index, map );
        DkcclTermIndex.createDkcclFieldsOk( index, map );
        DkcclTermIndex.createDkcclFieldsOp( index, map );
        DkcclTermIndex.createDkcclFieldsOu( index, map );
        DkcclTermIndex.createDkcclFieldsPa( index, map );
        DkcclTermIndex.createDkcclFieldsPe( index, map );
        DkcclTermIndex.createDkcclFieldsPo( index, map, "dkcclterm.po" );
        DkcclTermIndex.createDkcclFieldsPu( index, map );
        DkcclTermIndex.createDkcclFieldsRt( index, map );
        DkcclTermIndex.createDkcclFieldsSe( index, map );
        DkcclTermIndex.createDkcclFieldsSf( index, map );
        DkcclTermIndex.createDkcclFieldsSo( index, map );
        DkcclTermIndex.createDkcclFieldsSp( index, map );
        DkcclTermIndex.createDkcclFieldsSt( index, map );
        DkcclTermIndex.createDkcclFieldsTf( index, map );
        DkcclTermIndex.createDkcclFieldsTg( index, map );
        DkcclTermIndex.createDkcclFieldsTi( index, map, "dkcclterm.ti" );
        DkcclTermIndex.createDkcclFieldsTs( index, map );
        DkcclTermIndex.createDkcclFieldsTt( index, map );
        DkcclTermIndex.createDkcclFieldsUl( index, map );
        DkcclTermIndex.createDkcclFieldsUk( index, map );
        DkcclTermIndex.createDkcclFieldsUt( index, map );
        DkcclTermIndex.createDkcclFieldsUu( index, map );
        DkcclTermIndex.createDkcclFieldsVp( index, map );
        DkcclTermIndex.createDkcclFieldsWw( index, map );
        record.eachFieldMap( map );

        // Can not be optimized like other methods because it needs direct access to record
        DkcclTermMa.createDkcclFieldsMa( index, record );

        Log.trace( "Leaving: DkcclTermIndex.createDkcclTermFields method" );
        return index;
    };

    /**
     * Create a MatchMap, add mapping functions from a specific index method and build the index from a record.
     *
     * To be used from other index modules that need to call specific methods in this module.
     * Also used when unit testing individual index methods.
     * This method bypasses the optimization above to provide only the fields handled by the specified method.
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.callIndexMethod( func, index, record, fieldName )
     * @param {Function} func the index method to call
     * @param {Object} index the index to add fields to
     * @param {Record} record The record from which to create the index fields
     * @param {String|undefined} fieldName Optional fieldname parameter to pass to index method that requires it
     * @return {Object} Index with added fields
     * @name DkcclTermIndex.callIndexMethod
     * @method
     */
    that.callIndexMethod = function( func, index, record, fieldName ) {
        var map = new MatchMap();
        func( index, map, fieldName );
        record.eachFieldMap( map );
        return index;
    };

    /**
     * Method that creates ccl term index fields (ac).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAc( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAc
     * @method
     */
    that.createDkcclFieldsAc = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAc" );

        map.put( "662", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.ac", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAc" );
    };


    /**
     * Method that creates ccl term index fields (ag).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAg( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAg
     * @method
     */
    that.createDkcclFieldsAg = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAg" );

        map.put( "600", function( field ) {
            if ( field.getValue( "2" ) === "NAL" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                        index.pushField( "dkcclterm.ag", subField.value );
                    }
                } );
            }
        } );
        map.put( "610", function( field ) {
            if ( field.getValue( "2" ) === "NAL" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                        index.pushField( "dkcclterm.ag", subField.value );
                    }
                } );
            }
        } );
        map.put( "634", function( field ) {
            if ( field.getValue( "2" ) === "NAL" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( String( subField.name ).match( /c|d|v|x|y|z/ ) ) {
                        index.pushField( "dkcclterm.ag", subField.value );
                    }
                } );
            }
        } );
        map.put( "645", function( field ) {
            if ( field.getValue( "2" ) === "NAL" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( String( subField.name ).match( /a|c|v|x|y|z/ ) ) {
                        index.pushField( "dkcclterm.ag", subField.value );
                    }
                } );
            }
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ag", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAg" );
    };


    /**
     * Method that creates ccl term index fields (aj).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAj( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAj
     * @method
     */
    that.createDkcclFieldsAj = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAj" );

        map.put( "001", function( field ) {
            field.eachSubField( "c", function( field, subField ) {
                index.pushField( "dkcclterm.aj", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAj" );
    };


    /**
     * Method that creates ccl term index fields (ar).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAr( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAr
     * @method
     */
    that.createDkcclFieldsAr = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAr" );

        map.put( "006", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ar", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAr" );
    };


    /**
     * Method that creates ccl term index fields (au).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAu( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAu
     * @method
     */
    that.createDkcclFieldsAu = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAu" );

        map.put( "652", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t/, function( field, subField ) {
                index.pushField( "dkcclterm.au", subField.value );
            } );
        } );
        map.put( "654", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t/, function( field, subField ) {
                index.pushField( "dkcclterm.au", subField.value );
            } );
        } );
        map.put( "655", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t/, function( field, subField ) {
                index.pushField( "dkcclterm.au", subField.value );
            } );
        } );
        map.put( "952", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.au", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAu" );
    };


    /**
     * Method that creates ccl term index fields (\u00e5r).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsAar( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsAar
     * @method
     */
    that.createDkcclFieldsAar = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsAar" );

        var __pushYears = function( fieldValue ){
            if (/^\d{4}(-\d{4})?$/.test( fieldValue )){
                index.pushField( "dkcclterm.\u00e5r", fieldValue );
            } else {

                var yearMatch = fieldValue.match(/(^| |c)\d{4}([^\d]|$)/g);
                if( yearMatch ) {
                    for ( var i = 0; i < yearMatch.length; i++ ) {
                        var year = yearMatch[ i ].replace(/[^\d]/g,"");
                        year = year.trim();
                        index.pushField( "dkcclterm.\u00e5r", year);
                    }
                }

            }

        };

        map.put( "008", function( field ) {
            field.eachSubField( /a|z/, function( field, subField ) {
                __pushYears( subField.value )
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( "j", function( field, subField ) {
                __pushYears( subField.value )
            } );
        } );
        map.put("248", function( field ){
            field.eachSubField("j", function( field, subField ) {
                __pushYears( subField.value )
            } );
        } );
        map.put( "260", function( field ) {
            field.eachSubField( /c|j/, function( field, subField ) {
                __pushYears( subField.value )
            } );
        } );
        map.put( "521", function( field ) {
            field.eachSubField( "c", function( field, subField ) {
                __pushYears( subField.value )
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsAar" );
    };


    /**
     * Method that creates ccl term index fields (bc).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsBc( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsBc
     * @method
     */
    that.createDkcclFieldsBc = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsBc" );

        map.put( "023", function( field ) {
            field.eachSubField( /a|b|x/, function( field, subField ) {
                index.pushField( "dkcclterm.bc", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsBc" );
    };

    /**
     *
     * Method that creates ccl term index fields (br)
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsBr( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsBr
     * @method
     */
    that.createDkcclFieldsBr = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsBr" );

        map.put( "021", function( field ) {
            field.eachSubField( 'b', function( field, subField ) {
                var brugsRetMatch = subField.value.match( /brugsretskategori: ([A-E]\+?)/i );
                if ( brugsRetMatch ) {
                    index.pushField( "dkcclterm.br", brugsRetMatch[ 1 ].toLowerCase() );
                }
            } );
        } );

        var fieldCodeToMnemoCodeTable =  {
            "a": "ou",
            "b": "od",
            "c": "oi"
        };
        map.put( "008", function( field ) {
            var field008nCode = field.subfield( "n" ).value;
            var m07 = fieldCodeToMnemoCodeTable[ field008nCode ];
            if ( m07 ) {
                index.pushField( "dkcclterm.br", m07 );
            }
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsBr" );
    };

    /**
     * Method that creates ccl term index fields (bs).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsBs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsBs
     * @method
     */
    that.createDkcclFieldsBs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsBs" );

        map.put( "038", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.bs", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsBs" );
    };

    /**
     * Method that creates ccl term index fields (cl).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsCl(( index, map ))
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsCl
     * @method
     */
    that.createDkcclFieldsCl = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsCl" );

        map.put( "050", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "060", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "070", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "079", function( field ) {
            field.eachSubField( /a|c/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );

        map.put( "080", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "082", function( field ) {
            field.eachSubField( /a|b|d/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        /**
         * values from dkcclterm.kl er copied over in solr-indexer-config/config/schema.xml
         * i.e. fields 087 a-z, 088 a-z and 089 a-z
         */
        map.put( "652", function( field ) {
            field.eachSubField( /i|m|n|o|p|q|r/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "654", function( field ) {
            field.eachSubField( /i|m|n|o|p|q|r/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );
        map.put( "655", function( field ) {
            field.eachSubField( /i|m|p/, function( field, subField ) {
                index.pushField( "dkcclterm.cl", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsCl" );
    };

    /**
     * Method that creates ccl term index fields (co).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsCo( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsCo
     * @method
     */
    that.createDkcclFieldsCo = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsCo" );

        map.put( "030", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.co", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsCo" );
    };

    /**
     * Method that creates ccl term index fields (cp).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsCp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsCp
     * @method
     */
    that.createDkcclFieldsCp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsCp" );

        map.put( "690", function( field ) {
            field.eachSubField( /a|b|d/, function( field, subField ) {
                index.pushField( "dkcclterm.cp", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsCp" );
    };


    /**
     * Method that creates ccl term index fields (db).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsDb( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsDb
     * @method
     */
    that.createDkcclFieldsDb = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsDb" );

        map.put( "666", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.db", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsDb" );
    };

    /**
     * Method that creates ccl term index fields (df).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsDf( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsDf
     * @method
     */
    that.createDkcclFieldsDf = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsDf" );

        map.put( "666", function( field ) {
            field.eachSubField( /e|f|t/, function( field, subField ) {
                index.pushField( "dkcclterm.df", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsDf" );
    };


    /**
     * Method that creates ccl term index fields (dk).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsDk( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsDk
     * @method
     */
    that.createDkcclFieldsDk = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsDk" );

        map.put( "652", function( field ) {
            field.eachSubField( /i|m|n|o|p|q|r/, function( field, subField ) {
                index.pushField( "dkcclterm.dk", subField.value );
            } );
        } );
        map.put( "655", function( field ) {
            field.eachSubField( /i|m|p/, function( field, subField ) {
                index.pushField( "dkcclterm.dk", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsDk" );
    };


    /**
     * Method that creates ccl term index fields (ds).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsDs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsDs
     * @method
     */
    that.createDkcclFieldsDs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsDs" );

        map.put( "666", function( field ) {
            field.eachSubField( /s|r|q/, function( field, subField ) {
                index.pushField( "dkcclterm.ds", subField.value );
            } );
        } );
        map.put( "668", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.ds", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsDs" );
    };

    /**
     * Method that creates ccl term index fields (ed).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEd( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEd
     * @method
     */
    that.createDkcclFieldsEd = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEd" );

        map.put( "661", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( "dkcclterm.ed", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEd" );
    };

    /**
     * Method that creates ccl term index fields (ef).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEf( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEf
     * @method
     */
    that.createDkcclFieldsEf = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEf" );

        map.put( "630", function( field ) {
            field.eachSubField( /f|g/, function( field, subField ) {
                index.pushField( "dkcclterm.ef", subField.value );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /e|f|t/, function( field, subField ) {
                index.pushField( "dkcclterm.ef", subField.value );
            } );
        } );
        map.put( "930", function( field ) {
            field.eachSubField( "f", function( field, subField ) {
                index.pushField( "dkcclterm.ef", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEf" );
    };


    /**
     * Method that creates ccl term index fields (ej).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEj( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEj
     * @method
     */
    that.createDkcclFieldsEj = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEj" );

        map.put( "996", function( field ) {
            field.eachSubField( /a|m|o/, function( field, subField ) {
                index.pushField( "dkcclterm.ej", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEj" );
    };


    /**
     * Method that creates ccl term index fields (ek).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEk( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEk
     * @method
     */
    that.createDkcclFieldsEk = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEk" );

        map.put( "610", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( "dkcclterm.ek", subField.value );
                }
            } );
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( "z" ) === "610" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|g|h|i|j|k|s/ ) ) {
                        index.pushField( "dkcclterm.ek", subField.value );
                    }
                } );
            }
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEk" );
    };


    /**
     * Method that creates ccl term index dkcclterm.em fields.
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEm( index, map, indexName )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {String} indexName a string with the name of the index to add fields to
     * @name DkcclTermIndex.createDkcclFieldsEm
     * @method
     */
    that.createDkcclFieldsEm = function( index, map, indexName ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEm" );

        map.put( "600", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "610", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "620", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "621", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "630", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "631", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "633", function( field ) {
            field.eachSubField( /a|u|A/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "634", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "645", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "650", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "651", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "652", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t|A|E|H/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "654", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "655", function( field ) {
            field.eachSubField( /a|b|c|e|f|h|k|t|A|E|H/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "660", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( indexName, subField.value );
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
        map.put( "666", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /e|f|i|l|m|n|o|p|q|r|s|t|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "668", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /a|x|y|z/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "690", function( field ) {
            field.eachSubField( /a|b|d/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( "z" ) === "600" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|f|h|k|A|E|H/ ) ) {
                        index.pushField( indexName, subField.value );
                    }
                } );
            }
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( "z" ) === "610" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|g|h|i|j|k|s|A|S|C/ ) ) {
                        index.pushField( indexName, subField.value );
                    }
                } );
            }
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /a|f|s|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "933", function( field ) {
            field.eachSubField( /a|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "934", function( field ) {
            field.eachSubField( /a|b|c|d|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "952", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "966", function( field ) {
            field.eachSubField( /e|f|i|l|m|n|o|p|q|r|s|t|u/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );
        map.put( "968", function( field ) {
            field.eachSubField( /a|c/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEm" );
    };

    /**
     * Method that creates ccl term index fields (en).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEn( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEn
     * @method
     */
    that.createDkcclFieldsEn = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEn" );

        map.put( "520", function( field ) {
            field.eachSubField( "n", function( field, subField ) {
                index.pushField( "dkcclterm.en", subField.value );
            } );
        } );
        map.put( "017", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.en", subField.value );
            } );
        } );
        map.put( "018", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.en", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEn" );
    };


    /**
     * Method that creates ccl term index fields (ep).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEp
     * @method
     */
    that.createDkcclFieldsEp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEp" );

        map.put( "600", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( "dkcclterm.ep", subField.value );
                }
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( "z" ) === "600" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|f|h|k/ ) ) {
                        index.pushField( "dkcclterm.ep", subField.value );
                    }
                } );
            }
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEp" );
    };

    /**
     * Method that creates ccl term index fields (es).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsEs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsEs
     * @method
     */
    that.createDkcclFieldsEs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsEs" );

        map.put( "630", function( field ) {
            field.eachSubField( /s|t/, function( field, subField ) {
                index.pushField( "dkcclterm.es", subField.value );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /s|q|r/, function( field, subField ) {
                index.pushField( "dkcclterm.es", subField.value );
            } );
        } );
        map.put( "930", function( field ) {
            field.eachSubField( "s", function( field, subField ) {
                index.pushField( "dkcclterm.es", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsEs" );
    };

    /**
     * Method that creates ccl term index fields (fb).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFb( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsFb
     * @method
     */
    that.createDkcclFieldsFb = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFb" );

        map.put( "242", function( field ) {
            field.eachSubField( "e", function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( /e|f|i|j|k|t|\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( /e|f|t/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "250", function( field ) {
            field.eachSubField( /c|d|t/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /e|t|\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "512", function( field ) {
            field.eachSubField( /d|e/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "513", function( field ) {
            field.eachSubField( /a|e|f|i|j/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( /d|e/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( /d|e/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( /d|e/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "534", function( field ) {
            field.eachSubField( /d|e/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "540", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( "e", function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "720", function( field ) {
            if ( field.getValue( /a|h|k/ ) === "" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /o|4/ ) ) {
                        index.pushField( "dkcclterm.fb", subField.value );
                    }
                } );
            }
        } );
        map.put( "745", function( field ) {
            field.eachSubField( /\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "795", function( field ) {
            field.eachSubField( /e|f|i|j|k|t|\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( /\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );
        map.put( "945", function( field ) {
            field.eachSubField( /\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.fb", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFb" );
    };


    /**
     * Method that creates ccl term index fields (fg).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFg( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsFg
     * @method
     */
    that.createDkcclFieldsFg = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFg" );

        map.put( "044", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.fg", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFg" );
    };

    /**
     * Method that creates ccl term index fields (fl).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFl( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsFl
     * @method
     */
    that.createDkcclFieldsFl = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFl" );

        map.put( "247", function( field ) {
            field.eachSubField( "i", function( field, subField ) {
                index.pushField( "dkcclterm.fl", subField.value );
            } );
        } );
        map.put( "260", function( field ) {
            field.eachSubField( /b|g|p/, function( field, subField ) {
                index.pushField( "dkcclterm.fl", subField.value );
            } );
        } );
        map.put( "538", function( field ) {
            field.eachSubField( "f", function( field, subField ) {
                index.pushField( "dkcclterm.fl", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFl" );
    };

    /**
     * Method that creates ccl term index fields (fm).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFm( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsFm
     * @method
     */
    that.createDkcclFieldsFm = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFm" );

        map.put( "666", function( field ) {
            field.eachSubField( "o", function( field, subField ) {
                index.pushField( "dkcclterm.fm", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFm" );
    };

    /**
     * Method that creates ccl term index fields (fo).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFo( index, map, indexName )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {String} indexName a string with the name of the index to add fields to
     * @name DkcclTermIndex.createDkcclFieldsFo
     * @method
     */
    that.createDkcclFieldsFo = function( index, map, indexName ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFo" );

        map.put( "100", function( field ) {
            if ( field.exists( /a|h|k|e|f|c|b|1|4|5|6/ ) ) {
                index.pushField( indexName, field.getValue( /a|h|k|e|f|c|b|1|4|5|6/, " " ) );
            }
        } );
        map.put( "110", function( field ) {
            if ( field.exists( /a|e|c|s|i|k|j|b|1|4|5|6/ ) ) {
                index.pushField( indexName, field.getValue( /a|e|c|s|i|k|j|b|1|4|5|6/, " " ) );
            }
        } );
        map.put( "239", function( field ) {
            if ( field.exists( /a|c|e|f|h|A|E|H|4/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|f|h|A|E|H|4/, " " ) );
            }
        } );
        map.put( "700", function( field ) {
            if ( field.exists( /a|c|e|f|h|k|A|E|H|4/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|f|h|k|A|E|H|4/, " " ) );
            }
        } );
        map.put( "710", function( field ) {
            if ( field.exists( /a|c|e|i|j|k|s|A|S|C|4/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|i|j|k|s|A|S|C|4/, " " ) );
            }
        } );
        map.put( "720", function( field ) {
            if ( field.getValue( "o" ) === "" ) {
                if ( field.exists( /a|h|k|A|H|K|4/ ) ) {
                    index.pushField( indexName, field.getValue( /a|h|k|A|H|K|4/, " " ) );
                }
            }
        } );
        map.put( "739", function( field ) {
            if ( field.exists( /a|c|e|f|h|A|E|H|4/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|f|h|A|E|H|4/, " " ) );
            }
        } );
        map.put( "770", function( field ) {
            if ( field.exists( /a|c|e|f|h|k|A|E|H|4/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|e|f|h|k|A|E|H|4/, " " ) );
            }
        } );
        map.put( "780", function( field ) {
            if ( field.exists( /a|e|c|s|i|k|j|4|5|6/ ) ) {
                index.pushField( indexName, field.getValue( /a|e|c|s|i|k|j|4|5|6/, " " ) );
            }
        } );
        map.put( "900", function( field ) {
            if ( !field.getValue( "z" ).match( /^6/ ) ) {
                if ( field.exists( /a|c|e|f|h|k|A|E|H/ ) ) {
                    index.pushField( indexName, field.getValue( /a|c|e|f|h|k|A|E|H/, " " ) );
                }
            }
        } );
        map.put( "910", function( field ) {
            if ( !field.getValue( "z" ).match( /^6/ ) ) {
                if ( field.exists( /a|c|e|g|h|i|j|k|s|A|S|C/ ) ) {
                    index.pushField( indexName, field.getValue( /a|c|e|g|h|i|j|k|s|A|S|C/, " " ) );
                }
            }
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFo" );
    };


    /**
     * Method that creates ccl term index fields (fv).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsFv( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsFv
     * @method
     */
    that.createDkcclFieldsFv = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsFv" );

        map.put( "320", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.fv", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsFv" );
    };


    /**
     * Method that creates ccl term index fields (gd).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsGd( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsGd
     * @method
     */
    that.createDkcclFieldsGd = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsGd" );

        map.put( "654", function( field ) {
            field.eachSubField( /i|m|n|o|p|q|r/, function( field, subField ) {
                index.pushField( "dkcclterm.gd", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsGd" );
    };

    /**
     * Method that creates ccl term index fields (hm).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsHm( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsHm
     * @method
     */
    that.createDkcclFieldsHm = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsHm" );

        map.put( "009", function( field ) {
            field.eachSubField( "g", function( field, subField ) {
                index.pushField( "dkcclterm.hm", subField.value );
            } );
            field.eachSubField( "a", function( field, subField ) {
                var m04Value = DkcclTermIndex.translateGMBCode( subField.value );
                if ( m04Value !== undefined || m04Value !== '' ) {
                    index.pushField( "dkcclterm.hm", m04Value );
                }
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsHm" );
    };

    /**
     * Method that creates ccl term index fields (ht).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsHt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsHt
     * @method
     */
    that.createDkcclFieldsHt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsHt" );

        map.put( "239", function( field ) {
            field.eachSubField( /t|u|v/, function( field, subField ) {
                index.pushField( "dkcclterm.ht", subField.value );
            } );
        } );
        map.put( "240", function( field ) {
            field.eachSubField( /a|d|e|f|g|h|n|\u00f8|s/, function( field, subField ) {
                index.pushField( "dkcclterm.ht", subField.value );
            } );
        } );
        map.put( "243", function( field ) {
            if ( field.exists( /a|d|h|n|s/ ) ) {
                index.pushField( "dkcclterm.ht", field.getValue( /a|d|h|n|s/, " " ) );
            }
        } );
        map.put( "245", function( field ) {
            field.eachSubField( /a|n|o|y|\u00e6|\u00f8|p|q|r|x|u|A|P|X|U/, function( field, subField ) {
                index.pushField( "dkcclterm.ht", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsHt" );
    };


    /**
     * Method that creates ccl term index fields (ib).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIb( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIb
     * @method
     */
    that.createDkcclFieldsIb = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIb" );

        map.put( "021", function( field ) {
            field.eachSubField( /a|e|w|x/, function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( "r", function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );
        map.put( "521", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( "r", function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.ib", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIb" );
    };

    /**
     * Method that creates ccl term index fields (ic).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIc( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIc
     * @method
     */
    that.createDkcclFieldsIc = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIc" );

        map.put( "024", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.ic", subField.value );
            } );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.ic", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.ic", subField.value );
            } );
        } );
        map.put( "795", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.ic", subField.value );
            } );
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIc" );
    };

    /**
     * Method that creates ccl term index fields (id).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsId( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsId
     * @method
     */
    that.createDkcclFieldsId = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsId" );

        map.put( "001", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.id", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsId" );
    };

    /**
     * Method that creates ccl term index fields (im).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIm( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIm
     * @method
     */
    that.createDkcclFieldsIm = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIm" );

        map.put( "028", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.im", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIm" );
    };

    /**
     * Method that creates ccl term index fields (in).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIn( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIn
     * @method
     */
    that.createDkcclFieldsIn = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIn" );

        map.put( "022", function( field ) {
            field.eachSubField( /a|l|x|z/, function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "529", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "557", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "860", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "861", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "863", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "865", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "866", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "867", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "868", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "870", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "871", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "873", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "874", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        map.put( "879", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.in", subField.value );
            } );
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIn" );
    };

    /**
     * Method that creates ccl term index fields (ip).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIp
     * @method
     */
    that.createDkcclFieldsIp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIp" );

        map.put( "545", function( field ) {
            field.eachSubField( /a|x|z/, function( field, subField ) {
                index.pushField( "dkcclterm.ip", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIp" );
    };

    /**
     * Method that creates ccl term index fields (ir).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIr( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIr
     * @method
     */
    that.createDkcclFieldsIr = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIr" );

        map.put( "027", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.ir", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIr" );
    };

    /**
     * Method that creates ccl term index fields (is).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIs
     * @method
     */
    that.createDkcclFieldsIs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIs" );

        map.put( "021", function( field ) {
            field.eachSubField( /a|e|w|x/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "022", function( field ) {
            field.eachSubField( /a|l|x|z/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "024", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "025", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "027", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "028", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "521", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "523", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "529", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "557", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "795", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "860", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "861", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "863", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "865", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "866", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "867", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "868", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "870", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "871", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "873", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "874", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        map.put( "879", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.is", subField.value );
            } );
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIs" );
    };

    /**
     * Method that creates ccl term index fields (ix).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsIx( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsIx
     * @method
     */
    that.createDkcclFieldsIx = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsIx" );

        map.put( "042", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.ix", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsIx" );
    };

    /**
     * Method that creates ccl term index fields (ka).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKa( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKa
     * @method
     */
    that.createDkcclFieldsKa = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKa" );

        map.put( "990", function( field ) {
            field.eachSubField( "b", function( field, subField ) {
                index.pushField( "dkcclterm.ka", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKa" );
    };


    /**
     * Method that creates ccl term index fields (ke).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKe( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKe
     * @method
     */
    that.createDkcclFieldsKe = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKe" );

        map.put( "600", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( "dkcclterm.ke", subField.value );
                }
            } );
        } );
        map.put( "610", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                    index.pushField( "dkcclterm.ke", subField.value );
                }
            } );
        } );
        map.put( "620", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "621", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "630", function( field ) {
            field.eachSubField( /a|b|f|g|s|t|u/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "633", function( field ) {
            field.eachSubField( /a|u|A/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "634", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "645", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( "dkcclterm.ke", subField.value );
                }
            } );
        } );
        map.put( "650", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( "dkcclterm.ke", subField.value );
                }
            } );
        } );
        map.put( "651", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /2/ ) ) {
                    index.pushField( "dkcclterm.ke", subField.value );
                }
            } );
        } );
        map.put( "660", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "661", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "662", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "666", function( field ) {
            field.eachSubField( /e|f|i|t|s|r|q|m|n|p|l|o/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "667", function( field ) {
            field.eachSubField( /e|f|i|t|s|r|q|m|n|p|l|o/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "668", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "670", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "690", function( field ) {
            field.eachSubField( /a|b|d/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( "z" ) === "600" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|f|h|k|A|E|H/ ) ) {
                        index.pushField( "dkcclterm.ke", subField.value );
                    }
                } );
            }
        } );
        map.put( "910", function( field ) {
            if ( field.getValue( "z" ) === "610" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|g|h|i|j|k|s|A|S|C/ ) ) {
                        index.pushField( "dkcclterm.ke", subField.value );
                    }
                } );
            }
        } );
        map.put( "930", function( field ) {
            field.eachSubField( /a|f|s|u/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "933", function( field ) {
            field.eachSubField( /a|u/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );
        map.put( "934", function( field ) {
            field.eachSubField( /a|b|c|d|u/, function( field, subField ) {
                index.pushField( "dkcclterm.ke", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKe" );
    };

    /**
     * Method that creates ccl term index fields (kg).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKg( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKg
     * @method
     */
    that.createDkcclFieldsKg = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKg" );

        map.put( "990", function( field ) {
            field.eachSubField( /c/, function( field, subField ) {
                index.pushField( "dkcclterm.kg", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKg" );
    };

    /**
     * Method that creates ccl term index fields (kk).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKk( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKk
     * @method
     */
    that.createDkcclFieldsKk = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKk" );

        map.put( "032", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.kk", subField.value );
            } );
        } );

        map.put( "990", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.kk", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKk" );
    };


    /**
     * Method that creates ccl term index fields (kl).
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKl( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKl
     * @method
     */
    that.createDkcclFieldsKl = function( index, map ){
        Log.trace( 'Entering DkcclTermIndex.createDkcclFieldsKl' );

        map.put( "087", "088", "089", function( field ){
            field.eachSubField( /[a-z]/, function( field, subField ){
                index.pushField( "dkcclterm.kl", subField.value );
            })
        });

        Log.trace( 'Leaving DkcclTermIndex.createDkcclFieldsKl' );

    };


    /**
     * Method that creates ccl term index fields (km).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKm( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKm
     * @method
     */
    that.createDkcclFieldsKm = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKm" );

        map.put( "034", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.km", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( "b", function( field, subField ) {
                index.pushField( "dkcclterm.km", subField.value );
            } );
        } );
        map.put( "256", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                index.pushField( "dkcclterm.km", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( "m", function( field, subField ) {
                index.pushField( "dkcclterm.km", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKm" );
    };

    /**
     * Method that creates ccl term index fields (kn).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKn( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKn
     * @method
     */
    that.createDkcclFieldsKn = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKn" );

        map.put( "033", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclterm.kn", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKn" );
    };


    /**
     * Method that creates ccl term index fields (ko).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKo( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKo
     * @method
     */
    that.createDkcclFieldsKo = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKo" );

        map.put( "710", function( field ) {
            field.eachSubField( /a|c|e|i|j|k|s|4/, function( field, subField ) {
                index.pushField( "dkcclterm.ko", subField.value );
            } );
        } );
        map.put( "110", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0/ ) ) {
                    index.pushField( "dkcclterm.ko", subField.value );
                }
            } );
        } );
        map.put( "720", function( field ) {
            if ( field.getValue( /a|h|o/ ) === "" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /k|4/ ) ) {
                        index.pushField( "dkcclterm.ko", subField.value );
                    }
                } );
            }
        } );
        map.put( "780", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0|1|\u00e5/ ) ) {
                    index.pushField( "dkcclterm.ko", subField.value );
                }
            } );
        } );

        map.put( "910", function( field ) {
            if ( field.getValue( "z" ).match( /^6/ ) ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|g|h|i|j|k|s/ ) ) {
                        index.pushField( "dkcclterm.ko", subField.value );
                    }
                } );
            }
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKo" );
    };


    /**
     * Method that creates ccl term index fields (kr).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKr( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKr
     * @method
     */
    that.createDkcclFieldsKr = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKr" );

        map.put( "990", function( field ) {
            field.eachSubField( "r", function( field, subField ) {
                index.pushField( "dkcclterm.kr", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKr" );
    };

    /**
     * Method that creates ccl term index fields (kx).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsKx( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsKx
     * @method
     */
    that.createDkcclFieldsKx = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsKx" );

        map.put( "990", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.kx", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsKx" );
    };

    /**
     * Method that creates ccl term index fields (ld).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsLd( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsLd
     * @method
     */
    that.createDkcclFieldsLd = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsLd" );

        map.put( "014", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.ld", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsLd" );
    };

    /**
     * Method that creates ccl term index fields (li).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsLi( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsLi
     * @method
     */
    that.createDkcclFieldsLi = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsLi" );

        map.put( "100", "110", "600", "610", "666", "667", "700", "710", "770", "780", function( field ) {
            field.eachSubField( /5|6/, function( field, subField ) {
                index.pushField( "dkcclterm.li", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsLi" );
    };

    /**
     * Method that creates ccl term index fields (ll).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsLl( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsLl
     * @method
     */
    that.createDkcclFieldsLl = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsLl" );

        map.put( "042", function( field ) {
            field.eachSubField( "c", function( field, subField ) {
                index.pushField( "dkcclterm.ll", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsLl" );
    };


    /**
     * Method that creates ccl term index fields (ln).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsLn( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsLn
     * @method
     */
    that.createDkcclFieldsLn = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsLn" );

        map.put( "001", function( field ) {
            field.eachSubField( "b", function( field, subField ) {
                index.pushField( "dkcclterm.ln", subField.value );
            } );
        } );
        map.put( "096", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.ln", subField.value );
            } );
        } );
        map.put( "980", function( field ) {
            field.eachSubField( "y", function( field, subField ) {
                index.pushField( "dkcclterm.ln", subField.value );
            } );
        } );
        
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsLn" );
    };


    /**
     * Method that creates ccl term index fields (me).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsMe( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsMe
     * @method
     */
    that.createDkcclFieldsMe = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsMe" );

        map.put( "666", function( field ) {
            field.eachSubField( /m|n|p|l/, function( field, subField ) {
                index.pushField( "dkcclterm.me", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsMe" );
    };


    /**
     * Method that creates ccl term index fields (mo).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsMo( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsMo
     * @method
     */
    that.createDkcclFieldsMo = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsMo" );

        map.put( "039", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclterm.mo", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsMo" );
    };

    /**
     * Method that creates ccl term index fields (ms).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsMs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsMs
     * @method
     */
    that.createDkcclFieldsMs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsMs" );

        map.put( "660", function( field ) {
            field.eachSubField( /a|x|y|z/, function( field, subField ) {
                index.pushField( "dkcclterm.ms", subField.value );
            } );
        } );
        map.put( "600", function( field ) {
            if ( field.getValue( "2" ) === "MeSH" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                        index.pushField( "dkcclterm.ms", subField.value );
                    }
                } );
            }
        } );
        map.put( "610", function( field ) {
            if ( field.getValue( "2" ) === "MeSH" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( !subField.name.match( /0|1|2|b|\u00e5/ ) ) {
                        index.pushField( "dkcclterm.ms", subField.value );
                    }
                } );
            }
        } );
        map.put( "634", function( field ) {
            if ( field.getValue( "2" ) === "MeSH" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( String( subField.name ).match( /c|d|v|x|y|z/ ) ) {
                        index.pushField( "dkcclterm.ms", subField.value );
                    }
                } );
            }
        } );
        map.put( "645", function( field ) {
            if ( field.getValue( "2" ) === "MeSH" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( String( subField.name ).match( /a|c|v|x|y|z/ ) ) {
                        index.pushField( "dkcclterm.ms", subField.value );
                    }
                } );
            }
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsMs" );
    };

    /**
     * Method that creates ccl term index fields (nb).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNb( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNb
     * @method
     */
    that.createDkcclFieldsNb = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNb" );

        map.put( "666", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.nb", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNb" );
    };

    /**
     * Method that creates ccl term index fields (nl).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNl( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNl
     * @method
     */
    that.createDkcclFieldsNl = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNl" );

        map.put( "036", function( field ) {
            field.eachSubField( /a|b|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nl", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNl" );
    };

    /**
     * Method that creates ccl term index fields (no).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNo( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNo
     * @method
     */
    that.createDkcclFieldsNo = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNo" );

        map.put( "247", function( field ) {
            field.eachSubField( "l", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "501", function( field ) {
            field.eachSubField( /i|a|b|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "502", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "504", function( field ) {
            field.eachSubField( /a|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "505", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "506", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "507", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "508", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "509", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "512", function( field ) {
            field.eachSubField( /a|i|t|e|d|x|b|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "517", function( field ) {
            field.eachSubField( /a|b|c|d/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( /a|i|t|e|d|x|b|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( /a|i|t|e|d|x|b|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( /a|i|t|e|d|x|m|b|z|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "534", function( field ) {
            field.eachSubField( /a|i|t|e|d|x|b|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "555", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );
        map.put( "559", function( field ) {
            field.eachSubField( /a|u|y/, function( field, subField ) {
                index.pushField( "dkcclterm.no", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNo" );
    };


    /**
     * Method that creates ccl term index fields (nr).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNr( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNr
     * @method
     */
    that.createDkcclFieldsNr = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNr" );

        map.put( "001", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "002", function( field ) {
            field.eachSubField( /a|c|d|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "010", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "017", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "018", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "020", function( field ) {
            field.eachSubField( /b|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "021", function( field ) {
            field.eachSubField( /a|e|n|x|w/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "022", function( field ) {
            field.eachSubField( /a|l|x|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "023", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "024", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "025", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "027", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "028", function( field ) {
            field.eachSubField( /a|n|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "030", function( field ) {
            field.eachSubField( /a|x/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "035", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "036", function( field ) {
            field.eachSubField( /a|b|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "245", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( /n|r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "521", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "523", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "529", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "538", function( field ) {
            field.eachSubField( /a|b|c|d|g|h|o|p|q|s/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "557", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /r|z/, function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "795", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "860", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "861", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "863", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "865", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "866", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "867", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "868", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "870", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "871", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "873", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "874", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        map.put( "879", function( field ) {
            field.eachSubField( "z", function( field, subField ) {
                index.pushField( "dkcclterm.nr", subField.value );
            } );
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNr" );
    };

    /**
     * Method that creates ccl term index fields (ns).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNs
     * @method
     */
    that.createDkcclFieldsNs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNs" );

        map.put( "990", function( field ) {
            field.eachSubField( "m", function( field, subField ) {
                index.pushField( "dkcclterm.ns", subField.value );
            } );
        } );
        map.put( "991", function( field ) {
            field.eachSubField( "o", function( field, subField ) {
                index.pushField( "dkcclterm.ns", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNs" );
    };

    /**
     * Method that creates ccl term index fields (nt).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNt
     * @method
     */
    that.createDkcclFieldsNt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNt" );

        map.put( "210", function( field ) {
            field.eachSubField( /a|b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.nt", subField.value );
            } );
        } );
        map.put( "222", function( field ) {
            field.eachSubField( /a|b/, function( field, subField ) {
                index.pushField( "dkcclterm.nt", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNt" );
    };

    /**
     * Method that creates ccl term index fields (nv).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsNv( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsNv
     * @method
     */
    that.createDkcclFieldsNv = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsNv" );

        map.put( "008", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.nv", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsNv" );
    };


    /**
     * Method that creates ccl term index fields (oc).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsOc( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsOc
     * @method
     */
    that.createDkcclFieldsOc = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsOc" );

        map.put( "035", function( field ) {
            field.eachSubField( "a", function( field, subField ) {
                index.pushField( "dkcclterm.oc", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsOc" );
    };

    /**
     * Method that creates ccl term index fields (ok).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsOk( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsOk
     * @method
     */
    that.createDkcclFieldsOk = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsOk" );

        map.put( "652", function( field ) {
            field.eachSubField( /m|o/, function( field, subField ) {
                index.pushField( "dkcclterm.ok", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsOk" );
    };

    /**
     * Method that creates ccl term index fields (op).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsOp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsOp
     * @method
     */
    that.createDkcclFieldsOp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsOp" );

        map.put( "001", function( field ) {
            field.eachSubField( "d", function( field, subField ) {
                index.pushField( "dkcclterm.op", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsOp" );
    };

    /**
     * Method that creates ccl term index fields (ou).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsOu( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsOu
     * @method
     */
    that.createDkcclFieldsOu = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsOu" );

        map.put( "041", function( field ) {
            field.eachSubField( /b|c/, function( field, subField ) {
                index.pushField( "dkcclterm.ou", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsOu" );
    };

    /**
     * Method that creates ccl term index fields (pa).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsPa( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsPa
     * @method
     */
    that.createDkcclFieldsPa = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsPa" );

        map.put( "245", function( field ) {
            field.eachSubField( /p|q|r|s/, function( field, subField ) {
                index.pushField( "dkcclterm.pa", subField.value );
            } );
        } );
        map.put( "247", function( field ) {
            field.eachSubField( "p", function( field, subField ) {
                index.pushField( "dkcclterm.pa", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsPa" );
    };

    /**
     * Method that creates ccl term index fields (pe).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsPe( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsPe
     * @method
     */
    that.createDkcclFieldsPe = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsPe" );

        map.put( "100", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( !subField.name.match( /0/ ) ) {
                    index.pushField( "dkcclterm.pe", subField.value );
                }
            } );
        } );
        map.put( "700", function( field ) {
            field.eachSubField( /a|h|k|e|f|c|4/, function( field, subField ) {
                index.pushField( "dkcclterm.pe", subField.value );
            } );
        } );
        map.put( "720", function( field ) {
            if ( field.getValue( /o|k/ ) === "" ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|h|4/ ) ) {
                        index.pushField( "dkcclterm.pe", subField.value );
                    }
                } );
            }
        } );
        map.put( "770", function( field ) {
            field.eachSubField( /a|h|k|e|f|c|4/, function( field, subField ) {
                index.pushField( "dkcclterm.pe", subField.value );
            } );
        } );
        map.put( "900", function( field ) {
            if ( field.getValue( "z" ).match( /^6/ ) ) {
                field.eachSubField( /./, function( field, subField ) {
                    if ( subField.name.match( /a|c|e|f|h|k/ ) ) {
                        index.pushField( "dkcclterm.pe", subField.value );
                    }
                } );
            }
        } );
        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsPe" );
    };

    /**
     * Method that creates ccl term index fields (po).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsPo( index, map, indexName )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {String} indexName a string with the name of the index to add fields to
     * @name DkcclTermIndex.createDkcclFieldsPo
     * @method
     */
    that.createDkcclFieldsPo = function( index, map, indexName ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsPo" );

        map.put( "100", "110", function( field ) {
            field.eachSubField( /./, function( field, subField ) {
                if ( "0" !== subField.name ) {
                    index.pushField( indexName, subField.value );
                }
            } );
        } );
        map.put( "239", function( field ) {
            field.eachSubField( /a|c|e|f|h|A|E|H|4/, function( field, subField ) {
                index.pushField( indexName, subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsPo" );
    };

    /**
     * Method that creates ccl term index fields (pu).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsPu( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsPu
     * @method
     */
    that.createDkcclFieldsPu = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsPu" );

        map.put( "247", function( field ) {
            field.eachSubField( "h", function( field, subField ) {
                index.pushField( "dkcclterm.pu", subField.value );
            } );
        } );
        map.put( "260", function( field ) {
            field.eachSubField( /a|f/, function( field, subField ) {
                index.pushField( "dkcclterm.pu", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsPu" );
    };

    /**
     * Method that creates ccl term index fields (rt).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsRt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsRt
     * @method
     */
    that.createDkcclFieldsRt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsRt" );

        map.put( "860", "861", "863", "865", "866", "867", "868", "870", "871", "873", "874", "879",
            function( field ) {
            field.eachSubField( /c|t/, function( field, subField ) {
                index.pushField( "dkcclterm.rt", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsRt" );
    };

    /**
     * Method that creates ccl term index fields (se).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsSe( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsSe
     * @method
     */
    that.createDkcclFieldsSe = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsSe" );

        map.put( "247", function( field ) {
            field.eachSubField( /n|o|s|v|S/, function( field, subField ) {
                index.pushField( "dkcclterm.se", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /a|c|n|o|p|q|r|s|v|\u00f8|\u00e6|A|P/, function( field, subField ) {
                index.pushField( "dkcclterm.se", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /s|v|S/, function( field, subField ) {
                index.pushField( "dkcclterm.se", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( /a|n|o|v|\u00f8|\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.se", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsSe" );
    };

    /**
     * Method that creates ccl term index fields (sf).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsSf( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsSf
     * @method
     */
    that.createDkcclFieldsSf = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsSf" );

        map.put( "990", function( field ) {
            field.eachSubField( /b|c|o/, function( field, subField ) {
                index.pushField( "dkcclterm.sf", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsSf" );
    };

    /**
     * Method that creates ccl term index fields (so).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsSo( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsSo
     * @method
     */
    that.createDkcclFieldsSo = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsSo" );

        map.put( "247", function( field ) {
            field.eachSubField( /n|o|s|S/, function( field, subField ) {
                index.pushField( "dkcclterm.so", subField.value );
            } );
        } );
        map.put( "440", function( field ) {
            field.eachSubField( /a|c|n|o|p|q|r|s|\u00f8|\u00e6|A|P/, function( field, subField ) {
                index.pushField( "dkcclterm.so", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /s|S/, function( field, subField ) {
                index.pushField( "dkcclterm.so", subField.value );
            } );
        } );
        map.put( "840", function( field ) {
            field.eachSubField( /a|n|o|\u00f8|\u00e6/, function( field, subField ) {
                index.pushField( "dkcclterm.so", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsSo" );
    };

    /**
     * Method that creates ccl term index fields (sp).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsSp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsSp
     * @method
     */
    that.createDkcclFieldsSp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsSp" );

        map.put( "008", function( field ) {
            field.eachSubField( "l", function( field, subField ) {
                index.pushField( "dkcclterm.sp", subField.value );
            } );
        } );
        map.put( "041", function( field ) {
            field.eachSubField( /a|d|e|u|p|s/, function( field, subField ) {
                index.pushField( "dkcclterm.sp", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsSp" );
    };

    /**
     * Method that creates ccl term index fields (st).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsSt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsSt
     * @method
     */
    that.createDkcclFieldsSt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsSt" );

        map.put( "861", function( field ) {
            field.eachSubField( /c|t/, function( field, subField ) {
                index.pushField( "dkcclterm.st", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsSt" );
    };

    /**
     * Method that creates ccl term index fields (tf).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsTf( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsTf
     * @method
     */
    that.createDkcclFieldsTf = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsTf" );

        map.put( "002", function( field ) {
            field.eachSubField( /a|c|d/, function( field, subField ) {
                index.pushField( "dkcclterm.tf", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsTf" );
    };

    /**
     * Method that creates ccl term index fields (tg).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsTg( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsTg
     * @method
     */
    that.createDkcclFieldsTg = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsTg" );

        map.put( "096", function( field ) {
            field.eachSubField( /r|u/, function( field, subField ) {
                index.pushField( "dkcclterm.tg", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsTg" );
    };

    /**
     * Method that creates ccl term index fields (ti).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsTi( index, map, indexName )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {String} indexName a string with the name of the index to add fields to
     * @name DkcclTermIndex.createDkcclFieldsTi
     * @method
     */
    that.createDkcclFieldsTi = function( index, map, indexName ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclTermsFieldsTi" );

        map.put( "210", "222", function( field ) {
            index.pushField( indexName, field.getValue( /./, " " ) );
        } );
        map.put( "239", function( field ) {
            if ( field.exists( /t|u|v|b|\u00f8/ ) ) {
                index.pushField( indexName, field.getValue( /t|u|v|b|\u00f8/, " " ) );
            }
        } );
        map.put( "240", function( field ) {
            if ( field.exists( /a|d|e|f|g|h|j|k|l|n|o|s|\u00f8/ ) ) {
                index.pushField( indexName, field.getValue( /a|d|e|f|g|h|j|k|l|n|o|s|\u00f8/, " " ) );
            }
        } );
        map.put( "241", function( field ) {
            if ( field.exists( /a|n|o/ ) ) {
                index.pushField( indexName, field.getValue( /a|n|o/, " " ) );
            }
        } );
        map.put( "242", function( field ) {
            if ( field.exists( /a|c|n|o/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|n|o/, " " ) );
            }
        } );
        map.put( "243", function( field ) {
            if ( field.exists( /a|l|j|d|n|k|s|h/ ) ) {
                index.pushField( indexName, field.getValue( /a|l|j|d|n|k|s|h/, " " ) );
            }
        } );
        map.put( "245", function( field ) {
            if ( field.exists( /a|b|c|g|n|o|p|q|r|s|u|x|y|\u00e6|\u00f8|A|P|X|U/ ) ) {
                index.pushField( indexName, field.getValue( /a|b|c|g|n|o|p|q|r|s|u|x|y|\u00e6|\u00f8|A|P|X|U/, " " ) );
            }
        } );
        map.put( "247", function( field ) {
            if ( field.exists( /a|c|g|n|o|p|s|v|x|A|S|P|X/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|g|n|o|p|s|v|x|A|S|P|X/, " " ) );
            }
        } );
        map.put( "440", function( field ) {
            if ( field.exists( /a|c|n|o|p|q|r|s|v|\u00f8|\u00e6|A|P/ ) ) {
                index.pushField( indexName, field.getValue( /a|c|n|o|p|q|r|s|v|\u00f8|\u00e6|A|P/, " " ) );
            }
        } );
        map.put( "512", "520", "526", "530", "534", function( field ) {
            if ( field.exists( /t|x/ ) ) {
                index.pushField( indexName, field.getValue( /t|x/, " " ) );
            }
        } );
        map.put( "700", function( field ) {
            if ( field.exists( /t|n|o|j|d|p|l/ ) ) {
                index.pushField( indexName, field.getValue( /t|n|o|j|d|p|l/, " " ) );
            }
        } );
        map.put( "710", function( field ) {
            if ( field.exists( /t|n|o|f|d|p|l/ ) ) {
                index.pushField( indexName, field.getValue( /t|n|o|f|d|p|l/, " " ) );
            }
        } );
        map.put( "739", function( field ) {
            if ( field.exists( /t|u|v|b|\u00f8/ ) ) {
                index.pushField( indexName, field.getValue( /t|u|v|b|\u00f8/, " " ) );
            }
        } );
        map.put( "740", function( field ) {
            if ( field.exists( /a|d|e|f|g|h|j|k|n|o|s|\u00f8/ ) ) {
                index.pushField( indexName, field.getValue( /a|d|e|f|g|h|j|k|n|o|s|\u00f8/, " " ) );
            }
        } );
        map.put( "745", function( field ) {
            if ( field.exists( /a|b|n|o|\u00f8|\u00e6|A/ ) ) {
                index.pushField( indexName, field.getValue( /a|b|n|o|\u00f8|\u00e6|A/, " " ) );
            }
        } );
        map.put( "795", function( field ) {
            if ( field.exists( /a|b|c|p|q|r|s|u|v|\u00f8|\u00e6|A/ ) ) {
                index.pushField( indexName, field.getValue( /a|b|c|p|q|r|s|u|v|\u00f8|\u00e6|A/, " " ) );
            }
        } );
        map.put( "840", function( field ) {
            if ( field.exists( /a|n|o|v|\u00f8|\u00e6/ ) ) {
                index.pushField( indexName, field.getValue( /a|n|o|v|\u00f8|\u00e6/, " " ) );
            }
        } );
        map.put( "945", function( field ) {
            if ( !field.getValue( "z" ).match( /^6/ ) ) {
                if ( field.exists( /a|d|e|f|g|h|j|k|n|o|s/ ) ) {
                    index.pushField( indexName, field.getValue( /a|d|e|f|g|h|j|k|n|o|s/, " " ) );
                }
            }
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsTi" );
    };

    /**
     * Method that creates ccl term index fields (ts).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsTs( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsTs
     * @method
     */
    that.createDkcclFieldsTs = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsTs" );

        map.put( "300", function( field ) {
            field.eachSubField( "e", function( field, subField ) {
                index.pushField( "dkcclterm.ts", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsTs" );
    };

    /**
     * Method that creates ccl term index fields (tt).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsTt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsTt
     * @method
     */
    that.createDkcclFieldsTt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsTt" );

        map.put( "860", function( field ) {
            field.eachSubField( /c|t/, function( field, subField ) {
                index.pushField( "dkcclterm.tt", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsTt" );
    };

    /**
     * Method that creates ccl term index fields (ul).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsUl( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsUl
     * @method
     */
    that.createDkcclFieldsUl = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsUl" );

        map.put( "008", function( field ) {
            field.eachSubField( "b", function( field, subField ) {
                index.pushField( "dkcclterm.ul", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsUl" );
    };

    /**
     * Method that creates ccl term index fields (uk).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsUk( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsUk
     * @method
     */
    that.createDkcclFieldsUk = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsUk" );

        map.put( "631", function( field ) {
            field.eachSubField( /a|b|f|g|s|t/, function( field, subField ) {
                index.pushField( "dkcclterm.uk", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsUk" );
    };

    /**
     * Method that creates ccl term index fields (ut).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsUt( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsUt
     * @method
     */
    that.createDkcclFieldsUt = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsUt" );

        map.put( "239", function( field ) {
            field.eachSubField( /t|u|v|b/, function( field, subField ) {
                index.pushField( "dkcclterm.ut", subField.value );
            } );
        } );
        map.put( "240", function( field ) {
            field.eachSubField( /a|d|e|f|g|h|j|k|l|n|o|s|\u00f8/, function( field, subField ) {
                index.pushField( "dkcclterm.ut", subField.value );
            } );
        } );
        map.put( "243", function( field ) {
            if ( field.exists( /a|l|j|d|n|k|s|h/ ) ) {
                index.pushField( "dkcclterm.ut", field.getValue( /a|l|j|d|n|k|s|h/, " " ) );
            }
        } );
        map.put( "739", function( field ) {
            field.eachSubField( /t|u|v|b/, function( field, subField ) {
                index.pushField( "dkcclterm.ut", subField.value );
            } );
        } );
        map.put( "740", function( field ) {
            field.eachSubField( /a|d|e|f|g|h|j|k|n|o|s|\u00f8/, function( field, subField ) {
                index.pushField( "dkcclterm.ut", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsUt" );
    };

    /**
     * Method that creates ccl term index fields (uu).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsUu( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsUu
     * @method
     */
    that.createDkcclFieldsUu = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsUu" );

        map.put( "990", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.uu", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsUu" );
    };

    /**
     * Method that creates ccl term index fields (vp).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsVp( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsVp
     * @method
     */
    that.createDkcclFieldsVp = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsVp" );

        map.put( "557", function( field ) {
            field.eachSubField( /a|b|v|\u00e6|\u00f8|A/, function( field, subField ) {
                index.pushField( "dkcclterm.vp", subField.value );
            } );
        } );
        map.put( "558", function( field ) {
            field.eachSubField( /a|A/, function( field, subField ) {
                index.pushField( "dkcclterm.vp", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsVp" );
    };

    /**
     * Method that creates ccl term index fields (ww).
     *
     *
     * @type {method}
     * @syntax DkcclTermIndex.createDkcclFieldsWw( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @name DkcclTermIndex.createDkcclFieldsWw
     * @method
     */
    that.createDkcclFieldsWw = function( index, map ) {

        Log.trace( "Entering DkcclTermIndex.createDkcclFieldsWw" );

        map.put( "247", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "501", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "504", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "512", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "520", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "523", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "526", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "529", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "530", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "532", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "534", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "559", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "856", function( field ) {
            field.eachSubField( /a|b|u/, function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "860", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "861", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "863", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "865", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "866", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "867", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "868", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "870", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "871", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "873", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "874", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );
        map.put( "879", function( field ) {
            field.eachSubField( "u", function( field, subField ) {
                index.pushField( "dkcclterm.ww", subField.value );
            } );
        } );

        Log.trace( "Leaving DkcclTermIndex.createDkcclFieldsWw" );
    };


    /**
     * Helper method that translates general material codes from 009a/b to mnemo-codes
     * When given 009a values the result is field m04 according to praksis
     *
     *@type method
     *@syntax DkcclTermIndex.translateGMBCode( inputCode )
     *@param {String} inputCode 1-character code for general material description
     *@return {String} outputCode 2-character mnemo-code for general material description,undefined if no matching code is found
     *@name DkcclTermIndex.translateGMBCode
     *@method
     */
    that.translateGMBCode = function( inputCode ) {

        Log.trace( "Entering DkcclTermIndex.translateGMBCode" );

        var codeMap = {
            'a': 'te',
            'b': 'h\u00E5',
            'c': 'mu',
            'd': 'mu',
            'e': 'km',
            'f': 'km',
            'g': 'bi',
            'm': 'fi',
            'n': 'fi',
            'p': 'br',
            'r': 'ly',
            's': 'lm',
            't': 'el',
            'u': 'tm',
            'v': 'sm'
        };
        var outputCode = codeMap[ inputCode ];

        Log.trace( "Leaving DkcclTermIndex.translateGMBCode" );

        return outputCode;
    };

    return that;

}();

