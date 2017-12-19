import converter from "../app/functions/index_key_converter";

// Function, so it can be used in separate tests that tries mutation etc.
let genericTestObject = () => ({
  "display.title": ["A Song of Ice and Fire"],
  "display.titleFull": ["Game of Thrones: A Song of Ice and Fire"],
  "display.type": ["type1"],
  "display.accessType": ["full"],
  "term.category": ["fiction"],
  "term.mainTitle": ["Game of Thrones"],
  "term.accessType": ["full"],
  rogueKey: ["rogue value"]
});

// Function, so it can be used in separate tests that tries mutation etc.
let genericDesiredResult = () => ({
  display: {
    title: ["A Song of Ice and Fire"],
    titleFull: ["Game of Thrones: A Song of Ice and Fire"],
    type: ["type1"],
    accessType: ["full"]
  },
  term: {
    category: ["fiction"],
    mainTitle: ["Game of Thrones"],
    accessType: ["full"]
  },
  rogueKey: ["rogue value"]
});

let multipleDotsTestObject = () => ({
  "hello.world.how.is.it.going": ["Heysan"],
  "i.am.groot": ["I am Groot!"]
});

let multipleDotsDesiredResult = () => ({
  hello: {
    "world.how.is.it.going": ["Heysan"]
  },
  i: {
    "am.groot": ["I am Groot!"]
  }
});

let noSubdivideObject = () => ({
  basic: ["object"],
  nothing: ["new"],
  no: ["conversion"]
});

describe("Testing functions purity", () => {
  test("Does not mutate input", () => {
    let instance = genericTestObject();
    let output = converter(instance);
    expect(output).not.toBe(instance);
    expect(instance).toEqual(genericTestObject());
  });
  test("Function holds no state, if re-run several times on same input, output stays the same", () => {
    let desiredResult = converter(genericTestObject());
    for (let i = 0; i <= 10; i++) {
      const currentResult = converter(genericTestObject());
      expect(currentResult).toEqual(desiredResult);
    }
  });
  test("If run on converted object, output stays the same", () => {
    let result = converter(genericTestObject());
    expect(converter(result)).toEqual(result);
  });
  test("If run on converted object with multiple dots, output stays the same", () => {
    let result = converter(multipleDotsTestObject());
    expect(converter(result)).toEqual(result);
  });
  test("If no subdivides, output changes nothing", () => {
    expect(converter(noSubdivideObject())).toEqual(noSubdivideObject());
  });
});

describe("Convertion is correct", () => {
  test("Handles fields that cannot be subdivided", () => {
    expect(converter(noSubdivideObject())).toEqual(noSubdivideObject());
  });
  test("properly subdivide dot notated fields", () => {
    expect(converter(genericTestObject())).toEqual(genericDesiredResult());
  });
  test("properly handle fields with multiple dots", () => {
    expect(converter(multipleDotsTestObject())).toEqual(
      multipleDotsDesiredResult()
    );
  });
});
