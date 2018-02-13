import { SELECT_BIB_RECORD, selectBibRecord } from "../app/actions/global";
import globalReducer, {
  produceInitialState
} from "../app/reducers/docstore_gui_global";

let desiredItem = {
  bibliographicRecordId: "31582395",
  agencyId: "31589235",
  trackingId: "35235-235sdfgh",
  producerVersion: "3578923-wrwtsdtr:23589",
  deleted: false
};

describe("Docstore gui global action unit test", () => {
  test("Select bibliographic item action", () => {
    let desiredAction = {
      type: SELECT_BIB_RECORD,
      item: desiredItem
    };
    expect(selectBibRecord(desiredItem)).toEqual(desiredAction);
  });
});

describe("Docstore gui global reducer unit test", () => {
  let state;
  beforeEach(() => {
    state = produceInitialState();
  });
  test("Should return initial state", () => {
    expect(globalReducer(undefined, {})).toEqual(state);
  });
  test("Should ignore undefined action", () => {
    expect(globalReducer(state, undefined)).toEqual(state);
  });
  test("Should handle select bibliographic item", () => {
    let desiredState = produceInitialState();
    desiredState.selectedBibRecordId = desiredItem.bibliographicRecordId;
    desiredState.selectedBibAgencyId = desiredItem.agencyId;
    expect(globalReducer(state, selectBibRecord(desiredItem))).toEqual(
      desiredState
    );
  });
  test("Invalid input with select bib record action", () => {
    // Test no item in action
    let noItemAction = {
      type: SELECT_BIB_RECORD
    };
    expect(globalReducer(state, noItemAction)).toEqual(state);
    // Test no bibliographicRecordId in action
    let noBibIdAction = {
      type: SELECT_BIB_RECORD,
      item: {
        agencyId: "1234"
      }
    };
    expect(globalReducer(state, noBibIdAction)).toEqual(state);

    // Test no bibliographicAgencyId in action
    let noAgencyIdAction = {
      type: SELECT_BIB_RECORD,
      item: {
        bibliographicRecordId: "4321"
      }
    };
    expect(globalReducer(state, noAgencyIdAction)).toEqual(state);

    // Test item is there, but no bibliographicRecordId OR bibliographicAgencyId
    let neitherIdsAction = {
      type: SELECT_BIB_RECORD,
      item: {
        producerVersion: "ag:19",
        deleted: true
      }
    };
    expect(globalReducer(state, neitherIdsAction)).toEqual(state);
  });
});
