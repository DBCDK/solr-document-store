
use( "Log" );

EXPORTED_SYMBOLS = [ 'Index' ];

/**
 * Index module to create an array that hold index data
 *
 * @type {namespace}
 * @namespace
 * @name Index
 */
var Index = function( ) {

    var that = {};

    /**
     * Create a new index array
     *
     * @return {Index} Index array object with a method to push new fields
     * @name Index.newIndex
     * @method
     */
    that.newIndex = function() {

        Log.trace( "Entering: Index.newIndex method" );

        var index = [];

        index.pushField = function(fieldName, fieldValue) {
            // Remove comments to enable parameter validation (may impact performance)
            //if (fieldName && fieldValue != null && fieldValue != undefined) {
                Log.trace("Adding field '", fieldName, "': '", fieldValue, "'");
                var field = {
                    "name": fieldName,
                    "value": String(fieldValue)
                };
                index.push( field );
            //} else {
            //    Log.error("fieldname :'", fieldName, "' or fieldValue: '", fieldValue, "' is missing. Field will not be added" );
            //}
        };
        Log.trace( "Leaving: Index.newIndex method" );
        return index;
    };

    /**
     * Push a new index field to the index.
     *
     * Function is available in array returned by Index.newIndex.
     *
     * @type {method}
     * @syntax index.pushField(fieldName, fieldValue)
     * @param {String} fieldName name of field to add
     * @param {String} fieldValue value of field to add
     * @return {Index} The index array for chaining calls
     * @name Index.pushField
     * @method
     * @example
     * var index = Index.newIndex();
     * index.pushField("name", "value");
     */
    that.pushField = new String(); // Placeholder for documentation. Implementation is on array returned by newIndex above


    return that;
}();

