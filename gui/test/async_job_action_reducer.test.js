import * as actions from "../app/actions/async_job";
import asyncJobReducer, {
  produceInitialState,
  MAX_LOG_SIZE
} from "../app/reducers/async_job";

describe("Queues action unit tests", () => {
  test("Request subscribe action", () => {
    let desiredUUID = "45-s6-98-1g";
    let desiredAction = {
      type: actions.REQUEST_SUBSCRIBE,
      uuid: desiredUUID
    };
    expect(actions.requestSubscribe(desiredUUID)).toEqual(desiredAction);
  });
  test("Subscribe action", () => {
    let desiredUUID = "45-s6-98-1g";
    let desiredAction = {
      type: actions.SUBSCRIBE,
      uuid: desiredUUID
    };
    expect(actions.subscribe(desiredUUID)).toEqual(desiredAction);
  });
  test("Request unsubscribe action", () => {
    let desiredUUID = "45-s6-98-1g";
    let desiredAction = {
      type: actions.REQUEST_UNSUBSCRIBE,
      uuid: desiredUUID
    };
    expect(actions.requestUnsubscribe(desiredUUID)).toEqual(desiredAction);
  });
  test("Unsubscribe action", () => {
    let desiredUUID = "45-s6-98-1g";
    let desiredAction = {
      type: actions.UNSUBSCRIBE,
      uuid: desiredUUID
    };
    expect(actions.unsubscribe(desiredUUID)).toEqual(desiredAction);
  });
  test("Request async job list action", () => {
    let desiredAction = {
      type: actions.REQUEST_ASYNC_JOB_LIST
    };
    expect(actions.requestAsyncJobList()).toEqual(desiredAction);
  });
  test("Received async job list action", () => {
    let desiredJobList = [{ uuid: "job1" }, { uuid: "job2" }, { uuid: "job3" }];
    let desiredAction = {
      type: actions.RECEIVED_ASYNC_JOB_LIST,
      jobList: desiredJobList
    };
    expect(actions.receivedAsyncJobList(desiredJobList)).toEqual(desiredAction);
  });
  test("Append log action", () => {
    let desiredUUID = "hk3k5-hj5";
    let desiredLog = "Something happened!";
    let desiredAction = {
      type: actions.APPEND_LOG,
      uuid: desiredUUID,
      logLine: desiredLog
    };
    expect(actions.appendLog(desiredUUID, desiredLog)).toEqual(desiredAction);
  });
  test("Request full log action", () => {
    let desiredUUID = "askdgj352l35";
    let desiredFullLog = "A lot of text...";
    let desiredAction = {
      type: actions.REQUEST_FULL_LOG,
      uuid: desiredUUID
    };
    expect(actions.requestFullLog(desiredUUID)).toEqual(desiredAction);
  });
  test("Received full log action", () => {
    let desiredFullLog = "A lot of text...";
    let desiredAction = {
      type: actions.RECEIVED_FULL_LOG,
      log: desiredFullLog
    };
    expect(actions.receivedFullLog(desiredFullLog)).toEqual(desiredAction);
  });
  test("Job started action", () => {
    let desiredUUID = "1234-5678";
    let desiredJob = {
      started: true,
      startedAt: "15:03:82-4124",
      completed: false,
      completedAt: null,
      runnerUUID: "",
      name: "testjob"
    };
    let desiredAction = {
      type: actions.JOB_STARTED,
      uuid: desiredUUID,
      job: desiredJob
    };
    expect(actions.jobStarted(desiredUUID, desiredJob)).toEqual(desiredAction);
  });
  test("Job finished action", () => {
    let desiredUUID = "1234-5678";
    let desiredJob = {
      started: true,
      startedAt: "12:03:82-4124",
      completed: false,
      completedAt: null,
      runnerUUID: "",
      name: "testjob"
    };
    let desiredAction = {
      type: actions.JOB_FINISHED,
      uuid: desiredUUID,
      job: desiredJob
    };
    expect(actions.jobFinished(desiredUUID, desiredJob)).toEqual(desiredAction);
  });
  test("Websocket error action", () => {
    let desiredMessage = "Websocket closed down unexpectedly";
    let desiredAction = {
      type: actions.WEBSOCKET_ERROR
      //message: desiredMessage
    };
    expect(actions.websocketError(new Error(desiredMessage))).toEqual(
      desiredAction
    );
  });
  test("Async job error action", () => {
    let desiredMessage = "Websocket closed down unexpectedly";
    let desiredAction = {
      type: actions.ASYNC_JOB_ERROR,
      message: desiredMessage
    };
    expect(actions.asyncJobError(new Error(desiredMessage))).toEqual(
      desiredAction
    );
  });
});

describe("Async job reducer unit test", () => {
  let state;
  beforeEach(() => {
    state = produceInitialState();
  });
  test("Should return initial state", () => {
    expect(asyncJobReducer(undefined, {})).toEqual(state);
  });
  test("Should ignore undefined action", () => {
    expect(asyncJobReducer(state, undefined)).toEqual(state);
  });
  test("Reducer purity", () => {
    let action = {
      type: actions.JOB_FINISHED,
      uuid: "4jk24j24j",
      name: "test job"
    };
    let newState = asyncJobReducer(state, action);
    expect(newState).not.toBe(state);
    expect(newState).not.toEqual(state);
  });
  test("Should handle request subscribe action", () => {
    let desiredUUID = "75-2356-a423";
    let desiredState = produceInitialState();
    desiredState.subscribePending = true;
    expect(
      asyncJobReducer(state, actions.requestSubscribe(desiredUUID))
    ).toEqual(desiredState);
  });
  test("Should handle subscribe action", () => {
    let desiredUUID = "75-2356-a423";
    let desiredState = produceInitialState();
    desiredState.subscriptions = new Set([desiredUUID]);
    expect(asyncJobReducer(state, actions.subscribe(desiredUUID))).toEqual(
      desiredState
    );
  });
  test("Should handle request unsubscribe action", () => {
    let desiredUUID = "75-23-562-a423";
    let desiredState = produceInitialState();
    desiredState.unsubscribePending = true;
    expect(
      asyncJobReducer(state, actions.requestUnsubscribe(desiredUUID))
    ).toEqual(desiredState);
  });
  test("Should handle unsubscribe action", () => {
    state.subscriptions = new Set(["a", "b", "c"]);
    let desiredState = produceInitialState();
    desiredState.subscriptions = new Set(["a", "c"]);
    expect(asyncJobReducer(state, actions.unsubscribe("b"))).toEqual(
      desiredState
    );
  });
  test("Should handle request async job list action", () => {
    let desiredState = produceInitialState();
    desiredState.asyncJobsPending = true;
    expect(asyncJobReducer(state, actions.requestAsyncJobList())).toEqual(
      desiredState
    );
  });
  test("Should handle received async job list action", () => {
    let desiredState = produceInitialState();
    let receivedJobs = [
      { runnerUUID: "uuid1", name: "name1" },
      { runnerUUID: "uuid2", name: "name2" },
      { runnerUUID: "uuid3", name: "name3" }
    ];
    let desiredRunningJobs = new Map();
    receivedJobs.forEach(j => desiredRunningJobs.set(j.runnerUUID, j.name));
    desiredState.runningJobs = desiredRunningJobs;
    expect(
      asyncJobReducer(state, actions.receivedAsyncJobList(receivedJobs))
    ).toEqual(desiredState);
  });
  test("Should handle append log action", () => {
    let desiredUUID = "2352gf-3734dfg";
    let desiredLog = "Log information...";
    let desiredState = produceInitialState();
    let desiredLogs = new Map();
    desiredLogs.set(desiredUUID, [desiredLog]);
    desiredState.logs = desiredLogs;
    expect(
      asyncJobReducer(state, actions.appendLog(desiredUUID, desiredLog))
    ).toEqual(desiredState);
  });
  test("Should handle append log action capping out keeping tail", () => {
    let desiredUUID = "2352gf-3734dfg";
    let s = produceInitialState();
    let i = 1;
    while (i < MAX_LOG_SIZE + 10) {
      s = asyncJobReducer(s, actions.appendLog(desiredUUID, "" + i));
      i += 1;
    }
    let resultingLog = s.logs.get(desiredUUID);
    // Checking log has correct size
    expect(resultingLog.length).toEqual(MAX_LOG_SIZE);
    // Checking that first logs were pushed out, and only tail remains
    resultingLog.forEach((l, i) => expect(l).toEqual("" + (i + 10)));
  });
  test("Should handle request full log action", () => {
    let desiredUUID = "gh2346h6-3734dfg";
    let desiredState = produceInitialState();
    desiredState.fullLogPending = true;
    expect(asyncJobReducer(state, actions.requestFullLog(desiredUUID))).toEqual(
      desiredState
    );
  });
  test("Should handle received full log action", () => {
    let fullLog = "WOW!";
    let desiredState = produceInitialState();
    desiredState.fullLog = fullLog;
    expect(asyncJobReducer(state, actions.receivedFullLog(fullLog))).toEqual(
      desiredState
    );
  });
  test("Should handle job started action", () => {
    let desiredUUID = "d5j29035-fhg92";
    let desiredName = "test-jobb";
    let desiredState = produceInitialState();
    desiredState.runningJobs.set(desiredUUID, desiredName);
    expect(
      asyncJobReducer(state, actions.jobStarted(desiredUUID, desiredName))
    ).toEqual(desiredState);
  });
  test("Should handle job finished action", () => {
    let desiredUUID = "d5j29035-fhg92";
    let desiredJob = {
      started: true,
      startedAt: "12:03:82-4124",
      completed: false,
      completedAt: null,
      runnerUUID: "",
      name: "testjob"
    };
    // Make sure it is removed from running jobs
    state.runningJobs.set(desiredUUID, desiredJob);
    let desiredState = produceInitialState();
    desiredState.finishedJobs.push({ uuid: desiredUUID, job: desiredJob });
    expect(
      asyncJobReducer(state, actions.jobFinished(desiredUUID, desiredJob))
    ).toEqual(desiredState);
  });
  test("Should handle websocket error action", () => {
    //let desiredMessage = "Something went wrong with the websocket...";
    // Ensure these are unset
    state.subscribePending = true;
    state.unsubscribePending = true;
    let desiredState = produceInitialState();
    desiredState.websocketError = true;
    //desiredState.websocketErrorMessage = desiredMessage;
    expect(asyncJobReducer(state, actions.websocketError())).toEqual(
      desiredState
    );
  });
  test("Should handle async job error action", () => {
    // Ensure loading is unset if error occurs
    state.asyncJobsPending = true;
    let desiredMessage = "Something went wrong with retreiving async jobs...";
    let desiredState = produceInitialState();
    desiredState.asyncJobErrorMessage = desiredMessage;
    expect(
      asyncJobReducer(state, actions.asyncJobError(new Error(desiredMessage)))
    ).toEqual(desiredState);
  });
});
