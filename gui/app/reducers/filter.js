import { SELECT_BIB_RECORD } from '../actions/filtering';
import update from 'immutability-helper';

const initialState = {
    selectedItem: {}
};

export default function filter(state = initialState,action = {}) {
    switch (action.type){
        case SELECT_BIB_RECORD:
            return update(state,{
                selectedItem: {$set: action.item}
            });
        default:
            return state;
    }
}