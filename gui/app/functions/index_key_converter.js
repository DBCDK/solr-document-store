let converter = (indexKeys) => {
    var response = {};
    Object.keys(indexKeys).forEach((elem)=>{
        let pair = elem.split(".");
        if(pair.length > 1){
            // Case where we have "." separated indexes
            if(response[pair[0]] === undefined){
                response[pair[0]] = {}
            }
            response[pair[0]][pair[1]] = indexKeys[elem];
        } else {
            // Case where key is not subdivided
            response[pair[0]] = indexKeys[elem];
        }
    });
    return response;
};

export default converter;
