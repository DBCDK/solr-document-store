let converter = (indexKeys) => {
    let response = {};
    Object.keys(indexKeys).forEach((elem)=>{
        // Only split at the first dot
        let pair = elem.split(/\.(.+)/);
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
