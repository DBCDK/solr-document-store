import { call, fork, takeLatest, select, put, all } from "redux-saga/effects";
import * as searchActions from "../actions/searching";
import * as globalActions from "../actions/global";
import * as relatedHoldingsActions from "../actions/related_holdings";
import api from "../api";

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
  const parameter = yield select(getSearchParameter);
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

export default function* root() {
  yield all([
    fork(watchSearch),
    fork(watchPullRelatedHoldings),
    fork(watchFetchPage)
  ]);
}
