import { call, fork, takeLatest, select, put, all } from 'redux-saga/effects';
import * as searchActions from '../actions/searching';
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

export function* watchSearch() {
    yield takeLatest(searchActions.SEARCH_BIB_RECORD_ID,fetchBibliographicPost)
}

export default function* root() {
    yield all([
        fork(watchSearch)
    ])
}