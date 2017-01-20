use( "IndexCreator" );


function isIndexablePid( pid ) {
    if ( pid.match( /unit:|work:|auto:|fedora-system:/ ) ) {
        return false;
    } else {
        return true;
    }
}

// This is the main entry function called from java code
// Parameters:
// pid: the pid of the object to be indexed
// foxmlStr: String containing the full XML of the object to be indexed
// libraryRuleHandler: Javaobject. Instance of dk.dbc.openagency.client.LibraryRuleHandler to access OpenAgency
// Returns
// List containing pairs of "name" & "value". Multiple entries with the same name are allowed and will be
// treated as multi value fields.
// null may be returned to indicate that the object should not be indexed

function createIndexData( pid, foxmlStr, libraryRuleHandler, solrCallback ) {

    var index = IndexCreator.prepareData( pid, foxmlStr, libraryRuleHandler, solrCallback );

    return index;

}

// Dummy method that does no indexing. Used for harvest only testing
function noIndex( pid, foxmlStr, libraryRuleHandler, solrCallback ) {
    Log.warn("Using dummy javascript method. No indexing performed");
}

// Dummy method that does indexing but writes nothing to SOLR.
function noIndexWrite( pid, foxmlStr, libraryRuleHandler, solrCallback ) {
    Log.warn("Using dummy javascript method. No index writing performed");
    var dummySolrCallback = {
      addDocument: function(index) {
          Log.debug("Adding dummy document for ", pid, "with data ", index);
      },
      deleteDocument: function(docId) {
          Log.debug("Deleting dummy document for ", docId);
      }
    };
    IndexCreator.prepareData( pid, foxmlStr, libraryRuleHandler, dummySolrCallback );
}
