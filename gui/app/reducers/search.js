import {
  SEARCH_SUCCESS,
  SEARCH_FAILED,
  SEARCH_BIB_RECORD_ID,
  SEARCH_SELECT_PARAMETER,
  SEARCH_FETCH_PAGE,
  SEARCH_PAGE_SIZE,
  SEARCH_BIB_ITEM,
  SEARCH_BIB_ITEM_FAILED,
  SEARCH_BIB_ITEM_SUCCESS
} from "../actions/searching";
import update from "immutability-helper";
import { SEARCH_BIB_ID } from "../api";

export const produceInitialState = () => ({
  searchPending: false,
  searchTerm: "",
  searchErrorMessage: "",
  searchParameter: SEARCH_BIB_ID,
  searchPageCount: -1,
  searchPageSize: 10,
  searchResults: []
});

export default function search(state = produceInitialState(), action = {}) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      return update(state, {
        searchPending: { $set: false },
        searchResults: { $set: action.bibPosts.result },
        searchPageCount: { $set: action.bibPosts.pages },
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
    case SEARCH_FETCH_PAGE:
      let canFetch = state.searchPageCount !== -1;
      return update(state, {
        searchPending: { $set: canFetch },
        searchErrorMessage: { $set: "" }
      });
    case SEARCH_PAGE_SIZE:
      return update(state, {
        searchPageSize: { $set: action.pageSize }
      });
    case SEARCH_SELECT_PARAMETER:
      return update(state, {
        searchParameter: { $set: action.parameter }
      });
    case SEARCH_BIB_ITEM:
      return update(state, {
        searchPending: { $set: true },
        searchErrorMessage: { $set: "" }
      });
    case SEARCH_BIB_ITEM_SUCCESS:
      return update(state, {
        searchPending: { $set: false },
        searchResults: { $set: [action.bibItem] },
        searchPageCount: { $set: 1 },
        searchErrorMessage: { $set: "" }
      });
    case SEARCH_BIB_ITEM_FAILED:
      return update(state, {
        searchPending: { $set: false },
        searchErrorMessage: { $set: action.message }
      });
    default:
      return state;
  }
}
