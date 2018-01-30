/**
 * Websocket saga for admin queue, to listen for updates on async job events on the server */
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

let ws = null;

function initWebsocket() {
  return eventChannel(emitter => {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("opening...");
      //ws.send("hello server");
    };

    ws.onerror = error => {
      console.log("WebSocket error " + error);
      console.dir(error);
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
        /*const { payload: book } = msg;

        const channel = msg.channel;
        switch (channel) {
          case "ADD_BOOK":
            return emitter({ type: ADD_BOOK, book });
          case "REMOVE_BOOK":
            return emitter({ type: REMOVE_BOOK, book });
          default:
          // nothing to do
        }*/
      }
    };

    // unsubscribe function
    return () => {
      console.log("Socket off");
    };
  });
}

export default function* wsSagas() {
  const channel = yield call(initWebsocket);

  while (true) {
    const action = yield take(channel);
    console.dir(action);
    yield put(action);
  }
}

// TODO consider if this is in an appropriate place?
export const socketMiddleware = store => next => action => {
  const result = next(action);
  // Listen for certain actions, and send them via socket if appropriate
  let listenableActions = ["Subscribe", "Unsubscribe"];
  if (listenableActions.indexOf(action.type) > -1) {
    ws.send(JSON.stringify(action));
  }
  return result;
};
