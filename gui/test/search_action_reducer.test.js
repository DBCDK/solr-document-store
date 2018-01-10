import * as actions from "../app/actions/searching";
import searchReducer,{produceInitialState} from "../app/reducers/search";
import {SEARCH_SELECT_PARAMETER} from "../app/actions/searching";
import {SEARCH_REPO_ID} from "../app/api";

let searchInitialState = produceInitialState();

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
  test("Invalid action does nothing", () => {
    expect(searchReducer(produceInitialState(),undefined)).toEqual(produceInitialState())
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
  test("Should handle selecting search parameter", () => {
    let parameter = SEARCH_REPO_ID;
    let startState = produceInitialState();
    let selectSearchParameterAction = {
      type: SEARCH_SELECT_PARAMETER,
      parameter
    };
    let desiredState = produceInitialState();
    desiredState.searchParameter = parameter;
    expect(searchReducer(startState,selectSearchParameterAction)).toEqual(desiredState);
  });
  test("Should handle search bibliographic record", () => {
    let searchTerm = "Looking for someone";
    let searchBibRecordAction = {
      type: actions.SEARCH_BIB_RECORD_ID,
      searchTerm
    };
    let desiredState = produceInitialState();
    desiredState.searchPending = true;
    desiredState.searchTerm = searchTerm;
    expect(searchReducer(undefined, searchBibRecordAction)).toEqual(desiredState);
  });
  test("Should handle search success", () => {
    let searchTerm = "Looking...";
    let startState = produceInitialState();
    startState.searchTerm = searchTerm;
    let searchSuccessAction = {
      type: actions.SEARCH_SUCCESS,
      bibPosts: {result: bibPosts,pages: 1}
    };
    let desiredState = produceInitialState();
    desiredState.searchResults = bibPosts;
    desiredState.searchTerm = searchTerm;
    desiredState.searchPageCount = 1;
    expect(searchReducer(startState, searchSuccessAction)).toEqual(desiredState);
  });
  test("Should handle search failed", () => {
    let searchTerm = "Looking...";
    let startState = produceInitialState();
    startState.searchTerm = searchTerm;
    startState.searchPending = true;
    let searchSuccessAction = {
      type: actions.SEARCH_FAILED,
      message: "It went badly"
    };
    let desiredState = produceInitialState();
    desiredState.searchPending = false;
    desiredState.searchTerm = searchTerm;
    desiredState.searchErrorMessage = "It went badly";
    expect(searchReducer(startState, searchSuccessAction)).toEqual(desiredState);
  });
});
