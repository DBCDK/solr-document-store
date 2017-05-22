use( "Index" );
use( "Marc" );
use( "Alias" );
use( "AdminIndex" );
use( "DkcclTermIndex" );
use( "DkcclPhraseIndex" );
use( "TermIndex" );
use( "PhraseIndex" );
use( "FacetIndex" );
use( "SortIndex" );
use( "DisplayIndex" );
use( "RankIndex" );
use( "IndexNormalizer" );
use( "Repository" );
use( "ScanIndex" );
use( "Log" );
use( "MarcUtility" );
use( "XmlUtil" );
use( "XPath" );

EXPORTED_SYMBOLS = [ 'IndexCreator' ];

/**
 * Module with functions that creates an index based on the input data.
 *
 * This module contains functions to create an index.
 *
 * @type {namespace}
 * @namespace
 * @name IndexCreator
 */
var IndexCreator = function( ) {

    /**
     * Method that prepares data for indexing.
     *
     *
     * @type {function}
     * @syntax IndexCreator.prepareData( index, foxmlStr, libraryRuleHandler, solrCallback )
     * @param {String} pid The pid of the object being indexed
     * @param {String} foxmlStr The entire data representing the object being indexed
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @param {Object} solrCallback Call back object with methods addDocument("array of fields" and deleteDocument(String solrId)
     * @return {Object} The new index object
     * @name IndexCreator.prepareData
     * @function
     */
    function prepareData( pid, foxmlStr, libraryRuleHandler, solrCallback ) {

        var foXml = XmlUtil.fromString( foxmlStr );

        // use of XmlUtil.createDocumentFromElement is required,
        // because all other modules expect to be able to
        // use root based XPath expressions
        var commonDataNode = XPath.selectNode( "/*/foxml:datastream[ @ID = 'commonData' ]/foxml:datastreamVersion/foxml:xmlContent/ting:container[ 1 ]", foXml );

        // / if document had no commonData stream, leave commonData undefined
        var commonDataXml = ( commonDataNode === undefined ) ? undefined : XmlUtil.createDocumentFromElement( commonDataNode );

        var systemRelationsXml = XmlUtil.createDocumentFromElement( XPath.selectNode( "/*/foxml:datastream[ @ID = 'RELS-SYS' ]/foxml:datastreamVersion/foxml:xmlContent/rdf:RDF[ 1 ]", foXml ) );
        var dcDataXml = XmlUtil.createDocumentFromElement( XPath.selectNode( "/*/foxml:datastream[ @ID = 'DC' ]/foxml:datastreamVersion/foxml:xmlContent/oai_dc:dc[ 1 ]", foXml ) );

        // Create temporary documents that point to the subnodes in main document.
        // This allows root (/) based XPath expressions, without cloning nodes with createDocumentFromElement.
        // This is a bit of a hack.
        // It might be better to make all XPath expressions relative and correct
        // all unit tests to pass doc.documentElement in stead of doc to tested methods
//        var commonDataXml = XmlUtil.createDocument();
//        commonDataXml.appendChild( XPath.selectNode( "/*/foxml:datastream[ @ID = 'commonData' ]/foxml:datastreamVersion/foxml:xmlContent/ting:container[ 1 ]", foXml ) );
//        var systemRelationsXml = XmlUtil.createDocument();
//        systemRelationsXml.appendChild( XPath.selectNode( "/*/foxml:datastream[ @ID = 'RELS-SYS' ]/foxml:datastreamVersion/foxml:xmlContent/rdf:RDF[ 1 ]", foXml ) );
//        var dcDataXml = XmlUtil.createDocument( );
//        dcDataXml.appendChild( XPath.selectNode( "/*/foxml:datastream[ @ID = 'DC' ]/foxml:datastreamVersion/foxml:xmlContent/oai_dc:dc[ 1 ]", foXml ) );

        var state = XPath.selectAttribute( "/*/foxml:objectProperties/foxml:property[ @NAME = 'info:fedora/fedora-system:def/model#state' ][ 1 ]/@VALUE", foXml );

        var solrId = "";
        var hasLocalDataStream = false;

        var elements = XPath.select( "/*/foxml:datastream", foXml );

        for ( var i = 0 ; i < elements.length; i++ ) {
            var child = elements[ i ];
            var streamId = XmlUtil.getAttribute( child, "ID" );
            var localDataState = XmlUtil.getAttribute( child, "STATE" );
            var streamDate;
            solrId = "";

            Log.debug( "streamName = ", streamId );

            var matches = streamId.match( /localData\.([0-9]{6})-/ );
            if ( matches ) {
                hasLocalDataStream = true;
                // Extract submitter from stream name (group 1)
                var streamSubmitter = matches[ 1 ];

                var streamSubmitterUseLocaldataStream = IndexCreator.useLocaldataStream( libraryRuleHandler, streamSubmitter );
                var indexingData;
                if ( streamSubmitterUseLocaldataStream ) {
                    var localData = XPath.selectNode( "foxml:datastreamVersion/foxml:xmlContent/ting:localData[ 1 ]", child );
                    // localData node is not present for local datastreams that have been marked deleted
                    // and updated with <empty> content:
                    indexingData = ( undefined === localData ) ? undefined : XmlUtil.createDocumentFromElement( localData );
                    solrId = IndexCreator.getSolrId( pid, streamId.replace( /localData./, "" ) );
                    streamDate = XPath.selectAttribute( "foxml:datastreamVersion/@CREATED", child );
                } else {
                    indexingData = commonDataXml;
                    solrId = IndexCreator.getSolrId( pid, streamId.replace( /localData./, "" ) );
                    streamDate = XPath.selectAttribute( "/*/foxml:datastream[ @ID='commonData' ]/foxml:datastreamVersion/@CREATED", foXml );
                }
            } else {
                // Skip DC, commonData and relations streams
                Log.trace( "Not indexing ", streamId );
            }

            Log.debug( "Stream solrid ", solrId );

            if ( "" !== solrId ) {
                IndexCreator.createIndexDocuments( pid, indexingData, systemRelationsXml, dcDataXml, solrCallback, state, localDataState, solrId, streamDate, libraryRuleHandler );
            }
        }

        if ( false === hasLocalDataStream ) {
            indexingData = commonDataXml;
            solrId = IndexCreator.getSolrId( pid, pid.replace( /(.*):.*/, "$1") );
            streamDate = XPath.selectAttribute( "/*/foxml:datastream[ @ID='commonData' ]/foxml:datastreamVersion/@CREATED", foXml );
            IndexCreator.createIndexDocuments( pid, indexingData, systemRelationsXml, dcDataXml, solrCallback, state, localDataState, solrId, streamDate, libraryRuleHandler );		
        }
    }


    /**
     * Create solr id from pid and streamId.
     *
     * @function
     * @type {function}
     * @syntax IndexCreator.getSolrId( pid, streamId )
     * @param {String} pid
     * @param {String} streamId
     * @return {String}
     * @name IndexCreator.getSolrId
     */
    function getSolrId( pid, streamId ) {

        Log.trace( "Entering IndexCreator.getSolrId" );

        // var bibliographicRecordId = pid.replace( /^.*:/, "" ).replace( /__[0-9]+/, "" );
        //var shardKey = bibliographicRecordId.replace( /[^0-9a-zA-Z]/g, "" );
        //var solrId = shardKey + "/32!" + pid + "-" + streamId;
        var solrId = pid + "-" + streamId;

        Log.debug( "IndexCreator.getSolrId created solr-id: ", solrId );
        Log.trace( "Leaving IndexCreator.getSolrId" );

        return solrId;
    }

    /**
     * Method that creates SOLR index documents.
     *
     *
     * @type {function}
     * @syntax IndexCreator.createIndexDocuments( pid, indexingData, systemRelationsXml, dcDataXml, solrCallback, state, localDataState, solrId, streamDate, libraryRuleHandler )
     * @param {String} pid the Fedora identifier of the object being indexed
     * @param {Document} indexingData the specific XML to be indexed (commonData or localData)
     * @param {Document} systemRelationsXml system relations
     * @param {Document} dcDataXml dc datastream
     * @param {Object} solrCallback Call back object with methods addDocument("array of fields" and deleteDocument(String solrId)
     * @param {String} state the state of the entire object (active or deleted)
     * @param {String} localDataState the state of a localData-stream (active or deleted)
     * @param {String} solrId the identifier for the SOLR index document
     * @param {String} streamDate the fedora stream date
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @return the updated array of SOLR index documents
     * @name IndexCreator.createIndexDocuments
     * @function
     */
    function createIndexDocuments( pid, indexingData, systemRelationsXml, dcDataXml, solrCallback, state, localDataState, solrId, streamDate, libraryRuleHandler ) {

        Log.trace( "Entering IndexCreator.createIndexDocuments ", solrId );

        var bibliographicRecordId = pid.replace( /^.*:/, "" ).replace( /__[0-9]+/, "" );

        try {
            if ( "A" !== localDataState || "Active" !== state  ) {
                Log.debug( "Skip indexing and delete ", solrId );
                solrCallback.deleteDocument( solrId, streamDate, bibliographicRecordId );
            } else {
                var index = IndexCreator.createIndexData( pid, indexingData, systemRelationsXml, dcDataXml, libraryRuleHandler, solrId );
                index.pushField( "id", String( solrId ) );
                index.pushField( "rec.fedoraStreamDate", streamDate );

                AdminIndex.createRecCollectionIdentifier( indexingData, index );

                if ( solrId.match( /katalog$/ ) ) {
                    FacetIndex.createFieldsLocalData( index, indexingData );
                    TermIndex.createAcquisitionDate( index, indexingData );
                    SortIndex.createSortLocalAcquisitionDate( index, indexingData );
                }
                
                Log.debug( "Adding indexed solr document ", solrId );
                solrCallback.addDocument( index );
            }
        }
        finally {
            Log.trace( "Leaving IndexCreator.createIndexDocuments ", solrId );
        }
    }

    /**
     * Method that populates index with the appropriate index fields.
     *
     *
     * @type {function}
     * @syntax IndexCreator.createIndexData( pid, indexingData, systemRelationsXml, dcDataXml, libraryRuleHandler, solrId )
     * @param {String} pid The pid of the object being indexed
     * @param {Document} indexingData the specific XML to be indexed (commonData or localData)
     * @param {Document} systemRelationsXml system relations
     * @param {Document} dcDataXml dc datastream
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @param {String} solrId the identifier of the solr document
     * @return {Object} The updated index object
     * @name IndexCreator.createIndexData
     * @function
     */
    function createIndexData( pid, indexingData, systemRelationsXml, dcDataXml, libraryRuleHandler, solrId ) {

        Log.trace( "Entering IndexCreator.createIndexData" );

        var alias = Alias.getAlias( indexingData );

        var index = Index.newIndex( );

        if ( ! XPath.select( "boolean( /*/rdf:Description/fedora:isPrimaryBibObjectFor )", systemRelationsXml ) ) {
            var unit = XPath.selectText( "/*/rdf:Description/fedora:isMemberOfUnit", systemRelationsXml );
            if ( "" === unit ) {
                throw "Record '" + pid + "' is not member of a unit";
            }
            var systemRelations = String( Repository.getDatastreamContent( unit, "RELS-SYS" ) );
            systemRelationsXml = XmlUtil.fromString( systemRelations );
        }

        AdminIndex.createAdminFields( index, indexingData, systemRelationsXml, pid, libraryRuleHandler, solrId );

        switch ( alias ) {
            case "danmarcxchange":
                var marcObjects = IndexCreator.createMarcObjects( indexingData );
                var record = ( "single" === marcObjects.type ) ? marcObjects.single : MarcUtility.createRecordObjectFromIndexingData( indexingData );

                DkcclTermIndex.createDkcclTermFields( index, record );
                DkcclPhraseIndex.createDkcclPhraseFields( index, record );
                TermIndex.createFields( index, indexingData, dcDataXml, record );
                PhraseIndex.createFields( index, indexingData, dcDataXml, record );
                //Facets are only created if object is primary or comes from one of the 6 PH libraries
                if ( XPath.select( "boolean( /*/rdf:Description/fedora:isPrimaryBibObjectFor )", systemRelationsXml ) || pid.match(/^830060|^830[16]90|^8303[78]0|^831020/) ){
                    FacetIndex.createFields( index, indexingData, dcDataXml, record );
                }
                FacetIndex.createAcSource( index, indexingData ); //For us #1500 (create facet.acSource for all objects)
                SortIndex.createSortFields( index, indexingData, dcDataXml, pid, record );
                DisplayIndex.createFields( index, indexingData, record, marcObjects );
                RankIndex.createFields( index, indexingData );
                ScanIndex.createFields( index, indexingData, record );
                break;
            case "review":
                var field014a = XPath.selectText( "/*/marcx:collection/marcx:record/marcx:datafield[ @tag = '014' ]/marcx:subfield[ @code = 'a' ]", indexingData);
                var reviewedPid = "870970-basis:" + field014a;
                if ( reviewedPid !== "870970-basis:" ) {
                    if ( Repository.hasObject( reviewedPid ) ) {
                        var reviewedData = String( Repository.getDatastreamContent( reviewedPid, "commonData" ) );
                        var reviewedDataXml = XmlUtil.fromString( reviewedData );
                        TermIndex.createReviewFields( index, indexingData, reviewedDataXml );
                        PhraseIndex.createReviewFields( index, indexingData, reviewedDataXml );
                    } else {
                        var errorMsg = "Reviewed object " + reviewedPid + " not found for review " + pid;
                        Log.warn( errorMsg );  //changed to WARN by LSK 2016-01-21 as we don't want to do anything about this for now
                        //We don't want indexing to fail completely if the reviewed object is not found;
                        //we want to go with what we have so far (e.g. AdminFields)
                        //throw errorMsg;
                    }
                } else {
                    PhraseIndex.createReviewFieldsDkabm( index, indexingData );
                    TermIndex.createReviewFieldsDkabm( index, indexingData );
                }
                SortIndex.createSortFields( index, indexingData, dcDataXml, pid );
                break;
            case "dkabm":
                TermIndex.createFieldsDkabm( index, indexingData, dcDataXml );
                PhraseIndex.createFields( index, indexingData, dcDataXml );
                if ( XPath.select( "boolean( /*/rdf:Description/fedora:isPrimaryBibObjectFor )", systemRelationsXml ) ) {
                    FacetIndex.createFields( index, indexingData, dcDataXml );
                }
                FacetIndex.createAcSource( index, indexingData ); //For us #1500 (create facet.acSource for all objects)
                SortIndex.createSortFields( index, indexingData, dcDataXml, pid );
                DisplayIndex.createFields( index, indexingData );
                RankIndex.createFields( index, indexingData );
                ScanIndex.createFields( index, indexingData );
                break;
            default:
                break;
        }

        index = IndexNormalizer.normalizeValues( index );

        Log.trace( "Leaving IndexCreator.createIndexData" );

        return index;

    }

    /**
     * Method that created an object of MarcRecords to use for indexing.
     *
     * @function
     * @type {function}
     * @syntax IndexCreator.createMarcObjects( indexingData )
     * @param {Document} indexingData
     * @return {Object}
     * @name IndexCreator.createMarcObjects
     */
    function createMarcObjects( indexingData ) {

        Log.trace( "Entering: IndexCreator.createMarcObjects" );

        var marcObjects = {};
        marcObjects.type = "single"; // default type, can also be section or volume

        var isMultiVolume = ( 1 < XPath.select( "count( /*/marcx:collection/marcx:record )", indexingData ) ) ;

        if ( isMultiVolume ) {
            var elements = XPath.select( "/*/marcx:collection/marcx:record", indexingData );
            for ( var i = 0 ; i < elements.length; i++ ) {
                var child = elements[ i ];
                switch ( XmlUtil.getAttribute( child, "type" ) ) {
                    case "Bibliographic":
                        marcObjects.merged = MarcUtility.createRecordObject( child );
                        break;
                    case "BibliographicMain":
                        marcObjects.main = MarcUtility.createRecordObject( child );
                        break;
                    case "BibliographicSection":
                        marcObjects.section = MarcUtility.createRecordObject( child );
                        marcObjects.type = "section";
                        break;
                    case "BibliographicVolume":
                        marcObjects.volume = MarcUtility.createRecordObject( child );
                        if ( "section" !== marcObjects.type ) {
                            marcObjects.type = "volume";
                        }
                        break;
                    default:
                        break;
                }
            }
        } else {
            marcObjects.type = "single";
            marcObjects.single = MarcUtility.createRecordObjectFromIndexingData( indexingData );
            marcObjects.merged = marcObjects.single;
        }

        Log.trace( "Leaving: IndexCreator.createMarcObjects" );

        return marcObjects;

    }

    /**
     * Get use_localdata_stream switch for agency in VIP
     *
     * @function
     * @type {function}
     * @syntax IndexCreator.useLocaldataStream( libraryRuleHandler, agencyId )
     * @param {Object} libraryRuleHandler Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
     * @param {String} agencyId Agency to look up
     * @return {boolean} true if use_localdata_stream switch is set for agency
     * @name IndexCreator.useLocaldataStream
     */
    function useLocaldataStream( libraryRuleHandler, agencyId ) {

        Log.trace( "Entering: IndexCreator.useLocaldataStream" );

        var useLocaldataStream = libraryRuleHandler.isAllowed(
                agencyId,
                Packages.dk.dbc.openagency.client.LibraryRuleHandler.Rule.USE_LOCALDATA_STREAM );

        Log.debug( "IndexCreator.useLocaldataStream for agency ", agencyId,  " is ", useLocaldataStream );

        Log.trace( "Leaving: IndexCreator.useLocaldataStream" );

        return useLocaldataStream;
    }

    return {
        prepareData: prepareData,
        getSolrId: getSolrId,
        createIndexDocuments: createIndexDocuments,
        createIndexData: createIndexData,
        createMarcObjects: createMarcObjects,
        useLocaldataStream: useLocaldataStream
    };

}( );

