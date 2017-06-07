/** @file Module that produces administrative data indexes. */

// NOTE: This file has already been migrated and rolled back. Rollback again to when migrating again
use( "IndexCreator" );
use( "XmlUtil" );
use( "Log" );
use( "DateUtil" );

EXPORTED_SYMBOLS = [ 'AdminIndex' ];

/**
 * **solr** Module with functions that create administrative indexes.
 *
 * Contains functions to create administrative index fields
 *
 * @type {namespace}
 * @namespace
 * @name AdminIndex
 */
var AdminIndex = function( ) {

    /**
     * Method that creates administrative index fields.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createAdminFields( index, indexingData, systemRelationsXml, pid, libraryRuleHandler, solrId )
     * @param {Object} index the index to add admin index fields to
     * @param {Document} indexingData The XML from which to create the index fields
     * @param {Document} systemRelationsXml The systems relations from which to retrieve unit information.
     * Relations stream for bibliographical object if it is primary for its unit. Else Relations stream from the unit 
     * @param {String} pid the pid of the object being indexed
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @param {String} solrId the identifier of the solr document
     * @return {Object} Index with added fields
     * @name AdminIndex.createAdminFields
     * @method
     */
    function createAdminFields( index, indexingData, systemRelationsXml, pid, libraryRuleHandler, solrId ) {

        Log.trace( "Entering: AdminIndex.createAdminFields method" );

        var submitter = pid.replace( /\-.*/, "" );
        var format = pid.replace( /.*\-(.*)\:.*/, "$1" );

        index.pushField( "submitter", String( submitter ) );
        index.pushField( "original_format", String( format ) );
        index.pushField( "rec.repositoryId", String( pid ) );

        AdminIndex.createRecId( indexingData, pid, index, solrId, libraryRuleHandler );
        AdminIndex.createRecBibliographicRecordId( pid, index );
        AdminIndex.createRecCreatedDate( indexingData, index );
        AdminIndex.createRecModifiedDate( indexingData, index );
        AdminIndex.createWorkId( systemRelationsXml, index );
        AdminIndex.createUnitId( systemRelationsXml, index );
        AdminIndex.createUnitPrimaryObject( systemRelationsXml, index );
        AdminIndex.createUnitIsPrimaryObject( systemRelationsXml, index );
        AdminIndex.createChildDocId( indexingData, index, libraryRuleHandler );
        AdminIndex.createRecExcludeFrom( indexingData, index );

        Log.trace( "Leaving: AdminIndex.createAdminFields method" );

        return index;

    }

    /**
     * Method that creates rec.workId index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createWorkId( systemRelationsXml, index )
     * @param {Document} systemRelationsXml Xml object containing system relations for object or unit (if object is not primary member of the unit
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @name AdminIndex.createWorkId
     * @method
     */
    function createWorkId( systemRelationsXml, index ) {

        Log.trace( "Entering: AdminIndex.createWorkId method" );

        var unit = "";

        // If systemRelationsXml is a bibliographical objects stream, unit id is in "isMemberOfUnit" relation
        unit = XPath.selectText("/*/rdf:Description/fedora:isMemberOfUnit", systemRelationsXml);

        // If systemRelationsXml is a unit objects stream, unit id is in "Description@about" attribute
        if ( "" === unit ) {
            var about = XPath.selectAttribute( "/*/rdf:Description/@rdf:about", systemRelationsXml );
            unit = String( about ).replace( /info:fedora\//, "" );
        }

        if ( "" !== unit ) {
            if ( Repository.hasObject( unit ) ) {
                var workRelations = Repository.getSysRelationsOfType( unit, "info:fedora/isMemberOfWork" );
                if ( workRelations.length > 0 ) {
                    var work = workRelations[0].object;
                    index.pushField( "rec.workId", work );
                }
            }
        }
        Log.trace( "Leaving: AdminIndex.createWorkId method" );

        return index;
    }

    /**
     * Method that creates rec.unitId index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createUnitId( systemRelationsXml, index )
     * @param {Document} systemRelationsXml The systems relations from which to retrieve unit information.
     * Relations stream for bibliographical object if it is primary for its unit. Else Relations stream from the unit
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @example AdminIndex.createUnitId( systemRelationsXml, index )
     * @name AdminIndex.createUnitId
     * @method
     */
    function createUnitId( systemRelationsXml, index ) {

        Log.trace( "Entering: AdminIndex.createUnitId method" );

        var fieldFound = false;

        var elements = XPath.select( "/*/rdf:Description/fedora:isMemberOfUnit", systemRelationsXml );
        for ( var i = 0 ; i < elements.length; i++){
            var child = elements[i];
            index.pushField( "rec.unitId", XmlUtil.getText( child ) );
            fieldFound = true;
        }
        if ( !fieldFound ) {
            var about = XPath.selectAttribute("/*/rdf:Description/@rdf:about", systemRelationsXml);
            index.pushField( "rec.unitId", String( about ).replace( /info:fedora\//, "" ));
        }

        Log.trace( "Leaving: AdminIndex.createUnitId method" );

        return index;

    }

    /**
     * Method that creates unit.primaryObject index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createUnitPrimaryObject( systemRelationsXml, index )
     * @param {Document} systemRelationsXml The systems relations from which to retrieve unit information.
     * Relations stream for bibliographical object if it is primary for its unit. Else Relations stream from the unit
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @example AdminIndex.createUnitPrimaryObject( systemRelationsXml, index )
     * @name AdminIndex.createUnitPrimaryObject
     * @method
     */
    function createUnitPrimaryObject( systemRelationsXml, index ) {

        Log.trace( "Entering: AdminIndex.createUnitPrimaryObject method" );

        var about = XPath.selectAttribute("/*/rdf:Description/@rdf:about", systemRelationsXml);
        if ( String( about ).match( /unit:/ ) ) {
            var primary = XPath.selectText("/*/rdf:Description/fedora:hasPrimaryBibObject", systemRelationsXml);
            index.pushField( "unit.primaryObject", primary );
        } else {
            index.pushField( "unit.primaryObject", String( about ).replace( /info:fedora\//, "" ) );
        }

        Log.trace( "Leaving: AdminIndex.createUnitPrimaryObject method" );

        return index;

    }

    /**
     * Method that creates unit.isPrimaryObject index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createUnitIsPrimaryObject( systemRelationsXml, index )
     * @param {Document} systemRelationsXml The systems relations from which to retrieve unit information.
     * Relations stream for bibliographical object if it is primary for its unit. Else Relations stream from the unit
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @example AdminIndex.createUnitIsPrimaryObject( systemRelationsXml, index )
     * @name AdminIndex.createUnitIsPrimaryObject
     * @method
     */
    function createUnitIsPrimaryObject( systemRelationsXml, index ) {

        Log.trace( "Entering: AdminIndex.createUnitIsPrimaryObject method" );

        if ( XPath.select("boolean(/*/rdf:Description/fedora:isPrimaryBibObjectFor)", systemRelationsXml) ) {
            index.pushField( "unit.isPrimaryObject", "true");
        } else {
            index.pushField( "unit.isPrimaryObject", "false");
        }

        Log.trace( "Leaving: AdminIndex.createUnitIsPrimaryObject method" );

        return index;

    }

    /**
     * Method that creates rec.collectionIdentifier index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecCollectionIdentifier( inputXml, index )
     * @param {Document} inputXml Xml object containing input data
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @example AdminIndex.createRecCollectionIdentifier( inputXml, index )
     * @name AdminIndex.createRecCollectionIdentifier
     * @method
     */
    function createRecCollectionIdentifier( inputXml, index ) {

        Log.trace( "Entering: AdminIndex.createRecCollectionIdentifier method" );

        XPath.forEachNodeText("/*/adminData/collectionIdentifier", inputXml, function(identifier) {
            index.pushField( "rec.collectionIdentifier", identifier );
        } );

        Log.trace( "Leaving: AdminIndex.createRecCollectionIdentifier method" );

        return index;

    }

    /**
     * Method that creates rec.id index fields from input data.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecId( inputXml, pid, index, solrId, libraryRuleHandler )
     * @param {Document} inputXml Xml object containing input data
     * @param {String} pid Identifier of the object being indexed
     * @param {Object} index The index (object) to add the new index fields to
     * @param {String} solrId the identifier of the solr document
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @return {Object} The updated index object
     * @example AdminIndex.createRecId( inputXml, index )
     * @name AdminIndex.createRecId
     * @method
     */
    function createRecId( inputXml, pid, index, solrId, libraryRuleHandler ) {

        Log.trace( "Entering: AdminIndex.createRecId method" );

        XPath.forEachNodeText( "/*/dkabm:record/ac:identifier", inputXml, function(identifier) {
            index.pushField( "rec.id", identifier);
        } );

        index.pushField( "rec.id", pid );

        // Previously solr document id was copied with schema copyField.
        // Since document id has been changed for solr cloud,
        // this is changed to explicit insertion of value
        index.pushField( "rec.id", solrId );

        //US1875: with opensearch version 4.2 identifier can have a local namespace instead
        // of "870970-basis" if library has a localdata stream in fedora/corepo
        // and that will not be useful when searching in rec.id index. So we add the identifier
        // with local namespace to the index if the library uses local datastreams
        var localNamespace = solrId.slice( pid.length + 1 );
        var agencyId = localNamespace.replace( /(\d{6}).*/, "$1" );
        if ( IndexCreator.useLocaldataStream( libraryRuleHandler, agencyId ) ) {
            var recordIdentifier = pid.replace( /\d{6}-.*:/, "" );
            var localIdentifier = localNamespace + ":" + recordIdentifier;
            Log.debug( "local identifier: ", localIdentifier );
            if ( localIdentifier !== pid ) {
                index.pushField( "rec.id", localIdentifier );
            }
        }

        Log.trace( "Leaving: AdminIndex.createRecId method" );

        return index;

    }

    /**
     * Method that creates rec.bibliographicRecordId index fields from input data.
     * Necessary in join operations between this index and holdingsitem index.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecBibliographicRecordId( pid, index )
     * @param {String} pid Identifier of the object being indexed
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @name AdminIndex.createRecBibliographicRecordId
     * @method
     */
    function createRecBibliographicRecordId( pid, index ) {

        Log.trace( "Entering: AdminIndex.createRecBibliographicRecordId method" );

        var bibliographicRecordId = pid.replace( /^.*:/, "" ).replace( /__[0-9]+/, "" );
        index.pushField( "rec.bibliographicRecordId", bibliographicRecordId );

        Log.trace( "Leaving: AdminIndex.createRecBibliographicRecordId method" );

        return index;

    }


    //internal function for creating dates from a string of numbers
    function __makeDate( number ) {

        Log.trace( "Entering AdminIndex.__makeDate" );

        date = number;
        if ( date.length > 8 ) {
            date = date.slice( 0, 8 );
        }

        var correctedDate = DateUtil.correctDate( date );

        if ( "" === correctedDate ) {
            if ( 4 === date.length && /\d{4}/.test( date ) ) {
                correctedDate = date + "0101";
            } else {
                Log.warn( "Cannot create a date from input number: " + number );
                Log.trace( "Leaving AdminIndex.__makeDate" );
                return "";
            }
        }
        var date = String( correctedDate ).replace( /(\d{4})(\d{2})(\d{2}).*/, "$1-$2-$3" ) + "T00:00:00Z";

        Log.trace( "Leaving AdminIndex.__makeDate" );

        return date;
    }

    /**
     * Method that creates rec.createdDate index fields from marc field 001*d.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecCreatedDate( inputXml, index )
     * @param {Document} inputXml Xml object containing input data
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @name AdminIndex.createRecCreatedDate
     * @method
     */
    function createRecCreatedDate( inputXml, index ) {

        Log.trace( "Entering: AdminIndex.createRecCreatedDate method" );

        // Select first date field. Ignore others
        var text = XPath.selectText("/*/marcx:collection/marcx:record[@type='Bibliographic']/marcx:datafield[@tag='001']/marcx:subfield[@code='d'][1]", inputXml);
        if ( "" !== text ) {
            var date = AdminIndex.__makeDate(text);
            if ( "" !== date ) {
                index.pushField( "rec.createdDate", date );
            } else {
                Log.warn( "Cannot create index field rec.createdDate from "+ text );
            }
        }

        Log.trace( "Leaving: AdminIndex.createRecCreatedDate method" );

        return index;

    }

    /**
     * Method that creates rec.modifiedDate index fields from marc field 001*c or 001*d.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecModifiedDate( inputXml, index )
     * @param {Document} inputXml Xml object containing input data
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @name AdminIndex.createRecModifiedDate
     * @method
     */
    function createRecModifiedDate( inputXml, index ) {

        Log.trace( "Entering: AdminIndex.createRecModifiedDate method" );

        var field100c = false;
        var date;

        var text = XPath.selectText( "/*/marcx:collection/marcx:record[@type='Bibliographic']/marcx:datafield[@tag='001']/marcx:subfield[@code='c'][ 1 ]", inputXml );
        if ( "" !== text ) {
            field100c = true;
            date = AdminIndex.__makeDate( text );
            if ( "" !== date ) {
                index.pushField( "rec.modifiedDate", date );
            } else {
                Log.warn( "Cannot create index field rec.modifiedDate from " + text );
            }
        }

        if ( false === field100c ) {
            text = XPath.selectText( "/*/marcx:collection/marcx:record[@type='Bibliographic']/marcx:datafield[@tag='001']/marcx:subfield[@code='d'][ 1 ]", inputXml );
            if ( "" !== text ) {
                date = AdminIndex.__makeDate( text );
                if ( "" !== date ) {
                    index.pushField( "rec.modifiedDate", date );
                } else {
                    Log.warn( "Cannot create index field rec.modifiedDate from " + text );

                }
            }
        }
        Log.trace( "Leaving: AdminIndex.createRecModifiedDate method" );

        return index;

    }


    /**
     * Method that creates childDocId
     *
     *
     * @type {method}
     * @syntax AdminIndex.createChildDocId( index, indexingData, libraryRuleHandler)
     * @param {Document} inputXml Xml object containing input data
     * @param {Object} index The index (object) to add the new index fields to
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @return {Object} The updated index object
     * @name AdminIndex.createChildDocId
     * @method
     */
    function createChildDocId( inputXml, index, libraryRuleHandler ) {

        Log.trace( "Entering: AdminIndex.createChildDocId method" );

        var acId = XPath.selectText( "/*/dkabm:record/ac:identifier", inputXml );
        var id = acId.replace( /\|.*/, "" );
        var agencyId = acId.replace( /.*\|/, "" );
        var idFrom002a = XPath.selectText( "/*/marcx:collection/marcx:record[@type='Bibliographic']/marcx:datafield[@tag='002']/marcx:subfield[@code='a']", inputXml );
        Log.debug( "idFrom002a : ", idFrom002a );

        if ( true === AdminIndex.useHoldingsItem( libraryRuleHandler, agencyId ) ) {
            XPath.forEachNodeText( "/*/adminData/collectionIdentifier", inputXml, function( collectionId ) {
                index.pushField( "rec.childDocId", collectionId + ":" + id );
            } );
        } else {
            XPath.forEachNodeText( "/*/adminData/collectionIdentifier", inputXml, function( collectionId ) {
                if ( "870970-basis" === collectionId ) {
                    index.pushField( "rec.childDocId", collectionId + ":" + id );
                    if ( "" !== idFrom002a ) {
                        index.pushField( "rec.childDocId", collectionId + ":" + idFrom002a );
                    }
                } else {
                    index.pushField( "rec.childDocId", collectionId );
                }
            } );
        }

        Log.trace( "Leaving: AdminIndex.createChildDocId method" );

        return index;

    }


    /**
     * Method that creates rec.excludeFromUnionCatalogue index fields based on marc field 004*n.
     *
     *
     * @type {method}
     * @syntax AdminIndex.createRecExcludeFromUnionCatalogue( inputXml, index )
     * @param {Document} inputXml Xml object containing input data
     * @param {Object} index The index (object) to add the new index fields to
     * @return {Object} The updated index object
     * @name AdminIndex.createRecExcludeFromUnionCatalogue
     * @method
     */
    function createRecExcludeFrom( inputXml, index ) {

        Log.trace( "Entering: AdminIndex.createRecExcludeFrom method" );

        var valueOf004n = XPath.selectText( "/*/marcx:collection/marcx:record[@type='Bibliographic']/marcx:datafield[@tag='004']/marcx:subfield[@code='n'][1]", inputXml);

        if ( "f" === valueOf004n ) {
            // according to kat-format the code f means that w is also set: http://www.kat-format.dk/danMARC2/Danmarc2.7.htm#pgfId=1355931
            index.pushField( "rec.excludeFromUnionCatalogue", "true" );
            index.pushField( "rec.excludeFromWorldCat", "true" );
        } else if ( "w" === valueOf004n ) {
            index.pushField( "rec.excludeFromUnionCatalogue", "false" );
            index.pushField( "rec.excludeFromWorldCat", "true" );
        } else {
            index.pushField( "rec.excludeFromUnionCatalogue", "false" );
            index.pushField( "rec.excludeFromWorldCat", "false" );
        }

        Log.trace( "Leaving: AdminIndex.createRecExcludeFrom method" );

        return index;

    }


    /**
     * Get use_holdings_item switch for agency in VIP
     *
     * @method
     * @type {method}
     * @syntax AdminIndex.useHoldingsItem( libraryRuleHandler, agencyId )
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @param {String} agencyId Agency to look up
     * @return {boolean} true if use_holdings_item switch is set for agency
     * @name AdminIndex.useHoldingsItem
     */
    function useHoldingsItem( libraryRuleHandler, agencyId ) {
        var useHoldingsItem = libraryRuleHandler.isAllowed(
                agencyId,
                Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.USE_HOLDINGS_ITEM );

        Log.debug( "AdminIndex.useHoldingsItem for agency ", agencyId,  " is ", useHoldingsItem );
	
        return useHoldingsItem;
    }

    return {
        createAdminFields: createAdminFields,
        createWorkId: createWorkId,
        createUnitId: createUnitId,
        createUnitPrimaryObject: createUnitPrimaryObject,
        createUnitIsPrimaryObject: createUnitIsPrimaryObject,
        createRecCollectionIdentifier: createRecCollectionIdentifier,
        createRecId: createRecId,
        createRecBibliographicRecordId: createRecBibliographicRecordId,
        __makeDate: __makeDate,
        createRecCreatedDate: createRecCreatedDate,
        createRecModifiedDate: createRecModifiedDate,
        createChildDocId: createChildDocId,
        createRecExcludeFrom: createRecExcludeFrom,
        useHoldingsItem: useHoldingsItem
    };

}( );
