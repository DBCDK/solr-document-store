use( "XmlNamespaces" );
use( "XmlUtil" );
use( "XPath" );
use( "Tables" );
use( "Log" );
use( "DkcclTermIndex");

EXPORTED_SYMBOLS = [ 'TermIndex' ];

/**
 * Module with functions that create term index fields (tokenized).
 *
 * This module contains functions to create tokenized term index fields
 *
 * @type {namespace}
 * @namespace
 * @name TermIndex
 */
var TermIndex = function( ) {

    var that = {};

    /**
     * Method that creates term index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createFields( index, commonDataXml, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Document} dcDataXml Xml object containing dublin core data from object being indexed
     * @param {Record} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml, dcDataXml, record ) {

        Log.trace( "Entering: TermIndex.createFields method" );

        // Concatenated types
        var type = String( XPath.selectMultipleText( "/*/dc:type", dcDataXml ) );

        TermIndex.createCreator( index, commonDataXml, record );
        TermIndex.createMainCreator( index, commonDataXml, record );
        if ( type.match( /WORK:movie/ ) ) {
            TermIndex.createNationality( index, commonDataXml, record );
        }
        TermIndex.createCategory( index, commonDataXml );
        if ( type.match( /WORK:literature/ ) ) {
            TermIndex.createLiteraryForm( index, commonDataXml, record );
        }
        TermIndex.createType( index, commonDataXml );
        TermIndex.createAccessType( index, commonDataXml );
        TermIndex.createWorkType( index, dcDataXml );
        TermIndex.createPrimaryWorkType( index, dcDataXml );
        TermIndex.createLanguage( index, commonDataXml, record );
        TermIndex.createPrimaryLanguage( index, commonDataXml, record );
        TermIndex.createTypeCategory( index, commonDataXml, record );
        TermIndex.createGenre( index, commonDataXml );
        TermIndex.createAudience( index, commonDataXml );
        TermIndex.createAudienceRecommended( index, commonDataXml, "term.audienceRecommended" );
        TermIndex.createAudienceRestricted( index, commonDataXml, "term.audienceRestricted" );
        TermIndex.createTitle( index, commonDataXml, record, "term.title" );
        TermIndex.createMainTitle( index, commonDataXml, record);
        TermIndex.createSource( index, commonDataXml );
        TermIndex.createAcSource( index, commonDataXml );
        TermIndex.createSubject( index, commonDataXml );
        TermIndex.createDate( index, commonDataXml );
        //calling dummy method for logging
        TermIndex.createDateFirstEdition();
        TermIndex.createPublisher( index, commonDataXml, record );
        TermIndex.createIdentifier( index, commonDataXml );
        TermIndex.createIsbn( index, commonDataXml );
        TermIndex.createDescription( index, commonDataXml );
        TermIndex.createTrackTitle( index, commonDataXml, "term.trackTitle" );
        TermIndex.createPartOf( index, commonDataXml ); //LSK: inserted missing call to this function 2017-01-24
        TermIndex.createOnlineAccess( index, commonDataXml, record );

        Log.trace( "Leaving: TermIndex.createFields method" );

        return index;

    };

    /**
     * Method that creates term index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createFieldsDkabm( index, commonDataXml, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Document} dcDataXml Xml object containing dublin core data from object being indexed
     * @return {Object} The updated index object
     * @name TermIndex.createFieldsDkabm
     * @method
     */
    that.createFieldsDkabm = function( index, commonDataXml, dcDataXml ) {

        Log.trace( "Entering: TermIndex.createFieldsDkabm method" );

        // Concatenated types
        var type = String(XPath.selectMultipleText("/*/dc:type", dcDataXml));

        TermIndex.createCreator( index, commonDataXml );
        TermIndex.createMainCreator( index, commonDataXml );
        TermIndex.createCategory( index, commonDataXml );
        TermIndex.createType( index, commonDataXml );
        TermIndex.createAccessType( index, commonDataXml );
        TermIndex.createWorkType( index, dcDataXml );
        TermIndex.createPrimaryWorkType( index, dcDataXml );
        TermIndex.createLanguage( index, commonDataXml );
        TermIndex.createPrimaryLanguage( index, commonDataXml );
        TermIndex.createTypeCategoryDkabm( index, commonDataXml );
        TermIndex.createGenre( index, commonDataXml );
        TermIndex.createLiteraryForm( index, commonDataXml );
        TermIndex.createTitle( index, commonDataXml );
        TermIndex.createMainTitle( index, commonDataXml);
        TermIndex.createSource( index, commonDataXml );
        TermIndex.createAcSource( index, commonDataXml );
        TermIndex.createSubject( index, commonDataXml );
        TermIndex.createDate( index, commonDataXml );
        TermIndex.createPublisher( index, commonDataXml );
        TermIndex.createIdentifier( index, commonDataXml );
        TermIndex.createIsbn( index, commonDataXml );
        TermIndex.createDescription( index, commonDataXml );
        TermIndex.createTrackTitle( index, commonDataXml, "term.trackTitle" );
        TermIndex.createPartOf( index, commonDataXml );
        TermIndex.createOnlineAccess( index, commonDataXml );
        if ( type.match( /WORK:movie/ ) ) {
            TermIndex.createNationality( index, commonDataXml );
        }

        Log.trace( "Leaving: TermIndex.createFieldsDkabm method" );

        return index;

    };

    /**
     * Method that creates term index fields for reviews.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewFields( index, commonDataXml, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the review
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name TermIndex.createReviewFields
     * @method
     */
    that.createReviewFields = function( index, commonDataXml, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewFields method" );

        TermIndex.createReviewedCreator( index, reviewedDataXml );
        TermIndex.createReviewedTitle( index, reviewedDataXml );
        TermIndex.createReviewedPublisher( index, reviewedDataXml );
        TermIndex.createReviewedIdentifier( index, reviewedDataXml );
        TermIndex.createReviewSubject( index, reviewedDataXml );
        TermIndex.createReviewer( index, commonDataXml );

        Log.trace( "Leaving: TermIndex.createReviewFields method" );

        return index;

    };

    /**
     * Method that creates term index fields for reviews based on DKABM.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewFieldsDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the review
     * @return {Object} The updated index object
     * @name TermIndex.createReviewFieldsDkabm
     * @method
     */
    that.createReviewFieldsDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewFieldsDkabm method" );

        TermIndex.createReviewedCreatorDkabm( index, commonDataXml );
        TermIndex.createReviewedTitleDkabm( index, commonDataXml );
        TermIndex.createReviewedIdentifierDkabm( index, commonDataXml );
        TermIndex.createReviewSubjectDkabm( index, commonDataXml );
        TermIndex.createReviewer( index, commonDataXml );

        Log.trace( "Leaving: TermIndex.createReviewFieldsDkabm method" );

        return index;

    };


    /**
     * Method that creates term.defaultLocalData index fields based on local data.
     *
     * Only used with datawell customer data
     * TODO: This method is never called or tested. Can it be removed or is it needed in the future?
     *
     * @type {method}
     * @syntax TermIndex.createDefaultLocalData( index, localDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} localDataXml Xml object containing local data
     * @return {Object} The updated index object
     * @name TermIndex.createDefaultLocalData
     * @method
     */
    that.createDefaultLocalData = function( index, localDataXml ) {

        Log.trace( "Entering: TermIndex.createDefaultLocalData method" );

        XPath.forEachNodeText( "/*/marcx:record/marcx:datafield/marcx:subfield", localDataXml, function( text ) {
            index.pushField( "term.defaultLocalData", text );
        } );

        Log.trace( "Leaving: TermIndex.createDefaultLocalData method" );

        return index;

    };

    /**
     * Method that creates term.creator index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createCreator( index, commonDataXml, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Record} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createCreator method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator", commonDataXml, function( text ) {
            index.pushField( "term.creator", text );
        } );

        XPath.forEachNodeText( "/*/dkabm:record/dc:contributor", commonDataXml, function( text ) {
            index.pushField( "term.creator", text );
        } );

        if ( undefined !== record ) {
            record.eachField( "245", function( field ) {
                field.eachSubField( "f", function ( field, subField ) {
                    var value = TermIndex.cleanDataForCreator( subField.value );
                    index.pushField( "term.creator", value );
                } );

            } );
           // dkcclterm.fo index values copied to term.creator in solr  (see solr-config/schema.xml)
        }
        Log.trace( "Leaving: TermIndex.createCreator method" );

        return index;

    };

    /**
     * Method that creates term.mainCreator index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createMainCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createMainCreator
     * @method
     */
    that.createMainCreator = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createMainCreator method" );

        if ( undefined !== record ) {
            DkcclTermIndex.callIndexMethod( DkcclTermIndex.createDkcclFieldsPo, index, record, "term.mainCreator" );
        } else {
            XPath.forEachNodeText("/*/dkabm:record/dc:creator", commonDataXml, function(text) {
                index.pushField( "term.mainCreator", text );
            } );
        }

        Log.trace( "Leaving: TermIndex.createMainCreator method" );

        return index;

    };

    /**
     * Method that cleans data consisting of creator names as well as a lot of other words.
     *
     *
     * @type {method}
     * @syntax TermIndex.cleanDataForCreator( value )
     * @param {String} value The value to clean
     * @return {String} Cleaned value
     * @example TermIndex.cleanDataForCreator( "eingeleitet und fuer die deutsche Ausgabe eingerichtet von Hartmut Mehringer" )
     * @name TermIndex.cleanDataForCreator
     * @method
     */
    that.cleanDataForCreator = function( value ) {

        Log.trace( "Entering: TermIndex.cleanDataForCreator method" );

        //common special characters
        value = value.replace( /\u00c2\u00a4/g, "" );
        value = value.replace( /\u00a4/g, "" );
        value = value.replace( /\[/g, "" );
        value = value.replace( /\]/g, "" );

        //common pre-name formulations
        value = value.replace( /^[^:]+:\s?/, "" );
        value = value.replace( /^.* af? |^.* av? |^.* ved? /, "" );
        value = value.replace( /^.* by? /, "" );
        value = value.replace( /^.* von? /, "" );
        value = value.replace( /^produit.* par? |^producteur |^chef op.rateur /i, "" );
        value = value.replace( /^.* di? /, "" );

        //common post-name formulations
        value = value.replace( / ?\.\.\. et al./, "" );

        Log.trace( "Leaving: TermIndex.cleanDataForCreator method" );

        return value;

    };

    /**
     * Method that creates term.category index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createCategory
     * @method
     */
    that.createCategory = function( index, commonDataXml ) {

        Log.trace( "Entering: createCategory method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience", commonDataXml, function( text ) {
            if ( text.match( /.*materialer/ ) ) {
                index.pushField( "term.category", text );
            }
        } );

        Log.trace( "Leaving: TermIndex.createCategory method" );

        return index;

    };

    /**
     * Method that creates term.language index fields both code and text.
     *
     *
     * @type {method}
     * @syntax TermIndex.createLanguage( index, commonDataXml, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createLanguage
     * @method
     */
    that.createLanguage = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createLanguage method" );

        if ( undefined !== record ) {
            var map = new MatchMap();
            map.put( "008", function( field ) {
                field.eachSubField( "l", function( field, subField ) {
                    var language = subField.value;
                    index.pushField( "term.language", language );
                    index.pushField( "term.language", Tables.languages( language) );
                } );
            } );
            map.put( "041", function( field ) {
                field.eachSubField( /a|p/, function( field, subField ) {  //2017-02-28: LSK removed subfield 'l' as no such subfield exist in field 041
                    var language = subField.value;
                    index.pushField( "term.language", language );
                    index.pushField( "term.language", Tables.languages( language) );
                } );
            } );
            record.eachFieldMap( map );
        } else {
            XPath.forEachNodeText( "/*/dkabm:record/dc:language[ @xsi:type = 'dcterms:ISO639-2' ]", commonDataXml, function( text ) {
                index.pushField( "term.language", text );
                index.pushField( "term.language", Tables.languages( text ) );
            } );
        }

        Log.trace( "Leaving: TermIndex.createLanguage method" );

        return index;

    };

    /**
     * Method that creates term.primaryLanguage index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createPrimaryLanguage( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createPrimaryLanguage
     * @method
     */
    that.createPrimaryLanguage = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createPrimaryLanguage method" );

        if ( undefined !== record ) {
            var field008l = record.getFirstValue( "008", "l" );
            if ( undefined !== field008l ) {
                index.pushField( "term.primaryLanguage", field008l );
            }
        } else {
            XPath.forEachNodeText("/*/dkabm:record/dc:language[ @xsi:type = 'dcterms:ISO639-2' ][ 1 ]", commonDataXml, function(text) {
                index.pushField( "term.primaryLanguage", text );
            } );
        }

        Log.trace( "Leaving: TermIndex.createPrimaryLanguage method" );

        return index;

    };

    /**
     * Method that creates term.literaryForm index fields for literature (term.literaryForm).
     *
     *
     * @type {method}
     * @syntax TermIndex.createLiteraryForm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createLiteraryForm
     * @method
     */
    that.createLiteraryForm = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createLiteraryForm method" );

        XPath.forEachNodeText("/*/adminData/genre", commonDataXml, function( genre ) {

            index.pushField( "term.literaryForm", genre );

            if ( 'fiktion' === genre ) {

                if ( undefined !== record ) {
                    var map = new MatchMap( );
                    map.put( "008", function( field ) {
                        field.eachSubField( "j", function( field, subField ) {
                            switch ( subField.value ) {
                                case "p":
                                    index.pushField( "term.literaryForm", "digte" );
                                    break;
                                case "j":
                                    index.pushField( "term.literaryForm", "noveller" );
                                    break;
                                case "f":
                                    index.pushField( "term.literaryForm", "romaner" );
                                    break;
                            }
                        } );
                    } );
                    map.put( "504", "505", function( field ) {
                        field.eachSubField( "a", function( field, subField ) {
                            var value = subField.value;
                            if ( value.match( /novelle/i ) && !value.match( /novellefilm/i ) ) {
                                index.pushField( "term.literaryForm", "noveller" );
                            }
                            if ( value.match( /^digt/i ) && !value.match( /^digter/i ) ) {
                                index.pushField( "term.literaryForm", "digte" );
                            }
                        } );
                    } );
                    record.eachFieldMap( map );
                }

                var dcType = XPath.selectText( "/*/dkabm:record/dc:type", commonDataXml );
                if ( dcType.match( /Tegneserie/i ) ) {
                    index.pushField( "term.literaryForm", "tegneserier" );
                }
                if ( dcType.match( /Graphic novel/i ) ) {
                    index.pushField( "term.literaryForm", "graphic novels" );
                }
            }

        } );

        Log.trace( "Leaving: TermIndex.createLiteraryForm method" );

        return index;

    };

    /**
     * Method that creates term.nationality index fields for movies (term.nationality).
     *
     *
     * @type {method}
     * @syntax TermIndex.createNationality( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createNationality
     * @method
     */
    that.createNationality = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createNationality method" );

        function __logAndReturn( index ) {
            Log.trace( "Leaving: createNationality method" );
            return index;
        }

        var relevantDk5Notations = [ "77.7", "82", "82.6", "82.7", "84", "85", "87", "88.4171", "88.652", "88.654", "88.813" ];
        var codes = [ ];
        var matchDk5Criteria = false;

        XPath.forEachNodeText("/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DK5' ]", commonDataXml, function(text) {
            if ( -1 < relevantDk5Notations.indexOf( text ) ) {
                codes.push( text );
                matchDk5Criteria = true;
            }
        } );

        if ( !matchDk5Criteria ) {
            __logAndReturn( index );
        }

        var foundNationality = false;
        // If there is a DBC controlled subject for film nationality - use that
        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCO' ]", commonDataXml, function( text ) {
            //filtering values see Bug 20590
            if ( / film$/.test( text ) ) {
                index.pushField( "term.nationality", text );
                foundNationality = true;
            }
        } );

        if ( foundNationality ) {
            __logAndReturn( index );
        }

        if ( undefined !== record ) {

            var description = "";
            //if description does not match tale we can stop here
            record.eachField( '508', function(field ) {
                field.eachSubField( /./, function( field, subfield ) {
                    var text = subfield.value;
                    //if there are several 508 matching tale description will be overwritten, could this be a problem?
                    if ( text.match( /tale/ ) ) {
                        description = text;
                    }
                } );
            } );

            //if description does not match 'tale' getNationality will return undefined
            if ( "" === description ) {
                __logAndReturn( index );
            }

            // try to establish whether the film is made in USA so that american films don't end up as english films
            var usa = false;
            record.eachField( '512', function( field ) {
                field.eachSubField( "a", function ( field, subfield ) {
                    var text = subfield.value;
                    if ( text.match( /USA/ ) ) {
                        usa = true;
                    }
                } );
            } );

            var language = record.getFirstValue( "008", "l" );
            var nationality = TermIndex.getNationality( language, description, codes, usa );

            if ( nationality ) {
                index.pushField( "term.nationality", nationality );
            } else {
                record.eachField( '041', function (field ) {
                    field.eachSubField( /a|p/, function( field, subfield ) {
                        language = subfield.value;
                        nationality = TermIndex.getNationality( language, description, codes, usa );
                        if ( nationality ) {
                            index.pushField( "term.nationality", nationality );
                        }
                    } );
                } );
            }
        }

        Log.trace( "Leaving: TermIndex.createNationality method" );

        return index;

    };

    /**
     * Method that gets the nationality of a material, based on classification, language and notes.
     *
     *
     * @type {method}
     * @syntax TermIndex.getNationality( language, description, codes, usa )
     * @param {String} language main language of the material
     * @param {String} description Note with possible description of spoken languages
     * @param {Array} codes array of classification codes
     * @param {Object} usa boolean true or false (country of origin)
     * @return {String} The nationality (in Danish)
     * @name TermIndex.getNationality
     * @method
     */
    that.getNationality = function( language, description, codes, usa ) {

        Log.trace( "Entering: TermIndex.getNationality method" );

        var nationality = undefined;

        switch ( language ) {
            case "ara":
                if ( description.match( /^arabisk (.* )?tale/i ) ) {
                    nationality = "arabiske film";
                }
                break;
            case "bos":
                if ( description.match( /^bosnisk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "88.652" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "bosniske film";
                    }
                }
                break;
            case "dan":
                if ( description.match( /^dansk (.* )?tale/i ) ) {
                    nationality = "danske film";
                }
                break;
            case "eng":
                if ( description.match( /^engelsk (.* )?tale/i ) ) {
                    if ( true === usa ) {
                        nationality = "amerikanske film";
                    } else {
                        nationality = "engelske film";
                    }
                }
                break;
            case "fre":
                if ( description.match( /^fransk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "82" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "franske film";
                    }
                }
                break;
            case "hin":
                if ( description.match( /^hindi (.* )?tale/i ) ) {
                    nationality = "indiske film";
                }
                break;
            case "ita":
                if ( description.match( /^italiensk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "82.6" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "italienske film";
                    }
                }
                break;
            case "jpn":
                if ( description.match( /^japansk (.* )?tale/i ) ) {
                    nationality = "japanske film";
                }
                break;
            case "chi":
                if ( description.match( /^kinesisk (.* )?tale/i ) ) {
                    nationality = "kinesiske film";
                }
                break;
            case "kor":
                if ( description.match( /^koreansk (.* )?tale/i ) ) {
                    nationality = "koreanske film";
                }
                break;
            case "nor":
                if ( description.match( /^norsk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "85" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "norske film";
                    }
                }
                break;
            case "urd":
                if ( description.match( /^urdu (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "88.4171" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "pakistanske film";
                    }
                }
                break;
            case "pol":
                if ( description.match( /^polsk (.* )?tale/i ) ) {
                    nationality = "polske film";
                }
                break;
            case "rus":
                if ( description.match( /^russisk (.* )?tale/i ) ) {
                    nationality = "russiske film";
                }
                break;
            case "scc":
                if ( description.match( /^serbisk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "88.654" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "serbiske film";
                    }
                }
                break;
            case "spa":
                if ( description.match( /^spansk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "82.7" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "spanske film";
                    }
                }
                break;
            case "swe":
                if ( description.match( /^svensk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "87" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "svenske film";
                    }
                }
                break;
            case "tur":
                if ( description.match( /^tyrkisk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "88.813" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "tyrkiske film";
                    }
                }
                break;
            case "ger":
                if ( description.match( /^tysk (.* )?tale/i ) ) {
                    if ( -1 < codes.indexOf( "84" ) || -1 < codes.indexOf( "77.7" ) ) {
                        nationality = "tyske film";
                    }
                }
                break;
            default:
                nationality = undefined;
                break;
        }

        Log.trace( "Leaving: TermIndex.getNationality method" );

        return nationality;

    };

    /**
     * Method that creates term.date index fields from dc.date.
     *
     *
     * @type {method}
     * @syntax TermIndex.createDate( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createDate
     * @method
     */
    that.createDate = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createDate method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:date", commonDataXml, function( text ) {
            index.pushField( "term.date", text );
        } );

        Log.trace( "Leaving: TermIndex.createDate method" );

        return index;
    };


    /**
     * Method that creates term.identifier index fields from dc.identifier.
     *
     *
     * @type {method}
     * @syntax TermIndex.createIdentifier( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createIdentifier
     * @method
     */
    that.createIdentifier = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createIdentifier method" );

        var elements = XPath.select( "/*/dkabm:record/dc:identifier", commonDataXml );
        for ( var i = 0 ; i < elements.length; i++ ) {
            var child = elements[ i ];
            var type = XmlUtil.getAttribute( child, "type", XmlNamespaces.xsi );
            var idString = XmlUtil.getText( child );

            if ( type !== undefined && type.match( /ISBN|ISMN|ISSN|UPC/ ) ) {
                index.pushField( "term.identifier", idString.replace( /-/g, "") );
            }
            index.pushField( "term.identifier", idString );
        }

        Log.trace( "Leaving: TermIndex.createIdentifier method" );

        return index;

    };

    /**
     * Method that creates term.isbn index fields from dc.identifier.
     *
     *
     * @type {method}
     * @syntax TermIndex.createIsbn( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createIsbn
     * @method
     */
    that.createIsbn = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createIsbn method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:identifier[ @xsi:type = 'dkdcplus:ISBN' ]", commonDataXml, function( text ) {
            index.pushField( "term.isbn", text.replace( /-/g, "") );
            index.pushField( "term.isbn", text );
        } );

        Log.trace( "Leaving: TermIndex.createIsbn method" );

        return index;

    };

    /**
     * Method that creates term.source index fields from dc.source.
     *
     *
     * @type {method}
     * @syntax TermIndex.createSource( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createSource
     * @method
     */
    that.createSource = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createSource method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:source", commonDataXml, function( text ) {
            index.pushField( "term.source", text );
        } );

        Log.trace( "Leaving: TermIndex.createSource method" );

        return index;

    };

    /**
     * Method that creates term.acSource index fields from ac.source.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAcSource( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createAcSource
     * @method
     */
    that.createAcSource = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createAcSource method" );

        XPath.forEachNodeText( "/*/dkabm:record/ac:source", commonDataXml, function( text ) {
            index.pushField( "term.acSource", text );
        } );

        Log.trace( "Leaving: TermIndex.createAcSource method" );

        return index;

    };

   /**
     * Method that creates term.publisher index fields from dc.publisher.
     *
     *
     * @type {method}
     * @syntax TermIndex.createPublisher( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createPublisher
     * @method
     */
    that.createPublisher = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createPublisher method" );

        var submitter;

        if ( undefined !== record ) {
            submitter = record.getFirstValue( "001", "b" );
            Log.debug( "submitter: ", submitter );
        }

        XPath.forEachNodeText( "/*/dkabm:record/dc:publisher", commonDataXml, function( text ) {
            index.pushField( "term.publisher", text );
            if ( "874310" === submitter || text.match( /(Statens Bibliotek og Trykkeri for Blinde|Danmarks Blindebibliotek|^Nota$)/i ) ) {
                Log.debug( "DBBNOTA" );
                index.pushField( "term.publisher", "DBBNOTA" );
            }
        } );

        Log.trace( "Leaving: TermIndex.createPublisher method" );

        return index;

    };

    /**
     * Method that creates term.subject index fields from DKABM.
     *
     *
     * @type {method}
     * @syntax TermIndex.createSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createSubject
     * @method
     */

    that.createSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createSubject method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ not( @xsi:type = 'dkdcplus:genre' ) ]", commonDataXml, function( text ) {
            index.pushField( "term.subject", text );
        } );

        //index field values from dkcclterm.em are copied by solr (see schema.xml)

        Log.trace( "Leaving: TermIndex.createSubject method" );

        return index;

    };

    /**
     * Method that creates term.title index fields,
     * all dc.title ie: no attribute, dkdcplus:full and dkdcplus:series,
     * and dcterms.alternative.
     *
     *
     * @type {method}
     * @syntax TermIndex.createTitle( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createTitle
     * @method
     */

    that.createTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createTitle method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title", commonDataXml, function( text ) {
            index.pushField( "term.title", text );
        } );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:alternative", commonDataXml, function( text ) {
            index.pushField( "term.title", text );
        } );

         //term.trackTitle index values are copied to this index  (see solr-config/schema.xml)
         //dkcclterm.ti index values are copied to this index (see solr-config/schema.xml)

        Log.trace( "Leaving: TermIndex.createTitle method" );

        return index;

    };

     /**
     * Method that creates term.mainTitle index fields,
     * dc.title minus dkdcplus:full and dkdcplus:series
     *
     * @type {method}
     * @syntax TermIndex.createMainTitle( index, commonDataXml)
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createMainTitle
     * @method
     */

    that.createMainTitle = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createMainTitle method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series' ) ]", commonDataXml, function(text) {
            index.pushField( "term.mainTitle", text );
        } );

        Log.trace( "Leaving: TermIndex.createMainTitle method" );

        return index;

    };


    /**
     * Method that creates term.type index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createType( index, commonDataXml )
     * @param {Object} index The index to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createType
     * @method
     */
    that.createType = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createType method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:type[ @xsi:type = 'dkdcplus:BibDK-Type']", commonDataXml, function( text ) {
            index.pushField( "term.type", text );
        } );

        Log.trace( "Leaving: TermIndex.createType method" );

        return index;

    };

    /**
     * Method that creates term.typeCategory index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createTypeCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createTypeCategory
     * @method
     */
    that.createTypeCategory = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createTypeCategory method" );

        if ( undefined === record ) {
            Log.trace( "Leaving: TermIndex.createTypeCategory method" );
            return index;
        }

        record.eachField( "008", function( field ) {
            field.eachSubField( "t", function ( field, subField ) {
                var value = subField.value;
                switch ( value ) {
                    case "a":
                        index.pushField( "term.typeCategory", "ana" );
                        break;
                    case "m":
                        index.pushField( "term.typeCategory", "mono" );
                        break;
                    case "s":
                        index.pushField( "term.typeCategory", "mono" );
                        break;
                    case "p":
                        index.pushField( "term.typeCategory", "peri" );
                        break;
                    default:
                        break;
                }

            } );
        } );

        Log.trace( "Leaving: TermIndex.createTypeCategory method" );

        return index;

    };

    /**
     * Method that creates term.typeCategory index fields for DKABM.
     *
     *
     * @type {method}
     * @syntax TermIndex.createTypeCategoryDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createTypeCategoryDkabm
     * @method
     */
    that.createTypeCategoryDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createTypeCategoryDkabm method" );

        //This function was made with Search US#933 (2013) - bibliotek.dk wanted to be able to
        //hit records from "Store Danske" (150012-leksikon) by searching term.category=mono which
        //is also used to hit records in danMARC2 format.
        //TODO: The creation of value based on DKABM should be seen in a broader context than just the example from "Store Danske".

        var type = XPath.selectText( "/*/dkabm:record/dc:type[ 1 ]", commonDataXml).toLowerCase( );

        var value = "";

        switch ( type ) {
            case "artikel":
                value = "mono";
                break;
            default:
                value = "";
                break;
        }

        if ( value !== "" ) {
            index.pushField( "term.typeCategory", value );
        }

        Log.trace( "Leaving: TermIndex.createTypeCategoryDkabm method" );

        return index;

    };

    /**
     * Method that creates term.accessType index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAccessType( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createAccessType
     * @method
     */
    that.createAccessType = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createAccessType method" );

        XPath.forEachNodeText( "/*/adminData/accessType", commonDataXml, function( text ) {
            index.pushField( "term.accessType", text );
        } );

        Log.trace( "Leaving: TermIndex.createAccessType method" );

        return index;

    };

    /**
     * Method that creates term.workType index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createWorkType( index, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} dcDataXml Xml object containing dc data
     * @return {Object} The updated index object
     * @name TermIndex.createWorkType
     * @method
     */
    that.createWorkType = function( index, dcDataXml ) {

        Log.trace( "Entering: TermIndex.createWorkType method" );

        XPath.forEachNodeText( "/*/dc:type", dcDataXml, function( text ) {
            if ( text.match( /WORK:/ ) ) {
                index.pushField( "term.workType", text.replace( /WORK:/, "" ) );
            }
        } );

        Log.trace( "Leaving: TermIndex.createWorkType method" );

        return index;

    };

    /**
     * Method that creates term.primaryWorkType index fields in order to be able to "boost" on workType
     *
     * @type {method}
     * @syntax TermIndex.createPrimaryWorkType( index, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} dcDataXml Xml object containing dc data
     * @return {Object} The updated index object
     * @name TermIndex.createPrimaryWorkType
     * @method
     */
    that.createPrimaryWorkType = function( index, dcDataXml ) {

        Log.trace( "Entering: TermIndex.createPrimaryWorkType method" );

        //LSK 2016-09-27: this code looks wrong and does not generate anything in reality
        //(index does not exist in solr and is not specified in opensearch_cql.xml)
        //it takes dcDataXml as input but looks for adminData/workType which does not
        //exist in dcDataXml.
        //Code was made with Search Story#1236 (committed 2014-09-18) and seems to
        //have been needed for boosting purposes. Apparently it has not been needed
        //now to two years as we have not heard anything from anybody about the lack of
        //this index.
        //TODO: Find out if we should delete this function or correct it to work

        var array = [];
        XPath.forEachNodeText("/*/adminData/workType", dcDataXml, function(text) {
            array.push( text );
        });

        array.sort();
        var value = array.join(",");

        index.pushField( "term.primaryWorkType", value );

        Log.trace( "Leaving: TermIndex.createPrimaryWorkType method" );

        return index;

    };
    /**
     * Method that creates material genre term.genre index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createGenre( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createGenre
     * @method
     */
    that.createGenre = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createGenre method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:genre' ]", commonDataXml, function(text) {
            index.pushField( "term.genre", text );
        });

        XPath.forEachNodeText("/*/adminData/genre", commonDataXml, function(text) {
            index.pushField( "term.genre", text );
        });

        Log.trace( "Leaving: TermIndex.createGenre method" );

        return index;

    };

    /**
     * Method that creates term.audience index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAudience( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createAudience
     * @method
     */
    that.createAudience = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createAudience method" );

        //For now we keep this index with data from the two new indexes that are meant
        //to replace term.audience. Sometime when a complete reindexing has taken place
        //and when various interfaces no longer use the term.audience index, this method
        //can be deleted and should no longer be called /LSK 2014-07-11

        TermIndex.createAudienceRecommended( index, commonDataXml, "term.audience" );
        TermIndex.createAudienceRestricted( index, commonDataXml, "term.audience" );

        Log.trace( "Leaving: TermIndex.createAudience method" );

        return index;

    };

    /**
     * Method that creates term.audienceRecommended index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAudienceRecommended( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {String} indexName name of index field to create
     * @return {Object} The updated index object
     * @name TermIndex.createAudienceRecommended
     * @method
     */
    that.createAudienceRecommended = function( index, commonDataXml, indexName ) {

        Log.trace( "Entering: TermIndex.createAudienceRecommended method" );

        XPath.forEachNodeText("/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:age' ]", commonDataXml, function(text) {
            index.pushField( indexName, text );
        });

        Log.trace( "Leaving: TermIndex.createAudienceRecommended method" );

        return index;

    };

    /**
     * Method that creates term.audienceRestricted index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAudienceRestricted( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {String} indexName name of index field to create
     * @return {Object} The updated index object
     * @name TermIndex.createAudienceRestricted
     * @method
     */
    that.createAudienceRestricted = function( index, commonDataXml, indexName ) {

        Log.trace( "Entering: TermIndex.createAudienceRestricted method" );

        XPath.forEachNodeText("/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:medieraad' ]", commonDataXml, function(text) {
            index.pushField( indexName, text.replace( /M\u00e6rkning: /, "" ) );
        });
        XPath.forEachNodeText("/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:pegi' ]", commonDataXml, function(text) {
            index.pushField( indexName, text.replace( /PEGI-m\u00e6rkning: /, "" ) + " \u00e5r" );
        });

        Log.trace( "Leaving: TermIndex.createAudienceRestricted method" );

        return index;

    };

    /**
     * Method that creates term.acquisitionDate index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createAcquisitionDate( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createAcquisitionDate
     * @method
     */
    that.createAcquisitionDate = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createAcquisitionDate method" );

        XPath.forEachNodeText("/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '096' ]/marcx:subfield[ @code = 't' ]", commonDataXml, function(text) {
            index.pushField( "term.acquisitionDate", text );
        });

        Log.trace( "Leaving: TermIndex.createAcquisitionDate method" );

        return index;

    };

    /**
     * Method that creates term.reviewedCreator index fields for reviews (creator of the reviewed material).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedCreator( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedCreator
     * @method
     */
    that.createReviewedCreator = function( index, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedCreator method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:creator[ not(@xsi:type = 'oss:sort') ]", reviewedDataXml, function(text) {
            index.pushField( "term.reviewedCreator", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewedCreator method" );

        return index;

    };

    /**
     * Method that creates term.reviewedCreator index fields for reviews (creator of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedCreatorDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedCreatorDkabm
     * @method
     */
    that.createReviewedCreatorDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedCreatorDkabm method" );

        index.pushField( "term.reviewedCreator", XPath.selectText( "/*/dkabm:record/dc:subject[ 1 ]", commonDataXml ) );

        Log.trace( "Leaving: TermIndex.createReviewedCreatorDkabm method" );

        return index;

    };

    /**
     * Method that creates term.reviewedTitle index fields for reviews (title of the reviewed material).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedTitle( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedTitle
     * @method
     */
    that.createReviewedTitle = function( index, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedTitle method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series') ]", reviewedDataXml, function(text) {
            index.pushField( "term.reviewedTitle", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewedTitle method" );

        return index;

    };

    /**
     * Method that creates term.reviewedTitle index fields for reviews (creator of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedTitleDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedTitleDkabm
     * @method
     */
    that.createReviewedTitleDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedTitleDkabm method" );

        index.pushField( "term.reviewedTitle", XPath.selectText( "/*/dkabm:record/dc:subject[ 2 ]", commonDataXml ) );

        Log.trace( "Leaving: TermIndex.createReviewedTitleDkabm method" );

        return index;

    };

    /**
     * Method that creates term.reviewedPublisher index fields for reviews (publisher of the reviewed material).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedPublisher( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedPublisher
     * @method
     */
    that.createReviewedPublisher = function( index, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedPublisher method" );

        XPath.forEachNodeText("/*/dkabm:record/dc:publisher", reviewedDataXml, function(text) {
            index.pushField( "term.reviewedPublisher", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewedPublisher method" );

        return index;

    };

    /**
     * Method that creates term.reviewedIdentifier index fields for reviews (identifier of the reviewed material).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedIdentifier( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} reviewedDataXml Xml object containing common data from the reviewed material
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedIdentifier
     * @method
     */
    that.createReviewedIdentifier = function( index, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedIdentifier method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:identifier", reviewedDataXml, function( text ) {
            index.pushField( "term.reviewedIdentifier", text );
        } );

        Log.trace( "Leaving: TermIndex.createReviewedIdentifier method" );

        return index;

    };

    /**
     * Method that creates term.reviewedIdentifier index fields for reviews (identifier of the reviewed material) from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewedIdentifierDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createReviewedIdentifierDkabm
     * @method
     */
    that.createReviewedIdentifierDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewedIdentifierDkabm method" );

        XPath.forEachNodeText("/*/dkabm:record/dcterms:references", commonDataXml, function(text) {
            index.pushField( "term.reviewedIdentifier", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewedIdentifierDkabm method" );

        return index;

    };

    /**
     * Method that creates term.reviewer index fields for reviews (creator of the review).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewer( index, commonDataXml )
     * @param {Object}index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from the review
     * @return {Object} The updated index object
     * @name TermIndex.createReviewer
     * @method
     */
    that.createReviewer = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewer method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml, function(text) {
            index.pushField( "term.reviewer", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewer method" );

        return index;

    };

    /**
     * Method that creates term.subject index fields for reviews (title of the reviewed material as subject).
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewSubject( index, reviewedDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {document} reviewedDataXml Xml object containing common data from the review
     * @return {Object} The updated index object
     * @name TermIndex.createReviewSubject
     * @method
     */
    that.createReviewSubject = function( index, reviewedDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewSubject method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ not( @xsi:type = 'dkdcplus:full' ) and not( @xsi:type = 'dkdcplus:series' )]", reviewedDataXml, function( text ) {
            index.pushField( "term.subject", text );
        });

        Log.trace( "Leaving: TermIndex.createReviewSubject method" );

        return index;

    };

    /**
     * Method that creates term.subject index fields for reviews (title of the reviewed material as subject) from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createReviewSubjectDkabm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createReviewSubjectDkabm
     * @method
     */
    that.createReviewSubjectDkabm = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createReviewSubjectDkabm method" );

        index.pushField( "term.subject", XPath.selectText( "/*/dkabm:record/dc:subject[ 2 ]", commonDataXml ) );

        Log.trace( "Leaving: TermIndex.createReviewSubjectDkabm method" );

        return index;

    };

    /**
     * Method that creates term.description index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createDescription( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createDescription
     * @method
     */
    that.createDescription = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createDescription method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:description", commonDataXml, function( text ) {
            index.pushField( "term.description", text );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:abstract", commonDataXml, function( text ) {
            index.pushField( "term.description", text );
        } );
        Log.trace( "Leaving: TermIndex.createDescription method" );

        return index;

    };

     /**
     * Method that creates term.trackTitle index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createTrackTitle( index, commonDataXml, indexName )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} indexName a string with the name of the index to add fields to
     * @return {Object} The updated index object
     * @name TermIndex.createTrackTitle
     * @method
     */
    that.createTrackTitle = function( index, commonDataXml, indexName ) {

        Log.trace( "Entering: TermIndex.createTrackTitle method" );

        var elements = XPath.select( "/*/dkabm:record/dcterms:hasPart[ @xsi:type = 'dkdcplus:track' ]", commonDataXml );

        for ( var n = 0 ; n < elements.length; n++ ) {
            var child = elements[ n ];
            var text = XmlUtil.getText( child );
            if ( "" !== text.trim( ) ) {
                index.pushField( indexName, text );
            }
            var children = XmlUtil.getChildElements( child );
            for ( var i = 0 ; i < children.length; i++ ) {
                text = XmlUtil.getText( children[i] );
                if ( "" !== text.trim( ) ) {
                    index.pushField( indexName, text );
                }
            }
        }

        Log.trace( "Leaving: TermIndex.createTrackTitle method" );

        return index;

    };

     /**
     * Method that creates term.partOf index fields from DKABM data.
     *
     *
     * @type {method}
     * @syntax TermIndex.createPartOf ( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @return {Object} The updated index object
     * @name TermIndex.createPartOf
     * @method
     */
    that.createPartOf = function( index, commonDataXml ) {

        Log.trace( "Entering: TermIndex.createPartOf method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:isPartOf", commonDataXml, function( text ) {
            index.pushField( "term.partOf", text );
        } );

        Log.trace( "Leaving: TermIndex.createPartOf  method" );

        return index;

    };

    /**
     * Method that creates term.createOnlineAccess index fields.
     *
     *
     * @type {method}
     * @syntax TermIndex.createOnlineAccess( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name TermIndex.createOnlineAccess
     * @method
     */
    that.createOnlineAccess = function( index, commonDataXml, record ) {

        Log.trace( "Entering: TermIndex.createOnlineAccess method" );

        var value = "";
        if ( undefined !== record ) {
            record.eachField( "008", function ( field ) {
                Log.debug( "TermIndex.createOnlineAccess: field:", field );
                field.eachSubField( "n", function ( field, subfield ) {
                    var text = subfield.value;
                    switch ( text ) {
                        case "a":
                            value = "ou free";
                            break;
                        case "b":
                            value = "od restricted";
                            break;
                        case "c":
                            value = "oi none";
                            break;
                    }
                } );
            } );
        }

        var elements = XPath.select( "/*/ln:links/ln:link[ln:relationType='dbcaddi:hasOnlineAccess']", commonDataXml );
        for ( var i = 0 ; i < elements.length; i++ ) {
            var child = elements[i];
            var accessType = XPath.selectText( "ln:access", child );
            if ( "free" === accessType ) {
                value = "ou free";
            } else {
                value = "od restricted";
            }
        }
        if ( "" !== value ) {
            index.pushField( "term.onlineAccess", value );
        }

        Log.trace( "Leaving: TermIndex.createOnlineAccess method" );

        return index;
    };


    /**
     * Dummy Method for documenting where values of term.dateFirstEdition come from
     * See code in SortIndex.createSortDateFirstEdition for the actual data handling
     *
     * @syntax TermIndex.createDateFirstEdition()
     * @name TermIndex.createDateFirstEdition
     * @method
     */
    that.createDateFirstEdition = function( ) {
        Log.trace( "Entering: TermIndex.createTermDateFirstEdition");
        //see SortIndex.createSortDateFirstEdition and schema.xml in solr-config.xml
        Log.debug( "values in term.dateFirstEdition are created by copying values from sort.dateFirstEdition in solr" );
        Log.trace( "Leaving: TermIndex.createTermDateFirstEdition" );
    };


    return that;

}( );

