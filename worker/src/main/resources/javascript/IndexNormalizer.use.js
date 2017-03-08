use( "Index" );
use( "Log" );

EXPORTED_SYMBOLS = [ 'IndexNormalizer' ];

/**
 * Module with function for normalizing data in index fields.
 *
 * This module contains functions to normalize data.
 *
 * @type {namespace}
 * @namespace
 * @name IndexNormalizer
 */
var IndexNormalizer = function( ) {

    /**
     * Method that removes unwanted characters from values in an index.
     *
     * Removes whitespaces at the end of the index line, currency sign aka
     * 'skildpadde' and square brackets
     *
     * @type {method}
     * @syntax IndexNormalizer.normalizeValues( index )
     * @param {Object} index Array of index objects with a name and a value
     * @return {Object} Array of normalized index objects
     * @name IndexNormalizer.normalizeValues
     * @method
     */
    function normalizeValues( index ) {

        var normalizedIndex = Index.newIndex();

        for ( var i = 0 ; i < index.length; i++ ) {
            var value = index[ i ].value;
            if ( "" !== value && undefined !== value ) {
                var name = index[ i ].name;
                value = value.replace( /\u00a4|\[|\]|\\| $/g, "" );
                //Log.debug( "FIELD: ", name, "=", value );
                normalizedIndex.pushField( name, value );
            }
        }
        return normalizedIndex;

    }

    return {
        normalizeValues: normalizeValues
    };

}( );

