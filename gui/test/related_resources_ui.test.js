import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/docstore_gui_store";
import RelatedResourcesExplorer from "../app/components/related_resources";
import { pullFailed, pullSuccess } from "../app/actions/related_resources";
import { selectBibRecord } from "../app/actions/global";
import Loading from "../app/components/loading";
import { produceInitialState } from "../app/reducers/related_resources";
import ResourceItem from "../app/components/related_resources/resource_item";
import ourSaga from "../app/sagas/docstore_gui_sagas";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/index";

Enzyme.configure({ adapter: new Adapter() });

let testHoldingsItems = [
  {
    agencyId: 870970,
    bibliographicRecordId: "11111111",
    field: "hasCoverUrl",
    value: true
  },
  {
    agencyId: 870970,
    bibliographicRecordId: "11111111",
    field: "hasBackCoverUrl",
    value: false
  },
  {
    agencyId: 870970,
    bibliographicRecordId: "11111111",
    field: "includesCD",
    value: true
  }
];

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <RelatedResourcesExplorer />
    </Provider>
  );

describe("RelatedResourcesExplorer properly displays based on global state", () => {
  let sagaTester;
  let wrapper;
  // Set up new Redux store for each test
  beforeEach(() => {
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Displays error if related resources error happened", () => {
    let errorMessage = "HUGE ERROR!";
    sagaTester.dispatch(pullFailed(new Error(errorMessage)));
    wrapper.update();
    expect(wrapper.text()).toContain(errorMessage);
  });
  test("Displays loading component when selecting a bib record", () => {
    // Selecting an element will start a network request for the related holdings
    sagaTester.dispatch(
      selectBibRecord({ bibliographicRecordId: "11111111", agencyId: 870970 })
    );
    wrapper.update();
    // Using mount to 'fold out' all children, which is necessary with store etc.
    expect(wrapper.find(Loading)).toHaveProperty("length", 1);
  });
  test("Display all related resources in global state", () => {
    let initialState = produceInitialState();
    initialState.resources = [
      {
        agencyId: 870970,
        bibliographicRecordId: "",
        field: "",
        value: true
      },
      {
        agencyId: 870970,
        bibliographicRecordId: "",
        field: "",
        value: false
      }
    ];
    let store = configureStore({ relatedResources: initialState });
    const wrapper = produceWrapper(store);
    expect(wrapper.find(ResourceItem)).toHaveProperty(
      "length",
      initialState.resources.length
    );
  });
  test("Related holdings show the correct number of related resource items", () => {
    sagaTester.dispatch(pullSuccess(testHoldingsItems));
    wrapper.update();
    expect(wrapper.find(ResourceItem)).toHaveProperty(
      "length",
      testHoldingsItems.length
    );
  });
});
