import {
    PULL_RELATED_HOLDINGS,
    PULL_RELATED_HOLDINGS_SUCCESS,
    PULL_RELATED_HOLDINGS_FAILED} from '../actions/related_holdings';
import { SELECT_BIB_RECORD } from '../actions/global';
import update from 'immutability-helper';

const initialState = {
    loading: false,
    relatedHoldings: [],
    errorMessage: '',
    selectedBibRecordId: null,
    selectedBibAgencyId: null
};

export default function relatedHoldings(state = initialState, action = {}) {
    switch (action.type){
        case SELECT_BIB_RECORD:
            return update(state,{
                loading: {$set: true},
                errorMessage: {$set: ''},
                selectedBibRecordId: {$set: action.item.bibliographicRecordId},
                selectedBibAgencyId: {$set: action.item.agencyId}
            });
        case PULL_RELATED_HOLDINGS:
            return update(state,{
                loading: {$set: true}
            });
        case PULL_RELATED_HOLDINGS_SUCCESS:
            return update(state,{
                loading: {$set: false},
                errorMessage: {$set: ''},
                relatedHoldings: {$set: action.result},
            });
        case PULL_RELATED_HOLDINGS_FAILED:
            return update(state,{
                loading: {$set: false},
                errorMessage: {$set: action.message}
            });
        default:
            return state;
    }
}
