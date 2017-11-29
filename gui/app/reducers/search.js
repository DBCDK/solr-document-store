import {
    SEARCH_SUCCESS,
    SEARCH_FAILED,
    SEARCH_BIB_RECORD_ID} from '../actions';
import update from 'immutability-helper';

const initialState = {
    searchPending: false,
    searchTerm: '',
    searchErrorMessage: '',
    searchResult: []
};

export default function search(state = initialState,action = {}) {
    switch (action.type){
        case SEARCH_SUCCESS:
            return update(state,{
                searchPending: {$set: false},
                searchResult: {$set: action.bibPosts},
                searchErrorMessage: {$set: ''}
            });
        case SEARCH_FAILED:
            return update(state,{
                searchPending: {$set: false},
                searchErrorMessage: {$set: action.message}
            });
        case SEARCH_BIB_RECORD_ID:
            return update(state,{
                searchPending: {$set: true},
                searchErrorMessage: {$set: ''}
            });
        default:
            return state;
    }
}
