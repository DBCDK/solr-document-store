import * as actions from "../app/actions/related_resources";
import { SELECT_BIB_RECORD, selectBibRecord } from "../app/actions/global";
import relatedResourceReducer, {
  produceInitialState
} from "../app/reducers/related_resources";

describe("Related resources action unit tests", () => {
  test("Pull related resources successful action", () => {
    let result = [{ bibliographicRecordId: "11111111", agencyId: "870970" }];
    let desiredAction = {
      type: actions.PULL_RELATED_RESOURCES_SUCCESS,
      result
    };
    expect(actions.pullSuccess(result)).toEqual(desiredAction);
  });
  test("Pull related holding failed action", () => {
    let exception = new Error("error message");
    let desiredAction = {
      type: actions.PULL_RELATED_RESOURCES_FAILED,
      message: exception.message
    };
    expect(actions.pullFailed(exception)).toEqual(desiredAction);
  });
});

describe("Related resource reducer unit tests", () => {
  let state;
  beforeEach(() => {
    state = produceInitialState();
  });
  test("Should return initial state", () => {
    expect(relatedResourceReducer(undefined, {})).toEqual(state);
  });
  test("Should ignore undefined action", () => {
    expect(relatedResourceReducer(state, undefined)).toEqual(state);
  });
  test("Reducer purity", () => {
    let action = {
      type: actions.PULL_RELATED_RESOURCES_FAILED,
      message: "Soo..."
    };
    let newState = relatedResourceReducer(state, action);
    expect(newState).not.toBe(state);
    expect(newState).not.toEqual(state);
  });
  test("Should handle select bibliographic record id", () => {
    let item = {
      bibliographicRecordId: "4321",
      agencyId: "1234",
      deleted: false,
      trackingId: "ag:10"
    };
    let desiredState = produceInitialState();
    desiredState.loading = true;
    expect(relatedResourceReducer(state, selectBibRecord(item))).toEqual(
      desiredState
    );
  });
  test("Should handle pull successful", () => {
    let result = [
      {
        agencyId: 870970,
        bibliographicRecordId: "11111111",
        field: "hasCoverUrl",
        value: true
      }
    ];
    // Testing the reducer resets loading state
    state.loading = true;
    let desiredState = produceInitialState();
    desiredState.resources = result;
    desiredState.loading = false;
    expect(relatedResourceReducer(state, actions.pullSuccess(result))).toEqual(
      desiredState
    );
  });
  test("Should handle pull failed", () => {
    let message = "Noooo!!!";
    // Testing the reducer resets loading state
    state.loading = true;
    let desiredState = produceInitialState();
    desiredState.errorMessage = message;
    desiredState.loading = false;
    expect(
      relatedResourceReducer(state, actions.pullFailed(new Error(message)))
    ).toEqual(desiredState);
  });
});
