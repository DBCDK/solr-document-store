import {
    SEARCH_SUCCESS,
    SEARCH_FAILED,
    SEARCH_BIB_RECORD_ID} from '../actions/searching';
import update from 'immutability-helper';

const initialState = {
    searchPending: false,
    searchTerm: '',
    searchErrorMessage: '',
    searchResults: []
};

export default function search(state = initialState,action = {}) {
    switch (action.type){
        case SEARCH_SUCCESS:
            return update(state,{
                searchPending: {$set: false},
                searchResults: {$set: action.bibPosts},
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
                searchTerm: {$set: action.searchTerm},
                searchErrorMessage: {$set: ''}
            });
        default:
            return state;
    }
}
