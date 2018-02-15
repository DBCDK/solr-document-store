import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/docstore_gui_store";
import BibliographicExplorer from "../app/components/bibliographic_explorer";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";
import { produceInitialState } from "../app/reducers/filter";
import ourSaga from "../app/sagas/docstore_gui_sagas";
import Header from "../app/components/bibliographic_explorer/header";
import Parent from "../app/components/index_key_explorer/parent";
import Element from "../app/components/bibliographic_explorer/element";
import ParentElement from "../app/components/bibliographic_explorer/parent_element";
import converter from "../app/functions/index_key_converter";

Enzyme.configure({ adapter: new Adapter() });

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <BibliographicExplorer />
    </Provider>
  );

let testItem = converter({
  id: ["06189113/32!870970-basis:06189113-870970-basis"],
  "unit.id": ["unit:733294"],
  "work.id": ["work:638237"],
  "sort.dk5": ["91.246"],
  _version_: ["1579764275179683800"],
  fedoraPid: ["870970-basis:06189113"],
  "sort.date": ["1984"],
  submitter: ["870970"],
  reddit: ["is awesome"],
  "rec.unitId": ["unit:733294"],
  "rec.workId": ["work:638237"],
  "sort.title": ["Engelen Mi", "Andet navn", "Tredje navn"],
  "sort.creator": ["Albertsen, L. L. (f. 1936)"],
  "sort.workType": ["aliterature"],
  original_format: ["basis"],
  "rec.createdDate": ["1985-02-25T00:00:00Z"],
  "rec.indexedDate": ["2017-09-28T06:36:55.215Z"],
  "sort.complexKey": ["Bog  a  9999  2016  a"],
  "rec.modifiedDate": ["1988-01-30T00:00:00Z"],
  "rec.repositoryId": ["870970-basis:06189113"],
  "sort.recordOwner": ["a870970"],
  "sort.genreCategory": ["nonfiktion"],
  "rec.fedoraStreamDate": ["2015-03-21T03:21:13.708Z"],
  "sort.acquisitionDate": ["20050301"],
  "term.primaryLanguage": ["dan"],
  "rec.bibliographicRecordId": ["06189113"]
});

let bibExplorerInitialState = () => {
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
      initialState: { filter: bibExplorerInitialState() },
      reducers
    });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Explorer shows correct number of headers and parent-elements", () => {
    let headers = wrapper.find(Header);
    expect(
      headers.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 5);
    let parentElements = wrapper.find(ParentElement);
    expect(
      parentElements.filterWhere(parent => parent.html() !== null)
    ).toHaveProperty("length", 6);
  });
  test("Explorer displays key names", () => {
    let parents = wrapper.find(Header);
    let parentElements = wrapper.find(ParentElement);
    let parentText = parents.reduce(
      (value, node, index) => (value += node.text()),
      ""
    );
    expect(parentText).toContain("rec");
    expect(parentText).toContain("sort");
    expect(parentText).toContain("term");
    expect(parentText).toContain("unit");
    expect(parentText).toContain("work");
    let parentElementText = parentElements.reduce(
      (value, node, index) => (value += node.text()),
      ""
    );
    expect(parentElementText).toContain("original_format");
    expect(parentElementText).toContain("id");
    expect(parentElementText).toContain("submitter");
    expect(parentElementText).toContain("fedoraPid");
    expect(parentElementText).toContain("_version_");
    expect(parentElementText).toContain("reddit");
  });
  test("ParentElements display data, without expansion needed", () => {
    let parentElements = wrapper.find(ParentElement);
    let parentElementText = parentElements.reduce(
      (value, node, index) => (value += node.text()),
      ""
    );
    expect(parentElementText).toContain("basis");
    expect(parentElementText).toContain("1579764275179683800");
    expect(parentElementText).toContain("870970-basis:06189113");
    expect(parentElementText).toContain(
      "06189113/32!870970-basis:06189113-870970-basis"
    );
  });
  test("When parent element is expanded/minified, there is a correct number of children", () => {
    let headers = wrapper.find(Header);
    let rec = headers.filterWhere(e => e.key() === "rec");
    let expandButton = rec
      .find("i")
      .filterWhere(e => e.hasClass("expand-button-header"));
    expandButton.simulate("click");
    wrapper.update();
    let parents = wrapper.find(Parent);
    let parent = parents.filterWhere(e => e.prop("name") === "rec");
    let children = parent.find(Element);
    expect(children.filterWhere(child => child.html() !== null)).toHaveProperty(
      "length",
      8
    );
    // Toggle of again
    expandButton.simulate("click");
    wrapper.update();
    parents = wrapper.find(Parent);
    parent = parents.filterWhere(e => e.prop("name") === "rec");
    children = parent.find(Element);
    expect(children.filterWhere(child => child.html() !== null)).toHaveProperty(
      "length",
      0
    );
  });
  test("When child element has several items, expand can be toggled to shown them all", () => {
    let headers = wrapper.find(Header);
    let rec = headers.filterWhere(e => e.key() === "sort");
    let expandButton = rec
      .find("i")
      .filterWhere(e => e.hasClass("expand-button-header"));
    expandButton.simulate("click");
    wrapper.update();
    let parents = wrapper.find(Parent);
    let parent = parents.filterWhere(e => e.prop("name") === "sort");
    let children = parent.find(Element);
    let titleChild = children.filterWhere(e => e.prop("name") === "title");
    expect(titleChild.text()).toContain("Engelen Mi");
    expect(titleChild.text()).not.toContain("Andet navn");
    expect(titleChild.text()).not.toContain("Tredje navn");
    titleChild.find(".expand-button-element").simulate("click");
    wrapper.update();
    parents = wrapper.find(Parent);
    parent = parents.filterWhere(e => e.prop("name") === "sort");
    children = parent.find(Element);
    titleChild = children.filterWhere(e => e.prop("name") === "title");
    expect(titleChild.text()).toContain("Engelen Mi");
    expect(titleChild.text()).toContain("Andet navn");
    expect(titleChild.text()).toContain("Tredje navn");
  });
});
