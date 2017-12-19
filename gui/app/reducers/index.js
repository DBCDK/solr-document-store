//import isLoggedIn from './login';
import search from "./search";
import filter from "./filter";
import relatedHoldings from "./related_holdings";
import { combineReducers } from "redux";

export default combineReducers({ search, filter, relatedHoldings });
