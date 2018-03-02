import {
  call,
  fork,
  takeLatest,
  takeEvery,
  select,
  put,
  all
} from "redux-saga/effects";
import * as queueActions from "../actions/queues";
import * as asyncJobsActions from "../actions/async_job";
import api from "../api";

function* fetchQueueRules(action) {
  try {
    const queueRules = yield call(api.fetchQueueRules);
    yield put(queueActions.pullQueueRulesSuccess(queueRules));
  } catch (e) {
    console.log("We had the error: " + e.message);
    yield put(queueActions.pullQueueRulesFailed(e));
  }
}

//TODO Response is different than {result: [...], pages: n}, DO SOMETHING
function* fetchAsyncJobList(action) {
  try {
    const response = yield call(api.fetchAsyncJobList);
    yield put(asyncJobsActions.receivedAsyncJobList(response));
  } catch (e) {
    yield put(asyncJobsActions.asyncJobError(e));
  }
}

//TODO
function* fetchFullLog(action) {
  try {
    const log = yield call(api.fetchFullLog, action.uuid);
    yield put(asyncJobsActions.receivedFullLog(log));
  } catch (e) {
    yield put(asyncJobsActions.asyncJobError(e));
  }
}

function* createQueueRules(action) {
  try {
    const queueRule = yield call(api.createQueueRule, action.queueRule);
    yield put(queueActions.createQueueRuleSuccess(queueRule));
  } catch (e) {
    console.log("We had the error: " + e.message);
    yield put(queueActions.createQueueRuleFailed(e));
  }
}

function* deleteQueueRules(action) {
  try {
    const queueRule = yield call(api.deleteQueueRule, action.queueRule.queue);
    yield put(queueActions.deleteQueueRuleSuccess(queueRule));
  } catch (e) {
    console.log("We had an error deleting queue: " + e.message);
    yield put(queueActions.deleteQueueRuleFailed(e));
  }
}

function* enqueueJob(action) {
  try {
    const uuid = yield call(
      api.enqueueJob,
      action.path,
      action.param1,
      action.param2
    );
  } catch (e) {
    yield put(asyncJobsActions.asyncJobError(e));
  }
}

export function* watchPullQueueRules() {
  yield takeLatest(queueActions.PULL_QUEUE_RULES, fetchQueueRules);
}

export function* watchCreateQueueRule() {
  yield takeEvery(queueActions.CREATE_QUEUE_RULE, createQueueRules);
}

export function* watchDeleteQueueRule() {
  yield takeEvery(queueActions.DELETE_QUEUE_RULE, deleteQueueRules);
}

export function* watchRequestAsyncJobs() {
  yield takeEvery(asyncJobsActions.REQUEST_ASYNC_JOB_LIST, fetchAsyncJobList);
}

export function* watchRequestFullLog() {
  yield takeEvery(asyncJobsActions.REQUEST_FULL_LOG, fetchFullLog);
}

export function* watchEnqueueJob() {
  yield takeEvery(asyncJobsActions.ENQUEUE_JOB, enqueueJob);
}

export default function* root() {
  yield all([
    fork(watchPullQueueRules),
    fork(watchCreateQueueRule),
    fork(watchDeleteQueueRule),
    fork(watchRequestAsyncJobs),
    fork(watchRequestFullLog),
    fork(watchEnqueueJob)
  ]);
}
