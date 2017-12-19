import * as actions from "../app/actions/searching";
import searchReducer from "../app/reducers/search";

let searchInitialState = {
  searchPending: false,
  searchTerm: "",
  searchErrorMessage: "",
  searchResults: []
};

let bibPosts = [{ id: ["sub"], "term.isbn": ["1234", "5678"] }];

describe("Search actions", () => {
  test("Search bibliographic record action correct", () => {
    let searchTerm = "id:1234";
    let desiredAction = {
      type: actions.SEARCH_BIB_RECORD_ID,
      searchTerm: searchTerm
    };
    expect(actions.searchBibRecord(searchTerm)).toEqual(desiredAction);
  });
  test("Search success action correct", () => {
    let desiredAction = {
      type: actions.SEARCH_SUCCESS,
      bibPosts
    };
    expect(actions.searchSuccess(bibPosts)).toEqual(desiredAction);
  });
  test("Search failed action correct", () => {
    let error = new Error("It went haywire!");
    let desiredAction = {
      type: actions.SEARCH_FAILED,
      message: error.message
    };
    expect(actions.searchFailed(error)).toEqual(desiredAction);
  });
});

describe("Search reducer", () => {
  test("Should return initial state", () => {
    expect(searchReducer(undefined, {})).toEqual(searchInitialState);
  });
  test("Reducer purity", () => {
    let state = {
      searchPending: true,
      searchTerm: "Looking...",
      searchErrorMessage: "",
      searchResults: []
    };
    let action = {
      type: actions.SEARCH_BIB_RECORD_ID,
      searchTerm: "Hello"
    };
    let newState = searchReducer(state, action);
    expect(newState).not.toBe(state);
    expect(newState).not.toEqual(state);
  });
  test("Should handle search bibliographic record", () => {
    let searchTerm = "Looking for someone";
    let searchBibRecordAction = {
      type: actions.SEARCH_BIB_RECORD_ID,
      searchTerm
    };
    expect(searchReducer(undefined, searchBibRecordAction)).toEqual({
      searchPending: true,
      searchTerm: searchTerm,
      searchErrorMessage: "",
      searchResults: []
    });
  });
  test("Should handle search success", () => {
    let state = {
      searchPending: true,
      searchTerm: "Looking...",
      searchErrorMessage: "",
      searchResults: []
    };
    let searchSuccessAction = {
      type: actions.SEARCH_SUCCESS,
      bibPosts
    };
    expect(searchReducer(state, searchSuccessAction)).toEqual({
      searchPending: false,
      searchTerm: "Looking...",
      searchErrorMessage: "",
      searchResults: bibPosts
    });
  });
  test("Should handle search failed", () => {
    let state = {
      searchPending: true,
      searchTerm: "Looking...",
      searchErrorMessage: "",
      searchResults: []
    };
    let searchSuccessAction = {
      type: actions.SEARCH_FAILED,
      message: "It went badly"
    };
    expect(searchReducer(state, searchSuccessAction)).toEqual({
      searchPending: false,
      searchTerm: "Looking...",
      searchErrorMessage: "It went badly",
      searchResults: []
    });
  });
});
