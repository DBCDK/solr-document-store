import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureStore from "../app/reducers/docstore_gui_store";
import RelatedHoldingsExplorer from "../app/components/related_holdings";
import { pullFailed, pullSuccess } from "../app/actions/related_holdings";
import { selectBibRecord } from "../app/actions/global";
import Loading from "../app/components/loading";
import { produceInitialState } from "../app/reducers/related_holdings";
import RelatedHoldingsItem from "../app/components/related_holdings/related_holdings_item";
import ourSaga from "../app/sagas/docstore_gui_sagas";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/index";
import Manifestation from "../app/components/related_holdings/manifestation";
import ManifestationParentElement from "../app/components/related_holdings/manifestation_explorer/parent_element";
import ManifestationHeader from "../app/components/related_holdings/manifestation_explorer/header";

Enzyme.configure({ adapter: new Adapter() });

let testHoldingsItems = [
  {
    agencyId: 131030,
    bibliographicRecordId: "23645564",
    indexKeys: [
      {
        _version_: ["239045802345802394850923458903458"],
        id: ["sdfasdj!sdlkfgj/sdfghjskldfg"],
        "rec.trackingId": ["", "f16284ae-3be8-43cd-9cec-932a3db40c8a"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Gedved Bibliotek"],
        "holdingsitem.itemId": ["3480445634"],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["131030"],
        "holdingsitem.location": ["-"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Voksen"],
        "holdingsitem.subLocation": ["Romaner"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2001-12-04T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["alm"],
        "holdingsitem.expectedDelivery": ["2016-08-24T22:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.trackingId": ["", "f16284ae-3be8-43cd-9cec-932a3db40c8a"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Fjernlån"],
        "holdingsitem.itemId": ["3936758451"],
        "holdingsitem.status": ["OnShelf"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["131030"],
        "holdingsitem.location": ["Fjernlån"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Fjernlån"],
        "holdingsitem.subLocation": ["Fjernlån"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2015-09-19T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["fje"],
        "holdingsitem.expectedDelivery": ["2016-08-24T22:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.trackingId": ["", "f16284ae-3be8-43cd-9cec-932a3db40c8a"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Horsens Bibliotek"],
        "holdingsitem.itemId": ["3480445642"],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["131030"],
        "holdingsitem.location": ["-"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Voksen"],
        "holdingsitem.subLocation": ["Romaner"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2001-12-04T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["alm"],
        "holdingsitem.expectedDelivery": ["2016-08-24T22:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      }
    ],
    trackingId: ""
  },
  {
    agencyId: 761500,
    bibliographicRecordId: "23645564",
    indexKeys: [
      {
        "rec.trackingId": ["", "bb613be6-86ae-4caa-9639-4198865227f2"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Fjernlån"],
        "holdingsitem.itemId": [
          "232821493",
          "3594213997",
          "3495945171",
          "3554775682",
          "4032928086",
          "3482959279",
          "3570345256",
          "4196475422",
          "4879046853",
          "3612518954"
        ],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["761500"],
        "holdingsitem.location": [""],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Fjernlån"],
        "holdingsitem.subLocation": [""],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2015-03-24T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["fje"],
        "holdingsitem.expectedDelivery": ["2016-11-07T23:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.trackingId": ["", "bb613be6-86ae-4caa-9639-4198865227f2"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Fjernlån"],
        "holdingsitem.itemId": ["3936758451"],
        "holdingsitem.status": ["OnShelf"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["761500"],
        "holdingsitem.location": ["Fjernlån"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Fjernlån"],
        "holdingsitem.subLocation": ["Fjernlån"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2015-09-19T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["fje"],
        "holdingsitem.expectedDelivery": ["2016-11-07T23:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.trackingId": ["", "bb613be6-86ae-4caa-9639-4198865227f2"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Gedved Bibliotek"],
        "holdingsitem.itemId": ["3480445634"],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["761500"],
        "holdingsitem.location": ["-"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Voksen"],
        "holdingsitem.subLocation": ["Romaner"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2001-12-04T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["Alm.lån"],
        "holdingsitem.expectedDelivery": ["2016-11-07T23:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.trackingId": ["", "bb613be6-86ae-4caa-9639-4198865227f2"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Fjernlån"],
        "holdingsitem.itemId": [
          "3935969440",
          "3511146150",
          "4879046861",
          "3935969432",
          "4161407688"
        ],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["761500"],
        "holdingsitem.location": ["Fjernlån"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Fjernlån"],
        "holdingsitem.subLocation": ["Fjernlån"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2015-08-01T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["fje"],
        "holdingsitem.expectedDelivery": ["2016-11-07T23:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      },
      {
        "rec.javaScriptTime": [
          "2021-06-18T12:25:34Z"
        ],
        "holdingsitem.status": ["Available"],
        "holdingsitem.agencyId": [ "125420" ],
        "holdingsitem.bibliographicOwnerAgencyId": ["125420"],
        "rec.bibliographicRecordId": [ "27669726" ],
        "rec.trackingId": ["ja7-ja7-ja7" ],
        "holdingsitem.callNumber": [ ""  ],
        "holdingsitem.bibliographicRecordId": [ "27669726" ]
      },
      {
        "rec.trackingId": ["", "bb613be6-86ae-4caa-9639-4198865227f2"],
        "holdingsitem.note": [""],
        "holdingsitem.branch": ["Horsens Bibliotek"],
        "holdingsitem.itemId": ["3480445642"],
        "holdingsitem.status": ["Decommissioned"],
        "holdingsitem.issueId": [""],
        "holdingsitem.agencyId": ["761500"],
        "holdingsitem.location": ["-"],
        "holdingsitem.issueText": [""],
        "holdingsitem.department": ["Voksen"],
        "holdingsitem.subLocation": ["Romaner"],
        "holdingsitem.readyForLoan": ["3"],
        "rec.bibliographicRecordId": ["23645564"],
        "holdingsitem.accessionDate": ["2001-12-04T00:00:00.000Z"],
        "holdingsitem.circulationRule": ["Alm.lån"],
        "holdingsitem.expectedDelivery": ["2016-11-07T23:00:00Z"],
        "holdingsitem.bibliographicRecordId": ["23645564"]
      }
    ],
    trackingId: ""
  }
];

let produceWrapper = store =>
  mount(
    <Provider store={store}>
      <RelatedHoldingsExplorer />
    </Provider>
  );

describe("RelatedHoldingsExplorer properly displays based on global state", () => {
  let sagaTester;
  let wrapper;
  // Set up new Redux store for each test
  beforeEach(() => {
    sagaTester = new SagaTester({ reducers });
    sagaTester.start(ourSaga);
    wrapper = produceWrapper(sagaTester.store);
  });
  test("Displays error if related holdings error happened", () => {
    let errorMessage = "HUGE ERROR!";
    sagaTester.dispatch(pullFailed(new Error(errorMessage)));
    wrapper.update();
    expect(wrapper.text()).toContain(errorMessage);
  });
  test("Displays loading component when selecting a bib record", () => {
    // Selecting an element will start a network request for the related holdings
    sagaTester.dispatch(
      selectBibRecord({ bibliographicRecordId: "4321", agencyId: "870970" })
    );
    wrapper.update();
    // Using mount to 'fold out' all children, which is necessary with store etc.
    expect(wrapper.find(Loading)).toHaveProperty("length", 1);
  });
  test("Display all related holdings items in global state", () => {
    let initialState = produceInitialState();
    initialState.relatedHoldings = [
      {
        agencyId: "",
        trackingId: "",
        commitWithin: ""
        // missing index keys, ensures we can handle missing fields
      },
      {
        indexKeys: [],
        trackingId: "",
        commitWithin: ""
      },
      {
        agencyId: "",
        indexKeys: [],
      }
    ];
    let store = configureStore({ relatedHoldings: initialState });
    const wrapper = produceWrapper(store);
    console.log(wrapper.text());
    expect(wrapper.find(RelatedHoldingsItem)).toHaveProperty(
      "length",
      initialState.relatedHoldings.length
    );
  });
  test("RelatedHoldingsItem component shows header fields with input", () => {
    let initialState = produceInitialState();
    let agencyId = "unique:agencyId";
    let trackingId = "unique:trackingId";
    initialState.relatedHoldings = [
      {
        agencyId: agencyId,
        trackingId: trackingId
      }
    ];
    let store = configureStore({ relatedHoldings: initialState });
    const wrapper = produceWrapper(store);
    let text = wrapper.text();
    expect(text).toContain(agencyId);
    // These are no longer shown, as they are not important to users
    //expect(text).toContain(trackingId);
  });
  test("Related holdings show the correct number of related holdings items", () => {
    sagaTester.dispatch(pullSuccess(testHoldingsItems));
    wrapper.update();
    expect(wrapper.find(RelatedHoldingsItem)).toHaveProperty(
      "length",
      testHoldingsItems.length
    );
  });
  test("Related holdings show correct number of manifestations, with correct header fields", () => {
    sagaTester.dispatch(pullSuccess(testHoldingsItems));
    wrapper.update();
    expect(wrapper.find(Manifestation)).toHaveProperty(
      "length",
      // Summing up length of all index keys
      testHoldingsItems.reduce((s, rh) => s + rh.indexKeys.length, 0)
    );
  });
  test("When expanded, manifestations show correct number of parents and elements", () => {
    sagaTester.dispatch(pullSuccess(testHoldingsItems));
    wrapper.update();
    let manis = wrapper.find(Manifestation);
    let mani = manis.first();
    expect(wrapper.find(ManifestationParentElement)).toHaveProperty(
      "length",
      0
    );
    expect(wrapper.find(ManifestationHeader)).toHaveProperty("length", 0);
    mani.find(".toggle-manifestation-keys").simulate("click");
    wrapper.update();
    expect(wrapper.find(ManifestationParentElement)).toHaveProperty(
      "length",
      2
    );
    expect(wrapper.find(ManifestationHeader)).toHaveProperty("length", 2);
  });
});
