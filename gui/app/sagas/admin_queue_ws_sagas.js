/**
 * Websocket saga for admin queue, to listen for updates on async job events on the server */
import { call, take, put } from "redux-saga/effects";
import { eventChannel, buffers } from "redux-saga";
import {
  REQUEST_SUBSCRIBE,
  REQUEST_UNSUBSCRIBE,
  websocketError
} from "../actions/async_job";

export const WEBSOCKET_ACTION_BUFFER_SIZE = 100;

let ws = null;

// Creating event channel that takes external/browser related "events" and translates them into redux actions
function initWebsocket() {
  return eventChannel(emitter => {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("Opening websocket to server...");
      //ws.send("hello server");
      // TODO emit some "we are connected" action
    };

    ws.onerror = error => {
      //console.dir(error);
      emitter(websocketError(error));
    };

    ws.onmessage = e => {
      let msg = null;
      try {
        msg = JSON.parse(e.data);
      } catch (e) {
        console.error(`Error parsing : ${e.data}`);
      }
      if (msg) {
        emitter(msg);
      }
    };

    ws.onclose = e => {
      console.log(e);
    };

    // unsubscribe function
    return () => {
      console.log("Socket off");
      ws.close();
    };
  }, buffers.dropping(WEBSOCKET_ACTION_BUFFER_SIZE));
}

// Listens on the websocket action channel and dispatches them
export default function* wsSagas() {
  const channel = yield call(initWebsocket);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

// TODO consider if this is in an appropriate place?
// Middleware that intercepts certain actions and send them through the websocket
export const socketMiddleware = store => next => action => {
  const result = next(action);
  // Listen for certain actions, and send them via socket if appropriate
  let listenableActions = [REQUEST_SUBSCRIBE, REQUEST_UNSUBSCRIBE];
  if (listenableActions.indexOf(action.type) > -1) {
    ws.send(JSON.stringify(action));
  }
  return result;
};
