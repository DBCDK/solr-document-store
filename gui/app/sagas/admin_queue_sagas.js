import { call, fork, takeLatest, select, put, all } from "redux-saga/effects";
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

export function* watchPullQueueRules() {
  yield takeLatest(queueActions.PULL_QUEUE_RULES, fetchQueueRules);
}

export default function* root() {
  yield all([fork(watchPullQueueRules)]);
}
