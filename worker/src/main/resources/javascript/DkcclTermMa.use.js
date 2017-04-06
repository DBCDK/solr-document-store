/** @file Module that creates dkcclterm.ma index objects */

use( "Log" );
use( "Marc" );

EXPORTED_SYMBOLS = [ 'DkcclTermMa' ];

/**
 * Module with functions that create ccl term index 'ma' from marc record object.
 *
 * Contains functions to create ccl term index ma for danMARC2 records (as
 * defined in Praksisregler)
 *
 * @type {namespace}
 * @namespace
 * @name DkcclTermMa
 */

var DkcclTermMa = function( ) {


    /**
     * Method that creates ccl term index fields 'ma'.
     *
     *
     * @type {function}
     * @syntax DkcclTermMa.createDkcclFieldsMa( index, record )
     * @param {Object} index the index to add fields to
     * @param {Record} record The record from which to create the index fields
     * @return {Object} Index with added fields
     * @name DkcclTermMa.createDkcclFieldsMa
     * @function
     */
    function createDkcclFieldsMa( index, record ) {

        Log.trace( "Entering DkcclTermMa.createDkcclFieldsMa" );

        var map = new MatchMap( );

        createDkcclFieldsMaFrom005( index, map );
        createDkcclFieldsMaFrom008( index, map, record );
        createDkcclFieldsMaFrom009( index, map, record );
        createDkcclFieldsMaFrom014( index, map );

        record.eachFieldMap( map );

        if ( DkcclTermMa.isEbook( record ) ) {
            index.pushField( "dkcclterm.ma", "eb" );
        }

        Log.trace( "Leaving DkcclTermMa.createDkcclFieldsMa" );

        return index;
    }


    /**
     * Method that creates ccl term index fields 'ma' from field 008.
     *
     *
     * @type {function}
     * @syntax DkcclTermMa.createDkcclFieldsMaFrom005( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @return {Object} index with added fields
     * @name DkcclTermMa.createDkcclFieldsMaFrom005
     * @function
     */
    function createDkcclFieldsMaFrom005( index, map ) {

        Log.trace( "Entering: DkcclTermMa.createDkcclFieldsMaFrom005" );

        var translation;

        map.put( "005", function( field ) {
            var subfieldMap = new MatchMap( );
            subfieldMap.put( "h", function( field, subField ) {
                translation = {
                    "a": "lv",
                    "b": "lw",
                    "c": "lu",
                    "d": "lh",
                    "e": "ll",
                    "f": "lt",
                    "g": "lr",
                    "h": "ls",
                    "i": "l\u00f8",
                    "j": "la",
                    "k": "ld",
                    "l": "lj",
                    "m": "li",
                    "n": "lp",
                    "o": "lq",
                    "p": "l\u00E6",
                    "q": "l\u00E5",
                    "r": "le",
                    "s": "lg",
                    "t": "lf",
                    "u": "lz",
                    "v": "lx",
                    "w": "lc",
                    "x": "ln",
                    "y": "mm"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "i", function( field, subField ) {
                translation = {
                    "a": "pa",
                    "b": "ps",
                    "c": "pl",
                    "d": "pk",
                    "e": "pp",
                    "g": "px",
                    "h": "ph",
                    "i": "pd",
                    "j": "pc",
                    "k": "pr",
                    "l": "pu",
                    "o": "po"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "j", function( field, subField ) {
                translation = {
                    "a": "st",
                    "b": "sv",
                    "c": "so"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "k", function( field, subField ) {
                if ( "e" === String( subField.value ) ) {
                    index.pushField( "dkcclterm.ma", "tl" );
                }
            } );
            subfieldMap.put( "z", function( field, subField ) {
                translation = {
                    "p": "lb",
                    "q": "lk"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            field.eachSubFieldMap( subfieldMap );
        } );

        Log.trace( "Leaving: DkcclTermMa.createDkcclFieldsMaFrom005" );

    }

    /**
     * Method that creates ccl term index fields 'ma' from field 008.
     *
     *
     * @type {function}
     * @syntax DkcclTermMa.createDkcclFieldsMaFrom008( index, map, record )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {Record} record
     * @return {Object} index with added fields
     * @name DkcclTermMa.createDkcclFieldsMaFrom008
     * @function
     */
    function createDkcclFieldsMaFrom008( index, map, record ) {

        Log.trace( "Entering: DkcclTermMa.createDkcclFieldsMaFrom008" );

        //using from record:
        // 004 a
        // 009 ab
        // 009 g

        var translation;

        map.put( "008", function( field ) {
            var subfieldMap = new MatchMap();
            subfieldMap.put( "d", function( field, subField ) {
                translation = {
                    "a": "bl",
                    "b": "ka",
                    "c": "rg",
                    "d": "rf",
                    "e": "ob",
                    "f": "ec",
                    "g": "vv",
                    "h": "bj",
                    "i": "sa",
                    "j": "pg",
                    "k": "pt",
                    "l": "sd",
                    "m": "dp",
                    "n": "lo",
                    "o": "ta",
                    "p": "tr",
                    "q": "ex",
                    "r": "tt",
                    "s": "am",
                    "t": "tn",
                    "u": "ug",
                    "w": "rw",
                    "z": "bv",
                    "\u00E5": "s\u00E5"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "f", function( field, subField ) {
                if ( "1" === String( subField.value ) ) {
                    index.pushField( "dkcclterm.ma", "kf" );
                }
            } );
            subfieldMap.put( "g", function( field, subField ) {
                if ( "1" === String( subField.value ) ) {
                    index.pushField( "dkcclterm.ma", "fe" );
                }
            } );
            subfieldMap.put( "h", function( field, subField ) {
                translation = {
                    "d": "pb",
                    "m": "ms",
                    "n": "av",
                    "p": "ts",
                    "z": "\u00E5p",
                    "?": "up"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "j", function( field, subField ) {
                translation = {
                    "d": "dr",
                    "e": "ea",
                    "f": "ro",
                    "i": "bx",
                    "j": "no",
                    "m": "ig",
                    "p": "di"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "m", function( field, subField ) {
                if ( "1" === String( subField.value ) ) {
                    index.pushField( "dkcclterm.ma", "ss" );
                }
            } );
            subfieldMap.put( "n", function( field, subField ) {
                translation = {
                    "a": "ou",
                    "b": "od",
                    "c": "oi"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "o", function( field, subField ) {
                translation = {
                    "b": "b\u00f8",
                    "s": "bs"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "q", function( field, subField ) {
                index.pushField( "dkcclterm.ma", subField.value );
            } );
            subfieldMap.put( "r", function( field, subField ) {
                translation = {
                    "an": "ai",
                    "ap": "ap"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );
            } );
            subfieldMap.put( "t", function( field, subField ) {
                translation = {
                    "a": "an",
                    "m": "mo",
                    "p": "pe",
                    "s": "s\u00E6"
                };
                __addToMaIndexIfValueExists( index, translation[ subField.value ] );

                if ( String( subField.value ).match( /[ms]/ ) && record.getValue( "009", /[ab]/ ).match( /a/ ) && record.getValue( "009", "g" ).match( /xx/ ) ) {
                    index.pushField( "dkcclterm.ma", "b\u00E5" );
                }
                if ( "p" === String( subField.value ) && field.getValue( "u" ).match( /c/ ) ) {
                    index.pushField( "dkcclterm.ma", "p\u00f8" );
                }
                if ( "p" === String( subField.value ) && record.getValue( "004", "a" ).match( /e/ ) ) {
                    index.pushField( "dkcclterm.ma", "pf" );
                }
            } );
            field.eachSubFieldMap( subfieldMap );
        } );

        Log.trace( "Leaving: DkcclTermMa.createDkcclFieldsMaFrom008" );

    }


    /**
     * Method that creates ccl term index fields 'ma' from field 009.
     *
     *
     * @type {function}
     * @syntax DkcclTermMa.createDkcclFieldsMaFrom009( index, map, record )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @param {Record} record
     * @return {Object} index with added fields
     * @name DkcclTermMa.createDkcclFieldsMaFrom009
     * @function
     */
    function createDkcclFieldsMaFrom009( index, map, record ) {

        Log.trace( "Entering: DkcclTermMa.createDkcclFieldsMaFrom009" );

        //Using from record:
        // 009 g

        map.put( "009", function( field ) {
            field.eachSubField( /[ab]/, function( field, subField ) {
                use( "DkcclTermIndex" );
                var value = DkcclTermIndex.translateGMBCode( subField.value );
                __addToMaIndexIfValueExists( index, value );

                if ( String( subField.value ).match( /s/ ) && record.getValue( "009", "g" ).match( /xc/ ) ) {
                    index.pushField( "dkcclterm.ma", "sc" );
                }
                if ( String( subField.value ).match( /s/ ) ) {
                    record.eachField( "009", function( field ) {
                        field.eachSubField( "g", function( field, subField ) {
                            if ( "xh" === String( subField.value ) ) {
                                index.pushField( "dkcclterm.ma", "sb" );
                            } else if ( "xk" === String( subField.value ) ) {
                                index.pushField( "dkcclterm.ma", "sg" );
                            }
                        } );
                    } );
                }
            } );
            field.eachSubField( "g", function( field, subField ) {
                if ( String( subField.value ) !== "xf" ) {
                    index.pushField( "dkcclterm.ma", subField.value );
                } else if ( String( subField.value ) === "xf" ) {
                    index.pushField( "dkcclterm.ma", "tk" );
                }

            } );
            field.eachSubField( "h", function( field, subField ) {
                index.pushField( "dkcclterm.ma", subField.value );
            } );
        } );

        Log.trace( "Leaving: DkcclTermMa.createDkcclFieldsMaFrom009" );

    }

    /**
     * Method that creates ccl term index fields 'ma' from field 014.
     *
     *
     * @type {function}
     * @syntax DkcclTermMa.createDkcclFieldsMaFrom014( index, map )
     * @param {Object} index the index to add fields to
     * @param {MatchMap} map The map to register handler methods in
     * @return {Object} index with added fields
     * @name DkcclTermMa.createDkcclFieldsMaFrom014
     * @function
     */
    function createDkcclFieldsMaFrom014( index, map ) {

        Log.trace( "Entering: DkcclTermMa.createDkcclFieldsMaFrom014" );

        map.put( "014", function( field ) {
            field.eachSubField( "x", function( field, subField ) {
                index.pushField( "dkcclterm.ma", subField.value );
            } );
        } );

        Log.trace( "Leaving: DkcclTermMa.createDkcclFieldsMaFrom014" );

    }


    /**
     *  Helper method that finds out if a record is an ebook (used to create dkcclterm.ma)
     *  see http://wiki.dbc.dk/bin/view/Data/FormatImp008w for guidelines
     *
     *  @type method
     *  @syntax DkcclTermMa.isEbook( record )
     *  @param {Record} record input record
     *  @return {Boolean} true if record is an eBook
     *  @name DkcclTermMa.isEbook
     *  @method
     */
    function isEbook( record ) {

        Log.trace( "Entering: DkcclTermMa.isEbook" );

        try {

            if ( "1" === record.getValue( "008", "w" ) ) {
                return true;
            }

            var f009 = record.field( "009" );
            var f856 = record.field( "856" );
            if ( "a" === f009.getValue( "a" ) && "xe" === f009.getValue( "g" ) && /BKM|NET/.test( record.getValue( "032", "x" ) ) ) {
                var valuesOf512 = record.getValue( "512" );
                var valueOf856y = record.getValue( "856", "y" );
                var eBookMatch = /(EPUB|PDF|Flash)-format/;
                if ( eBookMatch.test( valuesOf512 ) || eBookMatch.test( valueOf856y ) ) {
                    return true;
                }
                if ( /download/i.test( valuesOf512 ) && !/downloades i HTML-format/.test( valuesOf512 ) ) {
                    return true;
                }
            }

            if ( /Early English books online/i.test( record.getValue( "440", "a" ) ) ) {
                return true;
            }

            if ( "m" === record.getValue( "008", "t" ) ) {
                var valueOf856u = record.getValue( "856", "u" );
                if ( /ebrary\.com/.test( valueOf856u ) ||
                    /oxfordscholarship\.com/.test( f856 ) ||
                    /sciencedirect\.com/.test( valueOf856u ) ) {
                    return true;
                }
            }

            return ( /bog/i.test( record.getValue( "091", "a" ) ) && /125010|810010/.test( record.getValue( "001", "b" ) ) );

        } finally {
            Log.trace( "Leaving: DkcclTermMa.isEbook" );
        }

    }

    /**
     *  Helper method that that checks if the provided value is not empty string, undefined or null
     *  before it adds it to the provided index as a value to the index dkcclterm.ma
     *
     *  @type function
     *  @syntax DkcclTermMa.__addToMaIndexIfValueExists( index, value )
     *  @param {Object} index the index to add value to if value is not empty string, undefined or null
     *  @param {String|undefined|null} value the value to possibly add to index
     *  @name DkcclTermMa.__addToMaIndexIfValueExists
     *  @function
     */
    function __addToMaIndexIfValueExists( index, value ) {
        if ( value ) {
            index.pushField( "dkcclterm.ma", value );
        }
    }


    return {
        createDkcclFieldsMa: createDkcclFieldsMa,
        createDkcclFieldsMaFrom005: createDkcclFieldsMaFrom005,
        createDkcclFieldsMaFrom008: createDkcclFieldsMaFrom008,
        createDkcclFieldsMaFrom009: createDkcclFieldsMaFrom009,
        createDkcclFieldsMaFrom014: createDkcclFieldsMaFrom014,
        isEbook: isEbook,
        __addToMaIndexIfValueExists: __addToMaIndexIfValueExists
    };

}( );