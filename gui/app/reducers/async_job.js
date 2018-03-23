import {
  APPEND_LOG,
  REQUEST_FULL_LOG,
  JOB_FINISHED,
  JOB_STARTED,
  REQUEST_ASYNC_JOB_LIST,
  SUBSCRIBE,
  UNSUBSCRIBE,
  REQUEST_SUBSCRIBE,
  REQUEST_UNSUBSCRIBE,
  RECEIVED_ASYNC_JOB_LIST,
  RECEIVED_FULL_LOG,
  WEBSOCKET_ERROR,
  ASYNC_JOB_ERROR,
  ASYNC_JOB_FINISHED_JOB_SORT,
  ASYNC_JOB_FINISHED_JOB_SORT_BY_STARTED,
  ASYNC_JOB_FINISHED_JOB_SORT_BY_EARLIEST
} from "../actions/async_job";
import update from "immutability-helper";

export const MAX_LOG_SIZE = 50;

export const produceInitialState = () => ({
  subscribePending: false,
  unsubscribePending: false,
  // Subset of running jobs, use runningJobs to lookup names
  subscriptions: new Set([]),
  // Has type: Map<String(uuid),String(name)>
  runningJobs: new Map(),
  finishedJobs: [],
  asyncJobsPending: false,
  fullLogPending: false,
  fullLog: "",
  websocketError: false,
  //websocketErrorMessage: "",
  asyncJobErrorMessage: "",
  // Has type: Map<UUID,List<String>>, ie. the log lines of each of the jobs we are subscribed to
  logs: new Map(),
  sortByStarted: true,
  sortByEarliest: true
});

export default function asyncJobReducer(
  state = produceInitialState(),
  action = {}
) {
  switch (action.type) {
    case REQUEST_SUBSCRIBE:
      return update(state, {
        subscribePending: { $set: true }
      });
    case SUBSCRIBE:
      return update(state, {
        subscribePending: { $set: false },
        subscriptions: { $add: [action.uuid] }
      });
    case REQUEST_UNSUBSCRIBE:
      return update(state, {
        unsubscribePending: { $set: true }
      });
    case UNSUBSCRIBE:
      return update(state, {
        unsubscribePending: { $set: false },
        subscriptions: { $remove: [action.uuid] }
      });
    case REQUEST_ASYNC_JOB_LIST:
      return update(state, {
        asyncJobsPending: { $set: true }
      });
    case RECEIVED_ASYNC_JOB_LIST:
      let jobs = new Map();
      let finishedJobs = [];
      action.jobList.forEach(j => {
        if (j.cancelled || j.completed)
          finishedJobs.push({ uuid: j.runnerUUID, job: j });
        else jobs.set(j.runnerUUID, j);
      });
      return update(state, {
        runningJobs: { $set: jobs },
        finishedJobs: { $push: finishedJobs }
      });
    case APPEND_LOG:
      let log = update(state.logs.get(action.uuid) || [], {
        $push: [action.logLine]
      });
      // Ensures log does not get to long
      if (log.length > MAX_LOG_SIZE) {
        log.shift();
      }
      return update(state, { logs: { $add: [[action.uuid, log]] } });
    case REQUEST_FULL_LOG:
      return update(state, {
        fullLogPending: { $set: true }
      });
    case RECEIVED_FULL_LOG:
      return update(state, {
        fullLogPending: { $set: false },
        fullLog: { $set: action.log }
      });
    case JOB_STARTED:
      return update(state, {
        runningJobs: { $add: [[action.uuid, action.job]] }
      });
    case JOB_FINISHED:
      return update(state, {
        runningJobs: { $remove: [action.uuid] },
        subscriptions: { $remove: [action.uuid] },
        finishedJobs: { $push: [{ uuid: action.uuid, job: action.job }] }
      });
    case WEBSOCKET_ERROR:
      return update(state, {
        websocketError: { $set: true },
        unsubscribePending: { $set: false },
        subscribePending: { $set: false }
        //websocketErrorMessage: { $set: action.message }
      });
    // TODO figure out if we can do it on uuid level
    case ASYNC_JOB_ERROR:
      return update(state, {
        asyncJobsPending: { $set: false },
        asyncJobErrorMessage: { $set: action.message }
      });
    case ASYNC_JOB_FINISHED_JOB_SORT:
      return update(state, {
        sortByStarted: { $set: action.sortByStarted },
        sortByEarliest: { $set: action.sortByEarliest }
      });
    case ASYNC_JOB_FINISHED_JOB_SORT_BY_STARTED:
      return update(state, {
        sortByStarted: { $set: action.sortByStarted }
      });
    case ASYNC_JOB_FINISHED_JOB_SORT_BY_EARLIEST:
      return update(state, {
        sortByEarliest: { $set: action.sortByEarliest }
      });
    default:
      return state;
  }
}
