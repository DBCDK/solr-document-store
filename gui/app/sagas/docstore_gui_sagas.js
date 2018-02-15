import { call, fork, takeLatest, select, put, all } from "redux-saga/effects";
import * as searchActions from "../actions/searching";
import * as globalActions from "../actions/global";
import * as relatedHoldingsActions from "../actions/related_holdings";
import api, { SEARCH_BIB_ID, SEARCH_REPO_ID } from "../api";

export const getSearchParameter = state => state.search.searchParameter;

function* fetchBibPost(searchTerm, apiArgs) {
  try {
    apiArgs.pageSize = yield select(state => state.search.searchPageSize);
    const bibPosts = yield call(
      api.fetchBibliographicPost,
      searchTerm,
      apiArgs
    );
    yield put(searchActions.searchSuccess(bibPosts));
  } catch (e) {
    console.log("We had the error: " + e.message);
    yield put(searchActions.searchFailed(e));
  }
}

export function* fetchBibliographicPost(action) {
  // Test to see if colon is in the search term, because then it is a repository ID we must search for
  // instead of a bibliographic record ID
  let parameter = /:/.test(action.searchTerm) ? SEARCH_REPO_ID : SEARCH_BIB_ID;
  // We have to put parameter in store, so the paged fetch request can know what to search for
  yield put(searchActions.selectSearchParameter(parameter));
  yield fetchBibPost(action.searchTerm, { parameter: parameter });
}

export function* fetchBibliographicPostPaged(action) {
  const pageCount = yield select(state => state.search.searchPageCount);
  const searchTerm = yield select(state => state.search.searchTerm);
  const page = action.pageIndex + 1;
  if (
    pageCount >= 1 &&
    pageCount !== -1 &&
    page <= pageCount &&
    searchTerm.length > 0
  ) {
    const parameter = yield select(getSearchParameter);
    yield fetchBibPost(searchTerm, {
      parameter,
      page,
      orderBy: action.orderBy
    });
  }
}

export function* pullRelatedHoldings(action) {
  try {
    let { bibliographicRecordId, agencyId } = action.item;
    const holdings = yield call(
      api.pullRelatedHoldings,
      bibliographicRecordId,
      agencyId
    );
    yield put(relatedHoldingsActions.pullSuccess(holdings.result));
  } catch (e) {
    console.log("We had the pull error: " + e.message);
    yield put(relatedHoldingsActions.pullFailed(e));
  }
}

export function* initialRetrieveBibItem(action) {
  let bibliographicRecordId = action.bibliographicRecordId;
  let bibliographicAgencyId = action.bibliographicAgencyId;
  // TODO first put searchBibItem, then fetch, then put searchBibItemSuccess and then selectBibRecord the item
  try {
    yield put(
      searchActions.searchBibItem(bibliographicRecordId, bibliographicAgencyId)
    );
    let bibItem = yield call(
      api.fetchSpecificBibliographicPost,
      bibliographicRecordId,
      bibliographicAgencyId
    );
    yield put(searchActions.searchBibItemSuccess(bibItem));
    yield put(globalActions.selectBibRecord(bibItem));
  } catch (e) {
    yield put(searchActions.searchBibItemFailed(e));
  }
}

// Keeps URL up to date, so page can be linked
export function* modifyUrl(action) {
  window.history.replaceState(
    "string",
    "Selected record",
    `${window.location.pathname}?key=${encodeURIComponent(
      JSON.stringify({
        bibliographicRecordId: action.item.bibliographicRecordId,
        bibliographicAgencyId: action.item.agencyId
      })
    )}`
  );
}

export function* watchSearch() {
  yield takeLatest(searchActions.SEARCH_BIB_RECORD_ID, fetchBibliographicPost);
}

export function* watchFetchPage() {
  yield takeLatest(
    searchActions.SEARCH_FETCH_PAGE,
    fetchBibliographicPostPaged
  );
}

export function* watchPullRelatedHoldings() {
  yield takeLatest(globalActions.SELECT_BIB_RECORD, pullRelatedHoldings);
}

export function* watchInitialRetrieveBibItem() {
  yield takeLatest(
    searchActions.INITIAL_RETRIEVE_BIB_ITEM,
    initialRetrieveBibItem
  );
}

export function* watchSelectBibRecord() {
  yield takeLatest(globalActions.SELECT_BIB_RECORD, modifyUrl);
}

export default function* root() {
  yield all([
    fork(watchSearch),
    fork(watchPullRelatedHoldings),
    fork(watchFetchPage),
    fork(watchInitialRetrieveBibItem),
    fork(watchSelectBibRecord)
  ]);
}
