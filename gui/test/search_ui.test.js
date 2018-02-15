import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/docstore_gui_store";
import ConnectedSearchField from "../app/components/search_field";
import * as searchActions from "../app/actions/searching";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";
import ourSaga from "../app/sagas/docstore_gui_sagas";

Enzyme.configure({ adapter: new Adapter() });

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <ConnectedSearchField />
    </Provider>
  );

describe("SearchField interactions properly updates global state", () => {
  let store;
  let sagaTester;
  let wrapper;
  // Set up new Redux store for each test
  beforeEach(() => {
    store = configureStore();
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Typing and pressing search button should set the search term in global state", () => {
    fetch.mockResponse(JSON.stringify({ result: [] }));
    let getSearchInputField = () => wrapper.find("input");
    let searchInputField = getSearchInputField();
    searchInputField.simulate("change", { target: { value: "4321" } });
    let searchButton = wrapper
      .find("button")
      .findWhere(button => button.hasClass("search-btn"));
    searchButton.simulate("click");
    expect(sagaTester.getState().search.searchTerm).toEqual("4321");
  });
  test("Typing and pressing Enter should set the search term in global state", () => {
    fetch.mockResponse(JSON.stringify({ result: [] }));
    let getSearchInputField = () => wrapper.find("input");
    let searchInputField = getSearchInputField();
    searchInputField.simulate("change", { target: { value: "4321" } });
    searchInputField.simulate("keypress", { key: "Enter" });
    expect(sagaTester.getState().search.searchTerm).toEqual("4321");
    // Not enter should not search
    searchInputField.simulate("keypress", { key: "v" });
    expect(sagaTester.getState().search.searchTerm).toEqual("4321");
  });
  test("Pressing search button with valid id in search field should eventually update global state with result", async () => {
    // Test data
    let result1 = {
      agencyId: 200,
      bibliographicRecordId: "1-22",
      work: "work:1",
      unit: "unit:2",
      producerVersion: "1234",
      deleted: false,
      indexKeys: {
        submitter: ["150005"],
        "term.reviewedIdentifier": ["9788711548288"]
      }
    };
    let result2 = {
      agencyId: 200210,
      bibliographicRecordId: "10-31",
      work: "work:1",
      unit: "unit:2",
      producerVersion: "4567",
      deleted: false,
      indexKeys: {
        "unit.primaryObject": ["150005-anmeld:120102"],
        "term.reviewer": ["Pia Bechmann"]
      }
    };
    // Mocking network calls
    fetch.mockResponseOnce(JSON.stringify({ result: [result1] }));
    fetch.mockResponseOnce(JSON.stringify({ result: [result2] }));
    // Simulating typing searchTerm and pressing search button
    let searchInputField = wrapper.find("input");
    searchInputField.simulate("change", { target: { value: "4321" } });
    let searchButton = wrapper
      .find("button")
      .findWhere(button => button.hasClass("search-btn"));
    searchButton.simulate("click");

    // Wait for api call to succeed and store to be updated
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS);
    expect(sagaTester.getState().search.searchResults).toEqual([result1]);
    // Searching again with different result, simulate underlying change
    searchButton.simulate("click");
    // Second argument futureOnly=true since it is the second time we listen for it,
    // and therefore we want to wait for the future one
    await sagaTester.waitFor(searchActions.SEARCH_SUCCESS, true);
    expect(sagaTester.getState().search.searchResults).toEqual([result2]);
  });
});
