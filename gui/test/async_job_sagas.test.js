import * as asyncJobActions from "../app/actions/async_job";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/admin_queue_root_reducer";
import { socketMiddleware } from "../app/sagas/admin_queue_ws_sagas";
import ourSaga from "../app/sagas/admin_queue_ws_sagas";
import { Server } from "mock-socket";

describe("Queue saga integration test", () => {
  let sagaTester;
  let mockServer;
  beforeAll(async () => {
    mockServer = new Server("ws://localhost:8080/ws");
  });
  // Set up new Redux store for each test
  beforeEach(async () => {
    sagaTester = new SagaTester({ reducers, middlewares: [socketMiddleware] });
    sagaTester.start(ourSaga);
  });
  test("Subscribing succeeds", async () => {
    let desiredUUID = "53fs-5se69-asw";
    // Respond with successful subscribe
    mockServer.on("message", message => {
      console.log("server received", message);
      expect(JSON.parse(message).uuid).toEqual(desiredUUID);
      mockServer.send(JSON.stringify(asyncJobActions.subscribe(desiredUUID)));
    });
    sagaTester.dispatch(asyncJobActions.requestSubscribe(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.SUBSCRIBE, true);
    expect(sagaTester.getState().asyncJob.subscriptions).toEqual(
      new Set([desiredUUID])
    );
  });
  test("Subscribing fails", async () => {
    let desiredUUID = "53fs-5se69-asw";
    mockServer.on("message", message => {
      mockServer.simulate("error");
    });
    sagaTester.dispatch(asyncJobActions.requestSubscribe(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.WEBSOCKET_ERROR, true);
  });
  test("Unsubscribing succeeds", async () => {});
  test("Unsubscribing fails", async () => {});
  test("Getting async job list succeeds", async () => {});
  test("Getting async job list fails", async () => {});
  test("Receiving append log actions of subscribed job", async () => {});
  test("Getting full log succeeds", async () => {});
  test("Getting full log fails", async () => {});
  test("Job starts and finish", async () => {});
  test("Job starts, is subscribed and finishes", async () => {});
  test("Job finishes without frontend knowing it started", async () => {});
});
