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
  ASYNC_JOB_ERROR
} from "../actions/async_job";
import update from "immutability-helper";

export const MAX_LOG_SIZE = 5;

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
  websocketErrorMessage: "",
  asyncJobErrorMessage: "",
  // Has type: Map<UUID,List<String>>, ie. the log lines of each of the jobs we are subscribed to
  logs: new Map()
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
      // TODO clear log for this uuid?
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
      action.jobList.forEach(j => jobs.set(j.uuid, j.name));
      return update(state, {
        runningJobs: { $set: jobs }
      });
    case APPEND_LOG:
      // TODO check log is not to long, else use $unshift
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
        runningJobs: { $add: [[action.uuid, action.name]] }
      });
    case JOB_FINISHED:
      // TODO if we are subscribed to the finished job, unsubscribe automatically,
      // or do something that makes the UI consistent. We will also receive an
      // unsubscribe action shortly after, but this should not change anything in the store.
      //let name = state.runningJobs.get(action.uuid);
      return update(state, {
        runningJobs: { $remove: [action.uuid] },
        finishedJobs: { $push: [{ uuid: action.uuid, name: action.name }] }
      });
    case WEBSOCKET_ERROR:
      // TODO reset all loaders? We don't know if message was sent if we reconnect
      return update(state, {
        websocketErrorMessage: { $set: action.message }
      });
    // TODO figure out if we can do it on uuid level
    case ASYNC_JOB_ERROR:
      return update(state, {
        asyncJobsPending: { $set: false },
        asyncJobErrorMessage: { $set: action.message }
      });
    default:
      return state;
  }
}
