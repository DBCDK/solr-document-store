import configureStore from "../app/reducers/configure_store";
import { selectBibRecord } from "../app/actions/global";
import * as relatedHoldingsActions from "../app/actions/related_holdings";
import SagaTester from 'redux-saga-tester';
import reducers from "../app/reducers";
import ourSaga from '../app/sagas';

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
    fetch.mockResponse(JSON.stringify({
        result: [
          {
            bibliographicRecordId: "4321"
          }
        ]
      }
    ));
    sagaTester.dispatch(
      selectBibRecord({
        bibliographicRecordId: "4321",
        agencyId: "1234"
      })
    );
    await sagaTester.waitFor(relatedHoldingsActions.PULL_RELATED_HOLDINGS_SUCCESS);
    expect(sagaTester.getState().relatedHoldings.relatedHoldings[0]).toEqual({
      bibliographicRecordId: "4321"
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
    await sagaTester.waitFor(relatedHoldingsActions.PULL_RELATED_HOLDINGS_FAILED);
    expect(sagaTester.getState().relatedHoldings.errorMessage).toEqual(
      "We had an error"
    );
  });
});
