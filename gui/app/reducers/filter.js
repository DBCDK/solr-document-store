import {
    SELECT_BIB_RECORD,
    WHITE_LIST_SELECT_PENDING,
    CONFIRM_WHITE_LIST,
    CLEAR_WHITE_LIST } from '../actions/filtering';
import update from 'immutability-helper';
import converter from '../functions/index_key_converter';

const initialState = {
    selectedItem: {},
    whiteListPending: {},
    whiteListedElements: null
};
update.extend('$auto',(value,object)=> update(object || {},value));

export default function filter(state = initialState,action = {}) {
    switch (action.type){
        case SELECT_BIB_RECORD:
            const newItem = converter(action.item);
            return update(state,{
                selectedItem: {$set: newItem}
            });
        case WHITE_LIST_SELECT_PENDING:
            let newState = update(state,{
                whiteListPending: {
                    $apply: wlp => {
                        let ret = null;
                        Object.keys(action.whiteListedItem).forEach((k)=>{
                            ret = update(wlp,{[k]: {$auto: {$merge: action.whiteListedItem[k]}}})
                        });
                        return (ret !== null) ? ret : wlp;
                    }
                }
            });
            console.log(newState);
            return newState;
        case CONFIRM_WHITE_LIST:
            return update(state,{
                whiteListPending: {$set: {}},
                whiteListedElements: {$set: JSON.parse(JSON.stringify(state.whiteListPending))}
            });
        case CLEAR_WHITE_LIST:
            return update(state,{
                whiteListedElements: {$set: null}
            });
        default:
            return state;
    }
}