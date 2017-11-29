import { call, fork, takeEvery, takeLatest, select, put, all } from 'redux-saga/effects';
import * as actions from '../actions';
import api from '../api';

function* fetchBibliographicPost(action) {
    console.log("fetching bibliographic post: "+action.searchTerm);
    try {
        const bibPosts = yield call(api.fetchBibliographicPost, action.searchTerm);
        console.log(bibPosts);
        yield put(actions.searchSuccess(bibPosts));
    } catch (e) {
        console.log("We had the error: "+e.message);
        yield put(actions.searchFailed(e));
    }
}

export function* watchSearch() {
    yield takeEvery(actions.SEARCH_BIB_RECORD_ID,fetchBibliographicPost)
}

export default function* root() {
    yield all([
        fork(watchSearch)
    ])
}