use( "Marc" );
use( "Log" );
use( "Index" );
use( "DkcclPhraseIndex" );
use( "TermIndex" );
use( "XmlUtil" );
use( "XPath" );

EXPORTED_SYMBOLS = [ 'PhraseIndex' ];

/**
 * Module with functions that create phrase index fields (untokenized).
 *
 * This module contains functions to create untokenized phrase index
 * fields
 *
 * @type {namespace}
 * @namespace
 * @name PhraseIndex
 */
var PhraseIndex = function( ) {

    var that = {};

    /**
     * Method that creates phrase index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createFields( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Document} dcDataXml Xml object containing dublin core data from object being indexed
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @example PhraseIndex.createFields( index, commonDataXml )
     * @name PhraseIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml, dcDataXml, record ) {

        Log.trace( "Entering: PhraseIndex.createFields method" );

        // Concatenated types
        var type = String(XPath.selectMultipleText( "/*/dc:type", dcDataXml ) );

        if ( type.match( /WORK:literature/ ) ) {
            PhraseIndex.createOriginalTitle( index, commonDataXml, record );
        }
        PhraseIndex.createCreator( index, commonDataXml, record );
        PhraseIndex.createShelf( index, commonDataXml );
        PhraseIndex.createSubject( index, commonDataXml, record );
        PhraseIndex.createTitleSeries( index, commonDataXml );
        PhraseIndex.createTitleFromSeries( index, commonDataXml );
        PhraseIndex.createType( index, commonDataXml );
        PhraseIndex.createGenre( index, commonDataXml );
        PhraseIndex.createAudience( index, commonDataXml );
        PhraseIndex.createTitle( index, commonDataXml, record );

        Log.trace( "Leaving: PhraseIndex.createFields method" );

        return index;

    };

    /**
     * Method that creates phrase index fields for reviews.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewFields( index, commonDataXml, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the review
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewFields
     * @method
     */
    that.createReviewFields = function( index, commonDataXml, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewFields method" );

        PhraseIndex.createReviewedCreator( index, reviewedDataXml );
        PhraseIndex.createReviewedTitle( index, reviewedDataXml );
        PhraseIndex.createReviewedPublisher( index, reviewedDataXml );
        PhraseIndex.createReviewedIdentifier( index, reviewedDataXml );
        PhraseIndex.createReviewSubject( index, reviewedDataXml );
        PhraseIndex.createReviewer( index, commonDataXml );

        Log.trace( "Leaving: PhraseIndex.createReviewFields method" );

        return index;

    };

    /**
     * Method that creates phrase index fields for reviews based on DKABM.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewFieldsDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the review
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewFieldsDkabm
     * @method
     */
    that.createReviewFieldsDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewFieldsDkabm method" );

        PhraseIndex.createReviewedCreatorDkabm( index, commonDataXml );
        PhraseIndex.createReviewedTitleDkabm( index, commonDataXml );
        PhraseIndex.createReviewedIdentifierDkabm( index, commonDataXml );
        PhraseIndex.createReviewSubjectDkabm( index, commonDataXml );
        PhraseIndex.createReviewer( index, commonDataXml );

        Log.trace( "Leaving: PhraseIndex.createReviewFieldsDkabm method" );

        return index;

    };

    /**
     * Method that creates phrase.creator index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createCreator method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator", commonDataXml, function( text ) {
            index.pushField( "phrase.creator", text );
        } );

        XPath.forEachNodeText( "/*/dkabm:record/dc:contributor", commonDataXml, function( text ) {
            index.pushField( "phrase.creator", text );
        } );

        //dkcclphrase.lfo index values are copied in solr  (see solr-config/schema.xml)

        Log.trace( "Leaving: PhraseIndex.createCreator method" );

        return index;

    };

    /**
     * Method that creates phrase.originalTitle index fields from input data.
     *
     * Only if the record is from DBC is the title (245) used as original
     * title
     *
     * @type {method}
     * @syntax PhraseIndex.createOriginalTitle( index, inputXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name PhraseIndex.createOriginalTitle
     * @method
     */
    that.createOriginalTitle = function( index, commonDataXml, record ) {

        Log.trace( "Entering: PhraseIndex.createOriginalTitle method" );

        if ( record !== undefined ) {
            var found = false;
            record.eachField( "241", function( field ) {
                field.eachSubField( "a", function ( field, subfield ) {
                    index.pushField( "phrase.originalTitle", subfield.value );
                    found = true;
                } );
            } );

            //TODO: Find out if this should be corrected or deleted;
            //This code is wrong! It is intended to check for records from DBC "870970" but the check is done in wrong subfield (001a instead of 001b)
            //Unit test is also wrong.
            if ( !found && record.getFirstValue( "001", "a" ) === "870970" ) {
                index.pushField( "phrase.originalTitle", XPath.selectText( "/*/dkabm:record/dc:title[ 1 ]", commonDataXml ) );
            }
        }

        Log.trace( "Leaving: PhraseIndex.createOriginalTitle method" );

        return index;

    };


    /**
     * Method that creates phrase.shelf index fields from input data.
     *
     * @type {method}
     * @syntax PhraseIndex.createShelf( index, inputXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} inputXml Xml object containing data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createShelf
     * @method
     */
    that.createShelf = function( index, inputXml ) {

        Log.trace( "Entering: PhraseIndex.createShelf method" );

        XPath.forEachNodeText( "/*/dkabm:record/dkdcplus:shelf", inputXml, function( text ) {
            index.pushField( "phrase.shelf", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createShelf method" );

        return index;

    };


    /**
     * Method that creates phrase.subject index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createSubject
     * @method
     */
    that.createSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createSubject method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject", commonDataXml, function( subjectText ) {
            index.pushField( "phrase.subject", subjectText );
        } );

        var elements = XPath.select( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '652' ]", commonDataXml );

        for ( var i = 0 ; i < elements.length; i++ ){
            var child = elements[ i ];
            var name = "";
            var lastName = XPath.selectText( "marcx:subfield [ @code = 'a' ]", child );
            if ( "" !== lastName ) {
                var firstName = XPath.selectText( "marcx:subfield [ @code = 'h' ]", child );
                if ( "" !== firstName ) {
                    name = firstName + " " + lastName;
                } else {
                    name = lastName;
                }
            }

            var nameAddition = "";
            XPath.forEachNodeText( "marcx:subfield[ @code = 'b' or @code = 'c' or @code = 'e' or @code = 'f' ]", child, function( subfieldText ) {
                if ( "" !== nameAddition ) {
                    nameAddition += " " + subfieldText;
                } else {
                    nameAddition = subfieldText;
                }
            } );
            var value = name;
            if ( "" !== nameAddition ) {
                if ( "" !== value ) {
                    value += " " + nameAddition;
                } else {
                    value = nameAddition;
                }
            }
            if ( "" !== value ) {
                index.pushField( "phrase.subject", value );
            }

        }
        //values from dkcclphrase.lem indices are copied in solr  (see solr-config/schema.xml)

        Log.trace( "Leaving: PhraseIndex.createSubject method" );

        return index;

    };

    /**
     * Method that creates material genre phrase.genre index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createGenre( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createGenre
     * @method
     */
    that.createGenre = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createGenre method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:genre' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.genre", text );
        } );
        XPath.forEachNodeText( "/*/adminData/genre", commonDataXml, function( text ) {
            index.pushField( "phrase.genre", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createGenre method" );

        return index;

    };

    /**
     * Method that creates term.title index fields,
     * all dc.title ie: no attribute, dkdcplus:full and dkdcplus:series,
     * and dcterms.alternative.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name PhraseIndex.createTitle
     * @method
     */
    that.createTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createTitle method" );

        var child;
        var elements = XPath.select( "/*/dkabm:record/dc:title", commonDataXml );

        for ( var i = 0 ; i < elements.length; i++ ) {
            child = elements[ i ];
            var text = XmlUtil.getText( child );

            if ( "dkdcplus:series" === XmlUtil.getAttribute( child, "type", XmlNamespaces.xsi) ) {
                // if it is a series title it only makes sense to output the title without number
                text = text.replace( /(.*) ;.*/, "$1" );
            }

            index.pushField( "phrase.title", text );
        }

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:alternative", commonDataXml, function( text ) {
            index.pushField( "phrase.title", text );
        } );

        //dkcclphrase.lti is copied to phrase.title in solr  (see solr-config/schema.xml)

        TermIndex.createTrackTitle( index, commonDataXml, "phrase.title" );

        Log.trace( "Leaving: PhraseIndex.createTitle method" );

        return index;

    };


    /**
     * Method that creates phrase.titleSeries index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createTitleSeries( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createTitleSeries
     * @method
     */
    that.createTitleSeries = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createTitleSeries method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ @xsi:type = 'dkdcplus:series' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.titleSeries", text.replace( /(.*) ;.*/, "$1" ) );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dc:description[ @xsi:type = 'dkdcplus:series' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.titleSeries", text.replace( /.+?: (.*)/, "$1" ).replace( /(.+?) ;.*/, "$1" ) );
        } );

        Log.trace( "Leaving: PhraseIndex.createTitleSeries method" );

        return index;

    };

    /**
     * Method that creates phrase.titleFromSeries index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createTitleFromSeries( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createTitleFromSeries
     * @method
     */
    that.createTitleFromSeries = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createTitleFromSeries method" );

        var dcTitle;

        XPath.forEachNodeText( "/*/dkabm:record/dc:description[ @xsi:type = 'dkdcplus:series' ]", commonDataXml, function( text ) {
            if ( !dcTitle ) {
                dcTitle = XPath.selectText( "/*/dkabm:record/dc:title[ 1 ]", commonDataXml );
            }
            index.pushField( "phrase.titleFromSeries", dcTitle + " " + text.replace( /.+?: (.*)/, "$1" ).replace( /(.+?) ;.*/, "$1" ) );
        } );

        Log.trace( "Leaving: PhraseIndex.createTitleFromSeries method" );

        return index;

    };

    /**
     * Method that creates phrase.type index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createType( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createType
     * @method
     */
    that.createType = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createType method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:type[ @xsi:type = 'dkdcplus:BibDK-Type' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.type", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createType method" );

        return index;

    };

    /**
     * Method that creates phrase.audience index fields.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createAudience( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name PhraseIndex.createAudience
     * @method
     */
    that.createAudience = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createAudience method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:age' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.audience", text );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:pegi' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.audience", text.replace( /PEGI-m\u00e6rkning: /, "Fra " ) + " \u00e5r" );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:medieraad' ]", commonDataXml, function( text ) {
            index.pushField( "phrase.audience", text.replace( /M\u00e6rkning: /, "" ) );
        } );

        Log.trace( "Leaving: PhraseIndex.createAudience method" );

        return index;
    };

    /**
     * Method that creates phrase.reviewedCreator index fields for reviews (creator of the reviewed material).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedCreator( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedCreator
     * @method
     */
    that.createReviewedCreator = function( index, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedCreator method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator", reviewedDataXml, function( text ) {
            index.pushField( "phrase.reviewedCreator", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewedCreator method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedCreator index fields for reviews (creator of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedCreatorDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedCreatorDkabm
     * @method
     */
    that.createReviewedCreatorDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedCreatorDkabm method" );

        index.pushField( "phrase.reviewedCreator", XPath.selectText( "/*/dkabm:record/dc:subject[ 1 ]", commonDataXml ) );

        Log.trace( "Leaving: PhraseIndex.createReviewedCreatorDkabm method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedTitle index fields for reviews (title of the reviewed material).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedTitle( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedTitle
     * @method
     */
    that.createReviewedTitle = function( index, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedTitle method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series') ]", reviewedDataXml, function( text ) {
            index.pushField( "phrase.reviewedTitle", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewedTitle method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedTitle index fields for reviews (creator of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedTitleDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedTitleDkabm
     * @method
     */
    that.createReviewedTitleDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedTitleDkabm method" );

        index.pushField( "phrase.reviewedTitle", XPath.selectText( "/*/dkabm:record/dc:subject[ 2 ]", commonDataXml ) );

        Log.trace( "Leaving: PhraseIndex.createReviewedTitleDkabm method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedPublisher index fields for reviews (publisher of the reviewed material).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedPublisher( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedPublisher
     * @method
     */
    that.createReviewedPublisher = function( index, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedPublisher method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:publisher", reviewedDataXml, function(text) {
            index.pushField( "phrase.reviewedPublisher", text );
        });

        Log.trace( "Leaving: PhraseIndex.createReviewedPublisher method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedIdentifier index fields for reviews (identifier of the reviewed material).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedIdentifier( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedIdentifier
     * @method
     */
    that.createReviewedIdentifier = function( index, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedIdentifier method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:identifier", reviewedDataXml, function( text ) {
            index.pushField( "phrase.reviewedIdentifier", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewedIdentifier method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewedIdentifier index fields for reviews (identifier of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewedIdentifierDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewedIdentifierDkabm
     * @method
     */
    that.createReviewedIdentifierDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewedIdentifierDkabm method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:references", commonDataXml, function( text ) {
            index.pushField( "phrase.reviewedIdentifier", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewecreateReviewedIdentifierDkabmdIdentifier method" );

        return index;

    };

    /**
     * Method that creates phrase.reviewer index fields for reviews (creator of the review).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewer( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewer
     * @method
     */
    that.createReviewer = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewer method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator", commonDataXml, function( text ) {
            index.pushField( "phrase.reviewer", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewer method" );

        return index;

    };

    /**
     * Method that creates phrase.subject index fields for reviews (title of the reviewed material as subject).
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewSubject( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewSubject
     * @method
     */
    that.createReviewSubject = function( index, reviewedDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewSubject method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series') ]", reviewedDataXml, function( text ) {
            index.pushField( "phrase.subject", text );
        } );

        Log.trace( "Leaving: PhraseIndex.createReviewSubject method" );

        return index;

    };

    /**
     * Method that creates phrase.subject index fields for reviews (title of the reviewed material as subject) from DKABM data.
     *
     *
     * @type {method}
     * @syntax PhraseIndex.createReviewSubjectDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name PhraseIndex.createReviewSubjectDkabm
     * @method
     */
    that.createReviewSubjectDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: PhraseIndex.createReviewSubjectDkabm method" );

        index.pushField( "phrase.subject", XPath.selectText( "/*/dkabm:record/dc:subject[ 2 ]", commonDataXml ) );

        Log.trace( "Leaving: PhraseIndex.createReviewSubjectDkabm method" );

        return index;

    };

    return that;

}( );
