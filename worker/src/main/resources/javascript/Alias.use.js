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

    /**
     * Method determines if the provided datastream has admin data and indexing alias
     * 
     * 
     * @type {method}
     * @syntax Alias.hasAlias( datastreamXml )
     * @param {Document} datastreamXml The XML from which to lookup the indexing alias
     * @return {boolean } true if the stream contains adminData and indexingAlias, else false
     * @name Alias.hasAlias
     * @method
     */
    function hasAlias( datastreamXml ) {

        Log.trace( "Entering Alias.hasAlias:", XmlUtil.logXmlString( datastreamXml ) );

        var hasIndexingAlias = XPath.select( "boolean( /*/adminData/indexingAlias )", datastreamXml );

        Log.debug( "Has indexing alias :", hasIndexingAlias );
        
        return hasIndexingAlias;
    }

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
    function getAlias( commonDataXml ) {

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
    }

    return {
        hasAlias: hasAlias,
        getAlias: getAlias
    };

}( );

