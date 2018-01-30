import configureStore from "../app/reducers/docstore_gui_store";
import { takeLatest, call, put, select } from "redux-saga/effects";
import ourSaga, {
  watchSearch,
  fetchBibliographicPost,
  getSearchParameter
} from "../app/sagas/docstore_gui_sagas";
import {
  SEARCH_BIB_RECORD_ID,
  searchBibRecord,
  searchSuccess
} from "../app/actions/searching";
import * as searchActions from "../app/actions/searching";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";

import api from "../app/api/index";

describe("Search saga unit test", () => {
  test("Listening for search events unit test", () => {
    const gen = watchSearch();
    expect(gen.next().value).toEqual(
      takeLatest(SEARCH_BIB_RECORD_ID, fetchBibliographicPost)
    );
  });
});

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
    fetch.mockResponse(
      JSON.stringify({
        result: [
          {
            bibliographicRecordId: "4321"
          }
        ]
      })
    );
    sagaTester.dispatch(searchBibRecord("4321"));
    // Will await all promises to complete, which includes saga, could fail if timers are involved
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchResults[0]).toEqual({
      bibliographicRecordId: "4321"
    });
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
});
