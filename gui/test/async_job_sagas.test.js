import * as asyncJobActions from "../app/actions/async_job";
import SagaTester from "redux-saga-tester";
import reducers from "../app/reducers/admin_queue_root_reducer";
import { socketMiddleware } from "../app/sagas/admin_queue_ws_sagas";
import asyncJobWebsocketSaga from "../app/sagas/admin_queue_ws_sagas";
import adminQueueSaga from "../app/sagas/admin_queue_sagas";
import { Server } from "mock-socket";

let asyncJobList = [
  {
    running: true,
    started: true,
    canceled: false,
    completed: false,
    startedAt: "2018-02-04t11:45:23:02.110z",
    completedAt: "2018-02-04t15:28:23:02.110z",
    name: "testjob",
    runnerUUID: "124ghd3-r6346fb-463jhg"
  },
  {
    running: false,
    started: true,
    canceled: false,
    completed: true,
    startedAt: "2018-01-30t08:21:53:52.110z",
    completedAt: "2018-01-30t15:31:52:41.110z",
    name: "testjob",
    runnerUUID: "258g8w-2358g8dvb-asg293"
  }
];

describe("Async job saga integration test", () => {
  let sagaTester;
  let mockServer;
  // Set up new Redux store for each test
  beforeEach(async () => {
    mockServer = new Server("ws://localhost:8080/ws");
    sagaTester = new SagaTester({ reducers, middlewares: [socketMiddleware] });
    sagaTester.start(asyncJobWebsocketSaga);
    // Contains saga related to retrieving async job list, since it is a REST call
    sagaTester.start(adminQueueSaga);
  });
  test("Subscribing succeeds", async done => {
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
    mockServer.stop(() => done());
  });
  test("Subscribing fails", async done => {
    let desiredUUID = "53fs-5se69-asw";
    mockServer.on("message", message => {
      mockServer.simulate("error");
    });
    sagaTester.dispatch(asyncJobActions.requestSubscribe(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.WEBSOCKET_ERROR, true);
    mockServer.stop(done);
  });
  test("Unsubscribing succeeds", async done => {
    let desiredUUID = "53fs-5se69-asw";
    sagaTester.getState().asyncJob.subscriptions = new Set([
      desiredUUID,
      "a",
      "b"
    ]);
    // Respond with successful subscribe
    mockServer.on("message", message => {
      console.log("server received", message);
      mockServer.send(JSON.stringify(asyncJobActions.unsubscribe(desiredUUID)));
    });
    sagaTester.dispatch(asyncJobActions.requestUnsubscribe(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.UNSUBSCRIBE, true);
    expect(sagaTester.getState().asyncJob.subscriptions).toEqual(
      new Set(["a", "b"])
    );
    mockServer.stop(done);
  });
  test("Unsubscribing fails", async done => {
    let desiredUUID = "53fs-5se69-asw";
    mockServer.on("message", message => {
      mockServer.simulate("error");
    });
    sagaTester.dispatch(asyncJobActions.requestUnsubscribe(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.WEBSOCKET_ERROR, true);
    mockServer.stop(done);
  });
  test("Getting async job list succeeds", async done => {
    fetch.mockResponse(JSON.stringify(asyncJobList));
    sagaTester.dispatch(asyncJobActions.requestAsyncJobList());
    await sagaTester.waitFor(asyncJobActions.RECEIVED_ASYNC_JOB_LIST, true);
    expect(
      Array.from(sagaTester.getState().asyncJob.runningJobs.values())
    ).toEqual(asyncJobList.map(j => j.name));
    mockServer.stop(done);
  });
  test("Getting async job list fails", async done => {
    let errorMessage = "SOme error occurred";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(asyncJobActions.requestAsyncJobList());
    await sagaTester.waitFor(asyncJobActions.ASYNC_JOB_ERROR, true);
    expect(sagaTester.getState().asyncJob.asyncJobErrorMessage).toEqual(
      errorMessage
    );
    mockServer.stop(done);
  });
  test("Receiving append log actions of subscribed job", async done => {
    let desiredUUID = "234234";
    let logs = ["log message 1", "log message 2"];
    // Setting initial state as subscribed
    sagaTester.getState().asyncJob.subscriptions = new Set([desiredUUID]);
    mockServer.on("connection", server => {
      mockServer.send(
        JSON.stringify(asyncJobActions.appendLog(desiredUUID, logs[0]))
      );
      mockServer.send(
        JSON.stringify(asyncJobActions.appendLog(desiredUUID, logs[1]))
      );
    });
    // Verifying 2 logs were received
    await sagaTester.waitFor(asyncJobActions.APPEND_LOG);
    expect(sagaTester.getState().asyncJob.logs.get(desiredUUID)).toEqual(logs);
    mockServer.stop(done);
  });
  test("Getting full log succeeds", async done => {
    let desiredUUID = "235gk2-23tew";
    let fullLog = "A lot of things happened...";
    fetch.mockResponse(fullLog);
    sagaTester.dispatch(asyncJobActions.requestFullLog(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.RECEIVED_FULL_LOG, true);
    expect(sagaTester.getState().asyncJob.fullLog).toEqual(fullLog);
    mockServer.stop(done);
  });
  test("Getting full log fails", async done => {
    let desiredUUID = "235gf235";
    let errorMessage = "Cannot get full log";
    fetch.mockReject(new Error(errorMessage));
    sagaTester.dispatch(asyncJobActions.requestFullLog(desiredUUID));
    await sagaTester.waitFor(asyncJobActions.ASYNC_JOB_ERROR, true);
    expect(sagaTester.getState().asyncJob.asyncJobErrorMessage).toEqual(
      errorMessage
    );
    mockServer.stop(done);
  });
  test("Job starts and finish", async done => {
    let startedUUID = "23582368923682368";
    let startedName = "testjob10";
    mockServer.on("connection", server => {
      mockServer.send(
        JSON.stringify(asyncJobActions.jobStarted(startedUUID, startedName))
      );
    });
    await sagaTester.waitFor(asyncJobActions.JOB_STARTED, true);
    expect(sagaTester.getState().asyncJob.runningJobs.get(startedUUID)).toEqual(
      startedName
    );
    mockServer.send(
      JSON.stringify(asyncJobActions.jobFinished(startedUUID, startedName))
    );
    await sagaTester.waitFor(asyncJobActions.JOB_FINISHED);
    expect(sagaTester.getState().asyncJob.runningJobs.get(startedUUID)).toEqual(
      undefined
    );
    expect(sagaTester.getState().asyncJob.finishedJobs).toEqual([
      { uuid: startedUUID, name: startedName }
    ]);
    mockServer.stop(done);
  });
  test("Job starts, is subscribed and finishes", async done => {
    let startedUUID = "23582368923682368";
    let startedName = "testjob10";
    mockServer.on("connection", server => {
      mockServer.send(
        JSON.stringify(asyncJobActions.jobStarted(startedUUID, startedName))
      );
    });
    await sagaTester.waitFor(asyncJobActions.JOB_STARTED, true);
    mockServer.on("message", message => {
      mockServer.send(JSON.stringify(asyncJobActions.subscribe(startedUUID)));
      mockServer.send(
        JSON.stringify(asyncJobActions.jobFinished(startedUUID, startedName))
      );
    });
    sagaTester.dispatch(asyncJobActions.requestSubscribe(startedUUID));
    await sagaTester.waitFor(asyncJobActions.SUBSCRIBE, true);
    await sagaTester.waitFor(asyncJobActions.JOB_FINISHED);
    mockServer.stop(done);
  });
  test("Job finishes without frontend knowing it started", async done => {
    let startedUUID = "23582368923682368";
    let startedName = "testjob10";
    mockServer.on("connection", server => {
      mockServer.send(
        JSON.stringify(asyncJobActions.jobFinished(startedUUID, startedName))
      );
    });
    await sagaTester.waitFor(asyncJobActions.JOB_FINISHED, true);
    expect(sagaTester.getState().asyncJob.finishedJobs).toEqual([
      { uuid: startedUUID, name: startedName }
    ]);
    mockServer.stop(done);
  });
});
