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
            // handling invalid actions
            let validAction = !!(action.item) &&
                (action.item.bibliographicRecordId !== undefined) &&
                (action.item.agencyId !== undefined);
            action.item = (action.item) ? action.item : {
                bibliographicRecordId: null,
                agencyId: null
            };
            let actionBibId = action.item.bibliographicRecordId;
            let actionAgencyId = action.item.agencyId;
            // If values are undefined, set to null instead
            let bibRecordId = (validAction && actionBibId) ? actionBibId : null;
            let agencyId = (validAction && actionAgencyId) ? actionAgencyId : null;
            return update(state,{
                loading: {$set: validAction},
                errorMessage: {$set: ''},
                selectedBibRecordId: {$set: bibRecordId},
                selectedBibAgencyId: {$set: agencyId}
            });
        case PULL_RELATED_HOLDINGS_SUCCESS:
            // Handling invalid actions
            let result = (action.result && Array.isArray(action.result)) ? action.result : [];
            return update(state,{
                loading: {$set: false},
                errorMessage: {$set: ''},
                relatedHoldings: {$set: result},
            });
        case PULL_RELATED_HOLDINGS_FAILED:
            // Handling invalid action, will ignored
            let message = (action.message && (typeof action.message === 'string')) ? action.message : '';
            return update(state,{
                loading: {$set: false},
                errorMessage: {$set: message}
            });
        default:
            return state;
    }
}
