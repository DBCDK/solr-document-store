import converter from "../app/functions/index_key_converter";

let testObject = {
    "display.title": ["A Song of Ice and Fire"],
    "display.titleFull": ["Game of Thrones: A Song of Ice and Fire"],
    "display.type": ["type1"],
    "display.accessType": ["full"],
    "term.category": ["fiction"],
    "term.mainTitle": ["Game of Thrones"],
    "term.accessType": ["full"],
    "rogueKey": ["rogue value"]
};

let desiredResult = {
    "display": {
        "title": ["A Song of Ice and Fire"],
        "titleFull": ["Game of Thrones: A Song of Ice and Fire"],
        "type": ["type1"],
        "accessType": ["full"]
    },
    "term": {
        "category": ["fiction"],
        "mainTitle": ["Game of Thrones"],
        "accessType": ["full"]
    },
    "rogueKey": ["rogue value"]
};

test('properly subdivide dot notated fields',()=>{
    expect(converter(testObject)).toEqual(desiredResult);
});