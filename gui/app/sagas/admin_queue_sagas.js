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

function* createQueueRules(action) {
  try {
    const queueRule = yield call(api.createQueueRule, action.queueRule);
    yield put(queueActions.createQueueRuleSuccess(queueRule));
  } catch (e) {
    console.log("We had the error: " + e.message);
    yield put(queueActions.createQueueRuleFailed(e));
  }
}

export function* watchPullQueueRules() {
  yield takeLatest(queueActions.PULL_QUEUE_RULES, fetchQueueRules);
}

export function* watchCreateQueueRule() {
  yield takeEvery(queueActions.CREATE_QUEUE_RULE, createQueueRules);
}

export default function* root() {
  yield all([fork(watchPullQueueRules), fork(watchCreateQueueRule)]);
}