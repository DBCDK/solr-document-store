/** @file Module that produces scan indexes. */

use( "Log" );
use( "Marc");
use( "XmlUtil" );
use( "XPath" );

EXPORTED_SYMBOLS = [ 'ScanIndex' ];

/**
 * Module with functions that create scanterm and scanphrase index fields (tokenized and untokenized).
 *
 * This module contains functions to create scanterm and scanphrase index fields, especially to be
 * used for creating scanning algoritms
 *
 * @type {namespace}
 * @namespace
 * @name ScanIndex
 */
var ScanIndex = function( ) {

    var that = {};

    /**
     * Method that creates scanterm and scanphrase index fields.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createFields( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name ScanIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml, record ) {

        Log.trace( "Entering: ScanIndex.createFields method" );

        ScanIndex.createCreator( index, commonDataXml );
        ScanIndex.createMainCreator( index, commonDataXml, record );
        ScanIndex.createContributor( index, commonDataXml );
        ScanIndex.createTitle( index, commonDataXml );
        ScanIndex.createMainTitle( index, commonDataXml );
        ScanIndex.createPartOf( index, commonDataXml, record );
        ScanIndex.createSubject( index, commonDataXml );

        Log.trace( "Leaving: ScanIndex.createFields method" );

        return index;

    };

    /**
     * Method that creates scanterm.creator and scanphrase.creator index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name ScanIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: ScanIndex.createCreator method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:creator[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml, function(text) {
            index.pushField( "scanterm.creator", text );
            index.pushField( "scanphrase.creator", text );
        });

        Log.trace( "Leaving: ScanIndex.createCreator method" );

        return index;

    };

    /**
     * Dummy Method for documenting where values of scanphrase.invCreator (inverted creator) come from
     * Currently the index corresponds to dkcclphrase.lfo
     * See code in DkcclPhraseIndex.createLfo for actual data handling
     *
     * @type{method}
     * @syntax DkcclPhraseIndex.createInvCreator( index )
     * @param {Object} index
     * @return {Object} the unchanged index
     * @name DkcclPhraseIndex.createInvCreator
     */
    that.createMainCreator = function( index ){
        Log.trace( "Entering: ScanIndex.createInvCreator method" );
        //see DkcclPhraseIndex.createDkcclLpoIndexFields
        Log.debug( "values in scanphrase.invCreator are created by copying values from dkcclphrase.lfo in solr" );
        Log.trace( "Leaving: ScanIndex.createInvCreator method" );
        return index;
    };


        /**
     * Method that creates scanterm.mainCreator and scanphrase.mainCreator index fields.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createMainCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name ScanIndex.createMainCreator
     * @method
     */
    that.createMainCreator = function( index, commonDataXml, record ) {

        Log.trace( "Entering: ScanIndex.createMainCreatormethod" );
        if( record !== undefined ){
            var map = new MatchMap();
            map.put( "100", "239", function( field ) {
                index.pushField( "scanterm.mainCreator", ScanIndex.createPersonNameSimple( field, "no" ) );
                index.pushField( "scanphrase.mainCreator", ScanIndex.createPersonNameFull( field, "no" ) );
            } );
            map.put( "110", function( field ) {
                field.eachSubField( /A|a|s/, function( field, subField ) {
                    var value = field.getValue( /e|c|i|k|j/, " " );
                    var indexValue = subField.value + " " + value;
                    index.pushField( "scanterm.mainCreator", indexValue );
                    index.pushField( "scanphrase.mainCreator", indexValue );
                } );
            } );
            record.eachFieldMap( map );
        }

        Log.trace( "Leaving: ScanIndex.createMainCreator method" );

        return index;

    };

    /**
     * Dummy Method for documenting where values of scanphrase.invMainCreator (inverted mainCreator) come from
     * Currently the index corresponds to dkcclphrase.lpo
     * See code in DkcclPhraseIndex.createLpo for actual data handling
     *
     * @type{method}
     * @syntax DkcclPhraseIndex.createInvMainCreator( index )
     * @param {Object} index
     * @return {Object} the unchanged index
     * @name DkcclPhraseIndex.createInvMainCreator
     */
    that.createInvMainCreator = function( index ){
        Log.trace( "Entering: ScanIndex.createInvMainCreator method" );
        //see DkcclPhraseIndex.createDkcclLpoIndexFields
        Log.debug( "values in sanphrase.invMainCreator are created by copying values from dkcclphrase.lpo in solr" );
        Log.trace( "Leaving: ScanIndex.createInvMainCreator method" );
        return index;
    };

    /**
     * Method that creates scanterm.contributor and scanphrase.contributor index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createContributor( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name ScanIndex.createContributor
     * @method
     */
    that.createContributor = function( index, commonDataXml ) {

        Log.trace( "Entering: ScanIndex.createContributor method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:contributor", commonDataXml, function(text) {
            index.pushField( "scanterm.contributor", text );
            index.pushField( "scanphrase.contributor", text );
        });
        XPath.forEachNodeText("/*/dkabm:record/dc:creator[ not(@xsi:type = 'oss:sort')]", commonDataXml, function(text) {
            index.pushField( "scanterm.contributor", text );
            index.pushField( "scanphrase.contributor", text );
        });
        Log.trace( "Leaving: ScanIndex.createContributor method" );

        return index;

    };

    /**
     * Method that creates scanterm.title and scanphrase.title index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name ScanIndex.createTitle
     * @method
     */
    that.createTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: ScanIndex.createTitle method" );

        var title;

        XPath.forEachNodeText("/*/dkabm:record/dc:title", commonDataXml, function(text) {
            title = text.replace( / ; .*/g, "" );
            index.pushField( "scanterm.title", title );
            index.pushField( "scanphrase.title", title );
        });
        XPath.forEachNodeText("/*/dkabm:record/dcterms:alternative", commonDataXml, function(text) {
            index.pushField( "scanterm.title", text );
            index.pushField( "scanphrase.title", text );
        });
        XPath.forEachNodeText("/*/dkabm:record/dc:source", commonDataXml, function(text) {
            title = text.replace( / ; .*/g, "" );
            index.pushField( "scanterm.title", title );
            index.pushField( "scanphrase.title", title );
        });

        Log.trace( "Leaving: ScanIndex.createTitle method" );

        return index;

    };

    /**
     * Method that creates scanterm.mainTitle and scanphrase.mainTitle index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createMainTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name ScanIndex.createMainTitle
     * @method
     */

    that.createMainTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: ScanIndex.createMainTitle method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series' ) ]", commonDataXml, function(text) {
            index.pushField( "scanterm.mainTitle", text );
            index.pushField( "scanphrase.mainTitle", text );
        });
        Log.trace( "Leaving: ScanIndex.createMainTitle method" );

        return index;
    };


    /**
     * Method that creates scanterm.subject and scanphrase.subject index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name ScanIndex.createSubject
     * @method
     */

    that.createSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: ScanIndex.createSubject method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:subject[ not( @xsi:type = 'dkdcplus:DK5' ) and not( @xsi:type = 'dkdcplus:DK5-Text' )]", commonDataXml, function(text) {
            index.pushField( "scanterm.subject", text );
            index.pushField( "scanphrase.subject", text );
        });
        XPath.forEachNodeText("/*/dkabm:record/dcterms:spatial", commonDataXml, function(text) {
            index.pushField( "scanterm.subject", text );
            index.pushField( "scanphrase.subject", text );
        });

        XPath.forEachNodeText("/*/dkabm:record/dcterms:temporal", commonDataXml, function(text) {
            index.pushField( "scanterm.subject", text );
            index.pushField( "scanphrase.subject", text );
        });

        Log.trace( "Leaving: ScanIndex.createSubject method" );

        return index;

    };


    /**
     * Method that creates scanterm.partOf and scanphrase.partOf index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax ScanIndex.createPartOf( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name ScanIndex.createPartOf
     * @method
     */

    that.createPartOf = function( index, commonDataXml, record ) {

        Log.trace( "Entering: ScanIndex.createPartOf method" );

        var value = "";
        var extraValue = "";

        if ( record !== undefined) {
            record.eachField( "557", function( field ) {
                field.eachSubField("\u00e6", function ( field, subfield ) {
                    extraValue = ". " + subfield.value;
                } );
                field.eachSubField( "a", function ( field, subfield ) {
                    if ( subfield.value.match( /,/ ) ) {
                        value = subfield.value;
                    }
                } );
            } );
        }

        XPath.forEachNodeText("/*/dkabm:record/dcterms:isPartOf[ @xsi:type = 'dkdcplus:albumTitle' or not( @xsi:type )]", commonDataXml, function(text) {
            if ( value === "" ) {
                value = text.replace( /(.*)(, .*)/, "$1" );
                value = value.replace( /(.*)(, .*)/, "$1" );
            }
            index.pushField( "scanterm.partOf", value + extraValue   );
            index.pushField( "scanphrase.partOf", value + extraValue );
        } );

        Log.trace( "Leaving: ScanIndex.createPartOf method" );

        return index;

    };

    /**
     * Method that creates a string containing the name of a person.
     *
     * @type {method}
     * @syntax ScanIndex.createPersonNameSimple( field, inv )
     * @param {String} field A specific field in the marc record
     * @param {String} inv A string ("yes" or "no") determining whether the name is to be inverted
     * @return {String} A string containing the person name
     * @method
     * @name ScanIndex.createPersonNameSimple
     */
    that.createPersonNameSimple = function( field, inv ) {

    	Log.trace( "Entering: ScanIndex.createPersonNameSimple function" );

        var first = field.getValue( "h" );
        var last = field.getValue( "a" );

    	if ( inv === "no" ) {
    		var personName = "";
    		if ( first !== "" ) {
    			personName = first + " " + last;
    		} else {
    			personName = last;
    		}
    	} else {
    		var personName = "";
    		if ( first !== "" ) {
    			personName = last + ", " + first;
    		} else {
    			personName = last;
    		}

        }

    	Log.trace("Leaving: ScanIndex.createPersonNameSimple function");

    	return personName;

    };


    /**
     * Method that creates a string containing the name of a person plus date of birth etc..
     *
     * @type {method}
     * @syntax ScanIndex.createPersonNameFull( field, inv )
     * @param {String} field A specific field in the marc record
     * @param {String} inv A string ("yes" or "no") determining whether the name is to be inverted
     * @return {String} A string containing the value
     * @method
     * @name ScanIndex.createPersonNameFull
     */
    that.createPersonNameFull = function( field, inv ) {

    	Log.trace("Entering: ScanIndex.createPersonNameFull function");

    	var first = field.getValue( "h" );
        var last = field.getValue( "a" );

        var birth = field.getValue( "c" );
        if ( birth !== "" ) {
            birth = " (" + birth + ")";
        }
        var rest = field.getValue( /e|f/, " " );
        if ( rest !== "" ) {
            rest = " " + rest;
        }

    	if ( inv === "yes" ) {
    		if ( first !== "" ) {
    			last = last + ", ";
    		}
    		//var birth = field.getValue( "c" );
    		//if ( birth !== "" ) {
    		//	birth = " (" + birth + ")";
    		//}
    		//var rest = field.getValue( /e|f/, " " );
    		//if ( rest !== "" ) {
    		//	rest = " " + rest;
    		//}

    		var fullName = last + first + birth + rest;

    	} else {
    		if ( first !== "" ) {
    			last = " " + last;
    		}
    		//var birth = field.getValue( "c" );
    		//if ( birth !== "" ) {
    		//	birth = " (" + birth + ")";
    		//}
    		//var rest = field.getValue( /e|f/, " " );
    		//if ( rest !== "" ) {
    		//	rest = " " + rest;
    		//}

    		var fullName = first + last + birth + rest;

    	}

    	Log.trace("Leaving: ScanIndex.createPersonNameFull function");

    	return fullName;

    };


    return that;

}( );
