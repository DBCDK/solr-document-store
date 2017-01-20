/** @file Module that produces ranking indexes. */

use( "Log" );
use( "XmlUtil" );
use( "XPath" );

EXPORTED_SYMBOLS = [ 'RankIndex' ];

/**
 * Module with functions that create rankterm and rankphrase index fields (tokenized and untokenized).
 * 
 * This module contains functions to create rankterm and rankphrase index fields, especially to be
 * used for creating ranking algoritms
 * 
 * @type {namespace}
 * @namespace 
 * @name RankIndex
 */
var RankIndex = function( ) {

    var that = {};

    /**
     * Method that creates rankterm and rankphrase index fields.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createFields( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name RankIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml ) {

        Log.trace( "Entering: createFields method" );

        RankIndex.createCreator( index, commonDataXml );
        RankIndex.createContributor( index, commonDataXml );
        RankIndex.createTitle( index, commonDataXml );
        RankIndex.createAlternativeTitle( index, commonDataXml );
        RankIndex.createPartTitle( index, commonDataXml );
        RankIndex.createSubject( index, commonDataXml );
        RankIndex.createDescription( index, commonDataXml );

        Log.trace( "Leaving: createFields method" );

        return index;

    };

    /**
     * Method that creates rankterm.creator and rankphrase.creator index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: createCreator method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:creator", commonDataXml, function(text) {
            index.pushField( "rankterm.creator", text );
            index.pushField( "rankphrase.creator", text );
        });

        Log.trace( "Leaving: createCreator method" );

        return index;

    };

    /**
     * Method that creates rankterm.contributor and rankphrase.contributor index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createContributor( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createContributor
     * @method
     */
    that.createContributor = function( index, commonDataXml ) {

        Log.trace( "Entering: createContributor method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:contributor", commonDataXml, function(text) {
            index.pushField( "rankterm.contributor", text );
            index.pushField( "rankphrase.contributor", text );
        });

        Log.trace( "Leaving: createContributor method" );

        return index;

    };

    /**
     * Method that creates rankterm.title and rankphrase.title index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createTitle
     * @method
     */
    that.createTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: createTitle method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:title", commonDataXml, function(text) {
            index.pushField( "rankterm.title", text );
            index.pushField( "rankphrase.title", text );
        });

        Log.trace( "Leaving: createTitle method" );

        return index;

    };
    
    /**
     * Method that creates rankterm.alternativeTitle and rankphrase.alternativeTitle index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createAlternativeTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createAlternativeTitle
     * @method
     */
    that.createAlternativeTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: createAlternativeTitle method" );

        var child;

        XPath.forEachNodeText("/*/dkabm:record/dcterms:alternative", commonDataXml, function(text) {
            index.pushField( "rankterm.alternativeTitle", text );
            index.pushField( "rankphrase.alternativeTitle", text );
        });

        Log.trace( "Leaving: createAlternativeTitle method" );

        return index;

    };

    /**
     * Method that creates rankterm.partTitle and rankphrase.partTitle index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createPartTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createPartTitle
     * @method
     */
    that.createPartTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: createPartTitle method" );

        XPath.forEachNodeText("/*/dkabm:record/dcterms:hasPart", commonDataXml, function(text) {
            index.pushField( "rankterm.partTitle", text );
            index.pushField( "rankphrase.partTitle", text );
        });

        Log.trace( "Leaving: createPartTitle method" );

        return index;

    };

    /**
     * Method that creates rankterm.subject and rankphrase.subject index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createSubject
     * @method
     */
    that.createSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: createSubject method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:subject", commonDataXml, function(text) {
            index.pushField( "rankterm.subject", text );
            index.pushField( "rankphrase.subject", text );
        });

        XPath.forEachNodeText("/*/dkabm:record/dcterms:spatial", commonDataXml, function(text) {
            index.pushField( "rankterm.subject", text );
            index.pushField( "rankphrase.subject", text );
        });

        XPath.forEachNodeText("/*/dkabm:record/dcterms:temporal", commonDataXml, function(text) {
            index.pushField( "rankterm.subject", text );
            index.pushField( "rankphrase.subject", text );
        });

        Log.trace( "Leaving: createSubject method" );

        return index;

    };

    /**
     * Method that creates rankterm.description and rankphrase.description index fields from DKABM data.
     * 
     * 
     * @type {method}
     * @syntax RankIndex.createDescription( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Xml} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name RankIndex.createDescription
     * @method
     */
    that.createDescription = function( index, commonDataXml ) {

        Log.trace( "Entering: createDescription method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:description", commonDataXml, function(text) {
            index.pushField( "rankterm.description", text );
            index.pushField( "rankphrase.description", text );
        });

        XPath.forEachNodeText("/*/dkabm:record/dcterms:abstract", commonDataXml, function(text) {
            index.pushField( "rankterm.description", text );
            index.pushField( "rankphrase.description", text );
        });

        Log.trace( "Leaving: createDescription method" );

        return index;

    };

    return that;

}( );
