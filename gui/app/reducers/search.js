import {
  SEARCH_SUCCESS,
  SEARCH_FAILED,
  SEARCH_BIB_RECORD_ID,
  SEARCH_SELECT_PARAMETER
} from "../actions/searching";
import update from "immutability-helper";
import { SEARCH_BIB_ID, SEARCH_REPO_ID } from "../api";

const initialState = {
  searchPending: false,
  searchTerm: "",
  searchErrorMessage: "",
  searchParameter: SEARCH_BIB_ID,
  searchResults: []
};

export default function search(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      return update(state, {
        searchPending: { $set: false },
        searchResults: { $set: action.bibPosts },
        searchErrorMessage: { $set: "" }
      });
    case SEARCH_FAILED:
      return update(state, {
        searchPending: { $set: false },
        searchErrorMessage: { $set: action.message }
      });
    case SEARCH_BIB_RECORD_ID:
      return update(state, {
        searchPending: { $set: true },
        searchTerm: { $set: action.searchTerm },
        searchErrorMessage: { $set: "" }
      });
    case SEARCH_SELECT_PARAMETER:
      return update(state, {
        searchParameter: { $set: action.parameter }
      })
    default:
      return state;
  }
}
