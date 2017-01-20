use( "XmlUtil" );
use( "XPath" );
use( "Log" );
use( "OpenFormatUtil" );

EXPORTED_SYMBOLS = [ 'DisplayIndex' ];

/**
 * Module with functions that create display indexes.
 *
 * Contains functions to create display index fields
 *
 * @type {namespace}
 * @namespace
 * @name DisplayIndex
 */
var DisplayIndex = function( ) {

    var that = {};

    /**
     * Method that creates display index fields.
     *
     *
     * @type {method}
     * @syntax DisplayIndex.createFields( index, commonDataXml, record )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} record a marc record
     * @param {Object} marcObjects containing the separate marc elements
     * @return {Object} Index with added fields
     * @name DisplayIndex.createFields
     * @method
     */
    that.createFields = function( index, commonDataXml, record, marcObjects ) {

        Log.trace( "Entering: DisplayIndex.createFields method" );

        DisplayIndex.createTitle( index, commonDataXml, record, marcObjects );
        DisplayIndex.createTitleFull( index, commonDataXml, record, marcObjects );
        DisplayIndex.createDependentTitle( index, commonDataXml, record );
        DisplayIndex.createCreator( index, commonDataXml, marcObjects );
        DisplayIndex.createLanguage( index, commonDataXml );
        DisplayIndex.createType( index, commonDataXml );
        DisplayIndex.createWorkType( index, commonDataXml );
        DisplayIndex.createAccessType( index, commonDataXml );
        DisplayIndex.createPartOf( index, commonDataXml );
        DisplayIndex.createCoverUrl( index, commonDataXml );

        Log.trace( "Leaving: DisplayIndex.createFields method" );

        return index;

    };

    /**
     * Method that creates display.title fields.
     *
     * Creates one display.title index field for each dc:title in DKABM that
     * does not have xsi:type=dkdcplus:full or dkdcplus:series
     *
     * @syntax DisplayIndex.createTitle( index, commonDataXml, record, marcObjects )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} marcObjects containing the separate marc elements
     * @param {Object} record a marc record
     * @return {Object} Index with added fields
     * @name DisplayIndex.createTitle
     * @method
     */
    that.createTitle = function( index, commonDataXml, record, marcObjects ) {

        Log.trace( "Entering: DisplayIndex.createTitle method" );

        var type = XPath.selectText( "/*/dkabm:record/dc:type[ @xsi:type = 'dkdcplus:BibDK-Type' ]", commonDataXml );
        var sType = "";
        if ( marcObjects !== undefined ) {
            sType = String( marcObjects.type );  //LSK: sType should be renamed to levelType or something that says more about what it is
        }
        Log.debug( "Type : " + type + " sType : " + sType );

        // when it's a yearbook or series catalogued as multi volume treat it as single record
        // it is not matched with other records in the multi volume set
        // anyhow only create one display.title
        if ( sType !== "single" && sType !== "" && type.match( /rbog|Serie/ ) ) {

            var mainAtitle = "";
            var sectionTitle = "";
            var volumeTitle = "";
            var sTitle = "";
            var vTitle = "";
            var nTitle = "";
            var gTitle = "";

            var punctuation = {
                "a": {
                    prefix: ". ",
                    suffix: "",
                    group: "",
                    max: 999,
                    count: 0
                },
                "b": {
                    prefix: " ",
                    suffix: "",
                    group: "",
                    max: 999,
                    count: 0
                },
                "x": {
                    prefix: ". ",
                    suffix: "",
                    group: "",
                    max: 999,
                    count: 0
                }
            };

            switch ( sType ) {
                case "section":
                    marcObjects.main.eachField( "245", function( field ) {
                        mainAtitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[a]/, punctuation );
                    } );
                    marcObjects.section.eachField( "245", function( field ) {
                        nTitle = field.getValue( /n/ );
                        sTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[ax]/, punctuation );
                        if ( sTitle !== "" && nTitle !== "" ) {
                            nTitle += ". ";
                        }
                        sectionTitle = ". " + nTitle + sTitle;
                    } );

                    marcObjects.volume.eachField( "245", function( field ) {
                        gTitle = field.getValue( /g/ );
                        vTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[ax]/, punctuation );
                        if ( vTitle !== "" && gTitle !== "" ) {
                            gTitle += ". ";
                        }
                        volumeTitle = ". " + gTitle + vTitle;
                    } );
                    break;
                case "volume":
                    marcObjects.main.eachField( "245", function( field ) {
                        mainAtitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[a]/, punctuation );
                    } );
                    marcObjects.volume.eachField( "245", function( field ) {
                        gTitle = field.getValue( /g/ );
                        vTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[ax]/, punctuation );
                        if ( vTitle !== "" && gTitle !== "" ) {
                            gTitle += ". ";
                        }
                        volumeTitle = ". " + gTitle + vTitle;
                    } );
                    break;
            }

            index.pushField( "display.title", mainAtitle + sectionTitle + volumeTitle );

        } else {

            XPath.forEachNodeText( "/*/dkabm:record/dc:title[not(@xsi:type='dkdcplus:full') and not(@xsi:type = 'dkdcplus:series') ]", commonDataXml, function( text ) {
                index.pushField( "display.title", text );
            } );

        }

        Log.trace( "Leaving: DisplayIndex.createTitle method" );

        return index;

    };

    /**
     * Method that creates display.titleFull fields.
     *
     * Creates one display.titleFull index field for each dc:title in DKABM that has
     * xsi:type=dkdcplus:full or specific marc fields if it is a marc record
     *
     * @syntax DisplayIndex.createTitleFull( index, commonDataXml, record, marcObjects)
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} record a marc record
     * @param {Object} marcObjects containing the separate marc elements
     * @return {Object} Index with added fields
     * @name DisplayIndex.createTitleFull
     * @method
     */
    that.createTitleFull = function( index, commonDataXml, record, marcObjects ) {

        Log.trace( "Entering: DisplayIndex.createTitleFull method" );

        var punctuation = {
            "a": {
                prefix: ". ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            },
            "b": {
                prefix: " ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            },
            "c": {
                prefix: " : ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            },
            "x": {
                prefix: ". ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            }
        };

        var punctuation239 = {
            "t": {
                prefix: ". ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            },
            "b": {
                prefix: " : ",
                suffix: "",
                group: "",
                max: 999,
                count: 0
            }
        };

        var type = XPath.selectText( "/*/dkabm:record/dc:type[@xsi:type='dkdcplus:BibDK-Type']", commonDataXml );
        var workType = XPath.selectText( "/*/adminData/workType[ 1 ]", commonDataXml );
        var sType = "";
        if ( marcObjects !== undefined ) {
            sType = String( marcObjects.type ); //LSK: sType should be renamed to levelType or something that says more about what it is
        }
        Log.debug( "Type : " + type + ", sType : " + sType, ", workType : ", workType );

        var titleFullCreated = false;
        var oTitle = "";
        var title = "";

        //if workType is "movie" and 245*oe is not empty, we want it added to the title
        if ( workType === "movie" && marcObjects !== undefined ) {
            Log.debug( "workType is MOVIE" );
            marcObjects.merged.eachField( "245", function( field ) {
                var mainTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abcx]/, punctuation );
                oTitle = field.getValue( /\u00f8/ );
                if ( oTitle !== "" ) {
                    index.pushField( "display.titleFull", mainTitle + ". " + oTitle );
                    titleFullCreated = true;
					Log.trace( "Leaving: DisplayIndex.createTitleFull method" );
                    return index;
                } else {
                    index.pushField( "display.titleFull", mainTitle);
                    titleFullCreated = true;
					Log.trace( "Leaving: DisplayIndex.createTitleFull method" );
                    return index;
                }

            } );

        } else {

	        // when it's a yearbook or series catalogued as multi volume treat it as single record
	        // it is not matched with other records in the multi volume set
	        // anyhow only create one display.titleFull
	        if ( sType !== "single" && sType !== "" && type.match( /rbog|Serie/ ) ) {
	            Log.debug( "AARBOG" );
	
	            var mainAtitle = "";
	            var sectionTitle = "";
	            var volumeTitle = "";
	            var sTitle = "";
	            var vTitle = "";
	            var nTitle = "";
	            var gTitle = "";
	
	
	            var __makeVolumeFull = function( marcObjects ) {
	                marcObjects.volume.eachField( "245", function( field ) {
	                    gTitle = field.getValue( /g/ );
	                    vTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abc]/, punctuation );
	                    if ( vTitle !== "" ) {
	                        gTitle += ". ";
	                    }
	                    volumeTitle = gTitle + vTitle;
	                } );
	
	            };
	
	            switch ( sType ) {
	                case "section":
	                    marcObjects.main.eachField( "245", function( field ) {
	                        mainAtitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abc]/, punctuation );
	                    } );
	                    marcObjects.section.eachField( "245", function( field ) {
	                        nTitle = field.getValue( /n/ );
	                        sTitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abc]/, punctuation );
	                        if ( sTitle !== "" ) {
	                            nTitle += ". ";
	                        }
	                        sectionTitle = ". " + nTitle + sTitle;
	                    } );
	
	                    __makeVolumeFull( marcObjects );
	
	                    break;
	                case "volume":
	                    marcObjects.main.eachField( "245", function( field ) {
	                        mainAtitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abc]/, punctuation );
	                    } );
	                    __makeVolumeFull( marcObjects );
	                    break;
	            }
	
	            index.pushField( "display.titleFull", mainAtitle + sectionTitle + ". " + volumeTitle );
				Log.trace( "Leaving: DisplayIndex.createTitleFull method" );
	            return index;
	
	        }
	
	        if ( sType === "section" || sType === "volume" ) {
	            marcObjects.main.eachField( "245", function( field ) {
	                mainAtitle = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abcx]/, punctuation );
	            } );
	
	            index.pushField( "display.titleFull", mainAtitle );
	            return index;
	
	        } else {
	
	            if ( record !== undefined ) {
	                Log.debug( "Came here MARC" );
	                if ( record.getValue( "239", "t" ) ) {
	                    record.eachField( "239", function( field ) {
	                        title = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[tb]/, punctuation239 );
	                    } );
	                    if ( title !== "" ) {
	                        index.pushField( "display.titleFull", title );
	                        titleFullCreated = true;
	                    }
	                }
	                if ( title === "" ) {
	                    record.eachField( "245", function( field ) {
	                        title = OpenFormatUtil.formatAnyMarcField.inputIsMarc( field, /[abcx]/, punctuation );
	                        Log.debug( "tFULL: ", title );
	                        // do this only once
	                        if ( title !== "" && !titleFullCreated ) {
	                            index.pushField( "display.titleFull", title );
	                            titleFullCreated = true;
	                        }
	                    } );
	                }
	            }
	        }
        }

        if ( titleFullCreated === false ) {
            XPath.forEachNodeText( "/*/dkabm:record/dc:title[@xsi:type='dkdcplus:full']", commonDataXml, function( text )  {
                index.pushField( "display.titleFull", text );
            } );
        }

        Log.trace( "Leaving: DisplayIndex.createTitleFull method" );

        return index;

    };

    /**
     * Method that creates display.dependentTitle fields.
     *
     *
     * @syntax DisplayIndex.createDependentTitle( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} record an object with data from MARC
     * @return {Object} Index with added fields
     * @name DisplayIndex.createDependentTitle
     * @method
     */
    that.createDependentTitle = function( index, commonDataXml, record ) {

        Log.trace( "Entering: DisplayIndex.createDependentTitle method" );

        if ( record !== undefined ) {
            record.eachField( "245", function( field ) {
                field.eachSubField( "y", function ( field, subfield ) {
                    index.pushField( "display.dependentTitle", subfield.value );
                } );
            } );
        }

        Log.trace( "Leaving: DisplayIndex.createDependentTitle method" );

        return index;

    };

    /**
     * Method that creates display.creator fields.
     *
     * Creates one display.creator index field from dc:creator in DKABM that
     * does not have xsi:type=oss:sort
     *
     * @type {method}
     * @syntax DisplayIndex.createCreator( index, commonDataXml, marcObjects )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} marcObjects containing the separate marc elements
     * @return {Object} Index with added fields
     * @name DisplayIndex.createCreator
     * @method
     */
    that.createCreator = function( index, commonDataXml, marcObjects ) {

        Log.trace( "Entering: DisplayIndex.createCreator method" );

        var child;
        var field100Array = [ ];
        var field700Array = [ ];
        var length100 = 0;
        var length700 = 0;
        var workType = XPath.selectText( "/*/adminData/workType", commonDataXml );
        var genre = "";
        var authorName = "";
        var marcType = "";
        var libraryType = XPath.selectText( "/*/adminData/libraryType", commonDataXml );
        var isDBC = false;

        var punctuationPerson = {
            "h": [ ", ", "" ],
            "a": [ " ", "" ],
            "e": [ ", ", "" ],
            "f": [ ", ", "" ],
            "c": [ " (", ")" ],
            "o": [ "", "" ]
        };


        if ( marcObjects === undefined ) {
            XPath.forEachNodeText( "/*/dkabm:record/dc:creator[ not( @xsi:type='oss:sort' ) ]", commonDataXml, function( text )  {
                index.pushField( "display.creator", text );
            } );
        }
        if ( marcObjects !== undefined ) {
            marcType = String( marcObjects.type );
            genre = XPath.selectText( "/*/adminData/genre", commonDataXml );

            Log.debug( "marcType: ", marcType );
            Log.debug( "GENRE: ", genre );

            //if there are volumes or sections, only use fields from main
            var marc = marcObjects.single;
            if ( marcType === "volume" || marcType === "section" ) {
                marc = marcObjects.main;
            }

            var submitter = XPath.selectText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '001' ]/marcx:subfield[ @code = 'b' ]", commonDataXml );

            if ( submitter.match( /87097[0-9]/ ) ) {
                isDBC = true;
            }

            Log.debug( "SUBMITTER: ", submitter );
            Log.debug( "isDBC: ", isDBC );
            Log.debug( "WORKTYPE: ", workType );

            //a function for creating an array of authors from fields 100 or 110
            var __create100Array = function( marc ) {
                marc.eachField( /1[01]0/, function( field ) {
                    if ( field.exists( /4/ ) ) {
                        var func = String( field.getValue( /4/, " " ) );
                        if ( func.match( /aut|ill|drm|ivr|dkbea/ ) !== null ) {
                            authorName = OpenFormatUtil.formatAuthorField( field, false, punctuationPerson );
                            field100Array.push( authorName );
                        }
                    } else {
                        authorName = OpenFormatUtil.formatAuthorField( field, false, punctuationPerson );
                        field100Array.push( authorName );
                    }

                } );
            };
            //a function for creating an array of authors from fields 700 or 710
            var __create700Array = function( marc ) {
				var hasSubfield4 = false;
                marc.eachField( /7[01]0/, function( field ) {
                    if ( field.exists( /4/ ) ) {
                        var func = String( field.getValue( /4/, " " ) );
                        if ( func.match( /aut|ill|drm|ivr|dkbea/ ) !== null ) {
                            var authorName = OpenFormatUtil.formatAuthorField( field, false, punctuationPerson );
                            field700Array.push( authorName );
							hasSubfield4 = true;

                        }
					} else if ( hasSubfield4 !== true ) {
                        authorName = OpenFormatUtil.formatAuthorField( field, false, punctuationPerson );
                        field700Array.push( authorName );
                    }
                } );

            };

            //If material is article we use op to 10 authors from 7[01]0
            if ( workType === "article" ) {
                __create700Array( marc );
                if ( field700Array.length < 11 ) {
                    for ( var i = 0; field700Array.length > i; ++i ) {
                        index.pushField( "display.creator", field700Array[ i ] );
                    }
                }
				Log.trace( "Leaving: DisplayIndex.createCreator method" );
                return index;
            } else {
                //use author from 239 if there is one
                marc.eachField( "239", function( field ) {
                    if ( field.exists( /a/ ) ) {
                        authorName = OpenFormatUtil.formatAuthorField( field, false, punctuationPerson );
                        index.pushField( "display.creator", authorName );
						Log.trace( "Leaving: DisplayIndex.createCreator method" );
                        return index;
                    }
                } );
            }

            if ( genre === "fiktion" ) {
                //if fiction check for author in 1[10]0
                __create100Array( marc );
                length100 = field100Array.length;
                if ( length100 === 1 ) {
                    authorName = String( field100Array[ 0 ] );
                    index.pushField( "display.creator", authorName );
                }
                //also check for 7[10]0 but only use if 2 authors or less
                __create700Array( marc );
                length700 = field700Array.length;
                if ( length100 === 1 && length700 > 0 && length700 < 3 ) {
                    for ( i = 0; length700 > i; ++i ) {
                        index.pushField( "display.creator", field700Array[ i ] );
                    }
                }
                //if there is no 1[10]0 and the libraryType is "research" we use 7[10]0 if there are less than 4 authors in the array
                if ( libraryType === "research" && length100 === 0 && length700 < 4 ) {
                    for ( i = 0; length700 > i; ++i ) {
                        authorName = String( field700Array[ i ] );
                        index.pushField( "display.creator", authorName );
                    }
                }
                //if there is no 1[10]0 and the libraryType is "research" and there are more than 3 authors in 7[10]0 we check for 245e and if it exists we use the first 7[10]0
                if ( libraryType === "research" && length100 === 0 ) {
                    marc.eachField( "245", function( field ) {
                        if ( field.exists( /e/ ) ) {
                            authorName = String( field700Array[ 0 ] );
                            index.pushField( "display.creator", authorName );
                        }
                    } );
                }
            }
            if ( genre !== "fiktion" ) {
                //if NON-fiction check for author in 1[10]0
                __create100Array( marc );
                length100 = field100Array.length;
                if ( length100 === 1 ) {
                    authorName = String( field100Array[ 0 ] );
                    Log.debug( "AUTHOR: ", authorName );
                    index.pushField( "display.creator", authorName );
                } else if ( isDBC === false ) {
                    __create700Array( marc );
                    length700 = field700Array.length;
                    if ( length700 === 1 ) {
                        authorName = String( field700Array[ 0 ] );
                        index.pushField( "display.creator", authorName );
                    }
                    //if there is more than one author in 7[10]0 and genre is not defined
                    // we use the first author if there exists 245e
                    if ( length700 > 1 && genre === "" ) {
                        marc.eachField( "245", function( field ) {
                            if ( field.exists( /e/ ) ) {
                                authorName = String( field700Array[ 0 ] );
                                index.pushField( "display.creator", authorName );
                            }
                        } );

                    }
                }

            }
        }

        Log.trace( "Leaving: DisplayIndex.createCreator method" );

        return index;

    };

    /**
     * Method that creates display.language fields.
     *
     * Creates one display.language index field from dc:language in DKABM that
     * does not have xsi:type=dcterms:ISO639-2
     *
     * @type {method}
     * @syntax DisplayIndex.createLanguage( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createLanguage
     * @method
     */
    that.createLanguage = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createLanguage method" );

        var workType = XPath.selectText("/*/adminData/workType", commonDataXml );
        if ( workType === "literature" || workType === "article" ) {
            var languageNodes = XPath.select("/*/dkabm:record/dc:language[ not( @xsi:type='dcterms:ISO639-2' ) ]", commonDataXml );
            if( languageNodes.length > 1 ){
                index.pushField( "display.language", "Flere sprog" );
            } else if( languageNodes.length === 1){
                index.pushField( "display.language", languageNodes[ 0 ].textContent );
            } else {
                Log.debug( "DisplayIndex.createLanguage no display.language index created as no language found" );
            }
        }

        Log.trace( "Leaving: DisplayIndex.createLanguage method" );

        return index;

    };

    /**
     * Method that creates display.type fields.
     *
     * Creates one display.type index field from dc:type in DKABM that has
     * xsi:type=ddkdcplus:BibDK-Type. Remove 'undefined' until fixed in
     * convert
     *
     * @type {method}
     * @syntax DisplayIndex.createType( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createType
     * @method
     */
    that.createType = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createType method" );

        var child;
        var volumeObject = {
            mainData: "",
            volumeData: "",
            volumeType: ""
        };
        var valueData = "";
        var workType = String(XPath.selectText("/*/adminData/workType", commonDataXml ));
        Log.debug("WORKTYPE: ", workType);

        // if this is a multi volume record, collect data from section and volume unless workType is movie
        // if workType is movie - use subfield g from the merged part
        if ( XPath.select( "count(/*/marcx:collection/marcx:record)", commonDataXml) > 1 ) {
            Log.debug("HOV!");
            if(workType !== "movie"){
                volumeObject = DisplayIndex.createMultiVolumeDescription( commonDataXml, volumeObject );
            } else{ Log.debug("HIP!");
                 var field245g = XPath.selectText("/*/marcx:collection/marcx:record[@type = 'Bibliographic']/marcx:datafield[@tag = '245']/marcx:subfield[ @code = 'g' ]", commonDataXml);
                        if ( field245g !== "" ) {
                            volumeObject.mainData = field245g.replace( /\[|\]/g, "" );
                            Log.debug("HOP!");
                        }
            }

        } else {
            // single record, but check for "dependent title"
            var field245y = XPath.selectText("/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'y' ]", commonDataXml );
            if ( field245y !== "" ) {
                volumeObject.mainData = field245y.replace( /\[|\]/g, "" );
            }
        }

        valueData = volumeObject.mainData;
        if ( valueData !== "" || volumeObject.volumeData !== "" ) {
            if ( valueData !== "" && volumeObject.volumeData !== "" ) {
                valueData += ". ";
            }
            valueData = " (" + valueData + volumeObject.volumeData + ")";
            Log.debug("VALUEDATA: ", valueData);
        }

        XPath.forEachNodeText( "/*/dkabm:record/dc:type[@xsi:type='dkdcplus:BibDK-Type']", commonDataXml, function(text)  {
            if (text !== "undefined") {
                index.pushField( "display.type", String( text ) + valueData );
            }
        });
        if ( volumeObject.volumeType !== "" ) {
            index.pushField( "display.multiVolumeType", volumeObject.volumeType );
        }

        Log.trace( "Leaving: DisplayIndex.createType method" );

        return index;

    };

    /**
     * Method that creates part of display.type fields for multi volume records.
     *
     * @type {method}
     * @syntax DisplayIndex.createMultiVolumeDescription( commonDataXml, volumeDescription )
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @param {Object} volumeDescription initialized object to be returned with data
     * @return {Object} VolumeDescription object with data from the records
     * @example DisplayIndex.createMultiVolumeDescription( commonDataXml, volumeDescription )
     * @name DisplayIndex.createMultiVolumeDescription
     * @method
     */
    that.createMultiVolumeDescription = function( commonDataXml, volumeDescription ) {

        Log.trace( "Entering: DisplayIndex.createMultiVolumeDescription method" );

        var __findVolumeWords = function( child ) {
            var value = XmlUtil.getText( child ).replace( /\[|\]/g, "" );
            if ( value.match( /^\d+$/ ) ) {
                volumeDescription.volumeData = "bind " + value;
            } else if ( value.match( /^\d+\. b.*/ ) ) {
                volumeDescription.volumeData = "bind " + value.replace( /^(\d+)\. b.*/, "$1" );
            } else if ( value.match( /^[b|v|d].* \d+$/i ) ) {
                volumeDescription.volumeData = "bind " + value.replace( /^[b|v|d].* (\d+)$/i, "$1" );
            } else if ( value.match( /^mappe \d+.*/i ) ) {
                volumeDescription.volumeData = "mappe " + value.replace( /^Mappe (\d+).*/i, "$1" );
            } else {
                volumeDescription.volumeData = value;
            }
        };

        var recordElements = XPath.select( "/*/marcx:collection/marcx:record",  commonDataXml );
        for ( var index1 = 0 ; index1 < recordElements.length; index1++ ){
            var recordChild = recordElements[index1];
            var type = XmlUtil.getAttribute(recordChild, "type");
            Log.debug("DisplayIndex.createMultiVolumeDescription, type:", type);

            switch ( type ) {
                case "BibliographicMain":
                    var field245y = XPath.selectText("marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'y' ]", recordChild);
                    if ( field245y !== "") {
                        volumeDescription.mainData = field245y.replace( /\[|\]/g, "" );
                    }
                    break;
                case "BibliographicSection":
                    if ( XPath.select("count(marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'n' ])",  recordChild ) > 0 ) {
                        var elements = XPath.select( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'n' ]", recordChild );
                        for ( var index = 0; index < elements.length; index++ ) {
                            __findVolumeWords( elements[index] );
                        }
                    } else {
                        var field245o = XPath.selectText("marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'o' ][1]", recordChild);
                        if ( field245o !== "" ) {
                            volumeDescription.volumeData = field245o.replace( /\[|\]/g, "" );
                        }
                    }
                    volumeDescription.volumeType = "section";
                    break;
                case "BibliographicVolume":
                    // don't ruin the section data if they allready are output
                    if ( volumeDescription.volumeType === "" ) {
                        if ( XPath.select("count(marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'g' ])",  recordChild ) > 0 ) {
                            var elements = XPath.select( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'g' ]", recordChild );
                            for ( var index = 0; index < elements.length; index++ ) {
                                __findVolumeWords( elements[index] );
                            }
                        } else {
                            var field245a = XPath.selectText("marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'a' ][1]", recordChild);
                            if ( field245a !== "" ) {
                                volumeDescription.volumeData = field245a.replace( /\[|\]/g, "" );
                            }
                        }
                    }
                    break;
            }
        }

        Log.trace( "Leaving: DisplayIndex.createMultiVolumeDescription method" );

        return volumeDescription;

    };

    /**
     * Method that creates display.workType fields.
     *
     * Creates one display.workType index field containing workType, created
     * based on value in dc:type in DKABM
     *
     * @type {method}
     * @syntax DisplayIndex.createWorkType( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createWorkType
     * @method
     */
    that.createWorkType = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createWorkType method" );

        var child;
        XPath.forEachNodeText( "/*/dkabm:record/dc:type[ @xsi:type='dkdcplus:BibDK-Type' ]", commonDataXml, function(text)  {
            if ( text !== "undefined" ) {
                var workType = DisplayIndex.getWorkType( text );

                if ( workType === undefined ) {
                    workType = "other";
                }
                index.pushField( "display.workType", workType );
            }
            if ( workType === "movie" ) {
                var subText = XPath.selectText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '009' ]/marcx:subfield[ @code = 'a' ][ 1 ]", commonDataXml);
                if ( subText.match( /s/ ) ) {
                    index.pushField( "display.workType", "music" );
                }
            }
        });
        Log.trace( "Leaving: DisplayIndex.createWorkType method" );

        return index;
    };

    /**
     * Method that creates a workType.
     *
     * Creates one work, created based on a material type
     *
     * @type {method}
     * @syntax DisplayIndex.getWorkType( type )
     * @param {String} type The material type to create work type from
     * @return {String} The work type
     * @name DisplayIndex.getWorkType
     * @method
     */
    that.getWorkType = function( type ) {

        Log.trace( "Entering: DisplayIndex.getWorkType method" );

        // remember to inform OpenFormat about all changes here

        var workTypes = {
            "Billedbog": "book",
            "Bog": "book",
            "Bog stor skrift": "book",
            "Diskette": "other", // changed from book
            "DTBook": "book",
            "Ebog": "book",
            "\u00C5rbog": "book",
            "Netdokument": "book",
            "Punktskrift": "book",
            "Tegneserie": "book",
            "Graphic novel": "book",
            "Lydbog (b\u00e5nd)": "audiobook",
            "Lydbog (cd)": "audiobook",
            "Lydbog (net)": "audiobook",
            "Lydbog (cd-mp3)": "audiobook",
            "Blu-ray": "movie",
            "Dvd": "movie",
            "Dvd-rom": "book",
            "Film (net)": "movie",
            "Video": "movie",
            "B\u00e5nd": "music",
            "Cd (musik)": "music",
            "Grammofonplade": "music",
            "Mini disc": "music",
            "Musik (net)": "music",
            "GameBoy": "game",
            "GameBoy Advance": "game",
            "Nintendo DS": "game",
            "Pc-spil": "game",
            "Pc-spil (net)": "game",
            "Playstation": "game",
            "Playstation 2": "game",
            "Playstation 3": "game",
            "PSP": "game",
            "Wii": "game",
            "Xbox": "game",
            "Xbox 360": "game",
            "Artikel": "article",
            "Avisartikel": "article",
            "Tidsskriftsartikel": "article",
            "Node": "sheetmusic",
            "Periodikum": "periodica",
            "Periodikum (net)": "periodica",
            "Avis": "periodica",
            "Avis (net)": "periodica"
        };

        var workType = workTypes[ type ];

        Log.trace( "Leaving: DisplayIndex.getWorkType method" );

        return workType;

    };


    /**
     * Method that creates display.accessType fields.
     *
     * Creates one display.accessType index fields from the adminData in
     * commonData
     *
     * @type {method}
     * @syntax DisplayIndex.createAccessType( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createAccessType
     * @method
     */
    that.createAccessType = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createAccessType method" );

        var child;
        XPath.forEachNodeText("/*/adminData/accessType", commonDataXml, function(text) {
            index.pushField( "display.accessType", String( text ) );
        });

        Log.trace( "Leaving: DisplayIndex.createAccessType method" );

        return index;

    };

    /**
     * Method that creates display.partOf fields for articles.
     *
     * Creates one display.partOf index fields from the dcterms:isPartOf in
     * DKABM that does not have xsi:type=dcterms:ISSN/ISBN
     *
     * @type {method}
     * @syntax DisplayIndex.createPartOf( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createPartOf
     * @method
     */
    that.createPartOf = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createPartOf method" );

        if ( XPath.selectText( "/*/dkabm:record/dc:type", commonDataXml ).match( /artikel/i ) ) {
            XPath.forEachNodeText("/*/dkabm:record/dcterms:isPartOf[ not( @xsi:type = 'dkdcplus:ISSN' ) and not( @xsi:type = 'dkdcplus:ISBN' ) ]", commonDataXml, function(text) {
                index.pushField( "display.partOf", text );
            });
        }

        Log.trace( "Leaving: DisplayIndex.createPartOf method" );

        return index;
    };

    /**
     * Method that creates display.coverUrl fields for albums.
     *
     * Creates one display.coverUrl index fields from commonDataXml
     *
     * @type {method}
     * @syntax DisplayIndex.createCoverUrl( index, commonDataXml )
     * @param {Object} index The index being created
     * @param {Document} commonDataXml The XML from which to create the index fields
     * @return {Object} Index with added fields
     * @name DisplayIndex.createCoverUrl
     * @method
     */
    that.createCoverUrl = function( index, commonDataXml ) {

        Log.trace( "Entering: DisplayIndex.createCoverUrl" );

        XPath.forEachNodeText("/*/ln:links/ln:link[ln:relationType[ text()='dbcaddi:hasCover']]/ln:url", commonDataXml, function(text) {
            index.pushField( "display.coverUrl", text );
        });

        Log.trace( "Leaving: DisplayIndex.createCoverUrl method" );

        return index;

    };

    return that;

}( );


