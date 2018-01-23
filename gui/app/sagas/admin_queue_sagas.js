import { call, fork, takeLatest, select, put, all } from "redux-saga/effects";
import * as queueActions from "../actions/queues";

export default function* root() {
  yield all([
    //fork(watchSearch),
  ]);
}
