import { call, fork, takeLatest, select, put, all } from 'redux-saga/effects';
import * as searchActions from '../actions/searching';
import * as relatedHoldingsActions from '../actions/related_holdings';
import api from '../api';

export function* fetchBibliographicPost(action) {
    try {
        const bibPosts = yield call(api.fetchBibliographicPost, action.searchTerm);
        yield put(searchActions.searchSuccess(bibPosts.result));
    } catch (e) {
        console.log("We had the error: "+e.message);
        yield put(searchActions.searchFailed(e));
    }
}

export function* pullRelatedHoldings(action) {
    try {
        const holdings = yield call(api.pullRelatedHoldings,action.bibliographicRecordId,action.bibliographicAgencyId);
        yield put(relatedHoldingsActions.pullSuccess(holdings.result));
    } catch (e) {
        console.log("We had the pull error: "+e.message);
        yield put(searchActions.searchFailed(e));
    }
}

export function* watchSearch() {
    yield takeLatest(searchActions.SEARCH_BIB_RECORD_ID,fetchBibliographicPost)
}

export function* watchPullRelatedHoldings() {
    yield takeLatest(relatedHoldingsActions.PULL_RELATED_HOLDINGS,pullRelatedHoldings)
}

export default function* root() {
    yield all([
        fork(watchSearch),
        fork(watchPullRelatedHoldings)
    ])
}