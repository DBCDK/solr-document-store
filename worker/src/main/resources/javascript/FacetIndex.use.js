/** @file Module that creates facet index fields. */

use( "Index" );
use( "DkcclPhraseIndex" );
use( "TermIndex" );
use( "Log" );
use( "Tables" );
use( "XmlUtil" );
use( "XPath" );
use( "Util");

EXPORTED_SYMBOLS = [ 'FacetIndex' ];

/**
 * Module with functions that create facet index fields.
 *
 * This module contains functions to create facet index fields
 *
 * @type {namespace}
 * @namespace
 */
var FacetIndex = function() {

    var that = {};

    /**
     * Method that creates facet index fields.
     *
     *
     * @syntax FacetIndex.createFields( index, commonDataXml, localDataList, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Document} dcDataXml Xml object containing dc stream data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml, dcDataXml, record ) {

        Log.trace( "Entering: createFields method" );

        // Concatenated types
        var type = String( XPath.selectMultipleText( "/*/dc:type", dcDataXml ) );

        FacetIndex.createCategory( index, commonDataXml );
        FacetIndex.createCreator( index, commonDataXml );
        FacetIndex.createPrimaryCreator( index, commonDataXml );
        FacetIndex.createDate( index, commonDataXml );
        //calling dummy method for logging
        FacetIndex.createDateFirstEdition( index, commonDataXml );
        FacetIndex.createLanguage( index, commonDataXml, record );
        //        FacetIndex.createAcSource( index, commonDataXml ); For us #1500 (create facet.acSource for all objects)
        FacetIndex.createSubject( index, commonDataXml, record );
        FacetIndex.createType( index, commonDataXml );
        FacetIndex.createGenre( index, commonDataXml );
        FacetIndex.createGenreCategory( index, commonDataXml );
        FacetIndex.createAudience( index, commonDataXml );
        FacetIndex.createAudienceCategory( index, commonDataXml );
        FacetIndex.createForm( index, commonDataXml );
        FacetIndex.createLiteraryForm( index, commonDataXml, record );
        FacetIndex.createLevel( index, commonDataXml, record );
        FacetIndex.createLet( index, commonDataXml, record );
        FacetIndex.createLix( index, commonDataXml, record );
        FacetIndex.createPartOf( index, commonDataXml, record );
        FacetIndex.createTitleSeries( index, commonDataXml );
        if ( type.match( /WORK:game/ ) ) {
            FacetIndex.createGamePlatform( index, commonDataXml );
        }
        FacetIndex.createDk5( index, commonDataXml, record );
        FacetIndex.createAccess( index, commonDataXml );
        if ( type.match( /WORK:movie/ ) ) {
            FacetIndex.createNationality( index, commonDataXml, record );
        }
        FacetIndex.createPeriod( index, commonDataXml );
        FacetIndex.createGeographic( index, commonDataXml );
        FacetIndex.createFictionSubject( index, commonDataXml );
        FacetIndex.createNonFictionSubject( index, commonDataXml );
        FacetIndex.createMusicSubject( index, commonDataXml );
        FacetIndex.createSheetMusic( index, commonDataXml, record );
        FacetIndex.createExtraTitles( index, commonDataXml, record );
        FacetIndex.createCreatorFunction( index, commonDataXml );

        Log.trace( "Leaving: createFields method" );

        return index;

    };

    /**
     * Method that creates facet index fields from Local Data.
     *
     *
     * @syntax FacetIndex.createFieldsLocalData( index, localData )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} localData Xml object containing local data
     * @return {Object} The updated index object
     * @name FacetIndex.createFieldsLocalData
     * @method
     */
    that.createFieldsLocalData = function( index, localData ) {

        Log.trace( "Entering: createFieldsLocalData method" );

        FacetIndex.createBranch( index, localData );
        FacetIndex.createDepartment( index, localData );

        Log.trace( "Leaving: createFieldsLocalData method" );

        return index;

    };

    /**
     * Method that creates facet.category index fields from input data.
     *
     *
     * @syntax FacetIndex.createCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createCategory
     * @method
     */
    that.createCategory = function( index, commonDataXml ) {

        Log.trace( "Entering: createCategory method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience", commonDataXml, function( text ) {
            if ( text.match( /.*materialer/ ) ) {
                index.pushField( "facet.category", text );
            }
        } );

        Log.trace( "Leaving: createCategory method" );

        return index;

    };

    /**
     * Method that creates facet.creator index fields from input data.
     *
     *
     * @syntax FacetIndex.createCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: createCreator method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml, function( text ) {
            index.pushField( "facet.creator", text );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dc:contributor", commonDataXml, function( text ) {
            index.pushField( "facet.creator", text );
        } );

        Log.trace( "Leaving: createCreator method" );

        return index;

    };

    /**
     * Method that creates facet.primaryCreator index fields from input data.
     *
     *
     * @syntax FacetIndex.createPrimaryCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createPrimaryCreator
     * @method
     */
    that.createPrimaryCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: createPrimaryCreator method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:creator[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml, function( text ) {
            index.pushField( "facet.primaryCreator", text );
        } );

        Log.trace( "Leaving: createPrimaryCreator method" );

        return index;

    };

    /**
     * Method that creates facet.creatorFunction from DKABM.
     * Values in facet.creatorFunction are names from creator and contributor elements without year of birth but with Danish text for
     * a selected range of functions (coded functions from the dkdcplus scheme).
     *
     * @syntax FacetIndex.createCreatorFunction( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createCreatorFunction
     * @method
     */
    that.createCreatorFunction = function( index, commonDataXml ) {

        Log.trace( "Entering: facet.creatorFunction method" );

        var functionCodeToText = {
            "act": "(Skuespiller)",
            "anm": "(Animator)",
            "aus": "(Manuskriptforfatter)",
            "aut": "(Forfatter)",
            "cmp": "(Komponist)",
            "cnd": "(Dirigent)",
            "dkind": "(Indl\u00E6ser)",
            "drt": "(Instrukt\u00F8r)",
            "ill": "(Illustrator)",
            "ive": "(Interviewede)",
            "ivr": "(Interviewer)",
            "mus": "(Musiker)",
            "sng": "(Sanger)",
            "trl": "(Overs\u00E6tter)"
        };

        function updateIndex( elements ) {
            for ( var i = 0 ; i < elements.length; i++ ) {
                var child = elements[i];
                var functionCode = String( XmlUtil.getAttribute( child, "type", XmlNamespaces.xsi ) ).replace( /dkdcplus:/g, "" );
                var name = XmlUtil.getText( child ).replace( /\s*\([^)]*\)/g, "" );
                if ( functionCode !== undefined ) {
                    var functionText = functionCodeToText[ functionCode ];
					if ( functionText === undefined ) {
						functionText = "";
					} else {
						functionText = " " + functionText;
					}
                    index.pushField( "facet.creatorFunction", name + functionText );
                } else {
                    index.pushField( "facet.creatorFunction", name );					
				}
            }
        }

        var creatorElements = XPath.select( "/*/dkabm:record/dc:creator[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml );
        updateIndex( creatorElements );

        var contributorElements = XPath.select( "/*/dkabm:record/dc:contributor[ not( @xsi:type = 'oss:sort' ) ]", commonDataXml );
        updateIndex( contributorElements );

        Log.trace( "Leaving: facet.createCreatorFunction method" );

        return index;

    };

    /**
     * Method that creates facet.date index fields from input data.
     *
     *
     * @syntax FacetIndex.createDate( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createDate
     * @method
     */
    that.createDate = function( index, commonDataXml ) {

        Log.trace( "Entering: createDate method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:date", commonDataXml, function( text ) {
            index.pushField( "facet.date", text );
        } );

        Log.trace( "Leaving: createDate method" );

        return index;

    };

    /**
     * Method that creates facet.language index fields from input data.
     *
     *
     * @syntax FacetIndex.createLanguage( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createLanguage
     * @method
     */
    that.createLanguage = function( index, commonDataXml, record ) {

        Log.trace( "Entering: FacetIndex.createLanguage method" );

        var languageCode = "";
        var hasMultipleLanguages = false;
        var foundLanguage = false;

        var __addLanguageToIndex = function( languageCode ) {
            Log.debug( "__addLanguageToIndex for: ", languageCode );
            if ( languageCode === "mis" || languageCode === "mul" || languageCode === "und" ) {
                hasMultipleLanguages = true;
            } else if ( languageCode !== "" ) {
                var language = Tables.languages( languageCode );
                Log.debug( "FacetIndex.createLanguage, marcx language:'", language, "'" );
                if ( language !== undefined && language !== "" ) {
                    Log.debug( "FacetIndex.createLanguage adding language: '", language, " from language code: ", languageCode );
                    index.pushField( "facet.language", language );
                    foundLanguage = true;
                }
            }
        };

        if ( record !== undefined ) {
            //if the currently processed record is not a single record the variable record is a record with all fields
            //from merged, section and volume record appended (see MarcUtility.createRecordObjectFromIndexingData)
            //use only the firstValue here i.e. the field from the merged record to avoid redundancy
            languageCode = record.getFirstValue( "008", "l" );
                Log.debug( "addLanguageToIndex from value in 008l: ", languageCode );
                __addLanguageToIndex( languageCode );

            if ( !foundLanguage ) {
                //041 can be repeated and we cannot know which of the fields are from the merged record i.e.
                //that we do some redundant processing here
                var values041pORa = record.getValue( "041", /a|p/, "#" ).split( "#" );
                for ( var i = 0; i < values041pORa.length; i++ ) {
                    Log.debug( "addLanguageToIndex from values041pORa ", values041pORa[ i ] );
                    languageCode = values041pORa[ i ];
                    __addLanguageToIndex( languageCode );
                }
            }
        } else {
            XPath.forEachNodeText(
                "/*/dkabm:record/dc:language[ not( @xsi:type = 'dcterms:ISO639-2' ) and not( @xsi:type = 'dkdcplus:subtitles') ]",
                commonDataXml, function( text ) {
                Log.debug( "FacetIndex.createLanguage, dkabm language:'", text, "'" );
                if ( text === "Flere sprog" ) {
                    hasMultipleLanguages = true;
                } else {
                    index.pushField( "facet.language", text );
                    foundLanguage = true;
                }
            } );
        }
        if ( !foundLanguage && hasMultipleLanguages ) {
            index.pushField( "facet.language", "Blandede sprog" );
            Log.debug( "FacetIndex.createLanguage: Blandede sprog" );
        }
        Log.trace( "Leaving: FacetIndex.createLanguage method" );

        return index;

    };

    /**
     * Method that creates material genre facet.genre index fields.
     *
     *
     * @syntax FacetIndex.createGenre( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createGenre
     * @method
     */
    that.createGenre = function( index, commonDataXml ) {

        Log.trace( "Entering: createGenre method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:genre' ]", commonDataXml, function( text ) {
            if ( !text.match( /fiktion/ ) ) {
                index.pushField( "facet.genre", text );
            }
        } );

        Log.trace( "Leaving: createGenre method" );

        return index;

    };

    /**
     * Method that creates facet.genreCategory index fields.
     *
     *
     * @syntax FacetIndex.createGenreCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createGenreCategory
     * @method
     */
    that.createGenreCategory = function( index, commonDataXml ) {

        Log.trace( "Entering: createGenreCategory method" );

        XPath.forEachNodeText( "/*/adminData/genre", commonDataXml, function( text ) {
            index.pushField( "facet.genreCategory", text );
        } );

        Log.trace( "Leaving: createGenreCategory method" );

        return index;

    };

    /**
     * Method that creates facet.acSource index fields from input data.
     *
     *
     * @syntax FacetIndex.createAcSource( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createAcSource
     * @method
     */
    that.createAcSource = function( index, commonDataXml ) {

        Log.trace( "Entering: createAcSource method" );

        var source;

        XPath.forEachNodeText( "/*/adminData/collectionIdentifier", commonDataXml, function( text ) {
            if ( text.match( /^150030-.*/ ) ) {
                source = "Spil og Medier";
            }
        } );
        if ( source ) {
            index.pushField( "facet.acSource", source );
        } else {
            XPath.forEachNodeText( "/*/dkabm:record/ac:source", commonDataXml, function( text ) {
                index.pushField( "facet.acSource", text );
            } );
        }

        Log.trace( "Leaving: createAcSource method" );

        return index;

    };

    /**
     * Method that creates facet.subject index fields from input data.
     *
     *
     * @syntax FacetIndex.createSubject( index, commonDataXml, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createSubject
     * @method
     */
    that.createSubject = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createSubject method" );

        if ( record !== undefined ) {
            var facetSubjectIndex = Index.newIndex();

            DkcclPhraseIndex.callIndexMethod( DkcclPhraseIndex.createDkcclLemFields, facetSubjectIndex, record, "facet.subject", true );

            for ( var i = 0; i < facetSubjectIndex.length; i++ ) {
                if ( facetSubjectIndex[ i ].name !== "" && facetSubjectIndex[ i ].value !== "" ) {
                    index.pushField( facetSubjectIndex[ i ].name, facetSubjectIndex[ i ].value );
                }
            }
        } else {
            XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ not( @xsi:type = 'dkdcplus:genre' ) and not( @xsi:type = 'dkdcplus:DBCN' ) and not( @xsi:type = 'dkdcplus:DBCP')]", commonDataXml, function( text ) {
                index.pushField( "facet.subject", text );
            } );
        }

        Log.trace( "Leaving: createSubject method" );

        return index;

    };


    /**
     * Method that creates facet.type index fields from input data.
     *
     *
     * @syntax FacetIndex.createType( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createType
     * @method
     */
    that.createType = function( index, commonDataXml ) {

        Log.trace( "Entering: createType method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:type[ @xsi:type = 'dkdcplus:BibDK-Type' ]", commonDataXml, function( text ) {
            index.pushField( "facet.type", text );
        } );

        Log.trace( "Leaving: createType method" );

        return index;

    };

    /**
     * Method that creates facet.audience index fields.
     *
     *
     * @syntax FacetIndex.createAudience( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createAudience
     * @method
     */
    that.createAudience = function( index, commonDataXml ) {

        Log.trace( "Entering: createAudience method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:age' or @xsi:type = 'dkdcplus:pegi' ]", commonDataXml, function( text ) {
            index.pushField( "facet.audience", text );
        } );
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience[ @xsi:type = 'dkdcplus:medieraad' ]", commonDataXml, function( text ) {
            index.pushField( "facet.audience", text.replace( /M\u00e6rkning: /, "" ) );
        } );

        Log.trace( "Leaving: createAudience method" );

        return index;

    };

    /**
     * Method that creates facet.audienceCategory index fields.
     *
     *
     * @syntax FacetIndex.createAudienceCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createAudienceCategory
     * @method
     */
    that.createAudienceCategory = function( index, commonDataXml ) {

        Log.trace( "Entering: createAudienceCategory method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCN' ]", commonDataXml, function( text ) {
            index.pushField( "facet.audienceCategory", text );
        } );

        Log.trace( "Leaving: createAudienceCategory method" );

        return index;

    };

    /**
     * Method that creates facet.form index fields.
     *
     *
     * @syntax FacetIndex.createForm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createForm
     * @method
     */
    that.createForm = function( index, commonDataXml ) {

        Log.trace( "Entering: createForm method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCO' ]", commonDataXml, function( text ) {
            index.pushField( "facet.form", text );
        } );

        Log.trace( "Leaving: createForm method" );

        return index;

    };

    /**
     * Method that creates facet.literaryForm index fields.
     *
     *
     * @syntax FacetIndex.createLiteraryForm( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createLiteraryForm
     * @method
     */
    that.createLiteraryForm = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createLiteraryForm method" );

        var facetLiteraryFormIndex = Index.newIndex();
        TermIndex.createLiteraryForm( facetLiteraryFormIndex, commonDataXml, record );
        for ( var i = 0; i < facetLiteraryFormIndex.length; i++ ) {
            if ( facetLiteraryFormIndex[ i ].value === "nonfiktion" ) {
                index.pushField( "facet.literaryForm", "faglitteratur" );
            } else if ( facetLiteraryFormIndex[ i ].value === "fiktion" ) {
                index.pushField( "facet.literaryForm", "sk\u00f8nlitteratur" );
            } else if ( facetLiteraryFormIndex[ i ].value !== undefined && facetLiteraryFormIndex[ i ].value !== "" ) {
                index.pushField( "facet.literaryForm", facetLiteraryFormIndex[ i ].value );
            }
        }

        Log.trace( "Leaving: createLiteraryForm method" );

        return index;

    };

    /**
     * Method that creates facet.level index fields.
     *
     *
     * @syntax FacetIndex.createLevel( index, commonDataXml, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createLevel
     * @method
     */
    that.createLevel = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createLevel method" );

        function getLevelTexts(code){
            var levelTexts = [];
            switch (code) {
                //danMARC2 codes:
                case "01":
                    levelTexts = ["f\u00f8rskoleniveau"];
                    break;
                case "02":
                    levelTexts = ["folkeskoleniveau"];
                    break;
                case "03":
                    levelTexts = ["gymnasieniveau"];
                    break;
                case "04":
                    levelTexts = ["fagligt niveau"];
                    break;
                case "05":
                    levelTexts = ["forskningsniveau"];
                    break;
                case "06":
                    levelTexts = ["alment niveau"];
                    break;
                case "07":
                    levelTexts = ["udenfor kategori eller vurdering fravalgt"];
                    break;
                //marc21 codes:
                case "a":
                    levelTexts = ["f\u00f8rskoleniveau"];  //Originally: Preschool
                    break;
                case "b":
                    levelTexts = ["folkeskoleniveau"]; //Originally: Primary
                    break;
                case "c":
                    levelTexts = ["folkeskoleniveau"];  //Originally: Pre-adolescent
                    break;
                case "d":
                    levelTexts = ["gymnasieniveau"];  //Originally: Adolescent
                    break;
                case "e":
                    levelTexts = ["alment niveau"];  //Originally: Adult
                    break;
                case "f":
                    levelTexts = ["fagligt niveau", "forskningsniveau"];  //Originally: Specialized
                    break;
                case "g":
                    levelTexts = ["alment niveau"];  //Originally: General
                    break;
                case "j":
                    levelTexts = ["f\u00f8rskoleniveau", "folkeskoleniveau"];  //Originally: Juvenile
                    break;
                case "l":
                    levelTexts = ["udenfor kategori eller vurdering fravalgt"];
                    break;
                case "\u0023":
                    levelTexts = ["udenfor kategori eller vurdering fravalgt"];
                    break;
            }
            return levelTexts;
        }

        function updateIndex( subfieldValue ) {
            var levels = getLevelTexts( subfieldValue );
            for ( var i = 0; i < levels.length; i++ ) {
                Log.debug( "FacetIndex.createLevel from field 008x:", levels[ i ]);
                index.pushField( "facet.level", levels[ i ] );
            }
        }

        var levelIndexCreatedFromDkabm = false;
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:audience", commonDataXml, function( text ) {
            if ( text.match( /.*niveau/ ) ) {
                Log.debug( "FacetIndex.createLevel from dcterms:audience", text );
                levelIndexCreatedFromDkabm = true;
                index.pushField( "facet.level", text );
            }
        } );

        //if there was a field in dkabm with a level we do not need to look at the marc record
        if ( undefined !== record && levelIndexCreatedFromDkabm === false ) {
            record.eachField( '008', function( field ) {
                field.eachSubField( 'x', function( field, subfield ) {
                    updateIndex( subfield.value );
                } );
            } );
        }

        Log.trace( "Leaving: createLevel method" );

        return index;
    };

    /**
     * Method that creates facet.let index fields.
     *
     *
     * @syntax FacetIndex.createLet( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createLet
     * @method
     */
    that.createLet = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createLet method" );

        if ( record !== undefined ) {
            record.eachField( '042', function( field ) {
                field.eachSubField( 'c', function( field, subfield ) {
                    index.pushField( "facet.let", subfield.value );
                } );
            } );
        }

        Log.trace( "Leaving: createLet method" );

        return index;

    };

    /**
     * Method that creates facet.lix index fields.
     *
     *
     * @syntax FacetIndex.createLix( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createLix
     * @method
     */
    that.createLix = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createLix method" );

        if ( undefined !== record ) {
            record.eachField( '042', function( field ) {
                field.eachSubField( 'a', function( field, subfield ) {
                    var lixValue = subfield.value;
                    lixValue = lixValue.replace( / ?lix ?/i, "" );
                    if ( /^[0-9]+(-[0-9]+)?$/.test( lixValue ) ) {
                        index.pushField( "facet.lix", lixValue );

                    }
                } );
            } );
        }

        Log.trace( "Leaving: createLix method" );

        return index;

    };

    /**
     * Method that creates facet.branch index fields.
     *
     *
     * @syntax FacetIndex.createBranch( index, localDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} localDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createBranch
     * @method
     */
    that.createBranch = function( index, localDataXml ) {

        Log.trace( "Entering: createBranch method" );

        XPath.forEachNodeText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '096' ]/marcx:subfield[ @code = 'f' ]", localDataXml, function( text ) {
            index.pushField( "facet.branch", text );
        } );

        Log.trace( "Leaving: createBranch method" );

        return index;

    };

    /**
     * Method that creates facet.department index fields.
     *
     *
     * @syntax FacetIndex.createDepartment( index, localDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} localDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createDepartment
     * @method
     */
    that.createDepartment = function( index, localDataXml ) {

        Log.trace( "Entering: createDepartment method" );

        XPath.forEachNodeText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '096' ]/marcx:subfield[ @code = 'd' ]", localDataXml, function( text ) {
            index.pushField( "facet.department", text );
        } );

        Log.trace( "Leaving: createDepartment method" );

        return index;

    };

    /**
     * Method that creates facet.partOf index fields.
     *
     *
     * @syntax FacetIndex.createPartOf( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createPartOf
     * @method
     */
    that.createPartOf = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createPartOf method" );

        var value = "";
        var extraValue = "";

        if ( record !== undefined ) {
            record.eachField( '557', function( field ) {
                field.eachSubField( '\u00e6', function( field, subfield ) {
                    extraValue = ". " + subfield.value;
                } );
            } );
            record.eachField( '557', function( field ) {
                field.eachSubField( 'a', function( field, subfield ) {
                    value = subfield.value;
                } );
            } );
        }

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:isPartOf[ not( @xsi:type ) ]", commonDataXml, function( text ) {
            if ( value === "" ) {
                value = text.replace( /(.*)(, .*)/, "$1" );
                value = value.replace( /(.*)(, .*)/, "$1" );
            }
            index.pushField( "facet.partOf", value + extraValue );
        } );

        Log.trace( "Leaving: createPartOf method" );

        return index;

    };

    /**
     * Method that creates facet.titleSeries index fields.
     *
     *
     * @syntax FacetIndex.createTitleSeries( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name FacetIndex.createTitleSeries
     * @method
     */
    that.createTitleSeries = function( index, commonDataXml ) {

        Log.trace( "Entering: createTitleSeries method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:title[ @xsi:type = 'dkdcplus:series' ]", commonDataXml, function( text ) {
            index.pushField( "facet.titleSeries", text.replace( /(.*) ;.*/, "$1" ) );
        } );

        Log.trace( "Leaving: createTitleSeries method" );

        return index;

    };

    /**
     * Method that creates facet.gamePlatform index fields.
     *
     *
     * @syntax FacetIndex.createGamePlatform( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name FacetIndex.createGamePlatform
     * @method
     */
    that.createGamePlatform = function( index, commonDataXml ) {

        Log.trace( "Entering: createGamePlatform method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:type", commonDataXml, function( text ) {
            if ( text === "Pc-spil (net)" ) {
                text = "E-spil";
            }
            index.pushField( "facet.gamePlatform", text );
        } );

        Log.trace( "Leaving: createGamePlatform method" );

        return index;

    };

    /**
     * Method that creates facet.dk5 index fields.
     *
     *
     * @syntax FacetIndex.createDk5( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createDk5
     * @method
     */
    that.createDk5 = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createDk5 method" );

        if ( record !== undefined ) {
            record.eachField( "652", function( field ) {
                var start = field.getFirstValue( "o" );
                if ( start === "" ) {
                    start = field.getFirstValue( "m" );
                }
                if ( start !== "" ) {
                    var firstName = field.getFirstValue( "h" );
                    if ( firstName !== "" ) {
                        firstName = " " + firstName;
                    }
                    var lastName = field.getFirstValue( "a" );
                    if ( lastName !== "" ) {
                        lastName = " " + lastName;
                    }
                    var title = field.getFirstValue( "t" );
                    if ( title !== "" ) {
                        title = " " + title;
                    }
                    var other = field.getFirstValue( "b" );
                    if ( other !== "" ) {
                        other = " " + other;
                    }
                    if ( start === "sk" || start === "SK" ) {
                        start = "sk\u00F8nlitteratur";
                    }
                    var value = start + firstName + lastName + title + other;
                    index.pushField( "facet.dk5", value );
                }
            } );
        }

        Log.trace( "Leaving: createDk5 method" );

        return index;

    };

    /**
     * Method that creates facet.access index fields.
     *
     *
     * @syntax FacetIndex.createAccess( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing common data from object being indexed
     * @return {Object} The updated index object
     * @name FacetIndex.createAccess
     * @method
     */
    that.createAccess = function( index, commonDataXml ) {

        Log.trace( "Entering: createAccess method" );

        var values = {
            "a": "Ubegr\u00e6nset adgang",
            "b": "Begr\u00e6nset adgang",
            "c": "Ingen adgang"
        };

        XPath.forEachNodeText( "/*/marcx:collection/marcx:record[ @type = 'Bibliographic' ]/marcx:datafield[ @tag = '008' ]/marcx:subfield[ @code = 'n' ][1]", commonDataXml, function( text ) {
            var value = values[ text ];
            if ( value !== undefined ) {
                index.pushField( "facet.access", value );
            }
        } );

        Log.trace( "Leaving: createAccess method" );

        return index;

    };

    /**
     * Dummy Method for documenting where values of facet.nationality come from
     * See code in TermIndex.createNationality for the actual data handling
     *
     * @syntax FacetIndex.createNationality()
     * @name FacetIndex.createNationality
     * @method
     */
    that.createNationality = function( ) {

        Log.trace( "Entering: createNationality method" );
        //see TermIndex.createNationality and schema.xml in solr-config.xml
        Log.debug( "values in facet.nationality are created by copying values from term.nationality in solr" );
        Log.trace( "Leaving: createNationality method" );

    };

    /**
     * Method that creates facet.period index fields from dcterms.temporal.
     *
     *
     * @syntax FacetIndex.createPeriod( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createPeriod
     * @method
     */
    that.createPeriod = function( index, commonDataXml ) {
        //20131122/nje:
        //<dcterms:temporal xsi:type="dkdcplus:DBCP">1940-1949</dcterms:temporal>
        //<dcterms:temporal>Forhistorisk tid Jernalderen</dcterms:temporal>
        //
        // a test for type dkdcplus:DBCP, will only return DBC-records
        // records from scientific libraries do not have DBCP
        // but anyway this facet is problematic, 634 is used by scientific libraries only, DBCP is only DBC-record
        // 631 is never copied to dkabm.
        // what they really want could be facet for subjects if it is a period like yyyy-yyyy
        // Arkibas also use temporal, but they have years like 1928-1950 and will newer match DBC records

        Log.trace( "Entering: createPeriod method" );
        XPath.forEachNodeText( "/*/dkabm:record/dcterms:temporal", commonDataXml, function( text ) {
            index.pushField( "facet.period", text );
        } );

        Log.trace( "Leaving: createPeriod method" );

        return index;

    };

    /**
     * Method that creates facet.geographic index fields from dcterms.spatial.
     *
     *
     * @syntax FacetIndex.createGeographic( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createGeographic
     * @method
     */
    that.createGeographic = function( index, commonDataXml ) {

        Log.trace( "Entering: createGeographic method" );

        XPath.forEachNodeText( "/*/dkabm:record/dcterms:spatial", commonDataXml, function( text ) {
            index.pushField( "facet.geographic", text );
        } );

        Log.trace( "Leaving: createGeographic method" );

        return index;

    };

    /**
     * Method that creates facet.fictionSubject index fields from dc.subject with type dkdcplus:DBCS.
     *
     *
     * @syntax FacetIndex.createFictionSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createFictionSubject
     * @method
     */
    that.createFictionSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: createFictionSubject method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCS']", commonDataXml, function( text ) {
            index.pushField( "facet.fictionSubject", text );
        } );

        Log.trace( "Leaving: createFictionSubject method" );

        return index;

    };

    /**
     * Method that creates facet.nonFictionSubject index fields from dcterms.subject with type dkdcplus:DBCF.
     *
     *
     * @syntax FacetIndex.createNonFictionSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createNonFictionSubject
     * @method
     */
    that.createNonFictionSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: createNonFictionSubject method" );
        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCF']", commonDataXml, function( text ) {
            index.pushField( "facet.nonFictionSubject", text );
        } );

        Log.trace( "Leaving: createNonFictionSubject method" );

        return index;

    };

    /**
     * Method that creates facet.musicSubject index fields from dcterms.subject with type dkdcplus:DBCM.
     *
     *
     * @syntax FacetIndex.createMusicSubject( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name FacetIndex.createMusicSubject
     * @method
     */
    that.createMusicSubject = function( index, commonDataXml ) {

        Log.trace( "Entering: facet.createMusicSubject method" );
        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DBCM']", commonDataXml, function( text ) {
            index.pushField( "facet.musicSubject", text );
        } );

        Log.trace( "Leaving: facet.createMusicSubject method" );

        return index;

    };


    /**
     * Method that creates facet.sheetMusic index fields.
     *
     *
     * @syntax FacetIndex.createSheetMusic( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createSheetMusic
     * @method
     */
    that.createSheetMusic = function( index, commonDataXml, record ) {

        Log.trace( "Entering: facet.createSheetMusic method" );

        var values = {
            "b": "studiepartiturer",
            "c": "stemmer",
            "e": "klaverpartiturer",
            "i": "stemmer"
        };

        var isMusicalia = false;
        var isElectronic = false;

        if ( record !== undefined ) {
            record.eachField( "005", function( field ) {
                field.eachSubField( 'i', function( field, subfield ) {
                    if ( subfield.value.match( /a|b|c|d|e|k|l|o/ ) ) {
                        index.pushField( "facet.sheetMusic", "alle partiturer" );
                    }
                    if ( subfield.value.match( /b|c|e|i/ ) ) {
                        var subValue = subfield.value;
                        index.pushField( "facet.sheetMusic", values[ subValue ] );
                    }
                } );
                field.eachSubField( 'j', function( field, subfield ) {
                    index.pushField( "facet.sheetMusic", "stemmer" );
                } );
                field.eachSubField( 'h', function( field, subfield ) {
                    if ( subfield.value === "y" ) {
                        index.pushField( "facet.sheetMusic", "music-minus-one" );
                    }
                } );

            } );
            record.eachField( "009", function( field ) {
                field.eachSubField( 'a', function( field, subfield ) {
                    if ( subfield.value.match( /c|d/ ) ) {
                        isMusicalia = true;
                    }
                } );
                if ( isMusicalia === false ) {
                    field.eachSubField( 'b', function( field, subfield ) {
                        if ( subfield.value.match( /c|d/ ) ) {
                            isMusicalia = true;
                        }
                    } );
                }

                field.eachSubField( 'g', function( field, subfield ) {
                    if ( subfield.value === "xe" ) {
                        isElectronic = true;
                    }
                } );
                if ( isMusicalia === false ) {
                    field.eachSubField( 'h', function( field, subfield ) {
                        if ( subfield.value === "xe" ) {
                            isElectronic = true;
                        }
                    } );
                }
                if ( isMusicalia === true && isElectronic === true ) {
                    index.pushField( "facet.sheetMusic", "e-noder" );
                }
            } );
        }
        Log.trace( "Leaving: facet.createSheetMusic method" );

        return index;

    };

    /**
     * Method that creates facet.extraTitles from marc 032*x .This index is created specially for eReolen
     * so they can filter on titles that their users can lend even if they have succeeded their quota.
     *
     *
     * @syntax FacetIndex.createExtraTitles( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name FacetIndex.createExtraTitles
     * @method
     */
    that.createExtraTitles = function( index, commonDataXml, record ) {

        Log.trace( "Entering: facet.createExtraTitles method" );

        if ( record !== undefined ) {
            record.eachField( '032', function( field ) {
                field.eachSubField( 'x', function( field, subfield ) {
                    if ( subfield.value.match( /ERA/ ) ) {
                        index.pushField( "facet.extraTitles", "ekstra titler" );
                    }
                } );
            } );
        }

        Log.trace( "Leaving: facet.createExtraTitles method" );

        return index;

    };


    /**
     * Dummy Method for documenting where values of facet.dateFirstEdition come from
     * See code in SortIndex.createSortDateFirstEdition for the actual data handling
     *
     * @syntax FacetIndex.createTermDateFirstEdition( )
     * @name FacetIndex.createDateFirstEdition
     * @method
     */
    that.createDateFirstEdition = function( ) {
        Log.trace( "Entering: FacetIndex.createDateFirstEdition" );
        //see SortIndex.createSortDateFirstEdition and schema.xml in solr-config.xml
        Log.debug( "values in facet.dateFirstEdition are created by copying values from sort.dateFirstEdition in solr" );
        Log.trace( "Leaving: FacetIndex.createDateFirstEdition" );
    };

    return that;

}();
