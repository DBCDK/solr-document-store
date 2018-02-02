import queues from "./queues";
import asyncJob from "./async_job";
import { combineReducers } from "redux";

export default combineReducers({ queues, asyncJob });
