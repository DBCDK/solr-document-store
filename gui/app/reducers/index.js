//import isLoggedIn from './login';
import global from "./docstore_gui_global";
import search from "./search";
import filter from "./filter";
import relatedHoldings from "./related_holdings";
import relatedResources from "./related_resources";
import { combineReducers } from "redux";

export default combineReducers({
  global,
  search,
  filter,
  relatedHoldings,
  relatedResources
});
