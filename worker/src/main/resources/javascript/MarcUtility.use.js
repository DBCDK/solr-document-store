use( "Log" );
use( "XPath" );
use( "MarcXchange" );

EXPORTED_SYMBOLS = [ 'MarcUtility' ];

/**
 * Helper methods for Marc records
 *
 * @type {namespace}
 * @namespace
 * @name MarcUtility
 */
var MarcUtility = function( ) {

    var that = {};
    
    /**
     * Method that creates a record object to use for indexing marc data.
     *
     *
     * @type {method}
     * @syntax MarcUtility.createRecordObject( xmlFragment )
     * @param {Xml} xmlFragment Xml object containing marcx:record
     * @return {Record} The new record object
     * @name MarcUtility.createRecordObject
     * @method
     */
    that.createRecordObject = function( xmlFragment ){

        Log.trace( "Entering: MarcUtility.createRecordObject method" );
        Log.debug( "CMData: ", XmlUtil.logXmlString( xmlFragment ) );

        //var recordObj = MarcXchange.marcXchangeToMarcRecord(xmlFragment);
        var recordObj = new Record ( );
        var children = XmlUtil.getChildElements( xmlFragment, "datafield", XmlNamespaces.marcx );
        for ( var i = 0 ; i < children.length ; i++ ) {
            var child = children[i];
            var tag = XmlUtil.getAttribute( child, "tag" );
            var ind1 = XmlUtil.getAttribute( child, "ind1" );
            var ind2 = XmlUtil.getAttribute( child, "ind2" );
            var field = new Field( tag, ind1 + ind2 );
            var subchildren = XmlUtil.getChildElements(child, "subfield", XmlNamespaces.marcx);
            for ( var j = 0 ; j < subchildren.length ; j++ ) {
                var subchild = subchildren[j];
                var code = XmlUtil.getAttribute( subchild, "code" );
                var text = XmlUtil.getText( subchild );
                var subfield = new Subfield( code, text );
                field.append( subfield );
            }
            recordObj.append( field );
        }
        Log.trace( "Leaving: MarcUtility.createRecordObject method" );

        return recordObj;
    };


    that.createRecordObjectFromIndexingData = function( indexingData ) {

        var master = new Record();
        // Get data from all records in collection
        var elements = XPath.select( "/*/marcx:collection/marcx:record", indexingData );
        for ( var index = 0 ; index < elements.length; index++){
            var marcRecord = elements[index];
            Log.debug("MarcUtility.createRecordObjectFromIndexingData, Adding data from marc record, ", XmlUtil.getAttribute( marcRecord, "type" ) );
            var record = MarcUtility.createRecordObject(marcRecord);
            record.eachField( /./, function( field ) { master.append(field); } );
        }
        Log.debug("MarcUtility.createRecordObjectFromIndexingData, Merged marc record: ", master );

        return master;
    };
    
    return that;
}();
