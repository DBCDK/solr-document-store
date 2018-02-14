import search from "./search";
import filter from "./filter";
import relatedHoldings from "./related_holdings";
import global from "./docstore_gui_global";
import { combineReducers } from "redux";

export default combineReducers({ global, search, filter, relatedHoldings });
