import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/docstore_gui_store";
import BibliographicExplorer from "../app/components/bibliographic_explorer";
import * as filterActions from "../app/actions/filtering";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";
import { produceInitialState } from "../app/reducers/filter";
import ourSaga from "../app/sagas/docstore_gui_sagas";
import FilterHeader from "../app/components/bibliographic_explorer/header";
import FilterParentElement from "../app/components/bibliographic_explorer/parent_element";

Enzyme.configure({ adapter: new Adapter() });

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <BibliographicExplorer />
    </Provider>
  );

let testItem = {
  scanterm: {
    title: ["Enogtyve lyriske temaer", "21 lyriske temaer"]
  },
  dkcclterm: {
    op: ["19750820"]
  },
  term: {
    isbn: ["8700447315", "87-00-44731-5"],
    language: ["dan", "Dansk"]
  },
  original_format: ["basis"],
  id: ["00759635/32!870970-basis:00759635-300751-katalog"]
};

let filterInitialState = () => {
  let res = produceInitialState();
  res.selectedItem = testItem;
  return res;
};

describe("SearchField interactions properly updates global state", () => {
  let store;
  let sagaTester;
  let wrapper;
  // Set up new Redux store for each test
  beforeEach(() => {
    store = configureStore();
    sagaTester = new SagaTester({
      initialState: { filter: filterInitialState() },
      reducers
    });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Only filtered elements are displayed, excluding ParentElement's", () => {
    // Setting up filter
    sagaTester.dispatch(
      filterActions.selectWhiteListPending({
        scanterm: {
          title: true
        }
      })
    );
    sagaTester.dispatch(filterActions.applyFilter());
    let parents = wrapper.find(FilterHeader);
    let parentElements = wrapper.find(FilterParentElement);
    // Unmounted react components (which are not displayed) still exists in the DOM tree
    expect(
      parents.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 1);
    expect(
      parentElements.filterWhere(parentElement => parentElement.html() !== null)
    ).toHaveProperty("length", 2);
  });
  test("Clicking whitelist and apply applies white listing in global state and show appropriate elements", () => {
    let parents = wrapper.find(FilterHeader);
    expect(
      parents.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 3);
    let whitelistPendingButton = wrapper
      .find(".whitelist-button-header")
      .first();
    whitelistPendingButton.simulate("click");
    // TODO make this more refactor agnostic
    let applyFilterButton = wrapper
      .find(BibliographicExplorer)
      .find("button")
      .first();
    applyFilterButton.simulate("click");
    expect(
      parents.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 1);
  });
  test("Clearing filter by clicking should show all elements", () => {
    // Setting up filter
    sagaTester.dispatch(
      filterActions.selectWhiteListPending({
        scanterm: {
          title: true
        }
      })
    );
    sagaTester.dispatch(filterActions.applyFilter());
    let parents = wrapper.find(FilterHeader);
    let parentElements = wrapper.find(FilterParentElement);
    // Check items where filtered, so they can come back
    expect(
      parents.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 1);
    // TODO make this more refactor agnostic
    let clearFilterButton = wrapper
      .find(BibliographicExplorer)
      .find("button")
      .at(1);
    clearFilterButton.simulate("click");
    // Check items are rendered again
    expect(
      parents.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 3);
  });
  // TODO test filtering of individual elements in parents
});
