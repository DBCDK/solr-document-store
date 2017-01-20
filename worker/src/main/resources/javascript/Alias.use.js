/** @file Module that gets indexing alias. */

use( "XPath" );

EXPORTED_SYMBOLS = [ 'Alias' ];

/**
 * Module with function that retrieves the indexing alias.
 * 
 * Contains function to retrieve indexing alias from admin data 
 * 
 * @type {namespace}
 * @namespace 
 * @name Alias
 */

var Alias = function( ) {

    var that = {};

    /**
     * Method that retrieves the indexing alias.
     * 
     * 
     * @type {method}
     * @syntax Alias.getAlias( commonDataXml )
     * @param {Document} commonDataXml The XML from which to retrieve the indexing alias
     * @return {String} either the indexing alias or an empty string if the alias is not valid
     * @name Alias.getAlias
     * @method
     */
    that.getAlias = function( commonDataXml ) {

        var indexingAlias = XPath.selectText( "/*/adminData/indexingAlias", commonDataXml );

        Log.debug( "Indexing alias :'", indexingAlias, "'" );

        switch ( indexingAlias ) {
            case "danmarcxchange":
            case "review":
            case "dkabm":
                return indexingAlias;
                break;
            default:
                throw "Alias: '" + indexingAlias + "' is not valid";
                return "";
                break;
        }
    };

    return that;

}( );

