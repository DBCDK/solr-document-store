/** @file Module that produces sort index fields for the datawell (corepo). */

use( "Log" );
use( "XmlUtil" );
use( "XPath" );

EXPORTED_SYMBOLS = [ 'SortIndex' ];

/**
 * Module with functions that create sort indexes.
 *
 * Contains functions to create sort index fields
 *
 * @type {namespace}
 * @namespace
 * @name SortIndex
 */
var SortIndex = function() {

    var that = {};

    /**
     * Method that creates sort index fields.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortFields( index, commonDataXml, dcDataXml, pid, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Document} dcDataXml Xml object containing dublin core data
     * @param {String} pid pid of the object being indexed
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name SortIndex.createSortFields
     * @method
     */
    that.createSortFields = function( index, commonDataXml, dcDataXml, pid, record ) {

        Log.trace( "Entering: createSortFields method" );

        SortIndex.createSortDate( index, commonDataXml );
        SortIndex.createSortAcquisitionDate( index, commonDataXml );
        SortIndex.createSortCreator( index, commonDataXml );
        SortIndex.createSortTitle( index, commonDataXml, record );
        SortIndex.createSortComplexKey( index, commonDataXml, dcDataXml, record );
        SortIndex.createSortWorkType( index, dcDataXml );
        SortIndex.createSortRecordOwner( index, pid );
        SortIndex.createSortArticleDate( index, commonDataXml, record );
        SortIndex.createSortDk5( index, commonDataXml );
        SortIndex.createGenreCategory( index, commonDataXml );
        SortIndex.createSortNumberInSeries( index, commonDataXml );
        SortIndex.createSortDateFirstEdition( index, commonDataXml );

        Log.trace( "Leaving: createSortFields method" );

        return index;

    };

    /**
     * Function that always returns 4 digits converting each ? to 0
     * expanding short strings with 0, extract year from common date formats and
     * truncating long strings to only first 4 digits.
     *
     * @type {method}
     * @syntax SortIndex.__fourDigitDate( dateString )
     * @param {String} dateString date to be converted
     * @return {String} four digits
     * @example SortIndex.__fourDigitDate( "195?" )
     * @name SortIndex.__fourDigitDate
     * @method
     */
    that.__fourDigitDate = function( dateString ) {

        Log.trace( "Entering: SortIndex.__fourDigitDate" );

        var date = dateString;

        if ( date.match( /^\?.*/ ) ) {
            Log.trace( "Leaving: SortIndex.__fourDigitDate" );
            return "0000";
        }

        if ( date.match( /^\d{2}[\/\.-]\d{2}[\/\.-]\d{4}$/ ) ) {
            //handle common formats DD-MM-YYYY, DD.MM.YYYY and DD/MM/YYYY (related to bug#17716)
            //isolate the year which starts at position 6 and goes to the end of the matched string
            date = date.slice( 6 );
        }

        date = date.replace( /[^0-9\?]/g, "" );  //removes characters that are not number or ?
        date = date.replace( /^([0-9\?]{4}).*/, "$1" );  //takes first four digits
        date = date.replace( /\?/g, "0" );  //inserts 0 instead of ?

        //dates with less than 3 digits are not very useful and could very well be errors,
        // so we just set them to 0000
        if ( 3 > date.length ) {
            date = "0000";
        } else {
            while ( date.length < 4 ) {
                date += "0";   //fill up with zeros if date is shorter than 4 characters long
            }
        }

        if ( !date.match( /^[12]/ ) || ( date.match( /^2/ ) && !date.match( /2[0?]/ ) ) ) {
            date = "0000";
        }

        Log.trace( "Leaving: SortIndex.__fourDigitDate" );

        return date;
    };

    /**
     * Method that creates sort.date index fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortDate( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @example SortIndex.createSortDate( index, commonDataXml )
     * @name SortIndex.createSortDate
     * @method
     */
    that.createSortDate = function( index, commonDataXml ) {

        Log.trace( "Entering: createSortDate method" );

        var date = XPath.selectText( "/*/dkabm:record/dc:date[ 1 ]", commonDataXml );

        // don't create sort.date if date is all questionmarks
        if ( date.match( /^\?.*/ ) ) {

            Log.trace( "Leaving: createSortDate method" );

            return index;

        }

        index.pushField( "sort.date", SortIndex.__fourDigitDate( date ) );

        Log.trace( "Leaving: createSortDate method" );

        return index;

    };

    /**
     * Method that creates sort.acquisitionDate index fields from input data.
     * This method was created for bibliotek.dk
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortAcquisitionDate( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createSortAcquisitionDate
     * @method
     */
    that.createSortAcquisitionDate = function( index, commonDataXml ) {

        Log.trace( "Entering: createSortAcquisitionDate method" );

        XPath.forEachNodeText( "/*/adminData/creationDate", commonDataXml, function( text ) {
            text = text.replace(/-/g,'');
            index.pushField( "sort.acquisitionDate", text );
        } );

        Log.trace( "Leaving: createSortAcquisitionDate method" );

        return index;

    };

    /**
     * Method that creates sort.localAcquisitionDate index field from input data.
     * This method was created for the public libraries
     *
     * @type {method}
     * @syntax SortIndex.createSortLocalAcquisitionDate( index, record )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createSortLocalAcquisitionDate
     * @method
     */
    that.createSortLocalAcquisitionDate = function( index, commonDataXml ) {

        Log.trace( "Entering: createSortLocalAcquisitionDate method" );

        // sort fields are single value fields. But records may contain multiple 096 t fields
        // Choose the first found value for sorting
        var text = XPath.selectText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '096' ]/marcx:subfield[ @code = 't' ]", commonDataXml );
        if ( text !== "" ) {
            index.pushField( "sort.localAcquisitionDate", text );
        }

        Log.trace( "Leaving: createSortLocalAcquisitionDate method" );

        return index;

    };

    /**
     * Method that creates sort.creator index fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortCreator( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @example SortIndex.createSortCreator( index, commonDataXml )
     * @name SortIndex.createSortCreator
     * @method
     */
    that.createSortCreator = function( index, commonDataXml ) {

        Log.trace( "Entering: createSortCreator method" );

        // only add the first one ([1])
        XPath.forEachNodeText( "/*/dkabm:record/dc:creator[ @xsi:type = 'oss:sort'][ 1 ]", commonDataXml, function( text ) {
            index.pushField( "sort.creator", text );
        } );

        Log.trace( "Leaving: createSortCreator method" );

        return index;

    };

    /**
     * Method that creates sort.title index fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortTitle( commonDataXml, index )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @example SortIndex.createSortTitle( index, commonDataXml )
     * @name SortIndex.createSortTitle
     * @method
     */
    that.createSortTitle = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createSortTitle method" );

        var i = 0;

        if ( record !== undefined ) {
            var field239t = record.getFirstValue( "239", /t|T/ );
            var field245a = record.getFirstValue( "245", /a|A/ );
            if ( field239t !== "" ) {
                index.pushField( "sort.title", field239t.replace( /\[|\]/g, "" ) );
                i++;
            } else {
                index.pushField( "sort.title", field245a.replace( /\[|\]/g, "" ) );
                i++;
            }
        }
        if ( i === 0 ) {
            index.pushField( "sort.title", XPath.selectText( "/*/dkabm:record/dc:title[ 1 ] ", commonDataXml ) );
        }

        Log.trace( "Leaving: createSortTitle method" );

        return index;

    };

    /**
     * Method that creates createVolumeNumberPart as part of sort.complexKey fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createVolumeNumberPart( commonDataXml, volumeDescription )
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} volumeDescription object containing initialized properties
     * @return {Object} volumeDescription object with data from different volume parts if pressent
     * @example SortIndex.createVolumeNumberPart( commonDataXml, volumeDescription )
     * @name SortIndex.createVolumeNumberPart
     * @method
     */

    that.createVolumeNumberPart = function( commonDataXml, volumeDescription ) {

        var __findVolumeWords = function( child ) {
            var volumeValue = String( child ).replace( /\[|\]/g, "" );
            var description = "bind ";
            if ( volumeValue.match( /^\d+$/ ) ) {
                //volumeValue = volumeValue;
            } else if ( volumeValue.match( /^\d+\. b.*/ ) ) {
                volumeValue = volumeValue.replace( /^(\d+)\. b.*/, "$1" );
            } else if ( volumeValue.match( /^[b|v|d].* \d+$/i ) ) {
                volumeValue = volumeValue.replace( /^[b|v|d].* (\d+)$/i, "$1" );
            } else if ( volumeValue.match( /^mappe \d+.*/i ) ) {
                volumeValue = volumeValue.replace( /^Mappe (\d+).*/i, "$1" );
                description = "mappe ";
            }
            //Log.debug("volumeValue", volumeValue);
            switch ( true ) {
                case ( volumeValue < 10 ):
                    volumeDescription.volumeData = description + "0a" + volumeValue;
                    break;
                case ( volumeValue < 100 ):
                    volumeDescription.volumeData = description + "0b" + volumeValue;
                    break;
                case ( volumeValue < 1000 ):
                    volumeDescription.volumeData = description + "0c" + volumeValue;
                    break;
                default:
                    if ( volumeValue.match( /d+/ ) ) {
                        // try to make something like: Bd. 1-2
                        // look like: bind 1-2
                        if ( volumeValue.match( /^(bd\.|vol\.) /i ) ) {
                            volumeValue = volumeValue.replace( /^(bd\.|vol\.) (.*)/i, "$2" );
                        }
                        var v = volumeValue.replace ( /[^\d]*(\d+)/, "$1" );
                        Log.debug( "volumeValue v:", v );
                        switch ( true ) {
                            case (v < 10):
                                volumeValue = volumeValue.replace( /(\d+)/, "0a" + v );
                                break;
                            case (v < 100):
                                volumeValue = volumeValue.replace( /(\d+)/, "0b" + v );
                                break;
                            case (v < 1000):
                                volumeValue = volumeValue.replace( /(\d+)/, "0c" + v );
                                break;
                            default:
                                // this is not 100% proof but works if it is like: 1-2 or 90-91
                                if ( v.match( /^\d+\-/ ) ) {
                                    var v1 = v.replace( /^([0-9]+)(\-.*)/, "$1" ); // isolate the digits before hyphen
                                    Log.debug( "v1:", v1 );
                                    switch ( true ) {
                                        case (v1 < 10):
                                            volumeValue = "0a" + v; // no mistake that test is on v1, and output is v
                                            break;
                                        case (v1 < 100):
                                            volumeValue = "0b" + v; // no mistake that test is on v1, and output is v
                                            break;
                                        case (v1 < 1000):
                                            volumeValue = "0c" + v; // no mistake that test is on v1, and output is v
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                    volumeDescription.volumeData = description + volumeValue;
                    break;
            }
        };

        var elements = XPath.select( "/*/marcx:collection/marcx:record", commonDataXml );
        for ( var index = 0; index < elements.length; index++ ) {
            var recordChild = elements[ index ];
            var type = XmlUtil.getAttribute( recordChild, "type" );

            switch ( type ) {
                case "BibliographicMain":
                    var field245y = XPath.selectText( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'y' ]", recordChild );

                    if ( field245y !== "" ) {
                        volumeDescription.mainData = field245y.replace( /\[|\]/g, "" );
                    }
                    break;
                case "BibliographicSection":

                    var found245n = false;
                    XPath.forEachNodeText( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'n' ]", recordChild, function( text ) {
                        __findVolumeWords( text );
                        found245n = true;
                    } );
                    if ( !found245n ) {
                        var field245o = XPath.selectText( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'o' ]", recordChild );
                        if ( field245o !== "" ) {
                            volumeDescription.volumeData = field245o.replace( /\[|\]/g, "" );
                        }
                    }
                    volumeDescription.volumeType = "section";
                    break;
                case "BibliographicVolume":
                    // don't ruin the section data if they allready are output
                    if ( volumeDescription.volumeType === "" ) {
                        var found245g = false;
                        XPath.forEachNodeText( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'g' ]", recordChild, function( text ) {
                            __findVolumeWords( text );
                            found245g = true;
                        } );
                        if ( !found245g ) {
                            var field245a = XPath.selectText( "marcx:datafield[ @tag = '245' ]/marcx:subfield[ @code = 'a' ]", recordChild );
                            if ( field245a !== "" ) {
                                volumeDescription.volumeData = field245a.replace( /\[|\]/g, "" );
                            }
                        }
                    }
                    break;
            }
        }
        return volumeDescription;
    };

    /**
     * Method that creates createVolumeKeyPart as part of sort.complexKey fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createVolumeKeyPart( commonDataXml )
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {String} String with volume description
     * @example SortIndex.createVolumeKeyPart( commonDataXml )
     * @name SortIndex.createVolumeKeyPart
     * @method
     */

    that.createVolumeKeyPart = function( commonDataXml, record ) {
        var volumeObject = {
            mainData: "",
            volumeData: "",
            volumeType: ""
        };
        var valueData = "";

        // if this is a multi volume record, collect data from section and volume
        if ( XPath.select( "count(/*/marcx:collection/marcx:record)", commonDataXml ) > 1 ) {
            volumeObject = SortIndex.createVolumeNumberPart( commonDataXml, volumeObject );
        }
        else if ( record !== undefined ) {
            var field245y = record.getFirstValue( '245', 'y' );
            if ( field245y !== "" ) {
                volumeObject.mainData = field245y.replace( /\[|\]/g, "" );
            }
        }

        if ( volumeObject.mainData !== "" || volumeObject.volumeData !== "" ) {
            if ( volumeObject.mainData !== "" ) {
                valueData = "zzzz" + volumeObject.mainData;
            }
            if ( valueData !== "" && volumeObject.volumeData !== "" ) {
                valueData += " ";
            }
            valueData = valueData + volumeObject.volumeData;
        }
        Log.debug( "SortIndex.createVolumeKeyPart, value is:'", valueData, "'" );
        return valueData;
    };

    /**
     * Method that creates sort.complexKey index fields from input data.
     * sort.complexKey is used by the OpenBibdk service for sorting units within works.
     *
     * @type {method}
     * @syntax SortIndex.createSortComplexKey( index, commonDataXml, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Document} dcDataXml Xml object containing dublin core data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @example SortIndex.createSortComplexKey( index, commonDataXml )
     * @name SortIndex.createSortComplexKey
     * @method
     */
    that.createSortComplexKey = function( index, commonDataXml, dcDataXml, record ) {

        Log.trace( "Entering: createSortComplexKey method" );

        var value = "";

        var dcType = XPath.selectText( "/*/dkabm:record/dc:type", commonDataXml );
        if ( dcType !== "" ) {
            value = dcType.replace( /\(|\)/g, "" ) + "  ";
        } else {
            value = "x  ";
        }

        if ( value === "Blu-ray  " ) {
            value = "v" + value;
        }

        if ( value === "B\u00e5nd  " ) {
            value = "v" + value;
        }

        if ( value === "Cd  " ) {
            value = "Cd x  ";
        }

        if ( value === "Lydbog b\u00e5nd  " ) {
            value = value.replace( / b/, " xb" );
        }

        var volumeDescription = SortIndex.createVolumeKeyPart ( commonDataXml, record );
        if ( volumeDescription !== "" ) {
            value = value + volumeDescription + "  ";
        }

        var specialVersion = String( SortIndex.checkSpecialVersions( commonDataXml, record ) );

        value = value + specialVersion + "  ";

        var i = 0;

        var workType;
        XPath.forEachNodeText( "/*/dc:type", dcDataXml, function( text ) {
            if ( text.match( /WORK:/ ) && i === 0 ) {
                workType = text.replace( /WORK:/, "" );
                i++;
            }
        } );

        var holdingsCount = "9999  ";
        if ( workType === "literature" ) {
            var j = 0;
            XPath.forEachNodeText( "/*/adminData/genre", commonDataXml, function( text ) {
                if ( text === 'fiktion' && j === 0 ) {
                    holdingsCount = "holdings  ";
                    j++;
                }
            } );
        }

        if ( workType === "music" ) {
            holdingsCount = "holdings  ";
        }
        value += holdingsCount;

        var dcDate = XPath.selectText( "/*/dkabm:record/dc:date", commonDataXml );
        if ( dcDate !== "" ) {
            var year = 4000 - Number( SortIndex.__fourDigitDate( dcDate ) );
            value = value + year;
        } else {
            value = value + "4000";
        }

        if ( workType === "music" ) {
            var k = 0;

            if ( record !== undefined ) {
                record.eachField( "239", function( field ) {
                    field.eachSubField( "\u00f8", function( field, subfield ) {
                        if ( k === 0 ) {
                            value = value + "  " + subfield.value;
                            k++;
                        }
                    } );
                } );
                record.eachField( "245", function( field ) {
                    field.eachSubField( "\u00f8", function( field, subfield ) {
                        if ( k === 0 ) {
                            value = value + "  " + subfield.value;
                            k++;
                        }
                    } );
                } );
                record.eachField( "300", function( field ) {
                    field.eachSubField( "n", function( field, subfield ) {
                        if ( subfield.value.match( /\\/ ) && k === 0 ) {
                            value = value + "  " + subfield.value.replace( /\\/g, "" );
                            k++;
                        }
                    } );
                } );
            }
        }

        if ( !value.match( /holdings/ ) ) {
            var submitter = XPath.selectText( "/*/dkabm:record/ac:identifier", commonDataXml ).replace( /.*\|/, "" );

            if ( submitter === "870970" ) {
                value = value + "  a";
            } else {
                value = value + "  b";
            }
        }

        Log.debug( "SORT COMPLEX KEY: ", value );

        index.pushField( "sort.complexKey", value );

        Log.trace( "Leaving: createSortComplexKey method" );

        return index;

    };

    /**
     * Method that creates sort.workType index fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortWorkType( index, dcDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} dcDataXml Xml object containing dublin core data
     * @return {Object} The updated index object
     * @name SortIndex.createSortWorkType
     * @method
     */
    that.createSortWorkType = function( index, dcDataXml ) {

        Log.trace( "Entering: createSortWorkType method" );

        var i = 0;

        var workType;
        XPath.forEachNodeText( "/*/dc:type", dcDataXml, function( text ) {
            if ( text.match( /WORK:/ ) && i === 0 ) {
                workType = text.replace( /WORK:/, "" );
                i++;
            }
        } );

        var type = XPath.selectText( "/*/dc:type[1]", dcDataXml );

        if ( type.match( /Tidsskriftsartikel|Avisartikel|Netdokument/ ) ) {
            workType = type;
        }

        Log.debug( "WORK TYPE: " + workType );

        var value = SortIndex.createWorkType( workType );

        index.pushField( "sort.workType", value );

        Log.trace( "Leaving: createSortWorkType method" );

        return index;

    };

    /**
     * Method that creates the sort work type of the data based on work type from dc-stream or dc:type.
     *
     *
     * @syntax SortIndex.createWorkType( type )
     * @param {String} type The work type or dc:type
     * @return {String} The sort work type
     * @name SortIndex.createWorkType
     * @method
     */
    that.createWorkType = function( type ) {

        Log.trace( "Entering DcStreamCreator.createWorkType" );

        var workTypes = {
            "literature": "aliterature",
            "audiobook": "aliterature",
            "Tidsskriftsartikel": "bjournalarticle",
            "Avisartikel": "cnewspaperarticle",
            "Netdokument": "donlinedocument",
            "movie": "emovie",
            "music": "fmusic",
            "game": "ggame",
            "sheetmusic": "hsheetmusic"
        };

        var workType = workTypes[ type ];

        if ( workType === undefined ) {
            workType = "iother";
        }

        Log.trace( "Leaving DcStreamCreator.createWorkType" );

        return workType;

    };

    /**
     * Method that creates sort.recordOwner index fields from input data.
     *
     *
     * @type {method}
     * @syntax SortIndex.createSortRecordOwner( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {String} pid the identifier of the object
     * @return {Object} The updated index object
     * @name SortIndex.createSortRecordOwner
     * @method
     */
    that.createSortRecordOwner = function( index, pid ) {

        Log.trace( "Entering: createSortRecordOwner method" );

        var owner = pid.replace( /-.*/, "" );
        var begin = owner.replace( /(..)..../, "$1" );

        var value = "";

        switch ( owner ) {
            case "870970":
            case "870971":
            case "870973":
            case "870976":
            case "870978":
                value = "a" + owner;
                break;
            case "810010":
            case "820010":
            case "820030":
            case "820050":
            case "820120":
                value = "b" + owner;
                break;
            case "820040":
                value = "b820100";
                break;
            case "150014":
                value = "d" + owner;
                break;
            default:
                switch ( begin ) {
                    case "15":
                        value = "c" + owner;
                        break;
                    case "12":
                        value = "f" + owner;
                        break;
                    default:
                        value = "e" + owner;
                        break;
                }
                break;
        }

        index.pushField( "sort.recordOwner", value );

        Log.trace( "Leaving: createSortRecordOwner method" );

        return index;

    };

    /**
     * Method that creates sort.articleDate index fields from input data.
     * Only relevant for articles with YYYY-MM-DD
     *
     * @type {method}
     * @syntax SortIndex.createSortArticleDate( commonDataXml, index )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} The updated index object
     * @name SortIndex.createSortArticleDate
     * @method
     */
    that.createSortArticleDate = function( index, commonDataXml, record ) {

        Log.trace( "Entering: createSortArticleDate method" );

        var i = 0;

        if ( record !== undefined ) {
            record.eachField( "557", function( field ) {
                field.eachSubField( "v", function( field, subfield ) {
                    if ( i === 0 && subfield.value.match( /\d{4}-\d{2}-\d{2}/ ) && i === 0 ) {
                        index.pushField( "sort.articleDate", subfield.value.replace( /-/g, "" ) );
                        i++;
                    }
                } );
            } );
        }

        Log.trace( "Leaving: createSortArticleDate method" );

        return index;

    };


    /**
     * Method that creates sort.dk5 index fields from dkabm.
     *
     * @type {method}
     * @syntax SortIndex.createSortDk5( commonDataXml, index )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createSortDk5
     * @method
     */
    that.createSortDk5 = function( index, commonDataXml ) {

        Log.trace( "Entering: SortIndex.createSortDk5 method" );

        XPath.forEachNodeText( "/*/dkabm:record/dc:subject[ @xsi:type = 'dkdcplus:DK5' ] [ 1 ]", commonDataXml, function( text ) {
            Log.debug( "HOV:", text );
            index.pushField( "sort.dk5", text );
        } );
        Log.trace( "Leaving: SortIndex.createSortDk5 method" );

        return index;

    };


    /**
     * Method that checks this is a specially published version of the material
     * Used in SortIndex.createSortComplexKey()
     *
     * @type {method}
     * @syntax SortIndex.checkSpecialVersions( commonDataXml )
     * @param {Document} commonDataXml Xml object containing input data
     * @param {Object} record an object with data from MARC
     * @return {Object} a string object containing the result
     * @name SortIndex.checkSpecialVersions
     * @method
     */

    that.checkSpecialVersions = function( commonDataXml, record ) {

        Log.trace( "Entering: SortIndex.checkSpecialVersions method" );

        var specialVersion = "a";
        var type = "";

        XPath.forEachNodeText( "/*/dkabm:record/dc:type[ 1 ]", commonDataXml, function( text ) {
            type = text.replace( /\(|\)/g, "" ) + "  ";
        } );

        if ( record !== undefined ) {
            if ( type.match( /^Lydbog/ ) ) {
                var checkIfNota = record.getFirstValue( '100', 'b' ) + record.getFirstValue( '260', 'b' );
                if ( checkIfNota.match( /874310|Statens Bibliotek og Trykkeri for Blinde|Danmarks Blindebibliotek|Nota/i ) ) {
                    specialVersion = "b";
                }
            }
            var checkVersion = record.getFirstValue( '250', 'a' ) + record.getFirstValue( '260', 'b' ) + record.getFirstValue( '440', 'a' );
            if ( checkVersion.match( /bogklub|s.rudgave|speci.ludgave/i ) ) {
                specialVersion = "b";
            }
        }
        Log.trace( "Leaving: SortIndex.checkSpecialVersions method" );

        return specialVersion;

    };

    /**
     * Method that creates sort.genreCategory index fields.
     *
     *
     * @syntax SortIndex.createGenreCategory( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createGenreCategory
     * @method
     */
    that.createGenreCategory = function( index, commonDataXml ) {

        Log.trace( "Entering: SortIndex.createGenreCategory method" );

        XPath.forEachNodeText( "/*/adminData/genre", commonDataXml, function( text ) {
            index.pushField( "sort.genreCategory", text );
        } );

        Log.trace( "Leaving: SortIndex.createGenreCategory method" );

        return index;

    };


    /**
     * Method that creates sort.numberInSeries index fields
     *
     * @syntax SortIndex.createSortNumberInSeries( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createSortNumberInSeries
     * @method
     */
    that.createSortNumberInSeries = function( index, commonDataXml ) {
        Log.trace( "Entering: SortIndex.createSortNumberInSeries" );

        var __createTitleArrayFromDescription = function( description ) {
            var titleListString = description.replace( /Samh\u00f8rende(:|\.)?/, "" ).toLowerCase().trim();
            var titleArray = titleListString.split( " ; " );
            return titleArray;
        };

        var __getNumberInSeriesFromTitleList = function( title, titlelist ) {
            var titlePosition = titlelist.indexOf( title.toLowerCase() );
            return titlePosition + 1;
        };

        var numberInSeries;
        var seriesTitleValue = XPath.selectText( "/*/dkabm:record/dc:title[@xsi:type='dkdcplus:series']", commonDataXml );
        var seriesDescriptionValue = XPath.selectText( "/*/dkabm:record/dc:description[@xsi:type='dkdcplus:series']", commonDataXml );

        if ( seriesTitleValue === '' && seriesDescriptionValue === '' ) {
            Log.trace( "Leaving: SortIndex.createSortNumberInSeries" );
            return index;
        }
        var seriesNumberMatch = seriesTitleValue.match( /;.* #?(\d+)((\.? )|$)/ );
        if ( seriesNumberMatch ) {
            numberInSeries = seriesNumberMatch[ 1 ];
            index.pushField( "sort.numberInSeries", numberInSeries );
            Log.trace( "Leaving: SortIndex.createSortNumberInSeries" );
            return index;
        }

        seriesNumberMatch = seriesDescriptionValue.match( /(\d+)\. del af/i );
        if ( seriesNumberMatch ) {
            numberInSeries = seriesNumberMatch[ 1 ];
            index.pushField( "sort.numberInSeries", numberInSeries );
            Log.trace( "Leaving: SortIndex.createSortNumberInSeries" );
            return index;
        }

        if ( seriesDescriptionValue.match( /^Samh\u00f8rende/ ) ) {
            var titleArray = __createTitleArrayFromDescription( seriesDescriptionValue );
            var title = XPath.selectText( "/*/dkabm:record/dc:title", commonDataXml );
            numberInSeries = __getNumberInSeriesFromTitleList( title, titleArray );
            //numberInSeries is 0 when title was not found in title list
            if ( numberInSeries > 0 ) {
                index.pushField( "sort.numberInSeries", numberInSeries );
            } else {
                var alternativeTitleNodes = XPath.select( "/*/dkabm:record/dcterms:alternative", commonDataXml );
                for ( var i = 0; i < alternativeTitleNodes.length; i++ ) {
                    title = XmlUtil.getText( alternativeTitleNodes[ i ] ).toLowerCase();
                    numberInSeries = __getNumberInSeriesFromTitleList( title, titleArray );
                    if ( numberInSeries > 0 ) {
                        index.pushField( "sort.numberInSeries", numberInSeries );
                        break;
                    }
                }
            }
        }


        Log.trace( "Leaving: SortIndex.createSortNumberInSeries" );
        return index;
    };


    /**
     * Method that creates sort.dateFirstEdition index field
     *
     * @syntax SortIndex.createSortDateFirstEdition( index, commonDataXml )
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Document} commonDataXml Xml object containing input data
     * @return {Object} The updated index object
     * @name SortIndex.createSortDateFirstEdition
     * @method
     */
    that.createSortDateFirstEdition = function( index, commonDataXml ) {

        Log.trace( "Entering: SortIndex.createSortDateFirstEdition" );

        var firstEditionYear;
        var version = XPath.selectText( "/*/dkabm:record/dkdcplus:version", commonDataXml );

        if ( version.match( /1\. ((udgave)|(edition))/ ) ) {
            firstEditionYear = XPath.selectText( "/*/dkabm:record/dc:date", commonDataXml );
            firstEditionYear = SortIndex.__fourDigitDate( firstEditionYear );
            if ( firstEditionYear !== "0000" && ! firstEditionYear.match( /^2[1-9]/ ) ) {
                index.pushField( "sort.dateFirstEdition", firstEditionYear );
                Log.trace( "Leaving: SortIndex.createSortDateFirstEdition" );
                return index;
            }
        } else {
            var f520aValues = XPath.selectMultipleText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '520' ]/marcx:subfield[ @code = 'a' ]", commonDataXml );
            for ( var i = 0; i < f520aValues.length; i++ ) {
                var text = f520aValues[ i ];
                var firstEditionMatch = text.match( /Originaludgave.*([1-2][0-9]{3})/ );
                if ( firstEditionMatch ) {
                    firstEditionYear = firstEditionMatch[ 1 ];
                    if ( ! firstEditionYear.match( /^2[1-9]/ ) ) {
                        index.pushField( "sort.dateFirstEdition", firstEditionYear );
                        Log.trace( "Leaving: SortIndex.createSortDateFirstEdition" );
                        return index;
                    }
                }
                firstEditionMatch = text.match( /1\. ((udgave)|(edition)).*([1-2][0-9]{3})/ );
                if ( firstEditionMatch ) {
                    var firstEditionYearCandidates = text.match( /([1-2][0-9]{3})/g );
                    firstEditionYear = firstEditionYearCandidates[ firstEditionYearCandidates.length -1 ];
                    if ( ! firstEditionYear.match( /^2[1-9]/ ) ) {
                        index.pushField( "sort.dateFirstEdition", firstEditionYear );
                        Log.trace( "Leaving: SortIndex.createSortDateFirstEdition" );
                        return index;
                    }
                }
            }
        }

        Log.trace( "Leaving: SortIndex.createSortDateFirstEdition" );

        return index;
    };


    return that;

}();

