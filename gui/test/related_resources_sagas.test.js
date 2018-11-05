import configureStore from "../app/reducers/docstore_gui_store";
import { selectBibRecord } from "../app/actions/global";
import * as relatedResourcesActions from "../app/actions/related_resources";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/docstore_gui_root_reducer";
import ourSaga from "../app/sagas/docstore_gui_sagas";

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
      JSON.stringify([
        {
          agencyId: 870970,
          bibliographicRecordId: "11111111",
          field: "hasCoverUrl",
          value: true
        }
      ])
    );
    sagaTester.dispatch(
      selectBibRecord({
        bibliographicRecordId: "11111111",
        agencyId: 870970
      })
    );
    await sagaTester.waitFor(
      relatedResourcesActions.PULL_RELATED_RESOURCES_SUCCESS
    );
    expect(sagaTester.getState().relatedResources.resources[0]).toEqual({
      agencyId: 870970,
      bibliographicRecordId: "11111111",
      field: "hasCoverUrl",
      value: true
    });
  });
  test("Error in API should result in error message", async () => {
    fetch.mockReject(new Error("We had an error"));
    sagaTester.dispatch(
      selectBibRecord({
        bibliographicRecordId: "handle error",
        agencyId: "1234"
      })
    );
    await sagaTester.waitFor(
      relatedResourcesActions.PULL_RELATED_RESOURCES_FAILED
    );
    expect(sagaTester.getState().relatedResources.errorMessage).toEqual(
      "We had an error"
    );
  });
});
