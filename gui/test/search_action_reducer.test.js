import * as actions from "../app/actions/searching";
import searchReducer, { produceInitialState } from "../app/reducers/search";
import { SEARCH_SELECT_PARAMETER } from "../app/actions/searching";
import { SEARCH_BIB_ID, SEARCH_REPO_ID } from "../app/api";

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
  test("Search page size correct", () => {
    let desiredAction = {
      type: actions.SEARCH_PAGE_SIZE,
      pageSize: 5
    };
    expect(actions.setPageSize(5)).toEqual(desiredAction);
  });
  test("Search fetch page correct", () => {
    let desiredAction = {
      type: actions.SEARCH_FETCH_PAGE,
      pageIndex: 3,
      orderBy: "deleted"
    };
    expect(actions.fetchPage(3, "deleted")).toEqual(desiredAction);
  });
  test("Select search parameter correct", () => {
    let desiredAction = {
      type: actions.SEARCH_SELECT_PARAMETER,
      parameter: SEARCH_BIB_ID
    };
    expect(actions.selectSearchParameter(SEARCH_BIB_ID)).toEqual(desiredAction);
  });
  test("Search bibliographic item correct", () => {
    let desiredBibId = "788958486";
    let desiredAgencyId = "870970";
    let desiredAction = {
      type: actions.SEARCH_BIB_ITEM,
      bibliographicRecordId: desiredBibId,
      bibliographicAgencyId: desiredAgencyId
    };
    expect(actions.searchBibItem(desiredBibId, desiredAgencyId)).toEqual(
      desiredAction
    );
  });
  test("Search bibliographic item success correct", () => {
    let desiredBibItem = {
      bibliographicRecordId: "6747565",
      agencyId: "794591",
      indexKeys: {
        "rec.reposityoryId": ["6747565-basis:2347623"]
      }
    };
    let desiredAction = {
      type: actions.SEARCH_BIB_ITEM_SUCCESS,
      bibItem: desiredBibItem
    };
    expect(actions.searchBibItemSuccess(desiredBibItem)).toEqual(desiredAction);
  });
  test("Search bibliographic item failed correct", () => {
    let desiredMessage = "Oh noes";
    let desiredAction = {
      type: actions.SEARCH_BIB_ITEM_FAILED,
      message: desiredMessage
    };
    expect(actions.searchBibItemFailed(new Error(desiredMessage))).toEqual(
      desiredAction
    );
  });
  test("Initial retrieving of bib item correct", () => {
    let desiredBibId = "289575523";
    let desiredAgencyId = "230502";
    let desiredAction = {
      type: actions.INITIAL_RETRIEVE_BIB_ITEM,
      bibliographicRecordId: desiredBibId,
      bibliographicAgencyId: desiredAgencyId
    };
    expect(
      actions.initialRetrieveBibItem(desiredBibId, desiredAgencyId)
    ).toEqual(desiredAction);
  });
});

describe("Search reducer", () => {
  let state;
  beforeEach(() => {
    state = produceInitialState();
  });
  test("Should return initial state", () => {
    expect(searchReducer(undefined, {})).toEqual(searchInitialState);
  });
  test("Invalid action does nothing", () => {
    expect(searchReducer(produceInitialState(), undefined)).toEqual(
      produceInitialState()
    );
  });
  test("Reducer purity", () => {
    state.searchTerm = "Looking...";
    state.searchPending = true;
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
    let selectSearchParameterAction = {
      type: SEARCH_SELECT_PARAMETER,
      parameter
    };
    let desiredState = produceInitialState();
    desiredState.searchParameter = parameter;
    expect(searchReducer(state, selectSearchParameterAction)).toEqual(
      desiredState
    );
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
    expect(searchReducer(state, searchBibRecordAction)).toEqual(desiredState);
  });
  test("Should handle search success", () => {
    let searchTerm = "Looking...";
    state.searchTerm = searchTerm;
    let searchSuccessAction = {
      type: actions.SEARCH_SUCCESS,
      bibPosts: { result: bibPosts, pages: 1 }
    };
    let desiredState = produceInitialState();
    desiredState.searchResults = bibPosts;
    desiredState.searchTerm = searchTerm;
    desiredState.searchPageCount = 1;
    expect(searchReducer(state, searchSuccessAction)).toEqual(desiredState);
  });
  test("Should handle search failed", () => {
    let searchTerm = "Looking...";
    state.searchTerm = searchTerm;
    state.searchPending = true;
    let searchSuccessAction = {
      type: actions.SEARCH_FAILED,
      message: "It went badly"
    };
    let desiredState = produceInitialState();
    desiredState.searchPending = false;
    desiredState.searchTerm = searchTerm;
    desiredState.searchErrorMessage = "It went badly";
    expect(searchReducer(state, searchSuccessAction)).toEqual(desiredState);
  });
  test("Should handle search fetch page", () => {
    let searchFetchPageAction = {
      type: actions.SEARCH_FETCH_PAGE
    };
    let desiredStateCannotFetch = produceInitialState();
    console.log(desiredStateCannotFetch);
    expect(searchReducer(state, searchFetchPageAction)).toEqual(
      desiredStateCannotFetch
    );
    let initialStateCanFetch = produceInitialState();
    initialStateCanFetch.searchPageCount = 2;
    let desiredStateCanFetch = produceInitialState();
    desiredStateCanFetch.searchPending = true;
    desiredStateCanFetch.searchPageCount = 2;
    expect(searchReducer(initialStateCanFetch, searchFetchPageAction)).toEqual(
      desiredStateCanFetch
    );
  });
  test("Should handle search page size", () => {
    let searchPageSizeAction = actions.setPageSize(5);
    let desiredState = produceInitialState();
    desiredState.searchPageSize = 5;
    expect(searchReducer(state, searchPageSizeAction)).toEqual(desiredState);
  });
  test("Should handle select search parameter", () => {
    let desiredState = produceInitialState();
    desiredState.searchParameter = SEARCH_REPO_ID;
    expect(
      searchReducer(state, actions.selectSearchParameter(SEARCH_REPO_ID))
    ).toEqual(desiredState);
  });
  test("Should handle search bib item", () => {
    let desiredBibItem = "684883212";
    let desiredAgencyId = "682049";
    let desiredState = produceInitialState();
    desiredState.searchPending = true;
    expect(
      searchReducer(
        state,
        actions.searchBibItem(desiredBibItem, desiredAgencyId)
      )
    ).toEqual(desiredState);
  });
  test("Should handle search bib success item", () => {
    state.searchPending = true;
    let desiredBibItem = {
      bibliographicRecordId: "345689834596",
      agencyId: "203910",
      indexKeys: {
        "rec.reposityoryId": ["23952332-basis:203910"]
      }
    };
    let desiredState = produceInitialState();
    desiredState.searchResults = [desiredBibItem];
    desiredState.searchPageCount = 1;
    expect(
      searchReducer(state, actions.searchBibItemSuccess(desiredBibItem))
    ).toEqual(desiredState);
  });
  test("Should handle search bib failed item", () => {
    let desiredErrorMessage = "We are having difficulties...";
    state.searchPending = true;
    let desiredState = produceInitialState();
    desiredState.searchErrorMessage = desiredErrorMessage;
    expect(
      searchReducer(
        state,
        actions.searchBibItemFailed(new Error(desiredErrorMessage))
      )
    ).toEqual(desiredState);
  });
});
