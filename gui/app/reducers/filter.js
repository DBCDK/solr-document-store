import {
  WHITE_LIST_SELECT_PENDING,
  CONFIRM_WHITE_LIST,
  CLEAR_WHITE_LIST
} from "../actions/filtering";
import { SELECT_BIB_RECORD } from "../actions/global";
import update from "immutability-helper";
import converter from "../functions/index_key_converter";

const initialState = {
  selectedItem: {},
  whiteListPending: {},
  whiteListedElements: null
};
update.extend("$auto", (value, object) => update(object || {}, value));

export default function filter(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_BIB_RECORD:
      // Selected item my not have index keys
      const item = action.item.indexKeys ? action.item.indexKeys : {};
      const newItem = converter(item);
      return update(state, {
        selectedItem: { $set: newItem }
      });
    case WHITE_LIST_SELECT_PENDING:
      return update(state, {
        whiteListPending: {
          $apply: wlp => {
            let updater = {};
            Object.keys(action.whiteListedItem).forEach(k => {
              if (typeof action.whiteListedItem[k] === "boolean") {
                updater[k] = { $set: action.whiteListedItem[k] };
              } else {
                updater[k] = { $auto: { $merge: action.whiteListedItem[k] } };
              }
            });
            return update(state.whiteListPending, updater);
          }
        }
      });
    case CONFIRM_WHITE_LIST:
      return update(state, {
        whiteListPending: { $set: {} },
        whiteListedElements: {
          $set: JSON.parse(JSON.stringify(state.whiteListPending))
        }
      });
    case CLEAR_WHITE_LIST:
      return update(state, {
        whiteListedElements: { $set: null }
      });
    default:
      return state;
  }
}
