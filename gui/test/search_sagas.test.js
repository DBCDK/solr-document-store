import configureStore from "../app/reducers/docstore_gui_store";
import { takeLatest } from "redux-saga/effects";
import ourSaga, {
  watchSearch,
  fetchBibliographicPost
} from "../app/sagas/docstore_gui_sagas";
import {
  SEARCH_BIB_RECORD_ID,
  searchBibRecord
} from "../app/actions/searching";
import * as globalActions from "../app/actions/global";
import * as searchActions from "../app/actions/searching";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";
import { SEARCH_BIB_ID, SEARCH_REPO_ID } from "../app/api";

describe("Search saga unit test", () => {
  test("Listening for search events unit test", () => {
    const gen = watchSearch();
    expect(gen.next().value).toEqual(
      takeLatest(SEARCH_BIB_RECORD_ID, fetchBibliographicPost)
    );
  });
});

let testSearchResponse = {
  result: [
    {
      bibliographicRecordId: "4321",
      agencyId: "870970",
      trackingId: "367290634",
      producerVersion: "283572395",
      deleted: false
    }
  ],
  pages: 1
};

let testSearchPagedResponse = {
  result: [
    { bibliographicRecordId: "1234", agencyId: "870970" },
    { bibliographicRecordId: "2345", agencyId: "543780" },
    { bibliographicRecordId: "3456", agencyId: "674510" }
  ],
  pages: 4
};

describe("Search saga integration test", () => {
  let store;
  let sagaTester;
  // Set up new Redux store for each test
  beforeEach(() => {
    store = configureStore();
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
  });
  test("Successful request should end up in store", async () => {
    fetch.mockResponse(JSON.stringify(testSearchResponse));
    sagaTester.dispatch(searchBibRecord("4321"));
    // Will await all promises to complete, which includes saga, could fail if timers are involved
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchResults[0]).toEqual(
      testSearchResponse.result[0]
    );
  });
  test("Error in API should result in error message", async () => {
    fetch.mockReject(new Error("We had an error"));
    sagaTester.dispatch(searchBibRecord("handle error"));
    // Will await all promises to complete, which includes saga, could fail if timers are involved
    await sagaTester.waitFor(searchActions.SEARCH_FAILED);
    expect(sagaTester.getState().search.searchErrorMessage).toEqual(
      "We had an error"
    );
  });
  test("Searching for repo id, should change search parameter", async () => {
    // Testing search repositoryId toggles parameter
    fetch.mockResponse(JSON.stringify(testSearchResponse));
    sagaTester.dispatch(searchActions.searchBibRecord("1259125-basis:870970"));
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchParameter).toEqual(
      SEARCH_REPO_ID
    );
    // Testing bibliographic record id search toggles parameter back
    fetch.mockResponse(JSON.stringify(testSearchResponse));
    sagaTester.dispatch(searchActions.searchBibRecord("1259125"));
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchParameter).toEqual(SEARCH_BIB_ID);
  });
  test("Having multi page result allows searching pages", async () => {
    fetch.mockResponse(JSON.stringify(testSearchPagedResponse));
    sagaTester.dispatch(searchActions.searchBibRecord("whatever"));
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchPageCount).toEqual(4);
    fetch.mockResponse(JSON.stringify(testSearchPagedResponse));
    sagaTester.dispatch(searchActions.fetchPage(3));
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    // Testing that fetching out of bounds does nothing
    sagaTester.dispatch(searchActions.fetchPage(5));
    expect(sagaTester.numCalled(searchActions.SEARCH_FETCH_PAGE)).toEqual(2);
    expect(sagaTester.numCalled(searchActions.SEARCH_SUCCESS)).toEqual(1);
  });
  test("Having no results disallows paged search", async () => {
    fetch.mockResponse(JSON.stringify(testSearchResponse));
    sagaTester.dispatch(searchActions.fetchPage(2));
    // Testing that ony fetchPage was called, but nothing following that
    expect(sagaTester.getCalledActions()).toEqual([searchActions.fetchPage(2)]);
  });
  test("Initial search of bib item should retrieve and select item", async () => {
    fetch.mockResponse(JSON.stringify(testSearchResponse.result[0]));
    sagaTester.dispatch(searchActions.initialRetrieveBibItem("4321", "870970"));
    await sagaTester.waitFor(searchActions.SEARCH_BIB_ITEM_SUCCESS);
    expect(sagaTester.getState().search.searchResults.length).toEqual(1);
    expect(sagaTester.getState().search.searchResults[0]).toEqual(
      testSearchResponse.result[0]
    );
    await sagaTester.waitFor(globalActions.SELECT_BIB_RECORD);
    expect(sagaTester.getState().global).toEqual({
      selectedBibRecordId: "4321",
      selectedBibAgencyId: "870970"
    });
  });
  test("Initial search of non existing item should not select anything", async () => {
    fetch.mockResponse("", { status: 404 });
    sagaTester.dispatch(searchActions.initialRetrieveBibItem("4321", "870970"));
    await sagaTester.waitFor(searchActions.SEARCH_BIB_ITEM_FAILED);
    expect(sagaTester.getState().search.searchErrorMessage).toEqual(
      "Error with http status code: 404"
    );
    // Nothing was selected!
    expect(sagaTester.getState().global).toEqual({
      selectedBibRecordId: null,
      selectedBibAgencyId: null
    });
  });
  test("Initial search failed should error correctly", async () => {
    let errorMessage = "You are not allowed to do that!";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(searchActions.initialRetrieveBibItem("4321", "870970"));
    await sagaTester.waitFor(searchActions.SEARCH_BIB_ITEM_FAILED);
    expect(sagaTester.getState().search.searchErrorMessage).toEqual(
      errorMessage
    );
    // Nothing was selected!
    expect(sagaTester.getState().global).toEqual({
      selectedBibRecordId: null,
      selectedBibAgencyId: null
    });
  });
});
