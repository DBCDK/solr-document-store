import {
    PULL_RELATED_HOLDINGS,
    PULL_RELATED_HOLDINGS_SUCCESS} from '../actions/related_holdings';
import update from 'immutability-helper';

const initialState = {
    hasBeenPulled: false,
    relatedHoldings: [],
    selectedHoldingIndex: 0
};

export default function relatedHoldings(state = initialState, action = {}) {
    switch (action.type){
        case PULL_RELATED_HOLDINGS:
            return update(state,{
                hasBeenPulled: {$set: false}
            });
        case PULL_RELATED_HOLDINGS_SUCCESS:
            return update(state,{
                hasBeenPulled: {$set: true},
                relatedHoldings: action.result,
                // Only looking at one item for now
                selectedHoldingIndex: 0
            });
        default:
            return state;
    }
}
